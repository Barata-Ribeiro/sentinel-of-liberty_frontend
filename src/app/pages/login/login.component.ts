import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  apiUrl = String(environment.apiUrl);
}
