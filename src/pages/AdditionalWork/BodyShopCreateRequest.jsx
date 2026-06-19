import { ROUTES } from '../../config/routes';
import { AdditionalWorkRequestScreen } from './CreateRequest';

export default function BodyShopCreateRequest() {
  return (
    <Box sx={{ bgcolor: 'background.paper', minHeight: '100%', p: { xs: 2, md: 4 }, borderRadius: 3, m: { xs: 2, md: 4 } }}>

      {/* Page Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          Request Additional Work (Body Shop)
        </Typography>
        <Box
          component="button"
          onClick={() => navigate(ROUTES.BODY_SHOP_ADDITIONAL_WORK)}
          className="back-btn"
        >
          <ArrowLeft size={16} /> Back to Requests
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>

          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2, color: 'text.primary' }}>
            Work Details
          </Typography>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <RHFTextField name="vehicleNumber" label="Vehicle Number / Job Card ID *" placeholder="Enter Vehicle No" required />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField name="estimatedCost" label="Estimated Additional Cost (₹) *" placeholder="0.00" type="number" required />
            </Grid>
          </Grid>

          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <RHFTextarea name="description" label="Additional Work Description *" placeholder="Explain the extra work required..." rows={4} required />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
              <ImageIcon size={16} /> <span>You can attach photos to this request from the mobile/tablet app.</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#0F766E', fontSize: '0.875rem', bgcolor: '#F0FDF4', p: 1.5, borderRadius: 2 }}>
              <Mic size={16} /> <span><strong>Voice Notes Supported:</strong> When WhatsApp opens, you can hold the microphone icon to record and send a voice note explaining the issue to the customer.</span>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#B7791F', fontSize: '0.875rem', bgcolor: '#FEF3C7', p: 1.5, borderRadius: 2 }}>
              <AlertTriangle size={16} /> <span><strong>Important:</strong> If the customer rejects the additional work, it will be marked as REJECTED and only the original job card services will proceed.</span>
            </Box>
          </Box>

          {/* Footer Actions */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 4, pt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="secondary" type="button" onClick={() => navigate(ROUTES.BODY_SHOP_ADDITIONAL_WORK)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" leftIcon={Send} isLoading={methods.formState.isSubmitting}>
              Send WhatsApp Approval
            </Button>
          </Box>
        </form>
      </FormProvider>
    </Box>
  );
}
