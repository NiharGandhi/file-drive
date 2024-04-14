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
import { FileIcon, Loader2, StarIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./file-table";
import { columns } from "./columns";
import { Doc } from "../../../../convex/_generated/dataModel";

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
      <div className="w-full">
        {isLoading && (
          <div className="flex flex-col gap-6 mx-auto items-center justify-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-200"/>
            <div className="text-2xl justify-items-center text-gray-500 animate-pulse">
              Fetching your files...
            </div>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl font-bold">{title}</h1>
              <UploadButton />
            </div>
            <SearchBar query={query} setQuery={setQuery} />

            {files?.length === 0 && <Placeholder /> }

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 mt-6">
              {modifiedFiles?.map((file) => {
                return <FileCard key={file._id} file={file} />;
              })}
            </div>
          </>
            )} 
      </div>    
  );
}
