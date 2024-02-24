import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
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
    
    await db.group.update({
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
        }
      },
    });

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}