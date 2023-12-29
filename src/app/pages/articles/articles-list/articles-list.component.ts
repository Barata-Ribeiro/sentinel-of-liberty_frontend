import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ArticleListResponse } from "../../../@types/appTypes";

@Component({
  selector: "app-articles-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./articles-list.component.html",
  styleUrl: "./articles-list.component.css",
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  articleList: ArticleListResponse;
  currentPage: number;
  perPage: number;

  constructor(private http: HttpClient) {
    this.articleList = {
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
    this.articleList = {
      data: [],
      page: 1,
      perPage: 10,
      next: "",
      prev: "",
    };
  }

  ngOnInit(): void {
    this.retrieveArticles();
  }

  private retrieveArticles(page: number = 1): void {
    this.http
      .get<ArticleListResponse>(
        `http://localhost:3000/api/v1/articles?perPage=${this.perPage}&page=${page}`
      )
      .subscribe({
        next: response => {
          this.articleList = {
            ...response,
            data: response.data.map(article => ({
              ...article,
              articleCreatedAt: this.formatNewsDate(article.articleCreatedAt),
            })),
          };
          this.currentPage = page;
        },
        error: error => console.error(error),
      });
  }

  private formatNewsDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    switch (true) {
      case diffInSeconds < 60:
        return "Published just now";
      case diffInSeconds < 3600:
        return `Published ${Math.floor(diffInSeconds / 60)} minutes ago`;
      case diffInSeconds < 86400:
        return `Published ${Math.floor(diffInSeconds / 3600)} hours ago`;
      case diffInSeconds < 2592000:
        return `Published ${Math.floor(diffInSeconds / 86400)} days ago`;
      case diffInSeconds < 31536000:
        return `Published ${Math.floor(diffInSeconds / 2592000)} months ago`;
      default:
        return `Published ${Math.floor(diffInSeconds / 31536000)} years ago`;
    }
  }

  goToPage(page: number): void {
    this.retrieveArticles(page);
  }

  hasNextPage(): boolean {
    return this.articleList.next !== null;
  }

  hasPreviousPage(): boolean {
    return this.articleList.prev !== null;
  }
}
