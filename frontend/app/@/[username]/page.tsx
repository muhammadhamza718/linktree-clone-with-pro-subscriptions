import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import prisma from '../../../../lib/db';
import dynamic from 'next/dynamic';
import { isLinkVisible } from '../../../../lib/link-scheduling';

// Dynamically import ProfileView with loading component for performance
const ProfileView = dynamic(() => import('../../../../components/public-profile/profile-view'), {
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
});

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const { username } = params;

  try {
    // Check if this is a custom domain request
    const host = request.headers.get('host');
    let profile;

    if (host && !host.includes('localhost') && !host.includes('.vercel.app')) {
      // Try to find profile via custom domain first
      const customDomain = await prisma.customDomain.findUnique({
        where: { domain: host },
        include: {
          profile: {
            include: {
              user: true,
              links: {
                orderBy: { order: 'asc' },
              },
              theme: true,
              customCss: {
                where: { isLive: true },
                orderBy: { createdAt: 'desc' },
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
            orderBy: { order: 'asc' },
          },
          richContentBlocks: {
            where: { isVisible: true },
            orderBy: { position: 'asc' },
          },
          theme: true,
          customCss: {
            where: { isLive: true },
            orderBy: { createdAt: 'desc' },
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
    const visibleLinks = profile.links.filter(link => isLinkVisible(link, currentTime));

    return {
      title: `${profile.displayName} - ${profile.title || 'Profile'}`,
      description: profile.bio || `${profile.displayName}'s profile`,
      openGraph: {
        title: `${profile.displayName} - ${profile.title || 'Profile'}`,
        description: profile.bio || `${profile.displayName}'s profile`,
        type: 'profile',
        profile: {
          firstName: profile.displayName.split(' ')[0],
          lastName: profile.displayName.split(' ').slice(1).join(' '),
        },
        images: [
          {
            url: profile.avatar || '/default-avatar.png',
            width: 120,
            height: 120,
            alt: profile.displayName,
          },
        ],
      },
      twitter: {
        card: 'summary',
        title: `${profile.displayName} - ${profile.title || 'Profile'}`,
        description: profile.bio || `${profile.displayName}'s profile`,
        images: profile.avatar || ['/default-avatar.png'],
      },
    };
  } catch (error) {
    return {};
  }
}

export default async function PublicProfilePage({ params }: { params: { username: string } }) {
  const { username } = params;

  try {
    // For custom domain support, we need to access headers differently in Next.js App Router
    // We'll use the headers function from next/headers
    const headersList = headers();
    const host = headersList.get('host');

    let profile;

    if (host && !host.includes('localhost') && !host.includes('.vercel.app')) {
      // Try to find profile via custom domain first
      const customDomain = await prisma.customDomain.findUnique({
        where: { domain: host },
        include: {
          profile: {
            include: {
              user: true,
              links: {
                orderBy: { order: 'asc' },
              },
              theme: true,
              customCss: {
                where: { isLive: true },
                orderBy: { createdAt: 'desc' },
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
            orderBy: { order: 'asc' },
          },
          richContentBlocks: {
            where: { isVisible: true },
            orderBy: { position: 'asc' },
          },
          theme: true,
          customCss: {
            where: { isLive: true },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      });
    }

    if (!profile) {
      notFound();
    }

    // Filter links based on scheduling and visibility
    const currentTime = new Date();
    const visibleLinks = profile.links.filter(link => isLinkVisible(link, currentTime));

    // Track profile view with enhanced analytics
    try {
      // Get visitor information for advanced analytics
      const ipAddress = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                       headersList.get('x-real-ip') || 'unknown';
      const userAgent = headersList.get('user-agent') || 'unknown';
      const referrer = headersList.get('referer') || 'direct';

      // Use the extended analytics event model with geolocation and device tracking
      await prisma.analyticsEvent.create({
        data: {
          profileId: profile.id,
          eventType: 'profile_view',
          ipAddress,
          userAgent,
          referrer,
          // Add advanced analytics fields for geolocation and device tracking
          country: 'temp_country', // Would get from IP geolocation service
          city: 'temp_city', // Would get from IP geolocation service
          deviceType: 'desktop', // Would get from user agent parsing
          browser: 'temp_browser', // Would get from user agent parsing
          os: 'temp_os', // Would get from user agent parsing
        },
      });
    } catch (error) {
      // Fail silently on analytics error to maintain performance
      console.error('Failed to log profile view:', error);
    }

    // Return profile with filtered visible links and custom CSS if available
    return (
      <ProfileView profile={{...profile, links: visibleLinks}} />
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    notFound();
  }
}