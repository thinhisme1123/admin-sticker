import { Component, signal, OnInit, output, input,computed,effect, runInInjectionContext,toSignal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../dialogs/comfirm-diaglog/confirm-diaglog.component';
import { BuildInMessageCategory } from '../../models/BuildInMessageCategory';
import { StickerCategoryService } from '../../services/sticker-category.service';
import { EnvironmentInjector } from '@angular/core';
import { EditStickerCategoryDialogComponent } from '../../dialogs/edit-sticker-category-dialog/edit-sticker-category-dialog.component';
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
    private readonly stickerCategoryService: StickerCategoryService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly injector: EnvironmentInjector
  ) {}

  categories = signal<BuildInMessageCategory[]>([]);
  stickerChoosen = output<BuildInMessageCategory>();
  newStickerId = input<string>();
  selectedStickerId = signal<string | null>(null);

  activeRowId = computed(() =>
   this.selectedStickerId() ?? this.newStickerId() 
  );
  // thay chỗ này thành model signal
  // dùng 1 biến

  isLoading = true;
  isServerDie = false;

  ngOnInit() {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        if (this.newStickerId()) {
          this.selectedStickerId.set(null); 
        }
      });
    });
    this.loadStickers();
  }
  // loading sticker category
  loadStickers() {
    this.isLoading = true;

    const categoriesSignal = toSignal(this.stickerCategoryService.fetchCategories(), { initialValue: null });

  const result = categoriesSignal();

  if (result) {
    this.categories.set(result);
    this.isLoading = false;
    console.log('Stickers loaded', this.categories());
  } else if (result instanceof Error) {
    console.error('Error loading stickers', result);
    this.isLoading = false;
  }

    // Optional: Store subscription for cleanup
    // this.subscriptions.add(subscription);
  }

  // Add this to your component for cleanup
  // private readonly subscriptions = new Subscription();

  // ngOnDestroy() {
  //   this.subscriptions.unsubscribe();
  // }

  editSticker(sticker: BuildInMessageCategory) {
    console.log('Edit sticker:', sticker);
    const dialogRef = this.dialog.open(EditStickerCategoryDialogComponent, {
      width: '500px',
      data: sticker,
      disableClose: true
    });
  
    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        // Optionally reload or update UI
        console.log('📝 Sticker category updated:', updated);
        this.loadStickers(); // your method to refresh list
      }
    });
  }

  deleteSticker(sticker: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Xoá Sticker',
        message: `Bạn có chắc muốn xoá sticker "${sticker.name}" không?`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.stickerCategoryService.deleteStickerCategory(sticker.id).subscribe({
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
    this.selectedStickerId.set(sticker.id)
    this.stickerChoosen.emit(sticker);
  }
}
