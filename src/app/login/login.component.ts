import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,private http: HttpClient,) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required,  ]],
      password: ['', [Validators.required,  ]]
    });
  }
  showZendeskApp = false;
  access_token = '';
  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
    
        const url =
        `https://cognito-idp.ap-south-1.amazonaws.com/`;
        const headers = new HttpHeaders({
         
          'Content-Type':"application/x-amz-json-1.1" ,
          'X-Amz-Target':"AWSCognitoIdentityProviderService.InitiateAuth" ,
          'X-Amz-Date':"$(date -u +'%Y%m%dT%H%M%SZ')" ,
          'Authorization':"AWS4-HMAC-SHA256 Credential=<your-access-key>/<date>/ap-south-1/cognito-idp/aws4_request, SignedHeaders=content-type;host;x-amz-date;x-amz-target, Signature=<signature>" 

          
        });
     const payload={
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: "76knood3t2jrk9869p7a6vljqk",
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password
      }
    }
     
        this.http.post(url , payload,{headers} ).subscribe({
          next: (response: any) => { 
           this.access_token= response.AuthenticationResult.AccessToken
            this.showZendeskApp = true;
            
            console.log('tenent id succesfully',response);
     
          },
          error: (error) => {
            console.error('Error:', error);
          },
           
        });
      
    } else {
      console.error('Form is invalid');
    }
  }
  isLoading=false
  loginzendesk() {
   
       
    this.isLoading=true
        const url =
        `https://unifed-dev-api.infisign.net/unifed-auth-service/unifed/infisignunifed1734957448/custom/jwt/login/`;
        const headers = new HttpHeaders({
         
          'Accept':"application/json" ,
          'Authorization':"Basic 123" ,
          'Content-Type':"application/json" ,
          
          
        });
     const payload={
      access_token: this.access_token,
      application_id: "https://entrans4487.zendesk.com",
      primary_attribute: "username",
      application_uri: "https://unifed-dev-api.infisign.net/unifed-auth-service/unifed/infisignunifed1734957448/saml/idp/sso/init/?sp=https://entrans4487.zendesk.com"
    }
     
        this.http.post(url , payload,{headers} ).subscribe({
          next: (response: any) => { 
            
            this.isLoading=false
            window.open(response.data.uri, '_blank');
            console.log('tenent id succesfully',response);
     
          },
          error: (error) => {
            this.isLoading=false
            console.error('Error:', error);
          },
           
        });
      
    
  }
   
}
