import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SideNav } from "./dashboard/side-nav";

export function Header() {
    return <div className="relative z-10 border-b py-4 bg-gray-50">
        <div className="items-center container mx-auto justify-between flex">
            <SignedIn>
                <div className="block lg:hidden">
                    <SideNav />
                </div>
            </SignedIn>
            <div>
                <Link href="/">
                    FileDive
                </Link>
            </div>
            <div className="flex gap-2">
                <OrganizationSwitcher />
                <UserButton />
                <div className="hidden">
                    <SignedIn>
                        <SignOutButton>
                            <Button>Sign Out</Button>
                        </SignOutButton>
                    </SignedIn>
                </div>
                <SignedOut>
                    <SignInButton mode="modal">
                        <Button>Sign In</Button>
                    </SignInButton>
                </SignedOut>
            </div>
        </div>
    </div>
}