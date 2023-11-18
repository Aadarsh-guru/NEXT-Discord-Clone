'use client'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { useModel } from '@/hooks/use-model-store'
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Check, Copy, RefreshCw } from 'lucide-react';
import { useOrigin } from '@/hooks/use-origin';
import { useState } from 'react';
import axios from 'axios';

const InviteModel = () => {

    const [copied, setCopiend] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { onOpen, isOpen, onClose, type, data } = useModel();
    const origin = useOrigin();
    const { server } = data;
    const isModelOpen = isOpen && type === "invite";
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopiend(true);
        setTimeout(() => {
            setCopiend(false);
        }, 1000);
    }

    const onNew = async () => {
        try {
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}`);
            if (response.data?.success) {
                onOpen('invite', { server: response.data?.server });
            }
        } catch (error) {
            console.log();
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={onClose} >
            <DialogContent className='bg-white text-black p-0 overflow-hidden' >
                <DialogHeader className='pt-8 px-6' >
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70' >
                        Server invite link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            value={inviteUrl}
                            className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                        />
                        <Button
                            onClick={onCopy}
                            size='icon'
                        >
                            {!copied
                                ? <Copy className='w-4 h-4' />
                                :
                                <Check className='w-4 h-4' />}
                        </Button>
                    </div>
                    <div className="">
                        <Button
                            onClick={onNew}
                            disabled={isLoading}
                            className='text-sm mt-4 text-zinc-500'
                            variant={'link'}
                            size={'sm'}
                        >
                            Generate new link
                            <RefreshCw
                                className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`}
                            />
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InviteModel