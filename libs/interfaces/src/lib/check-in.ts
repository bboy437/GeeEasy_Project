

export interface ProductData {
    product_id: number;
    product_title: string;
    product_sku: string;
    product_image_url: string;
}

export interface CheckinData {
    checkin_checkin: number;
    checkin_available: number;
    checkin_change: number;
    checkin_onhand: number;
    checkin_outgoing: number;
    checkin_incoming: number;
}

export interface IcheckinProduct {
    request_product_name: string;
    request_product_sku: string;
    request_product_price: string;
    request_product_qty: string;
    request_product_image_url: string;
    confirm_product_id: number;
    confirm_product_sku: string;
    confirm_product_qty: string;
    confirm_product_price: string;
    product_data: ProductData;
    checkin_data: CheckinData;
}

export interface Icheckin {
    purchase_order_id: number;
    purchase_order_number: string;
    supplier_id: number;
    distributor_id: number;
    delivery_date: number;
    purchase_order_product_array: IcheckinProduct[];
    supplier_data_array: Isupplier[];
    purchase_order_summary: Isummary;
}

export interface Isummary {
    total_price: number;
}

export interface Isupplier {
    supplier_name: string;
}





