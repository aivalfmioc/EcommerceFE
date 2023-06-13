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
  storage: Storage = sessionStorage;

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.handleWishlist();
  }
  
  handleWishlist() {
    this.wishlistItems = this.wishlistService.wishlistItems;
   // read the user's email address from browser storage
   const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

   // retrieve data from the service
   this.wishlistService.getWishlist(theEmail).subscribe(
     data => {
       this.wishlistItems = data._embedded.wishlist;
     }
   );
 
 
  }
  remove(theWishlistItem: Wishlist) {
    this.wishlistService.remove(theWishlistItem);
  }

}
