/**
 * GitHub Integration Service
 * Handles fetching repository metadata from the GitHub API
 */

export interface GitHubRepoMetadata {
  stars: number;
  forks: number;
  language: string;
  description: string;
  lastUpdated: string;
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
    // Extract owner and repo name from URL
    const urlPattern = /github\.com\/([^/]+)\/([^/]+)/;
    const match = repoUrl.match(urlPattern);

    if (!match) return null;

    const owner = match[1];
    const repo = match[2].replace(/\.git$/, "");

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
      console.error(
        `GitHub API error: ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const data = await response.json();

    return {
      stars: data.stargazers_count,
      forks: data.forks_count,
      language: data.language || "N/A",
      description: data.description || "",
      lastUpdated: data.updated_at,
    };
  } catch (error) {
    console.error("Error fetching GitHub metadata:", error);
    return null;
  }
}

/**
 * Updates a Link's GitHub metadata in the database
 */
export async function syncLinkGitHubMetadata(linkId: string, prisma: any) {
  const link = await prisma.link.findUnique({
    where: { id: linkId },
    select: { url: true, githubRepo: true },
  });

  if (!link || (!link.githubRepo && !link.url.includes("github.com"))) return;

  const repoUrl = link.githubRepo || link.url;
  const metadata = await fetchGitHubMetadata(repoUrl);

  if (metadata) {
    // Store metadata in a JSON field if we had one, or update description/title
    // For now, we'll assume we want to update the link's description if it's empty
    // and store the stats in the description or a new field if added to schema

    // According to SRD Milestone 3.3.1, we should display stars, forks, language.
    // We can store this in the 'description' field as a fallback if no special field exists.
    const statsStr = `⭐ ${metadata.stars} | 🍴 ${metadata.forks} | 🌐 ${metadata.language}`;

    await prisma.link.update({
      where: { id: linkId },
      data: {
        description: `${metadata.description}\n\n${statsStr}`,
        updatedAt: new Date(),
      },
    });
  }
}
