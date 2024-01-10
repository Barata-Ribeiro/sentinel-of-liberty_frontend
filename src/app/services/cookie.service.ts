import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Injectable, PLATFORM_ID, inject } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CookieService {
  private document = inject(DOCUMENT);
  private platformId = inject(PLATFORM_ID);

  setCookie(
    name: string,
    value: string,
    days: number,
    secure: boolean,
    sameSite: "Lax" | "Strict" | "None"
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      let expires = "";

      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = `;expires=${date.toUTCString()}`;
      }

      let cookieString = `${name}=${value}${expires};path=/`;
      if (secure) cookieString += `;secure`;

      cookieString += `;sameSite=${sameSite}`;

      this.document.cookie = cookieString;
    }
  }

  getCookieString(name: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      const nameEQ = `${name}=`;
      const ca = this.document.cookie.split(";");

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
      }
    }

    return null;
  }

  checkIfCookieExpired(name: string): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const cookieString = this.getCookieString(name);

      if (cookieString) {
        const cookieParts = cookieString.split(";");
        const expires = cookieParts.find(part =>
          part.trim().startsWith("expires=")
        );

        if (expires) {
          const expirationDate = new Date(expires.split("=")[1]);
          const currentDate = new Date();
          return expirationDate < currentDate;
        }
      }
    }

    return false;
  }

  deleteCookie(name: string): void {
    if (isPlatformBrowser(this.platformId)) {
      this.setCookie(name, "", -1, true, "None");
    }
  }
}
