"use client";
import { BskyAgent } from "@atproto/api";
import { Session } from "app/page";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
let agentAtom = atom<null | BskyAgent>(null);
export const useAgent = () => {
  let [agent] = useAtom(agentAtom);
  return agent;
};

export const BskyAgentProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) => {
  const [, setAgent] = useAtom(agentAtom);
  useEffect(() => {
    let agent = new BskyAgent({ service: "https://bsky.social" });
    agent.resumeSession(session);
    setAgent(agent);
  }, [session]);

  return <>{children}</>;
};
