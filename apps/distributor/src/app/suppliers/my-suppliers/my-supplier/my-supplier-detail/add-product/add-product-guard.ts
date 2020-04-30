import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { AddProductComponent } from './add-product.component';
import { DialogsCancelComponent } from '../../../../../dialogs/dialogs-cancel/dialogs-cancel.component';


@Injectable({
    providedIn: 'root'
})

export class AddProductSaveGuard implements CanDeactivate<AddProductComponent> {

    constructor(private dialogService: NbDialogService, ) { }

    canDeactivate(
        component: AddProductComponent,
        currentRoute: ActivatedRouteSnapshot,
        nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {

        if (component.Form.touched) {
            // return confirm(`Are you sure you want to Cancel ?`);
            return new Observable((observer: Observer<boolean>) => {
                const dialogRef = this.dialogService.open(DialogsCancelComponent);
                dialogRef.onClose.subscribe(result => {
                    console.log(result);
                    observer.next(result);
                    observer.complete();
                    console.log(observer);
                }, (error) => {
                    observer.next(false);
                    observer.complete();
                    console.log(observer);
                })
            })
        }
        return true;
    }



}