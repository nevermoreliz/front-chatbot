import { ConfigService } from './../../config.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Subject, takeUntil } from 'rxjs';
import { Persona } from '../../models/persona.model';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {

  public imgUrl: string = '';
  public nombreUsuario: string = '';
  public email: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private usuarioService: UsuarioService,
    private configService: ConfigService
  ) { }

  ngOnInit() {
    this.cargarImagenPerfil();
    
    // Suscribirse a cambios en los datos de persona
    this.usuarioService.personaActualizada$
      .pipe(takeUntil(this.destroy$))
      .subscribe(persona => {
        this.actualizarDatosHeader(persona);
      });
  }

  ngOnDestroy() {
    // Completar el subject para cancelar todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  logOut() {
    this.usuarioService.logout();
  }

  cargarImagenPerfil() {
    this.usuarioService.getPersona()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (persona: Persona) => {
          if (persona) {
            this.actualizarDatosHeader(persona);
          } else {
            // Imagen por defecto si no hay imagen de perfil
            this.imgUrl = 'blank.png';
          }
        },
        error: (error) => {
          console.error('Error al cargar imagen de perfil:', error);
          this.imgUrl = 'blank.png';
        }
      });
  }

  // Método para actualizar los datos del header
  private actualizarDatosHeader(persona: Persona) {
    if (persona.img) {
      this.imgUrl = `${this.configService.apiUrl}/profile/${persona.img}`;
    } else {
      this.imgUrl = 'blank.png';
    }
    
    this.nombreUsuario = this.capitalizeText(`${persona.nombre} ${persona.paterno}`) || '';
    this.email = persona.correo_electronico || '';
  }

  // Añade este método al componente
  capitalizeText(text: string): string {
    if (!text) return '';
    return text.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
