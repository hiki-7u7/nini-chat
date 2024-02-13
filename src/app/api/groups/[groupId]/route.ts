import { deleteFile } from '@/helpers/delete-file';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH (
  req: Request,
  { params } : { params: { groupId: string } }  
) {
  
  const profile = await currentProfile();
  const { description, imageUrl, name } = await req.json() as { imageUrl: string, name: string, description: string };

  if(!profile) {
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

    const group = await db.group.findFirst({
      where: {
        id: params.groupId
      }
    });

    const imageUrlChanged = group?.imageUrl !== imageUrl;
    const imageUrlSegments = group?.imageUrl.split('/');
    const imageId = imageUrlSegments![imageUrlSegments!?.length - 1].split('.')[0];

    if(imageUrlChanged) {
      await deleteFile(`nini-chat/${imageId}`);
    }
  
    await db.group.update({
      where: {
        id: params.groupId
      },
      data: {
        imageUrl,
        name,
        description,
      }
    });

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}