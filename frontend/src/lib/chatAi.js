export const CHAT_AI_NAME = "ChatAI";
export const CHAT_AI_EMAIL = "chatai@system.local";

export const isChatAIUser = (user) => {
  if (!user) return false;
  return user.fullName === CHAT_AI_NAME || user.email === CHAT_AI_EMAIL;
};
