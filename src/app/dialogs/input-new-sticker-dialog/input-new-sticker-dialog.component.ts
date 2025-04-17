import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { StickersService } from '../../services/stickers.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-input-new-sticker-dialog',
  standalone: true,
  templateUrl: './input-new-sticker-dialog.component.html',
  styleUrl: './input-new-sticker-dialog.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
})
export class InputNewStickerDialogComponent {
  form: FormGroup;
  file: File | null = null;
  filePreviewUrl: string | null = null;
  isUploading: boolean = false;


  constructor(
    private fb: FormBuilder,
    private stickerSevice : StickersService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<InputNewStickerDialogComponent>
  ) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      file: [null, Validators.required],
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0];
    if (selectedFile) {
      this.file = selectedFile;
      this.filePreviewUrl = URL.createObjectURL(selectedFile);
      this.form.get('file')?.setValue(selectedFile);
    }
  }

  removeFile() {
    this.file = null;
    this.filePreviewUrl = null;
    this.form.get('file')?.reset();
  }

  submitForm() {
    if (!this.form.valid || !this.file) return;
    this.isUploading = true;
    this.stickerSevice.uploadStickerFile(this.file).subscribe({
      next: (filePath) => {
        const payload = {
          name: filePath,
          description: this.form.get('description')?.value,
          file: this.file
        };
        this.snackBar.open('🎉 Sticker uploaded successfully!', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.dialogRef.close(payload);
      },
      error: (err) => {
        console.error('❌ Upload failed:', err);
        this.snackBar.open('❌ Upload failed. Please try again.', 'Close', {
          duration: 3000
        });
      },
      complete: () => {
        this.isUploading = false;
      }
    });
  }
}
