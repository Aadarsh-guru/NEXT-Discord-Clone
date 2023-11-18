'use client'
import { useEffect, useState } from 'react'
import CreateServerModel from '../modals/createServerModel'
import InviteModel from '../modals/inviteUserModel';
import EditServerModel from '../modals/editModel';
import ManageMEmbersModel from '../modals/manageMembersModel';
import CreateChannelModel from '../modals/createChannelModel';
import LeaveServerModel from '../modals/leaveServerModel';
import DeleteServerModel from '../modals/deleteServerModel';
import DeleteChannelModel from '../modals/deleteChannelModel';
import EditChannelModel from '../modals/editChannelModel';
import MessageFileModel from '../modals/messageFileModel';
import DeleteMessageModel from '../modals/deleteMessageModel';

const ModelProvider = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <CreateServerModel />
            <InviteModel />
            <EditServerModel />
            <ManageMEmbersModel />
            <CreateChannelModel />
            <LeaveServerModel />
            <DeleteServerModel />
            <DeleteChannelModel />
            <EditChannelModel />
            <MessageFileModel />
            <DeleteMessageModel />
        </>
    )
}

export default ModelProvider