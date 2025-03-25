import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    UsuarioPageComponent
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    DataTablesModule
  ]
})
export class UsuarioModule { }
