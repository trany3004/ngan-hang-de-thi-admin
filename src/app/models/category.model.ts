
export interface Category {
    id?: string
    name?: string,
    pg_products: any[]
}
export interface Product {
    id?: string,
    name: string,
    code?: string,
    size?: string,
    quantity?: string,
    price?: number,
    pg_product_group?: Category
}