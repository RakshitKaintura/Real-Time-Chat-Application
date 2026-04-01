import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { isChatAIUser } from "../lib/chatAi";

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();

  useEffect(() => {
    getAllContacts();
  }, [getAllContacts]);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
      {allContacts.map((contact) => {
        const contactIsOnline = isChatAIUser(contact) || onlineUsers.includes(contact._id);

        return (
          <div
            key={contact._id}
            className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
            onClick={() => setSelectedUser(contact)}
          >
            <div className="flex items-center gap-3">
              <div className={`avatar ${contactIsOnline ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={contact.profilePic || "/avatar.png"} alt={contact.fullName} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
                {isChatAIUser(contact) && (
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
export default ContactList;