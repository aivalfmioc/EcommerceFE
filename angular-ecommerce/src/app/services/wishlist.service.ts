import { Injectable } from '@angular/core';
import { Wishlist } from '../common/wishlist';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  // wishlistItems: Wishlist[] = [];

  wishlistItems:BehaviorSubject<Wishlist[]> = new BehaviorSubject<Wishlist[]>([]);
  
  constructor() { 
    try{
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) ?? [];
      this.wishlistItems.next(wishlist);
    } catch(e) {}
    
    
  }

  addToWishlist(theWishlist: any) { 
    // // check if we already have the item in our cart
    let alreadyExistsInWishlist: boolean = false;
    let existingWishlistItem: Wishlist = undefined;

    let items:any = this.wishlistItems.getValue();
  
    if (items.length > 0) {
    //   // find the item in the cart based on item id

      existingWishlistItem = items.find( tempWishlistItem =>tempWishlistItem.id === theWishlist.id ) ;
    //   // check if we found it
      alreadyExistsInWishlist = (existingWishlistItem != undefined);
    }

    if (alreadyExistsInWishlist) {
      // increment the quantity
    }
    else {
      // just add the item to the array
      items.push(theWishlist);
    }

    this.wishlistItems.next(items);
    localStorage.setItem("wishlist", JSON.stringify(items))
  }
  remove(theWishlistItem: any) {
    
    let items:any = this.wishlistItems.getValue();
    

    // get index of item in the array
    const itemIndex =items.findIndex( tempWishlistItem => tempWishlistItem.id === theWishlistItem.id );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      items.splice(itemIndex, 1);
    }

    this.wishlistItems.next(items);
    localStorage.setItem("wishlist", JSON.stringify(items))  
  }
}
