import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';


export async function PATCH (
  req: Request,
  { params }: { params: { messageId: string } }
) {

  const profile = await currentProfile();
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');
  const { content } = await req.json();

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!params.messageId){
    return new NextResponse('Message ID missing', { status: 400 });
  }

  if(!groupId) {
    return new NextResponse('Group ID missing', { status: 400 });
  }

  try {
    
    const group = await db.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      include: {
        members: true,
      },
    });

    if(!group) {
      return new NextResponse('Group not found', { status: 404 });
    }

    const member = group.members.find((member) => member.profileId === profile.id);

    const message = await db.message.findFirst({
      where: {
        id: params.messageId,
        groupId: groupId,
      },
      include: {
        member: true,
      },
    });

    if(!message) {
      return new NextResponse('Message not found', { status: 404 });
    }

    const isOwner = member?.id === message.member.id;
    const canModify = isOwner;

    if(!canModify) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const modifiedMessage = await db.message.update({
      where: {
        id: params.messageId,
      },
      data: {
        content,
      },
      include: {
        member : {
          include: {
            profile: true,
          }
        }
      }
    });

    return NextResponse.json(modifiedMessage, { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}


export async function DELETE (
  req: Request,
  { params }: { params: { messageId: string } }
) {

  const profile = await currentProfile();
  const { searchParams } = new URL(req.url);
  const groupId = searchParams.get('groupId');

  if(!profile) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if(!params.messageId){
    return new NextResponse('Message ID missing', { status: 400 });
  }

  if(!groupId) {
    return new NextResponse('Group ID missing', { status: 400 });
  }

  try {
    
    const group = await db.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: {
            profileId: profile.id,
          }
        }
      },
      include: {
        members: true,
      },
    });

    if(!group) {
      return new NextResponse('Group not found', { status: 404 });
    }

    const member = group.members.find((member) => member.profileId === profile.id);

    const message = await db.message.findFirst({
      where: {
        id: params.messageId,
        groupId: groupId,
      },
      include: {
        member: true,
      },
    });

    if(!message) {
      return new NextResponse('Message not found', { status: 404 });
    }

    const isAdmin = member?.role === "ADMIN";
    const isOwner = member?.id === message.member.id;
    const canModify = isAdmin || isOwner;

    if(!canModify) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const deletedMessage = await db.message.update({
      where: {
        id: params.messageId,
      },
      data: {
        fileUrl: null,
        content: 'message has been deleted',
        deleted: true,
      },
      include: {
        member : {
          include: {
            profile: true,
          }
        }
      }
    });

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}