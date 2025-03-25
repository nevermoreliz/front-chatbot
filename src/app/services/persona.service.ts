import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../config.service';
import { Router } from '@angular/router';
import { Persona } from '../models/persona.model';
import { tap } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private router: Router,
    private usuarioService: UsuarioService
  ) { }

  actualizarPersona(persona: Persona) {
    return this.http
      .put(`${this.configService.apiUrl}/personas/${this.usuarioService.Usuario.id_persona}`, persona)
      .pipe(
        tap((resp: any) => {
          console.log(resp.msg);
        })
      );
  }

  actualizarImagenPerfil(formData: FormData) {
    return this.http.put<any>(`${this.configService.apiUrl}/personas/${this.usuarioService.Usuario.id_persona}`, formData);
  }

  listarPersonas() {
    return this.http.get(`${this.configService.apiUrl}/personas`)
    .pipe(
      tap((resp: any) => {
        console.log(resp.msg);
      })
    );
  }

  eliminarPersona(id_persona: number) {
    return this.http.delete(`${this.configService.apiUrl}/personas/${id_persona}`)
   .pipe(
      tap((resp: any) => {
        console.log(resp.msg);
      })
    );
  }

  crearPersona(persona: Persona) {
    return this.http.post(`${this.configService.apiUrl}/personas`, persona)
   .pipe(
      tap((resp: any) => {
        console.log(resp.msg);
      })
    ); 
  }
  
}
