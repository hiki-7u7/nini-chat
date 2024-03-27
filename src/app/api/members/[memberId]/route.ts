import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  
  const profile = await currentProfile();
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId')
  
  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!groupId) {
    return new NextResponse('Group ID missing', { status: 400 });
  }

  try {
    
    const group = await db.group.update({
      where: {
        id: groupId,
        profileId: profile.id
      },
      data: {
        members: {
          deleteMany: {
            id: params.memberId,
            profileId: {
              not: profile.id
            }
          }
        },
      },
    });

    /* triguer de expulsar aqui */
    pusherServer.trigger(
      toPusherKey(`group:${group.id}:ban_member`),
      'ban_member',
      { bannedMemberId: params.memberId }
    )

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}