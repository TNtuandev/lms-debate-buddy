export type User = {
  id: string;
  email: string;
  name: string;
  type: UserType
  username: string
  fullName: string;
  avatarUrl: string
};

export enum UserType {
  LEARNER = "learner",
  INSTRUCTOR = "instructor",
}