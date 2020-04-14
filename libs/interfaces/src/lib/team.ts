
export interface ITeam {
  create_time: number;
  group_display_id: number;
  group_id: number;
  group_parent_id: number;
  product_favorite_id: number;
  group_user_array: [];
  group_name_lower: string;
  group_image_url: string;
  group_name: string;
  group_data_ref: Groupdataref
}

export interface Groupdataref {
  total_sales: number;
  total_user: number;
}







