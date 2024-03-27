import { deleteFile } from '@/helpers/delete-file';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { DirectMessage } from '@prisma/client';
import { NextResponse } from 'next/server';


export async function PATCH (
  req: Request,
  { params }: { params: { directMessageId: string } }
) {

  const profile = await currentProfile();
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');
  const { content, fileUrl } = await req.json();

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!params.directMessageId){
    return new NextResponse('Direct Message ID missing', { status: 400 });
  }

  if(!conversationId) {
    return new NextResponse('Conversation ID missing', { status: 400 });
  }

  try {
    
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
      },
    });

    if(!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }

    const directMessage = await db.directMessage.findFirst({
      where: {
        id: params.directMessageId,
        conversationId: conversationId,
      },
      include: {
        profile: true
      },
    });

    if(!directMessage) {
      return new NextResponse('Direct Message not found', { status: 404 });
    }

    const isOwner = profile?.id === directMessage.profileId;

    if(!isOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let modifiedMessage:DirectMessage;

    if(fileUrl === null) {
      
      const imageUrlSegments = directMessage?.fileUrl!.split('/');
      const imageId = imageUrlSegments![imageUrlSegments!?.length - 1].split('.')[0];
      await deleteFile(`nini-chat/${imageId}`);

      modifiedMessage = await db.directMessage.update({
        where: {
          id: params.directMessageId,
        },
        data: {
          fileUrl,
        },
        include: {
          profile: true,
        }
      });
      
    } else {
      modifiedMessage = await db.directMessage.update({
        where: {
          id: params.directMessageId,
        },
        data: {
          content,
        },
        include: {
          profile: true,
        }
      });

    }
    return NextResponse.json(modifiedMessage, { status: 200 });
  } catch (error) {
    console.log('PATCH_DIRECTMESSAGE',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}


export async function DELETE (
  req: Request,
  { params }: { params: { directMessageId: string } }
) {

  const profile = await currentProfile();
  const { searchParams } = new URL(req.url);
  const conversationId = searchParams.get('conversationId');

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!params.directMessageId){
    return new NextResponse('Direct Message ID missing', { status: 400 });
  }

  if(!conversationId) {
    return new NextResponse('Conversation ID missing', { status: 400 });
  }

  try {
    
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
      },
    });

    if(!conversation) {
      return new NextResponse('Conversation not found', { status: 404 });
    }


    const directMessage = await db.directMessage.findFirst({
      where: {
        id: params.directMessageId,
        conversationId: conversationId,
      },
      include: {
        profile: true,
      },
    });

    if(!directMessage) {
      return new NextResponse('Direct Message not found', { status: 404 });
    }

    const isOwner = profile.id === directMessage.profileId;

    if(!isOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }


    if(directMessage.fileUrl !== null){
      const imageUrlSegments = directMessage?.fileUrl!?.split('/');
      const imageId = imageUrlSegments![imageUrlSegments!?.length - 1]?.split('.')[0];
      await deleteFile(`nini-chat/${imageId}`);
    }


    const deletedMessage = await db.directMessage.update({
      where: {
        id: params.directMessageId,
      },
      data: {
        fileUrl: null,
        content: 'message has been deleted',
        deleted: true,
      },
      include: {
        profile: true,
      }
    });

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('DELETE_DIRECTMESSAGE',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}