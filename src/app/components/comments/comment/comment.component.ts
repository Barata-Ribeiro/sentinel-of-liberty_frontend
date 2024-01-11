import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Comment } from "../../../@types/appTypes";
import { AuthService } from "../../../services/auth.service";
import { CommentService } from "../../../services/comment.service";
import { CommentFormComponent } from "../comment-form/comment-form.component";

@Component({
  selector: "app-comment",
  standalone: true,
  imports: [CommonModule, CommentFormComponent],
  templateUrl: "./comment.component.html",
  styleUrl: "./comment.component.css",
})
export class CommentComponent implements OnInit {
  private commentService = inject(CommentService);
  private authService = inject(AuthService);

  @Input() comment!: Comment;
  @Input() articleId: string;

  @ViewChild(CommentFormComponent) commentFormComponent!: CommentFormComponent;

  replyMode = false;
  editMode = false;
  editedComment = "";

  currentUserRole: string | null = null;
  currentUserId: string | null = null;

  constructor() {
    this.comment = {
      id: "",
      user: {
        id: "",
        username: "",
      },
      message: "",
      parentId: "",
      likedByMe: false,
      likeCount: 0,
      wasEdited: false,
      createdAt: "",
      updatedAt: "",
      children: [],
    };

    this.articleId = "";
  }

  ngOnInit(): void {
    this.currentUserRole = this.authService.getCurrentUserRole();
    this.currentUserId = this.authService.getCurrentUserId();
  }

  // Reply to a comment
  toggleReplyMode() {
    this.replyMode = !this.replyMode;
    this.editMode = false;
  }

  handleReply(newReply: Comment) {
    if (!this.comment.children) this.comment.children = [];
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

  canInteractWithComment(): Observable<boolean> {
    return this.authService.isAuthenticated();
  }

  // Deleting and liking comments
  handleDeleteComment(commentId: string) {
    this.commentService.deleteComment(this.articleId, commentId).subscribe({
      next: () => {
        alert("Comment deleted successfully.");
        window.location.reload();
      },
      error: err => {
        console.error(err);
        alert("An error occurred while deleting the comment.");
      },
    });
  }

  handleLikeComment(commentId: string) {
    this.commentService.toggleLike(this.articleId, commentId).subscribe({
      next: () => {
        this.comment.likedByMe = !this.comment.likedByMe;
        this.comment.likeCount += this.comment.likedByMe ? 1 : -1;
      },
      error: err => {
        console.error(err);
        alert("An error occurred while liking the comment.");
      },
    });
  }
}
