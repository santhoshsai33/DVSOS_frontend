import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, Box, Typography, IconButton, TextField, Chip, CircularProgress, Tooltip } from '@mui/material';
import { X, Send, MessageSquare, Car, Clock, Sparkles, CheckCheck, Mic, Trash2 } from 'lucide-react';
import { getJobCardChatApi, sendJobCardChatMessageApi, markJobCardChatReadApi } from '../../api/chatApi';
import { socket } from '../../socket/socket';
import { toastError } from '../../notifications/toast';

const QUICK_REPLIES = [
  'Your vehicle service is currently in progress ⏳',
  'Water wash has been completed 🚿',
  'Wheel alignment and balancing is ongoing 🔧',
  'Your vehicle is ready for inspection and delivery 🚗',
  'Please review the additional work estimate sent above 📋'
];

export default function CustomerWhatsAppChatModal({
  isOpen,
  onClose,
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

  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const isDiscardedRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

      socket.on('chat:new_message', handleNewMessage);

      return () => {
        socket.emit('leave_chat_room', jobCardId);
        socket.off('chat:new_message', handleNewMessage);
      };
    }
  }, [isOpen, jobCardId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    const textToSend = inputText.trim();
    if (!textToSend || isSending) return;

    setIsSending(true);
    setInputText('');

    try {
      const res = await sendJobCardChatMessageApi(jobCardId, { text: textToSend });
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

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          height: '80vh',
          maxHeight: 700,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -15px rgba(0,0,0,0.2)'
        }
      }}
    >
      {/* WhatsApp Header */}
      <Box
        sx={{
          bgcolor: '#075E54',
          color: '#ffffff',
          px: 2.5,
          py: 1.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: '50%',
              bgcolor: '#128C7E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem',
              color: '#ffffff'
            }}
          >
            {customerName.charAt(0).toUpperCase()}
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ color: '#ffffff', lineHeight: 1.2 }}>
                {customerName}
              </Typography>
              <Chip
                label="WhatsApp"
                size="small"
                sx={{
                  bgcolor: '#25D366',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.65rem',
                  height: 18
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', display: 'block', mt: 0.25 }}>
              {customerMobile} {vehicleNo ? `• ${vehicleNo}` : ''} {jobCardNo ? `• #${jobCardNo}` : ''}
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ color: '#ffffff' }} size="small">
          <X size={20} />
        </IconButton>
      </Box>

      {/* Messages Scroll Area */}
      <DialogContent
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
            const isCustomer = msg.sender === 'CUSTOMER';
            const isSystem = msg.sender === 'SYSTEM';
            const isAdvisor = msg.sender === 'ADVISOR';

            if (isSystem) {
              return (
                <Box
                  key={msg.id || index}
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
              );
            }

            return (
              <Box
                key={msg.id || index}
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

                  {msg.mediaUrl && (
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
                      <CheckCheck size={14} color="#34b7f1" />
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </DialogContent>

      {/* Quick Canned Replies */}
      <Box
        sx={{
          bgcolor: '#f8fafc',
          px: 2,
          py: 1,
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': { height: 4 },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: 2 }
        }}
      >
        <Chip
          icon={<Sparkles size={12} color="#0d9488" />}
          label="Quick Replies:"
          size="small"
          sx={{ bgcolor: 'transparent', fontWeight: 700, fontSize: '0.72rem', color: '#0d9488' }}
        />
        {QUICK_REPLIES.map((reply, idx) => (
          <Chip
            key={idx}
            label={reply}
            size="small"
            onClick={() => setInputText(reply)}
            clickable
            sx={{
              bgcolor: '#ffffff',
              border: '1px solid #cbd5e1',
              fontSize: '0.75rem',
              fontWeight: 500,
              '&:hover': { bgcolor: '#e6fffa', borderColor: '#0d9488' }
            }}
          />
        ))}
      </Box>

      {/* Bottom Send Input Bar */}
      <Box
        sx={{
          bgcolor: '#f0f2f5',
          p: 1.5,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderTop: '1px solid #e2e8f0'
        }}
      >
        {!isRecording ? (
          <>
            <TextField
              fullWidth
              size="small"
              placeholder="Type message to send on customer's WhatsApp..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
              multiline
              maxRows={3}
              sx={{
                bgcolor: '#ffffff',
                borderRadius: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  fontSize: '0.875rem'
                }
              }}
            />

            {/* Mic button to record voice note */}
            <Tooltip title="Record Voice Note for Customer">
              <span>
                <IconButton
                  onClick={startRecording}
                  disabled={isSending}
                  sx={{
                    bgcolor: '#f1f5f9',
                    color: '#075E54',
                    border: '1px solid #cbd5e1',
                    width: 44,
                    height: 44,
                    '&:hover': { bgcolor: '#e2e8f0', color: '#128C7E' },
                    '&.Mui-disabled': { bgcolor: '#f1f5f9', color: '#94a3b8' }
                  }}
                >
                  <Mic size={20} />
                </IconButton>
              </span>
            </Tooltip>

            {/* Send text message button */}
            <Tooltip title="Send WhatsApp Message">
              <span>
                <IconButton
                  color="primary"
                  onClick={handleSend}
                  disabled={!inputText.trim() || isSending}
                  sx={{
                    bgcolor: '#075E54',
                    color: '#ffffff',
                    width: 44,
                    height: 44,
                    '&:hover': { bgcolor: '#128C7E' },
                    '&.Mui-disabled': { bgcolor: '#cbd5e1', color: '#94a3b8' }
                  }}
                >
                  {isSending ? <CircularProgress size={20} color="inherit" /> : <Send size={18} />}
                </IconButton>
              </span>
            </Tooltip>
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
              borderRadius: 2,
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
                Recording voice note for WhatsApp...
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
                    <Trash2 size={18} />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Send Voice Note to Customer">
                <span>
                  <IconButton
                    onClick={stopAndSendRecording}
                    disabled={isSending}
                    sx={{
                      bgcolor: '#075E54',
                      color: '#ffffff',
                      width: 42,
                      height: 42,
                      '&:hover': { bgcolor: '#128C7E' },
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
    </Dialog>
  );
}
