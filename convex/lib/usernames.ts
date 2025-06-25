// lib/usernames.ts → getUserSlug
import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// 🗣️ Get username/slug for a user (returns custom username or falls back to Clerk ID)
export const getUserSlug = query({
  args: { userId: v.string() },
  returns: v.string(),
  handler: async ({ db }, args) => {
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .unique();

    // Return custom username if exists, otherwise return Clerk ID as fallback
    return usernameRecord?.username || args.userId;
  },
});

export const checkUsernameAvailability = query({
    args: { username: v.string() },
    returns: v.object({
      available: v.boolean(),
      error: v.optional(v.string()),
    }),
    handler: async ({ db }, args) => {
      // 🧪 Validate username format using regex
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(args.username)) {
        return {
          available: false,
          error: "Username can only contain letters, numbers, hyphens, and underscores",
        };
      }
  
      // 🔎 Validate username length
      if (args.username.length < 3 || args.username.length > 30) {
        return {
          available: false,
          error: "Username must be between 3 and 30 characters",
        };
      }
  
      // 🗃️ Check if username already exists
      const existingUsername = await db
        .query("usernames")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .unique();
  
      return { available: !existingUsername };
    },
  });

  // Set/update username for a user
export const setUsername = mutation({
    args: { username: v.string() },
    returns: v.object({ success: v.boolean(), error: v.optional(v.string()) }),
    handler: async ({ db, auth }, args) => {
      const identity = await auth.getUserIdentity();
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      // Validate username format
      const usernameRegex = /^[a-zA-Z0-9_-]+$/;
      if (!usernameRegex.test(args.username)) {
        return {
          success: false,
          error: "Username can only contain letters, numbers, hyphens, and underscores",
        };
      }
  
      if (args.username.length < 3 || args.username.length > 30) {
        return {
          success: false,
          error: "Username must be between 3 and 30 characters",
        };
      }
  
      // Check if username is already taken
      const existingUsername = await db
        .query("usernames")
        .withIndex("by_username", (q) => q.eq("username", args.username))
        .unique();
  
      if (existingUsername && existingUsername.userId !== identity.subject) {
        return { success: false, error: "Username is already taken" };
      }
  
      // Check if user already has a username record
      const currentRecord = await db
        .query("usernames")
        .withIndex("by_user_id", (q) => q.eq("userId", identity.subject))
        .unique();
  
      if (currentRecord) {
        // Update existing record
        await db.patch(currentRecord._id, { username: args.username });
      } else {
        // Create new record
        await db.insert("usernames", {
          userId: identity.subject,
          username: args.username,
        });
      }
  
      return { success: true };
    },
  });

// Get user ID by username/slug
// Get user ID by username/slug (for public page routing)
export const getUserIdBySlug = query({
  args: { slug: v.string() },
  returns: v.union(v.string(), v.null()),
  handler: async ({ db }, args) => {
    // First try to find a custom username
    const usernameRecord = await db
      .query("usernames")
      .withIndex("by_username", (q) => q.eq("username", args.slug))
      .unique();

    if (usernameRecord) {
      return usernameRecord.userId;
    }

    // If no custom username found, treat slug as potential clerk ID
    // We'll need to verify this user actually exists by checking if they have links
    const links = await db
      .query("links")
      .withIndex("by_user", (q) => q.eq("userId", args.slug))
      .first();

    return links ? args.slug : null;
  },
});