import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { Comment } from "../../../@types/appTypes";
import { AuthService } from "../../../services/auth.service";
import { CommentService } from "../../../services/comment.service";
import { TimezoneService } from "../../../services/timezone.service";
import { CustomToastrComponent } from "../../shared/custom-toastr/custom-toastr.component";
import { CommentFormComponent } from "../comment-form/comment-form.component";

@Component({
  selector: "app-comment",
  standalone: true,
  imports: [CommonModule, CommentFormComponent, MatIconModule],
  templateUrl: "./comment.component.html",
  styleUrl: "./comment.component.css",
  animations: [
    trigger("arrowAnimation", [
      state("up", style({ transform: "rotate(0)" })),
      state("down", style({ transform: "rotate(180deg)" })),
      transition("up <=> down", animate("200ms ease-in-out")),
    ]),
  ],
})
export class CommentComponent implements OnInit, OnDestroy {
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private timezoneService = inject(TimezoneService);
  private toastrService = inject(ToastrService);
  private subscription: Subscription = new Subscription();

  @Input() comment!: Comment;
  @Input() articleId!: string;
  @Input() isAuthenticated: boolean = false;

  @ViewChild(CommentFormComponent) commentFormComponent!: CommentFormComponent;

  protected replyMode = false;
  protected editMode = false;
  protected editedComment = "";
  protected isCommentVisible = true;
  protected currentUserRole: string | null = null;
  protected currentUserId: string | null = null;

  ngOnInit(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.currentUserId = this.authService.getCurrentUserId();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Show/hide comment replies
  toggleCommentVisibility() {
    this.isCommentVisible = !this.isCommentVisible;
  }

  getArrowState() {
    return this.isCommentVisible ? "up" : "down";
  }

  // Reply to a comment
  toggleReplyMode() {
    this.replyMode = !this.replyMode;
    this.editMode = false;
  }

  handleReply(newReply: Comment) {
    if (!this.comment.children) this.comment.children = [];
    newReply.createdAt = this.handleImmediateInteractionDate(
      newReply.createdAt,
      false
    );
    newReply.updatedAt = this.handleImmediateInteractionDate(
      newReply.updatedAt,
      true
    );
    this.comment.children = [...this.comment.children, newReply];
    this.replyMode = false;
  }

  // Edit own comment
  toggleEditMode() {
    this.editMode = !this.editMode;
    this.replyMode = false;
    this.editedComment = this.comment.textBody;
  }

  handleEdit(updatedComment: Comment) {
    updatedComment.createdAt = this.handleImmediateInteractionDate(
      updatedComment.createdAt,
      false
    );
    updatedComment.updatedAt = this.handleImmediateInteractionDate(
      updatedComment.updatedAt,
      true
    );
    this.comment = updatedComment;
    this.editMode = false;
  }

  // Allowing authenticated users to interact with comments
  canDeleteComment(commentUserId: string): boolean {
    return (
      this.currentUserRole === "admin" ||
      this.currentUserRole === "moderator" ||
      commentUserId === this.currentUserId
    );
  }

  canEditComment(commentUserId: string): boolean {
    return commentUserId === this.currentUserId;
  }

  // Deleting and liking comments
  handleDeleteComment(commentId: string) {
    return this.subscription.add(
      this.commentService.deleteComment(this.articleId, commentId).subscribe({
        next: () => {
          window.location.reload();
          this.toastrService.show("Comment deleted successfully.", "Success!", {
            toastComponent: CustomToastrComponent,
            toastClass:
              "shadow-[5px_5px_0px_0px_rgba(217,249,157)] max-w-sm rounded-lg border border-lime-200 bg-lime-100 dark:border-lime-900 dark:bg-lime-800/10 dark:text-lime-500",
            titleClass: "text-lime-800 font-bold text-lg",
            messageClass: "text-lime-800 font-medium text-normal",
          });
        },
        error: err => {
          console.error(err);
          this.toastrService.show(
            "An error occurred while deleting the comment.",
            "Error!",
            {
              toastComponent: CustomToastrComponent,
              toastClass:
                "max-w-xs rounded-lg border border-red-200 bg-red-100 text-sm text-red-800 shadow-[5px_5px_0px_0px_rgba(254,202,202)] dark:border-red-900 dark:bg-red-800/10 dark:text-red-500",
              titleClass: "text-red-800 font-bold text-lg",
              messageClass: "text-red-800 font-medium text-normal",
            }
          );
        },
      })
    );
  }

  handleLikeComment(commentId: string) {
    return this.subscription.add(
      this.commentService.toggleLike(this.articleId, commentId).subscribe({
        next: response => {
          this.comment.likedByMe = response.liked;
          this.comment.likeCount += response.liked ? 1 : -1;
        },
        error: err => {
          console.error(err);
          this.toastrService.show(
            "An error occurred while liking the comment.",
            "Error!",
            {
              toastComponent: CustomToastrComponent,
              toastClass:
                "max-w-xs rounded-lg border border-red-200 bg-red-100 text-sm text-red-800 shadow-[5px_5px_0px_0px_rgba(254,202,202)] dark:border-red-900 dark:bg-red-800/10 dark:text-red-500",
              titleClass: "text-red-800 font-bold text-lg",
              messageClass: "text-red-800 font-medium text-normal",
            }
          );
        },
      })
    );
  }

  private handleImmediateInteractionDate(
    dateString: string,
    editComment: boolean
  ): string {
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
}
