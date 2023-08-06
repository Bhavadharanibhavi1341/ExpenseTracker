import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { PopupExpenseComponent } from './popup-expense/popup-expense.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { Component2Component } from './component2/component2.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SplitPayComponent } from './split-pay/split-pay.component';
import { SplitpopComponent } from './splitpop/splitpop.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SearchfilterPipe } from './searchfilter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PopupExpenseComponent,
    SignupComponent,
    LoginComponent,
    Component2Component,
    DashboardComponent,
    SplitPayComponent,
    SplitpopComponent,
    SearchfilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
