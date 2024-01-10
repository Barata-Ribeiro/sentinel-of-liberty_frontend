import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, map, of, tap } from "rxjs";
import { CookieService } from "./cookie.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);

  public isAuthenticated(): Observable<boolean> {
    const token = this.cookieService.getCookieString("authToken");
    if (!token) return of(false);

    const isExpired = this.cookieService.checkIfCookieExpired("authToken");
    if (!isExpired) return of(true);

    return this.logoutIfExpired().pipe(
      map(() => false),
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

  public getCurrentUserRole(): string | null {
    const userData = this.cookieService.getCookieString("userData");
    if (!userData) return null;

    try {
      const parsedUserData = JSON.parse(userData);
      return parsedUserData.role as string;
    } catch (error) {
      console.error("Error parsing userData from cookie:", error);
      return null;
    }
  }

  public getCurrentUserId(): string | null {
    const userData = this.cookieService.getCookieString("userData");
    if (!userData) return null;

    try {
      const parsedUserData = JSON.parse(userData);
      return parsedUserData.id as string;
    } catch (error) {
      console.error("Error parsing userData from cookie:", error);
      return null;
    }
  }
}
