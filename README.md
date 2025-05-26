# ElectronCheckImg

一個使用 Electron + React + TypeScript + Vite + Tesseract.js 的桌面應用程式，批次辨識資料夾內所有圖片的文字，並自動重新命名或複製到 output 資料夾。

## 功能特色
- 使用 Electron 打包桌面應用
- 前端介面採用 React + Vite
- 透過 Tesseract.js 進行圖片文字辨識（支援繁體中文）
- 批次處理資料夾內所有圖片檔（jpg/jpeg/png/bmp）
- 辨識結果自動命名並複製到 output 資料夾

## 安裝與啟動

1. 安裝依賴：
   ```powershell
   npm install
   ```

2. 編譯 Electron 主程式與 Preload 檔案：
   ```powershell
   npm run transpile:electron
   ```

3. 編譯前端 React 專案：
   ```powershell
   npm run build
   ```

4. 啟動 Electron App：
   ```powershell
   npm run dev:electron
   ```
   或
   ```powershell
   npm start
   ```

## 使用方式
1. 啟動應用程式後，點擊「選擇資料夾並批次辨識圖片」按鈕。
2. 選擇包含圖片的資料夾。
3. 程式會自動辨識所有圖片，並將結果顯示於畫面，同時將新檔案複製到 output 子資料夾。

## 專案結構
- `src/ui/`：前端 React 介面
- `src/electron/`：Electron 主程式、Preload、Tesseract 辨識邏輯
- `dist-electron/`：編譯後的 Electron 主程式與 Preload 檔案
- `dist-react/`：編譯後的前端靜態檔案

## 主要技術
- Electron
- React + TypeScript + Vite
- Tesseract.js
- fs-extra

## 開發相關指令
- `npm run transpile:electron`：編譯 Electron 主程式與複製 preload.js
- `npm run build`：編譯前端 React 專案
- `npm run dev:electron`：啟動 Electron（開發用）
- `npm start`：用 electron-forge 啟動

## 注意事項
- 請確保 `chi_tra.traineddata` 語言包已放在正確位置（Tesseract.js 需要）
- 若遇到權限或檔案路徑問題，請以管理員身份執行

---

本專案適合需要批次辨識圖片中文字並自動整理檔案的桌面應用需求。
