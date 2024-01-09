import { CommonModule } from "@angular/common";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { Comment } from "../../../@types/appTypes";
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
  @Input() comment!: Comment;
  @Input() articleId: string;
  replyMode = false;
  editMode = false;
  editedComment = "";
  replies: Comment[] = [];
  @ViewChild(CommentFormComponent) commentFormComponent!: CommentFormComponent;

  constructor(private commentService: CommentService) {
    this.comment = {
      id: "",
      user: {
        id: "",
        discordUsername: "",
        sol_username: "",
      },
      message: "",
      likeCount: 0,
      wasEdited: false,
      createdAt: "",
      updatedAt: "",
    };

    this.articleId = "";

    this.replies = this.comment.children || [];
  }

  ngOnInit(): void {
    if (this.comment && this.comment.children)
      this.replies = this.comment.children;
  }

  // Reply to a comment
  toggleReplyMode() {
    this.replyMode = !this.replyMode;
    this.editMode = false;
  }

  handleReply(newReply: Comment) {
    this.replies = [...this.replies, newReply];
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
      next: () => this.comment.likeCount++,
      error: err => {
        console.error(err);
        alert("An error occurred while liking the comment.");
      },
    });
  }
}
