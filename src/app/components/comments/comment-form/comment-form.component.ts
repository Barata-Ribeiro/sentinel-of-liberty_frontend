import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  inject,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Subscription } from "rxjs";
import { CommentService } from "../../../services/comment.service";

@Component({
  selector: "app-comment-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./comment-form.component.html",
  styleUrl: "./comment-form.component.css",
})
export class CommentFormComponent implements OnInit, OnDestroy {
  private commentService = inject(CommentService);
  private formBuilder = inject(FormBuilder);
  private subscription = new Subscription();

  @Input() articleId: string | undefined;
  @Input() commentId?: string | undefined;
  @Input() parentId?: string;
  @Input() mode: "post" | "reply" | "edit" = "post";
  @Input() initialMessage: string = "";
  @Input() isAuthenticated: boolean = false;

  @Output() onCommentPosted = new EventEmitter<any>();

  protected isLoading = false;
  protected serverError = "";
  protected postMessage: string = "";
  protected postCommentForm: FormGroup;

  constructor() {
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

  ngOnInit(): void {
    this.isLoading = false;
    this.postMessage = "";
    this.serverError = "";

    if (this.mode === "edit")
      this.postCommentForm.patchValue({ "post-comment": this.initialMessage });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.serverError = "";
    if (!this.postCommentForm.valid) return;

    if (this.mode === "post")
      this.handlePostComment(this.articleId!, {
        textBody: this.postCommentForm.get("post-comment")?.value,
      });
    else if (this.mode === "reply")
      this.handlePostComment(this.articleId!, {
        textBody: this.postCommentForm.get("post-comment")?.value,
        parentId: this.parentId!,
      });
    else if (this.mode === "edit" && this.commentId)
      this.handleEditComment(this.articleId!, this.commentId!, {
        textBody: this.postCommentForm.get("post-comment")?.value,
      });
  }

  private handlePostComment(
    articleId: string,
    commentData: { textBody: string; parentId?: string }
  ): void {
    this.isLoading = true;

    return this.subscription.add(
      this.commentService.postComment(articleId, commentData).subscribe({
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
      })
    );
  }

  private handleEditComment(
    articleId: string,
    commentId: string,
    commentData: { textBody: string }
  ): void {
    this.isLoading = true;

    return this.subscription.add(
      this.commentService
        .editComment(articleId, commentId, commentData)
        .subscribe({
          next: editedComment => {
            this.isLoading = false;
            this.onCommentPosted.emit(editedComment);
            this.postCommentForm.reset();
          },
          error: error => {
            this.isLoading = false;
            this.serverError = this.serverError =
              error.error.message ||
              "An error occurred while updating the comment.";
          },
        })
    );
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
