import { Component, VERSION, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import liff from '@line/liff';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

type UnPromise<T> = T extends Promise<infer X> ? X : T;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  result: Boolean;
  result2: Boolean;
  constructor(private http: HttpClient, private router: Router) {}
  //.init({ liffId: '1657421042-ekawW2jw' })
  os: ReturnType<typeof liff.getOS>;
  profile: UnPromise<ReturnType<typeof liff.getProfile>>;
  ngOnInit(): void {
    //console.log('test');
    liff
      .init({ liffId: '1660756547-zRWjKKmP' })
      .then(() => {
        this.os = liff.getOS();
        if (liff.isLoggedIn()) {
          liff
            .getProfile()
            .then((profile) => {
              this.profile = profile;
              console.log(this.profile.userId);
              let url =
                'https://app1.pranangklao.go.th/DevLineAPI/ProductRESTService.svc/MobileEnquireLineRegister';
              this.http
                .post(url, {
                  param: {
                    ContextKey: 'ReU',
                    LineUserID: this.profile.userId,
                  },
                })
                .toPromise()
                .then((data: any) => {
                  //console.log(data);
                  //console.log(data.LineRegistered);
                  this.result = data.LineRegistered;

                  if (this.result && data.HN != '') {
                    this.router.navigate(['appointment'], {
                      queryParams: {
                        HN: data.HN,
                      },
                    });
                  } else if (!this.result) {
                    this.router.navigate(['register']);
                  } else {
                  }
                });
            })
            .catch(console.error);
        } else {
        }
      })
      .catch(console.error);
  }

  onClick(event?: MouseEvent) {
    liff.login();
  }
}

/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
