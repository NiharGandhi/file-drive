"use client";
import { 
  useOrganization,
  useUser} from "@clerk/nextjs";

import { 
  useQuery } from "convex/react";
  
import { api } from "../../../../convex/_generated/api";

import UploadButton from "./upload-button";
import { FileCard } from "./file-card";
import Image from "next/image";

import EmptyPlaceHolderImage from "../../../../public/empty.svg";
import { Suspense, useState } from "react";
import { RowsIcon, Loader2, GridIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Placeholder() {
  return (
    <div className="flex flex-col gap-6 mx-auto items-center justify-center mt-24">
      <Image src={EmptyPlaceHolderImage} alt="Collection" width="400" height="400" />
      <div className="text-2xl justify-items-center">
        Let&apos;s Go, Upload some files.
      </div>
      <UploadButton />
    </div>
  )
}

export function FileBrowser({ title, favoritesOnly, deletedOnly }: { title: string, favoritesOnly?: boolean, deletedOnly?: boolean }) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  let orgId: string | undefined= undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;  
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  )

  const files = useQuery(
    api.files.getFiles,
    orgId
      ? {
        orgId,
        type: type === "all" ? undefined : type,
        query,
        favorites: favoritesOnly,
        deletedOnly,
      }
      : "skip"
  );

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  const isLoading = files === undefined

  return (
      <div>
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold">{title}</h1>
            <UploadButton />
          </div>
          <SearchBar query={query} setQuery={setQuery} />
        </div>
      
        <Tabs defaultValue="grid" className="mt-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="grid" className="flex gap-2 items-center">
                <GridIcon />
                Grid
              </TabsTrigger>
              <TabsTrigger value="table" className="flex gap-2 items-center">
                <RowsIcon /> Table
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2 w-10 lg:w-full lg:justify-end">
              {/* <Label htmlFor="type-select">Type Filter</Label> */}
              <Select
                value={type}
                onValueChange={(newType) => {
                  setType(newType as any);
                }}
              >
                <SelectTrigger id="type-select" className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="jpeg">JPG</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="vnd.openxmlformats-officedocument.wordprocessingml.document">Micorosoft Word</SelectItem>
                  <SelectItem value="vnd.openxmlformats-officedocument.presentationml.presentation">Micorosoft Powerpoint</SelectItem>
                  <SelectItem value="vnd.openxmlformats-officedocument.spreadsheetml.sheet">Micorosoft Excel</SelectItem>
                  <SelectItem value="x-python">Python</SelectItem>
                  <SelectItem value="x-zip-compressed">Zip</SelectItem>
                  <SelectItem value="plain">Text</SelectItem>
                  <SelectItem value="svg+xml">SVG</SelectItem>
                  <SelectItem value="mp4">MP4</SelectItem>
                  <SelectItem value="quicktime">MOV</SelectItem>
                  <SelectItem value="mpeg">MP3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading && (
            <div className="flex flex-col gap-6 mx-auto items-center justify-center mt-24">
              <Loader2 className="h-32 w-32 animate-spin text-gray-200" />
              <div className="text-2xl justify-items-center text-gray-500 animate-pulse">
                Fetching your files...
              </div>
            </div>
          )}
          <TabsContent value="grid">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 mt-6">
              {modifiedFiles?.map((file) => {
                return <FileCard key={file._id} file={file} />;
              })}
            </div>
          </TabsContent> 
          <TabsContent value="table">
            <DataTable columns={columns} data={modifiedFiles} />
          </TabsContent>
        </Tabs>

        {files?.length === 0 && <Placeholder /> }

      </div>    
  );
}
