'use client'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { useModel } from '@/hooks/use-model-store'
import { useState } from 'react';
import { Button } from '../ui/button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const DeleteServerModel = () => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onClose, type, data } = useModel();
    const { server } = data;
    const isModelOpen = isOpen && type === "deleteServer";

    const onDelete = async () => {
        try {
            setIsLoading(true);
            const response = await axios.delete(`/api/servers/${server?.id}`)
            if (response.data?.success) {
                onClose();
                router.refresh();
                router.push(`/`);
            }
        } catch (error) {
            console.log(error);

        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={onClose} >
            <DialogContent className='bg-white text-black p-0 overflow-hidden' >
                <DialogHeader className='pt-8 px-6' >
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Delete Server
                    </DialogTitle>
                    <DialogDescription
                        className='text-center text-zinc-500'
                    >
                        Are you sure you want to do this ? <br />
                        <span className='font-semibold mr-1 text-indigo-500' >
                            {server?.name}
                        </span>
                        will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter
                    className='bg-gray-100 px-6 py-4'
                >
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={() => onClose()}
                            variant={'ghost'}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isLoading}
                            variant='primary'
                            onClick={() => onDelete()}
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteServerModel