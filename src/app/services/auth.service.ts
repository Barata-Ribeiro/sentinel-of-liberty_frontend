import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, of, tap } from "rxjs";
import { CookieService } from "./cookie.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  public isAuthenticated(): Observable<boolean | string> {
    const token = this.cookieService.getCookieString("authToken");
    if (!token) return of(false);

    const isExpired = this.cookieService.checkIfCookieExpired("authToken");
    if (!isExpired) return of(true);

    return this.logoutIfExpired().pipe(
      tap(() => false),
      catchError(() => of(false))
    );
  }

  private logoutIfExpired(): Observable<string> {
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
