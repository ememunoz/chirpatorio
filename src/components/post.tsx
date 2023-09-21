import { formatDistance } from "date-fns";
import { type RouterOutputs } from "~/utils/api";

import { ProfileImage } from "./profile-image";
import Link from "next/link";

type PostProps = RouterOutputs["posts"]["getAll"][number];

export const Post = ({ post, author: { username, imageUrl } }: PostProps) => {
  const usernameHandle = `@${username}`;

  return (
    <div
      key={post.id}
      className="grid grid-cols-[max-content,1fr] gap-2 border-t border-solid border-t-slate-600 py-4"
    >
      <Link href={`/${usernameHandle}`} className="col-start-1 mt-1 self-start">
        <ProfileImage src={imageUrl ?? ""} />
      </Link>
      <div className="col-start-2">
        <div className="mb-1 flex items-baseline">
          <p className="font-bold">
            <Link href={`/${usernameHandle}`}>{usernameHandle}</Link>
          </p>
          <p className="ml-auto whitespace-nowrap text-sm text-slate-500">
            {formatDistance(post.createdAt, Date.now(), { addSuffix: true })}
          </p>
        </div>
        <Link
          href={`/${usernameHandle}/post/${post.id}`}
          className="text-left text-2xl"
        >
          <p>{post.content}</p>
        </Link>
      </div>
    </div>
  );
};
