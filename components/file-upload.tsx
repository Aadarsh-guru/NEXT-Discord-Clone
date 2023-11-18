'use client'
import { FileIcon, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css"
import Image from "next/image";

interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endPoint: "serverImage" | "messageFile";
}

const FileUpload = ({ endPoint, value, onChange }: FileUploadProps) => {

    const fileType = value?.split(".").pop();

    if (value && fileType !== 'pdf') {
        return <div className="relative h-20 w-20">
            <Image fill src={value} alt="upload" className="rounded-full" />
            <button
                onClick={() => onChange("")}
                className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                type="button"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    }

    if (value && fileType === 'pdf') {
        return (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                <FileIcon className="w-10 h-10 fill-indigo-200 stroke-indigo-800 mr-2" />
                <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                >
                    {value}
                </a>
                <button
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-2 shadow-sm"
                    type="button"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    if (value && fileType === 'video') {
        return <div className="relative h-20 w-20">
            <video src={value} className="rounded-full h-full w-full" />
            <button
                onClick={() => onChange("")}
                className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                type="button"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    }


    return (
        <UploadDropzone
            endpoint={endPoint}
            onClientUploadComplete={(res) => {
                onChange(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                console.log(error);

            }}
        />
    )
}

export default FileUpload