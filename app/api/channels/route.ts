import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ message: "unauthorised.", success: false }, { status: 401 })
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");
        if (!serverId) {
            return NextResponse.json({ message: "serverId is required.", success: false }, { status: 400 })
        }
        const { name, type } = await req.json();
        if (!name || !type) {
            return NextResponse.json({ message: "name and type are required.", success: false }, { status: 400 })
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
                            in: ['ADMIN', 'MODERATOR']
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
        })
        return NextResponse.json({ message: "channel created successfully.", success: true, server }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false, message: "error while creating the channel." }, { status: 500 })
    }
}