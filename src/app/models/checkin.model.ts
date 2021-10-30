import { Outlet } from './outlet.model';
import { User } from './user.model';

export interface Checkin {
    id?: string
    pg_user?: User
    pg_outlet?: Outlet
    address: string
    startDate: any
    endDate: any
    _id?: string
}
