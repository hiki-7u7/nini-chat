import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function PATCH (
  req: Request,
  { params } : { params : { groupId: string } }
) {
  
  const profile = await currentProfile();

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!params.groupId){
    return new NextResponse('Group ID missing', { status: 400 });
  }

  try {
    
    const group = await db.group.update({
      where: {
        id: params.groupId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuid(),
      }
    })

    return NextResponse.json(group);
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}