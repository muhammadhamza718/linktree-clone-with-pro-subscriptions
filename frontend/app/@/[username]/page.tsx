import { notFound } from 'next/navigation';
import { Metadata } from 'next';
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
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: true,
        links: {
          orderBy: { order: 'asc' },
        },
        theme: true,
      },
    });

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
    // Fetch profile data from the database
    const profile = await prisma.profile.findUnique({
      where: { username },
      include: {
        user: true,
        links: {
          orderBy: { order: 'asc' },
        },
        theme: true,
      },
    });

    if (!profile) {
      notFound();
    }

    // Filter links based on scheduling and visibility
    const currentTime = new Date();
    const visibleLinks = profile.links.filter(link => isLinkVisible(link, currentTime));

    // Track profile view with enhanced analytics
    try {
      // Get visitor information for advanced analytics
      const ipAddress = 'temp_ip'; // Would get from request headers
      const userAgent = 'temp_user_agent'; // Would get from request headers
      const referrer = 'temp_referrer'; // Would get from request headers

      // Use the extended analytics event model with geolocation and device tracking
      await prisma.analyticsEvent.create({
        data: {
          profileId: profile.id,
          eventType: 'profile_view',
          ipAddress,
          userAgent,
          referrer,
          // Add advanced analytics fields for geolocation and device tracking
          country: 'temp_country', // Would get from IP geolocation
          city: 'temp_city', // Would get from IP geolocation
          deviceType: 'desktop', // Would get from user agent parsing
          browser: 'temp_browser', // Would get from user agent parsing
          os: 'temp_os', // Would get from user agent parsing
        },
      });
    } catch (error) {
      // Fail silently on analytics error
      console.error('Failed to log profile view:', error);
    }

    // Return profile with filtered visible links
    return (
      <ProfileView profile={{...profile, links: visibleLinks}} />
    );
  } catch (error) {
    console.error('Error loading profile:', error);
    notFound();
  }
}