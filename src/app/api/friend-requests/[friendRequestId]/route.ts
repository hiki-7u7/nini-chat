import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE (
  req: Request,
  { params }: { params: { friendRequestId: string } }
) {
  
  const profile = await currentProfile();

  if(!profile){
    return new NextResponse('Unauthorized', { status: 401 });
  }

  console.log(params.friendRequestId)

  try {
    
    const friendRequest = await db.friendRequest.findUnique({
      where: {
        id: params.friendRequestId,
      }
    });

    if(!friendRequest) {
      return new NextResponse('Friend request not found', { status: 404 });
    };

    await db.friendRequest.delete({
      where: {
        id: params.friendRequestId,
      }
    });

    return new NextResponse('ok', { status: 200 });
  } catch (error) {
    console.log('',error);
    return new NextResponse('Internal server error', { status: 500 });
  }

}