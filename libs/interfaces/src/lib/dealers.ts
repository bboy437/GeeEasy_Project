import { ResponsePage } from './purchases';



export interface IObjectDealer {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IDealer[];
    response_page: ResponsePage[];
}

export interface IDealer {
    dealer_addr_full: string;
    dealer_addr_tambon: string;
    dealer_image_url: string;
    dealer_id: number;
    supplier_id: number;
    create_time: number;
    dealer_addr_lng: number;
    dealer_addr_lat: number;
    dealer_addr_number: string;
    dealer_last_name: string;
    dealer_name_lower: string;
    dealer_tag: string;
    dealer_mobile: string;
    dealer_tel: string;
    sale_rep_id: number;
    dealer_email: string;
    dealer_addr_amphoe: string;
    dealer_name: string;
    distributor_id: number;
    dealer_company_addr: string;
    dealer_addr_post: number;
    dealer_company: string;
    dealer_status: number;
    dealer_first_name: string;
    dealer_addr_province: string;
}

