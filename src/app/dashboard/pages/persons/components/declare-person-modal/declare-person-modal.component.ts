import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-declare-person-modal',
  templateUrl: './declare-person-modal.component.html',
  imports: [ReactiveFormsModule],
})
export class DeclarePersonModalComponent {
  constructor(
    private dialogRef: MatDialogRef<DeclarePersonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  form = new FormGroup({
    codigo: new FormControl('', [Validators.required]),
    nombresApellidos: new FormControl('', [Validators.required]),
    historiaClinica: new FormControl(''),
    areaSalud: new FormControl('', [Validators.required])
  });

  confirm() {
    this.dialogRef.close(this.form.value);
  }

  cancel() {
    this.dialogRef.close();
  }
}
