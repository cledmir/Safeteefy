import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GuardiansComponent} from './pages/guardians/guardians.component';
import {UrgenciesComponent} from './pages/urgencies/urgencies.component';
import {UrgencyComponent} from './pages/urgency/urgency.component';

const routes: Routes = [
  {path: '', component: GuardiansComponent},
  {path: 'urgencies', component: UrgenciesComponent},
  {path: 'guardians/:guardianId/urgencies?new', component: UrgencyComponent},
  {path: 'guardians/:guardianId/urgencies/:id', component: UrgencyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
