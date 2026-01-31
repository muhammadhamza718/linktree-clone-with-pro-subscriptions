import { notFound } from "next/navigation";
import { Metadata } from "next";
import { headers } from "next/headers";
import prisma from "../../../lib/db";
import dynamic from "next/dynamic";
import { isLinkVisible } from "../../../lib/link-scheduling";

// Dynamically import ProfileView with loading component for performance
const ProfileView = dynamic(
  () => import("../../../components/public-profile/profile-view"),
  {
    loading: () => (
      <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full space-y-8">
          <div className="animate-pulse">
            <div className="rounded-full h-32 w-32 mx-auto bg-gray-200"></div>
            <div className="h-6 bg-gray-200 rounded mt-4"></div>
            <div className="h-4 bg-gray-200 rounded mt-2"></div>
            <div className="h-4 bg-gray-200 rounded mt-2 w-3/4 mx-auto"></div>
          </div>
        </div>
      </div>
    ),
  },
);

// Generate metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;

  try {
    // Check if this is a custom domain request
    const headersList = await headers();
    const host = headersList.get("host");
    let profile;

    if (host && !host.includes("localhost") && !host.includes(".vercel.app")) {
      // Try to find profile via custom domain first
      const customDomain = await prisma.customDomain.findUnique({
        where: { domain: host },
        include: {
          profile: {
            include: {
              user: true,
              links: {
                orderBy: { order: "asc" },
              },
              theme: true,
              customCss: {
                where: { isLive: true },
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      if (customDomain && customDomain.isVerified) {
        profile = customDomain.profile;
      }
    }

    // If no profile found via custom domain, fall back to username lookup
    if (!profile) {
      profile = await prisma.profile.findUnique({
        where: { username },
        include: {
          user: true,
          links: {
            orderBy: { order: "asc" },
          },
          richContentBlocks: {
            where: { isVisible: true },
            orderBy: { position: "asc" },
          },
          theme: true,
          customCss: {
            where: { isLive: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    if (!profile) {
      return {};
    }

    // Filter links based on scheduling and visibility
    const currentTime = new Date();
    const visibleLinks = profile.links.filter((link: any) =>
      isLinkVisible(link, currentTime),
    );

    const nameParts = profile.displayName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");

    return {
      title: `${profile.displayName} - ${profile.title || "Profile"}`,
      description: profile.bio || `${profile.displayName}'s profile`,
      openGraph: {
        title: `${profile.displayName} - ${profile.title || "Profile"}`,
        description: profile.bio || `${profile.displayName}'s profile`,
        type: "profile",
        username: profile.username,
        // @ts-ignore - Next.js types for OG profile fields can be strict
        firstName,
        lastName,
        images: [
          {
            url: profile.avatar || "/default-avatar.png",
            width: 120,
            height: 120,
            alt: profile.displayName,
          },
        ],
      },
      twitter: {
        card: "summary",
        title: `${profile.displayName} - ${profile.title || "Profile"}`,
        description: profile.bio || `${profile.displayName}'s profile`,
        images: profile.avatar ? [profile.avatar] : ["/default-avatar.png"],
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  try {
    // For custom domain support, we need to access headers differently in Next.js App Router
    const headersList = await headers();
    const host = headersList.get("host");

    let profile;

    if (host && !host.includes("localhost") && !host.includes(".vercel.app")) {
      // Try to find profile via custom domain first
      const customDomain = await prisma.customDomain.findUnique({
        where: { domain: host },
        include: {
          profile: {
            include: {
              user: true,
              links: {
                orderBy: { order: "asc" },
                include: {
                  linkVariants: true,
                },
              },
              theme: true,
              customCss: {
                where: { isLive: true },
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          },
        },
      });

      if (customDomain && customDomain.isVerified) {
        profile = customDomain.profile;
      }
    }

    // If no profile found via custom domain, fall back to username lookup
    if (!profile) {
      profile = await prisma.profile.findUnique({
        where: { username },
        include: {
          user: true,
          links: {
            orderBy: { order: "asc" },
            include: {
              linkVariants: true,
            },
          },
          richContentBlocks: {
            where: { isVisible: true },
            orderBy: { position: "asc" },
          },
          theme: true,
          customCss: {
            where: { isLive: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });
    }

    if (!profile) {
      notFound();
    }

    // Filter links and apply A/B test variants
    const currentTime = new Date();
    const { TrafficSplitter } =
      await import("../../../services/ab-testing/traffic-splitter");

    // Process links to apply A/B variants
    const processedLinks = await Promise.all(
      profile.links.map(async (link: any) => {
        if (!isLinkVisible(link, currentTime)) return null;

        // Check for A/B testing variants
        if (link.linkVariants && link.linkVariants.length > 0) {
          const variant = await TrafficSplitter.selectVariant(link.id);
          if (variant) {
            return {
              ...link,
              title: variant.title,
              // Keep track of variant ID for click tracking
              variantId: variant.id,
            };
          }
        }
        return link;
      }),
    );

    const visibleLinks = processedLinks.filter(Boolean);

    // Track profile view with advanced analytics (triggers webhooks)
    try {
      const { trackAnalyticsEvent } = await import("../../../lib/analytics");

      const ipAddress =
        headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headersList.get("x-real-ip") ||
        "unknown";
      const userAgent = headersList.get("user-agent") || "unknown";
      const referrer = headersList.get("referer") || "direct";

      await trackAnalyticsEvent({
        profileId: profile.id,
        eventType: "profile_view",
        ipAddress,
        userAgent,
        referrer,
      });
    } catch (error) {
      console.error("Failed to log profile view:", error);
    }

    // Return profile with filtered visible links and custom CSS
    return <ProfileView profile={{ ...profile, links: visibleLinks }} />;
  } catch (error) {
    console.error("Error loading profile:", error);
    notFound();
  }
}
