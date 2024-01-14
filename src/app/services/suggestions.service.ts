import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { environment } from "../../environments/environment";
import {
  ArticleListResponse,
  NewsListResponse,
  SuggestionDataRequest,
} from "../@types/appTypes";

@Injectable({
  providedIn: "root",
})
export class SuggestionsService {
  private http = inject(HttpClient);
  private headers = inject(HttpHeaders);

  getNewsSuggestionList(
    page: number = 1,
    perPage: number = 10
  ): Observable<NewsListResponse> {
    return this.http
      .get<NewsListResponse>(
        `${environment.apiUrl}/suggestions?perPage=${perPage}&page=${page}`
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as NewsListResponse);
        })
      );
  }

  postNewsSuggestion(newsData: SuggestionDataRequest) {
    return this.http
      .post<SuggestionDataRequest>(
        `${environment.apiUrl}/suggestions`,
        newsData,
        {
          headers: this.headers.set("Content-Type", "application/json"),
          withCredentials: true,
        }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as ArticleListResponse);
        })
      );
  }
}
