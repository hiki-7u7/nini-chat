import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

export async function POST (req: Request) {
  
  const profile = await currentProfile();
  const { inviteCode } = await req.json() as { inviteCode: string };

  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!inviteCode){
    return new NextResponse('InviteCode missing', { status: 400 });
  }

  try {
    
    const isAlreadyMember = await db.group.findFirst({
      where: {
        inviteCode: inviteCode,
        members: {
          some: {
            profileId: profile.id
          }
        }
      }
    });

    if(isAlreadyMember){
      return new NextResponse('User already member', { status: 400 });
    }

    await db.group.update({
      where: {
        inviteCode: inviteCode
      },
      data: {
        members: {
          create: [
            { profileId: profile.id }
          ]
        }
      }
    })

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}