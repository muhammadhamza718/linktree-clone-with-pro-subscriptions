import LinkCard from './link-card';
import QRCodeComponent from './qr-code';

interface ProfileViewProps {
  profile: {
    id: string;
    userId: string;
    username: string;
    displayName: string;
    bio?: string;
    avatar?: string;
    avatarLayout?: 'classic' | 'hero';
    title?: string;
    themeId?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      email: string;
      name: string;
      emailVerified?: Date;
      image?: string;
      createdAt: Date;
      updatedAt: Date;
    };
    links: Array<{
      id: string;
      profileId: string;
      title: string;
      url: string;
      linkType?: string;
      thumbnail?: string;
      icon?: string;
      order: number;
      isVisible: boolean;
      isFeatured: boolean;
      githubRepo?: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
    richContentBlocks?: Array<{
      id: string;
      profileId: string;
      contentType: 'embed' | 'text' | 'form' | 'gallery';
      content: string;
      title?: string;
      position: number;
      isVisible: boolean;
      createdAt: Date;
      updatedAt: Date;
    }>;
    theme?: {
      id: string;
      name: string;
      userId?: string;
      presetName?: string;
      backgroundColor?: string;
      textColor?: string;
      linkColor?: string;
      buttonStyle?: string;
      buttonColor?: string;
      fontFamily?: string;
      fontSize?: string;
      isLightMode: boolean;
      createdAt: Date;
      updatedAt: Date;
    };
  };
}

export default function ProfileView({ profile }: ProfileViewProps) {
  const { displayName, bio, avatar, title, avatarLayout, links, theme, username } = profile;

  // Construct profile URL
  const profileUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://example.com'}/@${username}`;

  // Get default styles or use theme styles
  const bgStyle = theme?.backgroundColor ? { backgroundColor: theme.backgroundColor } : {};
  const textStyle = theme?.textColor ? { color: theme.textColor } : {};
  const linkStyle = theme?.linkColor ? { color: theme.linkColor } : {};

  return (
    <div
      className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6"
      style={bgStyle}
    >
      <div className="max-w-md w-full space-y-8">
        {/* Profile Header */}
        <div className="text-center">
          {avatar && (
            <div className={`mx-auto ${avatarLayout === 'hero' ? 'w-full max-w-2xl mb-6' : 'w-32 h-32 mb-4'}`}>
              <img
                className={`${avatarLayout === 'hero' ? 'w-full h-auto rounded-lg' : 'w-full h-full rounded-full object-cover'} border-4 border-white shadow-lg`}
                src={avatar}
                alt={displayName}
              />
            </div>
          )}

          <h1
            className="text-3xl font-bold mt-4"
            style={textStyle}
          >
            {displayName}
          </h1>

          {title && (
            <p
              className="mt-2 text-lg opacity-80"
              style={textStyle}
            >
              {title}
            </p>
          )}

          {bio && (
            <p
              className="mt-4 text-base opacity-90 max-w-md mx-auto"
              style={textStyle}
            >
              {bio}
            </p>
          )}
        </div>

        {/* Rich Content Blocks Section */}
        {profile.richContentBlocks && profile.richContentBlocks
          .filter(block => block.isVisible)
          .sort((a, b) => a.position - b.position)
          .map((block) => (
            <div key={block.id} className="mt-4">
              {block.contentType === 'embed' && (
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={block.content}
                    className="w-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    title={block.title || 'Embedded Content'}
                  />
                </div>
              )}
              {block.contentType === 'text' && (
                <div className="bg-white rounded-lg shadow p-4 mb-4 prose max-w-none">
                  <h3 className="text-lg font-medium text-gray-900">{block.title}</h3>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </div>
              )}
              {block.contentType === 'form' && (
                <div className="bg-white rounded-lg shadow p-4 mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{block.title}</h3>
                  <p>Rich content form would be rendered here</p>
                </div>
              )}
              {block.contentType === 'gallery' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <p>Gallery content would be rendered here</p>
                </div>
              )}
            </div>
          ))}

        {/* Links Section */}
        <div className="mt-8">
          {links.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>

        {/* QR Code for sharing */}
        <div className="mt-8">
          <QRCodeComponent url={profileUrl} />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm opacity-60">
          <p style={textStyle}>
            © {new Date().getFullYear()} {displayName}. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}