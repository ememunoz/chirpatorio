import { type User } from "@clerk/backend";

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    imageUrl: user.imageUrl,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};