import { CommonModule, formatDate } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { NewsListResponse } from "../../../@types/appTypes";
import { SuggestionsService } from "../../../services/suggestions.service";
import { TimezoneService } from "../../../services/timezone.service";

@Component({
  selector: "app-news-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./news-list.component.html",
  styleUrl: "./news-list.component.css",
})
export class NewsListComponent implements OnInit, OnDestroy {
  private timezoneService = inject(TimezoneService);
  private suggestionsService = inject(SuggestionsService);
  private subscription = inject(Subscription);

  newsList = {} as NewsListResponse;
  currentPage: number = 1;
  perPage: number = 10;

  ngOnDestroy(): void {
    this.newsList = {} as NewsListResponse;
    this.currentPage = 1;
    this.perPage = 10;
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.retrieveNews();
  }

  private retrieveNews(page: number = 1): void {
    return this.subscription.add(
      this.suggestionsService
        .getNewsSuggestionList(page, this.perPage)
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
        })
    );
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
