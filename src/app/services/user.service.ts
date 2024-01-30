import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, of } from "rxjs";
import { environment } from "../../environments/environment";
import { EditDataRequest, User, UserDataResponse } from "../@types/appTypes";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private http = inject(HttpClient);

  public getUserById(userId: string): Observable<UserDataResponse> {
    return this.http
      .get<UserDataResponse>(`${environment.apiUrl}/users/${userId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as UserDataResponse);
        })
      );
  }

  public editUserById(
    userId: string,
    editData: EditDataRequest
  ): Observable<EditDataRequest> {
    return this.http
      .put<EditDataRequest>(`${environment.apiUrl}/users/${userId}`, editData, {
        withCredentials: true,
      })
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as EditDataRequest);
        })
      );
  }

  public deleteOwnAccountById(userId: string): Observable<User> {
    return this.http
      .delete<User>(`${environment.apiUrl}/users/${userId}`, {
        withCredentials: true,
      })
      .pipe(
        catchError(error => {
          console.error(error);
          return of({} as User);
        })
      );
  }
}
