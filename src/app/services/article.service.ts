import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { environment } from "../../environments/environment";
import {
  ArticleDataRequest,
  ArticleListResponse,
  IndividualArticleRequest,
} from "../@types/appTypes";
import { CookieService } from "./cookie.service";

@Injectable({
  providedIn: "root",
})
export class ArticleService {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);

  private getHeaders(): HttpHeaders {
    const authToken = this.cookieService.getCookieString("authToken");
    let headers = new HttpHeaders({ "Content-Type": "application/json" });

    if (authToken)
      headers = headers.append("Authorization", `Bearer ${authToken}`);

    return headers;
  }

  getArticleById(id: string): Observable<IndividualArticleRequest> {
    return this.http
      .get<IndividualArticleRequest>(`${environment.apiUrl}/articles/${id}`, {
        headers: this.getHeaders(),
        withCredentials: true,
      })
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as IndividualArticleRequest);
        })
      );
  }

  getArticleList(
    page: number = 1,
    perPage: number = 10
  ): Observable<ArticleListResponse> {
    return this.http
      .get<ArticleListResponse>(
        `${environment.apiUrl}/articles?perPage=${perPage}&page=${page}`
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as ArticleListResponse);
        })
      );
  }

  postArticle(articleData: ArticleDataRequest): Observable<ArticleDataRequest> {
    return this.http
      .post<ArticleDataRequest>(`${environment.apiUrl}/articles`, articleData, {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        withCredentials: true,
      })
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as ArticleDataRequest);
        })
      );
  }
}
