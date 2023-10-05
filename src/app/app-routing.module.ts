import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShowExcelComponent } from './show-excel/show-excel.component';

const routes: Routes = [
  {path:'',component:ShowExcelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
