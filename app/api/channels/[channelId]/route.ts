import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const DELETE = async (req: NextRequest, { params }: { params: { channelId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ message: 'unauthorised', success: false }, { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) {
            return NextResponse.json({ message: 'serverId is required', success: false }, { status: 400 })
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: ['MODERATOR', 'ADMIN']
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            }
        })
        return NextResponse.json({ message: 'channel deleted successfully', success: true, server }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, message: 'error while deleting the server', success: false }, { status: 500 })
    }
}



export const PATCH = async (req: NextRequest, { params }: { params: { channelId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ message: 'unauthorised', success: false }, { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) {
            return NextResponse.json({ message: 'serverId is required', success: false }, { status: 400 })
        }
        const { name, type } = await req.json();
        if (!name || !type) {
            return NextResponse.json({ message: 'name and type are required', success: false }, { status: 400 })
        }
        if (name === "general") {
            return NextResponse.json({ message: "channel name can not be 'general'.", success: false }, { status: 400 })
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: ['MODERATOR', 'ADMIN']
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general"
                            },
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            }
        })
        return NextResponse.json({ message: 'channel edited successfully', success: true }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, message: 'error while editing the channel', success: false }, { status: 500 })
    }
}