import { ResponsePage, ProductCategoryArray } from './purchases';
import { ProductDataArray } from './products';


export interface IObjectFavorite {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data?: (IFavoriteList)[] | null;
    response_page: ResponsePage;
  }

  export interface IFavoriteList {
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
    product_category_array?: (ProductCategoryArray)[] | null;
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
    product_title: string;
    product_sku: string;
    product_price: string;
    product_image_url: string;
    product_id: number;
    product_data?: (ProductDataArray)[] | null;


  }
  
