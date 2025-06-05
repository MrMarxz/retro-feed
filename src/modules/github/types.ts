interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

interface GitHubCommitAuthor {
  name: string;
  email: string;
  date: string;
}

interface GitHubCommitTree {
  url: string;
  sha: string;
}

interface GitHubCommitVerification {
  verified: boolean;
  reason: string;
  signature: string | null;
  payload: string | null;
  verified_at: string | null;
}

interface GitHubCommitDetails {
  url: string;
  author: GitHubCommitAuthor;
  committer: GitHubCommitAuthor;
  message: string;
  tree: GitHubCommitTree;
  comment_count: number;
  verification: GitHubCommitVerification;
}

interface GitHubCommitParent {
  url: string;
  sha: string;
}

interface GitHubCommit {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: GitHubCommitDetails;
  author: GitHubUser;
  committer: GitHubUser;
  parents: GitHubCommitParent[];
}

export type GitHubCommitsResponse = GitHubCommit[];