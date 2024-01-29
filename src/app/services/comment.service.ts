import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { environment } from "../../environments/environment";
import {
  Comment,
  CommentDataRequest,
  ToggleLikeResponse,
} from "../@types/appTypes";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  private http = inject(HttpClient);

  postComment(
    articleId: string,
    commentData: CommentDataRequest
  ): Observable<CommentDataRequest> {
    return this.http
      .post<CommentDataRequest>(
        `${environment.apiUrl}/articles/${articleId}/comments`,
        commentData,
        {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          withCredentials: true,
        }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as CommentDataRequest);
        })
      );
  }

  editComment(
    articleId: string,
    commentId: string,
    commentData: { textBody: string }
  ): Observable<{ textBody: string }> {
    return this.http
      .put<{ textBody: string }>(
        `${environment.apiUrl}/articles/${articleId}/comments/${commentId}`,
        commentData,
        {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          withCredentials: true,
        }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as { textBody: string });
        })
      );
  }

  deleteComment(articleId: string, commentId: string): Observable<Comment> {
    return this.http
      .delete<Comment>(
        `${environment.apiUrl}/articles/${articleId}/comments/${commentId}`,
        { withCredentials: true }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as Comment);
        })
      );
  }

  toggleLike(
    articleId: string,
    commentId: string
  ): Observable<ToggleLikeResponse> {
    return this.http
      .post<ToggleLikeResponse>(
        `${environment.apiUrl}/articles/${articleId}/comments/${commentId}/likes`,
        {},
        { withCredentials: true }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as ToggleLikeResponse);
        })
      );
  }
}
