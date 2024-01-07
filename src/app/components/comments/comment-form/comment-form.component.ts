import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { environment } from "../../../../environments/environment";

@Component({
  selector: "app-comment-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./comment-form.component.html",
  styleUrl: "./comment-form.component.css",
})
export class CommentFormComponent implements OnInit, OnDestroy {
  @Input() articleId?: string;
  @Input() parentId?: string;
  @Output() onCommentPosted = new EventEmitter<any>();
  isLoading = false;
  serverError = "";
  message: string = "";
  postCommentForm: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder
  ) {
    this.postCommentForm = this.formBuilder.group({
      "post-comment": [
        "",
        [
          Validators.required,
          Validators.pattern("[a-zA-Z0-9-_.!?;:'\"()\\s,]+"),
        ],
      ],
    });
  }

  ngOnDestroy(): void {
    this.message = "";
    this.serverError = "";
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.message = "";
    this.serverError = "";
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.serverError = "";
    if (!this.postCommentForm.valid) return;

    const commentData = {
      message: this.postCommentForm.get("post-comment")?.value,
      parentId: this.parentId,
    };

    this.handlePostComment(this.articleId!, commentData);
  }

  private handlePostComment(
    articleId: string,
    commentData: { message: string; parentId?: string }
  ): void {
    this.isLoading = true;
    this.http
      .post(
        `${environment.apiUrl}/articles/${articleId}/comments`,
        commentData,
        {
          headers: new HttpHeaders({ "Content-Type": "application/json" }),
          withCredentials: true,
        }
      )
      .subscribe({
        next: newComment => {
          this.isLoading = false;
          this.onCommentPosted.emit(newComment);
          this.postCommentForm.reset();
        },
        error: error => {
          this.isLoading = false;
          this.serverError =
            error.error.message ||
            "An error occurred while submitting the comment.";
        },
      });
  }

  getError(controlName: string): string {
    const control = this.postCommentForm.get(controlName);

    if (control?.touched) {
      if (!control?.value)
        return "This field is required if you want to post a comment";
      if (control?.errors?.["pattern"])
        return "This field contains invalid characters or is not in the correct format";
    }

    return "";
  }
}
