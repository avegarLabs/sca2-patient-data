import { Component, inject, OnInit } from '@angular/core';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faCogs,
  faCrosshairs,
  faVirus,
} from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { ScaMarketsService } from '../../../core/services/sca-markets.service';
import { AddMarkerModalComponent } from '../../components/add-marker-modal/add-marker-modal.component';
import { SintomsService } from '../../../core/services/sintoms.service';
import { AddSyntomModalComponent } from '../../components/add-syntom-modal/add-syntom-modal.component';

@Component({
  selector: 'app-config',
  imports: [FontAwesomeModule],
  templateUrl: './config.component.html',
})
export default class ConfigComponent {
  service = inject(ScaMarketsService);
  sinService = inject(SintomsService);
  private dialog = inject(MatDialog);

  private iconLibrary = inject(FaIconLibrary);
  constructor() {
    this.iconLibrary.addIcons(faCogs, faCrosshairs, faVirus);
    this.service.loadScas();
    this.sinService.loadSintoms();
  }

  getIconName(icon: string) {
    return icon.replace('fa', '').toLowerCase();
  }

  openModal() {
    const dialogRef = this.dialog.open(AddMarkerModalComponent, {
      width: '500px',
      panelClass: 'tailwind-modal-panel',
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      console.log('Modal cerrado con nombre:', name);
      if (name) {
        this.service.addSca(name);
      }
    });
  }

  openModalSymtom() {
    const dialogRef = this.dialog.open(AddSyntomModalComponent, {
      width: '500px',
      panelClass: 'tailwind-modal-panel',
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name) {
        this.sinService.addSintom(name);
      }
    });
  }

  deleteMarkert(id: number) {
    this.service.deleteSca(id);
  }

  deleteSyntom(id: number) {
    this.sinService.deleteSintom(id);
  }
}
