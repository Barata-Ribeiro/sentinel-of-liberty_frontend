import { CommonModule, DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { EditDataRequest, User } from "../../@types/appTypes";
import { DeleteAccountModalComponent } from "../../components/delete-account-modal/delete-account-modal.component";
import { EditAccountModalComponent } from "../../components/edit-account-modal/edit-account-modal.component";
import { CookieService } from "../../services/cookie.service";

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
  user: User | null = null;
  showModalDelete = false;
  showEditProfile = false;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.user = null;
  }

  // Delete account modal
  openModalDelete() {
    this.showModalDelete = true;
  }

  closeModalDelete() {
    this.showModalDelete = false;
  }

  handleDeactivate() {
    try {
      this.http
        .delete(`http://localhost:3000/api/v1/users/${this.user?.id}`, {
          withCredentials: true,
        })
        .subscribe({
          next: () => {
            this.cookieService.deleteCookie("userId");
            this.cookieService.deleteCookie("userData");
            this.router.navigate(["/login"]);
          },
          error: () => this.router.navigate(["/login"]),
        });
    } catch (error) {
      console.error(error);
    }
    this.closeModalDelete();
  }

  // Edit profile modal
  openEditModal() {
    this.showEditProfile = true;
  }

  closeEditModal() {
    this.showEditProfile = false;
  }

  handleEditAccount(editData: EditDataRequest) {
    try {
      this.http
        .put(`http://localhost:3000/api/v1/users/${this.user?.id}`, editData, {
          withCredentials: true,
        })
        .subscribe({
          next: () => this.fetchUserFromAuthToken(),
          error: error => alert("Error: " + error.message),
        });
    } catch (error) {
      console.error(error);
    }
    this.closeEditModal();
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
      this.http
        .get<User>(`http://localhost:3000/api/v1/users/${userId}`, {
          withCredentials: true,
        })
        .subscribe({
          next: response => {
            this.user = response;
            this.cookieService.setCookie(
              "userData",
              JSON.stringify(response),
              1,
              true,
              "None"
            );
          },
          error: () => this.router.navigate(["/login"]),
        });
    }
  }
}
