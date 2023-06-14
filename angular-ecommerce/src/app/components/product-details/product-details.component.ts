import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { FormControl } from '@angular/forms';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Wishlist } from 'src/app/common/wishlist';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { Rating } from 'src/app/common/product-category';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  isAuthenticated: boolean = false;
  userEmail:string = "";
  ratingcontrol = new FormControl(0);
  allRatings = [];

  
  ratingcount = 0;
  totalrating = 0;
  Finalrating:any = 0.00;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private wishlistService: WishlistService,
              private route: ActivatedRoute,
              private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
            ) { }

  ngOnInit(): void {

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )

    this.route.paramMap.subscribe(() =>{
        this.handleProductDetails();
      }
    )
  }

  async getUserDetails():Promise<void> {
    if(this.isAuthenticated){
      let res = await this.oktaAuth.getUser();
      this.userEmail = res.email;
      
      this.handleProductDetails();
      console.log(this.userEmail);
    }
  }



  handleProductDetails() {
    //get the id param string. convert string to a number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;

    this.productService.getRatingsByProductId(theProductId).subscribe(ratings => {
      this.calculateRatings(ratings);    
    })

    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product =data
      }
    )
  }

  postRating():void {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    let rating:Rating = {
      email: this.userEmail,
      id: 0,
      productId: theProductId,
      ratingNumber: this.ratingcontrol?.value
    };
    
    this.productService.postRating(rating).subscribe(ratings => {
      this.calculateRatings(ratings);    
    })

  }

  calculateRatings(ratings:Rating[]):void {
    this.ratingcount = ratings.length;
      this.totalrating = 0;

      
      console.log("============================================= enauk");

      console.log(this.userEmail);

      console.log(ratings);
      
      

      ratings.map(item => {
        this.totalrating += item.ratingNumber;
        if(this.userEmail === item.email) {
          this.ratingcontrol.setValue(item.ratingNumber); 
        }
      })

      this.Finalrating = (this.totalrating/this.ratingcount).toFixed(2);
      
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    let theCartItem = new CartItem(this.product.id, this.product.name, this.product.imageUrl, this.product.unitPrice);
  
    this.cartService.addToCart(theCartItem);
  }

  // getRating(){
  //   this.ratingcount++;
  //   this.totalrating += this.ratingcontrol?.value || 0;
  //   this.Finalrating= (this.totalrating/this.ratingcount).toFixed(2);
  //   console.log(this.ratingcontrol.value);
  // }
}
