"use client";

import { Button } from "@/components/ui/button";
import { FileIcon, MenuIcon, StarIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
    { name: 'All Files', url: '/dashboard/files', icon: <FileIcon /> },
    { name: 'Favorites', url: '/dashboard/favorites', icon: <StarIcon /> },
    { name: 'Trash', url: '/dashboard/trash', icon: <Trash2 />}
];


export function SideNav() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav>
            <div className="hidden w-32 lg:flex flex-col gap-4">
                {navLinks.map((item, index) => {
                    return (
                        <Link className={`text-white font-bold hover:text-orange-400 ${pathname === item.url ? 'text-orange-600 !important' : ''}`}
                            href={item.url}
                            key={index}
                        >
                            <Button variant={"link"} className={`flex gap-2 hover:text-purple-700 ${pathname === item.url ? 'text-purple-600 !important' : ''}`}>
                                {item.icon}
                                {item.name}
                            </Button>
                        </Link>
                    )
                })}
            </div>

            <div className="flex gap-x-5 lg:hidden">
                    <button onClick={toggleMobileMenu}>
                        <MenuIcon />
                    </button>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-gray-100 z-50">
                    <div className="p-4">
                        <button onClick={toggleMobileMenu} className="text-gray-600">
                            Close
                        </button>
                    </div>
                    <div className="p-4">
                        {navLinks.map((item, index) => (
                            <Link
                                className={`block text-white font-bold px-4 py-2 hover:text-orange-600 ${pathname === item.url ? 'text-orange-500' : ''
                                    }`}
                                href={item.url}
                                key={index}
                                onClick={closeMobileMenu}
                            >
                                <Button
                                    variant={"link"}
                                    className={`flex gap-2 hover:text-purple-700 ${pathname === item.url ? 'text-purple-600 !important' : ''
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}