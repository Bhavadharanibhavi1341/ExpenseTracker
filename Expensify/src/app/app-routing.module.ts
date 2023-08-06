import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Component2Component } from './component2/component2.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { PopupExpenseComponent } from './popup-expense/popup-expense.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SplitPayComponent } from './split-pay/split-pay.component';
import { SplitpopComponent } from './splitpop/splitpop.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'component2', component: Component2Component },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'popupexpense', component: PopupExpenseComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'splitpay', component: SplitPayComponent },
  { path: 'splitpop', component: SplitpopComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
