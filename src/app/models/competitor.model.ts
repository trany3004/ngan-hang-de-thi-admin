import { Product } from './category.model';
import { Outlet } from './outlet.model';
import { User } from './user.model';

export interface Competitor {
    id?: string
    pg_user?: User
    pg_outlet?: Outlet
    program: string
    startDate: any
    endDate: any
    images: any[]
    note: string
    _id?: string
}
