import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH (
  req: Request,
  { params }: { params: { groupId: string } }
) {

  const profile = await currentProfile();

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!params.groupId) {
    return new NextResponse('Group ID missing', { status: 400 });
  }

  try {
    
    await db.group.update({
      where: {
        id: params.groupId,
        profileId: {
          not: profile.id
        },
        members: {
          some: {
            profileId: profile.id
          },
        },
      },
      data: {
        members: {
          deleteMany: {
            profileId: profile.id
          }
        }
      }
    })

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}