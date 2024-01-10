import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  private http = inject(HttpClient);

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

  deleteComment(articleId: string, commentId: string) {
    return this.http.delete(
      `${environment.apiUrl}/articles/${articleId}/comments/${commentId}`,
      {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        withCredentials: true,
      }
    );
  }

  toggleLike(articleId: string, commentId: string) {
    return this.http.post(
      `${environment.apiUrl}/articles/${articleId}/comments/${commentId}/likes`,
      {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        withCredentials: true,
      }
    );
  }
}
