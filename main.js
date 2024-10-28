import { app, BrowserWindow, screen } from 'electron'

const createWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    const win = new BrowserWindow({
        width: width,
        height: height,
        resizable: false
    })

    win.loadFile('dist/index.html')
}

app.whenReady()
    .then(() => {
        createWindow()

        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow()
            }
        })
    })
    .catch((error) => {
        console.error('Error during app initialization:', error)
    })

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})