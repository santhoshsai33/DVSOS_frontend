import { useState } from 'react';
import { Box, Grid, Typography, TextField } from '@mui/material';
import { ArrowLeft, Upload, Save } from 'lucide-react';
import Button from '../../../../components/common/Button';
import { toastSuccess } from '../../../../notifications/toast';
import styles from '../../../../pages/GateEntry/GateEntry.module.css';

export default function GateEntryUpdate({ vehicle, onBack }) {
  const [entryDate, setEntryDate] = useState(vehicle?.entryTime ? vehicle.entryTime.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState(vehicle?.entryTime ? vehicle.entryTime.split('T')[1].slice(0, 5) : new Date().toTimeString().split(' ')[0].slice(0, 5));
  const [images, setImages] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toastSuccess(`Vehicle ${vehicle.vehicleNumber} entry details updated successfully!`);
    onBack();
  };

  if (!vehicle) return null;

  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%', p: { xs: 2, md: 4 } }}>
      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          Update Entry Log Details
        </Typography>
        <Box
          component="button"
          onClick={onBack}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back to List
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Vehicle Details</Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>{vehicle.vehicleNumber}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{vehicle.makeModel} • {vehicle.ownerName}</Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
              Vehicle Entry Date *
            </Typography>
            <TextField
              type="date"
              fullWidth
              required
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" fontWeight={500} color="text.secondary" sx={{ mb: 1 }}>
              Vehicle Entry Time *
            </Typography>
            <TextField
              type="time"
              fullWidth
              required
              value={entryTime}
              onChange={(e) => setEntryTime(e.target.value)}
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 3 }} />

        {/* Upload Images */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Upload Vehicle Images
        </Typography>
        <Box className={styles.imageUploadArea} sx={{ position: 'relative' }}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              opacity: 0, cursor: 'pointer'
            }}
          />
          <Upload size={32} className={styles.uploadIcon} />
          <p className={styles.uploadText}>
            {images.length > 0 ? `${images.length} files selected` : <>Drag & drop vehicle images or <span>browse</span></>}
          </p>
          <p className={styles.uploadHint}>Supports JPG, PNG up to 10MB each</p>
        </Box>

        {images.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {images.map((file, idx) => (
              <Box key={idx} sx={{ p: '4px 8px', bgcolor: 'grey.200', borderRadius: 1, fontSize: '0.75rem' }}>
                {file.name}
              </Box>
            ))}
          </Box>
        )}

        {/* Footer Actions */}
        <Box sx={{
          borderTop: '1px solid', borderColor: 'divider',
          mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2,
        }}>
          <Button variant="secondary" type="button" onClick={onBack}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={Save}>
            Save Changes
          </Button>
        </Box>
      </form>
    </Box>
  );
}
