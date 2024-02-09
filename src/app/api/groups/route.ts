import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function POST (req: Request) {
  
  const profile = await currentProfile();
  const { description, imageUrl, name } = await req.json() as { imageUrl: string, name: string, description: string };
  
  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(description.length === 0){
    return new NextResponse('description missing', { status: 400 });
  }

  if(imageUrl.length === 0){
    return new NextResponse('description missing', { status: 400 });
  }

  if(name.length === 0){
    return new NextResponse('description missing', { status: 400 });
  }

  try {
    
    const group = await db.group.create({
      data: {
        profileId: profile.id,
        description,
        imageUrl,
        name,
        inviteCode: uuid(),
        members: {
          create: [
            { profileId: profile.id, role: MemberRole.ADMIN }
          ]
        }
      },
    })

    return NextResponse.json(group);
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}