import { useEffect, useState } from "react";

type ChatScrollProps = {
	chatRef: React.RefObject<HTMLDivElement>;
	bottomRef: React.RefObject<HTMLDivElement>;
	count: number;
}

export const useChatScroll = ({
	chatRef,
	count,
	bottomRef,
}: ChatScrollProps) => {
	const [hasInitialized, setHasInitialized] = useState(false);

	useEffect(() => {
		const topDiv = chatRef?.current;
		const bottomDiv = bottomRef?.current;

		const shouldAutoScroll = () => {
			if(!hasInitialized && bottomDiv) {
				setHasInitialized(true);
				return true;
			}

			if(!topDiv) {
				return false;
			}

			const distanceFromBottom = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

			return distanceFromBottom <= 500;
		};

		if(shouldAutoScroll()){
			bottomRef.current?.scrollIntoView({
				behavior: "smooth",
			})
		}

	}, [count, chatRef, bottomRef, hasInitialized]);

}