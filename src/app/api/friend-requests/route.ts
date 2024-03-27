import { getConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST (req: Request) {
  
  const profile = await currentProfile();
  const { codeRequest } = await req.json() as { codeRequest: string };

  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!codeRequest){
    return new NextResponse('CodeRequest missing', { status: 400 });
  }

  try {
    
    const senderProfile = await db.profile.findUnique({
      where: {
        id: profile.id
      }
    });

    if(!senderProfile){
      return new NextResponse('Sender profile not found', { status: 404 });
    }

    const receiverProfile = await db.profile.findFirst({
      where: {
        friendRequestID: codeRequest
      }
    });

    if(!receiverProfile){
      return new NextResponse('Receiver profile not found', { status: 404 });
    }

    const friendRequestAlreadyExist = (await db.friendRequest.findFirst({
      where: {
        senderId: senderProfile.id,
        receiverId: receiverProfile.id,
      }
    })) || (await db.friendRequest.findFirst({
      where: {
        senderId: receiverProfile.id,
        receiverId: senderProfile.id,
      }
    }));

    if(friendRequestAlreadyExist){
      return new NextResponse('Friend Request already exist', { status: 400 });
    }

    const arealreadyFriends = await getConversation(receiverProfile.id, senderProfile.id);

    if(arealreadyFriends){
      return new NextResponse('Are already friends', { status: 400 });
    }

    const friendRequest = await db.friendRequest.create({
      data: {
        senderId: senderProfile.id,
        receiverId: receiverProfile.id,
      },
      include: {
        sender: true,
        receiver: true,
      }
    });

    pusherServer.trigger(
      toPusherKey(`profile:${friendRequest.receiver.userId}:friend_request`),
      'friend_request',
      friendRequest
    );

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}