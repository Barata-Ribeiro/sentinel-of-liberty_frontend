import { inject } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { map } from "rxjs";
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService) as AuthService;
  const router = inject(Router) as Router;
  const protectedRoutes: string[] = ["/profile"];

  return (
    protectedRoutes.includes(state.url) &&
    authService.isAuthenticated().pipe(
      map(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(["/login"]);
          return false;
        }
        return true;
      })
    )
  );
};
