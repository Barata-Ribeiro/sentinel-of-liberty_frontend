import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import {
  provideClientHydration,
  withHttpTransferCacheOptions,
} from "@angular/platform-browser";
import { routes } from "./app.routes";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true,
      })
    ),
  ],
};
