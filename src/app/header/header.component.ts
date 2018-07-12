import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userName :any;
  constructor(private router: Router) { }

  ngOnInit() {
  }

  isSessionToken(){
    return sessionStorage.getItem('JWToken');
  }

  getUserName(){
    return sessionStorage.getItem('username');
  }

  logout(){
 
    sessionStorage.clear();
    this.router.navigate(['/login']);
     }
  
  ngOnDestroy() {
  }
}
