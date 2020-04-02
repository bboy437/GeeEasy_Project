export interface searchResultSeller {
    countries: iFSeller[];
    total: number;
  }
  
  
export interface iFSeller {
    user_mobile: string,
    user_company_addr: string,
    user_addr_lat: number,
    dealer_id: number,
    supplier_id: number,
    create_time: number,
    user_last_name: string,
    user_name: string,
    user_addr_tambon: string,
    user_addr_province: string,
    user_name_lower: string,
    user_addr_post: number,
    user_image_url: string,
    user_addr_lng: number,
    user_addr_number: string,
    user_company: string,
    user_id: number,
    user_addr_amphoe: string,
    distributor_id: number,
    user_status: number,
    user_addr_full: string,
    user_tel: string,
    user_email: string,
    user_first_name: string,
    user_tag: string,
  }