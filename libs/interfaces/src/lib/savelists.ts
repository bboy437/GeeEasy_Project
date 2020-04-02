export interface SupplierSavelist {
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

export interface ISaveList {
    supplier_lists_id: number;
    supplier_lists_name: string;
    supplier_array: SupplierSavelist[];
}

export interface DistributorSavelist {
    distributor_id: number;
    distributor_name: string;
    distributor_tel: string;
    distributor_mobile: string;
    distributor_addr_number: string;
    distributor_addr_tambon: string;
    distributor_addr_amphoe: string;
    distributor_addr_province: string;
    distributor_addr_post: string;
    purchase_order_last: number;
    distributor_image_url: string;
}

export interface ISaveListDis {
    distributor_lists_id: number;
    supplier_id: number;
    distributor_lists_name: string;
    distributor_array: DistributorSavelist[];
}
