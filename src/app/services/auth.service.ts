import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, map, of, tap } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthAppResponse } from "../@types/appTypes";
import { CookieService } from "./cookie.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private cookieService = inject(CookieService);
  private http = inject(HttpClient);

  public isAuthenticated(): Observable<boolean> {
    const token = this.cookieService.getCookie("authToken");
    if (!token) return of(false);

    const isExpired = this.cookieService.checkIfCookieExpired("authToken");
    if (!isExpired) return of(true);

    return this.logoutIfExpired().pipe(
      map(() => false),
      catchError(() => of(false))
    );
  }

  public loginWithDiscord(code: string): Observable<AuthAppResponse> {
    return this.http
      .get<AuthAppResponse>(
        `${environment.apiUrl}/auth/discord/redirect?code=${code}`,
        { withCredentials: true }
      )
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as AuthAppResponse);
        })
      );
  }

  public getCurrentUserRole(): string | null {
    const userData = this.cookieService.getCookie("userData");
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
    const userData = this.cookieService.getCookie("userData");
    if (!userData) return null;

    try {
      const parsedUserData = JSON.parse(userData);
      return parsedUserData.id as string;
    } catch (error) {
      console.error("Error parsing userData from cookie:", error);
      return null;
    }
  }

  private logoutIfExpired(): Observable<string> {
    return this.http
      .get(`${environment.apiUrl}/auth/discord/logout`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        responseType: "text",
      })
      .pipe(tap((message: string) => message));
  }
}
