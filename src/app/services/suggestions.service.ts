import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, asyncScheduler, catchError, scheduled } from "rxjs";
import { environment } from "../../environments/environment";
import {
  ArticleListResponse,
  NewsListResponse,
  SuggestionDataRequest,
  SuggestionDataResponse,
} from "../@types/appTypes";

@Injectable({
  providedIn: "root",
})
export class SuggestionsService {
  private http = inject(HttpClient);

  getSuggestionById(id: string): Observable<SuggestionDataResponse> {
    return this.http
      .get<SuggestionDataResponse>(`${environment.apiUrl}/suggestions/${id}`)
      .pipe(
        catchError(error => {
          console.error(error);
          return scheduled([{} as SuggestionDataResponse], asyncScheduler);
        })
      );
  }

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
          return scheduled([{} as NewsListResponse], asyncScheduler);
        })
      );
  }

  postNewsSuggestion(newsData: SuggestionDataRequest) {
    return this.http
      .post<SuggestionDataRequest>(
        `${environment.apiUrl}/suggestions`,
        newsData,
        {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          withCredentials: true,
        }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return scheduled([{} as ArticleListResponse], asyncScheduler);
        })
      );
  }
}
