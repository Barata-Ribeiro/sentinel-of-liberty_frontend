import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule, isPlatformBrowser } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { Router } from "express";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { CustomToastrComponent } from "../shared/custom-toastr/custom-toastr.component";
import { BurgerMenuComponent } from "./burger-menu.component";

const DEFAULT_DURATION = 300;
const DEFAULT_EASING = "ease-out";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink, BurgerMenuComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  animations: [
    trigger("dropdownAnimation", [
      state("open", style({ height: "*", opacity: 1 })),
      state("closed", style({ height: "0", opacity: 0 })),
      transition("open => closed", [
        animate(`${DEFAULT_DURATION}ms ${DEFAULT_EASING}`),
      ]),
      transition("closed => open", [
        animate(`${DEFAULT_DURATION}ms ${DEFAULT_EASING}`),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private toastrService = inject(ToastrService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private subscription: Subscription;

  protected userAuthenticated: boolean = false;
  protected isArticleDropdownOpen: boolean = false;
  protected isNewsDropdownOpen: boolean = false;
  protected isBurgerMenuOpen: boolean = false;
  protected isMobileView: boolean = true;
  protected isMenuVisible: boolean = true;

  constructor() {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.adjustForScreenSize();
      window.addEventListener("resize", this.adjustForScreenSize.bind(this));

      this.authService.isAuthenticated().subscribe(isAuthenticated => {
        this.userAuthenticated = isAuthenticated;
      });
    }
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener("resize", this.adjustForScreenSize.bind(this));
    }
    this.subscription.unsubscribe();
  }

  private adjustForScreenSize(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  logout(): void {
    return this.subscription.add(
      this.http
        .get<{ message: string }>(
          "http://localhost:3000/api/v1/auth/discord/logout",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            responseType: "json",
          }
        )
        .subscribe({
          next: response => {
            this.toastrService.show(response.message, "Success!", {
              toastComponent: CustomToastrComponent,
              toastClass:
                "shadow-[5px_5px_0px_0px_rgba(217,249,157)] max-w-sm rounded-lg border border-lime-200 bg-lime-100 dark:border-lime-900 dark:bg-lime-800/10 dark:text-lime-500",
              titleClass: "text-lime-800 font-bold text-lg",
              messageClass: "text-lime-800 font-medium text-normal",
            });
            this.userAuthenticated = false;
            this.router.navigate(["/login"]);
          },
          error: error => {
            console.error("Logout failed", error);
            this.toastrService.show(error.message, "Error!", {
              toastComponent: CustomToastrComponent,
              toastClass:
                "max-w-xs rounded-lg border border-red-200 bg-red-100 text-sm text-red-800 shadow-[5px_5px_0px_0px_rgba(254,202,202)] dark:border-red-900 dark:bg-red-800/10 dark:text-red-500",
              titleClass: "text-red-800 font-bold text-lg",
              messageClass: "text-red-800 font-medium text-normal",
            });
          },
        })
    );
  }

  toggleArticleDropdown(): void {
    this.isArticleDropdownOpen = !this.isArticleDropdownOpen;
    this.isNewsDropdownOpen = false;
  }

  toggleNewsDropdown(): void {
    this.isNewsDropdownOpen = !this.isNewsDropdownOpen;
    this.isArticleDropdownOpen = false;
  }

  handleBurgerMenuChange(isOpen: boolean) {
    this.isBurgerMenuOpen = isOpen;

    // Close dropdowns when burger menu is toggled
    this.isArticleDropdownOpen = false;
    this.isNewsDropdownOpen = false;
  }
}
