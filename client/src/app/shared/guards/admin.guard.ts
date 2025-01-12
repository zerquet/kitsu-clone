import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../../auth/services/auth.service";
import { map, Observable, take } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);
    
    canActivate(): Observable<boolean> {
        return this.authService.getUser().pipe(
            map(user => {
                console.log("admin guard");
            
                console.log(user);
                if (user && user.isAdmin === true) {
                    return true;
                } else {
                    this.authService.isAdminPage$.next(false);
                    this.router.navigate(['/home']);
                    return false;
                }
            })
        );
    }

}