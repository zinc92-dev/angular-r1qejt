import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { Subject } from 'rxjs';
import liff from '@line/liff';

type UnPromise<T> = T extends Promise<infer X> ? X : T;

declare var $: any;

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
})
export class AppointmentComponent implements OnInit {
  data: any;
  post: any;
  nameline: String;
  urlimg: String;
  hn: String;
  //dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  allUsers: any = [];
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  os: ReturnType<typeof liff.getOS>;
  profile: UnPromise<ReturnType<typeof liff.getProfile>>;
  ngOnInit() {
    liff.init({ liffId: '1660756547-zRWjKKmP' }).then(() => {
      this.os = liff.getOS();
      if (liff.isLoggedIn()) {
        liff
          .getProfile()
          .then((profile) => {
            this.profile = profile;
            this.nameline = this.profile.displayName;
            this.urlimg = this.profile.pictureUrl;
            console.log(this.profile.userId);
          })
          .catch(console.error);
      } else {
        liff.login();
      }
    });

    this.route.queryParams.subscribe((param) => {
      this.hn = param.HN;
    });

    var today = new Date();
    var startday = today.getDate();
    var startmonth = today.getMonth() + 1; //January is 0!
    var startyear = today.getFullYear();
    var stringday;
    var stringmonth;
    var stringstartdate;

    if (startday < 10) {
      stringday = '0' + startday;
    } else {
      stringday = startday;
    }

    if (startmonth < 10) {
      stringmonth = '0' + startmonth;
    } else {
      stringmonth = startmonth;
    }

    stringstartdate =
      startyear + '-' + stringmonth + '-' + stringday + 'T00:00:00';

    //add 90 days
    var newdate = new Date();
    newdate.setDate(newdate.getDate() + 90);

    var endday = newdate.getDate();
    var endmonth = newdate.getMonth() + 1; //January is 0!
    var endyear = newdate.getFullYear();

    var stringendday;
    var stringendmonth;
    var stringenddate;

    if (endday < 10) {
      stringendday = '0' + endday;
    } else {
      stringendday = endday;
    }

    if (endmonth < 10) {
      stringendmonth = '0' + endmonth;
    } else {
      stringendmonth = endmonth;
    }

    stringenddate =
      endyear + '-' + stringendmonth + '-' + stringendday + 'T00:00:00';

    //console.log(newdate); //2023-06-15T00:00:00

    let url =
      'https://app1.pranangklao.go.th/DevLineAPI/ProductRESTService.svc/EnquirePatientAppointment';
    this.http
      .post(url, {
        param: {
          EnglishView: false,
          HN: this.hn,
          AppointDateTimeFrom: stringstartdate,
          AppointDateTimeTo: stringenddate,
          ContextKey: 'ReU',
        },
      })
      .subscribe((data) => {
        this.data;
        //console.log(data);
        //this.data = response.data;
        this.data = data['ListResultDetail'];
      });
  }

  onlogout(event?: MouseEvent) {
    liff.logout();
    this.router.navigate(['home']);
  }
}
