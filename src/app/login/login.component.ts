import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebApiObservableService } from '../service/web-api-observable.service';


@Component({
    moduleId: module.id,
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent {
    model: any = {};
    email: any;
    password: any;
    loading = false;
    emailError = false;
    showProgressBar: "top";
    username: any;


    constructor(private router: Router, private restAPI: WebApiObservableService) { }

    ngOnInit() {
        sessionStorage.clear();
    }

    emailValidation() {
        var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!EMAIL_REGEXP.test(this.email)) {
            this.emailError = true;

        }
    }

    clearError() {
        this.emailError = false;
    }
    login() {
        this.loading = true;
        this.emailError = false;
        var finalJson = {};
        finalJson["email"] = this.email;
        finalJson["password"] = this.password;
        var userString = this.email;
        userString = userString.split("@")[0];

        /** Start of --username lenth should be less than or equal to 26 characters */
        if (userString.length <= 26) {
            this.username = userString;
        }
        else {
            var length = 26;
            this.username = userString.substring(0, length);
            
        }
        /** End of-- username lenth should be less than or equal to 26 characters */

        this.restAPI.createService('user/surveyLogin', finalJson).subscribe(
            result => {
                if (!result.error) {
                    sessionStorage.setItem("JWToken", result.message);
                    sessionStorage.setItem("username",this.username);
                    this.router.navigate(['/home']);
                }
               

            }, error => {
                console.log(error.message)

                alert(error.message);
                window.location.reload();
            })

    }

}

