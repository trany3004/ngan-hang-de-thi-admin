import { Outlet } from './outlet.model';
import { User } from './user.model';

export interface WorkingShedule {
    id?: string
    pg_user?: User
    pg_outlet?: Outlet
    startDate: any
    endDate: any
    _id?: string
}
