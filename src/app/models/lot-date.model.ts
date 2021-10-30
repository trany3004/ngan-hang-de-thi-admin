import { Product } from './category.model';
import { Outlet } from './outlet.model';
import { User } from './user.model';

export interface LotDate {
    id?: string
    pg_user?: User
    pg_outlet?: Outlet
    pg_product?: Product
    reportDate: any
    expiredDate: any
    _id?: string,
}
