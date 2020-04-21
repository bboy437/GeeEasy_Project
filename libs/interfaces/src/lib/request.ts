

export interface IObjectRequest {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: IRequest[];
}

export interface IRequest {
    request_information_id: number;
    request_information_parent_id: number;
    request_information_is_answer: number;
    request_information_message: string;
    request_information_from: RequestInformationFrom;
    request_information_status_id: number;
    request_information_status_text: string;
    request_information_department_main: string;
    request_information_department_sub: string;
    distributor_name: string;
    request_information_product: RequestInformationProduct[];
    ref_1: Ref;
    verified: number;
}

export interface Ref {
    file_name: string;
    file_url: string;
}

export interface RequestInformationFrom {
    distributor_id: number;
    distributor_name: string;
    distributor_tel: string;
    distributor_mobile: string;
    distributor_addr_number: string;
    distributor_addr_tambon: string;
    distributor_addr_amphoe: string;
    distributor_addr_province: string;
    distributor_addr_post: string;
}

export interface RequestInformationProduct {
    product_category_id: number;
    product_category_name: string;
    product_category_keyword: string;
    product_category_image_url: string;
}


