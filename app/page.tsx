import { cookies } from "next/headers";
import { BskyAgent } from "@atproto/api";
import { LoginForm } from "../components/LoginForm";
import { Feed } from "../components/Feed";
import { CreatePost } from "components/CreatePost";
import { SourceViewDialog } from "components/SourceViewDialog";
import { BskyAgentProvider } from "components/AgentProvider";

export type Session = {
  refreshJwt: string;
  accessJwt: string;
  handle: string;
  did: string;
};

export default async function Page() {
  let token = cookies().get("token");
  if (!token) return <LoginForm />;
  let session = JSON.parse(token.value);
  const agent = new BskyAgent({ service: "https://bsky.social" });
  let result;
  try {
    result = await agent.resumeSession(session.data);
  } catch (e) {
    console.log(e);
    return <LoginForm />;
  }

  if (!result.success) {
    return <LoginForm />;
  }
  let feed = await agent.app.bsky.feed.getTimeline({ limit: 10 });
  return (
    <BskyAgentProvider session={session.data}>
      <div className="flex flex-col gap-4 pl-2">
        <a href="/logout">
          <button className="w-min">logout</button>
        </a>
        <SourceViewDialog source={session.data} />
        <CreatePost session={session.data} />
        <Feed initialValue={feed.data} session={session.data} />
      </div>
    </BskyAgentProvider>
  );
}
