
export interface IObjectPurchase {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IPurchaseList[];
}


export interface IPurchaseList {
    purchase_order_id: number;
    purchase_order_number: string;
    supplier_id: number;
    supplier_data_array: SupplierDataArray[];
    supplier_name: string;
    distributor_id: number;
    purchase_order_reply_id: number;
    purchase_order_reply_msg: string;
    purchase_order_is_complete: number;
    purchase_order_is_confirm: number;
    purchase_order_product_array: any[];
    delivery_date: number;
    delivery_location: string;
    billing_name: string;
    billing_address: string;
    billing_payment_term: string;
    purchase_order_summary: PurchaseOrderSummary;
    purchase_order_status_display: PurchaseOrderStatusDisplay;
    purchase_order_create: number;
    purchase_order_update: number;
    supplier_name_1: any;
    distributor_name: any[];
    order_status_btn: OrderStatus;
    po_status: number;
}

export interface OrderStatus {
    button_confirm: number;
    button_delivered: number;
    button_paid: number;
    stock_received: number;
    stock_incoming: number;
    received: number;
    incoming: number;

}

export interface ResponsePage {
    total_rows: number;
    result_rows: number;
    cur_page: number;
    per_page: number;
    total_page: number;
}

export interface IPurchaseDetail {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: PurchaseDetail[];
    response_page: ResponsePage;
}

export interface PurchaseDetail {
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
    purchase_order_message_array: PurchaseOrderMessageArray[];
    delivery_date: number;
    delivery_location: string;
    billing_name: string;
    billing_address: string;
    billing_payment_term: string;
    billing_payment_term_confirmation: BillingPaymentTermConfirmation[];
    purchase_order_summary: PurchaseOrderSummary;
    purchase_order_note: string;
    purchase_order_create: number;
    purchase_order_update: number;
    warehouse_id: number;
    warehouse_data_array: any[];
    rep_data_aray: any[];
    purchase_order_paid_id: number;
    purchase_order_paid_balance: number;
    purchase_order_paid_reference: string;
    purchase_order_paid_message: string;
    purchase_order_paid_row: any[];
    button_array: ButtonArray;
    order_status_btn: OrderStatusBtn;
    checkin_status_text: string;
    checkin_product_array: CheckinProductArray[];
    checkin_manual_array: any[];
    checkin_status_id: number;
    checkin_receive_array
}




export interface SupplierDataArray {
    dropship_dealer_id: number;
    supplier_addr_postcode: number;
    supplier_addr_full: string;
    supplier_company_name: string;
    product_category_root_id: number;
    dealer_id: number;
    supplier_id: number;
    create_time: number;
    supplier_tel: string;
    product_category_id: number;
    supplier_addr_location_lng: number;
    supplier_addr_location_lat: number;
    supplier_company_name_lower: string;
    supplier_image_url: string;
    product_category_keyword: string;
    supplier_name_first_lower: string;
    supplier_addr_number: string;
    supplier_name_lower: string;
    supplier_name: string;
    supplier_addr_tambon: string;
    supplier_addr_phone: string;
    supplier_name_first: string;
    supplier_addr_province: string;
    sale_rep_id: number;
    supplier_status_id: number;
    distributor_id: number;
    product_category_name: string;
    supplier_name_last: string;
    supplier_name_last_lower: string;
    supplier_addr_amphoe: string;
    supplier_company_contact: string;
    supplier_catalog_keyword: string;
    supplier_phone: string;
    supplier_keyword: string;
}

export interface ProductCategoryArray {
    create_time: number;
    product_category_status: number;
    product_category_keyword: string;
    product_category_image_url: string;
    product_category_relation_array: string;
    product_category_child_array: string;
    product_category_parent_id: number;
    product_category_id: number;
    product_category_name: string;
    product_category_root_array: string;
    product_category_root_id: number;
    product_category_total_child: number;
    product_category_parent_array: string;
}

export interface DistributorDataArray {
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
}

export interface PurchaseOrderStatusDisplay {
    po_is_checkin: number;
    po_is_complete: number;
    po_is_delivery: number;
    po_is_invoice: number;
    supplier_is_confirm: number;
    supplier_is_payment_confirm: number;
    supplier_is_reply: number;
}

