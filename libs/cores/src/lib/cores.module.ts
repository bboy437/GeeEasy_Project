import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from './service/layout.service';
import { StateService } from './service/state.service';
import { UserData } from './service/users';
import { UserService } from './service/users.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { NbRoleProvider, NbSecurityModule } from '@nebular/security';
import { of as observableOf } from 'rxjs';

const DATA_SERVICES = [
  { provide: UserData, useClass: UserService },
];

// export const NB_CORE_PROVIDERS = [
//   ...DATA_SERVICES,
//   LayoutService,
//   StateService,
// ];

// @NgModule({
//   imports: [
//     CommonModule,
//   ],
//   exports: [],
//   declarations: [],
// })
// export class CoresModule {
//   constructor(@Optional() @SkipSelf() parentModule: CoresModule) {
//     throwIfAlreadyLoaded(parentModule, 'CoresModule');
//   }

//   static forRoot(): ModuleWithProviders {
//     return <ModuleWithProviders>{
//       ngModule: CoresModule,
//       providers: [
//         ...NB_CORE_PROVIDERS,
//       ],
//     };
//   }
// }


export class NbSimpleRoleProvider extends NbRoleProvider {
  getRole() {
    // here you could provide any role based on any auth flow
    return observableOf('guest');
  }
}

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,

  NbSecurityModule.forRoot({
    accessControl: {
      guest: {
        view: '*',
      },
      user: {
        parent: 'guest',
        create: '*',
        edit: '*',
        remove: '*',
      },
    },
  }).providers,

  {
    provide: NbRoleProvider, useClass: NbSimpleRoleProvider,
  },
  LayoutService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
  ],
  declarations: [],
})
export class CoresModule {
  constructor(@Optional() @SkipSelf() parentModule: CoresModule) {
    throwIfAlreadyLoaded(parentModule, 'CoresModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoresModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
