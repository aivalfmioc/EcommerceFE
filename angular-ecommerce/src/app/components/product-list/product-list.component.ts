import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import { ActivatedRoute } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';
import { Wishlist } from 'src/app/common/wishlist';
import { WishlistService } from 'src/app/services/wishlist.service';

import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {NgFor} from '@angular/common';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 8;
  theTotalElements: number = 0;

  previousKeyword: string = "";

  constructor(private productService: ProductService, 
              private cartService: CartService,
              private wishlistService: WishlistService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() =>
    {
      this.listProducts();
    })
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')
    if(this.searchMode){
      this.handleSearchProducts();
    }
    else{
    this.handleListProducts();
    }
  }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    
    if(hasCategoryId){
      //get the "id" param string . convert string to a number using the + sign
      this.currentCategoryId =+this.route.snapshot.paramMap.get('id')!;
    }
    else {
      //not category id available .. default to category id 1
      this.currentCategoryId = 1;
    }
    // check if we have a different category id than previous
    // note: angular will reuse a component if it is currently being viewed
    // if we have a different category id than previous than thePAgeNumber back to 1
    if (this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    // now get the products for the given catgory id
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`)
    this.productService.getProductListPaginate(this.thePageNumber - 1,
      this.thePageSize,
      this.currentCategoryId).subscribe( this.processResult());
 
  }
  
  handleSearchProducts() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
  
    // if we have a different keyword than previous then set thePageNumber to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);
    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1, this.thePageSize, theKeyword).subscribe(this.processResult());
  }

  updatePageSize(pageSize: string){
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)
    let theCartItem = new CartItem(theProduct.unitsInStock, theProduct.id, theProduct.name, theProduct.imageUrl, theProduct.unitPrice);
    this.cartService.addToCart(theCartItem)
  
  }

  sortProductByPrice(option){
    if(option.value =='l2h'){
        this.products.sort((a, b) => Number(a.unitPrice) - Number(b.unitPrice));
    }else if(option.value =='h2l'){
        this.products.sort((a, b) => Number(b.unitPrice) - Number(a.unitPrice));
    }
  }
}
