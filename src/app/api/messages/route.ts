import { NextResponse } from 'next/server';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';

const MESSAGES_BATCH = 10;

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

  const { content, fileUrl } = await req.json();
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  
  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!content){
    return new NextResponse('content missing', { status: 400 });
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

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        groupId,
        memberId: member?.id!,
      }
    });

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('POST_MESSAGES',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}