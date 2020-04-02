import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DistributorAPIService } from '@project/services';
import { AleartComponent } from '../aleart/aleart.component';

@Component({
  selector: 'project-product-wholesale',
  templateUrl: './product-wholesale.component.html',
  styleUrls: ['./product-wholesale.component.scss']
})
export class ProductWholesaleComponent implements OnInit {
  @Input() data: any;

  arrobjRow: any = {};
  Form: FormGroup;
  submitted = false;


  constructor(
    private distributorAPIService: DistributorAPIService,
    private formBuilder: FormBuilder,
    protected ref: NbDialogRef<ProductWholesaleComponent>,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    console.log(this.data);
    this.buildForm();
  }

  buildForm() {
    this.Form = this.formBuilder.group({
      qty_minimum: ['', Validators.required],
      product_price: ['', Validators.required],
      retail_product_price: ['', Validators.required],
    });
  }

  get f() { return this.Form.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
  }

  onKeyMinimum(searchValue): void {

    if (this.Form.value.qty_minimum <= 0 || this.Form.value.qty_minimum === "") {
      const dialogRef = this.dialogService.open(AleartComponent, {
        context: {
          status: 'Quantity',
        },
      });
      dialogRef.onClose.subscribe(result => {
        if (result === 'ok') {
          this.Form.get('qty_minimum').patchValue("1");
        }
      });

    }
  }


  btnSaveClick() {
    this.submitted = true;
    if (this.Form.invalid) {
      return;
    }
    this.save()
  }

  save() {
    const data: any = {
      qty_minimum: Number(this.Form.value.qty_minimum),
      product_price: Number(this.Form.value.product_price),
      retail_qty_minimum: Number(this.Form.value.qty_minimum),
      retail_product_price: Number(this.Form.value.retail_product_price),
    };
    console.log('data', data);


    this.ref.close(data);

  }


  btnCancelClick(): void {
    this.ref.close();
  }



}
