import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { uploadFile } from '@/helpers/upload-file';
import { CloudinaryResponse } from '@/interfaces/cloudinary-response';
import { deleteFile } from '@/helpers/delete-file';

export async function POST(req: Request) {

  const profile = await currentProfile();
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!file){
    return new NextResponse('Bad request', { status: 400 });
  }

  try {

    const result = await uploadFile(file) as CloudinaryResponse;
  
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

};


export async function DELETE(req: Request) {

  const profile = await currentProfile();
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get('fileId');

  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!fileId){
    return new NextResponse('fileId missing', { status: 400 });
  }
  try {
    const result = await deleteFile(fileId);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}