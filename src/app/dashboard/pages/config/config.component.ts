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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-config',
  imports: [FontAwesomeModule, MatPaginatorModule],
  templateUrl: './config.component.html',
})
export default class ConfigComponent {
  service = inject(ScaMarketsService);
  sinService = inject(SintomsService);
  private dialog = inject(MatDialog);

  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];

  pageSize1 = 5;
  pageIndex1 = 0;
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator) paginator1!: MatPaginator;

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

  get paginatedScas() {
    const start = this.pageIndex * this.pageSize;
    return this.service.scas().slice(start, start + this.pageSize);
  }

  // Maneja eventos de paginación
  handlePageEvent(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

  get paginatedSintoms() {
    const start = this.pageIndex1 * this.pageSize1;
    return this.sinService.simtoms().slice(start, start + this.pageSize1);
  }

  // Maneja eventos de paginación
  handlePageEvent1(event: any) {
    this.pageSize1 = event.pageSize;
    this.pageIndex1 = event.pageIndex;
  }
}
