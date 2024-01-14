import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, take } from "rxjs";
import { ArticleDataRequest } from "../../../@types/appTypes";
import { ArticleService } from "../../../services/article.service";
import { SuggestionsService } from "../../../services/suggestions.service";

@Component({
  selector: "app-articles-write",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./articles-write.component.html",
  styleUrl: "./articles-write.component.css",
})
export class ArticlesWriteComponent implements OnInit, OnDestroy {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private articleService = inject(ArticleService);
  private suggestionService = inject(SuggestionsService);
  private subscription: Subscription;

  protected articleBody: FormGroup;
  protected isLoading = false;
  protected serverError = "";
  protected imagePreview = "";
  protected basedOnSuggestionId?: string;

  constructor() {
    this.subscription = new Subscription();

    this.articleBody = this.formBuilder.group({
      bodyTitle: [
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
      bodyContent: [
        "",
        [
          Validators.required,
          Validators.minLength(1500),
          Validators.maxLength(2500),
          Validators.pattern("[a-zA-Z0-9-_.!?;:'\"()\\s,]+"),
        ],
      ],
      bodyReferences: ["", [Validators.required, this.validateReferences]],
    });

    this.articleBody.get("imageLink")?.valueChanges.subscribe(link => {
      if (this.isImage(link)) this.imagePreview = link;
      else this.imagePreview = "";
    });
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (params["basedOnSuggestion"]) {
        this.basedOnSuggestionId = params["basedOnSuggestion"];
        this.fetchSuggestionInfo(this.basedOnSuggestionId ?? "");
      }
    });
  }

  ngOnDestroy(): void {
    this.articleBody.reset();
    this.basedOnSuggestionId = undefined;
    this.imagePreview = "";
    this.serverError = "";
    this.isLoading = false;
    this.subscription.unsubscribe();
  }

  private fetchSuggestionInfo(suggestionId: string): void {
    return this.subscription.add(
      this.suggestionService.getSuggestionById(suggestionId).subscribe({
        next: response => {
          this.articleBody.get("bodyTitle")?.setValue(response.title);
          this.articleBody.get("imageLink")?.setValue(response.image);
          this.articleBody.get("bodyContent")?.setValue(response.content);
          this.articleBody.get("bodyReferences")?.setValue(response.source);
        },
        error: error => {
          this.serverError = error.error.message;
        },
      })
    );
  }

  private isImage(url: string): boolean {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  private validateReferences(
    control: FormGroup
  ): { [key: string]: any } | null {
    const references = control.value
      ? control.value.split(",").map((s: string) => s.trim())
      : [];
    const isValid = references.every((ref: string) =>
      ref.startsWith("https://")
    );
    return isValid ? null : { invalidReferences: true };
  }

  onCreateArticle(event: Event): void {
    event.preventDefault();
    this.serverError = "";

    const articleData: ArticleDataRequest = {
      title: this.articleBody.get("bodyTitle")?.value,
      imageUrl: this.articleBody.get("imageLink")?.value,
      content: this.articleBody.get("bodyContent")?.value,
      references: this.articleBody.get("bodyReferences")?.value,
      basedOnNewsSuggestionId: this.basedOnSuggestionId ?? null,
    };

    return this.subscription.add(
      this.articleService.postArticle(articleData).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(["/articles"]);
        },
        error: ({ error }) => {
          this.isLoading = false;
          this.serverError = error.message;
        },
      })
    );
  }

  // Error messages getters
  getError(controlName: string): string {
    const control = this.articleBody.get(controlName);

    if (control?.touched) {
      if (!control?.value) return "This field is required";
      if (control?.errors?.["minlength"]) return "This field is too short";
      if (control?.errors?.["maxlength"]) return "This field is too long";
      if (control?.errors?.["pattern"])
        return "This field contains invalid characters or is not in the correct format";
      if (control?.errors?.["invalidReferences"])
        return 'Invalid references format. Ensure each reference starts with "https://"';
    }

    return "";
  }
}
