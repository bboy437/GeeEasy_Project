import { ResponsePage } from './purchases';


export interface IObjectOrder {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IOrderList[];
    response_page: ResponsePage;
}

export interface IOrderList {
    dealer_order_update: number;
    dealer_order_summary: DealerOrderSummary;
    dealer_order_product_array: DealerOrderProductArray[];
    dealer_id: number;
    dealer_order_number: string;
    distributor_id: number;
    dealer_order_create: number;
    delivery_date: number;
    dealer_order_paid_confirm_id: number;
    dealer_order_id: number;
    dealer_order_delivery_id: number;
    dealer_order_is_confirm: number;
    dealer_data: DealerData[];
    distributor_data: DistributorData[];
    dealer_name: any;
    distributor_name: any;
}



export interface DealerOrderSummary {
    total_sub: string;
    total_vat: string;
    total_grand: string;
    total_discount: string;
    total_price: string;
    total_vat_none: string;
}

export interface DealerOrderProductArray {
    product_sku: string;
    product_qty: number;
    product_price: string;
    product_image_url: string;
    product_name: string;
    product_id: number;
}

export interface DealerData {
    dealer_name: any;
    dealer_image_url: string;
    dealer_id: number;
}

export interface DistributorData {
    distributor_name: string;
    distributor_image_url: string;
    distributor_id: number;
}






