import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MainService {
  url = 'http://localhost:3030/todos';

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  postServerEvent(body: any) {
    return this.http.post(`${this.url}`, body);
  }
  showInfo(message: any) {
    this.toastr.info(message, '', {
      closeButton: true,
      timeOut: 0,
      // preventDuplicates: false,
      positionClass: 'toast-bottom-right',
    });
  }
}
