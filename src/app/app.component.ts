import { StickerTableComponent } from './components/sticker-table/sticker-table.component';
import { Component, signal, ViewChild } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { MatIconModule } from '@angular/material/icon';
import { StickerDetailComponent } from './components/sticker-detail/sticker-detail.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateStickerDialogComponent } from './dialogs/create-sticker-dialog/create-sticker-dialog.component';
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

  selectedStickerid = signal<string>('')

  @ViewChild(StickerTableComponent) stickerTable! : StickerTableComponent

  onCreateDialog() {
    const dialogRef = this.dialog.open(CreateStickerDialogComponent, {
      width: '400px'
    });
    // re-render view to update new data 
    dialogRef.componentInstance.stickerCreated.subscribe(() => {
      console.log('New sticker created → refreshing table...');
      this.stickerTable.loadStickers(); 
    });
  }
  onStickerSelected(stickerId: string) {
    this.selectedStickerid.set(stickerId)
  
  }
  
  title = 'sticker-admin';
}
