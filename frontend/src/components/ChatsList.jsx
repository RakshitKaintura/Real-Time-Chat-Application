import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { useAuthStore } from "../store/useAuthStore";
import { isChatAIUser } from "../lib/chatAi";

function ChatsList() {
  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getMyChatPartners();
  }, [getMyChatPartners]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => {
        const chatIsOnline = isChatAIUser(chat) || onlineUsers.includes(chat._id);

        return (
          <div
            key={chat._id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectedUser(chat)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${chatIsOnline ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={chat.profilePic || "/avatar.png"} alt={chat.fullName} />
                </div>
              </div>
              <div className="flex items-center gap-2 min-w-0">
                <h4 className="text-slate-200 font-medium truncate">{chat.fullName}</h4>
                {isChatAIUser(chat) && (
                  <span className="text-[10px] uppercase tracking-wide bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
                    AI
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
export default ChatsList;