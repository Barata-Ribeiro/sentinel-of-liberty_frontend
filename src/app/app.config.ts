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
        includePostRequests: true,
      })
    ),
    provideAnimations(),
    provideToastr({
      positionClass: "toast-bottom-right",
      preventDuplicates: true,
      closeButton: true,
      timeOut: 5000,
    }),
  ],
};
