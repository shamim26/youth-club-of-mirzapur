"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User as UserIcon, LogOut, Menu, LayoutDashboard } from "lucide-react";
import { signOut } from "@/app/auth/actions";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar({ user, role }: { user: User | null; role: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Gallery", href: "/gallery" },
    { name: "About", href: "/about" },
  ];

  const name =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = name.substring(0, 2).toUpperCase();

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border/40 shadow-sm py-0"
          : "bg-transparent py-2"
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[70vw] sm:w-[300px]">
                <SheetHeader className="text-center pb-6">
                  <SheetTitle>
                    <span className="bg-linear-to-br from-primary to-accent bg-clip-text text-2xl font-black tracking-tighter text-transparent">
                      Youth Club
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4 px-9">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base font-semibold transition-colors hover:text-primary ${
                          isActive ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Left Side: Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
          >
            <span className="bg-linear-to-br from-primary to-accent bg-clip-text text-2xl font-black tracking-tighter text-transparent">
              YCM
            </span>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative text-sm font-semibold transition-colors hover:text-primary ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Auth / Profile */}
        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 flex items-center gap-2 pl-2 pr-4 rounded-full border border-border/50 hover:bg-muted/50 transition-all"
                >
                  <Avatar className="h-7 w-7 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline-block">
                    {name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {role === "admin" || role === "super_admin" ? (
                  <DropdownMenuItem asChild>
                    <Link
                      href="/admin"
                      className="cursor-pointer whitespace-nowrap"
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                ) : null}
                <DropdownMenuItem asChild>
                  <Link
                    href="/profile"
                    className="cursor-pointer whitespace-nowrap"
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => signOut()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button className="rounded-full shadow-sm shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/30 active:translate-y-0 active:scale-95">
                Member Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
