import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { environment } from "../../environments/environment";
import { Comment, ToggleLikeResponse } from "../@types/appTypes";

@Injectable({
  providedIn: "root",
})
export class CommentService {
  private http = inject(HttpClient);
  private headers = inject(HttpHeaders);

  postComment(
    articleId: string,
    commentData: { message: string; parentId?: string }
  ): Observable<{ message: string; parentId?: string }> {
    return this.http.post<{ message: string; parentId?: string }>(
      `${environment.apiUrl}/articles/${articleId}/comments`,
      commentData,
      {
        headers: this.headers.set("Content-Type", "application/json"),
        withCredentials: true,
      }
    );
  }

  editComment(
    articleId: string,
    commentId: string,
    commentData: { message: string }
  ): Observable<{ message: string }> {
    return this.http
      .put<{ message: string }>(
        `${environment.apiUrl}/articles/${articleId}/comments/${commentId}`,
        commentData,
        {
          headers: this.headers.set("Content-Type", "application/json"),
          withCredentials: true,
        }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as { message: string });
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
    return this.http.post<ToggleLikeResponse>(
      `${environment.apiUrl}/articles/${articleId}/comments/${commentId}/likes`,
      {},
      { withCredentials: true }
    ).pipe(
      catchError(error => {
        console.error(error);
        return of({} as ToggleLikeResponse);
      })
    );
  }
}
