import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../product';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Wishlist } from '../../wishlist';

@Component({
  selector: 'app-wishlist-icon',
  templateUrl: './wishlist-icon.component.html',
  styleUrls: ['./wishlist-icon.component.css']
})
export class WishlistIconComponent implements OnInit {

  @Input("product") product:Product;
  @Input("isHover") isHover:boolean = false;

  wishlistItems: Wishlist[] = [];

  isWishList:boolean = false;

  constructor(private wishlistService: WishlistService) {
     this.wishlistItems = this.wishlistService.wishlistItems.getValue();
  }

  ngOnInit(): void {
    let find = this.wishlistItems.find( tempWishlistItem =>tempWishlistItem.id === this.product.id);
    if(find ) this.isWishList = true;
  }

  addIntoWishList():void {
    this.wishlistService.addToWishlist(this.product);
    this.isWishList = true;
  }

  removeFromWishList():void{
    this.wishlistService.remove(this.product);
    this.isWishList = false;
  }

}
