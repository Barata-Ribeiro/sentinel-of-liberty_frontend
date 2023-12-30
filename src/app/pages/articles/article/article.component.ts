import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { IndividualArticleRequest } from "../../../@types/appTypes";

@Component({
  selector: "app-article",
  standalone: true,
  imports: [],
  templateUrl: "./article.component.html",
  styleUrl: "./article.component.css",
})
export class ArticleComponent implements OnInit, OnDestroy {
  articleData: IndividualArticleRequest;

  constructor(
    private readonly titleService: Title,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.articleData = {
      id: "",
      title: "",
      content: "",
      contentSummary: "",
      image: "",
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

  private retrieveArticle(id: string): void {
    this.http
      .get<IndividualArticleRequest>(
        `http://localhost:3000/api/v1/articles/${id}`
      )
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
    return formatDate(dateString, "MMMM dd, yyyy, h:mm a", "en-US");
  }
}
