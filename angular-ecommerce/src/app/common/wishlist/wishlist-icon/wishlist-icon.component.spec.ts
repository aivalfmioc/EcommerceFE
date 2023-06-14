import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistIconComponent } from './wishlist-icon.component';

describe('WishlistIconComponent', () => {
  let component: WishlistIconComponent;
  let fixture: ComponentFixture<WishlistIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistIconComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
