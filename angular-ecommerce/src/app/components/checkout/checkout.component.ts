import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Product } from 'src/app/common/product';
import { Purchase } from 'src/app/common/purchase';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
 
 
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
 
  checkoutFormGroup: FormGroup;
 
  totalPrice: number = 0;
  totalQuantity: number = 0;
  
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
 
  storage: Storage = sessionStorage;
  
  //initalize Stripe API
  stripe = Stripe(environment.stripePublishableKey);

  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";

  isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }
 
  ngOnInit(): void {

    //set up Stripe payment form
    this.setupStripePaymentForm();

    this.reviewCartDetails();
    //read the usr s email address from browser storage
    const theEmail = JSON.parse(this.storage.getItem('userEmail'));
    
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        lastName:  new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail,
                              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), ShopValidators.notOnlyWhitespace])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
        country: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace])
       }),
       creditCard: this.formBuilder.group({
      //   cardType: new FormControl('', [Validators.required]),
      //   nameOnCard:new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      //   cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}'), ShopValidators.notOnlyWhitespace]),
      //   securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}'), ShopValidators.notOnlyWhitespace]),
      //   expirationMonth: [''],
      //   expirationYear: ['']
       })
    });
 
    // populate credit card months
 
    // const startMonth: number = new Date().getMonth() + 1;
    // console.log("startMonth: " + startMonth);
 
    // this.shopFormService.getCreditCardMonths(startMonth).subscribe(
    //   data => {
    //     console.log("Retrieved credit card months: " + JSON.stringify(data));
    //     this.creditCardMonths = data;
    //   }
    // );
 
    // populate credit card years
 
    // this.shopFormService.getCreditCardYears().subscribe(
    //   data => {
    //     console.log("Retrieved credit card years: " + JSON.stringify(data));
    //     this.creditCardYears = data;
    //   }
    // );
 
 
  }
  setupStripePaymentForm() {
    //get a handle to stripe elements
    var elements = this.stripe.elements();
    //create a card element
    this.cardElement = elements.create('card', { hidePostalCode: true});

    //add an instance of card Ui component into the the 'card-element' div
    this.cardElement.mount('#card-element');
  
    // add event binding for the change event on the card element
    this.cardElement.on('change', (event: any) =>
    {
      this.displayError = document.getElementById('card-errors');
      if(event.complete){
        this.displayError.textContent= "";
      }
      else if(event.error){
        this.displayError.textContent = event.error.message;
      }
    });
  }
 
  reviewCartDetails() {
     
        // subscribe to cartService.totalQuantity
        this.cartService.totalQuantity.subscribe(
          totalQuantity => this.totalQuantity = totalQuantity
        );
    
        // subscribe to cartService.totalPrice
        this.cartService.totalPrice.subscribe(
          totalPrice => this.totalPrice = totalPrice
        );
  }
 
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
 
  get creditCardType() {return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() {return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() {return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() {return this.checkoutFormGroup.get('creditCard.securityCode'); }
 
  onSubmit() {
   console.log("Handling the submit button");
   console.log(this.checkoutFormGroup.get('customer').value);
   
    if (this.checkoutFormGroup.invalid) {
      console.log("Invalid form");
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    //set up order
    let order =new Order(this.totalQuantity, this.totalPrice);
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity
    //get cart items
    const cartItems = this.cartService.cartItems;

    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem.imageUrl!, tempCartItem.unitPrice!, tempCartItem.quantity, tempCartItem.id!));
 
    //decrease quantity
    // let product = new Product()

    //set up purchase
    let purchase = new Purchase();
 
    //populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    //populate purchase - shipping addrees
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    //populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;
    //compute payment info
    this.paymentInfo.amount = Math.round(this.totalPrice * 100) ;
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer.email;

    console.log(`this.paymentInfo.amount: ${this.paymentInfo.amount}`)
    //call REST API via the checkoutservice
    // if valid form then create payment intent, confirm card payment place order
    if(!this.checkoutFormGroup.invalid && this.displayError.textContent === "" ){
      console.log("INSIDE ============================= ");
      
      this.isDisabled = true;
      this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {

          console.log("INSIDE ============================= 123 ");

          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: purchase.customer.email,
                name: `${purchase.customer.firstName} ${purchase.customer.lastName}`,
                address: {
                  line1: purchase.shippingAddress.street,
                  city: purchase.shippingAddress.city,
                  postal_code: purchase.shippingAddress.zipCode,
                  country: purchase.shippingAddress.country
                }
              }
            }
          }, 
          { handleActions: false})
          .then((result:any) => {
            if(result.error) {
              alert(`There was an error: ${result.error.message}`);
              this.isDisabled = false;
            }
            else { //calll rest api via th checkout service
              this.checkoutService.placeOrder(purchase).subscribe({
                next: (response: any) => {
                //  alert(`Your order has been received\nThank you for shopping with us❤️`)
                  //reset card
                  
                  this.showSuccessMessage(
                    'Your order has been received',
                    'Thank you for shopping with us❤️',
                    'success',
                    true,
                )
                  this.resetCart();
                  this.isDisabled = false;
                },
                error: (err: any) => {
                  alert(`There was an error: ${err.message}`);
                  this.isDisabled = false;
                }
              })

            }
          });
        }
      );
    }
    else {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }
  showSuccessMessage(title, message, icon = null,
    showCancelButton = false){
    return Swal.fire({
      title: title,
      text: message,
      icon: icon,
      showCancelButton: showCancelButton,
      cancelButtonColor: '#3085d6' ,
      cancelButtonText: "See orders"
    }).then(function(){
      
      this.router.navigateByUrl('/order-history');
    })
    cancel => {
      if (cancel) {
        this.router.navigateByUrl('/order-history');
      }
    }
  }
  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
 
    //reset the form
    this.checkoutFormGroup.reset();
 
    // navigate back to the products page
    this.router.navigateByUrl('/products')
  }
 
  handleMonthsAndYears() {
 
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
 
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);
 
    // if the current year equals the selected year, then start with the current month
 
    let startMonth: number;
 
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
 
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
 
 
}
 
