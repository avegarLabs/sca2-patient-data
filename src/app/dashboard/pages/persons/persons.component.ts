import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { GeneralDataService } from '../../../core/services/general-data.service';
import { PersonCardComponent } from './components/person-card/person-car.dcomponent';
import { DeclarePersonModalComponent } from './components/declare-person-modal/declare-person-modal.component';

@Component({
  selector: 'app-persons',
  imports: [FontAwesomeModule, PersonCardComponent, MatPaginatorModule],
  templateUrl: './persons.component.html',
 
})
export default class PersonsComponent {
service = inject(GeneralDataService);
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
    this.iconLibrary.addIcons(faBook);
    this.service.loadDataOfPersons();
  }

    openModal() {
      const dialogRef = this.dialog.open(DeclarePersonModalComponent, {
        width: '600px',
        panelClass: 'tailwind-modal-panel',
      });
  
      dialogRef.afterClosed().subscribe((data: any) => {
        if (data) {
          this.service.initGeneralData(data);
        }
      });
    }


   getIconName(icon: string) {
    return icon.replace('fa', '').toLowerCase();
  }

  get paginatedPersons() {
    const start = this.pageIndex * this.pageSize;
    return this.service.persons().slice(start, start + this.pageSize);
  }

  // Maneja eventos de paginación
  handlePageEvent(event: any) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
  }

}
