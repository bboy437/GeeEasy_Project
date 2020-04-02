import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef, NbIconLibraries } from '@nebular/theme';

@Component({
  selector: 'project-aleart',
  templateUrl: './aleart.component.html',
  styleUrls: ['./aleart.component.scss']
})
export class AleartComponent implements OnInit {
  @Input() status: any;
  @Input() data: any;
  evaIcons = [];
 
  constructor(
    protected ref: NbDialogRef<AleartComponent>,
    iconsLibrary: NbIconLibraries
  ) {
    this.evaIcons = Array.from(iconsLibrary.getPack('eva').icons.keys())
      .filter(icon => icon.indexOf('outline') === -1);

    iconsLibrary.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('far', { packClass: 'far', iconClassPrefix: 'fa' });
    iconsLibrary.registerFontPack('ion', { iconClassPrefix: 'ion' });
  }

  ngOnInit() {
  }

  btnCancelClick() {
    this.ref.close('cancel');
  }

  btnOkClick() {
    this.ref.close('ok');
  }

}
