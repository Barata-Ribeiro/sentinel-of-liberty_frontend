import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { provideHttpClient, withFetch } from "@angular/common/http";
import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideClientHydration(withHttpTransferCacheOptions({
        includePostRequests: true,
    })),
    provideAnimations()
],
};
