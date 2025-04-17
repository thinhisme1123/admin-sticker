import { BuildInMessageCategory } from './../../models/BuildInMessageCategory';
import { MatIconModule } from '@angular/material/icon';
import { StickersService } from './../../services/stickers.service';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  effect,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateStickerDialogComponent } from '../../dialogs/input-new-sticker-dialog/create-sticker-dialog';
import { BuildInMessage } from '../../models/BuildInMessage';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sticker-detail',
  imports: [MatIconModule],
  templateUrl: './sticker-detail.component.html',
  styleUrl: './sticker-detail.component.scss',
})
export class StickerDetailComponent implements OnInit {
  stickerDetail = input<BuildInMessageCategory>();
  stickerItems = signal<BuildInMessage[]>([]);

  constructor(
    private readonly stickerService: StickersService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
    private readonly injector: EnvironmentInjector
  ) {}

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const category = this.stickerDetail();
        if (category) {
          this.refreshStickerItems();

          this.stickerItems.set(category.builtInMessages || []);
        }
      });
    });
  }
  refreshStickerItems() {
    // Get fresh data from the service for the current sticker category
    this.stickerService
      .getStickerDetail(this.stickerDetail()?.id as string)
      .subscribe({
        next: (updatedCategory) => {
          this.stickerItems.set(updatedCategory.builtInMessages || []);
        },
        error: (err) => {
          console.error('Failed to refresh sticker items:', err);
        },
      });
  }

  // add new sticker
  openAddStickerDialog(): void {
    const dialogRef = this.dialog.open(CreateStickerDialogComponent, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const stickerPayload = {
          builtInMessageCategoryId: this.stickerDetail()?.id,
          name: result.name,
          description: result.description,
          path: result.path,
        };
        console.log('🆕 Sticker files received:', stickerPayload);
        this.stickerService.createNewBuildInMessage(stickerPayload).subscribe({
          next: (newSticker: BuildInMessage) => {
            console.log('✅ Sticker created:', newSticker);

            this.stickerItems.update(prev => [...prev, newSticker]);
            this.refreshStickerItems();
          },
          error: (err) => {
            console.error('❌ Failed to create sticker:', err);
          },
        });
      }
    });
  }
  //hanlde click delete sticker
  deleteSticker(id: string) {
    this.stickerService.deleteBuildInMessage(id).subscribe({
      next: () => {
        this.stickerItems.update((prev) =>
          prev.filter((item) => item.id !== id)
        );

        this.snackBar.open('Sticker deleted successfully ✅', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-success'],
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
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
  onStickerClicked(data: any) {
    console.log(data);
  }
}
