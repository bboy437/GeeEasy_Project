export interface Dashbord {
    create_time: number;
    content_id: number;
    ref_3: string;
    content_status_id: number;
    ref_1: string;
    ref_2: string;
    content_keyword: string;
    content_title: string;
    content_detail: string;
    content_source_url: string;
    content_image_cover_url: string;
    content_image_header_url: string;
    content_excerp: string;
    content_date_end: number;
    content_date_show: number;
    content_meta_description: string;
    content_source_title: string;
    content_author: string;
    content_meta_link_url: string;
    content_meta_title: string;
}

export interface IDashbord {
    status_text: string;
    status_msg: string;
    status_code: string;
    response_data: Dashbord[];
}