import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { initialProfile } from "./initial-profile";

export const currentProfile = async () => {

  const { userId } = auth();

  if(!userId){
    return null;
  }

  let profile = await db.profile.findUnique({
    where: {
      userId,
    }
  });

  if(!profile) {
    profile = await initialProfile()
  }

  return profile

};