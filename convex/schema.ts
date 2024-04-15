import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const fileTypes = v.union(
                                v.literal("png"), 
                                v.literal("csv"),
                                v.literal("pdf"),
                                v.literal("vnd.openxmlformats-officedocument.presentationml.presentation"), 
                                v.literal("vnd.openxmlformats-officedocument.wordprocessingml.document"), 
                                v.literal("vnd.openxmlformats-officedocument.spreadsheetml.sheet"),
                                v.literal("x-python"),
                                v.literal("x-zip-compressed"),
                                v.literal("plain"),
                                v.literal("svg+xml"),
                                v.literal("jpeg"),
                                v.literal("mp4"),
                                v.literal("mov"),
                                );

export const roles = v.union(v.literal("admin"), v.literal("member"));

export default defineSchema({
    files: defineTable({ 
        name: v.string(),
        type: fileTypes,
        orgId: v.string(), 
        fileId: v.id("_storage"),
        userId: v.id("users"),  
        shouldDelete: v.optional((v.boolean())), 
    }).index("by_ordId", ['orgId']).index("by_shouldDelete", ['shouldDelete']),
    favorites: defineTable({
        fileId: v.id("files"),
        orgId: v.string(),
        userId: v.id("users"),
    }).index("by_userId_orgId_fileId", ["userId", "orgId", "fileId"]),
    users: defineTable({
        tokenIdentifier: v.string(),
        name: v.optional(v.string()),
        image: v.optional(v.string()),
        orgIds: v.array(v.object({
            orgId: v.string(),
            role: roles
        })
    ),
    }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});