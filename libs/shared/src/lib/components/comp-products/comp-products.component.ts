import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from "@angular/forms";

@Component({
  selector: 'project-comp-products',
  templateUrl: './comp-products.component.html',
  styleUrls: ['./comp-products.component.scss']
})
export class CompProductsComponent implements OnInit {

  @Input() arrProduct: any;
  @Input() arrSummary: any;
  @Input() status: string;
  @Input() colorSKU: string;
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.editForm(this.arrProduct);
    console.log('arrProduct', this.arrProduct);


  }

  buildForm() {
    this.productForm = this.formBuilder.group({
      products: this.formBuilder.array([])
    });
  }

  editForm(arrProduct) {
    arrProduct.forEach(element => {
      element.request_product_price_sum = element.request_product_qty * element.request_product_price
      this.products.push(
        this.formBuilder.group(element)
      );
    });
    this.products.disable();
    console.log(this.products);

  }

  get products(): FormArray {
    return this.productForm.get('products') as FormArray;
  }


}
