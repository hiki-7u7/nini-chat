import { uploadFile } from '@/helpers/upload-file';
import { CloudinaryResponse } from '@/interfaces/cloudinary-response';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export async function POST (req: Request) {
  
  const profile = await currentProfile();
  const formData= await req.formData();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as File;

  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(name.length === 0){
    return new NextResponse('Name missing', { status: 400 });
  }

  if(description.length === 0){
    return new NextResponse('Description missing', { status: 400 });
  }

  if(!image){
    return new NextResponse('Image missing', { status: 400 });
  }

  try {

    const { secure_url } = await uploadFile(image) as CloudinaryResponse;

    const group = await db.group.create({
      data: {
        profileId: profile.id,
        description,
        imageUrl: secure_url,
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