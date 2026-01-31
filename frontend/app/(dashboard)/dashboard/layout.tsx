"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Link as LinkIcon,
  Palette,
  Webhook,
  Users,
  BarChart3,
  ShieldCheck,
  Image as ImageIcon,
} from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Links", href: "/dashboard/links", icon: LinkIcon },
    { name: "Themes", href: "/dashboard/themes", icon: Palette },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "A/B Testing", href: "/dashboard/ab-testing", icon: ShieldCheck },
    { name: "Webhooks", href: "/dashboard/webhooks", icon: Webhook },
    { name: "Team", href: "/dashboard/teams", icon: Users },
    { name: "Brand Kit", href: "/dashboard/brand-kit", icon: ImageIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center shrink-0 px-4 mb-8">
            <span className="text-2xl font-black text-indigo-600 tracking-tighter italic">
              Linktree<span className="text-gray-900 not-italic">Pro</span>
            </span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`mr-3 shrink-0 h-5 w-5 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <main className="flex-1 py-6">
          <div className="mx-auto px-4 sm:px-6 md:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
