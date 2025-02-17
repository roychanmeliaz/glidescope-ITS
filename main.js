//build
// electron-packager . GlideScope-ITS --electron-version 8.2.0
// electron-packager . GlideScope-ITS --electron-version 8.2.0 --arch armv7l --platform linux
// electron-packager . GlideScope-ITS --electron-version 8.2.0 --arch arm64 --platform linux
const {app, BrowserWindow} = require('electron');

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({frame:false, width: 800, height: 480, webPreferences: {nodeIntegration: true, webSecurity: false}});
  // mainWindow.setMenu(null);
  // mainWindow.setFullScreen(true);

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
    // Set the save path, making Electron not to prompt a save dialog.
    var currentdate = new Date(); 
    var filename = "rec-"
                    + currentdate.getFullYear()+"-"
                    + ('0' + (currentdate.getMonth()+1)).slice(-2)+"-"
                    + ('0' + currentdate.getDate()).slice(-2)+"_"
                    + currentdate.getHours()+"-"
                    + currentdate.getMinutes()+"-"
                    + currentdate.getSeconds()
                    + ".webm";
    console.log(app.getAppPath())
    console.log(app.getAppPath()+"/recordings/"+filename)
    item.setSavePath(app.getAppPath()+"/recordings/"+filename)
    console.log("Will download triggered")
  
    item.on('updated', (event, state) => {
      if (state === 'interrupted') {
        console.log('Download is interrupted but can be resumed')
      } else if (state === 'progressing') {
        if (item.isPaused()) {
          console.log('Download is paused')
        } else {
          console.log(`Received bytes: ${item.getReceivedBytes()}`)
        }
      }
    })
    item.once('done', (event, state) => {
      if (state === 'completed') {
        console.log('Download successfully')
      } else {
        console.log(`Download failed: ${state}`)
      }
    })
  })
});
