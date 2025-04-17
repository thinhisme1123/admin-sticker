import { StickerTableComponent } from './components/sticker-table/sticker-table.component';
import { Component, signal, ViewChild } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { StickerDetailComponent } from './components/sticker-detail/sticker-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateStickerCategoryDialogComponent } from './dialogs/create-sticker-dialog/create-sticker-category-dialog.component';
import { BuildInMessageCategory } from './models/BuildInMessageCategory';
@Component({
  selector: 'app-root',
  imports: [
    HeaderComponent,
    SidebarComponent,
    MatIconModule,
    StickerTableComponent,
    StickerDetailComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private readonly dialog: MatDialog) {}

  selectedSticker = signal<BuildInMessageCategory | null>(null)
  activeStickerId =signal<string | null>(null)
 
  @ViewChild(StickerTableComponent) stickerTable! : StickerTableComponent

  onCreateDialog() {
    const dialogRef = this.dialog.open(CreateStickerCategoryDialogComponent, {
      width: '400px'
    });
    // re-render view to update new data 
    dialogRef.componentInstance.stickerCreated.subscribe((newStickerId: any) => {
      console.log('New sticker created with ID:', newStickerId);
      this.activeStickerId.set(newStickerId)
      this.stickerTable.loadStickers(); 
    });
  }
  onStickerSelected(sticker: BuildInMessageCategory) {
    this.selectedSticker.set(sticker)
  }
  
  title = 'Trao đổi';
}
