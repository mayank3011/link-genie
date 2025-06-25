import { profile } from "console";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";


export default defineSchema({
  usernames: defineTable({
    userId:v.string(),
    username:v.string(),
  })
  .index("by_user_id",["userId"])
  .index("by_username",["username"]),

  links: defineTable({
    userId: v.string(), // Clerk user ID
    title: v.string(), // Display name of the link
    url: v.string(), // Destination URL
    order: v.number(), // Sort order
  })
  .index("by_user", ["userId"])
  .index("by_user_and_order", ["userId", "order"]),

  userCustomizations:defineTable({
    userId:v.string(),
    profilePictureStorageId:v.optional(v.id("_storage")),
    description:v.optional(v.string()),
    accentColor:v.optional(v.string()),
  }).index("by_user_id",["userId"]),
});