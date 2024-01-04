import { Component, Input } from "@angular/core";

@Component({
  selector: "app-comment-form",
  standalone: true,
  imports: [],
  templateUrl: "./comment-form.component.html",
  styleUrl: "./comment-form.component.css",
})
export class CommentFormComponent {
  @Input() articleId?: string;
  @Input() parentId?: string;
  message: string = "";

  handleSubmit(event: Event): void {
    event.preventDefault();
    // TODO: Implement submission logic
    this.message = "";
  }
}
