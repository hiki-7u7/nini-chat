import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { uploadFile } from '@/helpers/upload-file';
import { CloudinaryResponse } from '@/interfaces/cloudinary-response';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

const MESSAGES_BATCH = 40;

export async function GET(req: Request) {
  
  const profile = await currentProfile();

  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  let cursor = searchParams.get('cursor');
  cursor = cursor === "undefined" ? undefined! : cursor;
  
  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!groupId){
    return new NextResponse('group ID missing', { status: 400 });
  }

  
  try {

    let messages: Message[] = [];

    if(cursor) {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor!,
        },
        where: {
          groupId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        }
      });
    } else {
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          groupId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if(messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });

  } catch (error) {
    console.log('GET_MESSAGES',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}

export async function POST(req: Request) {
  
  const profile = await currentProfile();

  const formData = await req.formData();
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');

  const file = formData.get("file") as File | string;
  const content = formData.get("content") as string;

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!groupId){
    return new NextResponse('group ID missing', { status: 400 });
  }


  try {
    
    const group = await db.group.findUnique({
      where: {
        id: groupId,
        members: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        members: true,
      },
    });

    if(!group) {
      return new NextResponse('Group not found', { status: 404 })
    }

    const member = group.members.find((member) => member.profileId === profile.id );

    if(!member) {
			return new NextResponse('Member not found', { status: 404 });
		}

    let fileUrl = null;

    if(file !== "null"){
      const { secure_url } = await uploadFile(file as File) as CloudinaryResponse;
      fileUrl = secure_url;
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        groupId,
        memberId: member?.id!,
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    });

    pusherServer.trigger(
      toPusherKey(`group:${groupId}:messages`),
      toPusherKey(`group:${groupId}:messages`),
      message,
    );

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('POST_MESSAGES',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}