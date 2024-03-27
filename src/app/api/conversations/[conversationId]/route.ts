import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function DELETE (
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  
  const profile = await currentProfile();

  if(!profile) {
    return new NextResponse('Anauthorized', { status: 401 });
  }

  if(!params.conversationId){
    return new NextResponse('Conversation ID missing', { status: 400 })
  }

  try {
    
    const conversation = await db.conversation.findFirst({
      where: {
        id: params.conversationId,
      },
      include: {
        profileOne: true,
        profileTwo: true,
      },
    });

    if(!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    const otherProfile = [conversation.profileOne, conversation.profileTwo].find( c => c.id !== profile.id );

    await db.conversation.delete({
      where: {
        id: conversation.id
      }
    });

    pusherServer.trigger(
      toPusherKey(`profile:${otherProfile?.userId}:remove_friend`),
      'remove_friend',
      { friendIdToDelete: profile.id }
    )

    console.log(otherProfile)

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}