import { Component, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../environments/environment';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-sticker-dialog',
  standalone: true,
  templateUrl: './create-sticker-dialog.component.html',
  styleUrls: ['./create-sticker-dialog.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class CreateStickerDialogComponent {
  form: FormGroup;
  stickerCreated = output();

  files: File[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<CreateStickerDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      isReaction: [true],
    });
  }
  submitForm() {
    if (this.form.valid) {
      const headers = {
        Authorization: environment.apiToken,
      };

      this.http
        .post(`${environment.apiUrl}/BuiltInMessageCategory`, this.form.value, {
          headers,
        })
        .subscribe({
          next: (response) => {
            const message = 'Sticker created successfully!';
            this.snackBar.open(message, 'OK', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['snackbar-success'],
            });
            this.stickerCreated.emit();
            this.dialogRef.close();
          },
          error: (err) => {
            this.snackBar.open('Failed to create sticker ❌', 'Close', {
              duration: 4000,
              panelClass: ['snackbar-error'],
            });
            console.error(err);
          },
        });
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files) {
      this.files.push(...Array.from(input.files));
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }
}
