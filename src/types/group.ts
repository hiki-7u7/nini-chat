import { Group, Member, Message, Profile } from "@prisma/client";

export type GroupWithMessages = (Group & {
  messages: Message[]
})

export type MemberWithProfile = (Member & {
  profile: Profile
})