import { CommonModule, formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { IndividualArticleRequest } from "../../../@types/appTypes";
import { TimezoneService } from "../../../services/timezone.service";

@Component({
  selector: "app-article",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./article.component.html",
  styleUrl: "./article.component.css",
})
export class ArticleComponent implements OnInit, OnDestroy {
  articleData: IndividualArticleRequest;

  constructor(
    private readonly titleService: Title,
    private route: ActivatedRoute,
    private http: HttpClient,
    private timezoneService: TimezoneService
  ) {
    this.articleData = {
      id: "",
      title: "",
      content: "",
      contentSummary: "",
      image: "",
      references: [],
      createdAt: "",
      updatedAt: "",
      user: {
        id: "",
        discordUsername: "",
        sol_username: "",
        discordAvatar: "",
      },
      comments: [],
    };
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.retrieveArticle(id);
  }

  ngOnDestroy(): void {
    this.articleData = {
      id: "",
      title: "",
      content: "",
      contentSummary: "",
      image: "",
      references: [],
      createdAt: "",
      updatedAt: "",
      user: {
        id: "",
        discordUsername: "",
        sol_username: "",
        discordAvatar: "",
      },
      comments: [],
    };
  }

  copyArticleLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  }

  formatArticleContent(content: string): string {
    return content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;")
      .replace(/\n/g, "<br/>")
      .replace(/\t/g, "&emsp;");
  }

  private retrieveArticle(id: string): void {
    this.http
      .get<IndividualArticleRequest>(`${environment.apiUrl}/articles/${id}`)
      .subscribe({
        next: response => {
          this.articleData = {
            ...response,
            createdAt: this.formatNewsDate(response.createdAt),
          };
          console.log(this.articleData);
          this.titleService.setTitle(`${this.articleData.title} | SoL`);
        },
        error: error => console.error(error),
      });
  }

  private formatNewsDate(dateString: string): string {
    const userDate = this.timezoneService.convertToUserTimezone(dateString);
    return formatDate(userDate, "MMMM dd, yyyy, h:mm a", "en-US");
  }
}
