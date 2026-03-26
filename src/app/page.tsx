'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabaseClient'

type CRMRow = {
  id?: number
  s_no?: string
  parent_co?: string
  company?: string
  country?: string
  contact?: string
  designation?: string
  status?: string
  email?: string
  phone?: string
  linkedin?: string
  website?: string
  location?: string
  follow_up?: string
  acc_manager?: string
  notes?: string
  ann_search_count?: string
  dashboard_count?: string
  annual_excel_files?: string
  shipments?: string
  avg_searches_per_day?: string
  total_searches?: string
  login_devices?: string
  time_spent_events?: string
  chapter_access?: string
  sub_end?: string
  sub_start?: string
  lead_by?: string
  reference?: string
  department?: string
  company_size?: string
  verified_by?: string
  created_by?: string
  modified_by?: string
}

const headerBlue = '#123d6a'
const borderGray = '#dbe2ea'
const lightRow = '#f8fafc'

const thStyle: React.CSSProperties = {
  background: headerBlue,
  color: 'white',
  padding: '12px 10px',
  border: '1px solid #315780',
  textAlign: 'left',
  whiteSpace: 'nowrap',
  fontSize: '13px',
  fontWeight: 700,
  position: 'sticky',
  top: 0,
  zIndex: 2,
}

const tdStyle: React.CSSProperties = {
  padding: '10px',
  border: `1px solid ${borderGray}`,
  fontSize: '13px',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
  background: 'white',
}

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  border: '1px solid #d1d5db',
  background: 'white',
  color: '#111827',
  fontSize: '14px',
  outline: 'none',
}

const topButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #cfd8e3',
  background: 'white',
  color: '#111827',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 600,
}

const blueButtonStyle: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '8px',
  border: '1px solid #1f4f80',
  background: headerBlue,
  color: 'white',
  cursor: 'pointer',
  fontSize: '13px',
  fontWeight: 600,
}

function formatPhone(value?: string) {
  if (!value) return '-'

  try {
    const parsed = JSON.parse(value)
    const countryCode = parsed?.countryCode || ''
    const number = parsed?.number || ''
    const finalPhone = `${countryCode} ${number}`.trim()
    return finalPhone || '-'
  } catch {
    return value
  }
}

function cleanMetricValue(value?: string) {
  if (!value || value.trim() === '') return '0'
  return value
}

