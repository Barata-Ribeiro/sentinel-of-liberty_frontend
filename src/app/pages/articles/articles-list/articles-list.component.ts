import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { ArticleListResponse } from "../../../@types/appTypes";
import { ArticleService } from "../../../services/article.service";
import { TimezoneService } from "../../../services/timezone.service";

@Component({
  selector: "app-articles-list",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./articles-list.component.html",
  styleUrl: "./articles-list.component.css",
})
export class ArticlesListComponent implements OnInit, OnDestroy {
  private timezoneService = inject(TimezoneService);
  private articleService = inject(ArticleService);
  private subscription = inject(Subscription);

  protected articleList: ArticleListResponse = {
    data: [],
    page: 1,
    perPage: 10,
    next: "",
    prev: "",
  };
  protected currentPage: number = 1;
  protected perPage: number = 10;

  ngOnDestroy(): void {
    this.articleList = {
      data: [],
      page: 1,
      perPage: 10,
      next: "",
      prev: "",
    };

    this.currentPage = 1;
    this.perPage = 10;

    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.retrieveArticles();
  }

  private retrieveArticles(page: number = 1) {
    return this.subscription.add(
      this.articleService.getArticleList(page, this.perPage).subscribe({
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
      })
    );
  }

  private formatNewsDate(dateString: string): string {
    const userDate = this.timezoneService.convertToUserTimezone(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - userDate.getTime()) / 1000
    );

    switch (true) {
      case diffInSeconds < 60:
        return "Published just now";
      case diffInSeconds < 3600:
        return `Published ${Math.floor(diffInSeconds / 60)} minute(s) ago`;
      case diffInSeconds < 86400:
        return `Published ${Math.floor(diffInSeconds / 3600)} hour(s) ago`;
      case diffInSeconds < 2592000:
        return `Published ${Math.floor(diffInSeconds / 86400)} day(s) ago`;
      case diffInSeconds < 31536000:
        return `Published ${Math.floor(diffInSeconds / 2592000)} month(s) ago`;
      default:
        return `Published ${Math.floor(diffInSeconds / 31536000)} year(s) ago`;
    }
  }

  goToPage(page: number): void {
    this.retrieveArticles(page);
  }

  hasNextPage(): boolean {
    return this.articleList.next !== null && this.articleList.data.length > 0;
  }

  hasPreviousPage(): boolean {
    return this.articleList.prev !== null && this.articleList.data.length > 0;
  }
}
