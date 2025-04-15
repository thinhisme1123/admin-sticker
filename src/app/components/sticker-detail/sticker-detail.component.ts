import { MatIconModule } from '@angular/material/icon';
import { StickersService } from './../../services/stickers.service';
import { Component, input, OnChanges, signal, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-sticker-detail',
  imports: [MatIconModule],
  templateUrl: './sticker-detail.component.html',
  styleUrl: './sticker-detail.component.scss'
})
export class StickerDetailComponent implements OnChanges{

  stickerId = input<string>('')
  stickerDetail = signal<any>(null)
  constructor(private readonly stickerService : StickersService) {}

  firstStickersList = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    name: `Sticker ${i + 1}`,
    imageUrl: 'assets/library.png'
  }));
  
  secondStickersList = Array.from({ length: 23 }).map((_, i) => ({
    id: i,
    name: `Sticker ${i + 1}`,
    imageUrl: 'assets/school.gif'
  }));
  
  ngOnChanges(changes: SimpleChanges): void {
      if(changes['stickerId'] && this.stickerId()) {
        this.loadStickerDetail(this.stickerId())
      }
  }
  loadStickerDetail(stickerId:string) {
    console.log('loadStickerDetail', stickerId );
    this.stickerService.getStickerDetail(stickerId).subscribe({
      next: (stickerDetail) => this.stickerDetail.set(stickerDetail),
      error: (err) => {
        console.error('Failed to fetch sticker detail:', err);
        this.stickerDetail.set(null);
      }
    })
  }


}
