import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

interface MenuItem {
  title: string;
  icon?: string;
  route?: string;
  submenu?: MenuItem[];
  heading?: boolean;
  roles?: string[];
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

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    // Obtener roles del usuario desde el servicio
    this.userRoles = this.usuarioService.Usuario?.roles || [];

    // TODO: ['superadmin','agente'] son los roles que existen
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
            route: './lista-usuarios',
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
}
