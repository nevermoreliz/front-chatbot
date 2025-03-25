import { Component, ViewChild } from '@angular/core';
import { PersonaService } from '../../../../services/persona.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-usuario-page',
  standalone: false,
  templateUrl: './usuario-page.component.html',
  styleUrl: './usuario-page.component.css'
})
export class UsuarioPageComponent {
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective | undefined;

  constructor(
    private personaService: PersonaService,
  ) { }

  ngOnInit(): void {
    this.obtenerPersonas()
  }

  obtenerPersonas() {
    this.personaService.listarPersonas().subscribe({
      next: (respuesta) => {
        console.log(respuesta);
      },
      error: (error) => {

      }
    });
  }

}
