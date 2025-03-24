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
  
}
