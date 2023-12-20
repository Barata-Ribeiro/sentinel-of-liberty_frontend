export interface User {
  id: string;
  discordUsername: string;
  discordEmail: string;
  discordAvatar: string;
  sol_username?: string;
  sol_biography?: string;
  role: string;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
  newsSuggested?: number;
  articles?: number;
  comments?: number;
  likes?: number;
}

export interface AuthAppResponse {
  id: string;
  authToken: string;
  refreshToken: string;
}
