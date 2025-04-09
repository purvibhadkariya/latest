import { ChatSession } from "../models/chat_session.model";
import { Types } from "mongoose";

export const createChatSessionService = async (
  user1_id: string,
  user2_id: string
) => {
  try {
    if (
      !Types.ObjectId.isValid(user1_id) ||
      !Types.ObjectId.isValid(user2_id)
    ) {
      throw new Error("Invalid user1_id or user2_id");
    }
    const user1ObjId = new Types.ObjectId(user1_id);
    const user2ObjId = new Types.ObjectId(user2_id);

    let chatSession = await ChatSession.findOne({
      $or: [
        { user1_id: user1ObjId, user2_id: user2ObjId },
        { user1_id: user2ObjId, user2_id: user1ObjId },
      ],
    });

    if (!chatSession) {
      chatSession = new ChatSession({
        user1_id: user1ObjId,
        user2_id: user2ObjId,
        messages:[],
      });

      await chatSession.save(); // Save the new chat session
    }

    return chatSession; // Return the chat session instance
  } catch (error) {
    console.error("Error in createChatSessionService:", error);
    throw new Error("Error creating ChatSession: " + error);
  }
};
