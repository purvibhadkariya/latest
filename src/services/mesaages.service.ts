import { Messages, IMessages } from "../models/Messages.model";
import { Types } from "mongoose";
import { ChatSession } from "../models/chat_session.model";
import { error } from "console";

interface IMessageData {
  sender_id: Types.ObjectId;
  receiver_id: Types.ObjectId;
  text: string;
  status?: "sent" | "delivered" | "read";
}

export const createMessageService = async ({
  sender_id,
  receiver_id,
  text,
  status = "sent", // Default status
}: IMessageData): Promise<IMessages> => {
  try {
    if (
      !Types.ObjectId.isValid(sender_id) ||
      !Types.ObjectId.isValid(receiver_id)
    ) {
      throw new Error("Invalid user IDs");
    }

    const senderObjId = new Types.ObjectId(sender_id);
    const receiverObjId = new Types.ObjectId(receiver_id);

    let chatSession = await ChatSession.findOne({
      $or: [
        { user1_id: senderObjId, user2_id: receiverObjId },
        { user1_id: receiverObjId, user2_id: senderObjId },
      ],
    });

    if (!chatSession) {
      chatSession = new ChatSession({
        user1_id: senderObjId,
        user2_id: receiverObjId,
        messages: [],
      });
      await chatSession.save();
    }

    const newMessage = new Messages({
      sender_id: senderObjId,
      receiver_id: receiverObjId,
      text,
      status,
    });
    await newMessage.save();

    chatSession.messages.push(newMessage._id);
    await chatSession.save();

    return newMessage;
  } catch (error) {
    throw new Error("Error placing message: " + error);
  }
};

export const deleteMessageService = async (messageId: string) => {
  if (!Types.ObjectId.isValid(messageId)) {
    throw new Error("Invalid messageId");
  }

  const deleteMessage = await Messages.findByIdAndDelete(messageId);
  if (!deleteMessage) {
    throw new Error("Message not found");
  }

  await ChatSession.updateMany(
    { messages: messageId },
    {
      $pull: { messages: messageId },
    }
  );
  return deleteMessage;
};

// export const getMessage = async(sender_id:mongoose.Types.ObjectId, receiver_id:mongoose.Types.ObjectId):Promise<IMessages[]> => {
//   try {
//     const messages = await Messages.find({
//       $or: [
//         { sender_id, receiver_id },
//         { sender_id: receiver_id, receiver_id: sender_id  },
//       ],
//     });
//     if (!messages || messages.length === 0) {
//       throw new Error("No messages found between the given users.");
//     }
//     return messages;

//   } catch (error) {
//     throw new Error("Error getting message: " + error);
//   }
// };
