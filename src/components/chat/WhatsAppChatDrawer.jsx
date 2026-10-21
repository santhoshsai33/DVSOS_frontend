import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Box, Typography, IconButton, TextField, InputAdornment, Chip, CircularProgress, List, ListItem, ListItemButton, ListItemAvatar, Avatar, ListItemText, Divider, Tabs, Tab, Tooltip } from '@mui/material';
import { X, Search, RefreshCw, Car, Mic, Check, CheckCheck } from 'lucide-react';
import { getRecentChatsApi } from '../../api/chatApi';
import { socket } from '../../socket/socket';
import CustomerWhatsAppChatModal from './CustomerWhatsAppChatModal';

const formatChatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    const date = new Date(timeStr);
    const now = new Date();
    const isToday =
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday =
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear();

    if (isYesterday) {
      return 'Yesterday';
    }

    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

export default function WhatsAppChatDrawer({
  isOpen,
  onClose,
  onSelectChat,
  unreadCount = 0,
  onChatsUpdated,
  locationId
}) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterTab, setFilterTab] = useState(0); // 0 = All, 1 = Unread

  useEffect(() => {
    if (!isOpen) {
      setSelectedChat(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const res = await getRecentChatsApi({
        search: debouncedSearch,
        ...(locationId ? { locationId } : {})
      });
      const data = res?.data?.data || res?.data || {};
      setChats(Array.isArray(data.chats) ? data.chats : []);
      if (typeof onChatsUpdated === 'function' && typeof data.totalUnreadCount === 'number') {
        onChatsUpdated(data.totalUnreadCount);
      }
    } catch (err) {
      console.warn('Failed to load recent WhatsApp chats:', err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchChats();

      if (socket) {
        const handleRefresh = (payload) => {
          if (payload?.locationId && locationId && String(payload.locationId) !== String(locationId)) {
            return;
          }
          fetchChats();
        };

        socket.on('chat:updated', handleRefresh);
        socket.on('chat:new_message', handleRefresh);
        socket.on('chat:unread_cleared', handleRefresh);
        socket.on('chat:read', handleRefresh);
        socket.on('chat:message_status_updated', handleRefresh);

        return () => {
          socket.off('chat:updated', handleRefresh);
          socket.off('chat:new_message', handleRefresh);
          socket.off('chat:unread_cleared', handleRefresh);
          socket.off('chat:read', handleRefresh);
          socket.off('chat:message_status_updated', handleRefresh);
        };
      }
    }
  }, [isOpen, debouncedSearch, locationId]);

  const filteredChats = useMemo(() => {
    return chats.filter((c) => {
      if (filterTab === 1) {
        return (c.unreadCount || 0) > 0;
      }
      return true;
    });
  }, [chats, filterTab]);

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={() => {
        setSelectedChat(null);
        onClose();
      }}
      sx={{
        zIndex: (theme) => (theme.zIndex?.modal || 1300) + 50
      }}
      ModalProps={{
        BackdropProps: {
          sx: {
            backgroundColor: 'transparent !important',
            backdropFilter: 'none !important'
          }
        }
      }}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420, md: 450 },
          bgcolor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
          borderLeft: '1px solid #e2e8f0'
        }
      }}
    >
      {selectedChat ? (
        <CustomerWhatsAppChatModal
          isOpen={true}
          isEmbedded={true}
          onBack={() => {
            setSelectedChat(null);
            fetchChats();
          }}
          onClose={() => {
            setSelectedChat(null);
            onClose();
          }}
          jobCardId={selectedChat.jobCardId}
          customerName={selectedChat.customerName}
          customerMobile={selectedChat.customerMobile}
          vehicleNo={selectedChat.vehicleNo}
          jobCardNo={selectedChat.jobCardNo}
        />
      ) : (
        <>
          {/* Top Header */}
          <Box
            sx={{
              bgcolor: '#075E54',
              color: '#ffffff',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  bgcolor: '#128C7E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 4C12.954 4 4 12.954 4 24c0 3.842 1.083 7.433 2.96 10.485L4 44l9.764-2.887A19.92 19.92 0 0024 44c11.046 0 20-8.954 20-20S35.046 4 24 4z"
                    fill="#25D366"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M33.47 28.53c-.5-.25-2.95-1.45-3.41-1.62-.46-.17-.79-.25-1.12.25-.33.5-1.29 1.62-1.58 1.95-.29.33-.58.37-1.08.12-.5-.25-2.11-.78-4.01-2.48-1.48-1.32-2.48-2.95-2.77-3.45-.29-.5-.03-.77.22-1.02.22-.22.5-.58.75-.87.25-.29.33-.5.5-.83.17-.33.08-.62-.04-.87-.12-.25-1.12-2.71-1.54-3.71-.41-.97-.82-.84-1.12-.86l-.96-.02c-.33 0-.87.12-1.33.62-.46.5-1.75 1.71-1.75 4.17 0 2.46 1.79 4.83 2.04 5.17.25.33 3.52 5.37 8.52 7.54 1.19.52 2.12.83 2.85 1.06 1.2.38 2.29.33 3.15.2 0.96-.14 2.95-1.21 3.37-2.37.42-1.17.42-2.17.29-2.37-.12-.21-.46-.33-.96-.58z"
                    fill="#FFFFFF"
                  />
                </svg>
              </Box>
              <Box>
                <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#ffffff', lineHeight: 1.2 }}>
                  WhatsApp Chats
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                  Customer Direct Messages
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Tooltip title="Refresh chats">
                <IconButton onClick={fetchChats} size="small" sx={{ color: '#ffffff' }} disabled={isLoading}>
                  <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                </IconButton>
              </Tooltip>
              <IconButton onClick={onClose} size="small" sx={{ color: '#ffffff' }}>
                <X size={20} />
              </IconButton>
            </Box>
          </Box>

          {/* Search Input Bar */}
          <Box sx={{ p: 1.5, pb: 1, bgcolor: '#f0f2f5', borderBottom: '1px solid #e2e8f0' }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by customer, vehicle, job card..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#64748b" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <X size={14} />
                    </IconButton>
                  </InputAdornment>
                ) : null
              }}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.85rem'
                }
              }}
            />

            {/* Filter Tabs */}
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <Chip
                label={`All (${chats.length})`}
                size="small"
                clickable
                onClick={() => setFilterTab(0)}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: filterTab === 0 ? '#075E54' : '#e2e8f0',
                  color: filterTab === 0 ? '#ffffff' : '#475569',
                  '&:hover': { bgcolor: filterTab === 0 ? '#075E54' : '#cbd5e1' }
                }}
              />
              <Chip
                label={`Unread (${chats.filter((c) => c.unreadCount > 0).length})`}
                size="small"
                clickable
                onClick={() => setFilterTab(1)}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  bgcolor: filterTab === 1 ? '#25D366' : '#e2e8f0',
                  color: filterTab === 1 ? '#ffffff' : '#475569',
                  '&:hover': { bgcolor: filterTab === 1 ? '#1ebc59' : '#cbd5e1' }
                }}
              />
            </Box>
          </Box>

          {/* Conversations List */}
          <Box sx={{ flexGrow: 1, overflowY: 'auto', bgcolor: '#ffffff' }}>
            {isLoading && chats.length === 0 ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8 }}>
                <CircularProgress size={32} sx={{ color: '#075E54' }} />
                <Typography variant="body2" sx={{ color: '#64748b', mt: 1.5 }}>
                  Loading WhatsApp conversations...
                </Typography>
              </Box>
            ) : filteredChats.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, px: 3 }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    bgcolor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 1.5
                  }}
                >
                  <Car size={26} color="#94a3b8" />
                </Box>
                <Typography variant="subtitle2" fontWeight={600} color="#334155">
                  {filterTab === 1 ? 'No unread messages' : 'No WhatsApp conversations'}
                </Typography>
                <Typography variant="caption" color="#94a3b8" sx={{ mt: 0.5, display: 'block' }}>
                  {filterTab === 1
                    ? 'All customer messages have been read'
                    : 'Customer chats from active job cards will appear here'}
                </Typography>
              </Box>
            ) : (
              <List disablePadding>
                {filteredChats.map((chat, index) => {
                  const hasUnread = (chat.unreadCount || 0) > 0;
                  const isVoice = String(chat.lastMessageText || '').includes('Voice message');
                  const isAdvisor = chat.lastSenderType === 'ADVISOR';

                  return (
                    <React.Fragment key={chat.jobCardId || index}>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() => {
                            setSelectedChat(chat);
                            if (typeof onSelectChat === 'function') {
                              onSelectChat(chat);
                            }
                          }}
                          sx={{
                            px: 2,
                            py: 1.5,
                            bgcolor: hasUnread ? '#f0fdf4' : 'transparent',
                            transition: 'background-color 0.15s',
                            '&:hover': {
                              bgcolor: hasUnread ? '#dcfce7' : '#f8fafc'
                            }
                          }}
                        >
                          <ListItemAvatar sx={{ minWidth: 50 }}>
                            <Avatar
                              sx={{
                                bgcolor: hasUnread ? '#25D366' : '#075E54',
                                color: '#ffffff',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                width: 42,
                                height: 42
                              }}
                            >
                              {(chat.customerName || 'C').charAt(0).toUpperCase()}
                            </Avatar>
                          </ListItemAvatar>

                          <ListItemText
                            disableTypography
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.25 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={hasUnread ? 700 : 600}
                                  sx={{
                                    color: '#0f172a',
                                    fontSize: '0.88rem',
                                    maxWidth: '70%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {chat.customerName || 'Customer'}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: hasUnread ? '#16a34a' : '#94a3b8',
                                    fontSize: '0.72rem',
                                    fontWeight: hasUnread ? 700 : 500
                                  }}
                                >
                                  {formatChatTime(chat.lastMessageAt)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Box>
                                {/* Vehicle & Job Card Pill */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <Box
                                    component="span"
                                    sx={{
                                      bgcolor: '#e2e8f0',
                                      color: '#334155',
                                      px: 0.75,
                                      py: 0.15,
                                      borderRadius: 1,
                                      fontSize: '0.68rem',
                                      fontWeight: 700,
                                      fontFamily: 'monospace'
                                    }}
                                  >
                                    {chat.vehicleNo || 'Vehicle'}
                                  </Box>
                                  <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                                    #{chat.jobCardNo}
                                  </Typography>
                                </Box>

                                {/* Last Message Snippet */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      maxWidth: '85%',
                                      overflow: 'hidden'
                                    }}
                                  >
                                    {isAdvisor && (
                                      chat.lastMessageStatus === 'read' ? (
                                        <CheckCheck size={14} color="#0284c7" />
                                      ) : chat.lastMessageStatus === 'delivered' ? (
                                        <CheckCheck size={14} color="#94a3b8" />
                                      ) : chat.lastMessageStatus === 'sent' || chat.lastMessageStatus === 'queued' ? (
                                        <Check size={14} color="#94a3b8" />
                                      ) : (
                                        <CheckCheck size={14} color="#0284c7" />
                                      )
                                    )}
                                    {isVoice ? (
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#0d9488' }}>
                                        <Mic size={14} />
                                        <Typography variant="caption" fontWeight={hasUnread ? 700 : 500}>
                                          Voice message
                                        </Typography>
                                      </Box>
                                    ) : (
                                      <Typography
                                        variant="caption"
                                        fontWeight={hasUnread ? 700 : 400}
                                        sx={{
                                          color: hasUnread ? '#0f172a' : '#64748b',
                                          fontSize: '0.78rem',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap'
                                        }}
                                      >
                                        {chat.lastMessageText || 'No messages yet'}
                                      </Typography>
                                    )}
                                  </Box>

                                  {/* Unread Counter Badge */}
                                  {hasUnread && (
                                    <Box
                                      sx={{
                                        bgcolor: '#25D366',
                                        color: '#ffffff',
                                        minWidth: 20,
                                        height: 20,
                                        borderRadius: '10px',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        px: 0.6
                                      }}
                                    >
                                      {chat.unreadCount}
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider component="li" sx={{ borderColor: '#f1f5f9' }} />
                    </React.Fragment>
                  );
                })}
              </List>
            )}
          </Box>
        </>
      )}
    </Drawer>
  );
}
