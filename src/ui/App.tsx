import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [processing, setProcessing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleSelectFolder = async () => {
    console.dir('selectAndProcessFolder called')

    setProcessing(true)
    setError(null)
    setResults([])
    try {
      // @ts-ignore
      const res = await window.electronAPI.selectAndProcessFolder()
      if (res.canceled) {
        setError('已取消或未選擇資料夾')
      } else {
        setResults(res.results)
      }
    } catch (e) {
      setError('處理過程發生錯誤')
    }
    setProcessing(false)
  }

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>辨識圖片</h1>
      <div className="card">
        <p>
          點擊按鈕選擇資料夾，批次辨識圖片中的文字。
        </p>
        <button onClick={handleSelectFolder} disabled={processing}>
          {processing ? '處理中...' : '選擇資料夾並批次辨識圖片'}
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
    </>
  )
}

export default App
