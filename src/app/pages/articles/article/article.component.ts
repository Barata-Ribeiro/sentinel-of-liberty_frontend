import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-article",
  standalone: true,
  imports: [],
  templateUrl: "./article.component.html",
  styleUrl: "./article.component.css",
})
export class ArticleComponent implements OnInit, OnDestroy {
  articleData: any;

  constructor(
    private readonly titleService: Title,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.articleData = {};
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.retrieveArticle(id);
    }
  }

  ngOnDestroy(): void {
    this.articleData = {};
  }

  private retrieveArticle(id: string): void {
    this.http
      .get<any>(`http://localhost:3000/api/v1/articles/${id}`)
      .subscribe({
        next: response => {
          this.articleData = {
            ...response,
          };
          console.log(this.articleData);
          this.titleService.setTitle(`${this.articleData.title} | SoL`);
        },
        error: error => console.error(error),
      });
  }
}
