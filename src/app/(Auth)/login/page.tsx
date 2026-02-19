"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Globe, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import logo from "../../../../public/images/logo.png";
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState('student');
    const [email, setEmail] = useState('dorman@example.com');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Login attempted', { userType, email, password, rememberMe });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center p-5">
            <div className="w-full max-w-md">
                <div className="flex justify-between items-center mb-5">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                    <Button variant="ghost">
                        <Globe className="h-4 w-4" />
                        <span className="text-sm">ES</span>
                    </Button>
                </div>
                <div className="flex justify-center mb-5">
                    <Image src={logo} alt="Lenguable Logo" height={60} width={200} className="object-contain" />
                </div>
                <Card className="shadow-xl border-0">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
                        <CardDescription className="text-center">Sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* User Type Tabs */}
                            <Tabs value={userType} onValueChange={setUserType} className="w-full">
                                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                                    <TabsTrigger value="student" className="data-[state=active]:bg-white">
                                        Student
                                    </TabsTrigger>
                                    <TabsTrigger value="teacher" className="data-[state=active]:bg-white">
                                        Teacher
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        placeholder="your@example.com"
                                    />
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10 pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={rememberMe}
                                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                                    />
                                    <label
                                        htmlFor="remember"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        Remember me
                                    </label>
                                </div>
                                <Button variant="link" className="text-[#A9F877] p-0 h-auto font-normal">
                                    Forgot Password?
                                </Button>
                            </div>

                            {/* Sign In Button */}
                            <Button
                                type="submit"
                                className="w-full bg-[#A9F877] text-gray-900 hover:bg-[#A9F877] font-semibold"
                                size="lg"
                            >
                                Sign in
                            </Button>

                            {/* Sign Up Link */}
                            <div className="text-center text-sm text-gray-600">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-[#A9F877] font-medium hover:underline">
                                    Sign Up
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
