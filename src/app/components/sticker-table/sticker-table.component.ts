import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { StickersService } from '../../services/stickers.service';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sticker-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule],
  templateUrl: './sticker-table.component.html',
  styleUrls: ['./sticker-table.component.scss'],
})
export class StickerTableComponent implements OnInit {
  displayedColumns: string[] = ['index','name', 'description', 'isReaction','actions'];

  constructor(private readonly stickersService: StickersService) {}

  // ✅ Use getter to safely access the signal
  // get categories() {
  //   return this.stickersService.categories();
  // }
  categories = signal<any[]>([]);

  ngOnInit() {
    console.log('Sticker Init');

    this.stickersService.fetchCategories();
    setTimeout(() => {
      this.categories.set(this.stickersService.categories());
      console.log(this.categories());
      
    }, 1000);
  }

  editSticker(sticker: any) {
    console.log('Edit sticker:', sticker);
    // Implement your edit logic here
    // For example, open a dialog or navigate to an edit page
  }

  deleteSticker(sticker: any) {
    console.log('Delete sticker:', sticker);
    // Implement your delete logic here
    // For example, show a confirmation dialog and then delete
    if (confirm(`Are you sure you want to delete ${sticker.name}?`)) {
      // Call service to delete sticker
      // this.stickersService.deleteSticker(sticker.id);
    }
  }
}
