// Define User interface
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

// Define responses and requests related to authentication
export interface AuthAppResponse {
  id: string;
  authToken: string;
  refreshToken: string;
}

// Define requests for the Home page
export interface HomeContentResponse {
  articles: Article[];
  suggestions: News[];
}

// Define requests for editing user data
export interface EditDataRequest {
  sol_username?: string;
  sol_biography?: string;
}

// Define requests, responses and listing for suggestions
export interface SuggestionDataRequest {
  source: string;
  title: string;
  content: string;
  imageUrl: string;
}

export interface SuggestionDataResponse {
  id: string;
  user: {
    id: Pick<User, "id">;
    username: Pick<User, "discordUsername" | "sol_username">;
  };
  source: string;
  title: string;
  content: string;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

interface News {
  id: string;
  user: Pick<User, "id" | "discordUsername" | "sol_username">;
  source: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListResponse {
  data: News[];
  page: number;
  perPage: number;
  next: string;
  prev: string;
}

// Define requests, responses and listing for articles
interface Article {
  userId: string;
  username: string;
  articleId: string;
  articleTitle: string;
  contentSummary: string;
  articleImage: string;
  articleCreatedAt: string;
  commentCount: number;
}

export interface ArticleDataRequest {
  title: string;
  imageUrl: string;
  content: string;
  references: string;
  basedOnNewsSuggestionId?: string | null;
}

export interface ArticleListResponse {
  data: Article[];
  page: number;
  perPage: number;
  next: string;
  prev: string;
}

// Define requests, responses and listing for individual articles and comments
interface Comment {
  id: string;
  user: Pick<User, "id" | "discordUsername" | "sol_username">;
  message: string;
  parentId?: string;
  likedByMe?: boolean;
  likeCount: number;
  wasEdited: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
}

export interface IndividualArticleRequest {
  basedOnNewsSuggestion?: Omit<News, "user">;
  id: string;
  title: string;
  contentSummary: string;
  content: string;
  image: string;
  references: string[];
  createdAt: string;
  updatedAt: string;
  user: Pick<User, "id" | "discordUsername" | "sol_username">;
  comments: Comment[];
}
