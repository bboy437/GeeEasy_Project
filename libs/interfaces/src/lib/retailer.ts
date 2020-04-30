import { ResponsePage } from './purchases';


export interface IRetailerResponse {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IRetailer[];
    response_page: ResponsePage;
}


export interface RetailImageArray {
    retail_image_url: string;
}

export interface IRetailer {
    retail_status_id: number;
    dealer_id: number;
    retail_email: string;
    supplier_id: number;
    retail_tel: string;
    create_time: number;
    retail_addr_post: number;
    retail_image_url: string;
    ref_3: string;
    ref_1: string;
    ref_2: string;
    retail_addr_lng: number;
    retail_addr_lat: number;
    retail_addr_full: string;
    retail_name_lower: string;
    retail_name: string;
    retail_id: number;
    retail_status: number;
    retail_addr_amphoe: string;
    retail_image_array: RetailImageArray[];
    retail_addr_tambon: string;
    retail_addr_province: string;
    distributor_id: number;
    retail_company: string;
    group_id: number;
    retail_mobile: string;
    retail_addr_number: string;
    retail_last_name: string;
    user_id: number;
    retail_tag: string;
    retail_first_name: string;
    retail_company_addr: string;
}
