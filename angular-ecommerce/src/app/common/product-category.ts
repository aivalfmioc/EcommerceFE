export class ProductCategory {

    constructor(public id:number,
                public categoryName: string){
                    
                }
}

export interface Rating {
    id: number;
    productId: number;
    customer: {
        email: string;
        firstName: string;
        lastName: string;
    }
    ratingNumber: number;
    description: string;
}
