import { Product } from './category.model';
import { Outlet } from './outlet.model';

export interface Inventory {
    id?: string
    pg_outlet?: Outlet
    pg_product?: Product
    createdAt: any
    before: number
    after: number
    _id?: string,
}
