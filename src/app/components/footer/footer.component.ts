import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./footer.component.html",
  styleUrl: "./footer.component.css",
})
export class FooterComponent {
  protected currentYear: number = new Date().getFullYear();

  getSvgLogo(): string {
    return "assets/sentinel-of-liberty-S-final.svg";
  }
}
