import React, { useState } from 'react';
import { Box, Card, Typography, List, ListItem, ListItemText, ListItemIcon, IconButton, Chip, Tabs, Tab, Divider, Avatar } from '@mui/material';
import { Check, CheckCircle2, AlertCircle, Info, Bell, CheckSquare } from 'lucide-react';
import PageHeader from '../../../../components/shared/PageHeader';
import Button from '../../../../components/common/Button';
import { formatDateTime } from '../../../../utils/formatters';

const INITIAL_NOTIFICATIONS = [
  { id: '1', type: 'INFO', title: 'New Vehicle Assigned', message: 'TN 01 AB 1234 has been assigned to your bay.', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false },
  { id: '2', type: 'WARNING', title: 'Approval Pending', message: 'Additional work approval pending for Job Card JC-1033.', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false },
  { id: '3', type: 'SUCCESS', title: 'Job Completed', message: 'Water wash completed for KA 05 XY 9876.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: true },
  { id: '4', type: 'ERROR', title: 'Delayed Job', message: 'Job Card JC-1020 is exceeding the estimated delivery time.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), read: true },
  { id: '5', type: 'INFO', title: 'System Update', message: 'DVSOS system will be down for maintenance at 2 AM.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true },
];

const getIcon = (type) => {
  switch(type) {
    case 'SUCCESS': return <CheckCircle2 size={20} color="#10B981" />;
    case 'WARNING': return <AlertCircle size={20} color="#F59E0B" />;
    case 'ERROR': return <AlertCircle size={20} color="#EF4444" />;
    case 'INFO':
    default: return <Info size={20} color="#3B82F6" />;
  }
};

const getBgColor = (type) => {
  switch(type) {
    case 'SUCCESS': return '#10B98115';
    case 'WARNING': return '#F59E0B15';
    case 'ERROR': return '#EF444415';
    case 'INFO':
    default: return '#3B82F615';
  }
};

export default function NotificationsPage({ title = 'Notifications' }) {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [tab, setTab] = useState(0);

  const filteredNotifs = notifications.filter(n => tab === 0 ? true : !n.read);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <PageHeader 
        title={title} 
        breadcrumbs={[{ label: title }]} 
        actions={
           <Button variant="secondary" leftIcon={CheckSquare} onClick={markAllRead}>
             Mark all as read
           </Button>
        }
      />
      
      <Card sx={{ borderRadius: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs 
            value={tab} 
            onChange={(e, v) => setTab(v)}
            sx={{
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.95rem' }
            }}
          >
            <Tab label="All Notifications" />
            <Tab label="Unread" />
          </Tabs>
        </Box>
        <List disablePadding>
          {filteredNotifs.length === 0 ? (
            <Box sx={{ p: 8, textAlign: 'center', color: 'text.secondary' }}>
               <Bell size={48} style={{ opacity: 0.2, margin: '0 auto 16px auto', display: 'block' }} />
               <Typography variant="h6" fontWeight={700} color="text.primary" gutterBottom>
                 All caught up!
               </Typography>
               <Typography variant="body2">
                 You have no new notifications right now.
               </Typography>
            </Box>
          ) : (
            filteredNotifs.map((notif, index) => (
              <React.Fragment key={notif.id}>
                 <ListItem 
                   sx={{ 
                     py: 2.5, px: { xs: 2, sm: 3 }, 
                     bgcolor: notif.read ? 'transparent' : '#F8FAFC',
                     transition: 'background-color 0.2s',
                     '&:hover': { bgcolor: '#F1F5F9' }
                   }}
                   secondaryAction={
                     !notif.read && (
                       <IconButton edge="end" size="small" onClick={() => markAsRead(notif.id)} title="Mark as read">
                         <Check size={20} color="#64748B" />
                       </IconButton>
                     )
                   }
                 >
                   <ListItemIcon sx={{ minWidth: { xs: 48, sm: 64 } }}>
                      <Avatar sx={{ bgcolor: getBgColor(notif.type), width: 40, height: 40 }}>
                        {getIcon(notif.type)}
                      </Avatar>
                   </ListItemIcon>
                   <ListItemText
                     primary={
                       <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                         <Typography variant="subtitle2" fontWeight={notif.read ? 600 : 700} color={notif.read ? 'text.secondary' : 'text.primary'}>
                           {notif.title}
                         </Typography>
                         {!notif.read && <Chip label="New" size="small" color="primary" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />}
                       </Box>
                     }
                     secondary={
                       <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, pr: { xs: 4, sm: 8 } }}>
                         <Typography variant="body2" color={notif.read ? 'text.secondary' : 'text.primary'}>
                           {notif.message}
                         </Typography>
                         <Typography variant="caption" color="text.secondary" fontWeight={500} sx={{ mt: 0.5 }}>
                           {formatDateTime(notif.timestamp)}
                         </Typography>
                       </Box>
                     }
                     sx={{ m: 0 }}
                   />
                 </ListItem>
                 {index < filteredNotifs.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Card>
    </Box>
  );
}
