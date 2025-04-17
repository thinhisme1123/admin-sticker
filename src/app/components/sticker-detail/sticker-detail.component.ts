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
  runInInjectionContext
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InputNewStickerDialogComponent } from '../../dialogs/input-new-sticker-dialog/input-new-sticker-dialog.component';
import { BuildInMessage } from '../../models/BuildInMessage';


@Component({
  selector: 'app-sticker-detail',
  imports: [MatIconModule],
  templateUrl: './sticker-detail.component.html',
  styleUrl: './sticker-detail.component.scss',
})
export class StickerDetailComponent implements OnInit{

  stickerDetail = input<BuildInMessageCategory>();
  stickerItems = signal<BuildInMessage[]>([])

  constructor(
    private readonly stickerService: StickersService,
    private readonly dialog: MatDialog,
    private readonly injector: EnvironmentInjector
  ) {}

  ngOnInit(): void {
    runInInjectionContext(this.injector, () => {
      effect(() => {
        const buildMessages = this.stickerDetail()?.builtInMessages || []
        this.stickerItems.set(buildMessages)
      });
    });
  }

  openAddStickerDialog(): void {
    const dialogRef = this.dialog.open(InputNewStickerDialogComponent, {
      width: '600px', 
      disableClose: true,
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      
      if (result) {
        const stickerPayload = {
          builtInMessageCategoryId: this.stickerDetail()?.id,
          name: result.name,
          description: result.description
        };
        console.log('🆕 Sticker files received:', stickerPayload);
        this.stickerService.createNewBuildInMessage(stickerPayload).subscribe((res) => {
          console.log('✅ Stickers created:', res);
        }, (error) => {
          console.error('❌ Error creating stickers:', error);
        })

      }
    });
  }

  deleteSticker(data:any) {
    console.log(data);
    
  }
  onStickerClicked(data:any) {
    console.log(data);
    
  }
}
