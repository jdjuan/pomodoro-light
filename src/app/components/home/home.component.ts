import * as SerialPort from 'serialport';
import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../providers/electron.service';
import { filter, tap } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  current = 0;
  max = 180;
  remainingTime = '';
  minutesSet = 3;
  inProgress = true;
  interval$: Observable<number>;
  portAccess: SerialPort;

  constructor(private electron: ElectronService) {
    this.interval$ = interval(1000).pipe(
      filter(() => this.inProgress),
      tap(() => {
        this.current += 1;
        this.updateProgress();
        this.updateRemainingTime();
      }),
    );
    this.interval$.subscribe();
  }

  ngOnInit() {
    this.electron.serialPort
      .list()
      .then((ports: any) => {
        this.portAccess = new this.electron.serialPort(
          ports[0]['comName'],
          { baudRate: 9600 },
        );
        this.portAccess.write('on');
      })
      .catch((err: any) => {});
  }

  startTimer(input: HTMLInputElement) {
    this.max = +input.value * 60;
    this.minutesSet = +input.value;
    input.value = null;
    this.current = 0;
    this.updateProgress();
    this.portAccess.write('on');
  }
  updateProgress() {
    this.inProgress = this.max > this.current;
    if (!this.inProgress) {
      this.portAccess.write('off');
    }
  }

  updateRemainingTime() {
    const secondsLeft = this.max - Math.round(this.current);
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = Math.floor(secondsLeft % 60);
    if (!seconds) {
      this.remainingTime = `00`;
    } else {
      this.remainingTime = `${seconds}`;
    }
    if (minutes) {
      this.remainingTime = `${minutes}:${this.remainingTime}`;
    }
  }
  restart() {
    this.current = 0;
  }
}
