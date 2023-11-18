import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from 'uuid';
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";


export const POST = async (req: NextRequest) => {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        if (!profile) {
            return NextResponse.json({ success: false, message: 'unauthorised.' }, { status: 401 });
        }
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                inviteCode: uuid(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        })

        return NextResponse.json({ success: true, message: 'server created successfully.', server }, { status: 201 })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error?.message, message: 'error while creating the server.' }, { status: 500 })
    }
}