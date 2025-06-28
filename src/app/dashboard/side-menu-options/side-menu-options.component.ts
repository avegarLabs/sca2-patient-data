import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faPerson, faCogs } from '@fortawesome/free-solid-svg-icons';
//import { AuthService } from '../../auth/services/auth.service';

interface MenuOptions {
  icon: string;
  label: string;
  subLabel: string;
  route?: string;
  action?: 'logout';
}

@Component({
  selector: 'app-side-menu-options',
  imports: [RouterLink, FontAwesomeModule, RouterLinkActive],
  templateUrl: './side-menu-options.component.html',
})
export class SideMenuOptionsComponent {
  private iconLibrary = inject(FaIconLibrary);
  //auth = inject(AuthService);
  router = inject(Router);
  constructor() {
    this.iconLibrary.addIcons(faPerson, faCogs);
  }

  menuOptions: MenuOptions[] = [
    {
      icon: 'faPerson',
      label: 'Pacientes',
      subLabel: 'Datos de Pacientes',
      route: '/dashboard/persons',
    },
     {
      icon: 'faCogs',
      label: 'Configuración',
      subLabel: 'Elementos Generales',
      route: '/dashboard/config',
    },
    
  
  ];

 /* logout() {
  this.auth.logout();
  this.router.navigate(['/login']);
}*/

  getIconName(icon: string) {
    return icon.replace('fa', '').toLowerCase();
  }
}
