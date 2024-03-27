import { Conversation, DirectMessage, FriendRequest, Profile } from "@prisma/client";

export type FriendRequestWithSenderAndReceiverProfile = FriendRequest & {
  sender: Profile,
  receiver: Profile,
};

export type ConversationWithProfiles = Conversation & {
  profileOne: Profile,
  profileTwo: Profile,
}

export type DirectMessageWithProfile = DirectMessage & {
  profile: Profile
}