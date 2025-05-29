import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs-extra';
import { recognizeText } from './checkImg.js';
import Store from 'electron-store';
import { geminiAIRecognizeImage } from './gemmaAI.js';

const store = new Store();
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
    ipcMain.handle('select-and-process-folder', async (event, stockListStr: string) => {
        console.dir('select-and-process-folder called');

        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            properties: ['openDirectory']
        });
        if (canceled || filePaths.length === 0) return { canceled: true };
        const folderPath = filePaths[0];
        // 處理股號清單
        console.dir(`stockListStr: ${stockListStr}`);
        const stockList = (stockListStr || '').split(',').map(s => s.trim()).filter(Boolean);
        const cloudDir = path.join(folderPath, '雲端');
        const oddDir = path.join(folderPath, '零股倉');
        const failDir = path.join(folderPath, '無法辨識');
        await fs.ensureDir(cloudDir);
        await fs.ensureDir(oddDir);
        await fs.ensureDir(failDir);
        const files = await fs.readdir(folderPath);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|bmp)$/i.test(f));
        const results = [];
        for (const file of imageFiles) {
            const filePath = path.join(folderPath, file);
            const newName = await recognizeText(filePath);
            const ext = path.extname(file);
            if (newName) {
                const stockNo = newName.split('_')[0];
                console.log(`result: ${newName}, stockNo: ${stockNo}`);
                let destDir;

                console.dir(`stockList: ${stockList}`);
                console.log(stockList.includes(stockNo));
                if (stockList.includes(stockNo)) {
                    console.log(`股號 ${stockNo} 在清單中，將文件移動到雲端資料夾`);
                    destDir = cloudDir;
                } else {
                    destDir = oddDir;
                }
                const destPath = path.join(destDir, `${newName}${ext}`);
                await fs.copy(filePath, destPath);
                results.push({ src: file, dest: `${destDir.split(path.sep).pop()} / ${newName}${ext}` });
            } else {
                // 無法辨識
                const destPath = path.join(failDir, `${file}`);
                await fs.copy(filePath, destPath);
                results.push({ src: file, dest: `無法辨識 / ${file}` });
            }
        }
        // 回傳 folderPath 以便前端記錄
        return { canceled: false, results, folderPath };
    });

    // 設置 IPC 處理器以供渲染進程調用
    ipcMain.handle('store-set', async (event, key, value) => {
        console.dir(`store-set called with key: ${key}, value: ${value}`);
        store.set(key, value); // 儲存鍵值對
        return true;
    });

    ipcMain.handle('store-get', async (event, key) => {
        return store.get(key); // 取得鍵值對
    });

    // IPC 處理：AI 判斷無法辨識圖片
    ipcMain.handle('ai-process-unrecognized', async (event, stockListStr: string, folderPath: string) => {
        const stockList = (stockListStr || '').split(',').map(s => s.trim()).filter(Boolean);
        const cloudDir = path.join(folderPath, '雲端');
        const oddDir = path.join(folderPath, '零股倉');
        const failDir = path.join(folderPath, '無法辨識');
        await fs.ensureDir(cloudDir);
        await fs.ensureDir(oddDir);
        await fs.ensureDir(failDir);
        const files = await fs.readdir(failDir);
        const imageFiles = files.filter(f => /\.(jpg|jpeg|png|bmp)$/i.test(f));
        const apiKey = store.get('apiKey') as string;
        if (!apiKey) {
            return { error: '尚未設定 Gemini API Key' };
        }

        const results = [];
        for (const file of imageFiles) {
            const filePath = path.join(failDir, file);
            try {
                const aiResult = await geminiAIRecognizeImage(filePath, apiKey);
                if (aiResult && aiResult.stockCode) {
                    let destDir;
                    if (stockList.includes(aiResult.stockCode)) {
                        destDir = cloudDir;
                    } else {
                        destDir = oddDir;
                    }
                    const newName = `${aiResult.stockCode}_${aiResult.clientName || ''}`.replace(/\s+/g, '')
                    const ext = path.extname(file);
                    const destPath = path.join(destDir, `${newName}${ext}`);
                    await fs.copy(filePath, destPath);
                    await fs.remove(filePath);
                    results.push({ src: file, dest: `${destDir.split(path.sep).pop()} / ${newName}${ext}` });
                } else {
                    results.push({ src: file, dest: `無法辨識 / ${file}`, error: 'AI 無法辨識' });
                }
            } catch (e) {
                results.push({ src: file, dest: `無法辨識 / ${file}`, error: 'AI 辨識錯誤' });
            }
        }
        return { results };
    });
});