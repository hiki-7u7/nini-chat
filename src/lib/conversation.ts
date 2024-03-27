import { db } from "./db";

export const getConversation = async (profileOneId: string, profileTwoId: string) => {
	let conversation = await findConversation(profileOneId, profileTwoId) || await findConversation(profileTwoId, profileOneId);
	return conversation;
};


const findConversation = async (profileOneId: string, profileTwoId: string) => {
	try {
		return await db.conversation.findFirst({
			where: {
				AND: [
					{ profileOneId: profileOneId },
					{ profileTwoId: profileTwoId },
				]
			},
			include: {
				profileOne: true,
				profileTwo: true,
			}
		})
	} catch {
		return null;
	}
};
