var fs = require('fs');
const { app, BrowserWindow, ipcMain } = require('electron')
var csvjson = require('csvjson');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win,
    queryStr = '',
    db = [];


function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 800, height: 600 })

    // and load the index.html of the app.
    win.loadFile('index.html');
    win.maximize();

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
})


try {
    var readFile = fs.readFileSync('preorder.csv', { encoding: "utf-8" });
    db = csvjson.toSchemaObject(readFile);
} catch (error) {
    console.log(error);
}

ipcMain.on('open', function() {
    win.webContents.send('update', db);
});

ipcMain.on('update', function(event, newDB) {
    db = newDB;
    var string = csvjson.toCSV(db, {
        headers: 'key'
    });
    fs.writeFileSync('./preorder.csv', string);
    win.webContents.send('update', db);
    win.webContents.send('saved');

});

ipcMain.on('query', function(event, str) {
    queryStr = str;
    win.webContents.send('update', db);
});

ipcMain.on('save', function(event, id, entry) {
    win.webContents.send('update', db);
});