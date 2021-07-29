import { DataSource } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MainService } from './main.service';
// let eventSource = new EventSource('http://localhost:3030/schedules');
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  newEvent: any = { arsenal: 0, manchister: 0 };
  subscribe: any;
  todoform: FormGroup;
  eventSource: any = new EventSource('http://localhost:3030/socers');
  constructor(
    private mainService: MainService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.todoform = fb.group({
      arsenal: ['', Validators.required],
      manchister: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.chackConnetion();
    this.notificationupdate();
  }

  addTodo() {
    let body = this.todoform.value;
    this.subscribe = this.mainService
      .postServerEvent(body)
      .subscribe((data: any) => {
        this.mainService.showInfo(
          `Arsenal:${data.arsenal}--Manchistre:${data.manchister}`
        );
      });
    //
  }
  notificationupdate() {
    this.eventSource.onmessage = (event: any): void => {
      this.newEvent = JSON.parse(event.data);
    };
  }

  chackConnetion() {
    this.eventSource.addEventListener(
      'open',
      function (event: any) {
        console.log('Connection was opened');
      },
      false
    );
  }
  showToasterInfo() {}
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }
}
