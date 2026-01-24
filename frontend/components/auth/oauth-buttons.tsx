'use client';

interface OAuthButtonsProps {
  onSignIn?: () => void;
}

export default function OAuthButtons({ onSignIn }: OAuthButtonsProps) {
  const handleGoogleSignIn = async () => {
    try {
      // Redirect to Better Auth Google OAuth endpoint
      window.location.href = '/api/auth/social/google';
      onSignIn?.();
    } catch (error) {
      console.error('Google sign in error:', error);
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      // Redirect to Better Auth GitHub OAuth endpoint
      window.location.href = '/api/auth/social/github';
      onSignIn?.();
    } catch (error) {
      console.error('GitHub sign in error:', error);
    }
  };

  return (
    <div className="mt-6 grid grid-cols-2 gap-3">
      <button
        onClick={handleGoogleSignIn}
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <span className="sr-only">Sign in with Google</span>
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
            fill="currentColor"
          />
        </svg>
      </button>

      <button
        onClick={handleGitHubSignIn}
        className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
      >
        <span className="sr-only">Sign in with GitHub</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
          />
        </svg>
      </button>
    </div>
  );
}