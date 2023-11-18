import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export const PATCH = async (req: NextRequest, { params }: { params: { memberId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ message: 'unauthorised.', success: false }, { status: 401 })
        }
        const { memberId } = params;
        if (!memberId) {
            return NextResponse.json({ message: 'memberId is required.', success: false }, { status: 400 })
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) {
            return NextResponse.json({ message: 'serverId is required.', success: false }, { status: 400 })
        }
        const { role } = await req.json();
        if (!role) {
            return NextResponse.json({ message: 'role is required.', success: false }, { status: 400 })
        }

        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role: role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })
        return NextResponse.json({ success: true, message: 'member role changed successfully.', server }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: 'error while change the member role.', error: error.message, success: false }, { status: 500 })
    }
}



export const DELETE = async (req: NextRequest, { params }: { params: { memberId: string } }) => {
    try {
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ message: 'unauthorised.', success: false }, { status: 401 })
        }
        const { memberId } = params;
        if (!memberId) {
            return NextResponse.json({ message: 'memberId is required.', success: false }, { status: 400 })
        }
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get('serverId');
        if (!serverId) {
            return NextResponse.json({ message: 'serverId is required.', success: false }, { status: 400 })
        }
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id
            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true
                    },
                    orderBy: {
                        role: 'asc'
                    }
                }
            }
        })
        return NextResponse.json({ success: true, message: 'member kicked successfully.', server }, { status: 200 })
    } catch (error: any) {
        return NextResponse.json({ message: 'error while kicking the member.', error: error.message, success: false }, { status: 500 })
    }
}