import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonaService } from '../../services/persona.service';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/usuario.service';
import { Persona } from '../../models/persona.model';
import { Subject, takeUntil } from 'rxjs';
import { ConfigService } from '../../config.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  standalone: false,
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css',
})
export class PerfilComponent implements OnInit, OnDestroy {
  public perfilForm: FormGroup = new FormGroup({});
  public persona!: Persona;
  public usuario!: Usuario;
  private destroy$ = new Subject<void>();

  // Nuevas propiedades para manejo de imágenes
  public imagenSeleccionada: File | null = null;
  public imagenPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private personaService: PersonaService,
    private usuarioService: UsuarioService,
    private configService: ConfigService
  ) {
    // Inicializamos el formulario con valores vacíos
    this.inicializarFormularioVacio();
    this.usuario = this.usuarioService.Usuario;
  }

  ngOnInit(): void {
    // Solo llamamos a obtenerPersona, que actualizará el formulario cuando los datos estén disponibles
    this.obtenerPersona();
  }

  ngOnDestroy() {
    // Completar el subject para cancelar todas las suscripciones
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Inicializar formulario con valores vacíos
  inicializarFormularioVacio() {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required]],
      paterno: ['', [Validators.required]],
      materno: ['', [Validators.required]],
      ci: ['', [Validators.required, Validators.pattern('^[0-9]{6,10}$')]],
      fecha_nacimiento: ['', [Validators.required]],
      correo_electronico: ['', [Validators.required, Validators.email]],
      sexo: ['', [Validators.required]]
    });
  }

  // Actualizar formulario con datos de persona
  actualizarFormularioConDatos(persona: Persona) {
    this.perfilForm.patchValue({
      nombre: persona.nombre || '',
      paterno: persona.paterno || '',
      materno: persona.materno || '',
      ci: persona.ci || '',
      fecha_nacimiento: persona.fecha_nacimiento || '',
      correo_electronico: persona.correo_electronico || '',
      sexo: persona.sexo || '',
    });

    console.log('Formulario actualizado con datos de persona');

  }

  obtenerPersona() {
    this.usuarioService.getPersona()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (persona: Persona) => {
          if (persona) {
            this.persona = persona;

            // Actualizar formulario con datos de persona después de que estén disponibles
            this.actualizarFormularioConDatos(this.persona);
          } else {
            console.warn('No se recibieron datos de persona');
          }
        },
        error: (error) => {
          console.error('Error al cargar datos de persona:', error);
        }
      });
  }

  actualizarPerfil() {
    if (this.perfilForm.invalid) {
      this.marcarCamposInvalidos();
      return;
    }

     // Mostrar alerta de carga
     Swal.fire({
      title: 'Actualizando perfil...',
      text: 'Por favor espere',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    const formValues = this.perfilForm.value;

     // Normalizar los datos a minúsculas
     const datosFormulario = {
      ...formValues,
      nombre: formValues.nombre.toLowerCase(),
      paterno: formValues.paterno.toLowerCase(),
      materno: formValues.materno.toLowerCase(),
      correo_electronico: formValues.correo_electronico.toLowerCase(),
      sexo: formValues.sexo.toLowerCase()
    };

    this.personaService.actualizarPersona(datosFormulario)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta) => {

          // console.log('Perfil actualizado exitosamente:', respuesta);

          if (respuesta && respuesta.data) {
            this.actualizarDatosPersonaEnServicio(respuesta.data);

             // Mostrar alerta de éxito
             Swal.fire({
              title: '¡Perfil actualizado!',
              text: 'Tus datos personales han sido actualizados correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#009ef7'
            });
          }

        },
        error: (error) => {
          console.error('Error al actualizar perfil:', error);

          // Mostrar alerta de error
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar la información del perfil',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#009ef7'
          });
        }
      });
  }

  /**
   * Marca todos los campos inválidos como tocados para mostrar errores
   */
  private marcarCamposInvalidos(): void {
    Object.keys(this.perfilForm.controls).forEach(campo => {
      const control = this.perfilForm.get(campo);
      control?.markAsTouched();
    });
  }

  /**
   * Actualiza los datos de persona en el servicio para notificar a otros componentes
   */
  private actualizarDatosPersonaEnServicio(datosPersona: any): void {
    const personaActualizada = new Persona(
      datosPersona.nombre,
      datosPersona.paterno,
      datosPersona.materno,
      datosPersona.ci,
      datosPersona.fecha_nacimiento,
      datosPersona.img,
      datosPersona.correo_electronico,
      datosPersona.sexo,
      datosPersona.estado,
      datosPersona.id_persona
    );

    // Notificar al servicio sobre la actualización
    this.usuarioService.actualizarDatosPersona(personaActualizada);

    // Actualizar también los datos locales
    this.persona = personaActualizada;
  }

  // Añade este método al componente
  capitalizeText(text: string): string {
    if (!text) return '';
    return text.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  // Agrega este getter en tu clase PerfilComponent
  get personaGet(): Persona {
    return this.persona || {
      nombre: '',
      paterno: '',
      materno: '',
      ci: '',
      fecha_nacimiento: '',
      correo_electronico: '',
      sexo: '',
      img: ''
    };
  }

  getImagenPerfil(): string {
    if (!this.personaGet.img) {
      return 'assets/media/avatars/300-1.jpg'; // Imagen por defecto
    }
    return `${this.configService.apiUrl}/profile/${this.personaGet.img}`;
  }


  /* -------------------------------------------------------------------------- */
  /*                                   ejemplo                                  */
  /* -------------------------------------------------------------------------- */

  /**
     * Maneja la selección de archivos de imagen
     * @param event Evento de selección de archivo
     */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {

        console.error('El archivo seleccionado no es una imagen');
        Swal.fire({
          title: 'Formato no válido',
          text: 'Por favor selecciona un archivo de imagen (JPG, PNG, JPEG)',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#009ef7'
        });
        return;
      }

      // Validar tamaño (máximo 1MB)
      if (file.size > 1024 * 1024) {
        Swal.fire({
          title: 'Archivo demasiado grande',
          text: 'La imagen debe ser menor a 1MB',
          icon: 'warning',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#009ef7'
        });
        return;
      }

      this.imagenSeleccionada = file;

      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  /**
    * Sube la imagen seleccionada al servidor
    */
  subirImagen(): void {
    if (!this.imagenSeleccionada) {
      return;
    }

    // Mostrar alerta de carga
    Swal.fire({
      title: 'Subiendo imagen...',
      text: 'Por favor espere',
      icon: 'info',
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = new FormData();
    formData.append('img', this.imagenSeleccionada);

    this.personaService.actualizarImagenPerfil(formData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (respuesta) => {
          if (respuesta && respuesta.data) {
            // Actualizar la imagen en el objeto persona
            this.persona.img = respuesta.data.img;

            // Notificar al servicio sobre la actualización
            this.usuarioService.actualizarDatosPersona(this.persona);

            // Limpiar la selección
            this.imagenSeleccionada = null;

            // Mostrar alerta de éxito
            Swal.fire({
              title: '¡Imagen actualizada!',
              text: 'Tu imagen de perfil ha sido actualizada correctamente',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#009ef7'
            });
          }
        },
        error: (error) => {
          console.error('Error al subir imagen de perfil:', error);

          // Mostrar alerta de error
          Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar la imagen de perfil',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#009ef7'
          });
        }
      });
  }


}
