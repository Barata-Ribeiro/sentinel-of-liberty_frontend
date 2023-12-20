import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  userAuthenticated: boolean = false;

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
}
