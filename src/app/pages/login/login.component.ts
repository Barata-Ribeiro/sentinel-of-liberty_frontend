import { Component } from "@angular/core";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent {
  apiUrl = String(environment.apiUrl);
}
