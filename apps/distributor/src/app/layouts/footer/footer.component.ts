import { Component } from '@angular/core';

@Component({
  selector: 'project-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
  <div style="width: 100%;">
    <div class="col-12 text-center" >
        <img  src="assets/images/footer.png" height="200"> 
    </div>
  </div>
  `,
})
export class FooterComponent {
}
