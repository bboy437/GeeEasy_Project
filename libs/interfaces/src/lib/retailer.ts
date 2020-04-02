export interface searchResultRetailer {
    countries: iFRetailer[];
    total: number;
}


export interface iFRetailer {
    retail_mobile: string,
    retail_company_addr: string,
    retail_addr_lat: number,
    dealer_id: number,
    supplier_id: number,
    create_time: number,
    retail_last_name: string,
    retail_name: string,
    retail_addr_tambon: string,
    retail_addr_province: string,
    retail_name_lower: string,
    retail_addr_post: number,
    retail_image_url: string,
    retail_addr_lng: number,
    retail_addr_number: string,
    retail_company: string,
    retail_id: number,
    retail_addr_amphoe: string,
    distributor_id: number,
    retail_status: number,
    retail_addr_full: string,
    retail_tel: string,
    retail_email: string,
    retail_first_name: string,
    retail_tag: string,
}