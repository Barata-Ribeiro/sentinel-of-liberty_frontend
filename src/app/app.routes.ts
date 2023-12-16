import { Routes } from "@angular/router";
import { HomeComponent } from "./pages/home/home.component";
import { NotFoundComponent } from "./pages/not-found/not-found.component";

export const routes: Routes = [
  { path: "", title: "Sentinel of Liberty", component: HomeComponent },
  { path: "**", title: "404 - Not Found", component: NotFoundComponent },
];
