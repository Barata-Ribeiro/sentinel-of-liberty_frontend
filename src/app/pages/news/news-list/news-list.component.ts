import { CommonModule, formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { NewsListResponse } from "../../../@types/appTypes";

@Component({
  selector: "app-news-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./news-list.component.html",
  styleUrl: "./news-list.component.css",
})
export class NewsListComponent implements OnInit, OnDestroy {
  newsList: NewsListResponse;

  constructor(private http: HttpClient) {
    this.newsList = {
      data: [],
      page: 0,
      perPage: 0,
      next: "",
      prev: "",
    };
  }

  ngOnDestroy(): void {
    // TODO
  }

  ngOnInit(): void {
    this.retrieveNews();
  }

  private retrieveNews(): void {
    this.http
      .get<NewsListResponse>("http://localhost:3000/api/v1/suggestions")
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
                discordAvatar: news.user.discordAvatar,
                sol_username: news.user.sol_username,
              },
            })),
          };
          console.log(this.newsList);
        },
        error: error => {
          console.log(error);
        },
      });
  }

  private formatNewsDate(dateString: string): string {
    return formatDate(dateString, "dd MMMM yyyy", "en-US");
  }
}
