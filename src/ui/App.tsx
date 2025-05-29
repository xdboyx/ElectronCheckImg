import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [stockList, setStockList] = useState('')
  const [showApiKeyModal, setShowApiKeyModal] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [lastFolder, setLastFolder] = useState<string | null>(null)


  // 初始化 API Key
  const initializeApiKey = async () => {
    // @ts-ignore
    const storedApiKey = await window.electronAPI.storeGet('apiKey')
    if (storedApiKey) {
      setApiKey(storedApiKey)
    } else {
      setApiKey('')
    }
  }


  const handleSelectFolder = async () => {
    console.dir('selectAndProcessFolder called')
    setProcessing(true)
    setError(null)
    setResults([])
    try {
      console.dir(`stockList: ${stockList}`)
      // @ts-ignore
      const res = await window.electronAPI.selectAndProcessFolder(stockList)
      if (res.canceled) {
        setError('已取消或未選擇資料夾')
      } else {
        setResults(res.results)
        // 記錄最後選擇的資料夾
        if (res.folderPath) setLastFolder(res.folderPath)
      }
    } catch (e) {
      setError('處理過程發生錯誤')
    }
    setProcessing(false)
  }

  // AI 處理無法辨識圖片
  const handleAIProcessUnrecognized = async () => {
    if (!lastFolder) {
      setError('請先選擇資料夾並辨識一次圖片')
      return
    }
    setProcessing(true)
    setError(null)
    try {
      // @ts-ignore
      const res = await window.electronAPI.aiProcessUnrecognized(stockList, lastFolder)
      if (res.error) {
        setError(res.error)
      } else {
        setResults(res.results)
      }
    } catch (e) {
      setError('AI 辨識過程發生錯誤')
    }
    setProcessing(false)
  }

  const handleSaveApiKey = async () => {
    try {
      console.dir(`Saving API Key: ${apiKey}`)
      // @ts-ignore
      await window.electronAPI.storeSet('apiKey', apiKey)
      setShowApiKeyModal(false)
      setError(null)
    } catch (e) {
      setError('儲存 API Key 時發生錯誤')
    }
  }

  const handleCancelApiKey = () => {
    setShowApiKeyModal(false);
  }

  return (
    <>
      {/* New div for the API Key button at the top-left */}
      <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 1 }}>
        <button onClick={async () => {
          await initializeApiKey()
          setShowApiKeyModal(true)
        }}>
          設定 API Key
        </button>
      </div>

      <div>
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>辨識圖片</h1>
      <div className="card">
        <p>
          請輸入欲分類的股號（逗號分隔）：
        </p>
        <textarea
          rows={3}
          style={{ width: '100%', marginBottom: 8 }}
          value={stockList}
          onChange={e => setStockList(e.target.value)}
          placeholder="例如：1210,6237,6485,6621..."
        />
        <p>
          點擊按鈕選擇資料夾，批次辨識圖片中的文字。
        </p>
        <button onClick={handleSelectFolder} disabled={processing}>
          {processing ? '處理中...' : '選擇資料夾並批次辨識圖片'}
        </button>
        <button onClick={handleAIProcessUnrecognized} disabled={processing || !lastFolder} style={{ marginLeft: 8 }}>
          {processing ? 'AI 處理中...' : 'AI 判斷無法辨識圖片'}
        </button>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {results.length > 0 && (
          <div>
            <h3>處理結果：</h3>
            <ul>
              {results.map((r, i) => (
                <li key={i}>{r.src} → {r.dest}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* API Key Modal (remains the same) */}
      {showApiKeyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            width: '300px',
            textAlign: 'center'
          }}>
            <h3>設定 API Key</h3>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="請輸入您的 API Key"
              style={{
                width: 'calc(100% - 20px)',
                padding: '10px',
                marginBottom: '15px',
                borderRadius: '4px',
                border: '1px solid #ccc'
              }}
            />
            <div>
              <button onClick={handleCancelApiKey} style={{ marginRight: '10px' }}>
                取消
              </button>
              <button onClick={handleSaveApiKey}>
                儲存
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App