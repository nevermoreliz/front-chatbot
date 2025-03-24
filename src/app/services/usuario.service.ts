import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginForm } from '../interfaces/login-form.interface';
import { ConfigService } from '../config.service';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { Persona } from '../models/persona.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public usuarioToken!: Usuario;
  public personaToken!: Persona;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router
  ) { }

  get Token(): string {
    return localStorage.getItem('token') || '';
  }

  get Usuario(): Usuario {
    return { ...this.usuarioToken };
  }


  validarToken(): Observable<boolean> {
    const token = localStorage.getItem('token') || '';

    return this.http.get(`${this.configService.apiUrl}/auth/renew`).pipe(
      tap((resp: any) => {
        // console.log(resp.data);

        const { nombre_usuario, id_usuario, id_persona, estado, roles } =
          resp.data.usuario;
        this.usuarioToken = new Usuario(
          nombre_usuario,
          '',
          id_usuario,
          id_persona,
          estado,
          roles
        );

        // this.usuarioToken = resp.data.usuario;
        localStorage.setItem('token', resp.data.token);
        localStorage.setItem('id_persona', resp.data.usuario.id_persona);
      }),
      map((resp) => true),
      catchError((err) => of(false))
    );
  }

  login(formData: LoginForm) {
    return this.http
      .post(`${this.configService.apiUrl}/auth/login`, formData)
      .pipe(
        tap((resp: any) => {
          // console.log(resp.data.token);

          localStorage.setItem('token', resp.data.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

  /**
   * Obtiene los datos de una persona por su ID
   * @param id_persona ID de la persona a consultar (opcional, si no se proporciona se obtiene del localStorage)
   * @returns Observable con los datos de la persona
   */
  getPersona(id_persona?: number): Observable<any> {
    // Si no se proporciona un ID, intentar obtenerlo del localStorage
    const personaId = id_persona || localStorage.getItem('id_persona');

    if (!personaId) {
      console.error('No se encontró ID de persona');
      return of(null);
    }

    return this.http
      .get(`${this.configService.apiUrl}/personas/${personaId}`)
      .pipe(
        map((resp: any) => resp.data),
        catchError((err) => {
          console.error('Error al obtener datos de persona:', err);
          return of(null);
        })
      );
  }
  
  // Añadir un Subject para notificar cambios en los datos de persona
  private personaActualizada = new Subject<Persona>();
  
  // Observable que otros componentes pueden suscribirse
  public personaActualizada$ = this.personaActualizada.asObservable();
  
  // Método para actualizar los datos de persona en el servicio
  actualizarDatosPersona(persona: Persona) {
    this.personaToken = persona;
    // Emitir evento para notificar a los componentes suscritos
    this.personaActualizada.next(persona);
  }
}
