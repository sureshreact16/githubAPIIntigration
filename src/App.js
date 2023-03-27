import React from "react";
import "./App.css";
import useGetHttpCalls from "./useGetHttpCalls";
import Conversations from "./Conversations";

const App = () => {
  const owner = "owner";
  const repo = "rep";

  const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open`;

  const { data, loading, error } = useGetHttpCalls([url]);

  if (loading) {
    return "Loading...";
  }

  if (error) {
    return "Error...";
  }

  return (
    <div className="main-container">
      <h1>GitHub Pull Request Conversations</h1>
      {data?.length > 0 && (
        <div className="content">
          <Conversations owner={owner} repo={repo} data={data} />
        </div>
      )}
    </div>
  );
};

export default App;