export interface ProductWarehouseArray {
    incoming: number;
    outgoing: number;
    warehouse_name: string;
    create_time: string;
    onhand: number;
    change: number;
    available: number;
    warehouse_id: number;
}

export interface ProductWholesaleArray {
    qty_minimum: number;
    product_price: number;
    retail_product_price: number;
    retail_qty_mininum: number;
}

export interface ProductCategoryArray2 {
    product_category_keyword: string;
    product_category_name: string;
    product_category_image_url: string;
    product_category_id: number;
}


export interface ProductImageArray {
    create_time: number;
    display_id: number;
    image_url: string;
    image_index: number;
    title: string;
    image_name: string;
    update_time: number;
    status_id: number;
    update_time_string: string;
    image_status: string;
    create_time_string: string;
    image_type: string;
}

export interface ProductData2 {
    product_public_inquiry_id: number;
    product_status: number;
    product_country: string;
    product_price: number;
    product_image_url: string;
    product_sku: string;
    update_time: number;
    category_custom_keyword: string;
    product_warehouse_array: ProductWarehouseArray[];
    product_public_product_verified_doc: any[];
    product_public_sample_id: number;
    product_wholesale_array: ProductWholesaleArray[];
    product_barcode: string;
    create_time: number;
    product_parent_id: number;
    product_buy_price: any;
    product_stock_track_id: number;
    product_public_status_id: number;
    product_name: string;
    product_unit: string;
    product_category_array: ProductCategoryArray2[];
    product_channel: string;
    product_keyword: string;
    product_note: string;
    product_image_array: ProductImageArray[];
    supplier_product_id: number;
    supplier_id: number;
    product_public_minimum_qty: number;
    product_currency_code: string;
}

export interface ProductData {
    product_sku: string;
    product_image_url: string;
    product_data: ProductData2;
    product_unit: string;
    product_title: string;
    product_id: number;
}

export interface PurchaseOrderProductArray {
    geeesy_purchase_order_product_id: number;
    create_time: number;
    purchase_order_id: number;
    request_product_sku: string;
    request_product_name: string;
    request_product_image_url: string;
    request_product_price: number;
    request_product_qty: number;
    confirm_product_id: string;
    confirm_product_ok: string;
    confirm_product_sku: string;
    confirm_product_price: string;
    confirm_product_qty: string;
    product_data: ProductData;
    product_note: string;
}

export interface MessageTextArray {
    text_id: number;
    ref_1: string;
    text_parent_id: number;
    text_type_id: number;
    text_detail: string;
    ref_2: string;
    create_time: number;
    text_extra_attachment: any[];
}

export interface PurchaseOrderMessageArray {
    message_author_id: number;
    message_type_id: number;
    message_status_id: number;
    purchase_order_id: number;
    order_msg_id: number;
    message_text_array: MessageTextArray[];
    message_receiver_id: number;
    create_time: number;
    ref_3: string;
    ref_1: string;
    ref_2: string;
}

export interface BillingPaymentTermConfirmation {
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

export interface PurchaseOrderSummary {
    total_sub: number;
    total_vat: number;
    total_grand: number;
    total_discount: number;
    total_price: number;
    total_vat_none: number;
}

export interface Supplier {
    reply: number;
    confirm_delivery: number;
}

export interface Distributor {
    confirm: number;
}

export interface ButtonArray {
    supplier: Supplier;
    distributor: Distributor;
}

export interface OrderStatusBtn {
    button_confirm: number;
    button_delivered: number;
    button_paid: number;
    stock_received: number;
    stock_incoming: number;
    received: number;
    incoming: number;
}


export interface ImageArray {
    note: string;
    create_time: number;
    display_id: number;
    image_url: string;
    image_index: number;
    title: string;
    image_name: string;
    update_time: number;
    status_id: number;
    update_time_string: string;
    image_status: string;
    create_time_string: string;
    image_type: string;
}

export interface CheckinProductArray {
    product_title: string;
    product_sku: string;
    product_image_url: string;
    product_currency_code: string;
    checkin_incoming: number;
    checkin_qty_done: number;
    checkin_is_done: number;
    note: string;
    image_array: ImageArray[];
}










