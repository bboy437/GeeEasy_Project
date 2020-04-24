import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { MyDistributorsCreateComponent } from './my-distributors-create.component';
import { DialogsCancelComponent } from '../../../../dialogs/dialogs-cancel/dialogs-cancel.component';

@Injectable({
    providedIn: 'root'
})

export class MyDistributorsCreateGuard implements CanDeactivate<MyDistributorsCreateComponent> {

    constructor(private dialogService: NbDialogService, ) { }

    canDeactivate(
        component: MyDistributorsCreateComponent,
        currentRoute: ActivatedRouteSnapshot,
        nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

        if (component.Form.touched) {
            // return confirm(`Are you sure you want to Cancel ?`);
            return Observable.create((observer: Observer<boolean>) => {
                const dialogRef = this.dialogService.open(DialogsCancelComponent);
                dialogRef.onClose.subscribe(async result => {
                    console.log(result);
                    observer.next(result);
                    observer.complete();
                }, (error) => {
                    observer.next(false);
                    observer.complete();
                })
            })
        }
        return true;
    }



}