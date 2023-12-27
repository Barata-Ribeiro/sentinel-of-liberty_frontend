
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

export interface EditDataRequest {
  sol_username?: string;
  sol_biography?: string;
}

export interface SuggestionDataRequest {
  source: string;
  title: string;
  content: string;
  imageUrl: string;
}

private interface News {
  id: string;
  source: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "discordUsername" | "sol_username" | "discordAvatar">;
}

export interface NewsListResponse {
  data: News[];
  page: number;
  perPage: number;
  next: string;
  prev: string;
}

export interface ArticleDataRequest {
  title: string;
  imageUrl: string;
  content: string;
  references: string;
}
