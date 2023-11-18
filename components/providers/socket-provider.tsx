"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from 'socket.io-client';

type SocketContextType = {
    socket: any | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    return useContext(SocketContext);
}

const SocketProvider = ({ children }: { children: React.ReactNode }) => {

    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstence = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
            path: "/api/socket/io",
            addTrailingSlash: false
        });
        socketInstence.on("connect", () => {
            setIsConnected(true);
        });
        socketInstence.on("disconnect", () => {
            setIsConnected(false);
        });
        setSocket(socketInstence);
        return () => {
            socketInstence?.disconnect();
        }
    }, [])

    return (
        <SocketContext.Provider
            value={{
                socket,
                isConnected
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider