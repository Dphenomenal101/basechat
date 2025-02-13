import { z } from "zod";

export const createConversationMessageResponseSchema = z.object({
  usedSourceIndexes: z.array(z.number().describe("The indexes of the sources used in the response")),
  message: z.string().describe("The response message"),
});

export const createConversationMessageRequestSchema = z.object({
  conversationId: z.string(),
  content: z.string().describe("The request message"),
});

export type CreateConversationMessageRequest = z.infer<typeof createConversationMessageRequestSchema>;

export const conversationSchema = z.object({
  id: z.string(),
  title: z.string(),
  createdAt: z.coerce.date(),
});

export const conversationListResponseSchema = z.array(conversationSchema);

export const conversationMessagesResponseSchema = z.array(
  z.union([
    z.object({
      id: z.string(),
      content: z.string(),
      role: z.literal("assistant"),
      sources: z.array(z.any()).default([]),
      expanded: z.boolean().default(false),
    }),
    z.object({
      id: z.string(),
      content: z.string(),
      role: z.literal("user"),
    }),
  ]),
);

export const updateTenantSchema = z.object({
  question1: z.string(),
  question2: z.string(),
  question3: z.string(),
});
