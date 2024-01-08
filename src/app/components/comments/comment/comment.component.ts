import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Input, ViewChild } from "@angular/core";
import { Comment } from "../../../@types/appTypes";
import { CommentFormComponent } from "../comment-form/comment-form.component";

@Component({
  selector: "app-comment",
  standalone: true,
  imports: [CommonModule, CommentFormComponent],
  templateUrl: "./comment.component.html",
  styleUrl: "./comment.component.css",
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() articleId: string;
  replyMode = false;
  editMode = false;
  editedComment = "";
  replies: Comment[] = [];
  @ViewChild(CommentFormComponent) commentFormComponent!: CommentFormComponent;

  constructor(private http: HttpClient) {
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
    // TODO: Delete comment
  }

  handleLikeComment(commentId: string) {
    // TODO: Like comment
  }
}
