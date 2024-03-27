import { uploadFile } from '@/helpers/upload-file';
import { CloudinaryResponse } from '@/interfaces/cloudinary-response';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { DirectMessage } from '@prisma/client';
import { NextResponse } from 'next/server';

const MESSAGES_BATCH = 25;

export async function GET(req: Request) {
  
  const profile = await currentProfile();

  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');
  let cursor = searchParams.get('cursor');
  cursor = cursor === "undefined" ? undefined! : cursor;
  
  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!conversationId){
    return new NextResponse('Conversation ID missing', { status: 400 });
  }

  
  try {

    let directMessages: DirectMessage[] = [];

    if(cursor) {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor!,
        },
        where: {
          conversationId,
        },
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "desc",
        }
      });
    } else {
      directMessages = await db.directMessage.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationId,
        },
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if(directMessages.length === MESSAGES_BATCH) {
      nextCursor = directMessages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: directMessages,
      nextCursor,
    });

  } catch (error) {
    console.log('GET_DIRECT_MESSAGES',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}


export async function POST (req: Request) {

  const profile = await currentProfile();

  const formData = await req.formData();
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');

  const file = formData.get("file") as File | string;
  const content = formData.get("content") as string;

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!conversationId){
    return new NextResponse('Conversation ID missing', { status: 400 });
  }

  if(!file && !content) {
    return new NextResponse('File and content missing', { status: 400 });
  }

  try {
    
    const conversation = await db.conversation.findUnique({
      where: {
        id: conversationId,
      },
      include: {
        profileOne: true,
        profileTwo: true,
      }
    });

    if(!conversation) {
      return new NextResponse('Conversation not found', { status: 404 })
    }

    let fileUrl = null;

    if(file !== "null"){
      const { secure_url } = await uploadFile(file as File) as CloudinaryResponse;
      fileUrl = secure_url;
    }

    const directMessage = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId,
        profileId: profile.id
      }
    });

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}