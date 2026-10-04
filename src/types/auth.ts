export type UserRole = 'admin';

export type User = {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
};

export type Session = {
  user: User;
  token: string;
  expiresAt: string;
};
