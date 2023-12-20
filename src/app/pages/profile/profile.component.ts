import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { User } from "../../@types/appTypes";
import { CookieService } from "../../services/cookie.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.user = null;
  }

  private loadUser(): void {
    try {
      const userData = this.cookieService.getCookieString("userData");
      if (userData) {
        this.user = JSON.parse(userData);
      } else {
        this.fetchUserFromAuthToken();
      }
    } catch (e) {
      console.error("Error parsing user data from cookies", e);
      this.fetchUserFromAuthToken();
    }
  }

  private fetchUserFromAuthToken(): void {
    const authToken = this.cookieService.getCookieString("authToken");
    if (authToken) {
      const userId = authToken.split("/")[1];
      if (userId) {
        this.http
          .get<User>(`http://localhost:3000/api/v1/users/${userId}`, {
            withCredentials: true,
          })
          .subscribe({
            next: response => {
              this.user = response;
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
  }
}
