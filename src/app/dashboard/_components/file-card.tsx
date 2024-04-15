import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Doc } from "../../../../convex/_generated/dataModel";

import { Text } from "lucide-react";
import { PiFilePdfBold, PiFileCsvBold, PiMicrosoftWordLogoFill, PiMicrosoftPowerpointLogoFill, PiMicrosoftExcelLogoFill, PiFileZipDuotone, PiFilePngDuotone, PiFileSvgDuotone } from "react-icons/pi";
import { SiJpeg } from "react-icons/si";
import { FaPython, FaFileAudio } from "react-icons/fa";
import { BsFiletypeMp4, BsFiletypeMov } from "react-icons/bs";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { formatRelative } from 'date-fns'

import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
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
        'mp4': <BsFiletypeMp4 />,
        'quicktime': <BsFiletypeMov />,
        'mpeg': <FaFileAudio />,
    } as unknown as Record<Doc<"files">["type"], ReactNode>;

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
                <div style={{ maxWidth: '100%', maxHeight: '100%', overflow: 'hidden' }} >
                    {
                        file.type === "png" && file.url &&
                        <Image src={file.url} alt={file.name} width="400" height="100" layout="responsive" />
                    }
                    {
                        file.type === "jpeg" && file.url &&
                        <Image src={file.url} alt={file.name} width="400" height="100" layout="responsive" />
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
                    {file.type === "mp4" && <BsFiletypeMp4 className="w-20 h-20" />}
                    {file.type === "quicktime" && <BsFiletypeMov className="w-20 h-20" />}
                    {file.type === "mpeg" && <FaFileAudio className="w-20 h-20" />}
                </div>
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