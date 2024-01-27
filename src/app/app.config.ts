import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from "@angular/common/http";
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideToastr } from "ngx-toastr";
import { routes } from "./app.routes";
import { authInterceptor } from "./auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: false,
        filter: request =>
          !request.url.includes("articles") &&
          !request.urlWithParams.includes("articles"),
      })
    ),
    provideAnimations(),
    provideToastr({
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: true,
      tapToDismiss: true,
      timeOut: 1500,
      autoDismiss: true,
    }),
  ],
};
