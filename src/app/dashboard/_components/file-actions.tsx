import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    FileIcon,
    MoreVertical,
    StarIcon,
    TrashIcon,
    UndoIcon,
} from "lucide-react";

import { AiFillStar, AiOutlineDownload } from "react-icons/ai";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function DownloadButton({ downloadUrl, fileName }: { downloadUrl: string | null; fileName: string }) {
    return (
        downloadUrl && (
            <Button size="sm" className="gap-1">
                <a href={downloadUrl} download={`${fileName}`} className="bg-gray-900">
                    <AiOutlineDownload className="h-4 w-4" />
                </a>
            </Button>
        )
    );
}

export function FileCardActions({
    file,
    isFavorited,
}: {
    file: Doc<"files"> & { url: string | null };
    isFavorited: boolean;
}) {
    const deleteFile = useMutation(api.files.deleteFile);
    const restoreFile = useMutation(api.files.restoreFile);
    const toggleFavorite = useMutation(api.files.toggleFavorites);
    const { toast } = useToast();
    const me = useQuery(api.users.getMe);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleDownload = async () => {
        if (!file.url) return;

        toast({
            variant: "default",
            title: "Preparing your download",
            description: "Please wait while we prepare your download...",
        });

        try {
            const response = await fetch(file.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
            toast({
                variant: "success",
                title: "Download ready",
                description: "Your download is ready. Click the button to save the file.",
            });
        } catch (error) {
            console.error('Error fetching file:', error);
            toast({
                variant: "destructive",
                title: "Error downloading",
                description: "There was an error downloading the file. Please try again later.",
            });
        }
    };


    return (
        <>  
            <DownloadButton downloadUrl={downloadUrl} fileName={file.name} />
            <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will mark the file for our deletion process. Files are
                            deleted periodically
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await deleteFile({
                                    fileId: file._id,
                                });
                                toast({
                                    variant: "default",
                                    title: "File marked for deletion",
                                    description: "Your file will be deleted soon",
                                });
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <DropdownMenu>
                <DropdownMenuTrigger>
                    <MoreVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => {
                            if (!file.url) return;
                            window.open(file.url, "_blank");
                        }}
                        className="flex gap-1 items-center cursor-pointer"
                    >
                        <FileIcon className="w-4 h-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={handleDownload}
                        className="flex gap-1 items-center cursor-pointer"
                    >
                        <AiOutlineDownload className="h-4 w-4" />Download
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            toggleFavorite({
                                fileId: file._id,
                            });
                        }}
                        className="flex gap-1 items-center cursor-pointer"
                    >
                        {isFavorited ? (
                            <div className="flex text-yellow-500 gap-1 items-center">
                                <AiFillStar className="w-4 h-4" /> Unfavorite
                            </div>
                        ) : (
                                <div className="flex text-yellow-500 gap-1 items-center">
                                <StarIcon className="w-4 h-4" /> Favorite
                            </div>
                        )}
                    </DropdownMenuItem>

                    <Protect
                        condition={(check) => {
                            return (
                                check({
                                    role: "org:admin",
                                }) || file.userId === me?._id
                            );
                        }}
                        fallback={<></>}
                    >
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                if (file.shouldDelete) {
                                    restoreFile({
                                        fileId: file._id,
                                    });
                                } else {
                                    setIsConfirmOpen(true);
                                }
                            }}
                            className="flex gap-1 items-center cursor-pointer"
                        >
                            {file.shouldDelete ? (
                                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                                    <UndoIcon className="w-4 h-4" /> Restore
                                </div>
                            ) : (
                                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                                    <TrashIcon className="w-4 h-4" /> Delete
                                </div>
                            )}
                        </DropdownMenuItem>
                    </Protect>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}