import { redirect } from "next/navigation";

import { FC } from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { ConversationChatHeader } from "@/components/conversations/conversation-chat-header";
import { getConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { ChatInput } from "@/components/chats/chat-input";
import { ConversationChatMessages } from "@/components/conversations/conversation-chat-messages";



interface ConversationIdProps {
  params: { conversationId: string }
}

const ConversationIdPage: FC<ConversationIdProps> = async ({ params }) => {

  const profile = await currentProfile();
 
  if(!profile) {
    return redirectToSignIn();
  }

  const conversation = await getConversation(params.conversationId, profile.id);
  
  if(!conversation) {
    return redirect('/conversations')
  }

  const conversationProfile = [conversation.profileOne, conversation.profileTwo]
    .find(profile => profile.id === params.conversationId);

  if(!conversationProfile) {
    return redirect('/conversations')
  }

  return (
    <div className="h-full relative flex flex-col">
      <div className="relative">
        <ConversationChatHeader conversation={conversation} conversationProfile={conversationProfile!}/>
      </div>
      <ConversationChatMessages conversationId={conversation.id} currentProfile={profile}/>
      <div className="relative bg-[#292929]">
        <ChatInput 
          apiUrl="/api/direct-messages"
          query={`conversationId=${conversation.id}`}
        />
      </div>
    </div>
  );
}
 
export default ConversationIdPage;