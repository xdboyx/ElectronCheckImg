import fs from 'fs-extra';
import path from 'path';
import fetch from 'node-fetch';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const AI_PROMPT = `你是一個能夠精確提取資料並以 JSON 格式輸出的助手。我需要提取「戶名」和「證劵代號」的資料，並將結果以以下 JSON 格式回應：\n{"clientName": "戶名", "stockCode": "證劵代號"}\n請從我提供的圖片中提取相關資料，並只回應純粹的 JSON 字串，不要包含任何額外的標記（如 \`\`\`json 或換行符）。如果輸入中缺少某些資料，請在對應欄位填入空字串 ""。`;

export async function geminiAIRecognizeImage(imagePath: string, apiKey: string): Promise<{ clientName: string, stockCode: string } | null> {
    // 將圖片轉成 base64
    const imageBuffer = await fs.readFile(imagePath);
    const base64Image = imageBuffer.toString('base64');
    const mimeType = getMimeType(imagePath);
    const imageData = `data:${mimeType};base64,${base64Image}`;

    const body = {
        contents: [
            {
                parts: [
                    { text: AI_PROMPT },
                    { inline_data: { mime_type: mimeType, data: base64Image } },
                ]
            }
        ]
    };

    const url = `${GEMINI_API_URL}?key=${apiKey}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        console.error('Gemini API error:', res.status, res.statusText);
        throw new Error('Gemini API 回傳失敗');
    }
    const data: any = await res.json();
    // 解析 Gemini 回傳內容
    try {
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const json = JSON.parse(text);
        return json;
    } catch (e) {
        console.dir('error:', e);
        return null;
    }
}

function getMimeType(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
    if (ext === '.png') return 'image/png';
    if (ext === '.bmp') return 'image/bmp';
    return 'application/octet-stream';
}

// 取得時間戳
function getDateStamp() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();
  return `${hour}${minute}${second}`;
}
