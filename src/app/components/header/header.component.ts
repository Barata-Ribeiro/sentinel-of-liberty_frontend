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
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { BurgerMenuComponent } from "./burger-menu.component";

const DEFAULT_DURATION = 300;
const DEFAULT_EASING = "ease-out";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, BurgerMenuComponent],
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
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  userAuthenticated: boolean = false;
  isArticleDropdownOpen: boolean = false;
  isNewsDropdownOpen: boolean = false;
  isBurgerMenuOpen: boolean = false;
  isMobileView: boolean = true;
  isMenuVisible: boolean = true;

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
  }

  private adjustForScreenSize(): void {
    this.isMobileView = window.innerWidth < 768;
  }

  logout(): void {
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
          alert(response.message);
          this.userAuthenticated = false;
          this.router.navigate(["/login"]);
        },
        error: error => console.error("Logout failed", error),
      });
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
