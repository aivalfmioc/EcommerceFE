import { Injectable } from '@angular/core';
import { Wishlist } from '../common/wishlist';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  wishlistItems: Wishlist[] = [];
  constructor() { }

  addToWishlist(theWishlist: Wishlist) { 
    // // check if we already have the item in our cart
    let alreadyExistsInWishlist: boolean = false;
    let existingWishlistItem: Wishlist = undefined;

    if (this.wishlistItems.length > 0) {
    //   // find the item in the cart based on item id

      existingWishlistItem = this.wishlistItems.find( tempWishlistItem =>tempWishlistItem.id === theWishlist.id ) ;
    //   // check if we found it
      alreadyExistsInWishlist = (existingWishlistItem != undefined);
    }

    if (alreadyExistsInWishlist) {
      // increment the quantity
    }
    else {
      // just add the item to the array
      this.wishlistItems.push(theWishlist);
    }

  }
  remove(theWishlistItem: Wishlist) {
    // get index of item in the array
    const itemIndex = this.wishlistItems.findIndex( tempWishlistItem => tempWishlistItem.id === theWishlistItem.id );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.wishlistItems.splice(itemIndex, 1);

    }
  }


}
