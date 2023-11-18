import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { Message } from "@prisma/client";


const MESSAGES_BATCH = 10;

export const GET = async (req: Request) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return Response.json({ message: 'unauthorised', success: false }, { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');
        const channelId = searchParams.get('channelId');
        if (!channelId) {
            return Response.json({ message: 'channelId is required.', success: false }, { status: 400 })
        }
        let messages: Message[] = [];
        if (cursor) {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            })
        } else {
            messages = await db.message.findMany({
                take: MESSAGES_BATCH,
                where: {
                    channelId: channelId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        };

        let nextCursor = null;

        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return Response.json({ items: messages, nextCursor }, { status: 200 })
    } catch (error: any) {
        return Response.json({ message: 'error while fetching messages.', success: false, error: error.message }, { status: 500 })
    }
}