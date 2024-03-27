import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Profile } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET (
  req: Request,
  { params }: { params: { profileId: string } }
) {
  
  const profile = await currentProfile();

  if(!params.profileId){
    return new NextResponse('Profile ID missing', { status: 404 });
  }

  try {
    
    const currentProfile = await db.profile.findUnique({
      where: {
        id: params.profileId
      }
    });

    if(currentProfile?.id !== profile!.id){
      return new NextResponse('Anauthorized', { status: 401 });
    }

    const profileWithConversations = await db.profile.findUnique({
      where: { id: params.profileId },
      include: {
        conversationsInitiated: {
          include: { profileTwo: true }
        },
        conversationsReceived: {
          include: { profileOne: true }
        },
      }
    })
  
    const conversations: Profile[] = [
      ...profileWithConversations!.conversationsInitiated.map(conversation => conversation.profileTwo),
      ...profileWithConversations!.conversationsReceived.map(conversation => conversation.profileOne)
    ];  

    return NextResponse.json(conversations);
  } catch (error) {
    console.log('GET_PROFILE_CONVERSATIONS',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}