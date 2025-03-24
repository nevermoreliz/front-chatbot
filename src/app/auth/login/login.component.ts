import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public formSubmitted = false;
  public loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService
  ) {
    /**
     * nombre_usuario: ['flores9959006', Validators.required],
     * contrasenia: ['9959006#2024', Validators.required],      
     */

    this.loginForm = this.fb.group({
      nombre_usuario: [localStorage.getItem('nombre_usuario') || '', Validators.required],
      contrasenia: ['9959006#2024', Validators.required],
      recordarme: [false],
    });
  }

  login() {
    // console.log(this.loginForm.value);

    this.usuarioService.login(this.loginForm.value).subscribe(
      {
        next: (resp) => {
          // console.log(resp);

          // Si el checkbox de "recordarme" está marcado
          // guarda el nombre de usuario en el localStorage
          if (this.loginForm.get('recordarme')?.value) {
            localStorage.setItem('nombre_usuario', this.loginForm.get('nombre_usuario')?.value);
          }else{
            // Si no está marcado, elimina el nombre de usuario del localStorage
            localStorage.removeItem('nombre_usuario');
          }

          // Navega a la página del dashboard
          this.router.navigateByUrl('/dashboard');
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      }
    )
  }
}
