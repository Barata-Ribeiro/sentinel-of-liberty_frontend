import { CommonModule } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { SuggestionDataRequest } from "../../../@types/appTypes";

@Component({
  selector: "app-news-suggest",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./news-suggest.component.html",
  styleUrl: "./news-suggest.component.css",
})
export class NewsSuggestComponent {
  suggestionBody: FormGroup;
  isLoading = false;
  serverError = "";
  imagePreview = "";

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.suggestionBody = this.formBuilder.group({
      sourceLink: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255),
          Validators.pattern("https://.+"),
        ],
      ],
      bodyTitle: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      bodyContent: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      imageLink: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(255),
          Validators.pattern("https://.+"),
        ],
      ],
    });

    this.suggestionBody.get("imageLink")?.valueChanges.subscribe(link => {
      if (this.isImage(link)) this.imagePreview = link;
      else this.imagePreview = "";
    });
  }

  isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  onSuggest(event: Event) {
    event.preventDefault();
    this.isLoading = true;
    this.serverError = "";

    const requestBody: SuggestionDataRequest = {
      source: this.suggestionBody.get("sourceLink")?.value,
      title: this.suggestionBody.get("bodyTitle")?.value,
      content: this.suggestionBody.get("bodyContent")?.value,
      imageUrl: this.suggestionBody.get("imageLink")?.value,
    };

    this.http
      .post("http://localhost:3000/api/v1/suggestions", requestBody, {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        withCredentials: true,
      })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(["/suggested-news"]);
        },
        error: error => {
          this.isLoading = false;
          this.serverError = error.message || "An error occurred";
        },
      });
  }

  // Error messages getters
  getError(controlName: string): string {
    const control = this.suggestionBody.get(controlName);

    if (control?.touched) {
      if (!control?.value) return "This field is required";
      if (control?.errors?.["minlength"]) return "This field is too short";
      if (control?.errors?.["maxlength"]) return "This field is too long";
      if (control?.errors?.["pattern"]) return "This is an invalid URL.";
    }

    return "";
  }
}
