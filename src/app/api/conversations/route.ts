import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST (req: Request) {
  
  const profile = await currentProfile();
  const { senderId, friendRequestId } = await req.json() as { senderId: string, friendRequestId: string };

  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!senderId){
    return new NextResponse('Sender ID missing', { status: 400 });
  }

  if(!friendRequestId){
    return new NextResponse('Friend request ID missing', { status: 400 });
  }

  
  try {
    
    const friendRequest = await db.friendRequest.findUnique({
      where: {
        id: friendRequestId
      },
      include: {
        receiver: true,
      }
    });

    if(!friendRequest){
      return new NextResponse('Friend request not found', { status: 404 });
    }

    const senderProfile = await db.profile.findUnique({
      where: {
        id: senderId
      }
    });

    if(!senderProfile){
      return new NextResponse('Sender profile not found', { status: 404 });
    }

    await db.conversation.create({
      data: {
        profileOneId: profile.id,
        profileTwoId: senderId,
      }
    });

    await db.friendRequest.delete({
      where: {
        id: friendRequestId
      },
    });

    pusherServer.trigger(
      toPusherKey(`profile:${senderProfile.userId}:new_friend`),
      'new_friend',
      friendRequest.receiver
    )

    // console.log(`profile:${senderProfile.userId}:new_friend`)

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}