import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MobileEnquireLineRegisterService {
  url =
    'https://dev-logic.net/dxapi/ProductRESTService.svc/MobileEnquireLineRegister';
  constructor(private http: HttpClient) {}
}
