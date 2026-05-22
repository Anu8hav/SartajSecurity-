"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-bg/95 backdrop-blur-sm border-b border-border"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-[family-name:var(--font-headline)] text-3xl tracking-[0.1em] text-gold group-hover:text-gold-light transition-colors">
              SARTAJ
            </span>
            <span className="hidden sm:inline label-accent text-muted text-[10px] mt-1">
              SECURITY
            </span>
          </Link>

          {/* Center nav – desktop */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`label-accent text-xs py-2 transition-all duration-300 border-b-2 ${
                  pathname === link.href
                    ? "text-gold border-gold"
                    : "text-muted border-transparent hover:text-text hover:border-gold/30"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <Link href="/contact" className="hidden md:block">
              <Button variant="outline" size="sm">
                Request Detail
              </Button>
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden flex flex-col gap-1.5 w-7 cursor-pointer"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="h-[2px] w-full bg-gold block"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-[2px] w-full bg-gold block"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="h-[2px] w-full bg-gold block"
              />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/98 backdrop-blur-md flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className={`font-[family-name:var(--font-headline)] text-5xl tracking-[0.1em] transition-colors ${
                    pathname === link.href ? "text-gold" : "text-text hover:text-gold"
                  }`}
                >
                  {link.label.toUpperCase()}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.3, duration: 0.3 }}
            >
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Request Detail
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