export default function Home() {
  const [data, setData] = useState<CRMRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)

  const rowsPerPage = 25

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from('crm_contacts')
      .select('*')
      .limit(2500)

    if (error) {
      console.error('Supabase error:', error)
      alert(error.message)
    } else {
      setData(data || [])
    }

    setLoading(false)
  }

  const uniqueCountries = useMemo(() => {
    const items = Array.from(
      new Set(
        data
          .map((row) => (row.country || '').trim())
          .filter((country) => country !== '')
      )
    ).sort()

    return ['ALL', ...items]
  }, [data])

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase()

    return data.filter((row) => {
      const matchesCountry =
        countryFilter === 'ALL' || (row.country || '') === countryFilter

      const matchesSearch =
        query === '' ||
        (row.parent_co || '').toLowerCase().includes(query) ||
        (row.company || '').toLowerCase().includes(query) ||
        (row.contact || '').toLowerCase().includes(query) ||
        (row.email || '').toLowerCase().includes(query) ||
        (row.designation || '').toLowerCase().includes(query) ||
        (row.country || '').toLowerCase().includes(query)

      return matchesCountry && matchesSearch
    })
  }, [data, search, countryFilter])

  const totalPages = Math.max(1, Math.ceil(filteredData.length / rowsPerPage))

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, currentPage])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, countryFilter])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#eef2f7',
        color: '#111827',
        padding: '16px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          padding: '14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          marginBottom: '14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                display: 'grid',
                placeItems: 'center',
                borderRadius: '8px',
                background: '#f3f6fb',
                fontSize: '24px',
                color: headerBlue,
                fontWeight: 700,
              }}
            >
              A
            </div>

            <div style={{ fontSize: '28px', fontWeight: 700 }}>CRM</div>

            <div
              style={{
                padding: '8px 12px',
                borderRadius: '10px',
                background: '#f8fafc',
                border: '1px solid #dbe2ea',
                fontWeight: 700,
              }}
            >
              Total {filteredData.length}
            </div>
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #dbe2ea',
              background: '#fff',
              minWidth: '160px',
              textAlign: 'right',
              fontWeight: 600,
            }}
          >
            Vishal Singh
          </div>
        </div>

        <div
          style={{
            marginTop: '14px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <button style={topButtonStyle}>＋</button>
          <button style={topButtonStyle}>🗂️</button>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            style={{ ...inputStyle, minWidth: '120px' }}
          >
            {uniqueCountries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Enter value"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, minWidth: '280px' }}
          />

          <button style={topButtonStyle}>＋</button>
          <button style={blueButtonStyle}>⬇ Export</button>
          <button
            style={blueButtonStyle}
            onClick={() => {
              setSearch('')
              setCountryFilter('ALL')
            }}
          >
            Reset Filter
          </button>
          <button style={blueButtonStyle}>🗓 Created At</button>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            background: '#f8fafc',
          }}
        >
          <div><strong>Total Loaded:</strong> {data.length}</div>
          <div><strong>Filtered:</strong> {filteredData.length}</div>
          <div><strong>Page:</strong> {currentPage} / {totalPages}</div>
        </div>

        {loading ? (
          <div style={{ padding: '20px' }}>Loading...</div>
        ) : (
          <div style={{ overflowX: 'auto', maxHeight: '72vh' }}>
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                minWidth: '2400px',
                background: 'white',
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>S.No.</th>
                  <th style={thStyle}>Parent Co.</th>
                  <th style={thStyle}>Company</th>
                  <th style={thStyle}>Contact</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Details</th>
                  <th style={thStyle}>Follow-up</th>
                  <th style={thStyle}>Acc. Manager</th>
                  <th style={thStyle}>Notes</th>
                  <th style={thStyle}>Ann. Search Count</th>
                  <th style={thStyle}>Dashboard Count</th>
                  <th style={thStyle}>Annual Excel Files</th>
                  <th style={thStyle}>Shipments</th>
                  <th style={thStyle}>Avg Searches / Day</th>
                  <th style={thStyle}>Total Searches</th>
                  <th style={thStyle}>Login / Devices</th>
                  <th style={thStyle}>Time Spent / Events</th>
                  <th style={thStyle}>Chapter Access</th>
                  <th style={thStyle}>Sub End</th>
                  <th style={thStyle}>Sub Start</th>
                  <th style={thStyle}>Lead By</th>
                  <th style={thStyle}>Reference</th>
                  <th style={thStyle}>Department</th>
                  <th style={thStyle}>Company Size</th>
                  <th style={thStyle}>Verified By</th>
                  <th style={thStyle}>Created By</th>
                  <th style={thStyle}>Modified By</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((item, index) => (
                  <tr
                    key={`${item.id ?? item.s_no ?? index}-${index}`}
                    style={{
                      background: index % 2 === 0 ? 'white' : lightRow,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#eef4fb'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        index % 2 === 0 ? 'white' : lightRow
                    }}
                  >
                    <td style={tdStyle}>{item.s_no || '-'}</td>
                    <td style={tdStyle}>{item.parent_co || '-'}</td>

                    <td style={tdStyle}>
                      <div style={{ color: '#1f7a32', fontWeight: 700 }}>
                        {item.company || '-'}
                      </div>
                      <div style={{ marginTop: '4px', color: '#4b5563' }}>
                        {item.country || '-'}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <div>{item.contact || '-'}</div>
                      <div style={{ marginTop: '4px', color: '#4b5563' }}>
                        {item.designation || '-'}
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <span style={{ color: '#1f7a32', fontWeight: 700 }}>
                        {item.status || '-'}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'center',
                          fontSize: '16px',
                        }}
                      >
                        <a
                          href={item.email ? `mailto:${item.email}` : '#'}
                          style={{ textDecoration: 'none' }}
                          title={item.email || 'Email'}
                        >
                          📧
                        </a>

                        <span title={formatPhone(item.phone)}>📞</span>

                        {item.linkedin ? (
                          <a
                            href={item.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'none' }}
                            title="LinkedIn"
                          >
                            🔗
                          </a>
                        ) : (
                          <span>🔗</span>
                        )}

                        {item.website ? (
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: 'none' }}
                            title="Website"
                          >
                            🌐
                          </a>
                        ) : (
                          <span>🌐</span>
                        )}

                        <span title={item.location || 'Location'}>📍</span>
                      </div>
                    </td>

                    <td style={tdStyle}>
                      <span style={{ color: '#d13d3d', fontWeight: 600 }}>
                        {item.follow_up && item.follow_up !== ''
                          ? item.follow_up
                          : 'Set date'}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      <span
                        style={{
                          background: '#e9e0ff',
                          color: '#5b3ea6',
                          padding: '4px 9px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        {item.acc_manager || 'RC'}
                      </span>
                    </td>

                    <td style={tdStyle}>
                      {item.notes && item.notes.trim() !== '' ? item.notes : 'Add'}
                    </td>

                    <td style={tdStyle}>{cleanMetricValue(item.ann_search_count)}</td>
                    <td style={tdStyle}>{cleanMetricValue(item.dashboard_count)}</td>
                    <td style={tdStyle}>{cleanMetricValue(item.annual_excel_files)}</td>
                    <td style={tdStyle}>{cleanMetricValue(item.shipments)}</td>
                    <td style={tdStyle}>{cleanMetricValue(item.avg_searches_per_day)}</td>
                    <td style={tdStyle}>{cleanMetricValue(item.total_searches)}</td>
                    <td style={tdStyle}>{item.login_devices || '-'}</td>
                    <td style={tdStyle}>{item.time_spent_events || '-'}</td>
                    <td style={tdStyle}>{item.chapter_access || '-'}</td>
                    <td style={tdStyle}>{item.sub_end || '-'}</td>
                    <td style={tdStyle}>{item.sub_start || '-'}</td>
                    <td style={tdStyle}>{item.lead_by || '-'}</td>
                    <td style={tdStyle}>{item.reference || '-'}</td>
                    <td style={tdStyle}>{item.department || '-'}</td>
                    <td style={tdStyle}>{item.company_size || '-'}</td>
                    <td style={tdStyle}>{item.verified_by || '-'}</td>
                    <td style={tdStyle}>{item.created_by || '-'}</td>
                    <td style={tdStyle}>{item.modified_by || '-'}</td>
                  </tr>
                ))}

                {paginatedData.length === 0 && (
                  <tr>
                    <td style={tdStyle} colSpan={27}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '12px',
            padding: '14px',
            borderTop: '1px solid #e5e7eb',
            background: '#f8fafc',
            flexWrap: 'wrap',
          }}
        >
          <button
            style={{
              ...topButtonStyle,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            }}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          <span style={{ fontWeight: 600 }}>
            Page {currentPage} of {totalPages}
          </span>

          <button
            style={{
              ...topButtonStyle,
              opacity: currentPage === totalPages ? 0.5 : 1,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            }}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}