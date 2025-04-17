import { Component, signal, OnInit, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { StickersService } from '../../services/stickers.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../dialogs/comfirm-diaglog/confirm-diaglog.component';
import { BuildInMessageCategory } from '../../models/BuildInMessageCategory';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-sticker-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './sticker-table.component.html',
  styleUrls: ['./sticker-table.component.scss'],
})
export class StickerTableComponent implements OnInit {
  displayedColumns: string[] = ['index', 'name', 'description', 'actions'];

  constructor(
    private readonly stickersService: StickersService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar
  ) {}

  categories = signal<BuildInMessageCategory[]>([]);
  stickerChoosen = output<BuildInMessageCategory>();
  selectedStickerId: string | null = null;

  isNewStickerActive = true;
  newStickerId = input<string>();
  // thay chỗ này thành model signal
  // dugnf 1 biến

  // ngOnInit() {
  //   this.loadStickers();
  // }

  // loadStickers() {
  //   this.stickersService.fetchCategories();
  //   setTimeout(() => {
  //     this.categories.set(this.stickersService.categories());
  //     console.log('Stickers loaded', this.categories());
  //   }, 1000);
  // }

  isLoading = true;

  ngOnInit() {
    console.log(this.newStickerId());
    
    this.loadStickers();
  }

  loadStickers() {
    this.isLoading = true;

    this.stickersService.fetchCategories();

    
    const subscription = interval(1000)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.categories.set(this.stickersService.categories());
          this.isLoading = false;
          console.log('Stickers loaded', this.categories());
        },
        error: (err) => {
          console.error('Error loading stickers', err);
          this.isLoading = false;
        },
      });

    // Optional: Store subscription for cleanup
    this.subscriptions.add(subscription);
  }

  // Add this to your component for cleanup
  private subscriptions = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  editSticker(sticker: any) {
    console.log('Edit sticker:', sticker);
  }

  deleteSticker(sticker: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Xoá Sticker',
        message: `Bạn có chắc muốn xoá sticker "${sticker.name} không"?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.stickersService.deleteSticker(sticker.id).subscribe({
          next: () => {
            this.snackBar.open(
              'Sticker Category deleted successfully ✅',
              'Close',
              {
                duration: 3000,
                panelClass: ['snackbar-success'],
                horizontalPosition: 'right',
                verticalPosition: 'top',
              }
            );

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

  onStickerClick(sticker: BuildInMessageCategory) {
    this.selectedStickerId = sticker.id;
    this.stickerChoosen.emit(sticker);
    this.isNewStickerActive = false;
  }
}
