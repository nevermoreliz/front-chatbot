import { Injectable } from '@angular/core';

export interface AppConfig {
  apiUrl: string;
  production: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private config: AppConfig;

  constructor() {
    // Determinar el entorno basado en la URL o alguna otra condición
    
    const isProduction = window.location.hostname !== 'localhost';

    this.config = {
      apiUrl: isProduction ? 'https://dominio.com/api' : 'http://localhost:3001/api',
      production: isProduction
    }
  }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get isProduction(): boolean {
    return this.config.production;
  }

}
