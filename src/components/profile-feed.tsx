import { api } from "~/utils/api";

import { LoadingSpinner } from "./loading-spinner";
import { Post } from "./post";

type ProfileFeedProps = {
  userId: string;
};

export const ProfileFeed = ({ userId }: ProfileFeedProps) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({ userId });
  if (isLoading) {
    return (
      <div className="grid">
        <LoadingSpinner className="place-self-center" />
      </div>
    );
  }

  if (!data || data.length === 0) return <div>User has no posted yet!</div>;

  return (
    <div>
      {data.map((post) => (
        <Post key={post.post.id} {...post} />
      ))}
    </div>
  );
};
