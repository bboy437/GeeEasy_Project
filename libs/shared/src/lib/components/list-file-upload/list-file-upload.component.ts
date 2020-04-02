import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
    selector: 'project-list-file-upload',
    templateUrl: './list-file-upload.component.html',
    styleUrls: ['./list-file-upload.component.scss']
})
export class ListFileUploadComponent implements OnInit {
    @Input() theme = "white";
    @Input() image_url_array = new Array();

    constructor() { }

    ngOnInit() { }

    getMappedUrls() {
        return this.image_url_array.map(v => v.name.slice(0, 40));
    }
}
