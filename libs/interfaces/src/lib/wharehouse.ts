

export interface IObjectWarehouse{
  status_text: string;
  status_msg: string;
  status_code: string;
  response_data: Iwarehouse[];
}

export interface Iwarehouse {
  warehouse_id: number;
  warehouse_type_id: number;
  warehouse_status: number;
  supplier_id: number;
  distributor_id: number;
  dealer_id: number;
  warehouse_name: string;
  warehouse_tel: string;
  warehouse_mobile: string;
  warehouse_addr_number: string;
  warehouse_addr_tambon: string;
  warehouse_addr_amphoe: string;
  warehouse_addr_province: string;
  warehouse_addr_post: string;
  warehouse_lat: string;
  warehouse_lng: string;
  warehouse_image_url: string;
}