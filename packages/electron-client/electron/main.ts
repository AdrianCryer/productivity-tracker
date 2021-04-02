// const { app } = require('electron');
import { app } from "electron";
import * as isDev from "electron-is-dev";
import App from './app';

App.start(app, isDev);