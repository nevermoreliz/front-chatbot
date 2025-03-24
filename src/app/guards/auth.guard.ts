import { CanActivateFn, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {

  // Usar inject() para obtener servicios en lugar de constructor
  const usuarioService = inject(UsuarioService);
  const router = inject(Router);

  /**
   * si retorna true, se puede acceder a la ruta
   * si retorna false, se redirige a login
   */
  return usuarioService.validarToken().pipe(tap(estaAutenticado => {
    if (!estaAutenticado) {
      router.navigateByUrl('/login');
    }
  }));

};
