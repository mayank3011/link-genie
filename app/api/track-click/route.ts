import { NextRequest, NextResponse } from "next/server";
import { geolocation } from "@vercel/functions"; // geolocation must be awaited
import { api } from "@/convex/_generated/api";
import { ClientTrackingData, ServerTrackingEvent } from "@/lib/types";
import { getClient } from "@/convex/client";

export async function POST(request: NextRequest) {
  try {
    const data: ClientTrackingData = await request.json();

    // Ensure geolocation is awaited
    const geo = await geolocation(request);

    const convex = getClient();

    // Get user ID from Convex by profile slug
    const userId = await convex.query(api.lib.usernames.getUserIdBySlug, {
      slug: data.profileUsername,
    });

    if (!userId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const trackingEvent: ServerTrackingEvent = {
      ...data,

      timestamp: new Date().toISOString(),
      profileUserID: userId,
      location: {
        ...geo,
      },
      userAgent: data.userAgent || request.headers.get("user-agent") || "unknown",
    };

    console.log("Sending Event to tinybird:" , trackingEvent);

    // Send to Tinybird if credentials exist
    if (process.env.TINYBIRD_TOKEN && process.env.TINYBIRD_HOST) {
      try {
        const eventForTinybird = {
          timestamp: trackingEvent.timestamp,
          profileUserID: trackingEvent.profileUserID,
          profileUsername: trackingEvent.profileUsername,
          linkId: trackingEvent.linkId,
          linkTitle: trackingEvent.linkTitle,
          linkUrl: trackingEvent.linkUrl,
          userAgent: trackingEvent.userAgent,
          referrer: trackingEvent.referrer || "",
          location: {
            country: trackingEvent.location.country || "",
            region: trackingEvent.location.region || "",
            city: trackingEvent.location.city || "",
            latitude: trackingEvent.location.latitude || "",
            longitude: trackingEvent.location.longitude || "",
          },
        };

        console.log("Event for Tinybird:", JSON.stringify(eventForTinybird, null, 2));

        const tinybirdResponse = await fetch(
          `${process.env.TINYBIRD_HOST}/v0/events?name=link_clicks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.TINYBIRD_TOKEN}`,
            },
            body: JSON.stringify(eventForTinybird),
          }
        );

        if (!tinybirdResponse.ok) {
          const errorText = await tinybirdResponse.text();
          console.error("Tinybird request failed:", errorText);
        } else {
          const responseBody = await tinybirdResponse.json();
          console.log("Tinybird response: Successful", responseBody);

          if (responseBody.quarantined_rows > 0) {
            console.warn("Some rows were quarantined:", responseBody);
          }
        }
      } catch (tinybirdError) {
        console.error("Tinybird tracking failed:", tinybirdError);
      }
    }else{
      console.warn("Tinybird credentials not set, skipping tracking");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking click:", error);
    return NextResponse.json({ error: "Failed to track click" }, { status: 500 });
  }
}
