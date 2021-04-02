import { BrowserWindow } from "electron";
import Store from "electron-store";
import fs from "fs";
import path from "path";
import authServer from "./authServer";


export default class App {

    static mainWindow: Electron.BrowserWindow;
    static instance: Electron.App;
    static store: Store;
    static launchInfo: Record<string, any>;
    static config: any;
    static fbConfig: any;
    static context: any;
    static deepLinkingUrl: string = "";
    static isDev: boolean;

    private static loadConfig(filePath: string) {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }

        console.error("No config file: ", filePath);
        process.exit(404);
    }

    private static getConfig() {
        const mode = App.isDev ? "dev" : "prod";
        const projectRoot = process.cwd();
        const appConfigPath = `${projectRoot}/config/${mode}-config.json`;
        // const fbConfigPath = `${projectRoot}/config/firebase-config.json`;

        App.config = this.loadConfig(appConfigPath);
        // App.fbConfig = this.loadConfig(fbConfigPath);
    }

    private static getAppContext(): any {
        const context = {
            home: App.instance.getPath('home'),
            temp: App.instance.getPath('temp'),
            data: App.instance.getPath('userData'),
            exe: App.instance.getPath('exe'),
            appData: App.instance.getPath('appData'),
            appPath: App.instance.getAppPath(),
            locale: App.instance.getLocale(),
            countryCode: App.instance.getLocaleCountryCode(),
            appVersion: App.instance.getVersion(),
            nodeVersion: process.versions.node,
            chromeVersion: process.versions.chrome,
            electronVersion: process.versions.electron
        };

        App.context = { ...App.context, ...context };
        return App.context;
    }

    private static close() {
        try {
            if (App.mainWindow)
                App.mainWindow.webContents.session.flushStorageData();
        } catch {
            console.error("Could not close application normally");
        }
        App.instance.exit(0);
    }

    private static sendDeepLinkingUrlParamsToRenderer() {
        const params = App.deepLinkingUrl.replace(App.config.protocol + '://', '');
        if (params)
            App.mainWindow.webContents.send('deep-linking-params', params);
    }

    private static handleDeepLinkingUrl() {
        const protocol = App.config.protocol;

        // Reset protocol
        App.instance.removeAsDefaultProtocolClient(protocol);

        if (App.isDev && process.platform === 'win32') {
            App.instance.setAsDefaultProtocolClient(
                protocol, 
                process.execPath, 
                [path.resolve(process.argv[1])]
            );
        } else {
            if (!App.instance.isDefaultProtocolClient(protocol)) {
                App.instance.setAsDefaultProtocolClient(protocol);
            }
        }

        // Handle for mac
        App.instance.on('will-finish-launching', () => {
            App.instance.on('open-url', (event, url) => {
              event.preventDefault()
              App.deepLinkingUrl = url;
              App.sendDeepLinkingUrlParamsToRenderer();
            });
        });
    }

    static createMainWindow(isDev: boolean) {
        if (App.mainWindow)
            return;

        try {
            const config = App.config;
            App.mainWindow = new BrowserWindow({
                ...(config.initialWindow || {}),
                show: false,
                webPreferences: {
                    nodeIntegration: true,
                    nativeWindowOpen: true,
                }
            });

            const startURL = isDev ? 
                config.devServer : 
                `file://${path.join(__dirname, '../../build/index.html')}`;
            
            App.mainWindow.loadURL(startURL);

        } catch (error) {
            console.error(error);
        }
    }

    static onSecondInstance(e: Electron.Event, argv: string[]) {
        if (process.platform !== 'darwin') {
            App.deepLinkingUrl = argv.find((arg) => arg.startsWith(App.config.protocol + '://')) || '';
        }

        // Send new params to instance
        App.sendDeepLinkingUrlParamsToRenderer();

        // Focus window
        if (App.mainWindow) {
            if (App.mainWindow.isMinimized()) 
                App.mainWindow.restore();
            App.mainWindow.focus();
        }
    }

    static onClose() {
        App.mainWindow.destroy();
    }

    static async onReady(launchInfo: Record<string, any>) {
        App.launchInfo = launchInfo || {};
        try {
             // Create main window
            App.createMainWindow(App.isDev);

            // On windows, have to attempt to get from process
            if (process.platform == 'win32') {
                App.deepLinkingUrl = process.argv[1] || '';
            }

            App.mainWindow.on('closed', App.onClose);
            App.mainWindow.once('ready-to-show', () => App.mainWindow.show());

        } catch (error) {
            console.error(error);
        }
    }

    static async start(app: Electron.App, isDev: boolean) {

        App.instance = app;
        App.isDev = isDev;

        console.log("Starting new application instance")

        // Force single application instance
        const lock = app.requestSingleInstanceLock();
        if (!lock) {
            app.quit();
            return;
        }

        // Load the application config from file.
        App.getConfig();

        // Get the context
        App.getAppContext();

        // Setup deep linking params
        App.handleDeepLinkingUrl();

        // Handle application second instance
        App.instance.on('second-instance', App.onSecondInstance);

        // Setup file store
        App.store = new Store();

        // Start auth service is not already present.
        if (!App.deepLinkingUrl) {
            authServer();
        }

        // Launch window
        App.instance.on('ready', App.onReady);
    }
}
