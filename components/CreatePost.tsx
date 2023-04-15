"use client";
import { Session } from "app/page";
import { useState } from "react";
import { useAgent } from "./AgentProvider";

export function CreatePost(props: { session: Session }) {
  let agent = useAgent();
  let [text, setText] = useState("");
  const createPost = async () => {
    if (!agent) return;
    await agent.app.bsky.feed.post.create(
      { repo: props.session.did },
      { text, createdAt: new Date().toISOString() }
    );
  };
  return (
    <div className="flex flex-col">
      <textarea
        className="w-full border"
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
      />
      <button
        className="w-min border bg-grey-35"
        onClick={() => {
          createPost();
        }}
      >
        post
      </button>
    </div>
  );
}
