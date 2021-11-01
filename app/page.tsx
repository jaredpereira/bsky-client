import { cookies } from "next/headers";
import {
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  BskyAgent,
} from "@atproto/api";
import {
  FeedViewPost,
  PostView,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { SourceViewDialog } from "../components/SourceViewDialog";
import { LoginForm } from "../components/LoginForm";

export default async function Page() {
  let token = cookies().get("token");
  if (!token) return <LoginForm />;
  let session = JSON.parse(token.value);
  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.resumeSession(session.data);
  let feed = await agent.app.bsky.feed.getTimeline({ limit: 20 });
  return (
    <div className="flex flex-col gap-4 pl-2">
      <a href="/logout">
        <button className="w-min">logout</button>
      </a>
      {feed.data.feed.map((data) => {
        return <FeedPost {...data} key={data.post.cid} />;
      })}
    </div>
  );
}

function FeedPost(props: FeedViewPost) {
  return (
    <div key={props.post.cid} className="flex flex-col gap-0.5">
      {props.reply?.parent && (
        <>
          {props.reply.parent.cid !== props.reply.root.cid && <div>root</div>}
          <Post {...props.reply.parent} record={props.reply.parent.record} />
        </>
      )}
      <div className={`${props.reply ? "pl-2" : ""}`}>
        <Post {...props.post} record={props.post.record} />
      </div>
    </div>
  );
}

function Post(
  props: Pick<PostView, "author" | "embed"> & { record: { text?: string } }
) {
  return (
    <div className="max-w-sm p-3 border flex-col gap-2">
      <div className="flex flex-row gap-2">
        <img className="w-8 h-8 rounded-full" src={props.author.avatar} />@
        {props.author.handle}
        <SourceViewDialog source={props} />
      </div>
      <pre className="whitespace-pre-wrap break-words">{props.record.text}</pre>

      {props.embed && <Embed {...props.embed} />}
    </div>
  );
}

function Embed(props: PostView["embed"]) {
  if (props?.$type === "app.bsky.embed.images") {
    let embed = props as AppBskyEmbedImages.View;
    return <img src={embed.images[0].fullsize} />;
  }
  if (props?.$type === "app.bsky.embed.record#view") {
    let embed = props as AppBskyEmbedRecord.View;
    let record = embed.record as AppBskyEmbedRecord.ViewRecord;
    return <Post {...record} record={record.value} />;
  }
  return null;
}
