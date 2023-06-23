import { Inject, Injectable } from '@angular/core';
import { Wishlist } from '../common/wishlist';
import { BehaviorSubject } from 'rxjs';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  // wishlistItems: Wishlist[] = [];
  isAuthenticated: boolean = false;
  userEmail:string = "";

  wishlistItems:BehaviorSubject<Wishlist[]> = new BehaviorSubject<Wishlist[]>([]);
  
  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { 
 
      this.oktaAuthService.authState$.subscribe(
        (result) => {
          this.isAuthenticated = result.isAuthenticated!;
          this.getUserDetails();
        }
      )
  }
  
  async getUserDetails():Promise<void> {
    this.wishlistItems.next([]);
    if(this.isAuthenticated){
      let res = await this.oktaAuth.getUser();
      this.userEmail = res.email;
      try{
        
        let wishlist = JSON.parse(localStorage.getItem(this.userEmail)) ?? [];
        this.wishlistItems.next(wishlist);
      } catch(e) {}

    } else {
      try{
        let wishlist = JSON.parse(localStorage.getItem("wishlist")) ?? [];
        this.wishlistItems.next(wishlist);
      } catch(e) {}
    }
  }

  addToWishlist(theWishlist: any) { 
    // // check if we already have the item in our wishlist
    let alreadyExistsInWishlist: boolean = false;
    let existingWishlistItem: Wishlist = undefined;
    let items:any = this.wishlistItems.getValue();
    if (items.length > 0) {
       // find the item in the wishlist based on item id
      existingWishlistItem = items.find( tempWishlistItem =>tempWishlistItem.id === theWishlist.id ) ;
      // check if we found it
      alreadyExistsInWishlist = (existingWishlistItem != undefined);
    }
    if (alreadyExistsInWishlist) {
    }
    else {
      // just add the item to the array
      items.push(theWishlist);
    }
    this.wishlistItems.next(items);
    localStorage.setItem((this.isAuthenticated ? this.userEmail : "wishlist"), JSON.stringify(items)); 
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
    localStorage.setItem((this.isAuthenticated ? this.userEmail : "wishlist"), JSON.stringify(items));
  }
}
