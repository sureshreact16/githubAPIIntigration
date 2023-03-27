import useGetHttpCalls from "./useGetHttpCalls";
import ConversationsTable from "./ConversationsTable";
import { GITHUB_API_BASE_URL } from "./apiUrls";

export default function Conversations({ owner, repo, data: issuesData }) {
  const pullRequestCommentUrls = issuesData.map((issue) => {
    return `${GITHUB_API_BASE_URL}/repos/${owner}/${repo}/pulls/${issue.number}/comments`;
  });

  const { data, loading, error } = useGetHttpCalls(pullRequestCommentUrls);

  if (loading) {
    return "Loading conversations...";
  }

  if (error) {
    return "Error fetching conversations.";
  }

  if (!data || data.length === 0) {
    return "No conversations found.";
  }

  return <ConversationsTable data={data} />;
}
