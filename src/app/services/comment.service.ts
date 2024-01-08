import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  constructor(private http: HttpClient) {}

  postComment(
    articleId: string,
    commentData: { message: string; parentId?: string }
  ) {
    return this.http.post(
      `${environment.apiUrl}/articles/${articleId}/comments`,
      commentData,
      {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        withCredentials: true,
      }
    );
  }

  editComment(
    articleId: string,
    commentId: string,
    commentData: { message: string }
  ) {
    return this.http.put(
      `${environment.apiUrl}/articles/${articleId}/comments/${commentId}`,
      commentData,
      {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        withCredentials: true,
      }
    );
  }

  deleteComment() {
    // TODO: Implement delete comment
  }

  toggleLike() {
    // TODO: Implement toggle like
  }
}
