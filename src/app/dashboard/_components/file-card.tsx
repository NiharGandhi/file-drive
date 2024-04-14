import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Doc, Id } from "../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Download, EllipsisVertical, Text, Trash2, Undo2Icon } from "lucide-react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { PiFilePdfBold, PiFileCsvBold, PiMicrosoftWordLogoFill, PiMicrosoftPowerpointLogoFill, PiMicrosoftExcelLogoFill, PiFileZipDuotone, PiFilePngDuotone, PiFileJpgBold, PiFileSvgDuotone } from "react-icons/pi";
import { SiJpeg } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { format, formatDistance, formatRelative, subDays } from 'date-fns'

import { ReactNode, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Protect } from "@clerk/nextjs";
import { FileCardActions } from "./file-actions";

export function FileCard({ 
    file,  
    }: { 
        file: Doc<"files"> & { isFavorited: boolean; url: string | null };
    }) {
    const userProfile = useQuery(api.files.getUserProfile, {
        userId: file.userId,
    })

    const typeIcons = {
        'png': <PiFilePngDuotone />,
        'jpeg': <SiJpeg />,
        'pdf': <PiFilePdfBold />,
        'csv': <PiFileCsvBold />,
        'vnd.openxmlformats-officedocument.wordprocessingml.document': <PiMicrosoftWordLogoFill />,
        'vnd.openxmlformats-officedocument.presentationml.presentation': <PiMicrosoftPowerpointLogoFill />,
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet': <PiMicrosoftExcelLogoFill />,
        'x-python': <FaPython />,
        'x-zip-compressed': <PiFileZipDuotone />,
        'plain': <Text />,
        'svg+xml': <PiFileSvgDuotone />,
    } as unknown as Record<Doc<"files">["type"], ReactNode>;

    // const isFavorited = favorites.some((favorite) => favorite.fileId === file._id);

    return (
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2 text-lg font-normal items-center">
                    <div className="flex justify-center items-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2">
                    <FileCardActions isFavorited={file.isFavorited} file={file} />
                </div>
                {/* <CardDescription>Card Description</CardDescription> */}
            </CardHeader>
            <CardContent className="h-[150px] flex justify-center items-center">
                {
                    file.type === "png" && file.url &&
                    <Image src={file.url} alt={file.name} width="400" height="100"  />
                }
                {
                    file.type === "jpeg" && file.url &&
                    <Image src={file.url} alt={file.name} width="500" height="100" />
                }
                
                {file.type === "pdf" && <PiFilePdfBold className="w-20 h-20" />}
                {file.type === "csv" && <PiFileCsvBold className="w-20 h-20" />}
                {file.type === "vnd.openxmlformats-officedocument.wordprocessingml.document" && <PiMicrosoftWordLogoFill className="w-20 h-20" />}
                {file.type === "vnd.openxmlformats-officedocument.presentationml.presentation" && <PiMicrosoftPowerpointLogoFill className="w-20 h-20" />}
                {file.type === "vnd.openxmlformats-officedocument.spreadsheetml.sheet" && <PiMicrosoftExcelLogoFill className="w-20 h-20" />}
                {file.type === "x-python" && <FaPython className="w-20 h-20" />}
                {file.type === "x-zip-compressed" && <PiFileZipDuotone className="w-20 h-20" />}
                {file.type === "plain" && <Text className="w-20 h-20" />}
                {file.type === "svg+xml" && <PiFileSvgDuotone className="w-20 h-20" />}
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex gap-2 text-[14px] text-gray-700 w-60 items-center">
                    <Avatar className="w-6 h-6">
                        <AvatarImage src={userProfile?.image} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    {userProfile?.name}
                </div>
                <div className="text-xs text-gray-800 items-center">
                    Uploaded On {formatRelative(new Date(file._creationTime), new Date())}
                </div>
            </CardFooter>
        </Card>

    )
}