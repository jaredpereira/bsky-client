"use client";
import {
  AppBskyEmbedImages,
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
} from "@atproto/api";
import {
  FeedViewPost,
  PostView,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAgent } from "./AgentProvider";
import { SourceViewDialog } from "./SourceViewDialog";

export function Feed(props: {
  initialValue: { feed: FeedViewPost[]; cursor?: string };
}) {
  let [data, setData] = useState(props.initialValue);
  let agent = useAgent();
  let fetching = useRef(false);
  return (
    <>
      {data.feed.map((data) => {
        return <FeedPost {...data} key={data.post.cid} />;
      })}
      <ListEnd
        grow={async () => {
          console.log({ fetching, agent });
          if (fetching.current || !agent) return;
          fetching.current = true;
          let feed = await agent.app.bsky.feed.getTimeline({
            limit: 20,
            cursor: data.cursor,
          });
          console.log(feed);
          setData((s) => ({
            feed: [...s.feed, ...feed.data.feed],
            cursor: feed.data.cursor,
          }));
          fetching.current = false;
        }}
      />
    </>
  );
}

function ListEnd(props: { grow: () => void }) {
  let ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    console.log("yoo");
    if (!ref.current) return;
    let observer = new IntersectionObserver(
      (entries) => {
        console.log("observing?");
        if (entries[0]?.isIntersecting) props.grow();
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [props.grow]);
  return (
    <div
      className="flex flex-col gap-2 w-full h-[50vh] -mt-[50vh] pointer-events-none"
      ref={ref}
    ></div>
  );
}

export function FeedPost(props: FeedViewPost) {
  let repostBy = props.reason?.by as { handle: string };
  return (
    <div key={props.post.cid} className="flex flex-col gap-0.5">
      {repostBy && <div>reposted by {repostBy.handle}</div>}
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
        <Link href={`/profile/${props.author.handle}`}>
          {props.author.handle}
        </Link>
        <SourceViewDialog source={props} />
      </div>
      <pre className="whitespace-pre-wrap break-words">{props.record.text}</pre>

      {props.embed && <Embed {...props.embed} />}
    </div>
  );
}

function Embed(props: PostView["embed"]) {
  let type = props?.$type as string;
  if (type.startsWith("app.bsky.embed.images")) {
    let embed = props as AppBskyEmbedImages.View;
    return <img src={embed.images[0].fullsize} />;
  }
  if (props?.$type === "app.bsky.embed.record#view") {
    let embed = props as AppBskyEmbedRecord.View;
    let record = embed.record as AppBskyEmbedRecord.ViewRecord;
    return <Post {...record} record={record.value} />;
  }

  if (props?.$type === "app.bsky.embed.recordWithMedia#view") {
    let embed = props as AppBskyEmbedRecordWithMedia.View;
    let record = embed.record.record as AppBskyEmbedRecord.ViewRecord;
    return <Post {...record} record={record.value} />;
  }

  return null;
}
