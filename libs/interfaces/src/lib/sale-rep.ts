import { ResponsePage } from './purchases';

export interface searchResult {
  countries: ISalerepAccount[];
  total: number;
}

export interface IObjectSalerep{
  status_text: string;
  status_msg: string;
  status_code: string;
  response_data?: (ISalerepAccount)[] | null;
  response_page: ResponsePage;
}


export interface ISalerepAccount {
    sale_rep_mobile: string,
    sale_rep_company_addr: string,
    sale_rep_addr_lat: number,
    dealer_id: number,
    supplier_id: number,
    create_time: number,
    sale_rep_last_name: string,
    sale_rep_name: string,
    sale_rep_addr_tambon: string,
    sale_rep_addr_province: string,
    sale_rep_name_lower: string,
    sale_rep_addr_post: number,
    sale_rep_image_url: string,
    sale_rep_addr_lng: number,
    sale_rep_addr_number: string,
    sale_rep_company: string,
    sale_rep_id: number,
    sale_rep_addr_amphoe: string,
    distributor_id: number,
    sale_rep_status: number,
    sale_rep_addr_full: string,
    sale_rep_tel: string,
    sale_rep_email: string,
    sale_rep_first_name: string,
    sale_rep_tag: string,
  }