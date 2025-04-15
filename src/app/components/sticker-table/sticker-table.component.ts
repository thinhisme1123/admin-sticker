import { Component, signal, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { StickersService } from '../../services/stickers.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../dialogs/comfirm-diaglog/confirm-diaglog.component';


@Component({
  selector: 'app-sticker-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './sticker-table.component.html',
  styleUrls: ['./sticker-table.component.scss'],
})
export class StickerTableComponent implements OnInit {
  displayedColumns: string[] = [
    'index',
    'name',
    'description',
    'isReaction',
    'actions',
  ];

  constructor(
    private readonly stickersService: StickersService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  categories = signal<any[]>([]);
  stickerSelected = output<string>()

  ngOnInit() {
    this.loadStickers();
  }

  loadStickers() {
    this.stickersService.fetchCategories();
    setTimeout(() => {
      this.categories.set(this.stickersService.categories());
      console.log('Stickers loaded', this.categories());
    }, 1000);
  }

  editSticker(sticker: any) {
    console.log('Edit sticker:', sticker);
  }

  deleteSticker(sticker: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Sticker',
        message: `Are you sure you want to delete "${sticker.name}"?`,
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.stickersService.deleteSticker(sticker.id).subscribe({
          next: () => {
            this.snackBar.open('Sticker deleted successfully ✅', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-success'],
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
  
            this.loadStickers(); 
          },
          error: (err) => {
            console.error('Failed to delete sticker:', err);
            this.snackBar.open('Failed to delete sticker ❌', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          },
        });
      }
    });
  }
  
  onStickerClick(stickerID: string) {
    this.stickerSelected.emit(stickerID)
  }
}
