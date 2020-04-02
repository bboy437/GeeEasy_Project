//--  order list

import { DistributorDataArray } from './purchases';

export interface DealerDataArray {
    dealer_id: number;
    distributor_id: number;
    sale_rep_id: number;
    dealer_name: string;
    dealer_first_name: string;
    dealer_last_name: string;
    dealer_tel: string;
    dealer_mobile: string;
    dealer_email: string;
    dealer_tag: string;
    dealer_company: string;
    dealer_company_addr: string;
    dealer_addr_full: string;
    dealer_addr_number: string;
    dealer_addr_tambon: string;
    dealer_addr_amphoe: string;
    dealer_addr_province: string;
    dealer_addr_post: string;
    dealer_image_url: string;
}


export interface DealerOrderSummary {
    total_price: string;
    total_sub: string;
    total_discount: number;
    total_grand: string;
}

export interface IOrderList {
    dealer_order_id: number;
    dealer_order_number: string;
    dealer_id: number;
    dealer_data_array: DealerDataArray[];
    distributor_id: number;
    distributor_data_array: DistributorDataArray[];
    distributor_data: DistributorDataArray[];
    dealer_order_reply_id: number;
    dealer_order_reply_msg: string;
    dealer_order_is_complete: number;
    dealer_order_is_confirm: number;
    dealer_order_product_array: any[];
    delivery_date: string;
    delivery_location: string;
    billing_name: string;
    billing_address: string;
    billing_payment_term: string;
    dealer_order_summary: DealerOrderSummary;
    dealer_order_create: number;
    dealer_order_update: number;
    dealer_data: DealerData;
    dealer_order_delivery_id: number;
    dealer_order_paid_confirm_id: number;
    distributor_name: any[];
}

export interface DealerData {
    dealer_name: any;
    dealer_image_url: string;
    dealer_id: number;
}

