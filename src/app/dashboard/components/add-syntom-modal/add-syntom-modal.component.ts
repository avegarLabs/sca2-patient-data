import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-syntom-modal',
  templateUrl: './add-syntom-modal.component.html',
  imports: [ReactiveFormsModule],
})
export class AddSyntomModalComponent {

  constructor(
    private dialogRef: MatDialogRef<AddSyntomModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  form = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
  });

   confirm() {
    this.dialogRef.close(this.form.value.nombre);
  }

  cancel() {
    this.dialogRef.close();
  }

}
