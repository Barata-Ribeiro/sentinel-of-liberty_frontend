// User-related interfaces
export interface User {
  id: string;
  discordUsername: string;
  discordEmail: string;
  discordAvatar: string;
  sol_username?: string;
  sol_biography?: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
  newsSuggested?: number;
  articles?: number;
  comments?: number;
  likes?: number;
}

// News-related interfaces
interface News {
  id: string;
  user: SimpleUser;
  source: string;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface SimpleUser {
  id: string;
  username: string;
}

// Article-related interfaces
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

// Comment-related interfaces
interface Comment {
  id: string;
  user: SimpleUserWithAvatar;
  textBody: string;
  parentId?: string;
  likedByMe?: boolean;
  likeCount: number;
  wasEdited: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Comment[];
}

interface SimpleUserWithAvatar extends SimpleUser {
  avatar: string;
}

// Authentication-related interfaces
export interface AuthAppResponse {
  userInfo: {
    id: string;
    username: string;
  };
  authToken: string;
  refreshToken: string;
  message: string;
}

// Home page content interfaces
export interface HomeContentResponse {
  articles: Article[];
  suggestions: News[];
}

// User data fetch/editing interfaces
export interface UserDataResponse {
  profile: User;
  lastPublishedArticle: Article;
  lastSuggestedNews: News;
}

export interface EditDataRequest {
  sol_username?: string;
  sol_biography?: string;
}

// Suggestion-related interfaces
export interface SuggestionDataRequest {
  source: string;
  title: string;
  content: string;
  imageUrl: string;
}

export interface SuggestionDataResponse {
  id: string;
  user: SimpleUser;
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

// Article-related interfaces for listing and requests
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

// Interfaces for individual articles and comments
export interface CommentDataRequest {
  textBody: string;
  parentId?: string;
}

export interface ToggleLikeResponse {
  message: string;
  liked: boolean;
}

export interface IndividualArticleRequest {
  basedOnNewsSuggestion?: {
    id: string;
    title: string;
    source: string;
  };
  id: string;
  title: string;
  contentSummary: string;
  content: string;
  image: string;
  references: string[];
  createdAt: string;
  updatedAt: string;
  user: SimpleUserWithAvatar;
  comments: Comment[];
}
