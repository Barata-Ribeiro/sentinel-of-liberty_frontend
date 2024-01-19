import { CommonModule, DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Router } from "express";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { EditDataRequest, User } from "../../@types/appTypes";
import { DeleteAccountModalComponent } from "../../components/delete-account-modal/delete-account-modal.component";
import { EditAccountModalComponent } from "../../components/edit-account-modal/edit-account-modal.component";
import { CustomToastrComponent } from "../../components/shared/custom-toastr/custom-toastr.component";
import { CookieService } from "../../services/cookie.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [
    CommonModule,
    DeleteAccountModalComponent,
    EditAccountModalComponent,
  ],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
  providers: [DatePipe],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private cookieService = inject(CookieService);
  private userService = inject(UserService);
  private toastrService = inject(ToastrService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private subscriptions = new Subscription();

  protected user: User | null = null;
  protected showModalDelete = false;
  protected showEditProfile = false;

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.user = null;
    this.subscriptions.unsubscribe();
  }

  // Delete account modal
  openModalDelete() {
    this.showModalDelete = true;
  }

  closeModalDelete() {
    this.showModalDelete = false;
  }

  handleDeactivate() {
    return this.subscriptions.add(
      this.userService.deleteOwnAccountById(this.user?.id as string).subscribe({
        next: () => {
          this.closeModalDelete();
          this.cookieService.deleteCookie("userId");
          this.cookieService.deleteCookie("userData");
          this.router.navigate(["/login"]);
        },
        error: error => {
          this.closeModalDelete();
          this.toastrService.show(error.message, "Error!", {
            toastComponent: CustomToastrComponent,
            toastClass:
              "max-w-xs rounded-lg border border-red-200 bg-red-100 text-sm text-red-800 shadow-[5px_5px_0px_0px_rgba(254,202,202)] dark:border-red-900 dark:bg-red-800/10 dark:text-red-500",
            titleClass: "text-red-800 font-bold text-lg",
            messageClass: "text-red-800 font-medium text-normal",
          });
          this.router.navigate(["/login"]);
        },
      })
    );
  }

  // Edit profile modal
  openEditModal() {
    this.showEditProfile = true;
  }

  closeEditModal() {
    this.showEditProfile = false;
  }

  handleEditAccount(editData: EditDataRequest) {
    return this.subscriptions.add(
      this.userService
        .editUserById(this.user?.id as string, editData)
        .subscribe({
          next: () => {
            this.fetchUserFromAuthToken();
            this.closeEditModal();
          },
          error: error =>
            this.toastrService.show(error.message, "Error!", {
              toastComponent: CustomToastrComponent,
              toastClass:
                "max-w-xs rounded-lg border border-red-200 bg-red-100 text-sm text-red-800 shadow-[5px_5px_0px_0px_rgba(254,202,202)] dark:border-red-900 dark:bg-red-800/10 dark:text-red-500",
              titleClass: "text-red-800 font-bold text-lg",
              messageClass: "text-red-800 font-medium text-normal",
            }),
        })
    );
  }

  private loadUser(): void {
    try {
      const userData = this.cookieService.getCookieString("userData");
      if (userData) this.user = JSON.parse(userData);
      else this.fetchUserFromAuthToken();
    } catch (e) {
      console.error("Error parsing user data from cookies", e);
      this.fetchUserFromAuthToken();
    }
  }

  private fetchUserFromAuthToken(): void {
    const userId = this.cookieService.getCookieString("userId");
    if (userId) {
      return this.subscriptions.add(
        this.userService.getUserById(userId).subscribe({
          next: response => {
            this.user = { ...response };
            this.cookieService.setCookie(
              "userData",
              JSON.stringify(response),
              1,
              true,
              "None"
            );
          },
          error: error => {
            this.toastrService.show(error.message, "Error!", {
              toastComponent: CustomToastrComponent,
              toastClass:
                "max-w-xs rounded-lg border border-red-200 bg-red-100 text-sm text-red-800 shadow-[5px_5px_0px_0px_rgba(254,202,202)] dark:border-red-900 dark:bg-red-800/10 dark:text-red-500",
              titleClass: "text-red-800 font-bold text-lg",
              messageClass: "text-red-800 font-medium text-normal",
            }),
              this.router.navigate(["/login"]);
          },
        })
      );
    }
  }
}
