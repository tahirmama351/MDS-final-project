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

  eventSource = new EventSource('http://localhost:3030/schedules');

  ngOnInit() {
    this.chackConnetion();
    this.notificationupdate();
  }

  addTodo() {
    let body = this.todoform.value;
    this.subscribe = this.mainService
      .postServerEvent(body)
      .subscribe((data: any) => {});
    //
    this.showToasterInfo();
  }
  notificationupdate() {
    this.eventSource.onmessage = (event): void => {
      this.newEvent = JSON.parse(event.data);
    };
  }

  chackConnetion() {
    this.eventSource.addEventListener(
      'open',
      function (event) {
        console.log('Connection was opened');
      },
      false
    );
  }
  showToasterInfo() {
    console.log('this newEvent Toastr', this.newEvent);
    this.mainService.showInfo(
      `Arsenal:${this.newEvent.arsenal}--Manchistre:${this.newEvent.manchister}`
    );
  }
  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }
}
