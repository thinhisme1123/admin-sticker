import { StickerTableComponent } from './components/sticker-table/sticker-table.component';
import { Component } from '@angular/core';
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

  onCreateDialog() {
    this.dialog.open(CreateStickerDialogComponent, {
      width: '400px'
    });
  }

  title = 'sticker-admin';
}
