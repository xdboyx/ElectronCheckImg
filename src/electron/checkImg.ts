import Tesseract from 'tesseract.js';


async function recognizeText(imagePath: string) {
    try {
        const result = await Tesseract.recognize(
            imagePath,
            'chi_tra', // 語言設置，這裡使用中文
            // { logger: m => console.log(m) } // 可選的日誌函數
        );
        //辨識log
        // console.log(result.data.text);
        const dataText = result.data.text;

        const regexNumber = /下 列 為 貴 股東 對 (\d{4})/;
        const matchNumber = dataText.match(regexNumber);

        const regexName = /戶 名 : (.+)/;
        const matchName = dataText.match(regexName);

        const stamp = matchName ? matchName[1].replaceAll(' ', '') : getDateStamp();

        if (matchNumber) {
            // console.log("找到匹配:", matchNumber[1]);
            return `${matchNumber[1]}_${stamp}`;
        } else {
            // console.log("未找到匹配");
            return `${stamp}`;
        }
    } catch (error) {
        console.error('識別文字時出錯:', error);
    }
}

function getDateStamp() {
    const now = new Date();
    const hour = now.getHours(); // 獲取小時（24小時制）
    const minute = now.getMinutes(); // 獲取分鐘
    const second = now.getSeconds(); // 

    return `${hour}${minute}${second}`;
}

export { recognizeText };