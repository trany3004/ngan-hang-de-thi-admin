import { Product } from './category.model';
import { Outlet } from './outlet.model';
import { User } from './user.model';

export interface SaleReport {
    id?: string
    pg_user?: User
    pg_outlet?: Outlet
    pg_product?: Product
    reach: number
    buyers: number
    itemCount: number
    actualDisplay: number
    createdAt?: any
    _id?: string,
}
