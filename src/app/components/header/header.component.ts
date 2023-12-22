import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
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
export class HeaderComponent {
  userAuthenticated: boolean = false;
  isArticleDropdownOpen: boolean = false;
  isNewsDropdownOpen: boolean = false;
  isBurgerMenuOpen: boolean = false;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
  }

  logout(): void {
    this.http
      .get("http://localhost:3000/api/v1/auth/discord/logout", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "text",
      })
      .subscribe({
        next: (message: string) => {
          alert(message);
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
    // Additional logic if needed when burger menu state changes
  }
}
