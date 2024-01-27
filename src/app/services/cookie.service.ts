import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import {
  Inject,
  Injectable,
  InjectionToken,
  Optional,
  PLATFORM_ID,
  inject,
} from "@angular/core";
import { Request } from "express";

export const REQUEST = new InjectionToken<Request>("REQUEST");

@Injectable({
  providedIn: "root",
})
export class CookieService {
  private document: Document = inject(DOCUMENT);
  private platformId: any = inject(PLATFORM_ID);
  private documentIsAccessible: boolean;

  constructor(@Optional() @Inject(REQUEST) private request: Request) {
    this.documentIsAccessible = isPlatformBrowser(this.platformId);
  }

  setCookie(
    name: string,
    value: string,
    days: number,
    secure: boolean,
    sameSite: "Lax" | "Strict" | "None"
  ): void {
    if (this.documentIsAccessible) {
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

  getCookie(name: string): string {
    if (!this.documentIsAccessible) {
      const cookies = this.request?.headers.cookie;
      const nameEQ = encodeURIComponent(name) + "=";
      const ca = cookies ? cookies.split(";") : [];

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0)
          return decodeURIComponent(c.substring(nameEQ.length));
      }

      return "";
    } else {
      const nameEQ = encodeURIComponent(name) + "=";
      const ca = this.document.cookie.split(";");

      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0)
          return decodeURIComponent(c.substring(nameEQ.length));
      }

      return "";
    }
  }

  checkIfCookieExpired(name: string): boolean {
    if (this.documentIsAccessible) {
      const cookieString = this.getCookie(name);

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
    if (this.documentIsAccessible) {
      this.setCookie(name, "", -1, true, "None");
    }
  }
}
