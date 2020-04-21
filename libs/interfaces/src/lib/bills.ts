// bills List

import {
    BillingPaymentTermConfirmation,
    DistributorDataArray,
    PurchaseOrderProductArray,
    PurchaseOrderStatusDisplay,
    SupplierDataArray,
    PurchaseOrderSummary
} from './purchases';


export interface IObjectBillList {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IBillList[];
}


export interface IBillList {
    billing_plan_id: number;
    purchase_order_id: number;
    purchase_order_number: string;
    supplier_id: number;
    supplier_data_array: SupplierDataArray[];
    distributor_id: number;
    distributor_data_array: DistributorDataArray[];
    purchase_order_type_id: number;
    purchase_order_reply_id: number;
    purchase_order_reply_msg: string;
    purchase_order_is_complete: number;
    purchase_order_is_confirm: number;
    purchase_order_status_display: PurchaseOrderStatusDisplay;
    purchase_order_product_array: PurchaseOrderProductArray[];
    delivery_date: number;
    delivery_location: string;
    billing_name: string;
    billing_address: string;
    billing_payment_term: string;
    billing_payment_term_confirmation: BillingPaymentTermConfirmation[];
    purchase_order_summary: PurchaseOrderSummary;
    purchase_order_create: number;
    purchase_order_update: number;
    supplier_name: any[];
    distributor_name: any[];
    purchase_order_paid_id: number;
}

