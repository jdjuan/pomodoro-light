import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as SerialPort from 'serialport';
import { Injectable } from '@angular/core';
import { ipcRenderer, remote, webFrame } from 'electron';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.

@Injectable()
export class ElectronService {
  serialPort: typeof SerialPort;
  ipcRenderer: typeof ipcRenderer;
  webFrame: typeof webFrame;
  remote: typeof remote;
  childProcess: typeof childProcess;
  fs: typeof fs;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.webFrame = window.require('electron').webFrame;
      this.remote = window.require('electron').remote;

      this.childProcess = window.require('child_process');
      this.fs = window.require('fs');
      this.serialPort = window.require('serialport');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  };
}
