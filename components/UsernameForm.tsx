"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link"; // Added import
import {toast} from "sonner";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Loader2,
  CheckCircle,
  User,
  AlertCircle,
  ExternalLink,
  Copy // Added import
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import {getBaseUrl} from "@/lib/getBaseUrl"

// --- Skeleton component for loading state ---
function UsernameDisplaySkeleton() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-32 bg-gray-300 rounded"></div>
        </div>
        <div className="h-8 w-28 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

// --- Zod schema aligned with backend validation ---
const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Only letters, numbers, underscores, and hyphens are allowed"
    ),
});

function UsernameForm() {
  const { user } = useUser();
  const [debouncedUsername, setDebouncedUsername] = useState("");

  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user?.id ? { userId: user.id } : "skip"
  );

  const availabilityCheck = useQuery(
    api.lib.usernames.checkUsernameAvailability,
    debouncedUsername.length >= 3 ? { username: debouncedUsername } : "skip"
  );

  const setUsernameMutation = useMutation(api.lib.usernames.setUsername);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const watchedUsername = form.watch("username");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedUsername(watchedUsername);
    }, 500);
    return () => clearTimeout(timer);
  }, [watchedUsername]);

  const getStatus = () => {
    if (form.formState.isSubmitting) return "checking";
    if (!debouncedUsername || debouncedUsername.length < 3) return null;
    if (availabilityCheck === undefined) return "checking";
    if (debouncedUsername === currentSlug) return "current";
    if (availabilityCheck === null) return null; // Skipped query
    return availabilityCheck.available ? "available" : "unavailable";
  };

  const status = getStatus();
  const isSubmitDisabled = status !== "available" || form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user?.id || status !== "available") return;

    try {
      const result = await setUsernameMutation({ username: values.username });
      if (!result.success) {
        form.setError("username", { message: result.error || "An unknown error occurred." });
      }
    } catch (error) {
      console.error("Failed to set username:", error);
      form.setError("username", {
        message: "An unexpected error occurred. Please try again.",
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Customize Your Link
        </h3>
        <p className="text-gray-600 text-sm">
          This will be your public URL.
        </p>
      </div>

      {/* --- HYDRATION FIX STARTS HERE --- */}
      {/* 1. Show a skeleton while the query is loading */}
      {currentSlug === undefined && <UsernameDisplaySkeleton />}

      {/* 2. Show the current username display only when the data is loaded */}
      {currentSlug && currentSlug !== user?.id && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                Current Username
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-green-800 bg-white px-2 py-1 rounded text-sm">
                {currentSlug}
              </span>
              <Link
                href={`/u/${currentSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 transition-colors"
                aria-label="View public link"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
      {/* --- HYDRATION FIX ENDS HERE --- */}


      {/* URL preview */}
<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        <span className="text-sm font-medium text-gray-700">
            Your Link Preview
        </span>
    </div>

    <div className="flex items-center">
        <Link
            href={`/u/${currentSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 font-mono text-gray-800 bg-white px-3 py-2 rounded-l border-l border-y hover:bg-gray-50 transition-colors truncate"
        >
            {getBaseUrl()}/u/{currentSlug}
        </Link>
        <button
            onClick={() => {
                navigator.clipboard.writeText(`${getBaseUrl()}/u/${currentSlug}`);
                toast.success("Copied to clipboard");
            }}
            className="flex items-center justify-center w-10 h-10 bg-white border rounded-r hover:bg-gray-50 transition-color"
            title="Cppy to clipboard"
        >
            <Copy className="w-4 h-4 text-gray-500" />
        </button>
    </div>
</div>

{/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="your-unique-username"
                      {...field}
                      className="pr-10"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {status === "checking" && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                      {status === "available" && <CheckCircle className="w-4 h-4 text-green-500" />}
                      {status === "current" && <User className="w-4 h-4 text-blue-500" />}
                      {status === "unavailable" && <AlertCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  Your public URL will be: yoursite.com/{watchedUsername || "..."}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            disabled={isSubmitDisabled}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Username"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default UsernameForm;