import { Component, inject, input, OnInit } from '@angular/core';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
 faUser
} from '@fortawesome/free-solid-svg-icons';
import { DatosGenerales } from '../../../../../core/interfaces/datos_generales';

@Component({
  selector: 'app-person-card',
  imports: [FontAwesomeModule],
  templateUrl: './person-card.component.html',
})
export class PersonCardComponent  {
private iconLibrary = inject(FaIconLibrary);
person = input.required<DatosGenerales>();
  constructor() {
     this.iconLibrary.addIcons(faUser);
   }


   getIconName(icon: string) {
    return icon.replace('fa', '').toLowerCase();
  }

}
