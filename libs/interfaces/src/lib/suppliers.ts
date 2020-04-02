
export interface IVerifed {
  supplier_id: number;
  supplier_name: string;
  product_category_id: number;
  product_category_keyword: string;
  supplier_catalog_keyword: string;
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
  product_category_name: string;
}

export interface ICategory {
  product_category_id: number;
  product_category_name: string;
  product_category_keyword: string;
  product_category_total_child: string;
  product_category_image_url: string;
  product_category_child_array: [];
 
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
  distributor_name: string;
  distributor_mobile: string;
  distributor_addr_amphoe: string;
  distributor_addr_province: string;
  create_time: number;
}


export interface Iwishlist {
  supplier_wishlists_id: number;
  supplier_wishlists_name: string;
  supplier_wishlists_message: string;
  supplier_array: IwishlistDetail[];
}



