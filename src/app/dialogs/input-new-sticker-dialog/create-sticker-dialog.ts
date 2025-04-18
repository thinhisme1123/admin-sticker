import { Component, ElementRef, ViewChild } from '@angular/core';
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
  templateUrl: './create-sticker-dialog.html',
  styleUrl: './create-sticker-dialog.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
})
export class CreateStickerDialogComponent {
  form: FormGroup;
  file: File | null = null;
  filePreviewUrl: string | null = null;
  isUploading: boolean = false;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>; 

  constructor(
    private readonly fb: FormBuilder,
    private readonly stickerSevice : StickersService,
    private readonly snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<CreateStickerDialogComponent>
  ) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      path: ['']
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

    // ✅ Safely reset native file input
    if (this.fileInputRef) {
      this.fileInputRef.nativeElement.value = '';
    }
  }

  submitForm() {
    if (!this.form.valid || !this.file) return;
    this.isUploading = true;
    this.stickerSevice.uploadStickerFile(this.file).subscribe({
      next: (filePath) => {
        const payload = {
          name: this.form.get('name')?.value,
          path: filePath,
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
