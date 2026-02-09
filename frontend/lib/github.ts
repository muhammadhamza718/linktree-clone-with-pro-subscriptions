/**
 * GitHub Integration Service
 * Handles fetching repository metadata from the GitHub API
 */

import { PrismaClient } from "@prisma/client";

export interface GitHubRepoMetadata {
  stars: number;
  forks: number;
  language: string;
  description: string;
  lastUpdated: string;
  owner: string;
  repo: string;
}

/**
 * Validates if a URL is a valid GitHub repository URL
 * @param url The URL to check
 * @returns boolean
 */
export function isValidGitHubRepoUrl(url: string): boolean {
  const githubRepoPattern =
    /^https?:\/\/(www\.)?github\.com\/[^/]+\/[^/]+(\/)?$/;
  return githubRepoPattern.test(url);
}

/**
 * Extract owner and repo from a GitHub URL
 * @param url The GitHub URL
 * @returns { owner: string, repo: string } | null
 */
export function extractGitHubRepoInfo(
  url: string,
): { owner: string; repo: string } | null {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) return null;
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
  };
}

/**
 * Fetches metadata for a GitHub repository
 * @param repoUrl Full URL to the GitHub repository (e.g., https://github.com/user/repo)
 * @returns Metadata object or null if fetch fails
 */
export async function fetchGitHubMetadata(
  repoUrl: string,
): Promise<GitHubRepoMetadata | null> {
  try {
    const repoInfo = extractGitHubRepoInfo(repoUrl);
    if (!repoInfo) return null;

    const { owner, repo } = repoInfo;

    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          // Optional: Add GITHUB_TOKEN here if rate limiting becomes an issue
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`GitHub repository not found: ${owner}/${repo}`);
      } else if (response.status === 403) {
        console.warn(`GitHub API rate limit exceeded`);
      } else {
        console.error(
          `GitHub API error: ${response.status} ${response.statusText}`,
        );
      }
      return null;
    }

    const data = await response.json();

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language || "N/A",
      description: data.description || "",
      lastUpdated: data.updated_at,
      owner: data.owner.login,
      repo: data.name,
    };
  } catch (error) {
    console.error("Error fetching GitHub metadata:", error);
    return null;
  }
}

/**
 * Updates a Link's GitHub metadata in the database
 * Validates the URL and updates the link description with stats
 */
export async function syncLinkGitHubMetadata(
  linkId: string,
  prisma: PrismaClient,
) {
  try {
    const link = await prisma.link.findUnique({
      where: { id: linkId },
      select: { url: true },
    });

    if (!link || !isValidGitHubRepoUrl(link.url)) return;

    const metadata = await fetchGitHubMetadata(link.url);

    if (metadata) {
      // Format stats for display in description
      // Icons: Star, Fork, Globe/Code
      const statsDisplay = `⭐ ${metadata.stars} | 🍴 ${metadata.forks} | ${metadata.language}`;

      // Append stats to description if not already present
      // Note: In a real app, you might want a dedicated JSON field for this
      // For now, we update the title or description to include stats

      await prisma.link.update({
        where: { id: linkId },
        data: {
          // We don't want to overwrite the user's custom title,
          // but we can append stats to the title or description if it's a GitHub link type
          // Assuming we use title for this display for now:
          title: `${metadata.owner}/${metadata.repo} (${statsDisplay})`,
        },
      });
    }
  } catch (error) {
    console.error(`Failed to sync GitHub metadata for link ${linkId}:`, error);
  }
}
