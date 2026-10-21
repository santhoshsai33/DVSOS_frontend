import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Chip,
  CircularProgress,
  Tooltip,
  Menu
} from '@mui/material';
import {
  X,
  Send,
  MessageSquare,
  Car,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Mic,
  Trash2,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Download,
  ArrowLeft,
  ChevronDown
} from 'lucide-react';
import { getJobCardChatApi, sendJobCardChatMessageApi, markJobCardChatReadApi } from '../../api/chatApi';
import { socket } from '../../socket/socket';
import { toastError } from '../../notifications/toast';

const getMessageDateKey = (dateStr) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  } catch {
    return '';
  }
};

const formatChatDateHeader = (dateStr) => {
  if (!dateStr) return '';
  try {
    const msgDate = new Date(dateStr);
    if (isNaN(msgDate.getTime())) return '';

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());

    if (msgDay.getTime() >= today.getTime()) {
      return 'Today';
    }
    if (msgDay.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }

    const diffTime = today.getTime() - msgDay.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1 && diffDays < 7) {
      return msgDate.toLocaleDateString('en-US', { weekday: 'long' });
    }

    return msgDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return '';
  }
};

export default function CustomerWhatsAppChatModal({
  isOpen,
  onClose,
  onBack = null,
  isEmbedded = false,
  jobCardId,
  customerName = 'Customer',
  customerMobile = '',
  vehicleNo = '',
  jobCardNo = ''
}) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  // Attachment states (Images & PDF/Documents)
  const [selectedFile, setSelectedFile] = useState(null);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const documentInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const isDiscardedRef = useRef(false);

  const scrollToBottom = (behavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior
      });
    } else if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    setShowScrollBottom(distanceFromBottom > 120);
  };

  const cleanupAudioRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const cancelRecording = () => {
    isDiscardedRef.current = true;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch { }
    }
    cleanupAudioRecording();
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toastError('Microphone audio recording is not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      let mimeType = 'audio/webm;codecs=opus';
      if (typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          mimeType = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          mimeType = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          mimeType = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          mimeType = 'audio/mp4';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      isDiscardedRef.current = false;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingSeconds(0);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error starting audio recording:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        toastError('Microphone permission was denied. Please allow microphone access in your browser settings.');
      } else {
        toastError('Could not start microphone recording: ' + (err.message || 'Unknown error'));
      }
      cleanupAudioRecording();
    }
  };

  const stopAndSendRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      cleanupAudioRecording();
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    const currentRecorder = mediaRecorderRef.current;
    const mimeType = currentRecorder.mimeType || 'audio/webm';

    currentRecorder.onstop = async () => {
      if (isDiscardedRef.current) {
        cleanupAudioRecording();
        return;
      }

      const chunks = [...audioChunksRef.current];
      cleanupAudioRecording();

      if (chunks.length === 0) {
        toastError('No audio recorded.');
        return;
      }

      const audioBlob = new Blob(chunks, { type: mimeType });
      if (audioBlob.size < 100) {
        toastError('Audio recording was too short.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64DataUrl = reader.result;
        if (!base64DataUrl) return;

        setIsSending(true);
        try {
          const res = await sendJobCardChatMessageApi(jobCardId, { audioData: base64DataUrl });
          const createdMessage = res?.data?.data?.message || res?.data?.message || res?.message;
          if (createdMessage) {
            setMessages((prev) => {
              if (prev.some((m) => m.id === createdMessage.id)) return prev;
              return [...prev, createdMessage];
            });
          }
        } catch (err) {
          toastError(err.response?.data?.message || err?.message || 'Failed to send voice note to customer');
        } finally {
          setIsSending(false);
        }
      };
      reader.readAsDataURL(audioBlob);
    };

    try {
      currentRecorder.stop();
    } catch {
      cleanupAudioRecording();
    }
  };

  // Cleanup on modal close or unmount
  useEffect(() => {
    return () => {
      cleanupAudioRecording();
    };
  }, []);

  useEffect(() => {
    if (!isOpen && isRecording) {
      cancelRecording();
    }
  }, [isOpen]);

  const formatDuration = (sec) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Fetch chat history on open
  useEffect(() => {
    if (!isOpen || !jobCardId) return;

    let isMounted = true;
    setIsLoading(true);

    getJobCardChatApi(jobCardId)
      .then((res) => {
        if (!isMounted) return;
        const payload = res?.data?.data || res?.data || res || {};
        let rawMessages = payload.messages;
        if (typeof rawMessages === 'string') {
          try {
            rawMessages = JSON.parse(rawMessages);
          } catch {
            rawMessages = [];
          }
        }
        setMessages(Array.isArray(rawMessages) ? rawMessages : []);
        // Mark as read
        markJobCardChatReadApi(jobCardId).catch(() => { });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Failed to load chat history:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, jobCardId]);

  // Real-time socket subscription
  useEffect(() => {
    if (!isOpen || !jobCardId) return;

    if (socket) {
      socket.emit('join_chat_room', jobCardId);

      const handleNewMessage = (payload) => {
        if (String(payload?.jobCardId) === String(jobCardId) && payload?.message) {
          setMessages((prev) => {
            // Avoid duplicate message by ID
            if (prev.some((m) => m.id === payload.message.id)) {
              return prev;
            }
            return [...prev, payload.message];
          });
          // Mark as read since modal is actively open
          markJobCardChatReadApi(jobCardId).catch(() => { });
        }
      };

      const handleMessageStatusUpdated = (payload) => {
        if (!payload || String(payload.jobCardId) !== String(jobCardId)) return;
        setMessages((prev) =>
          prev.map((m) => {
            const isMatch = (payload.messageId && m.id === payload.messageId) ||
                            (payload.twilioSid && m.twilioSid === payload.twilioSid);
            if (isMatch) {
              return { ...m, status: payload.status };
            }
            return m;
          })
        );
      };

      socket.on('chat:new_message', handleNewMessage);
      socket.on('chat:message_status_updated', handleMessageStatusUpdated);

      return () => {
        socket.emit('leave_chat_room', jobCardId);
        socket.off('chat:new_message', handleNewMessage);
        socket.off('chat:message_status_updated', handleMessageStatusUpdated);
      };
    }
  }, [isOpen, jobCardId]);

  // Clear attachment and menu when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(null);
      setShowAttachMenu(false);
    }
  }, [isOpen]);

  // Scroll to bottom when messages initially load or when opening a job card chat
  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      const timer = setTimeout(() => {
        scrollToBottom('auto');
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [isLoading, jobCardId]);

  // Scroll to bottom when a new message arrives or is sent
  useEffect(() => {
    if (messages.length > 0) {
      const container = scrollContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 200;
        if (isNearBottom || isSending) {
          scrollToBottom('smooth');
        }
      }
    }
  }, [messages.length, isSending]);

  // Reset scroll bottom button when chat opens or changes
  useEffect(() => {
    setShowScrollBottom(false);
  }, [isOpen, jobCardId]);

  const handleDocumentSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      toastError('Document file size should be less than 15 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const isImg = file.type?.startsWith('image/') || /\.(jpg|jpeg|png|webp|gif)$/i.test(file.name);
      setSelectedFile({
        file,
        dataUrl: reader.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: isImg ? 'image' : 'document'
      });
      setShowAttachMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toastError('Image file size should be less than 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedFile({
        file,
        dataUrl: reader.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: 'image'
      });
      setShowAttachMenu(false);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleSend = async () => {
    const textToSend = inputText.trim();
    if ((!textToSend && !selectedFile) || isSending) return;

    setIsSending(true);
    const currentFile = selectedFile;
    setSelectedFile(null);
    setInputText('');

    try {
      const payload = { text: textToSend };
      if (currentFile) {
        payload.fileData = currentFile.dataUrl;
        payload.fileName = currentFile.name;
        payload.fileType = currentFile.type;
      }

      const res = await sendJobCardChatMessageApi(jobCardId, payload);
      const createdMessage = res?.data?.data?.message || res?.data?.message || res?.message;
      if (createdMessage) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === createdMessage.id)) return prev;
          return [...prev, createdMessage];
        });
      }
    } catch (err) {
      toastError(err.response?.data?.message || err?.message || 'Failed to send WhatsApp message to customer');
      setInputText(textToSend); // Restore unsent text
      setSelectedFile(currentFile);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatMessageTime = (timeStr) => {
    if (!timeStr) return '';
    try {
      const d = new Date(timeStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  const chatBody = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        bgcolor: '#efeae2',
        position: 'relative'
      }}
    >
      {/* WhatsApp Header */}
      <Box
        sx={{
          bgcolor: '#075E54',
          color: '#ffffff',
          px: 1.75,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          flexShrink: 0
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, overflow: 'hidden' }}>
          {onBack && (
            <Tooltip title="Back to recent chats">
              <IconButton
                onClick={onBack}
                size="small"
                sx={{
                  color: '#ffffff',
                  p: 0.75,
                  mr: 0.25,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            </Tooltip>
          )}

          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              bgcolor: '#128C7E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#ffffff',
              flexShrink: 0
            }}
          >
            {customerName.charAt(0).toUpperCase()}
          </Box>
          <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Typography variant="subtitle2" fontWeight={700} noWrap sx={{ color: '#ffffff', lineHeight: 1.2, fontSize: '0.92rem' }}>
                {customerName}
              </Typography>
              <Chip
                label="WhatsApp"
                size="small"
                sx={{
                  bgcolor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.62rem',
                  height: 17
                }}
              />
            </Box>
            <Typography variant="caption" noWrap sx={{ color: 'rgba(255,255,255,0.85)', display: 'block', mt: 0.15, fontSize: '0.72rem' }}>
              {customerMobile} {vehicleNo ? `• ${vehicleNo}` : ''} {jobCardNo ? `• #${jobCardNo}` : ''}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ color: '#ffffff', p: 0.75, flexShrink: 0 }} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      {/* Messages Scroll Area */}
      <DialogContent
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          bgcolor: '#efeae2',
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          overflowY: 'auto'
        }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={32} sx={{ color: '#075E54' }} />
          </Box>
        ) : messages.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              color: '#64748b',
              gap: 1
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
              }}
            >
              <MessageSquare size={28} color="#25D366" />
            </Box>
            <Typography variant="subtitle2" fontWeight={600} color="#334155">
              No WhatsApp messages yet
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 320 }}>
              Send a message below to connect directly with the customer on their WhatsApp.
            </Typography>
          </Box>
        ) : (
          messages.map((msg, index) => {
            const currentDateKey = getMessageDateKey(msg.time);
            const prevDateKey = index > 0 ? getMessageDateKey(messages[index - 1]?.time) : null;
            const isNewDay = currentDateKey && currentDateKey !== prevDateKey;
            const dateHeader = isNewDay ? formatChatDateHeader(msg.time) : null;

            const isCustomer = msg.sender === 'CUSTOMER';
            const isSystem = msg.sender === 'SYSTEM';
            const isAdvisor = msg.sender === 'ADVISOR';

            const dateHeaderComponent = dateHeader ? (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  my: 2,
                  pointerEvents: 'none',
                  userSelect: 'none'
                }}
              >
                <Box
                  sx={{
                    bgcolor: '#ffffff',
                    color: '#54656f',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    px: 1.6,
                    py: 0.45,
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(11, 20, 26, 0.12)',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    letterSpacing: '0.2px'
                  }}
                >
                  {dateHeader}
                </Box>
              </Box>
            ) : null;

            if (isSystem) {
              return (
                <React.Fragment key={msg.id || `sys-${index}`}>
                  {dateHeaderComponent}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      my: 0.5
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: 2,
                        px: 2,
                        py: 0.75,
                        maxWidth: '85%',
                        textAlign: 'center',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                      }}
                    >
                      <Typography variant="caption" sx={{ color: '#475569', fontWeight: 500, display: 'block' }}>
                        {msg.text}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem', mt: 0.25, display: 'block' }}>
                        {formatMessageTime(msg.time)}
                      </Typography>
                    </Box>
                  </Box>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={msg.id || `msg-${index}`}>
                {dateHeaderComponent}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: isCustomer ? 'flex-start' : 'flex-end',
                    alignItems: 'flex-end'
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '75%',
                      minWidth: 100,
                      p: 1.25,
                      px: 1.75,
                      borderRadius: 2.5,
                      borderTopLeftRadius: isCustomer ? 4 : 20,
                      borderTopRightRadius: isCustomer ? 20 : 4,
                      bgcolor: isCustomer ? '#ffffff' : '#dcf8c6',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      position: 'relative'
                    }}
                  >
                    <Typography
                      variant="caption"
                      fontWeight={700}
                      sx={{
                        color: isCustomer ? '#075E54' : '#128C7E',
                        fontSize: '0.7rem',
                        display: 'block',
                        mb: 0.25
                      }}
                    >
                      {msg.senderName || (isCustomer ? customerName : 'Advisor')}
                    </Typography>

                    {msg.text && (msg.text !== '🎤 Voice message' || !msg.mediaUrl) && (
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#0f172a',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          lineHeight: 1.45,
                          fontSize: '0.875rem'
                        }}
                      >
                        {msg.text}
                      </Typography>
                    )}

                    {/* Image attachment rendering */}
                    {Boolean(
                      msg.mediaUrl &&
                      (msg.mediaType === 'image' ||
                        msg.mediaUrl.match(/\.(jpg|jpeg|png|webp|gif)/i) ||
                        msg.mediaUrl.includes('chat-images'))
                    ) && (
                        <Box sx={{ mt: 0.5, mb: 0.5 }}>
                          <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                            <Box
                              component="img"
                              src={msg.mediaUrl}
                              alt="Photo"
                              sx={{
                                maxWidth: '100%',
                                maxHeight: 250,
                                borderRadius: 1.5,
                                objectFit: 'cover',
                                display: 'block',
                                cursor: 'pointer',
                                '&:hover': { opacity: 0.95 }
                              }}
                            />
                          </a>
                        </Box>
                      )}

                    {/* Document / PDF attachment rendering */}
                    {Boolean(
                      msg.mediaUrl &&
                      (msg.mediaType === 'document' ||
                        msg.mediaUrl.match(/\.(pdf|doc|docx|txt)/i) ||
                        msg.mediaUrl.includes('chat-documents'))
                    ) && (
                        <Box
                          component="a"
                          href={msg.mediaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={msg.fileName || 'document.pdf'}
                          sx={{
                            mt: 0.5,
                            mb: 0.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            bgcolor: isCustomer ? '#f8fafc' : '#cbf3b6',
                            p: 1.25,
                            borderRadius: 2,
                            textDecoration: 'none',
                            color: 'inherit',
                            border: '1px solid rgba(0,0,0,0.08)',
                            '&:hover': { bgcolor: isCustomer ? '#f1f5f9' : '#bcf0a2' }
                          }}
                        >
                          <Box
                            sx={{
                              width: 38,
                              height: 38,
                              borderRadius: 1.5,
                              bgcolor: '#ef4444',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}
                          >
                            <FileText size={20} />
                          </Box>
                          <Box sx={{ overflow: 'hidden', flexGrow: 1 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                fontSize: '0.82rem',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {msg.fileName || 'Document.pdf'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.7rem' }}>
                              PDF Document • Click to view
                            </Typography>
                          </Box>
                          <Download size={16} color="#475569" />
                        </Box>
                      )}

                    {/* Voice Note audio player rendering */}
                    {Boolean(
                      msg.mediaUrl &&
                      (msg.mediaType === 'audio' ||
                        msg.mediaUrl.match(/\.(ogg|mp3|wav|m4a|webm)/i) ||
                        msg.mediaUrl.includes('chat-audio') ||
                        (!msg.mediaType &&
                          !msg.mediaUrl.match(/\.(jpg|jpeg|png|webp|gif|pdf|doc|docx|txt)/i) &&
                          !msg.mediaUrl.includes('chat-images') &&
                          !msg.mediaUrl.includes('chat-documents')))
                    ) && (
                        <Box sx={{ mt: msg.text && msg.text !== '🎤 Voice message' ? 1 : 0, width: '100%', minWidth: { xs: 200, sm: 260 } }}>
                          <audio controls src={msg.mediaUrl} preload="metadata" style={{ width: '100%', maxWidth: 280, height: 36, outline: 'none' }} />
                        </Box>
                      )}

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: 0.5,
                        mt: 0.5
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: '#64748b',
                          fontSize: '0.65rem'
                        }}
                      >
                        {formatMessageTime(msg.time)}
                      </Typography>
                      {isAdvisor && (
                        (() => {
                          const status = String(msg.status || '').toLowerCase();
                          if (status === 'read') {
                            return (
                              <Tooltip title="Read" arrow placement="top">
                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <CheckCheck size={14} color="#34b7f1" />
                                </Box>
                              </Tooltip>
                            );
                          }
                          if (status === 'delivered') {
                            return (
                              <Tooltip title="Delivered" arrow placement="top">
                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <CheckCheck size={14} color="#94a3b8" />
                                </Box>
                              </Tooltip>
                            );
                          }
                          if (status === 'failed') {
                            return (
                              <Tooltip title="Delivery failed" arrow placement="top">
                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <AlertCircle size={14} color="#ef4444" />
                                </Box>
                              </Tooltip>
                            );
                          }
                          if (status === 'sent' || status === 'queued') {
                            return (
                              <Tooltip title="Sent" arrow placement="top">
                                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                  <Check size={14} color="#94a3b8" />
                                </Box>
                              </Tooltip>
                            );
                          }
                          // Fallback for legacy messages
                          return (
                            <Tooltip title="Read" arrow placement="top">
                              <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                <CheckCheck size={14} color="#34b7f1" />
                              </Box>
                            </Tooltip>
                          );
                        })()
                      )}
                    </Box>
                  </Box>
                </Box>
              </React.Fragment>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </DialogContent>

      {/* Scroll to Bottom Floating Action Button (WhatsApp Style) */}
      {!showAttachMenu && showScrollBottom && (
        <Tooltip title="Scroll to bottom">
          <IconButton
            onClick={() => scrollToBottom('smooth')}
            size="small"
            sx={{
              position: 'absolute',
              right: 18,
              bottom: selectedFile ? 142 : 78,
              bgcolor: '#ffffff',
              color: '#54656f',
              boxShadow: '0 3px 10px rgba(11, 20, 26, 0.2)',
              width: 38,
              height: 38,
              borderRadius: '50%',
              zIndex: 8,
              border: '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              animation: 'fadeInScrollBtn 0.18s ease-out',
              '&:hover': {
                bgcolor: '#f8fafc',
                color: '#075E54',
                transform: 'scale(1.08)'
              },
              '@keyframes fadeInScrollBtn': {
                '0%': { opacity: 0, transform: 'scale(0.8)' },
                '100%': { opacity: 1, transform: 'scale(1)' }
              }
            }}
          >
            <ChevronDown size={20} />
          </IconButton>
        </Tooltip>
      )}

      {/* Share Content Sheet (Matches Mobile Screenshot 2) */}
      {showAttachMenu && (
        <Box
          sx={{
            bgcolor: '#ffffff',
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -6px 20px rgba(0,0,0,0.08)',
            p: 2,
            pb: 2.25,
            zIndex: 10,
            animation: 'slideUpAttach 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            '@keyframes slideUpAttach': {
              '0%': { transform: 'translateY(18px)', opacity: 0 },
              '100%': { transform: 'translateY(0)', opacity: 1 }
            }
          }}
        >
          {/* Top handle bar */}
          <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: '#cbd5e1', mx: 'auto', mb: 1.25 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.75, px: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0f172a', fontSize: '0.92rem' }}>
              Share content
            </Typography>
            <IconButton
              size="small"
              onClick={() => setShowAttachMenu(false)}
              sx={{ color: '#64748b', p: 0.5, '&:hover': { color: '#0f172a' } }}
            >
              <X size={18} />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 5 }}>
            {/* Document option */}
            <Box
              onClick={() => {
                setShowAttachMenu(false);
                documentInputRef.current?.click();
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease-in-out',
                '&:hover': { transform: 'scale(1.08)' }
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#5F66CD',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(95, 102, 205, 0.38)',
                  mb: 0.75
                }}
              >
                <FileText size={26} />
              </Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: '#1e293b' }}>
                Document
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem' }}>
                PDF files
              </Typography>
            </Box>

            {/* Gallery / Photos option */}
            <Box
              onClick={() => {
                setShowAttachMenu(false);
                imageInputRef.current?.click();
              }}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease-in-out',
                '&:hover': { transform: 'scale(1.08)' }
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: '#AC44CF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(172, 68, 207, 0.38)',
                  mb: 0.75
                }}
              >
                <ImageIcon size={26} />
              </Box>
              <Typography variant="caption" fontWeight={700} sx={{ color: '#1e293b' }}>
                Gallery
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem' }}>
                Photos
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* Selected File Attachment Preview (Above Input Pill) */}
      {selectedFile && (
        <Box
          sx={{
            bgcolor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            p: 1.25,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
            {selectedFile.type === 'image' ? (
              <Box
                component="img"
                src={selectedFile.dataUrl}
                alt={selectedFile.name}
                sx={{ width: 44, height: 44, borderRadius: 1.5, objectFit: 'cover', border: '1px solid #cbd5e1' }}
              />
            ) : (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  bgcolor: '#ef4444',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FileText size={22} />
              </Box>
            )}
            <Box sx={{ overflow: 'hidden' }}>
              <Typography variant="body2" fontWeight={600} noWrap sx={{ fontSize: '0.85rem', color: '#1e293b' }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b' }}>
                {selectedFile.size} • {selectedFile.type === 'image' ? 'Image' : 'Document'}
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={removeSelectedFile} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
            <X size={18} />
          </IconButton>
        </Box>
      )}

      {/* WhatsApp Style Bottom Input Bar (Matches Mobile Screenshot 1) */}
      <Box
        sx={{
          bgcolor: '#f0f2f5',
          p: 1.25,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          borderTop: selectedFile ? 'none' : '1px solid #e2e8f0'
        }}
      >
        {!isRecording ? (
          <>
            {/* Rounded Input Pill */}
            <Box
              sx={{
                flex: 1,
                bgcolor: '#ffffff',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                px: 2,
                py: 0.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                border: '1px solid #e2e8f0'
              }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder={selectedFile ? "Add a caption..." : "Message"}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isSending}
                multiline
                maxRows={3}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    fontSize: '0.92rem',
                    color: '#1e293b',
                    py: 0.5
                  }
                }}
              />

              {/* Paperclip Attachment Button */}
              <Tooltip title="Attach Document or Image">
                <IconButton
                  size="small"
                  onClick={() => setShowAttachMenu((prev) => !prev)}
                  disabled={isSending}
                  sx={{
                    color: showAttachMenu ? '#00A884' : '#64748b',
                    bgcolor: showAttachMenu ? 'rgba(0, 168, 132, 0.12)' : 'transparent',
                    p: 0.75,
                    transform: 'rotate(-45deg)',
                    transition: 'all 0.18s ease-in-out',
                    '&:hover': {
                      color: '#075E54',
                      bgcolor: 'rgba(0, 168, 132, 0.18)'
                    }
                  }}
                >
                  <Paperclip size={20} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Floating Green Circle Action Button: Mic when empty, Send when text or file present */}
            {Boolean(inputText.trim() || selectedFile) ? (
              <Tooltip title="Send Message">
                <span>
                  <IconButton
                    onClick={handleSend}
                    disabled={isSending}
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      bgcolor: '#00A884',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0, 168, 132, 0.4)',
                      transition: 'all 0.18s ease-in-out',
                      '&:hover': {
                        bgcolor: '#075E54',
                        transform: 'scale(1.05)'
                      },
                      '&.Mui-disabled': {
                        bgcolor: '#cbd5e1',
                        color: '#ffffff'
                      }
                    }}
                  >
                    {isSending ? <CircularProgress size={20} color="inherit" /> : <Send size={20} />}
                  </IconButton>
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Click to Record Voice Note">
                <span>
                  <IconButton
                    onClick={startRecording}
                    disabled={isSending}
                    sx={{
                      width: 46,
                      height: 46,
                      borderRadius: '50%',
                      bgcolor: '#00A884',
                      color: '#ffffff',
                      boxShadow: '0 2px 8px rgba(0, 168, 132, 0.4)',
                      transition: 'all 0.18s ease-in-out',
                      '&:hover': {
                        bgcolor: '#075E54',
                        transform: 'scale(1.05)'
                      }
                    }}
                  >
                    <Mic size={22} />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </>
        ) : (
          /* Voice note recording active bar */
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              bgcolor: '#ffffff',
              borderRadius: '24px',
              px: 2,
              py: 0.8,
              border: '1px solid #fecaca',
              boxShadow: '0 2px 8px rgba(239, 68, 68, 0.08)'
            }}
          >
            {/* Live recording indicator & timer */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  bgcolor: '#ef4444',
                  animation: 'pulseRec 1.2s infinite ease-in-out',
                  '@keyframes pulseRec': {
                    '0%': { transform: 'scale(0.85)', opacity: 0.7 },
                    '50%': { transform: 'scale(1.3)', opacity: 1 },
                    '100%': { transform: 'scale(0.85)', opacity: 0.7 }
                  }
                }}
              />
              <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: '#dc2626', fontFamily: 'monospace' }}>
                {formatDuration(recordingSeconds)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748b', display: { xs: 'none', sm: 'inline' } }}>
                Recording voice note...
              </Typography>
            </Box>

            {/* Recording Controls: Cancel (Trash) & Send (Stop and Send) */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Cancel / Discard">
                <span>
                  <IconButton
                    onClick={cancelRecording}
                    disabled={isSending}
                    sx={{
                      color: '#64748b',
                      width: 40,
                      height: 40,
                      '&:hover': { color: '#ef4444', bgcolor: '#fee2e2' }
                    }}
                  >
                    <Trash2 size={20} />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Send Voice Note to Customer">
                <span>
                  <IconButton
                    onClick={stopAndSendRecording}
                    disabled={isSending}
                    sx={{
                      bgcolor: '#00A884',
                      color: '#ffffff',
                      width: 42,
                      height: 42,
                      '&:hover': { bgcolor: '#075E54' },
                      '&.Mui-disabled': { bgcolor: '#cbd5e1', color: '#94a3b8' }
                    }}
                  >
                    {isSending ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        )}
      </Box>



      {/* Hidden file inputs */}
      <input
        type="file"
        ref={documentInputRef}
        accept=".pdf,.doc,.docx,.txt,application/pdf"
        style={{ display: 'none' }}
        onChange={handleDocumentSelect}
      />
      <input
        type="file"
        ref={imageInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageSelect}
      />
    </Box>
  );

  if (isEmbedded) {
    return chatBody;
  }

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
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
          bgcolor: '#efeae2',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
          borderLeft: '1px solid #e2e8f0'
        }
      }}
    >
      {chatBody}
    </Drawer>
  );
}
