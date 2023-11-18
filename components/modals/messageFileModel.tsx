'use client'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Button } from '../ui/button'
import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useModel } from '@/hooks/use-model-store'
import queryString from 'query-string'

const formSchema = z.object({
    fileUrl: z.string().min(1, {
        message: "Attachment is required."
    })
})

const MessageFileModel = () => {

    const router = useRouter();
    const { isOpen, onClose, type, data } = useModel()
    const { apiUrl, query } = data;
    const isModelOpen = isOpen && type === 'messageFile';

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fileUrl: ""
        }
    })

    const isLoading = form.formState.isSubmitting;

    const handleClose = () => {
        form.reset();
        onClose();
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = queryString.stringifyUrl({
                url: apiUrl || "",
                query,
            });
            await axios.post(url, { ...values, content: values.fileUrl })
            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Dialog open={isModelOpen} onOpenChange={handleClose} >
            <DialogContent className='bg-white text-black p-0 overflow-hidden' >
                <DialogHeader className='pt-8 px-6' >
                    <DialogTitle className='text-2xl text-center font-bold'>
                        Add an attachment
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8' >
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                    control={form.control}
                                    name='fileUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endPoint="messageFile"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className='bg-gray-500 px-6 py-4'>
                            <Button disabled={isLoading} variant={'primary'} >
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default MessageFileModel