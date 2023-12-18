import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Observable, tap } from "rxjs";
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
    private authService: AuthService
  ) {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.userAuthenticated = isAuthenticated;
    });
  }

  logout(): Observable<string> {
    return this.http
      .get("http://localhost:3000/api/v1/auth/discord/logout", {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "text",
      })
      .pipe(tap((message: string) => message));
  }
}
