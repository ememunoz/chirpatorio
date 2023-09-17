import { formatDistance } from "date-fns";

import { ProfileImage } from "./profile-image";

type PostProps = {
  post: {
    id: string;
    createdAt: Date;
    content: string;
    authorId: string;
  }
  author: {
    id: string;
    username: string | null;
    imageUrl: string;
  } | undefined
}

export const Post = ({ post, author }: PostProps) => {
  return (<div
    key={post.id}
    className="flex gap-2 py-4 border-t border-solid border-t-slate-600"
  >
    <ProfileImage src={author?.imageUrl ?? ''} className="mt-2" />
    <div className="grow">
      <p className="font-bold">{author?.username}</p>
      <p>{post.content}</p>
    </div>
    <p className="text-slate-500 text-sm">{formatDistance(post.createdAt, Date.now(), { addSuffix: true })}</p>
  </div>)
}