import { ResponsePage } from './purchases';
import { CheckinData, ProductRowKey } from './products';

export interface IProductDealerResponse {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data?: (IProductDealer)[] | null;
    response_page: ResponsePage;
  }
  export interface IProductDealer {
    dealer_id: number;
    distributor_id: number;
    product_id: number;
    product_sku: string;
    product_title: string;
    product_price: number;
    product_image_url: string;
    product_row_display_array?: (ProductRowDisplayArray)[] | null;
    product_row_key: ProductRowKey;
  }

  export interface ProductRowDisplayArray {
    purchase_data?: (PurchaseData)[] | null;
    warehouse_id: number;
    warehouse_data?: (WarehouseData)[] | null;
    checkin_data: CheckinData;
  }

  export interface PurchaseData {
    dealer_product_id: number;
    dealer_order_id: number;
    purchase_order_id: number;
    purchase_order_number: number;
    dealer_id: number;
    supplier_id: number;
    distributor_id: number;
    checkin_data: CheckinData;
  }

  export interface WarehouseData {
    warehouse_lng: number;
    warehouse_addr_post: number;
    warehouse_is_defult: number;
    dealer_id: number;
    warehouse_addr_amphoe: string;
    warehouse_name: string;
    warehouse_status: number;
    supplier_id: number;
    create_time: number;
    warehouse_lat: number;
    distributor_id: number;
    group_id: number;
    warehouse_addr_number: string;
    dropshop_dealer_id: number;
    warehouse_addr_province: string;
    user_id: number;
    warehouse_id: number;
    warehouse_tel: string;
    warehouse_addr_address_full: string;
    warehouse_mobile: string;
    warehouse_image_url: string;
    warehouse_type_id: number;
    warehouse_addr_tambon: string;
  }

