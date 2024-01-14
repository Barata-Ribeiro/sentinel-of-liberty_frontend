import { CommonModule } from "@angular/common";
import { Component, OnDestroy, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SuggestionDataRequest } from "../../../@types/appTypes";
import { SuggestionsService } from "../../../services/suggestions.service";

@Component({
  selector: "app-news-suggest",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./news-suggest.component.html",
  styleUrl: "./news-suggest.component.css",
})
export class NewsSuggestComponent implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  private suggestionsService = inject(SuggestionsService);
  private subscription = inject(Subscription);
  private router = inject(Router);

  protected suggestionBody: FormGroup;
  protected isLoading = false;
  protected serverError = "";
  protected imagePreview = "";

  constructor() {
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
          Validators.pattern("[a-zA-Z0-9-_.!?;:'\"()\\s,]+"),
        ],
      ],
      bodyContent: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
          Validators.pattern("[a-zA-Z0-9-_.!?;:'\"()\\s,]+"),
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

  ngOnDestroy(): void {
    this.suggestionBody.reset();
    this.isLoading = false;
    this.serverError = "";
    this.imagePreview = "";
    this.subscription.unsubscribe();
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

    return this.subscription.add(
      this.suggestionsService.postNewsSuggestion(requestBody).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(["/suggested-news"]);
        },
        error: error => {
          this.isLoading = false;
          this.serverError = error.message || "An error occurred";
        },
      })
    );
  }

  // Error messages getters
  getError(controlName: string): string {
    const control = this.suggestionBody.get(controlName);

    if (control?.touched) {
      if (!control?.value) return "This field is required";
      if (control?.errors?.["minlength"]) return "This field is too short";
      if (control?.errors?.["maxlength"]) return "This field is too long";
      if (control?.errors?.["pattern"])
        return "This field contains invalid characters or is not in the correct format";
    }

    return "";
  }
}
