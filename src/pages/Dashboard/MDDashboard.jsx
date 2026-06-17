import { Grid, Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, Divider } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Briefcase } from 'lucide-react';
import { useState } from 'react';

// MOCKUP DATA EXACTLY MATCHING SCREENSHOT

const BAR_CHART_DATA = [
  { name: 'Mon', value: 300 },
  { name: 'Tue', value: 400 },
  { name: 'Wed', value: 250 },
  { name: 'Thu', value: 380 },
  { name: 'Fri', value: 350 },
  { name: 'Sat', value: 420 },
  { name: 'Today', value: 450 },
];

const PIE_CHART_DATA = [
  { name: 'Completed', value: 9, color: '#10B981' },
  { name: 'Mechanical', value: 8, color: '#2563EB' },
  { name: 'Body Shop', value: 4, color: '#8B5CF6' },
  { name: 'Water Wash', value: 5, color: '#06B6D4' },
  { name: 'JC Pending', value: 2, color: '#F59E0B' },
  { name: 'Delayed', value: 3, color: '#EF4444' },
];

const DEPARTMENT_DATA = [
  { dept: '🔧 Mechanical', active: 3, queue: 8, done: 7, avgTime: '3.5h' },
  { dept: '🔨 Body Shop', active: 2, queue: 4, done: 3, avgTime: '5.2h' },
  { dept: '💧 Water Wash', active: 2, queue: 5, done: 9, avgTime: '0.5h' },
  { dept: '📋 Job Card', active: '-', queue: 2, done: 23, avgTime: '8 min' },
];

export default function MDDashboard() {
  const [timeRange, setTimeRange] = useState('Today');

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F6F9', minHeight: '100%' }}>
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', sm: 'center' }, mb: 3,
        bgcolor: '#FFFFFF', p: 2, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
        border: '1px solid #E5E7EB'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
            <Briefcase size={22} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={800} color="#000" sx={{ lineHeight: 1.2 }}>
              Managing Director (MD)
            </Typography>
          </Box>
        </Box>
        <Select
          size="small"
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          sx={{ minWidth: 120, borderRadius: 2, bgcolor: '#FFFFFF' }}
        >
          <MenuItem value="Today">Today</MenuItem>
          <MenuItem value="This Week">This Week</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
        </Select>
      </Box>

      {/* KPI Cards Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Card 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', borderTop: '4px solid #2563EB', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h4" fontWeight={800} color="#1E3A8A">23</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1, mt: 0.5 }}>Total Vehicles Today</Typography>
              <Typography variant="caption" fontWeight={700} color="#10B981" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp size={14} className="mr-1" /> +3 vs yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Card 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', borderTop: '4px solid #10B981', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h4" fontWeight={800} color="#065F46">9</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1, mt: 0.5 }}>Completed</Typography>
              <Typography variant="caption" fontWeight={600} color="text.secondary">
                53% completion rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Card 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', borderTop: '4px solid #DB2777', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h4" fontWeight={800} color="#BE185D">₹1.4L</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1, mt: 0.5 }}>Revenue Today</Typography>
              <Typography variant="caption" fontWeight={700} color="#10B981" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUp size={14} className="mr-1" /> +12% vs avg
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {/* Card 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', borderTop: '4px solid #EF4444', height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography variant="h4" fontWeight={800} color="#991B1B">3</Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 1, mt: 0.5 }}>Delayed Jobs</Typography>
              <Typography variant="caption" fontWeight={700} color="#10B981" sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingDown size={14} className="mr-1" /> -1 vs yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Middle Row */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 3, display: 'block' }}>
                Daily Throughput — Last 7 Days
              </Typography>
              <Box sx={{ height: 200, width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={BAR_CHART_DATA} margin={{ top: 0, right: 0, bottom: 0, left: -40 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <RechartsTooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {BAR_CHART_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.name === 'Today' ? '#2563EB' : '#BFDBFE'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, display: 'block' }}>
                Status Mix
              </Typography>
              <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: 'center',
                height: { xs: 'auto', sm: 200 },
                gap: { xs: 2, sm: 0 }
              }}>
                <Box sx={{ width: { xs: '100%', sm: '45%' }, height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={PIE_CHART_DATA}
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                      >
                        {PIE_CHART_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '55%' }, display: 'flex', flexDirection: 'column', gap: 1, pl: { xs: 0, sm: 2 } }}>
                  {PIE_CHART_DATA.map((item, i) => (
                    <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 10, height: 10, borderRadius: '2px', bgcolor: item.color }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ fontSize: '0.8rem' }}>
                        {item.name} ({item.value})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Row */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', height: '100%' }}>
            <CardContent sx={{ p: 3, pb: '16px !important' }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 2, display: 'block' }}>
                Department Performance
              </Typography>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 400 }}>
                  <TableHead sx={{ bgcolor: 'transparent' }}>
                    <TableRow>
                      <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700, px: 0, py: 1.5, borderBottom: '1px solid #E2E8F0', bgcolor: 'transparent' }}>DEPARTMENT</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700, py: 1.5, borderBottom: '1px solid #E2E8F0', bgcolor: 'transparent' }}>ACTIVE</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700, py: 1.5, borderBottom: '1px solid #E2E8F0', bgcolor: 'transparent' }}>QUEUE</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700, py: 1.5, borderBottom: '1px solid #E2E8F0', bgcolor: 'transparent' }}>DONE</TableCell>
                      <TableCell sx={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700, py: 1.5, borderBottom: '1px solid #E2E8F0', bgcolor: 'transparent' }}>AVG TIME</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {DEPARTMENT_DATA.map((row, i) => (
                      <TableRow key={i} sx={{ '& td': { borderBottom: '1px solid #F1F5F9', py: 1.5 } }}>
                        <TableCell sx={{ px: 0, color: '#2563EB', fontWeight: 600, fontSize: '0.8rem', bgcolor: 'transparent' }}>{row.dept}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', bgcolor: 'transparent' }}>{row.active}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', bgcolor: 'transparent' }}>{row.queue}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', bgcolor: 'transparent' }}>{row.done}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', bgcolor: 'transparent' }}>{row.avgTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={5}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.02)', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', mb: 3, display: 'block' }}>
                Revenue Breakdown
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#475569" fontWeight={500}>🔧 Mechanical</Typography>
                  <Typography variant="body2" color="#10B981" fontWeight={700}>₹68,400</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#475569" fontWeight={500}>🔨 Body Shop</Typography>
                  <Typography variant="body2" color="#8B5CF6" fontWeight={700}>₹32,100</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#475569" fontWeight={500}>💧 Water Wash</Typography>
                  <Typography variant="body2" color="#06B6D4" fontWeight={700}>₹5,400</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="#475569" fontWeight={500}>📋 Parts & Materials</Typography>
                  <Typography variant="body2" color="#F59E0B" fontWeight={700}>₹14,200</Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" fontWeight={800} color="#1E293B">Today's Total</Typography>
                <Typography variant="h6" fontWeight={800} color="#2563EB">₹1,20,100</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
