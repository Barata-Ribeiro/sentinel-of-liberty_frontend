import { CommonModule, formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription, catchError, of } from "rxjs";
import { environment } from "../../../environments/environment";
import { HomeContentResponse } from "../../@types/appTypes";
import { TimezoneService } from "../../services/timezone.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private timezoneService = inject(TimezoneService);
  private subscription: Subscription;

  protected homeContentData: HomeContentResponse = {
    articles: [
      {
        userId: "",
        username: "",
        articleId: "",
        articleTitle: "",
        contentSummary: "",
        articleImage: "",
        articleCreatedAt: "",
        commentCount: 0,
      },
    ],
    suggestions: [
      {
        id: "",
        user: {
          id: "",
          username: "",
        },
        source: "",
        title: "",
        content: "",
        image: "",
        createdAt: "",
        updatedAt: "",
      },
    ],
  };

  constructor() {
    this.subscription = new Subscription();
  }

  ngOnDestroy(): void {
    this.homeContentData = {} as HomeContentResponse;
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.retrieveHomeData();
  }

  private retrieveHomeData(): void {
    return this.subscription.add(
      this.http
        .get<HomeContentResponse>(`${environment.apiUrl}/home`)
        .pipe(
          catchError(error => {
            console.error(error);
            return of({} as HomeContentResponse);
          })
        )
        .subscribe({
          next: response => {
            this.homeContentData = {
              ...response,
              articles: response.articles.map(article => ({
                ...article,
                articleCreatedAt: this.formatDataDate(article.articleCreatedAt),
              })),
              suggestions: response.suggestions.map(suggestion => ({
                ...suggestion,
                createdAt: this.formatDataDate(suggestion.createdAt),
              })),
            };
          },
          error: error => console.error(error),
        })
    );
  }

  private formatDataDate(dateString: string): string {
    const userDate = this.timezoneService.convertToUserTimezone(dateString);
    return formatDate(userDate, "dd MMMM yyyy", "en-US");
  }
}
