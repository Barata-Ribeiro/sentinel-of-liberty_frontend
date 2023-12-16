import { Component } from "@angular/core";
import { MainButtonComponent } from "../../components/shared/main-button/main-button.component";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [MainButtonComponent],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.css",
})
export class NotFoundComponent {}
