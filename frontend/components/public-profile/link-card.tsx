import { Link } from '../../../types';

interface LinkCardProps {
  link: Link;
}

export default function LinkCard({ link }: LinkCardProps) {
  const getLinkIcon = (type: string) => {
    switch (type) {
      case 'social':
        return '🔗';
      case 'email':
        return '📧';
      case 'phone':
        return '📞';
      case 'project':
        return '📂';
      default:
        return '🌐';
    }
  };

  const isExternalLink = (url: string) => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  return (
    <a
      href={link.url}
      target={isExternalLink(link.url) ? '_blank' : undefined}
      rel={isExternalLink(link.url) ? 'noopener noreferrer' : undefined}
      className={`block w-full p-4 mb-3 text-left rounded-lg border transition-all duration-200 ${
        link.isVisible
          ? 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50 hover:border-indigo-400 hover:shadow-md'
          : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-60'
      }`}
    >
      <div className="flex items-center">
        <span className="mr-3 text-xl" aria-label={`${link.linkType} link`}>
          {getLinkIcon(link.linkType || 'website')}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-base font-medium truncate">{link.title}</p>
          <p className="text-sm text-gray-500 truncate">{link.url}</p>
        </div>
      </div>
    </a>
  );
}