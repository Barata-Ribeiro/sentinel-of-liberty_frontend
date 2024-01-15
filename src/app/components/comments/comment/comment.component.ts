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
import { Subscription } from "rxjs";
import { Comment } from "../../../@types/appTypes";
import { AuthService } from "../../../services/auth.service";
import { CommentService } from "../../../services/comment.service";
import { TimezoneService } from "../../../services/timezone.service";
import { CommentFormComponent } from "../comment-form/comment-form.component";

@Component({
  selector: "app-comment",
  standalone: true,
  imports: [CommonModule, CommentFormComponent, MatIconModule],
  templateUrl: "./comment.component.html",
  styleUrl: "./comment.component.css",
})
export class CommentComponent implements OnInit, OnDestroy {
  private commentService = inject(CommentService);
  private authService = inject(AuthService);
  private timezoneService = inject(TimezoneService);
  private subscription: Subscription;

  @Input() comment!: Comment;
  @Input() articleId!: string;
  @Input() isAuthenticated: boolean = false;

  @ViewChild(CommentFormComponent) commentFormComponent!: CommentFormComponent;

  protected replyMode = false;
  protected editMode = false;
  protected editedComment = "";

  protected currentUserRole: string | null = null;
  protected currentUserId: string | null = null;

  constructor() {
    this.subscription = new Subscription();
  }

  ngOnInit(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.currentUserId = this.authService.getCurrentUserId();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    this.editedComment = this.comment.message;
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
          alert("Comment deleted successfully.");
          window.location.reload();
        },
        error: err => {
          console.error(err);
          alert("An error occurred while deleting the comment.");
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
          alert("An error occurred while liking the comment.");
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
