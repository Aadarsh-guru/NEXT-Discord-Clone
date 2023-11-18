import { Hash, Mic, Video } from 'lucide-react';
import React from 'react'
import MobileToggle from '../mobile-toggle';
import UserAvatar from '../user-avatar';
import SocketIndicator from '../socket-indicator';
import { ChatVideoButton } from './ChatVideoButton';
import { ChannelType } from '@prisma/client';

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?: string;
    channelType?: ChannelType
}

const ChatHeader = ({ serverId, name, type, imageUrl, channelType }: ChatHeaderProps) => {

    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <MobileToggle
                serverId={serverId}
            />
            {type === 'channel' && (
                channelType === 'TEXT' ? <Hash className=' mr-2' /> : channelType === 'AUDIO' ? <Mic className=' mr-2' /> : <Video className=' mr-2' />
            )}
            {type === 'conversation' && (
                <UserAvatar
                    src={imageUrl}
                    className='h-8 w-8 md:h-8 md:w-8 mr-2'
                />
            )}
            <p className='font-semibold text-md text-black dark:text-white capitalize' >
                {name}
            </p>
            <div className="ml-auto flex items-center">
                {type === 'conversation' && (
                    <ChatVideoButton />
                )}
                <SocketIndicator />
            </div>
        </div>
    )
}

export default ChatHeader