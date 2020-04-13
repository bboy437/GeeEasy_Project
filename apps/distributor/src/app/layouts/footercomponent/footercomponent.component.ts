import { Component } from '@angular/core';

@Component({
  selector: 'project-footercomponent',
  styleUrls: ['./footercomponent.component.scss'],
  template: `
   <nb-card-footer class="footerComponent">
            <img src="assets/images/footer.png">
    </nb-card-footer>
  `,
})
export class FooterComponentComponent {
}
