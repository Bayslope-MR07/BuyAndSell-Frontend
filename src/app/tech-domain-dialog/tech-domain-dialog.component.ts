import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
  selector: 'app-tech-domain-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogContent, MatDialogModule],
  templateUrl: './tech-domain-dialog.component.html',
  styleUrl: './tech-domain-dialog.component.css',
})
export class TechDomainDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TechDomainDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { text: string }
  ) {}

  close() {
    this.dialogRef.close();
  }
}
