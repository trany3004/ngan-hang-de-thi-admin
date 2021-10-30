import { Product } from './category.model';
import { Outlet } from './outlet.model';
import { User } from './user.model';

export interface Gift {
    id?: string
    pg_user?: User
    pg_outlet?: Outlet
    pg_product?: Product
    quantity: number
    customerName: string
    customerMobile: string
    receipt: string
    node: string
    _id?: string,
}
