import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { FormControl } from '@angular/forms';
import { WishlistService } from 'src/app/services/wishlist.service';
import { Wishlist } from 'src/app/common/wishlist';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private wishlistService: WishlistService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>{
      this.handleProductDetails();
    }
    )
  }
  ratingcount = 0;
  totalrating = 0;
  Finalrating: any;
  handleProductDetails() {
    //get the id param string. convert string to a number using the + symbol
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product =data
      }
    )
  }
  addToCart(){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    let theCartItem = new CartItem(this.product.id, this.product.name, this.product.imageUrl, this.product.unitPrice);
  
    this.cartService.addToCart(theCartItem);
  }

  ratingcontrol= new FormControl(0);
  getRating(){
    this.ratingcount++;
    this.totalrating += this.ratingcontrol?.value || 0;
    this.Finalrating= (this.totalrating/this.ratingcount).toFixed(2);
    console.log(this.ratingcontrol.value);
  }
  addToWishlist(theProduct: Product) {
    console.log(`Adding to wishlist: ${theProduct.name}, ${theProduct.imageUrl} ,${theProduct.unitPrice}`)
    let theWishlist = new Wishlist(theProduct.id, theProduct.name, theProduct.imageUrl, theProduct.unitPrice);
    this.wishlistService.addToWishlist(theWishlist);
  }
}
