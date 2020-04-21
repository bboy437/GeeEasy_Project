import { ResponsePage, ProductCategoryArray, ProductWholesaleArray, ProductWarehouseArray } from './purchases';
import { Iwarehouse } from './wharehouse';

// export interface IProduct {
//   id: string;
//   product: string;
//   sku: number;
//   supplier: string;
//   orderhiveprice: number;
//   lastpurchaseprice: number;
//   wholesaleprice: number;
//   status: boolean;
// }

export interface IObjectProductList {
  status_text: string;
  status_msg: string;
  status_code: string;
  response_data: ProductDataArray[];
}


export interface ProductDataArray {
  product_id: number;
  product_parent_id: number;
  product_sku: string;
  product_name: string;
  product_image_url: string;
  product_price: string;
  supplier_product_id: number;
  warehouse_data: ProductWarehouse[];
  supplier_reference: SupplierReference;
  checkin_available: number;
  checkin_onhand: number;
  checkin_outgoing: number;
  checkin_incoming: number;
  checkin_data: Checkindatas;
  product_title: string;
  warehouse_name: string;
  product_is_favorite: number;
  product_row_display_array: CheckinData[];
  type_key: string;
  product_checkin_from: ProductCheckinFrom;
  product_checkin_to: ProductCheckinTo
  dealer_order_id: string;
  dealer_order_product_array: InventoryLog,
  product_warehouse_array: ProductWarehouseArray[];
  product_public_status_id: number,
  create_time: number,
  update_time: number,
  product_channel: string,
  product_row_key: ProductRowKey;
}


export interface ProductRowKey {
  distributor_id: number;
  supplier_id: number;
  product_id: number;
  product_sku: string;
  product_price: number;
  product_type_id: number;
}


export interface ProductWarehouse {
  warehouse_inventory_id: number;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_checkin_id: number;
  checkin_type_id: number;
  checkin_status: number;
  checkin_date: number;
  checkin_available: number;
  checkin_change: number;
  checkin_onhand: number;
  checkin_outgoing: number;
  checkin_incoming: number;
}

export interface SupplierReference {
  supplier_id: number;
  supplier_name: string;
}

export interface Checkindatas {
  available: number;
  change: number;
  incoming: number;
  onhand: number;
  outgoing: number;
  onhand_manual: number;
  warehouse_id: number;
}

export interface InventoryLog {
  product_id: number;
  product_sku: string;
  product_name: string;
  product_image_url: string;
  product_price: string;
  supplier_product_id: number;
  product_title: string;
  product_array: ProductDataArray[];

}


export interface ProductCheckinFrom {
  checkin_data: Checkindatas;
}
export interface ProductCheckinTo {
  checkin_data: Checkindatas;
}
//ProductGroup

export interface ProductWarehouse {
  warehouse_inventory_id: number;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_checkin_id: number;
  checkin_type_id: number;
  checkin_status: number;
  checkin_date: number;
  checkin_checkin: number;
  checkin_available: number;
  checkin_change: number;
  checkin_onhand: number;
  checkin_outgoing: number;
  checkin_incoming: number;
}

export interface SupplierReference {
  supplier_id: number;
  supplier_name: string;
}

export interface InventoryGroupArray {
  product_id: number;
  product_parent_id: number;
  product_sku: string;
  product_title: string;
  product_image_url: string;
  product_price: string;
  product_warehouse: ProductWarehouse[];
  supplier_reference: SupplierReference;
}

export interface IProductGroup {
  inventory_group_id: number;
  inventory_group_type_id: number;
  inventory_group_name: string;
  inventory_group_array: InventoryGroupArray[];
}

export interface IObjectProductGroup {
  status_text: string;
  status_msg: string;
  status_code: string;
  response_data: IProductGroup[];
}

export interface IProductGroup {
  inventory_group_id: number;
  inventory_group_type_id: number;
  inventory_group_name: string;
  inventory_group_array: InventoryGroupArray[];
}


export interface IStock {
  product_channel: string;
  checkin_data: CheckinData;
  supplier_id: number;
  product_is_transfer: number;
  create_time: number;
  product_wholesale_array: ProductWholesaleArray[];
  ref_3: string;
  product_id: number;
  product_category_id: number;
  ref_1: string;
  ref_2: string;
  product_price: number;
  product_image_url: string;
  distributor_product_id: number;
  product_buy_price: number;
  product_sku: string;
  product_type_id: number;
  product_title: string;
  product_status: number;
  product_is_active: number;
  product_unit: string;
  product_barcode: string;
  distributor_id: number;
  category_custom_keyword: string;
  purchase_order_number: any;
  product_image_array: any;
  note: string;
  product_catalog_keyword: string;
  warehouse_id: number;
  purchase_order_id: number;
  product_note: string;
  product_country: string;
  product_warehouse_array: ProductWarehouseArray[];
  product_is_favorite: number;
  product_currency_code: string;
  update_time: number;
  product_category_array: ProductCategoryArray[];
  warehouse_id_to?: number;
  warehouse_id_from?: number;
  type_key: string;
  warehouse_data: Iwarehouse[];
}



export interface IObjStock {
  status_text: string;
  status_msg: string;
  status_code: string;
  response_data: IStock[];
  response_page: ResponsePage;
}




//------------------ supplier



export interface ProductWarehouse {
  warehouse_inventory_id: number;
  warehouse_id: number;
  warehouse_name: string;
  warehouse_checkin_id: number;
  checkin_type_id: number;
  checkin_status: number;
  checkin_date: number;
  checkin_checkin: number;
  checkin_available: number;
  checkin_change: number;
  checkin_onhand: number;
  checkin_outgoing: number;
  checkin_incoming: number;
}

export interface IproductListSup {
  supplier_product_id: number;
  product_id: number;
  supplier_id: number;
  product_parent_id: number;
  product_status: number;
  product_name: string;
  product_price: string;
  product_keyword: string;
  product_sku: string;
  product_image_url: string;
  product_category_array: ProductCategoryArray[];
  product_wholesale_array: ProductWholesaleArray[];
  product_warehouse: ProductWarehouse[];
  product_stock_track_id: number;
}

// farvorite


export interface CheckinData {
  ref_1: string;
  incoming: number;
  outgoing: number;
  ref_3: string;
  ref_2: string;
  onhand: number;
  change: number;
  available: number;
  onhand_manual: number;
  warehouse_data: Checkindatas;
  warehouse_id: number;
  checkin_data: Checkindatas
  product_is_active: number;
  create_time: number;
  update_time: number;
}

export interface ProductDatas {
  product_sku: string;
  product_title: string;
  checkin_data: CheckinData;
  product_status: number;
  product_is_active: number;
  supplier_id: number;
  create_time: number;
  distributor_id: number;
  ref_3: string;
  product_id: number;
  ref_1: string;
  ref_2: string;
  purchase_order_number: string;
  note: string;
  warehouse_id: number;
  purchase_order_id: number;
  product_price: number;
  product_image_url: string;
  distributor_product_id: number;
}









