# ElectronCheckImg

一個基於 Electron、React、TypeScript、Vite 與 Tesseract.js 的桌面應用程式，可批次辨識資料夾內所有圖片的文字，並依辨識結果自動分類、重新命名或複製到對應資料夾。支援 AI 輔助辨識（Gemini API）。

## 功能特色
- 跨平台桌面應用（Electron 打包）
- 前端介面採用 React + Vite
- 以 Tesseract.js 進行圖片文字辨識（支援繁體中文）
- 支援批次處理 jpg、jpeg、png、bmp 圖片
- 可自訂股號清單，自動分類至「雲端」或「零股倉」資料夾
- 辨識失敗的圖片自動歸入「無法辨識」資料夾
- 支援 Google Gemini AI API 輔助辨識無法辨識的圖片
- 介面可設定 Gemini API Key

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
1. 啟動應用程式後，於介面輸入欲分類的股號（以逗號分隔）。
2. 點擊「選擇資料夾並批次辨識圖片」按鈕，選擇包含圖片的資料夾。
3. 程式會自動辨識所有圖片，依股號分類至「雲端」或「零股倉」資料夾，無法辨識的圖片會放到「無法辨識」資料夾。
4. 若有無法辨識的圖片，可點擊「AI 判斷無法辨識圖片」按鈕，並於「設定 API Key」輸入 Gemini API 金鑰，進行 AI 輔助辨識。

## 專案結構
- `src/ui/`：前端 React 介面
- `src/electron/`：Electron 主程式、Preload、Tesseract 與 AI 辨識邏輯
- `dist-electron/`：編譯後的 Electron 主程式與 Preload
- `dist-react/`：編譯後的前端靜態檔案

## 主要技術
- Electron
- React + TypeScript + Vite
- Tesseract.js
- Google Gemini API
- fs-extra

## 開發相關指令
- `npm run transpile:electron`：編譯 Electron 主程式與 Preload
- `npm run build`：編譯前端
- `npm run dev:electron`：開發模式啟動 Electron
- `npm start`：用 electron-forge 啟動

## 注意事項
- 請確認 `chi_tra.traineddata` 語言包已放在 Tesseract.js 可讀取的位置
- 若需使用 AI 辨識，請先於介面設定 Gemini API Key
- 若遇權限或路徑問題，請以管理員身份執行

---

本專案適合需要批次辨識圖片中文字並自動分類整理檔案的桌面應用需求。
