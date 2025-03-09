import React from "react";
import PollForm from "../components/pollform/PollForm.jsx";
import Vote from "../components/vote/Vote.jsx";
import Results from "../components/results/Results.jsx";

const Home = () => {
  return (
    <div>
      <h1>Live Polling System</h1>
      <PollForm />
      <Vote />
      <Results />
    </div>
  );
};

export default Home;
