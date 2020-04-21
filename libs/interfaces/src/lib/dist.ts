import { ResponsePage, DistributorDataArray, ProductCategoryArray, PurchaseOrderStatusDisplay, PurchaseOrderSummary, SupplierDataArray } from './purchases';

export interface IObjectDistributor {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IDistributor[];
    response_page: ResponsePage;
}


export interface IDistributor {
    distributor_addr_amphoe: string;
    product_category_root_id: number;
    dealer_id: number;
    distributor_addr_full: string;
    supplier_id: number;
    create_time: number;
    ref_3: string;
    distributor_email: string;
    product_category_id: number;
    ref_1: string;
    ref_2: string;
    distributor_firstname: string;
    distributor_image_url: string;
    distributor_addr_post: number;
    distributor_addr_lat: number;
    distributor_catalog_keyword: string;
    product_category_array: ProductCategoryArray[];
    distributor_name: string;
    sale_rep_id: number;
    distributor_id: number;
    distributor_addr_province: string;
    distributor_addr_number: string;
    distributor_name_lower: string;
    distributor_addr_tambon: string;
    distributor_mobile: string;
    distributor_addr_lng: number;
    distributor_lastname: string;
    distributor_tel: string;
    purchase_order_array: PurchaseOrderArray[];
    purchase_order_last: number;
}


export interface PurchaseOrderArray {
    delivery_location: string;
    billing_address: string;
    dealer_id: number;
    supplier_id: number;
    create_time: number;
    ref_3: string;
    supplier_data_array: SupplierDataArray[];
    ref_1: string;
    po_is_delivery: number;
    ref_2: string;
    purchase_order_status_display: PurchaseOrderStatusDisplay;
    purchase_order_paid_id: number;
    purchase_order_reply_id: number;
    po_is_payment_confirm: number;
    purchase_order_type_id: number;
    purchase_order_reply_msg: string;
    purchase_order_product_array: any[];
    purchase_order_summary: PurchaseOrderSummary;
    purchase_order_update: number;
    purchase_order_paid_message: string;
    update_time: number;
    po_note: string;
    po_is_supplier_confirm: number;
    sale_rep_id: number;
    billing_payment_term_confirmation: any[];
    distributor_id: number;
    purchase_order_paid_balance: number;
    po_is_invoice: number;
    purchase_order_is_confirm: number;
    purchase_order_number: string;
    delivery_date: number;
    warehouse_id: number;
    distributor_data_array: DistributorDataArray[];
    billing_name: string;
    billing_payment_term: string;
    po_is_checkin: number;
    purchase_order_id: number;
    purchase_order_paid_row: any[];
    checkin_manual_array: any[];
    purchase_order_mark_checkin: number;
    purchase_order_create: number;
    po_is_complete: number;
    po_is_supplier_reply: number;
    purchase_order_is_complete: number;
    purchase_order_paid_reference: string;
}


