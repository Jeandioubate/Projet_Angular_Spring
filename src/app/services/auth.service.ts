import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { StorageService, TOKEN_KEY } from './storage.service';
import { environment } from '../../environments/environment';

interface LoginResponse { access_token: string; token_type: string; }
interface JwtPayload { sub: string; roles: string[]; exp: number; }

@Injectable({ providedIn: 'root' })
export class AuthService {

  constructor(private http: HttpClient, private storage: StorageService) {}

  login(email: string, password: string): Observable<boolean>  {
    return this.http
      .post<LoginResponse>(environment.host + '/login', { username: email, password })
      .pipe(tap(r => this.storage.setEncrypted(TOKEN_KEY, r.access_token)),  map(() => true),
        catchError(() => of(false)));
}

  // retourne le token s'il existe et n'est pas expiré, sinon null
  getToken(): string | null {
    const token = this.storage.getDecrypted<string>(TOKEN_KEY);
    if (!token) return null;
    const payload = this.decode(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
      this.storage.remove(TOKEN_KEY);
      return null;
    }
    return token;
  }

  getAuthenticatedUser(): { email: string; roles: string[] } | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decode(token);
    return payload ? { email: payload.sub, roles: payload.roles ?? [] } : null;
  }

  logout(): void {
    this.storage.remove(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getAuthenticatedUser();
  }

  hasRole(role: string): boolean {
    return !!this.getAuthenticatedUser()?.roles.includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  private decode(token: string): JwtPayload | null {
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b64));
    } catch {
      return null;
    }
  }

}
