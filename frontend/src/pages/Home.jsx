import React from "react";
import PollForm from "../components/PollForm";
import Vote from "../components/Vote";
import Results from "../components/Results";

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
