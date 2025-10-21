import React, { useState } from 'react'
import axios from 'axios'
import Report from './Report'
import MockReportService from '@/services/MockReportService'
import './FileUpload.css'

interface FileUploadProps {}

interface ApiResponse {
  submissionId: string
  language: string
  fileName: string
  message: string
}

const FileUpload: React.FC<FileUploadProps> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('python')
  const [dragActive, setDragActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadResult, setUploadResult] = useState<ApiResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [useMockData, setUseMockData] = useState(true)

  const API_BASE_URL = 'http://localhost:5033/api/submissions'

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setError(null)
      setUploadResult(null)
      setShowReport(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setError(null)
      setUploadResult(null)
      setShowReport(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile || !selectedLanguage) {
      setError('Lütfen bir dosya seçin!')
      return
    }

    setIsLoading(true)
    setError(null)
    setUploadResult(null)
    setShowReport(false)

    try {
      if (useMockData) {
        const mockResult = await MockReportService.simulateFileUpload(selectedFile)
        setUploadResult(mockResult)
      } else {
        const formData = new FormData()
        formData.append('language', selectedLanguage)
        formData.append('file', selectedFile)

        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        if (response.status === 202) {
          setUploadResult(response.data)
        }
      }
      
      setSelectedFile(null)
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Dosya yükleme sırasında bir hata oluştu.')
      } else {
        setError('Beklenmeyen bir hata oluştu.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setError(null)
    setUploadResult(null)
    setShowReport(false)
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleViewReport = () => {
    if (uploadResult) {
      setShowReport(true)
    }
  }

  const handleCloseReport = () => {
    setShowReport(false)
  }

  return (
    <div className="file-upload-container">
      <div className="file-upload-card">
        <div className="upload-header">
          <h2 className="upload-title">Python Dosya Yükle</h2>
          <div className="mock-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={useMockData}
                onChange={(e) => setUseMockData(e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {useMockData ? '🎭 Demo Modu' : '🌐 API Modu'}
              </span>
            </label>
          </div>
        </div>
        
        {uploadResult && !showReport && (
          <div className="success-message">
            <div className="success-icon">✅</div>
            <div className="success-content">
              <h3>Başarılı!</h3>
              <p>{uploadResult.message}</p>
              <div className="success-details">
                <span><strong>Dosya:</strong> {uploadResult.fileName}</span>
                <span><strong>Dil:</strong> {uploadResult.language}</span>
                <span><strong>ID:</strong> {uploadResult.submissionId}</span>
              </div>
              <button onClick={handleViewReport} className="view-report-btn">
                📊 Raporu Görüntüle
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-icon">❌</div>
            <div className="error-content">
              <h3>Hata!</h3>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {!showReport && (
          <div 
            className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-input"
              className="file-input"
              onChange={handleFileChange}
              accept=".py"
              disabled={isLoading}
            />
            <label htmlFor="file-input" className="file-input-label">
              {selectedFile ? (
                <div className="file-selected">
                  <div className="file-icon">🐍</div>
                  <div className="file-info">
                    <div className="file-name">{selectedFile.name}</div>
                    <div className="file-size">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button 
                    type="button" 
                    className="remove-file-btn"
                    onClick={removeFile}
                    aria-label="Dosyayı kaldır"
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="file-drop-content">
                  <div className="upload-icon">📁</div>
                  <div className="upload-text">
                    <strong>Python dosyasını buraya sürükleyin</strong>
                    <span>veya tıklayarak seçin</span>
                  </div>
                  <div className="upload-formats">
                    Sadece .py dosyaları kabul edilir
                  </div>
                </div>
              )}
            </label>
          </div>
        )}

        {!showReport && (
          <div className="language-selection">
            <label htmlFor="language-select" className="language-label">
              Programlama Dili:
            </label>
            <select
              id="language-select"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="language-select"
              disabled={isLoading}
            >
              <option value="python">Python</option>
              <option value="javascript" disabled>JavaScript</option>
              <option value="csharp" disabled>C#</option>
              <option value="java" disabled>Java</option>
              <option value="cpp" disabled>C++</option>
            </select>
            <div className="language-note">
              ⚠️ Şu anda sadece Python seçilebilir
            </div>
          </div>
        )}

        {!showReport && (
          <button
            type="button"
            onClick={handleSubmit}
            className="submit-btn"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner">⏳</span>
                Yükleniyor...
              </>
            ) : (
              <>
                <span className="submit-icon">🚀</span>
                Gönder
              </>
            )}
          </button>
        )}

        {showReport && uploadResult && (
          <Report 
            submissionId={uploadResult.submissionId} 
            onClose={handleCloseReport}
            useMockData={useMockData}
          />
        )}
      </div>
    </div>
  )
}

export default FileUpload
