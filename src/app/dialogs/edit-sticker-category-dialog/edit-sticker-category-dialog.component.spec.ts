import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStickerCategoryDialogComponent } from './edit-sticker-category-dialog.component';

describe('EditStickerCategoryDialogComponent', () => {
  let component: EditStickerCategoryDialogComponent;
  let fixture: ComponentFixture<EditStickerCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditStickerCategoryDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditStickerCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
