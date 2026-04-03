import { useState } from 'react';
import './App.css';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

// 샘플 데이터 — 2024~2025 2개년
const salesData = [
  { month: '2024-01', revenue: 9500000,  orders: 260 },
  { month: '2024-02', revenue: 10200000, orders: 285 },
  { month: '2024-03', revenue: 11000000, orders: 310 },
  { month: '2024-04', revenue: 13000000, orders: 350 },
  { month: '2024-05', revenue: 12500000, orders: 340 },
  { month: '2024-06', revenue: 15000000, orders: 420 },
  { month: '2024-07', revenue: 14000000, orders: 390 },
  { month: '2024-08', revenue: 13500000, orders: 370 },
  { month: '2024-09', revenue: 16000000, orders: 440 },
  { month: '2024-10', revenue: 17500000, orders: 480 },
  { month: '2024-11', revenue: 20000000, orders: 550 },
  { month: '2024-12', revenue: 22000000, orders: 610 },
  { month: '2025-01', revenue: 12000000, orders: 320 },
  { month: '2025-02', revenue: 15000000, orders: 410 },
  { month: '2025-03', revenue: 13500000, orders: 375 },
  { month: '2025-04', revenue: 18000000, orders: 490 },
  { month: '2025-05', revenue: 16500000, orders: 445 },
  { month: '2025-06', revenue: 21000000, orders: 580 },
];

// 연도 목록 추출
const years = [...new Set(salesData.map(d => d.month.slice(0, 4)))];

// KPI 카드 컴포넌트
function KpiCard({ title, value }) {
  return (
    <div className="kpi-card">
      <p className="kpi-title">{title}</p>
      <p className="kpi-value">{value}</p>
    </div>
  );
}

function App() {
  // State: 선택된 연도 (기본값 = 전체)
  const [selectedYear, setSelectedYear] = useState('전체');

  // 필터링
  const filtered = selectedYear === '전체'
    ? salesData
    : salesData.filter(d => d.month.startsWith(selectedYear));

  // KPI 계산
  const totalRevenue = filtered.reduce((sum, d) => sum + d.revenue, 0);
  const totalOrders = filtered.reduce((sum, d) => sum + d.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // 차트용 데이터
  const chartData = filtered.map(d => ({
    month: d.month.slice(5),
    매출: d.revenue / 10000,
    주문: d.orders,
  }));

  return (
    <div className="App">
      <h1>데이터 대시보드</h1>

      {/* 연도 필터 */}
      <div className="filter-container">
        <label className="filter-label">연도 선택</label>
        <div className="filter-buttons">
          <button
            className={selectedYear === '전체' ? 'filter-btn active' : 'filter-btn'}
            onClick={() => setSelectedYear('전체')}
          >
            전체
          </button>
          {years.map(year => (
            <button
              key={year}
              className={selectedYear === year ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="kpi-container">
        <KpiCard
          title="총 매출"
          value={`${(totalRevenue / 10000).toLocaleString()}만원`}
        />
        <KpiCard
          title="총 주문"
          value={`${totalOrders.toLocaleString()}건`}
        />
        <KpiCard
          title="평균 객단가"
          value={`${avgOrderValue.toLocaleString()}원`}
        />
      </div>

      {/* 월별 매출 라인 차트 */}
      <div className="chart-section">
        <h2>월별 매출 추이</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(v) => `${v.toLocaleString()}만`} />
            <Tooltip formatter={(v) => `${v.toLocaleString()}만원`} />
            <Line
              type="monotone"
              dataKey="매출"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 월별 주문 바 차트 */}
      <div className="chart-section">
        <h2>월별 주문 건수</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => `${v.toLocaleString()}건`} />
            <Bar dataKey="주문" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
