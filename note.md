# ElectronCheckImg 專案筆記

## 專案結構說明

- `src/electron/`：
  - 放置 Electron 主程序（Main Process）相關程式碼。
  - 例如：`main.ts`（主進程入口）、`checkImg.ts`（圖片辨識邏輯）、`preload.js`（前後端橋接）。
- `src/ui/`：
  - 放置前端 UI（Renderer Process），通常用 React 開發。
  - 例如：`App.tsx`、`main.tsx`、樣式與資源檔案。
- `dist-electron/`、`dist-react/`：
  - 分別為 Electron 及 React 編譯後的產物。

## tsconfig.json 設定

- `tsconfig.json`：專案 TypeScript 全域設定。
- `tsconfig.app.json`、`tsconfig.node.json`：針對不同執行環境（瀏覽器/Node.js）細部設定。
- 常見設定：
  - `target`：編譯後 JS 版本
  - `module`：模組系統（如 commonjs、esnext）
  - `outDir`：編譯輸出資料夾
  - `baseUrl`、`paths`：路徑別名

## 打包成桌面應用程式流程

1. **安裝必要套件**
   - `electron`：主程式
   - `@electron-forge/cli`：打包工具
   - `fs-extra`：進階檔案操作

   安裝指令範例：
   ```sh
   npm install --save electron fs-extra
   npm install --save-dev @electron-forge/cli
   ```

2. **package.json 指令說明**
   ```json
   "scripts": {
     "dev:react": "vite",
     "dev:electron": "electron .",
     "build": "tsc -b && vite build",
     "lint": "eslint .",
     "preview": "vite preview",
     "transpile:electron": "tsc --project src/electron/tsconfig.json && copy src\\electron\\preload.js dist-electron\\preload.js",
     "start": "electron-forge start",
     "package": "electron-forge package",
     "make": "electron-forge make"
   }
   ```
   - `dev:react`：啟動 React 前端（開發模式）
   - `dev:electron`：啟動 Electron 主程式（需先有前端編譯結果）
   - `build`：同時編譯 Electron 及 React 程式
   - `transpile:electron`：只編譯 Electron 端 TypeScript 並複製 preload.js
   - `start`：用 electron-forge 啟動開發模式
   - `package`：用 electron-forge 打包成未安裝的應用程式
   - `make`：用 electron-forge 製作安裝檔（如 .exe、.deb 等）

3. **打包流程**
   - `npm run build`：先編譯前後端
   - `npm run make`：產生桌面應用程式安裝檔

4. **electron-forge 設定**
   - 相關設定於 `package.json` 的 `config.forge` 欄位
   - 可設定應用名稱、圖示、平台等

---

## 其他注意事項
- 前端如需呼叫 Node.js/Electron 功能，需透過 IPC（`ipcMain.handle`/`ipcRenderer.invoke`）
- 純 API 資料可直接在 React 端呼叫
- 跨平台建議使用 `cross-env`、`fs-extra` 等工具

如需更詳細設定可參考官方文件或本專案的 `package.json`、`tsconfig.json`。
