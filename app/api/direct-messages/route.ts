import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";


const MESSAGES_BATCH = 10;

export const GET = async (req: Request) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return Response.json({ message: 'unauthorised', success: false }, { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get('cursor');
        const conversationId = searchParams.get('conversationId');
        if (!conversationId) {
            return Response.json({ message: 'conversationId is required.', success: false }, { status: 400 })
        }
        let messages: DirectMessage[] = [];
        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId: conversationId
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
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId: conversationId
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
        return Response.json({ message: 'error while fetching direct messages.', success: false, error: error.message }, { status: 500 })
    }
}