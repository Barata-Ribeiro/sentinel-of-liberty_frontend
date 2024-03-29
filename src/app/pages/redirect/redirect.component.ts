import { Component, OnDestroy, inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { CustomToastrComponent } from "../../components/shared/custom-toastr/custom-toastr.component";
import { AuthService } from "../../services/auth.service";
import { CookieService } from "../../services/cookie.service";

@Component({
  selector: "app-redirect",
  standalone: true,
  imports: [],
  templateUrl: "./redirect.component.html",
  styleUrl: "./redirect.component.css",
})
export class RedirectComponent implements OnDestroy {
  private authService = inject(AuthService);
  private cookieService = inject(CookieService);
  private toastrService = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private subscription = new Subscription();

  protected userId: string = "";
  protected username: string = "";

  constructor() {
    this.subscription.add(
      this.route.queryParams.subscribe(params => {
        const code = params["code"];
        code
          ? this.discordLoginRedirection(code)
          : this.router.navigate(["/login"]);
      })
    );
  }

  ngOnDestroy(): void {
    this.userId = "";
    this.subscription.unsubscribe();
  }

  private discordLoginRedirection(code: string) {
    return this.authService.loginWithDiscord(code).subscribe({
      next: response => {
        this.cookieService.setCookie(
          "authToken",
          response.authToken,
          1,
          true,
          "Lax"
        );

        this.cookieService.setCookie(
          "refreshToken",
          response.refreshToken,
          365,
          true,
          "Lax"
        );

        this.userId = response.userInfo.id;
        this.username = response.userInfo.username;

        this.router.navigate([`/profile/${this.userId}/${this.username}`]);

        this.toastrService.show(response.message, "Success!", {
          toastComponent: CustomToastrComponent,
          toastClass:
            "shadow-[5px_5px_0px_0px_rgba(217,249,157)] max-w-sm rounded-lg border border-lime-200 bg-lime-100 dark:border-lime-900 dark:bg-lime-800/10 dark:text-lime-500",
          titleClass: "text-lime-800 font-bold text-lg",
          messageClass: "text-lime-800 font-medium text-normal",
        });
      },
      error: error => {
        this.toastrService.show(error.message, "Error!", {
          toastComponent: CustomToastrComponent,
          toastClass:
            "max-w-xs rounded-lg border border-red-200 bg-red-100 text-sm text-red-800 shadow-[5px_5px_0px_0px_rgba(254,202,202)] dark:border-red-900 dark:bg-red-800/10 dark:text-red-500",
          titleClass: "text-red-800 font-bold text-lg",
          messageClass: "text-red-800 font-medium text-normal",
        });

        this.router.navigate(["/login"]);
      },
    });
  }
}
