import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { Wishlist } from 'src/app/common/wishlist';
import { CartService } from 'src/app/services/cart.service';
import { WishlistService } from 'src/app/services/wishlist.service';
@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  product!: Product;
  wishlistItems: Wishlist[] = [];
  constructor(private wishlistService: WishlistService,   private cartService: CartService
    ) { }

  ngOnInit(): void {
    this.listWishlist();
  }

  listWishlist() {
    this.wishlistService.wishlistItems.subscribe(items => this.wishlistItems = items);
  }

  remove(wishlist:any):void {
    this.wishlistService.remove(wishlist);
  }
  addToCart(wishlist:any):void {
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    let theCartItem = new CartItem(this.product.unitsInStock, this.product.id, this.product.name, this.product.imageUrl, this.product.unitPrice);
  
    this.cartService.addToCart(theCartItem);
  }
}
