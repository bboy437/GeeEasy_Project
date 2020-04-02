export interface searchRetailersProduct {
    countries: retailersProduct[];
    total: number;
}


export interface retailersProduct {
    product_package_array: [],
    product_sku: string,
    product_title: string,
    checkin_data: {},
    retail_product_id: number,
    dealer_id: number,
    create_time: number,
    product_coupon_array: [],
    product_wholesale_array: [],
    product_discount_array: [],
    product_id: number,
    group_id: number,
    product_image_array: [],
    product_data_ref: {},
    product_reward_array: [],
    user_id: number,
    product_price: number,
    retail_product_status: number,
    product_image_url: string,
    product_free_array: [],
    retail_id: number,
    retail_product_status_id: number,
    product_title_lower: string
}