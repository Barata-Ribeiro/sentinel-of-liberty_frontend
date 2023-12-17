import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CookieService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  setCookie(
    name: string,
    value: string,
    days: number,
    secure: boolean,
    sameSite: "Lax" | "Strict" | "None"
  ): void {
    if (isPlatformBrowser(this.platformId)) {
      // Only execute this code on the browser
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
}
