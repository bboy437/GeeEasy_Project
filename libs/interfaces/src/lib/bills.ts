// bills List


export interface SupplierDataArray {
    supplier_id: number;
    supplier_name: string;
    product_category_id: number;
    product_category_keyword: string;
    supplier_image_url: string;
    supplier_name_first: string;
    supplier_name_last: string;
    supplier_keyword: string;
    supplier_company_name: string;
    supplier_company_contact: string;
    supplier_addr_phone: string;
    supplier_addr_full: string;
    supplier_addr_number: string;
    supplier_addr_province: string;
    supplier_addr_amphoe: string;
    supplier_addr_tambon: string;
    supplier_addr_postcode: string;
    supplier_addr_location_lat: string;
    supplier_addr_location_lng: string;
}

export interface DistributorDataArray {
    distributor_id: number;
    distributor_name: string;
    distributor_tel: string;
    distributor_mobile: string;
    distributor_addr_number: string;
    distributor_addr_tambon: string;
    distributor_addr_amphoe: string;
    distributor_addr_province: string;
    distributor_addr_post: string;
}

export interface PurchaseOrderStatusDisplay {
    supplier_is_reply: number;
    supplier_is_confirm: number;
    supplier_is_payment_confirm: number;
    po_is_delivery: number;
    po_is_checkin: number;
    po_is_invoice: number;
    po_is_paid: number;
    po_is_complete: number;
}

export interface ProductData {
    product_id: number;
    product_title: string;
    product_sku: string;
    product_image_url: string;
}

export interface PurchaseOrderProductArray {
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
}

export interface BillingPaymentTermConfirmation {
    confirm_billing_term_id: number;
    confirm_billing_term_timestamp: number;
    confirm_billing_term_date: string;
    confirm_billing_term_day_number: string;
    confirm_billing_term_price: string;
    confirm_billing_term_note: string;
}

export interface PurchaseOrderSummary {
    total_price: string;
    total_sub: string;
    total_discount: string;
    total_vat: string;
    total_vat_none: string;
    total_grand: string;
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
    supplier_name:any[];
    distributor_name:any[];
    purchase_order_paid_id: number;
}

