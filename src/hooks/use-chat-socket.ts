import { pusherClient } from "@/lib/pusher";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toPusherKey } from '../lib/utils';
import { Message } from "@prisma/client";
import { MessageWithMemberWithProfile } from "@/types/group";

interface ChatSocketProps {
	addKey: string;
  updateKey: string;
  queryKey: string;
}

export const useChatSocket = ({
	addKey,
	updateKey,
	queryKey,
}: ChatSocketProps) => {
	const queryClient = useQueryClient();

  // const queryKey = `group:${groupId}`
	// const addKey = `group:${groupId}:messages`
	// const updateKey = `group:${groupId}:messages:update`

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(addKey));

    const addMessageHandler = ( message: MessageWithMemberWithProfile ) => {
			queryClient.setQueryData([queryKey], (olData: any) => {

				if(!olData || !olData.pages || olData.pages.length === 0  ){
					return {
						pages: [{
							items: [message]
						}]
					};
				}

				const newData = [...olData.pages];

				newData[0] = {
					...newData[0],
					items: [
						message,
						...newData[0].items,
					]
				}

				return {
					...olData,
					pages: newData,
				}
			})
    };

    pusherClient.bind(toPusherKey(addKey), addMessageHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(addKey));
      pusherClient.unbind(toPusherKey(addKey), addMessageHandler);
    };
  }, [addKey, queryClient, queryKey]);

	useEffect(() => {

		pusherClient.subscribe(toPusherKey(updateKey));

		const updateMessageHandler = (  message: MessageWithMemberWithProfile ) => {
			queryClient.setQueryData([queryKey], (olData: any) => {
				if(!olData || !olData.pages || olData.pages.length === 0  ){
					return olData;
				}

				const newData = olData.pages.map((page:any) => {
					return {
						...page,
						items: page.items.map((item: MessageWithMemberWithProfile) =>{
							if(item.id === message.id){
								return message;
							}

							return item;
						})
					}
				})

				return {
					...olData,
					pages: newData,
				}
			})
		}

		pusherClient.bind(toPusherKey(updateKey), updateMessageHandler);

		return () => {
      pusherClient.unsubscribe(toPusherKey(updateKey));
      pusherClient.unbind(toPusherKey(updateKey), updateMessageHandler);
    };
	}, [updateKey, queryKey, queryClient])

}