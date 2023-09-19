import { formatDistance } from "date-fns";
import { type RouterOutputs } from "~/utils/api";

import { ProfileImage } from "./profile-image";

type PostProps = RouterOutputs["posts"]["getAll"][number];

export const Post = ({ post, author }: PostProps) => {
  return (
    <div
      key={post.id}
      className="flex items-start gap-2 border-t border-solid border-t-slate-600 py-4"
    >
      <ProfileImage src={author.imageUrl ?? ""} className="mt-1" />
      <div className="grow">
        <div className="mb-1 flex items-baseline">
          <p className="font-bold">{author.username}</p>
          <p className="ml-auto whitespace-nowrap text-sm text-slate-500">
            {formatDistance(post.createdAt, Date.now(), { addSuffix: true })}
          </p>
        </div>
        <p className="text-2xl">{post.content}</p>
      </div>
    </div>
  );
};
