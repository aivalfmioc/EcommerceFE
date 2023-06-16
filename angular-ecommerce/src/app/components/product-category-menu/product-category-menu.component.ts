import { Component, Inject, OnInit } from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import OktaAuth from '@okta/okta-auth-js';
import { ProductCategory } from 'src/app/common/product-category';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  userEmail:string = "";
  productCategories : ProductCategory[]=[];
  isAuthenticated: boolean = false;
  constructor(private productService: ProductService,
              private oktaAuthService: OktaAuthStateService,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
          ) { }

  ngOnInit(): void {
    this.listProductCategories();
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    )
  }
  async getUserDetails():Promise<void> {
    if(this.isAuthenticated){
      let res = await this.oktaAuth.getUser();
      this.userEmail = res.email;
      console.log(this.userEmail);
    }
  }
 
  listProductCategories() {
    this.productService.getProductCategories().subscribe(
      data => {
        // console.log('Product Categories='+ JSON.stringify(data))
        this.productCategories = data;
      }
    )
  }

  logout() {
    this.oktaAuth.signOut();
    }

}
