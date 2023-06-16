import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory, Rating } from '../common/product-category';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl =  environment.luv2shopApiUrl + '/products';
  private categoryUrl =  environment.luv2shopApiUrl +'/product-category';
  private ratingUrl =  environment.luv2shopApiUrl +'/rating/';
  constructor(private httpClient: HttpClient) { }

  getProduct(theProductId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, thePageSize:number, theCategoryId: number): Observable<GetResponseProducts>{
    //need to build url based on category id, page and size
     const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      + `&page=${thePage}&size=${thePageSize}`;
     return this.httpClient.get<GetResponseProducts>(searchUrl);
   }

  getProductList(theCategoryId: number): Observable<Product[] >{
   //build url based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }
  
  searchProducts(theKeyword: string): Observable<Product[]>{
    // need to build URL based on the keyword
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(thePage: number, thePageSize:number, theKeyword: string): Observable<GetResponseProducts>{
    //need to build url based on keyword, page and size
     const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
                      + `&page=${thePage}&size=${thePageSize}`;
     return this.httpClient.get<GetResponseProducts>(searchUrl);
   }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories() : Observable<ProductCategory[]>
  {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getRatingsByProductId(id:number):Observable<Rating[]> {
    return this.httpClient.get<Rating[]>(this.ratingUrl + id);
  }

  postRating(rating:Rating):Observable<Rating[]> {
    return this.httpClient.post<Rating[]>(this.ratingUrl, rating);
  }
/*
  decreaseUnitsInStock(id:number){
    Product product = new Product();
    Product.unitsInStock 
    
  }
  */
}

interface GetResponseProducts{
  _embedded: {
    products: Product[];
  }
  page: {
    size: number,
    totalElements: number,
    totalPages:number,
    number: number
  }
}
interface GetResponseProductCategory{
    _embedded: {
      productCategory: ProductCategory[];
    }
}
