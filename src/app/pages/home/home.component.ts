import { CommonModule, formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
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
  homeContentData: HomeContentResponse;

  constructor(
    private http: HttpClient,
    private timezoneService: TimezoneService
  ) {
    this.homeContentData = {
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
            discordUsername: "",
            sol_username: "",
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
  }

  ngOnDestroy(): void {
    this.homeContentData = {
      articles: [],
      suggestions: [],
    };
  }

  ngOnInit(): void {
    this.retrieveHomeData();
  }

  private retrieveHomeData(): void {
    this.http.get<HomeContentResponse>(`${environment.apiUrl}/home`).subscribe({
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
    });
  }

  private formatDataDate(dateString: string): string {
    const userDate = this.timezoneService.convertToUserTimezone(dateString);
    return formatDate(userDate, "dd MMMM yyyy", "en-US");
  }
}
