import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent} from '../login/login.component';

const routes: Routes = [
     { path: '', redirectTo: '/login', pathMatch: 'full' },
     { path: 'login', component: LoginComponent },
     { path: 'home', component: HomeComponent }
     // { path: 'details', component: DetailsComponent }
 ];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {

}