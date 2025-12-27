import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageSettingComponent } from './page-setting/page-setting.component';

const routes: Routes = [{
  "path" : "setting",
  "children" :
  [
      {"path" : "" , component:PageSettingComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
