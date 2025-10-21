import React, { useState, useEffect } from 'react'
import ReportService, { DetailedReport, Issue } from '@/services/ReportService'
import MockReportService from '@/services/MockReportService'
import CodeComparison from './CodeComparison'
import TurkishCodeAnalyzer from '@/services/TurkishCodeAnalyzer'
import './Report.css'

interface ReportProps {
  submissionId: string
  onClose: () => void
  useMockData?: boolean
}

const Report: React.FC<ReportProps> = ({ submissionId, onClose, useMockData = true }) => {
  const [report, setReport] = useState<DetailedReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [showCodeComparison, setShowCodeComparison] = useState(false)
  const [viewMode, setViewMode] = useState<'all' | 'sequential'>('all')
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0)

  useEffect(() => {
    fetchReport()
  }, [submissionId])

  const fetchReport = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let reportData: DetailedReport
      if (useMockData) {
        reportData = await MockReportService.simulateReportFetch(submissionId)
      } else {
        reportData = await ReportService.pollForReport(submissionId)
      }
      
      setReport(reportData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rapor alınırken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return '🔴'
      case 'warning': return '🟡'
      case 'info': return '🔵'
      default: return '⚪'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return '#10b981'
      case 'B': return '#3b82f6'
      case 'C': return '#f59e0b'
      case 'D': return '#f97316'
      case 'F': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const handleIssueClick = (issue: Issue) => {
    if (viewMode === 'all') {
      setSelectedIssue(issue)
      setShowCodeComparison(true)
    }
    // Sequential view'da tıklama işlevi yok, detaylar direkt görünür
  }

  const handleCloseComparison = () => {
    setShowCodeComparison(false)
    setSelectedIssue(null)
  }

  const handleViewModeChange = (mode: 'all' | 'sequential') => {
    setViewMode(mode)
    setCurrentIssueIndex(0)
  }

  const handleNextIssue = () => {
    if (report && currentIssueIndex < report.issues.length - 1) {
      setCurrentIssueIndex(currentIssueIndex + 1)
    }
  }

  const handlePrevIssue = () => {
    if (currentIssueIndex > 0) {
      setCurrentIssueIndex(currentIssueIndex - 1)
    }
  }

  const getDisplayIssues = () => {
    if (!report) return []
    if (viewMode === 'all') return report.issues
    return [report.issues[currentIssueIndex]]
  }

  if (loading) {
    return (
      <div className="report-container loading-container">
        <div className="loading-screen">
          <div className="loading-animation">
            <div className="loading-circle"></div>
            <div className="loading-text">Kod Analizi Yapılıyor...</div>
            <div className="loading-subtitle">Lütfen bekleyin</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="report-container error-container">
        <div className="error-screen">
          <div className="error-icon">⚠️</div>
          <h2>Hata Oluştu</h2>
          <p>{error}</p>
          <button onClick={fetchReport} className="retry-button">
            Tekrar Dene
          </button>
        </div>
      </div>
    )
  }

  if (!report) return null

  return (
    <div className="report-container">
      {/* Top Navigation Bar */}
      <div className="report-navbar">
        <div className="navbar-left">
          <div className="navbar-brand">
            <span className="brand-icon">📊</span>
            <span className="brand-text">Kod Kalitesi Dashboard</span>
          </div>
        </div>
        <div className="navbar-right">
          <div className="navbar-meta">
            <span className="meta-item">
              <span className="meta-icon">🆔</span>
              <span className="meta-text">{report.submissionId}</span>
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              <span className="meta-text">{new Date(report.calculatedAt).toLocaleDateString('tr-TR')}</span>
            </span>
          </div>
          <button onClick={onClose} className="close-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div className="main-content">
        {/* Left Sidebar - Results */}
        <div className="sidebar">
          <div className="sidebar-header">
            <h2 className="sidebar-title">📊 Sonuçlar</h2>
          </div>
          
          {/* Score Overview */}
          <div className="score-section">
            <div className="score-main">
              <div className="score-circle">
                <div className="score-number">{report.summary.codeQuality}</div>
                <div className="score-label">Puan</div>
              </div>
              <div className="score-details">
                <div className="grade-display">
                  <span className="grade-letter" style={{ color: getGradeColor(report.summary.grade) }}>
                    {TurkishCodeAnalyzer.getGradeTurkish(report.summary.grade)}
                  </span>
                  <span className="grade-text">({report.summary.grade})</span>
                </div>
                <div className="evaluation-text">
                  {TurkishCodeAnalyzer.getEvaluationTurkish(report.summary.evaluation)}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="stats-section">
            <h3 className="stats-title">İstatistikler</h3>
            <div className="stats-list">
              <div className="stat-item error-item">
                <div className="stat-icon">🔴</div>
                <div className="stat-info">
                  <div className="stat-label">Hatalar</div>
                  <div className="stat-number">{report.summary.errors}</div>
                </div>
                <div className="stat-percentage">
                  {Math.round((report.summary.errors / report.summary.totalIssues) * 100)}%
                </div>
              </div>
              
              <div className="stat-item warning-item">
                <div className="stat-icon">🟡</div>
                <div className="stat-info">
                  <div className="stat-label">Uyarılar</div>
                  <div className="stat-number">{report.summary.warnings}</div>
                </div>
                <div className="stat-percentage">
                  {Math.round((report.summary.warnings / report.summary.totalIssues) * 100)}%
                </div>
              </div>
              
              <div className="stat-item info-item">
                <div className="stat-icon">🔵</div>
                <div className="stat-info">
                  <div className="stat-label">Bilgiler</div>
                  <div className="stat-number">{report.summary.infos}</div>
                </div>
                <div className="stat-percentage">
                  {Math.round((report.summary.infos / report.summary.totalIssues) * 100)}%
                </div>
              </div>
              
              <div className="stat-item total-item">
                <div className="stat-icon">📊</div>
                <div className="stat-info">
                  <div className="stat-label">Toplam</div>
                  <div className="stat-number">{report.summary.totalIssues}</div>
                </div>
                <div className="stat-percentage">100%</div>
              </div>
            </div>
          </div>

          {/* View Controls */}
          <div className="view-controls-section">
            <h3 className="controls-title">Görünüm</h3>
            <div className="view-controls">
              <button 
                className={`view-btn ${viewMode === 'all' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('all')}
              >
                <span className="btn-icon">📋</span>
                <span>Tümü</span>
              </button>
              <button 
                className={`view-btn ${viewMode === 'sequential' ? 'active' : ''}`}
                onClick={() => handleViewModeChange('sequential')}
              >
                <span className="btn-icon">▶️</span>
                <span>Sırayla</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Content - Issues */}
        <div className="content-area">
          <div className="content-header">
            <h2 className="content-title">🐛 Hatalar</h2>
            {viewMode === 'sequential' && (
              <div className="navigation-bar">
                <button 
                  className="nav-button prev" 
                  onClick={handlePrevIssue}
                  disabled={currentIssueIndex === 0}
                >
                  <span>←</span>
                  <span>Önceki</span>
                </button>
                <div className="issue-counter">
                  <span className="current">{currentIssueIndex + 1}</span>
                  <span className="separator">/</span>
                  <span className="total">{report.issues.length}</span>
                </div>
                <button 
                  className="nav-button next" 
                  onClick={handleNextIssue}
                  disabled={currentIssueIndex === report.issues.length - 1}
                >
                  <span>Sonraki</span>
                  <span>→</span>
                </button>
              </div>
            )}
          </div>

          <div className={`issues-list ${viewMode === 'all' ? 'grid-view' : 'sequential-view'}`}>
            {getDisplayIssues().map((issue, index) => (
              <div key={index} className={`issue-item ${viewMode === 'sequential' ? 'sequential-item' : 'issue-card'}`}>
                {viewMode === 'all' ? (
                  // Grid view - clickable cards
                  <div 
                    className={`issue-card ${selectedIssue === issue ? 'selected' : ''}`}
                    onClick={() => handleIssueClick(issue)}
                  >
                    <div className="issue-header">
                      <div className="issue-severity">
                        <span className="severity-icon">{getSeverityIcon(issue.severity)}</span>
                        <span className="severity-text">{TurkishCodeAnalyzer.getSeverityTurkish(issue.severity)}</span>
                      </div>
                      <div className="issue-code">{issue.code}</div>
                      <div className="issue-location">
                        <span className="location-icon">📍</span>
                        <span>Satır {issue.line}:{issue.column}</span>
                      </div>
                    </div>
                    <div className="issue-message">
                      {(issue as any).turkishExplanation || issue.message}
                    </div>
                    <div className="issue-action">
                      <span className="action-button">
                        <span>Detayları Gör</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                ) : (
                  // Sequential view - expanded details
                  <div className="sequential-issue">
                    <div className="sequential-header">
                      <div className="sequential-severity">
                        <span className="severity-icon">{getSeverityIcon(issue.severity)}</span>
                        <span className="severity-text">{TurkishCodeAnalyzer.getSeverityTurkish(issue.severity)}</span>
                        <span className="issue-code">{issue.code}</span>
                        <span className="issue-location">
                          <span className="location-icon">📍</span>
                          <span>Satır {issue.line}:{issue.column}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="sequential-content">
                      <div className="content-section">
                        <h4>📝 Açıklama</h4>
                        <p>{(issue as any).turkishExplanation || issue.message}</p>
                      </div>
                      
                      <div className="content-section">
                        <h4>🔄 Kod Karşılaştırması</h4>
                        <div className="inline-code-comparison">
                          <div className="inline-code bad-code">
                            <h5>❌ Yanlış</h5>
                            <pre><code>{(issue as any).badExample}</code></pre>
                          </div>
                          <div className="inline-code good-code">
                            <h5>✅ Doğru</h5>
                            <pre><code>{(issue as any).goodExample}</code></pre>
                          </div>
                        </div>
                      </div>
                      
                      <div className="content-section">
                        <h4>🔧 Çözüm</h4>
                        <p>{(issue as any).fixSuggestion}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Code Comparison Modal */}
      {showCodeComparison && selectedIssue && (
        <CodeComparison 
          issue={selectedIssue as any} 
          onClose={handleCloseComparison}
        />
      )}
    </div>
  )
}

export default Report
