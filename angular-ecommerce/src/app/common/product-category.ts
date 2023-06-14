export class ProductCategory {

    constructor(public id:number,
                public categoryName: string){
                    
                }
}

export interface Rating {
    id: number;
    productId: number;
    email: string;
    ratingNumber: number;
}