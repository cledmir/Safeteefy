import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GuardiansComponent} from './pages/guardians/guardians.component';
import {UrgenciesComponent} from './pages/urgencies/urgencies.component';

const routes: Routes = [
  {path: '', component: GuardiansComponent},
  {path: 'urgencies', component: UrgenciesComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
