export interface SettingJson {
    minimum_free_derivery: number;
    derivery_days: number;
    derivery_charge: number;
    minimum_order_price: number;
    derivery_radius: number;
    order_cutoff_time: number;
    delivery_charge: number;
    delivery_days: number;
    delivery_radius:number;
    minimum_free_delivery:number;
}

export interface ISetting {
    supplier_id: number;
    create_time: number;
    setting_supplier_delivery_id: number;
    setting_json: SettingJson;
}

export interface IObject {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: ISetting[];
}
