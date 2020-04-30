import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, of } from 'rxjs';
import { map, catchError, tap, shareReplay } from 'rxjs/operators';

import { ProductResolved } from '@project/interfaces';
import { ProductAPIService } from '@project/services';


@Injectable({
  providedIn: 'root'
})

export class ProductResolver implements Resolve<ProductResolved> {

  constructor(private productAPIService: ProductAPIService, ) { }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<ProductResolved> {
    const id = route.paramMap.get('id');

    if (isNaN(+id)) {
      const message = `Product id was not a number: ${id}`;
      return of({ product: null, error: message });
    }

    return this.productAPIService.getProductDetailSup(id)
      .pipe(
        map(product => ({ product: product })),
        shareReplay(1),
        catchError(error => {
          const message = `Retrieval error: ${error}`;
          console.error(message);
          return of({ product: null, error: message });
        })
      );
  }

}
