import { v4 as uuid } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


// for generating the invite code

export const PATCH = async (req: NextRequest, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ success: false, message: 'unauthorised access.' }, { status: 401 })
        }
        if (!params.serverId) {
            return NextResponse.json({ success: false, message: 'server id is missing.' }, { status: 400 })
        }
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                inviteCode: uuid()
            }
        });
        return NextResponse.json({ success: true, message: 'invite code regenerated.', server }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false, message: 'error while regeneration the invite code.' }, { status: 500 })
    }
}


// for editing the server details

export const PUT = async (req: NextRequest, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ success: false, message: 'unauthorised access.' }, { status: 401 })
        }
        if (!params.serverId) {
            return NextResponse.json({ success: false, message: 'server id is missing.' }, { status: 400 })
        }
        const { name, imageUrl } = await req.json();
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name: name,
                imageUrl: imageUrl,
            }
        });
        return NextResponse.json({ success: true, message: 'server details updated.', server }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false, message: 'error while editing th server details.' }, { status: 500 })
    }
}


// for leaving the server

export const POST = async (req: NextRequest, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ success: false, message: 'unauthorised access.' }, { status: 401 })
        }
        if (!params.serverId) {
            return NextResponse.json({ success: false, message: 'server id is missing.' }, { status: 400 })
        }
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                },
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });
        return NextResponse.json({ success: true, message: 'you have left from the server successfully.', server }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false, message: 'error while leaving the server.' }, { status: 500 })
    }
}



// for deleting the server

export const DELETE = async (req: NextRequest, { params }: { params: { serverId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ success: false, message: 'unauthorised access.' }, { status: 401 })
        }
        if (!params.serverId) {
            return NextResponse.json({ success: false, message: 'server id is missing.' }, { status: 400 })
        }
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        })
        return NextResponse.json({ success: true, message: 'server deleted successfully.', server }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ error: error.message, success: false, message: 'error while deleting the server.' }, { status: 500 })
    }
}

