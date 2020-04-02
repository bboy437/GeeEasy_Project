import { ResponsePage } from './purchases';

export interface SettingData {
    billing_payment_term: string;
    billing_name: string;
    billing_address: string;
    warehouse_id: string;
}

export interface Setting {
    create_time: number;
    setting_distributor_po_id: number;
    distributor_id: number;
    ref_3: string;
    ref_1: string;
    ref_2: string;
    setting_data: SettingData[];
}

export interface ISettingList {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: Setting[];
    response_page: ResponsePage;
}
