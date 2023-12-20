import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthAppResponse, User } from "../../@types/appTypes";
import { CookieService } from "../../services/cookie.service";

@Component({
  selector: "app-redirect",
  standalone: true,
  imports: [],
  templateUrl: "./redirect.component.html",
  styleUrl: "./redirect.component.css",
})
export class RedirectComponent implements OnInit, OnDestroy {
  userId: string;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.userId = "";
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params["code"];
      if (code) {
        this.loginWithDiscord(code);
        this.retrieveUserData(this.userId);
        this.router.navigate(["/profile"]);
      } else this.router.navigate(["/login"]);
    });
  }

  ngOnDestroy(): void {
    this.userId = "";
  }

  private loginWithDiscord(code: string): void {
    this.http
      .get<AuthAppResponse>(
        `http://localhost:3000/api/v1/auth/discord/redirect?code=${code}`,
        { withCredentials: true }
      )
      .subscribe({
        next: response => {
          this.cookieService.setCookie(
            "authToken",
            response.authToken,
            1,
            true,
            "None"
          );

          this.cookieService.setCookie("userId", response.id, 1, true, "None");

          this.cookieService.setCookie(
            "refreshToken",
            response.refreshToken,
            365,
            true,
            "None"
          );

          this.userId = response.id;
          this.retrieveUserData(this.userId);
          this.router.navigate(["/profile"]);
        },
        error: () => this.router.navigate(["/login"]),
      });
  }

  private retrieveUserData(id: string): void {
    this.http
      .get<User>(`http://localhost:3000/api/v1/users/${id}`, {
        withCredentials: true,
      })
      .subscribe({
        next: response => {
          this.cookieService.setCookie(
            "userData",
            JSON.stringify(response),
            1,
            true,
            "None"
          );
        },
        error: () => this.router.navigate(["/login"]),
      });
  }
}
