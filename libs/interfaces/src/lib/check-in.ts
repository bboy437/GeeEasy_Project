import { ResponsePage, ImageArray } from './purchases';
import { IDistributor } from './dist';
import { ISupplier } from './suppliers';
import { Iwarehouse } from './wharehouse';

export interface IObjectCheckIn {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data?: (ICheckInList)[] | null;
    response_page: ResponsePage;
}

export interface ICheckInList {
    purchase_order_id: number;
    purchase_order_number: string;
    supplier_id: number;
    supplier_data_array?: (ISupplier)[] | null;
    distributor_id: number;
    distributor_data_array?: (IDistributor)[] | null;
    purchase_order_type_id: number;
    purchase_order_reply_id: number;
    purchase_order_reply_msg: string;
    purchase_order_is_complete: number;
    purchase_order_is_confirm: number;
    purchase_order_status_display: IPurchaseOrderStatusDisplay;
    purchase_order_product_array?: (null)[] | null;
    delivery_date: number;
    delivery_location: string;
    billing_name: string;
    billing_address: string;
    billing_payment_term: string;
    billing_payment_term_confirmation?: (IBillingPaymentTermConfirmation)[] | null;
    purchase_order_summary: IPurchaseOrderSummary;
    purchase_order_create: number;
    purchase_order_update: number;
    warehouse_id: number;
    warehouse_data_array?: (null)[] | null;
    rep_data_aray?: (null)[] | null;
    delivery_data_array?: (IDeliveryDataArray)[] | null;
    checkin_data_array?: (ICheckinDataArray)[] | null;
    warehouse_data?: (Iwarehouse)[] | null;
}



export interface IPurchaseOrderStatusDisplay {
    po_is_checkin: number;
    po_is_complete: number;
    po_is_delivery: number;
    po_is_invoice: number;
    supplier_is_confirm: number;
    supplier_is_payment_confirm: number;
    supplier_is_reply: number;
}

export interface IBillingPaymentTermConfirmation {
    confirm_billing_term_day_number: string;
    confirm_billing_term_timestamp: string;
    purchase_order_id: number;
    create_time: number;
    confirm_billing_term_note: string;
    confirm_billing_term_date: string;
    confirm_billing_term_price: string;
    confirm_billing_term_status: string;
    confirm_billing_term_id: number;
    geeesy_purchase_order_confirmation_id: number;
}

export interface IPurchaseOrderSummary {
    total_sub: number;
    total_vat: number;
    total_grand: number;
    total_discount: number;
    total_price: number;
    total_vat_none: number;
}

export interface IDeliveryDataArray {
    delivery_qty_receive: number;
    product_sku: string;
    product_title: string;
    delivery_qty_total: number;
    create_time: number;
    product_qty: number;
    ref_3: string;
    delivery_qty_waiting: number;
    product_id: number;
    ref_1: string;
    geeesy_service_po_delivery_id: number;
    ref_2: string;
    delivery_date: number;
    delivery_note: string;
    geeesy_purchase_order_product_id: number;
    purchase_order_id: number;
    product_price: number;
    product_image_url: string;
    delivery_qty_shipping: number;
}

export interface ICheckinDataArray {
    checkin_qty_done: number;
    product_sku: string;
    product_title: string;
    checkin_is_done: number;
    create_time: number;
    product_qty: number;
    ref_3: string;
    product_id: number;
    ref_1: string;
    ref_2: string;
    product_currency_code: string;
    checkin_incoming: number;
    note: string;
    geeesy_purchase_order_product_id: number;
    purchase_order_id: number;
    product_price: number;
    product_image_url: string;
    geeesy_service_po_checkin_id: number;
    image_array?: (ImageArray | null)[] | null;
}

