import { CommonModule, formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { NewsListResponse } from "../../../@types/appTypes";
import { TimezoneService } from "../../../services/timezone.service";

@Component({
  selector: "app-news-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./news-list.component.html",
  styleUrl: "./news-list.component.css",
})
export class NewsListComponent implements OnInit, OnDestroy {
  newsList: NewsListResponse;
  currentPage: number;
  perPage: number;

  constructor(
    private http: HttpClient,
    private timezoneService: TimezoneService
  ) {
    this.newsList = {
      data: [],
      page: 1,
      perPage: 10,
      next: "",
      prev: "",
    };

    this.currentPage = 1;
    this.perPage = 10;
  }

  ngOnDestroy(): void {
    this.newsList = {
      data: [],
      page: 1,
      perPage: 10,
      next: "",
      prev: "",
    };
  }

  ngOnInit(): void {
    this.retrieveNews();
  }

  private retrieveNews(page: number = 1): void {
    this.http
      .get<NewsListResponse>(
        `${environment.apiUrl}/suggestions?perPage=${this.perPage}&page=${page}`
      )
      .subscribe({
        next: response => {
          this.newsList = {
            ...response,
            data: response.data.map(news => ({
              ...news,
              createdAt: this.formatNewsDate(news.createdAt),
              user: {
                id: news.user.id,
                discordUsername: news.user.discordUsername,
                sol_username: news.user.sol_username,
              },
            })),
          };
          this.currentPage = page;
        },
        error: error => console.error(error),
      });
  }

  private formatNewsDate(dateString: string): string {
    const userDate = this.timezoneService.convertToUserTimezone(dateString);
    return formatDate(userDate, "dd MMMM yyyy", "en-US");
  }

  goToPage(page: number): void {
    this.retrieveNews(page);
  }

  hasNextPage(): boolean {
    return this.newsList.next !== null;
  }

  hasPreviousPage(): boolean {
    return this.newsList.prev !== null;
  }
}
