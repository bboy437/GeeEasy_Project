import {
  AfterViewInit,
  Component,
  Inject,
  PLATFORM_ID,
  ViewChild
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NbLayoutComponent } from "@nebular/theme";
import { delay, withLatestFrom, takeWhile } from "rxjs/operators";
import {
  NbMediaBreakpoint,
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService
} from "@nebular/theme";

import { StateService } from "@project/cores";

@Component({
  selector: "project-column-layout",
  styleUrls: ["./column.layout.scss"],
  template: `
    <nb-layout windowMode>
      <nb-layout-header fixed>
        <project-header></project-header>
      </nb-layout-header>

      <nb-sidebar
        class="menu-sidebar"
        tag="menu-sidebar"
        responsive
        [end]="sidebar.id === 'end'"
      >
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column>
        <ng-content select="router-outlet"></ng-content>
        <project-chat-list></project-chat-list>
      </nb-layout-column>

    </nb-layout>
  `
})
export class OneColumnLayoutComponent implements AfterViewInit {
  sidebar: any = {};
  private alive = true;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    protected stateService: StateService,
    protected menuService: NbMenuService,
    protected themeService: NbThemeService,
    protected bpService: NbMediaBreakpointsService,
    protected sidebarService: NbSidebarService
  ) {
    this.stateService
      .onSidebarState()
      .pipe(takeWhile(() => this.alive))
      .subscribe((sidebar: string) => {
        this.sidebar = sidebar;
      });

    const isBp = this.bpService.getByName("is");
    this.menuService
      .onItemSelect()
      .pipe(
        takeWhile(() => this.alive),
        withLatestFrom(this.themeService.onMediaQueryChange()),
        delay(20)
      )
      .subscribe(
        ([item, [bpFrom, bpTo]]: [
          any,
          [NbMediaBreakpoint, NbMediaBreakpoint]
        ]) => {
          if (bpTo.width <= 1199) {
            this.sidebarService.collapse("menu-sidebar");
          }
        }
      );
  }

  ngAfterViewInit() { }
}
