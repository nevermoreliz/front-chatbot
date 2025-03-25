import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

interface MenuItem {
  title: string;
  icon?: string;
  route?: string;
  submenu?: MenuItem[];
  heading?: boolean;
  roles?: string[];
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  menuItems: MenuItem[] = [];
  userRoles: string[] = [];
  currentUrl: string = '';

  constructor(private usuarioService: UsuarioService,private router: Router) { }

  ngOnInit(): void {
    // Obtener roles del usuario desde el servicio
    this.userRoles = this.usuarioService.Usuario?.roles || [];

    // TODO: ['superadmin','agente'] son los roles que existen

    // Suscribirse a los eventos de navegación para actualizar el estado activo
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentUrl = this.router.url;
      this.actualizarEstadoActivo();
    });

    // Inicializar con la URL actual
    this.currentUrl = this.router.url;

    this.loadMenuItems();
  }

  loadMenuItems(): void {
    // Definir todos los elementos del menú con sus roles permitidos
    const allMenuItems: MenuItem[] = [
      {
        title: 'Panel Principal',
        icon: 'ki-outline ki-element-11 fs-2',
        route: '/',
        roles: ['superadmin']
      },
      {
        title: 'Páginas',
        heading: true,
        roles: ['superadmin']
      },
      {
        title: 'Gestión de Usuarios',
        icon: 'ki-outline ki-abstract-28 fs-2',
        roles: ['superadmin'],
        submenu: [
          {
            title: 'Lista de Usuarios',
            route: './usuario',
            roles: ['superadmin']
          },
          {
            title: 'Proyectos',
            route: '/pages/user-profile/projects',
            roles: ['superadmin']
          },
          {
            title: 'Campañas',
            route: '/pages/user-profile/campaigns',
            roles: ['superadmin']
          },
          {
            title: 'Documentos',
            route: '/pages/user-profile/documents',
            roles: ['superadmin']
          },
          {
            title: 'Seguidores',
            route: '/pages/user-profile/followers',
            roles: ['superadmin']
          },
          {
            title: 'Actividad',
            route: '/pages/user-profile/activity',
            roles: ['superadmin']
          }
        ]
      }
    ];

    // Filtrar elementos del menú según los roles del usuario
    this.menuItems = this.filtrarElementosPorRoles(allMenuItems);

    // Actualizar el estado activo inicial
    this.actualizarEstadoActivo();
  }

  /**
   * Filtra los elementos del menú según los roles del usuario
   */
  filtrarElementosPorRoles(items: MenuItem[]): MenuItem[] {
    return items.filter(item => {
      // Si no tiene roles definidos, mostrar a todos
      if (!item.roles) return true;

      // Verificar si algún rol del usuario coincide con los roles permitidos para este elemento
      const tienePermiso = item.roles.some(role => this.userRoles.includes(role));

      // Si tiene submenú y el usuario tiene permiso, filtrar también los elementos del submenú
      if (tienePermiso && item.submenu) {
        item.submenu = this.filtrarElementosPorRoles(item.submenu);
        // Si el submenú está vacío después de filtrar, no mostrar el elemento padre
        return item.submenu.length > 0;
      }

      return tienePermiso;
    });
  }

  /**
   * Actualiza el estado activo de los elementos del menú basado en la URL actual
   */
  actualizarEstadoActivo(): void {
    this.recorrerYActualizarEstado(this.menuItems);
  }

  /**
   * Recorre recursivamente los elementos del menú y actualiza su estado activo
   */
  recorrerYActualizarEstado(items: MenuItem[]): boolean {
    let hayElementoActivo = false;

    items.forEach(item => {
      // Omitir encabezados
      if (item.heading) return;

      // Resetear el estado activo
      item.active = false;

      // Verificar si este elemento tiene una ruta y coincide con la URL actual
      if (item.route) {
        // Para la ruta raíz, verificar exactamente
        if (item.route === '/' && this.currentUrl === '/') {
          item.active = true;
          hayElementoActivo = true;
        } 
        // Para otras rutas, verificar si la URL actual comienza con la ruta del elemento
        // Usamos normalización de rutas para manejar './' y rutas relativas
        else if (item.route !== '/') {
          const normalizedRoute = item.route.startsWith('./') 
            ? item.route.substring(1) // Quitar el punto de './'
            : item.route;
          
          if (this.currentUrl.includes(normalizedRoute)) {
            item.active = true;
            hayElementoActivo = true;
          }
        }
      }

      // Si tiene submenú, verificar recursivamente
      if (item.submenu) {
        const subMenuActivo = this.recorrerYActualizarEstado(item.submenu);
        // Si algún elemento del submenú está activo, el elemento padre también debe estar activo
        if (subMenuActivo) {
          item.active = true;
          hayElementoActivo = true;
        }
      }
    });

    return hayElementoActivo;
  }
}
