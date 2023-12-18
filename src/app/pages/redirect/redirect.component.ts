import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "../../services/cookie.service";

@Component({
  selector: "app-redirect",
  standalone: true,
  imports: [],
  templateUrl: "./redirect.component.html",
  styleUrl: "./redirect.component.css",
})
export class RedirectComponent {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private CookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params["code"];
      if (code) this.loginWithDiscord(code);
      else this.router.navigate(["/login"]);
    });
  }

  private loginWithDiscord(code: string): void {
    this.http
      .get(`http://localhost:3000/api/v1/auth/discord/redirect?code=${code}`, {
        withCredentials: true,
      })
      .subscribe({
        next: (response: any) => {
          this.CookieService.setCookie(
            "authToken",
            response.authToken,
            1,
            true,
            "None"
          );

          this.CookieService.setCookie(
            "refreshToken",
            response.refreshToken,
            365,
            true,
            "None"
          );

          this.router.navigate(["/profile"]);
        },
        error: () => this.router.navigate(["/login"]),
      });
  }
}
