import { IDistributor } from './dist';

export interface IObjectVerified {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: ISupplierDistributor[];
}

export interface ISupplierDistributor {
    supplier_id: number;
    distributor_id: number;
    distributor_name: string;
    distributor_tel: string;
    distributor_mobile: string;
    distributor_addr_number: string;
    distributor_addr_tambon: string;
    distributor_addr_amphoe: string;
    distributor_addr_province: string;
    distributor_addr_post: string;
    distributor_email: string
}


export interface IObjectVerifiedDistList {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IDistributor[];
}