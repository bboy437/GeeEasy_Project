import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TeamComponent } from './team.component';

const routes: Routes = [{

    path: '',
    component: TeamComponent,
    children: [
        {
            path: 'seller', loadChildren: () =>
                import("./seller/seller.module").then(
                    m => m.SellerModule
                )
        },
        {
            path: 'myteam', loadChildren: () =>
                import("./my-team/my-team.module").then(
                    m => m.MyTeamModule
                )
        }
    ],

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TeamRoutingModule {
}
