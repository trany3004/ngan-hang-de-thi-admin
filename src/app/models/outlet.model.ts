import { Checkin } from './checkin.model';
import { Competitor } from './competitor.model';
import { Gift } from './gift.model';
import { Inventory } from './inventory-report.model';
import { LotDate } from './lot-date.model';
import { SaleReport } from './sale-report.model';
import { WorkingShedule } from './working-schedule.model';

export interface Outlet {
    id?: string
    address?: string
    city?: string
    region: string
    group: string
    name: string
    _id?: string,
    district?: string,
    ward?: string,
    pg_checkins?: Checkin[],
    pg_lot_dates?: LotDate[],
    pg_working_sheets?: WorkingShedule[],
    pg_sale_reports?: SaleReport[],
    pg_inventories?: Inventory[],
    pg_competitors?: Competitor[],
    pg_gifts?: Gift[],
    target?: number
}
