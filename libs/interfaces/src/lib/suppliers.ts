import { ResponsePage } from './purchases';

export interface IObjectSupplier{
  status_text: string;
  status_msg: string;
  status_code: string;
  response_data?: (ISupplier)[] | null;
  response_page: ResponsePage;
}


export interface ISupplier {
  dropship_dealer_id: number;
  supplier_addr_postcode: number;
  supplier_addr_full: string;
  supplier_company_name: string;
  supplier_email: string;
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
  supplier_addr_number: string;
  supplier_name_first_lower: string;
  supplier_name_lower: string;
  supplier_name: string;
  supplier_addr_tambon: string;
  supplier_addr_phone: string;
  supplier_addr_province: string;
  supplier_name_first: string;
  sale_rep_id: number;
  distributor_id: number;
  supplier_status_id: number;
  product_category_name: string;
  category_custom_keyword: string;
  supplier_name_last: string;
  supplier_name_last_lower: string;
  supplier_addr_amphoe: string;
  supplier_company_contact: string;
  supplier_catalog_keyword: string;
  supplier_phone: string;
  supplier_keyword: string;
  supplier_product?: (null)[] | null;
}


