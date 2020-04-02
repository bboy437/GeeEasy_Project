import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: "project-file-image",
  templateUrl: "./file-image.component.html",
  styleUrls: ["./file-image.component.scss"]
})
export class FileImageComponent implements OnInit {
  @Input() theme = "white";
  @Input() height = "0";
  @Input() image_url_array = [];

  constructor() {}

  ngOnInit() {}

  upload() {
    const self = this;
    const _function = {
      consoleLog(_function_title, _title, _data) {
        const _self = this;
        console.log(_function_title, " : ", _title, " : ", _data);
      },
      uploadFile(event) {
        const _self = this;
        event.preventDefault();
        event.stopPropagation();
        _self.consoleLog("uploadFile", "event", event);
        _self.consoleLog(
          "uploadFile",
          "event.target.files.length",
          event.target.files.length
        );
        if (event.target.files.length > 0) {
          _self.consoleLog(
            "uploadFile",
            "event.target.files",
            event.target.files
          );
          for (const item_files of event.target.files) {
            _self.consoleLog("uploadFile", "item_files", item_files);
            const reader = new FileReader();
            reader.onload = (red: any) => {
              function Object() {
                this.image_status = "new";
                this.image_index = self.image_url_array.length + 1;
                this.image_name = item_files.name;
                this.image_type = item_files.type;
                this.image_url = red.target.result;
                this.image_event = item_files;
                /* main */
                this.title = item_files.name;
                this.status_id = 1;
                this.display_id = 1;
                this.create_time = ~~(Date.now() / 1000);
                this.create_time_string = new Date(Date.now()).toLocaleDateString();
                this.update_time = ~~(Date.now() / 1000);
                this.update_time_string = new Date(Date.now()).toLocaleDateString();
              }
              self.image_url_array[0] =
                item_files.type == "image/png" ||
                item_files.type == "image/jpeg" ||
                item_files.type == "image/jpeg"
                  ? new Object()
                  : self.image_url_array[0];
              _self.consoleLog(
                "uploadFile",
                "self.image_url_array[0]",
                self.image_url_array[0]
              );
            };
            reader.readAsDataURL(item_files);
          }
          event.target.value = "";
        }
      },
      removeIndex(index) {
        const _self = this;
        _self.consoleLog("removeIndex", "index", index);
        self.image_url_array.splice(index, 1);
      }
    };
    return _function;
  }
}
