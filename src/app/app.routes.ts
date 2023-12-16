import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const routes: Routes = [
  { path: "", title: "Sentinel of Liberty", component: HomeComponent },
  { path: "login", title: "Login | SoL", component: LoginComponent },
  { path: "terms", title: "Terms | SoL", component: TermsComponent },
  { path: "privacy", title: "Privacy | SoL", component: PrivacyComponent },
  { path: "**", title: "404 | SoL", component: NotFoundComponent },
];
