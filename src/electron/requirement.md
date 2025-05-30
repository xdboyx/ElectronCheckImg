# 新增功能需求整理（AI 判斷無法辨識圖片）

## User Case

1. 使用者選擇一個資料夾進行圖片辨識，系統會將無法辨識的圖片放到該資料夾下的 `/無法辨識` 子資料夾。
2. 使用者可點擊「AI 判斷無法辨識圖片」按鈕，系統會自動呼叫 Gemini API（API Key 儲存在 electron-store）對 `/無法辨識` 資料夾內的圖片進行辨識。
3. 若 AI 成功辨識圖片，則將該圖片從 `/無法辨識` 資料夾移除，並依照辨識結果分類到正確的資料夾。

---

## Acceptance Criteria

### Acceptance Criteria 1

**Given**  
使用者已經選擇資料夾並完成初步圖片辨識，且 `/無法辨識` 資料夾內有圖片  
**When**  
使用者點擊「AI 判斷無法辨識圖片」按鈕  
**Then**  
系統會自動呼叫 Gemini API，對 `/無法辨識` 資料夾內所有圖片進行辨識

---

### Acceptance Criteria 2

**Given**  
AI 成功辨識 `/無法辨識` 資料夾內的圖片  
**When**  
辨識結果符合分類條件  
**Then**  
該圖片會從 `/無法辨識` 資料夾移除，並依照辨識結果移動到正確的分類資料夾（如「雲端」或「零股倉」）

---

### Acceptance Criteria 3

**Given**  
AI 辨識過程中遇到錯誤或無法辨識  
**When**  
API 回傳失敗或無法分類  
**Then**  
該圖片會保留在 `/無法辨識` 資料夾，並顯示相關錯誤訊息或提示

---

## AI API 呼叫 Prompt 

- `你是一個能夠精確提取資料並以 JSON 格式輸出的助手。我需要提取「戶名」和「證劵代號」的資料，並將結果以以下 JSON 格式回應：
{"clientName": "戶名", "stockCode": "證劵代號"}
請從我提供的圖片中提取相關資料，並只回應純粹的 JSON 字串，不要包含任何額外的標記（如 \`\`\`json 或換行符）。如果輸入中缺少某些資料，請在對應欄位填入空字串 ""。`


## 相關參考

- `ui/App.tsx`：畫面參考檔案。
- `electron/main.ts`：分資料夾與 IPC 處理邏輯。
- `electron/gemmaAI.ts`: 呼叫 gemma3 api的部分 獨立在這邊