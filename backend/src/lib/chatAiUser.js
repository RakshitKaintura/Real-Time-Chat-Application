import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { ENV } from "./env.js";

const CHAT_AI_EMAIL = ENV.CHAT_AI_EMAIL || "chatai@system.local";
const CHAT_AI_NAME = "ChatAI";
const CHAT_AI_PROFILE_PIC =
  "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=ChatAI&backgroundColor=b6e3f4,c0aede,d1d4f9";

let cachedChatAIUserId = null;

export const ensureChatAIUser = async () => {
  if (cachedChatAIUserId) {
    const cachedUser = await User.findById(cachedChatAIUserId).select("-password");
    if (cachedUser) return cachedUser;
    cachedChatAIUserId = null;
  }

  let chatAIUser = await User.findOne({ email: CHAT_AI_EMAIL }).select("-password");

  if (!chatAIUser) {
    const randomPassword = crypto.randomBytes(24).toString("hex");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);

    try {
      chatAIUser = await User.create({
        fullName: CHAT_AI_NAME,
        email: CHAT_AI_EMAIL,
        password: hashedPassword,
        profilePic: CHAT_AI_PROFILE_PIC,
      });
      chatAIUser = chatAIUser.toObject();
      delete chatAIUser.password;
    } catch (error) {
      // Handle rare concurrent creation race.
      if (error?.code !== 11000) throw error;
      chatAIUser = await User.findOne({ email: CHAT_AI_EMAIL }).select("-password");
    }
  }

  cachedChatAIUserId = chatAIUser._id;
  return chatAIUser;
};

export const getChatAIUserId = async () => {
  const chatAIUser = await ensureChatAIUser();
  return chatAIUser._id;
};
