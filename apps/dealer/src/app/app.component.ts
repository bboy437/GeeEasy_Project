
import { Component, OnInit } from "@angular/core";
import { MENU_ITEMS } from "./menu";

@Component({
    selector: "project-root",
    styleUrls: ["app.component.scss"],
    template: `
    <project-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </project-column-layout>
  `
})
export class AppComponent  {
    /* implements OnInit */
    menu = MENU_ITEMS;

    /* constructor() { }

    ngOnInit() {
        this.localStorage().getItem("id", red_id => {
            if (red_id === "")
                this.localStorage().setItem("id", "2571677", red_set_id => { });
        });
    } */

    /* localStorage() {
        const self = this;
        const _function = {
            consoleLog(_function_title, _title, _data) {
                console.log(_function_title, " : ", _title, " : ", _data);
            },
            setItem(key, data, callback: (red) => any) {
                const _self = this;
                _self.consoleLog("setItem", "key", key);
                _self.consoleLog("setItem", "data", data);
                localStorage.setItem(key, data);
                callback(true);
            },
            getItem(key, callback: (red) => any) {
                const _self = this;
                _self.consoleLog("getItem", "key", key);
                const red = localStorage.getItem(key);
                _self.consoleLog("getItem", "red", red);
                callback(red);
            },
            removeItem(key, callback: (red) => any) {
                const _self = this;
                _self.consoleLog("removeItem", "key", key);
                const red = localStorage.removeItem(key);
                _self.consoleLog("removeItem", "red", red);
                callback(red);
            },
            clear(callback: (red) => any) {
                const _self = this;
                localStorage.clear();
                _self.consoleLog("clear", "red", true);
                callback(true);
            },
        }
        return _function;
    }; */

}
