import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs-extra';
import { recognizeText } from './checkImg.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadFile(path.join(app.getAppPath(), 'dist-react/index.html'));

    // IPC 處理：選擇資料夾並處理圖片
    ipcMain.handle('select-and-process-folder', async () => {
        console.dir('select-and-process-folder called');

        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        if (canceled || filePaths.length === 0) return { canceled: true };
        const folderPath = filePaths[0];
        const outputDir = path.join(folderPath, 'output');
        await fs.ensureDir(outputDir);
        const files = await fs.readdir(folderPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|bmp)$/i.test(f));
        const results = [];
        for (const file of imageFiles) {
            const filePath = path.join(folderPath, file);
            const newName = await recognizeText(filePath);
            const ext = path.extname(file);
            if (newName) {
                const destPath = path.join(outputDir, `${newName}${ext}`);
                await fs.copy(filePath, destPath);
                results.push({ src: file, dest: `${newName}${ext}` });
            } else {
                //copy原檔案
                const destPath = path.join(outputDir, `${file}`);
                await fs.copy(filePath, destPath);
                results.push({ src: file, dest: `無法辨識` });
            }
        }
        return { canceled: false, results };
    });
});