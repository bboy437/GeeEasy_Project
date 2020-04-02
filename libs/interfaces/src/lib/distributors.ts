
export interface IDistVerifed {
  supplier_id: number;
  distributor_id: number;
  distributor_name: string;
  distributor_tel: string;
  distributor_mobile: string;
  distributor_addr_number: string;
  distributor_addr_tambon: string;
  distributor_addr_amphoe: string;
  distributor_addr_province: string;
  distributor_addr_post: string;
  distributor_email:string
}


//Wishlist

export interface IwishlistDetail {
  supplier_id: number;
  supplier_name: string;
  product_category_id: number;
  product_category_keyword: string;
  supplier_image_url: string;
  supplier_name_first: string;
  supplier_name_last: string;
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


export interface Iwishlist {
  supplier_wishlists_id: number;
  supplier_wishlists_name: string;
  supplier_wishlists_message: string;
  supplier_array: IwishlistDetail[];
}


export interface RequestInformationFrom {
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

export interface RequestInformationProduct {
  product_category_id: number;
  product_category_name: string;
  product_category_keyword: string;
  product_category_image_url: string;
}

export interface IRequest {
  request_information_id: number;
  request_information_parent_id: number;
  request_information_is_answer: number;
  request_information_message: string;
  request_information_from: RequestInformationFrom;
  request_information_status_id: number;
  request_information_status_text: string;
  request_information_department_main: string;
  request_information_department_sub: string;
  distributor_name: string;
  request_information_product: RequestInformationProduct[];
  ref_1: Ref;
  verified: number;
}

export interface Ref {
  file_name: string;
  file_url: string;
}

export interface IDisCreate {
  distributor_addr_lat: number;
  distributor_addr_amphoe: string;
  dealer_id: number;
  distributor_name: string;
  supplier_id: number;
  create_time: number;
  distributor_id: number;
  rep_id: number;
  distributor_email: string;
  distributor_addr_province: string;
  distributor_addr_number: string;
  distributor_addr_tambon: string;
  distributor_mobile: string;
  distributor_addr_lng: number;
  distributor_addr_post: string;
  distributor_tel: string;
  distributor_catalog_keyword: string;
}




