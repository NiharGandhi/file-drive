"use client";

import { Button } from "@/components/ui/button";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, Search } from "lucide-react";
import { Dispatch, SetStateAction } from "react";


const formSchema = z.object({
    query: z.string().min(0).max(200),
});

export function SearchBar({query, setQuery}: {
        query: string, 
        setQuery: Dispatch<SetStateAction<string>>;
    }) {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            query: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setQuery(values.query);
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Search of your file" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button 
                        size="sm"
                        type="submit"
                        disabled={form.formState.isSubmitting}
                        className="flex gap-1"
                    >
                        {form.formState.isSubmitting && (<Loader2 className="h-4 w-4 animate-spin" />)}
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            </Form>
        </div>
    )
}