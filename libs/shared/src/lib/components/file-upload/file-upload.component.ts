import { Component, OnInit, Input, Output } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { count } from "@swimlane/ngx-charts";

@Component({
  selector: "project-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"]
})
export class FileUploadComponent implements OnInit {
  @Input() theme = "white";
  @Input() image_url_array = new Array();

  constructor() {}

  ngOnInit() {}

  getMappedUrls() {
    return this.image_url_array.map(v => v.name.slice(0, 40));
  }

  upload() {
    let self = this;
    const _function = {
      consoleLog(_function, _title, _data) {
        let _self = this;
        console.log(_function, " : ", _title, " : ", _data);
      },
      uploadFile(event) {
        let _self = this;
        event.preventDefault();
        event.stopPropagation();
        _self.consoleLog(
          "uploadFile",
          "event.target.files.length",
          event.target.files.length
        );
        if (event.target.files.length > 0) {
          _self.consoleLog("uploadFile", "event", event);
          _self.consoleLog("uploadFile", "event.target", event.target);
          _self.consoleLog(
            "uploadFile",
            "event.target.files",
            event.target.files
          );
          for (const item_files of event.target.files) {
            _self.consoleLog("uploadFile", "item_files", item_files);
            let reader = new FileReader();
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
                this.note = "-";
                this.status_id = 1;
                this.display_id = 1;
                this.create_time = ~~(Date.now() / 1000);
                this.create_time_string = new Date(Date.now()).toLocaleDateString();
                this.update_time = ~~(Date.now() / 1000);
                this.update_time_string = new Date(Date.now()).toLocaleDateString();
              }
              if (
                item_files.type == "image/png" ||
                item_files.type == "image/jpeg" ||
                item_files.type == "image/jpeg"
              )
                self.image_url_array.push(new Object());
              _self.consoleLog("uploadFile", "new Object()", new Object());
            };
            reader.readAsDataURL(item_files);
          }
          event.target.value = "";
        }
      },
      removeIndex(index) {
        let _self = this;
        _self.consoleLog("removeIndex", "index", index);
        self.image_url_array.splice(index, 1);
        self.image_url_array.map((item, index_) => {
          _self.consoleLog("removeIndex", "index_", index_);
          item.image_index = index_ + 1;
        });
      }
    };
    return _function;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.image_url_array,
      event.previousIndex,
      event.currentIndex
    );
    console.log("this.image_url_array : ", this.image_url_array);
    this.image_url_array = this.image_url_array.map((item, index) => {
      item.image_index = index + 1;
      return item;
    });
  }
}
