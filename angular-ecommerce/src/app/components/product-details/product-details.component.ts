import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product!: Product;
  isAuthenticated: boolean = false;
  userEmail:string = '';
  ratingcontrol = new FormControl(0);
  allRatings:Rating[] = [];
  userRating:Rating;

  description:string;
  
  ratingcount = 0;
  totalrating = 0;
  Finalrating:any = 0.00;
  unitsInStock: any;

  @ViewChild('myModal', { static: true }) myModal: ElementRef;
  elm: HTMLElement;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private wishlistService: WishlistService,
              private route: ActivatedRoute,
              private oktaAuthService: OktaAuthStateService,
              private modalService: NgbModal,
              @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    ) { }

  ngOnInit(): void {
       this.elm = this.myModal.nativeElement as HTMLElement;


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
  openPDF(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
        this.unitsInStock--;
      }
    )
  }

  postRating():void {
    const theProductId: number = +this.route.snapshot.paramMap.get('id')!;
    let rating:Rating = {
      customer: {
        email: this.userEmail,
        firstName: '',
        lastName: ''
      },
      id: 0,
      productId: theProductId,
      ratingNumber: this.ratingcontrol?.value,
      description: this.description,
    };
    
    this.productService.postRating(rating).subscribe(ratings => {
      this.calculateRatings(ratings);    
    })
  }

  calculateRatings(ratings:Rating[]):void {
    this.allRatings = ratings;

    this.ratingcount = ratings.length;
      this.totalrating = 0;
      

      ratings.map(item => {
        this.totalrating += item.ratingNumber;
        if(this.userEmail === item.customer.email) {
          this.ratingcontrol.setValue(item.ratingNumber); 
          this.description = item.description;
          this.userRating = item;
        }
      })

      this.Finalrating = (this.totalrating/this.ratingcount).toFixed(2);
      
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${this.product.name}, ${this.product.unitPrice}`);
    let theCartItem = new CartItem(this.product.unitsInStock, this.product.id, this.product.name, this.product.imageUrl, this.product.unitPrice);
  
    this.cartService.addToCart(theCartItem);
  }
  // getRating(){
  //   this.ratingcount++;
  //   this.totalrating += this.ratingcontrol?.value || 0;
  //   this.Finalrating= (this.totalrating/this.ratingcount).toFixed(2);
  //   console.log(this.ratingcontrol.value);
  // }


  close(): void {
    this.elm.classList.remove('show');
    setTimeout(() => {
      this.elm.style.width = '0';
    }, 75);


    this.postRating();
  }

  saveDesc(descValue): void {
    this.description = descValue.value;
    this.close();
  }

  open(): void {
      this.elm.classList.add('show');
      this.elm.style.width = '100vw';
  }

}
