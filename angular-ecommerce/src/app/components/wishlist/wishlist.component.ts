import { Component, OnInit } from '@angular/core';
import { Wishlist } from 'src/app/common/wishlist';
import { WishlistService } from 'src/app/services/wishlist.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishlistItems: Wishlist[] = [];
  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.listWishlist();
  }

  listWishlist() {
    this.wishlistService.wishlistItems.subscribe(items => this.wishlistItems = items);
  }

  remove(wishlist:any):void {
    this.wishlistService.remove(wishlist);
  }
}
