import { Component, OnDestroy, OnInit, HostBinding } from "@angular/core";
import {
    NbMediaBreakpointsService,
    NbMenuService,
    NbSidebarService,
    NbThemeService,
    NbToastrService,
    NbComponentStatus
} from "@nebular/theme";

import { UserData } from "@project/cores";
import { LayoutService } from "@project/cores";
import { map, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { NbSearchService } from "@nebular/theme";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
    selector: "project-header",
    styleUrls: ["./header.component.scss"],
    templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    userPictureOnly = false;
    user: any;

    Form: FormGroup;

    themes = [
        {
            value: "dark",
            name: "Dark"
        },
        {
            value: "default",
            name: "Light"
        },
        {
            value: "cosmic",
            name: "Cosmic"
        },
        {
            value: "corporate",
            name: "Corporate"
        }
    ];

    currentTheme = "default";

    userMenu = [{ title: "Profile" }, { title: "Log out" }];
    value = "";

    private index = 0;
    @HostBinding("class")
    className = "example-items-rows";
    private UrlRouter_Massages = "massages";

    id_local: string;

    constructor(
        private sidebarService: NbSidebarService,
        private menuService: NbMenuService,
        private themeService: NbThemeService,
        private userService: UserData,
        private layoutService: LayoutService,
        private breakpointService: NbMediaBreakpointsService,
        private searchService: NbSearchService,
        private toastrService: NbToastrService,
        private router: Router,
        private formBuilder: FormBuilder,
    ) {
        this.id_local = localStorage.getItem('id');
        console.log(' this.id_local', this.id_local);

        this.searchService.onSearchSubmit().subscribe((data: any) => {
            this.value = data.term;
            console.log("value", this.value);
        });
        this.themeService.changeTheme("dark");
    }

    ngOnInit() {
        this.Builder();

        this.currentTheme = this.themeService.currentTheme;
        this.showToast(false, 'warning');
        this.userService
            .getUsers()
            .pipe(takeUntil(this.destroy$))
            .subscribe((users: any) => (this.user = users.nick));

        const { xl } = this.breakpointService.getBreakpointsMap();
        this.themeService
            .onMediaQueryChange()
            .pipe(
                map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
                takeUntil(this.destroy$)
            )
            .subscribe(
                (isLessThanXl: boolean) => (this.userPictureOnly = isLessThanXl)
            );

        this.themeService
            .onThemeChange()
            .pipe(
                map(({ name }) => name),
                takeUntil(this.destroy$)
            )
            .subscribe(themeName => (this.currentTheme = themeName));
    }

    Builder() {
        this.Form = this.formBuilder.group({
            id: []
        });
        this.Form.get('id').patchValue(8484240);
        localStorage.setItem('id', '8484240');
    }

    btnOkClick(id) {
        window.alert('Are you sure you want to OK ?');
        localStorage.setItem('id', id);

    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    changeTheme(themeName: string) {
        this.themeService.changeTheme(themeName);
    }

    toggleSidebar(): boolean {
        this.sidebarService.toggle(true, "menu-sidebar");
        this.layoutService.changeLayoutSize();

        return false;
    }

    navigateHome() {
        this.menuService.navigateHome();
        return false;
    }

    showToast(preventDuplicates, status: NbComponentStatus) {

        setTimeout(() => {
            if (preventDuplicates) {
                this.toastrService.show(
                    'Welcome to Supplier',
                    `Welcome`, { status });
                setTimeout(() => {
                    this.routerLink();
                }, 2000);
            } else {
                this.toastrService.show(
                    'Welcome to Supplier',
                    `Welcome`, { status });

            }
        }, 2000);
    }

    routerLink() {
        this.router.navigate(["massages"]);
    }
}
