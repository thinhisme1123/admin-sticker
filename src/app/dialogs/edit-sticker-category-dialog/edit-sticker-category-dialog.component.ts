import { Component, Inject, output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BuildInMessageCategory } from '../../models/BuildInMessageCategory';
import { StickerCategoryService } from '../../services/sticker-category.service';

@Component({
  selector: 'app-edit-sticker-category-dialog',
  standalone: true,
  templateUrl: './edit-sticker-category-dialog.component.html',
  styleUrls: ['./edit-sticker-category-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class EditStickerCategoryDialogComponent {
  form: FormGroup;
  stickerCategoryUpdated = output<BuildInMessageCategory>();

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private readonly stickerCategoryService: StickerCategoryService,
    public dialogRef: MatDialogRef<EditStickerCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BuildInMessageCategory 
  ) {
    this.form = this.fb.group({
      id: data.id,
      name: [data.name, Validators.required],
      description: [data.description],
      type: 0
    });
  }

  submitForm(): void {
    if (this.form.valid) {
      console.log(this.form.value);
      const updatedData: BuildInMessageCategory = this.form.value;
      
      this.stickerCategoryService.updateStickerCategory(updatedData).subscribe({
        next: () => {
          this.snackBar.open('✅ Sticker category updated!', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-success'],
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.stickerCategoryUpdated.emit(updatedData);
          this.dialogRef.close(updatedData);
        },
        error: (error) => {
          console.error('❌ Update failed:', error);
          this.snackBar.open('❌ Failed to update sticker', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
