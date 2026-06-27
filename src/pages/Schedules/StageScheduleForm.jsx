import React, { useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  MenuItem,
  Select,
  FormControl,
  OutlinedInput,
  Chip
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, FormProvider, Controller } from 'react-hook-form';

import Button from '../../components/common/Button';
import RHFTextField from '../../components/form/RHFTextField';
import RHFSelect from '../../components/form/RHFSelect';
import { ROUTES } from '../../config/routes';
import { ROLE_LABELS } from '../../constants/roles';
import { ArrowLeft } from 'lucide-react';

const STAGES = [
  { value: 'Gate Entry', label: 'Gate Entry' },
  { value: 'Mechanical Inspection', label: 'Mechanical Inspection' },
  { value: 'Body Shop Repair', label: 'Body Shop Repair' },
  { value: 'Water Wash', label: 'Water Wash' },
  { value: 'Delivery Ready', label: 'Delivery Ready' }
];

const ROLES_LIST = Object.entries(ROLE_LABELS).map(([key, value]) => ({
  value: key,
  label: value
}));

export default function StageScheduleForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const methods = useForm({
    defaultValues: {
      stageName: '',
      intervalMinutes: '',
      roles: [],
      message: ''
    }
  });

  const { handleSubmit, formState: { isSubmitting }, control, reset } = methods;

  useEffect(() => {
    if (isEdit) {
      // Dummy data for edit mode
      reset({
        stageName: 'Mechanical Inspection',
        intervalMinutes: 30,
        roles: ['MANAGER', 'FLOOR_SUPERVISOR'],
        message: 'Please complete the general inspection.'
      });
    }
  }, [isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log('Form Submitted', data);
      navigate(ROUTES.MD_STAGE_SCHEDULES);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.paper', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          {isEdit ? 'Edit Stage Alert Schedule' : 'Add Stage Alert Schedule'}
        </Typography>

        <Box
          component="button"
          onClick={() => navigate(ROUTES.MD_STAGE_SCHEDULES)}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back to List
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFSelect
                name="stageName"
                label="Stage Name"
                options={STAGES}
                placeholder="Select Stage"
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="intervalMinutes"
                label="Alert Interval Time (in minutes)"
                type="number"
                placeholder="e.g. 15"
                required
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <Controller
                name="roles"
                control={control}
                rules={{ required: 'Please select at least one role' }}
                render={({ field, fieldState: { error } }) => (
                  <FormControl fullWidth size="small" error={!!error}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155', mb: 0.75 }}>
                      Assign To Roles <span style={{ color: '#E11D48' }}>*</span>
                    </Typography>
                    <Select
                      {...field}
                      multiple
                      displayEmpty
                      input={<OutlinedInput id="select-multiple-chip" sx={{ borderRadius: '8px', bgcolor: '#FFFFFF' }} />}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <Typography color="text.secondary">Select Roles</Typography>;
                        }
                        return (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((val) => {
                              const label = ROLE_LABELS[val] || val;
                              return <Chip key={val} label={label} size="small" />;
                            })}
                          </Box>
                        );
                      }}
                    >
                      <MenuItem disabled value="">
                        <em>Select Roles</em>
                      </MenuItem>
                      {ROLES_LIST.map((role) => (
                        <MenuItem key={role.value} value={role.value}>
                          {role.label}
                        </MenuItem>
                      ))}
                    </Select>
                    {error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                        {error.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RHFTextField
                name="message"
                label="Alert Message"
                multiline
                rows={4}
                placeholder="Enter alert message or instructions..."
                required
              />
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate(ROUTES.MD_STAGE_SCHEDULES)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </Box>

        </form>
      </FormProvider>
    </Box>
  );
}
