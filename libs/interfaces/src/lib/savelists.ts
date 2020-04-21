import { ResponsePage } from './purchases';
import { ISupplier } from './suppliers';
import { IDistributor } from './dist';


export interface IobjectSavelist {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data?: (IsavelistList)[] | null;
    response_page: ResponsePage;
  }
  
  export interface IsavelistList {
    distributor_lists_name: string;
    distributor_array?: (IDistributor)[] | null;
    supplier_id: number;
    supplier_lists_id: number;
    supplier_lists_name: string;
    supplier_array?: (ISupplier)[] | null;
    create_time: number;
    distributor_id_array?: (string)[] | null;
    distributor_lists_id: number;
    ref_3: string;
    ref_1: string;
    ref_2: string;
    purchase_order_last?: (null)[] | null;
  }

