"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import logo from "../../../../public/images/logo.png";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("English");

    const handleLanguageChange = (lang: string) => {
        setSelectedLanguage(lang);
    };

    return (
        <header className="w-full bg-[#EEFEE4] py-2 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-5">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src={logo}
                            alt="Lenguable Logo"
                            height={60}
                            width={200}
                            className="object-contain cursor-pointer"
                        />
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/pricing" className="font-semibold">
                            Our Pricing
                        </Link>
                        <Link href="/about-us" className="font-semibold">
                            About Us
                        </Link>
                        <Link href="/my-class" className="font-semibold">
                            My Class
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Language Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-1">
                                    <Globe className="w-4 h-4" />
                                    {selectedLanguage}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleLanguageChange("English")}>
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleLanguageChange("Spanish")}>
                                    Spanish
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Link href="/login" className="font-semibold">
                            Login
                        </Link>
                        <Link href="/signup">
                            <Button variant="outline" className="border-gray-300">
                                Sign Up
                            </Button>
                        </Link>
                        <Link href="/book">
                            <Button>Book Now</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100">
                    <div className="px-4 py-4 space-y-3 text-center">

                        {/* Navigation Links */}
                        <Link
                            href="/pricing"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block font-semibold"
                        >
                            Our Pricing
                        </Link>
                        <Link
                            href="/about"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block font-semibold"
                        >
                            About Us
                        </Link>
                        <Link
                            href="/my-class"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block font-semibold"
                        >
                            My Class
                        </Link>

                        {/* Mobile Language Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full flex items-center gap-1">
                                    <Globe className="w-4 h-4" />
                                    {selectedLanguage}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() => {
                                        handleLanguageChange("English");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    English
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        handleLanguageChange("Spanish");
                                        setMobileMenuOpen(false);
                                    }}
                                >
                                    Spanish
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Authentication Links */}
                        <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                                Login
                            </Button>
                        </Link>

                        <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full mt-3">
                                Sign Up
                            </Button>
                        </Link>

                        <Link href="/book" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full mt-3">Book Now</Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;