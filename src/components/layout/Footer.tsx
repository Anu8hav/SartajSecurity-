import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block">
              <span className="font-[family-name:var(--font-headline)] text-3xl tracking-[0.1em] text-gold">
                SARTAJ
              </span>
              <span className="label-accent text-muted text-[10px] ml-2">
                SECURITY
              </span>
            </Link>
            <p className="text-muted text-sm mt-4 max-w-xs leading-relaxed">
              Elite protection services for corporations, high-profile events,
              and individuals who demand the highest standard of security.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="label-accent text-gold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/gallery", label: "Gallery" },
                { href: "/contact", label: "Contact" },
                { href: "/admin/dashboard", label: "Admin Portal" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted text-sm hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="label-accent text-gold mb-6">Contact</h4>
            <ul className="space-y-3 text-muted text-sm">
              <li>
                <span className="text-text">Phone:</span> +91 (011) 4567-8901
              </li>
              <li>
                <span className="text-text">Email:</span>{" "}
                ops@sartajsecurity.com
              </li>
              <li>
                <span className="text-text">HQ:</span> New Delhi, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="gold-divider mt-12 mb-8" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-muted text-xs">
            © {new Date().getFullYear()} Sartaj Security. All rights reserved.
          </p>
          <p className="text-muted text-xs label-accent">
            Verified Protection Since 2010
          </p>
        </div>
      </div>
    </footer>
  );
}
