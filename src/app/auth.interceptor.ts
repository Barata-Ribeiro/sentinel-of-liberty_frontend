import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { CookieService } from "./services/cookie.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const authToken = cookieService.getCookieString("authToken");

  if (authToken) {
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${authToken}`),
      withCredentials: true,
    });

    return next(authReq);
  }

  return next(req);
};
