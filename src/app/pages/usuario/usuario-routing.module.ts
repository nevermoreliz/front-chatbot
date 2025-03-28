import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioPageComponent } from './pages/usuario-page/usuario-page.component';

const routes: Routes = [
  {
    path: '',
    component: UsuarioPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
