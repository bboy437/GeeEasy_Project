import { ResponsePage } from './purchases';


export interface ISellerResponse {
  status_text: string;
  status_msg: string;
  status_code: string;
  response_data?: (ISeller)[] | null;
  response_page: ResponsePage;
}

export interface ISeller {
  user_tag: string;
  user_mobile: string;
  group_id_array?: (null)[] | null;
  user_first_name: string;
  user_email: string;
  dealer_id: number;
  supplier_id: number;
  create_time: number;
  user_status_id: number;
  user_addr_tambon: string;
  user_tel: string;
  user_addr_lng: number;
  user_company: string;
  user_data_ref: UserDataRef;
  user_addr_province: string;
  user_name: string;
  user_addr_lat: number;
  user_last_name: string;
  ref_id_1: number;
  ref_id_2: number;
  user_addr_full: string;
  user_company_addr: string;
  ref_id_3: number;
  sale_rep_id: number;
  user_addr_number: string;
  user_image_url: string;
  distributor_id: number;
  group_id: number;
  user_display_id: number;
  user_id: number;
  user_parent_id: number;
  user_addr_post: number;
  user_name_lower: string;
  user_addr_amphoe: string;
  user_status: number;
  user_team_name: string;
  user_group_name: string;
}

export interface UserDataRef {
  total_sale: number;
}

