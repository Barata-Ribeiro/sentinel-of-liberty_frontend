import { CommonModule, formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { Comment, IndividualArticleRequest } from "../../../@types/appTypes";
import { CommentFormComponent } from "../../../components/comments/comment-form/comment-form.component";
import { CommentComponent } from "../../../components/comments/comment/comment.component";
import { TimezoneService } from "../../../services/timezone.service";

@Component({
  selector: "app-article",
  standalone: true,
  imports: [CommonModule, CommentFormComponent, CommentComponent],
  templateUrl: "./article.component.html",
  styleUrl: "./article.component.css",
})
export class ArticleComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private timezoneService = inject(TimezoneService);

  articleData: IndividualArticleRequest;
  totalComments: number = 0;

  constructor(private readonly titleService: Title) {
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
      },
      comments: [],
    };
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) this.retrieveArticle(id);
    if (this.articleData.comments)
      this.totalComments = this.countComments(this.articleData.comments);
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

  onNewComment(newComment: Comment) {
    this.articleData.comments = [newComment, ...this.articleData.comments];
  }

  private retrieveArticle(id: string): void {
    this.http
      .get<IndividualArticleRequest>(`${environment.apiUrl}/articles/${id}`)
      .subscribe({
        next: response => {
          this.articleData = {
            ...response,
            comments: this.editCommentResponse(
              response.comments.filter(comment => !comment.parentId)
            ),
            createdAt: this.formatNewsDate(response.createdAt),
          };
          console.log(this.articleData);
          this.titleService.setTitle(`${this.articleData.title} | SoL`);
        },
        error: error => console.error(error),
      });
  }

  private countComments(comments: Comment[]): number {
    let count = comments.length;
    for (let comment of comments) {
      count += this.countComments(comment.children || []);
    }
    return count;
  }

  private formatNewsDate(dateString: string): string {
    const userDate = this.timezoneService.convertToUserTimezone(dateString);
    return formatDate(userDate, "MMMM dd, yyyy, h:mm a", "en-US");
  }

  private formatCommentDate(dateString: string, editComment: boolean): string {
    const userDate = this.timezoneService.convertToUserTimezone(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor(
      (now.getTime() - userDate.getTime()) / 1000
    );

    switch (true) {
      case diffInSeconds < 60:
        return `${editComment ? "Edited" : "Posted"} just now`;
      case diffInSeconds < 3600:
        return `${editComment ? "Edited" : "Posted"} ${Math.floor(
          diffInSeconds / 60
        )} minute(s) ago`;
      case diffInSeconds < 86400:
        return `${editComment ? "Edited" : "Posted"} ${Math.floor(
          diffInSeconds / 3600
        )} hour(s) ago`;
      case diffInSeconds < 2592000:
        return `${editComment ? "Edited" : "Posted"} ${Math.floor(
          diffInSeconds / 86400
        )} day(s) ago`;
      case diffInSeconds < 31536000:
        return `${editComment ? "Edited" : "Posted"} ${Math.floor(
          diffInSeconds / 2592000
        )} month(s) ago`;
      default:
        return `${editComment ? "Edited" : "Posted"} ${Math.floor(
          diffInSeconds / 31536000
        )} year(s) ago`;
    }
  }

  private editCommentResponse(comments: Comment[]): Comment[] {
    return comments.map(comment => {
      return {
        ...comment,
        createdAt: this.formatCommentDate(comment.createdAt, false),
        updatedAt: this.formatCommentDate(comment.updatedAt, true),
        children: comment.children
          ? this.editCommentResponse(comment.children)
          : [],
      };
    });
  }
}
