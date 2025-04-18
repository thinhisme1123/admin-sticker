import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { StickersService } from '../../services/stickers.service';
import { StickerCategoryService } from '../../services/sticker-category.service';
import { BuildInMessageCategory } from '../../models/BuildInMessageCategory';

@Component({
  selector: 'app-create-sticker-dialog',
  standalone: true,
  templateUrl: './create-sticker-category-dialog.component.html',
  styleUrls: ['./create-sticker-category-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class CreateStickerCategoryDialogComponent {
  form: FormGroup;
  stickerCategoryCreated = output<BuildInMessageCategory>();

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    public dialogRef: MatDialogRef<CreateStickerCategoryDialogComponent>,
    private readonly snackBar: MatSnackBar,
    private readonly stickerCategoryService : StickerCategoryService
  ) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
    });
  }
  submitForm() {
    if (this.form.valid) {
      // áp dụng toSignal vào đây và ko cần phải gọi subsribe
      this.stickerCategoryService.createNewStickerCategory(this.form.value).subscribe({
        next: (res : any) => {
          const message = 'Sticker created successfully!';
            this.snackBar.open(message, 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
            this.stickerCategoryCreated.emit(res);
            this.dialogRef.close();
        },
        error: (error) => {
          this.snackBar.open('Failed to create sticker ❌', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error'],
          });
          console.error(error);
        },
      });
    }
  }
}
