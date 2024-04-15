"use client";

import { Button } from "@/components/ui/button";
import {
    useOrganization,
    useUser
} from "@clerk/nextjs";

import {
    useMutation
} from "convex/react";

import { api } from "../../../../convex/_generated/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { useToast } from "@/components/ui/use-toast"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Doc } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
    title: z.string().min(1).max(200),
    file: z.custom<FileList>((val) => val instanceof FileList, "Required").refine((files) => files.length > 0, `Required`),
});

export default function UploadButton() {
    const { toast } = useToast();
    const organization = useOrganization();
    const user = useUser();
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            file: undefined,
        },
    });

    const fileRef = form.register('file');

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!orgId) return;

        const postUrl = await generateUploadUrl();

        const fileType = values.file[0].type;

        console.log(fileType);

        const result = await fetch(postUrl, {
            method: "POST",
            headers: { "Content-Type": fileType },
            body: values.file[0],
        });

        const { storageId } = await result.json();

        console.log(values.file[0].type);

        const types = {
            'image/png': "png",
            'image/jpeg': "jpeg",
            'application/pdf': "pdf",
            'text/csv': "csv",
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': "vnd.openxmlformats-officedocument.wordprocessingml.document",
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': "vnd.openxmlformats-officedocument.presentationml.presentation",
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': "vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            'text/x-python': 'x-python',
            'application/x-zip-compressed': 'x-zip-compressed',
            'text/plain': 'plain',
            'image/svg+xml': 'svg+xml',
            'video/mp4': 'mp4',
            'video/quicktime': 'quicktime',
            'audio/mpeg': 'mpeg',
        } as Record<string, Doc<"files">["type"]>;

        try {
            await createFile({
                name: values.title,
                fileId: storageId,
                orgId,
                type: types[fileType],
            })

            form.reset();

            setIsFileDialogOpen(false);

            toast({
                variant: "success",
                description: "File Uploaded Successfully",
            });

        } catch (err) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Error creating file"
            });
        };

    };

    let orgId: string | undefined = undefined;
    if (organization.isLoaded && user.isLoaded) {
        orgId = organization.organization?.id ?? user.user?.id;
    }

    const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

    const createFile = useMutation(api.files.createFile);

    return (
        <Dialog open={isFileDialogOpen} onOpenChange={(isOpen) => {
            setIsFileDialogOpen(isOpen);
            form.reset();
        }}>
            <DialogTrigger asChild>
                <Button>
                    Upload File
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="mb-4">Upload your file here</DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name of your file" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="file"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>File</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    {...fileRef}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit"
                                    disabled={form.formState.isSubmitting}
                                    className="flex gap-1"
                                >
                                    {form.formState.isSubmitting && (<Loader2 className="h-4 w-4 animate-spin" />)}
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
