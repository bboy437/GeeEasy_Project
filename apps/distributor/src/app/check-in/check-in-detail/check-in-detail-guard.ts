import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { Injectable } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { CheckInDetailComponent } from './check-in-detail.component';
import { DialogsCancelComponent } from '../../dialogs/dialogs-cancel/dialogs-cancel.component';



@Injectable({
    providedIn: 'root'
})

export class CheckInDetailGuard implements CanDeactivate<CheckInDetailComponent> {

    constructor(private dialogService: NbDialogService, ) { }

    canDeactivate(
        component: CheckInDetailComponent,
        currentRoute: ActivatedRouteSnapshot,
        nextState?: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        console.log(component.checkinForm.touched);
        console.log(component.productForm.touched);
        if (component.checkinForm.touched || component.productForm.touched) {
            // return confirm(`Are you sure you want to Cancel ?`);
            return Observable.create((observer: Observer<boolean>) => {
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