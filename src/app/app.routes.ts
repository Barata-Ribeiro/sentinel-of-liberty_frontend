import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";
import { PrivacyComponent } from "./pages/privacy/privacy.component";
import { RedirectComponent } from "./pages/redirect/redirect.component";
import { TermsComponent } from "./pages/terms/terms.component";

export const routes: Routes = [
  { path: "", title: "Sentinel of Liberty", component: HomeComponent },
  { path: "login", title: "Login | SoL", component: LoginComponent },
  {
    path: "login/redirect",
    title: "Login | SoL",
    component: RedirectComponent,
  },
  {
    path: "profile",
    title: "Profile | SoL",
    loadComponent: () =>
      import("./pages/profile/profile.component").then(m => m.ProfileComponent),
    canActivate: [authGuard],
  },
  { path: "terms", title: "Terms | SoL", component: TermsComponent },
  { path: "privacy", title: "Privacy | SoL", component: PrivacyComponent },
  { path: "**", title: "404 | SoL", component: NotFoundComponent },
];
