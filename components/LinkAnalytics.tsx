// /components/LinkAnalytics.tsx

'use client'; // 1. This directive is now required.

import { LinkAnalyticsData } from "@/lib/link-analytics-server";
import Link from "next/link";
import {
    Users,
    MousePointer,
    Globe,
    BarChart3,
    Lock,
} from "lucide-react";

// 2. Update props to include the access decision
interface LinkAnalyticsProps {
    analytics: LinkAnalyticsData;
    hasAccess: boolean;
}

// 3. Function is no longer async and receives 'hasAccess' as a prop
function LinkAnalytics({ analytics, hasAccess }: LinkAnalyticsProps) {

    const formatUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace("www.", "");
        } catch {
            return url;
        }
    };

    // 4. The check now uses the prop, not a server function
    if (!hasAccess) {
        return (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 lg:p-8 mb-8">
                <div className="max-w-7xl mx-auto">
                    {/* The "Upgrade" paywall UI remains the same */}
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 rounded-2xl p-8 shadow-xl shadow-gray-200/50">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-gray-400 rounded-xl">
                                <BarChart3 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Link Analytics
                                </h2>
                                <p className="text-gray-600">
                                    <Lock className="inline-block w-4 h-4 mr-1" />
                                    Upgrade to unlock powerful insights
                                </p>
                            </div>
                        </div>
                        <div className="mt-6 space-y-6">
                            <div className="flex items-center gap-4 text-gray-600">
                                <MousePointer className="w-5 h-5" />
                                <span>Track total clicks and engagement</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                                <Users className="w-5 h-5" />
                                <span>Monitor unique visitors</span>
                            </div>
                            <div className="flex items-center gap-4 text-gray-600">
                                <Globe className="w-5 h-5" />
                                <span>See geographic distribution</span>
                            </div>
                        </div>
                        <div className="mt-8 bg-gray-50 rounded-lg p-4 text-center">
                            <p className="text-gray-500">
                                Get detailed insights into your link performance with our Pro and Ultra plans
                            </p>
                            <Link
                                href="/dashboard/billing"
                                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                            >
                                Upgrade Now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    // This is the UI for when the user has access
    return (
        <div>
            <h1>Analytics for: {analytics.linkTitle}</h1>
            <p>URL: {formatUrl(analytics.linkUrl)}</p>
            {/* The actual analytics dashboard would be rendered here */}
        </div>
    );
}

export default LinkAnalytics;