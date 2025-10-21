import React, { useState } from 'react'
import { CodeIssue } from '@/services/TurkishCodeAnalyzer'
import './CodeComparison.css'

interface CodeComparisonProps {
  issue: CodeIssue
  onClose: () => void
}

const CodeComparison: React.FC<CodeComparisonProps> = ({ issue, onClose }) => {
  const [activeTab, setActiveTab] = useState<'explanation' | 'comparison' | 'fix'>('explanation')

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return '#ef4444'
      case 'warning': return '#f59e0b'
      case 'info': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🚨'
      case 'warning': return '⚠️'
      case 'info': return '💡'
      default: return '📝'
    }
  }

  return (
    <div className="code-comparison-overlay">
      <div className="code-comparison-modal">
        {/* Header Section */}
        <div className="comparison-header">
          <div className="header-left">
            <div className="issue-badge" style={{ backgroundColor: getSeverityColor(issue.severity) }}>
              {getSeverityIcon(issue.severity)}
              <span>{issue.severity.toUpperCase()}</span>
            </div>
            <div className="issue-details">
              <h2 className="issue-title">{issue.code}</h2>
              <p className="issue-location">📍 Satır {issue.line}:{issue.column}</p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="comparison-nav">
          <button 
            className={`nav-item ${activeTab === 'explanation' ? 'active' : ''}`}
            onClick={() => setActiveTab('explanation')}
          >
            <span className="nav-icon">📖</span>
            <span>Açıklama</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            <span className="nav-icon">🔄</span>
            <span>Karşılaştırma</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'fix' ? 'active' : ''}`}
            onClick={() => setActiveTab('fix')}
          >
            <span className="nav-icon">🔧</span>
            <span>Çözüm</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="comparison-content">
          {activeTab === 'explanation' && (
            <div className="explanation-section">
              <div className="section-header">
                <h3>🔍 Sorun Detayları</h3>
                <div className="section-divider"></div>
              </div>
              
              <div className="info-cards">
                <div className="info-card">
                  <div className="card-icon">🏷️</div>
                  <div className="card-content">
                    <h4>Hata Kodu</h4>
                    <p>{issue.code}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">📝</div>
                  <div className="card-content">
                    <h4>Açıklama</h4>
                    <p>{issue.turkishExplanation}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">💬</div>
                  <div className="card-content">
                    <h4>Mesaj</h4>
                    <p>{issue.message}</p>
                  </div>
                </div>
                
                <div className="info-card">
                  <div className="card-icon">📍</div>
                  <div className="card-content">
                    <h4>Konum</h4>
                    <p>Satır {issue.line}, Sütun {issue.column}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comparison' && (
            <div className="comparison-section">
              <div className="section-header">
                <h3>🔄 Kod Karşılaştırması</h3>
                <div className="section-divider"></div>
              </div>
              
              <div className="code-comparison-grid">
                <div className="code-card bad-code-card">
                  <div className="code-card-header">
                    <div className="code-status bad">
                      <span className="status-icon">❌</span>
                      <span>Yanlış Kod</span>
                    </div>
                    <div className="code-location">Satır {issue.line}</div>
                  </div>
                  <div className="code-content">
                    <pre className="code-block">
                      <code>{issue.badExample}</code>
                    </pre>
                  </div>
                </div>
                
                <div className="comparison-arrow">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M13 7L18 12L13 17M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                
                <div className="code-card good-code-card">
                  <div className="code-card-header">
                    <div className="code-status good">
                      <span className="status-icon">✅</span>
                      <span>Doğru Kod</span>
                    </div>
                    <div className="code-location">Düzeltilmiş</div>
                  </div>
                  <div className="code-content">
                    <pre className="code-block">
                      <code>{issue.goodExample}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fix' && (
            <div className="fix-section">
              <div className="section-header">
                <h3>🔧 Nasıl Düzeltilir?</h3>
                <div className="section-divider"></div>
              </div>
              
              <div className="fix-content">
                <div className="fix-card suggestion-card">
                  <div className="card-header">
                    <span className="card-icon">💡</span>
                    <h4>Önerilen Çözüm</h4>
                  </div>
                  <div className="card-body">
                    <p>{issue.fixSuggestion}</p>
                  </div>
                </div>
                
                <div className="fix-card steps-card">
                  <div className="card-header">
                    <span className="card-icon">📋</span>
                    <h4>Adım Adım</h4>
                  </div>
                  <div className="card-body">
                    <ol className="steps-list">
                      <li>Kodunuzu kontrol edin</li>
                      <li>Belirtilen satırı bulun</li>
                      <li>Önerilen değişikliği yapın</li>
                      <li>Kodu tekrar test edin</li>
                    </ol>
                  </div>
                </div>

                <div className="fix-card tips-card">
                  <div className="card-header">
                    <span className="card-icon">🎯</span>
                    <h4>İpuçları</h4>
                  </div>
                  <div className="card-body">
                    <ul className="tips-list">
                      <li>IDE'nizin linting özelliklerini kullanın</li>
                      <li>Black formatter gibi araçları kullanın</li>
                      <li>Kod standartlarınıza uygun yazın</li>
                      <li>Düzenli olarak kod analizi yapın</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="comparison-footer">
          <button onClick={onClose} className="close-modal-btn">
            <span>Kapat</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CodeComparison
