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

  postReply() {
    // TODO: Implement post reply
  }

  editComment() {
    // TODO: Implement edit comment
  }

  deleteComment() {
    // TODO: Implement delete comment
  }

  toggleLike() {
    // TODO: Implement toggle like
  }
}
