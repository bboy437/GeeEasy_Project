import { ResponsePage } from './purchases';

export interface IObjectCategory {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data?: (ICategory)[] | null;
    response_page: ResponsePage;
  }

  export interface ICategory {
    product_category_parent_array?: (null)[] | null;
    product_category_parent_id: number;
    product_category_root_id: number;
    product_category_root_array?: (null)[] | null;
    create_time: number;
    product_category_status: number;
    product_category_total_child: number;
    product_category_id: number;
    product_category_name: string;
    product_category_image_url: string;
    product_category_keyword: string;
    product_category_suggestion_array?: (ProductCategorySuggestionArray)[] | null;
    product_category_relation_array?: (null)[] | null;
    product_category_child_array?: (null)[] | null;
  }

  export interface ProductCategorySuggestionArray {
    product_category_name: string;
    create_time: number;
    product_category_status: number;
    supplier_product_id: number;
    product_category_root_id: number;
    product_category_is_approve: number;
    supplier_id: number;
    product_category_parent_id: number;
  }

