import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Card, Checkbox, Chip, Divider, FormControlLabel, Grid, MenuItem, TextField, Typography, } from '@mui/material';
import { ArrowLeft, Car, ClipboardList, MessageCircle, Send, Wrench, } from 'lucide-react';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/shared/PageHeader';
import StatusBadge from '../../components/common/StatusBadge';
import VehicleNumberPlate from '../../components/common/VehicleNumberPlate';
import { useJobCard } from '../../queries/useDataQueries';
import { toastError, toastSuccess } from '../../notifications/toast';
import { ROUTES } from '../../config/routes';
import { formatCurrency, formatDate, formatPhone, snakeToLabel } from '../../utils/formatters';
import useMasterDataStore from '../../store/useMasterDataStore';

const TAX_RATE = 18;

const REQUEST_SOURCES = [
  { value: 'MECHANIC_IDENTIFIED', label: 'Mechanic identified' },
  { value: 'SUPERVISOR_INSPECTION', label: 'Supervisor inspection' },
  { value: 'ROAD_TEST', label: 'Road test' },
  { value: 'CUSTOMER_APPROVED_CALLBACK', label: 'Customer callback' },
];

function normalizePayload(payload) {
  return payload?.data?.data || payload?.data || payload || null;
}

function serviceRows(jobCard) {
  const services = jobCard?.jobCardServices || jobCard?.services || [];

  if (!Array.isArray(services)) return [];

  return services.map((service, index) => {
    if (typeof service === 'string') {
      const subtotal = Number(jobCard?.estimatedCost || 0) / (1 + TAX_RATE / 100) / Math.max(services.length, 1);
      return {
        id: `${service}-${index}`,
        name: service,
        category: jobCard?.serviceType ? snakeToLabel(jobCard.serviceType) : 'Mechanical',
        qty: 1,
        price: Math.round(subtotal),
        status: index === 0 ? 'In Progress' : 'Approved',
      };
    }

    return {
      id: service.id || index,
      name: service.serviceName || service.name || service.description || 'Service item',
      category: service.categoryName || service.category || 'Mechanical',
      qty: service.quantity || 1,
      price: Number(service.priceSnapshot || service.price || service.amount || 0),
      status: service.approvalStatus || service.status || 'Approved',
    };
  });
}

function InfoItem({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ color: '#0F172A', fontWeight: 700, mt: 0.5 }}>
        {value || '-'}
      </Typography>
    </Box>
  );
}

function SectionCard({ icon: Icon, title, children, action }) {
  return (
    <Card sx={{ borderRadius: 0, border: '1px solid #E2E8F0', boxShadow: 'none' }}>
      <Box sx={{ p: 2.25, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Icon size={18} color="#0F766E" />
          <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
            {title}
          </Typography>
        </Box>
        {action}
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Card>
  );
}

function FieldLabel({ children, required = false }) {
  return (
    <Typography variant="body2" sx={{ mb: 1, color: '#1E293B', fontWeight: 800 }}>
      {children} {required && <Typography component="span" sx={{ color: '#E11D48', fontWeight: 900 }}>*</Typography>}
    </Typography>
  );
}

export function AdditionalWorkRequestScreen({
  domainLabel = 'Additional Work',
  defaultCategory = 'Mechanical',
  listRoute = ROUTES.FLOOR_ADDITIONAL_WORK,
  backRoute = ROUTES.JOB_CARDS,
  emptyMessage = 'Open a job card from the Job Cards action menu to create additional work against that vehicle.',
  subtitle = 'Review the vehicle, current job card, then send one approval batch for the extra work.',
  successMessage = 'Additional work approval request prepared for WhatsApp.',
  serviceSectionTitle = 'Service Configuration and Master List',
  sendButtonLabel = 'Send WhatsApp Approval',
  vehicleSectionTitle = 'Vehicle and Customer Details',
  currentItemsTitle = 'Current Job Card Items',
  assigneeLabel = 'Mechanic',
  additionalBillLabel = 'Additional Work',
  requestSources = REQUEST_SOURCES,
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const jobCardId = searchParams.get('jobCardId');
  const { data: jobCardPayload, isLoading } = useJobCard(jobCardId);
  const jobCardRaw = normalizePayload(jobCardPayload);
  const jobCard = jobCardRaw || {
    id: jobCardId || 'Unknown',
    ownerName: 'Unknown Customer',
    ownerMobile: '',
    vehicleNumber: 'Not captured',
    status: 'PENDING',
    services: []
  };

  const { masterServices, serviceCategories } = useMasterDataStore();

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [priority, setPriority] = useState('NORMAL');
  const [expectedDelivery, setExpectedDelivery] = useState('');
  const [requestSource, setRequestSource] = useState(requestSources[0]?.value || 'MECHANIC_IDENTIFIED');
  const [notes, setNotes] = useState('');
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState([]);
  const [isSending, setIsSending] = useState(false);

  const currentServices = useMemo(() => serviceRows(jobCard), [jobCard]);
  const availableServices = useMemo(() => {
    if (!selectedCategory || selectedCategory === 'ALL') return masterServices;
    return masterServices.filter((service) => service.category?.toLowerCase() === selectedCategory.toLowerCase());
  }, [masterServices, selectedCategory]);
  const categoryOptions = useMemo(() => {
    const categories = serviceCategories.length ? serviceCategories : [{ id: 'C1', name: defaultCategory }];
    return categories.map((category) => ({ value: category.name, label: category.name }));
  }, [defaultCategory, serviceCategories]);
  const baseSubtotal = currentServices.reduce((sum, service) => sum + Number(service.price || 0) * Number(service.qty || 1), 0);
  const additionalSubtotal = selectedAdditionalServices.reduce((sum, service) => sum + Number(service.price || 0), 0);
  const subtotal = baseSubtotal + additionalSubtotal;
  const tax = subtotal * (TAX_RATE / 100);
  const total = subtotal + tax;

  const toggleAdditionalService = (service) => {
    setSelectedAdditionalServices((current) => {
      const isSelected = current.some((item) => item.id === service.id);
      return isSelected ? current.filter((item) => item.id !== service.id) : [...current, service];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!jobCardRaw && !jobCardId) {
      toastError('Select a job card before creating additional work.');
      return;
    }

    if (!selectedAdditionalServices.length) {
      toastError('Select at least one additional work service.');
      return;
    }

    setIsSending(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSending(false);
    toastSuccess(successMessage);
    navigate(listRoute);
  };

  if (!jobCardId) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <PageHeader
          title={`Request ${domainLabel}`}
          breadcrumbs={[{ label: domainLabel, path: listRoute }, { label: 'New Request' }]}
        />
        <Alert severity="info" sx={{ mt: 2, borderRadius: 0 }}>
          {emptyMessage}
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <Loader fullPage text="Loading job card details..." />;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F4F6F9', minHeight: '100%' }}>
      <PageHeader
        title={`${domainLabel} / ${jobCard.id}`}
        subtitle={subtitle}
        breadcrumbs={[{ label: domainLabel, path: listRoute }, { label: jobCard.id }]}
        actions={
          <Button variant="back" leftIcon={ArrowLeft} onClick={() => navigate(backRoute)}>
            Back to Job Cards
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <SectionCard icon={Car} title={vehicleSectionTitle}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#2563EB', color: '#FFF', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                      {(jobCard.ownerName || 'C').slice(0, 1)}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 800, color: '#0F172A' }}>{jobCard.ownerName}</Typography>
                      <Typography variant="body2" sx={{ color: '#64748B' }}>{formatPhone(jobCard.ownerMobile || jobCard.mobile)}</Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <VehicleNumberPlate vehicleNumber={jobCard.vehicleNumber} />
                </Grid>
                <Grid item xs={6} md={3}>
                  <InfoItem label="Job Card" value={jobCard.id} />
                </Grid>
                <Grid item xs={6} md={3}>
                  <InfoItem label="Status" value={snakeToLabel(jobCard.status)} />
                </Grid>
                <Grid item xs={6} md={3}>
                  <InfoItem label={assigneeLabel} value={jobCard.technician || 'Unassigned'} />
                </Grid>
                <Grid item xs={6} md={3}>
                  <InfoItem label="Created" value={formatDate(jobCard.createdAt)} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem label="Make / Model" value={jobCard.makeModel || jobCard.vehicleInfo || 'Not captured'} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <InfoItem label="Service Category" value={snakeToLabel(jobCard.serviceType)} />
                </Grid>
              </Grid>
            </SectionCard>

            <SectionCard icon={ClipboardList} title={currentItemsTitle}>
              <Box sx={{ overflowX: 'auto' }}>
                <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
                  <Box component="thead">
                    <Box component="tr" sx={{ bgcolor: '#F8FAFC' }}>
                      {['#', 'Service Item', 'Category', 'Price', 'Qty', 'Status'].map((heading) => (
                        <Box component="th" key={heading} sx={{ p: 1.5, color: '#64748B', fontSize: '0.75rem', textAlign: heading === 'Price' ? 'right' : 'left' }}>
                          {heading}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box component="tbody">
                    {currentServices.map((service, index) => (
                      <Box component="tr" key={service.id} sx={{ borderBottom: '1px solid #E2E8F0' }}>
                        <Box component="td" sx={{ p: 1.5 }}>{String(index + 1).padStart(2, '0')}</Box>
                        <Box component="td" sx={{ p: 1.5, fontWeight: 700 }}>{service.name}</Box>
                        <Box component="td" sx={{ p: 1.5 }}>
                          <Chip label={service.category} size="small" sx={{ bgcolor: '#EFF6FF', color: '#2563EB', fontWeight: 700 }} />
                        </Box>
                        <Box component="td" sx={{ p: 1.5, textAlign: 'right', fontWeight: 700 }}>{formatCurrency(service.price)}</Box>
                        <Box component="td" sx={{ p: 1.5 }}>x{service.qty}</Box>
                        <Box component="td" sx={{ p: 1.5 }}><StatusBadge status={service.status} /></Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            </SectionCard>

            <SectionCard icon={Wrench} title={serviceSectionTitle}>
              <Grid container spacing={2.5} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                  <FieldLabel required>Primary Category</FieldLabel>
                  <TextField select fullWidth value={selectedCategory} onChange={(event) => { setSelectedCategory(event.target.value); setSelectedAdditionalServices([]); }}
                    required
                    sx={{ '& .MuiInputBase-root': { height: 56, bgcolor: '#FFFFFF' } }}
                  >
                    {categoryOptions.map((category) => (
                      <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldLabel>Priority</FieldLabel>
                  <TextField select fullWidth value={priority} onChange={(event) => setPriority(event.target.value)} sx={{ '& .MuiInputBase-root': { height: 56, bgcolor: '#FFFFFF' } }} >
                    <MenuItem value="LOW">Low</MenuItem>
                    <MenuItem value="NORMAL">Normal</MenuItem>
                    <MenuItem value="HIGH">High</MenuItem>
                    <MenuItem value="URGENT">Urgent</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FieldLabel required>Expected Delivery</FieldLabel>
                  <TextField fullWidth type="datetime-local" value={expectedDelivery} onChange={(event) => setExpectedDelivery(event.target.value)} required sx={{ '& .MuiInputBase-root': { height: 56, bgcolor: '#FFFFFF' } }} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldLabel>Request Source</FieldLabel>
                  <TextField select fullWidth value={requestSource} onChange={(event) => setRequestSource(event.target.value)} sx={{ '& .MuiInputBase-root': { height: 56, bgcolor: '#FFFFFF' } }} >
                    {requestSources.map((source) => (
                      <MenuItem key={source.value} value={source.value}>{source.label}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FieldLabel>Internal Supervisor Notes</FieldLabel>
                  <TextField fullWidth placeholder="Add notes for internal tracking" value={notes} onChange={(event) => setNotes(event.target.value)} sx={{ '& .MuiInputBase-root': { height: 56, bgcolor: '#FFFFFF' } }} />
                </Grid>
              </Grid>

              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2, color: '#334155', textTransform: 'uppercase' }}>
                Available Services
              </Typography>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                {availableServices.map((service) => {
                  const isSelected = selectedAdditionalServices.some((item) => item.id === service.id);
                  return (
                    <Box
                      key={service.id}
                      onClick={() => toggleAdditionalService(service)}
                      sx={{ p: 2, minHeight: 66, borderRadius: 2, border: '1px solid', borderColor: isSelected ? '#0F766E' : '#E2E8F0', bgcolor: isSelected ? '#ECFDF5' : '#FFFFFF', cursor: 'pointer', transition: 'border-color 0.2s, background-color 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, }}
                    >
                      <FormControlLabel
                        onClick={(event) => event.stopPropagation()}
                        control={
                          <Checkbox checked={isSelected} onChange={() => toggleAdditionalService(service)} sx={{ color: '#0F172A', '&.Mui-checked': { color: '#0F766E' } }} />
                        }
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                            <Typography variant="body2" fontWeight={800} sx={{ color: '#0F172A' }}>
                              {service.name}
                            </Typography>
                            <Chip label={service.category} size="small" sx={{ height: 22, fontSize: '0.68rem', bgcolor: '#F1F5F9', color: '#0F172A', fontWeight: 700 }} />
                          </Box>
                        }
                        sx={{ m: 0, flex: 1 }}
                      />
                      <Typography variant="body2" fontWeight={900} sx={{ color: '#0F172A', whiteSpace: 'nowrap' }}>
                        {formatCurrency(service.price)}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </SectionCard>
          </Box>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: { lg: 'sticky' }, top: 88 }}>
            <SectionCard icon={MessageCircle} title="Approval Preview">
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography sx={{ fontWeight: 800 }}>Bill Preview</Typography>
                <Chip label="Pending send" size="small" sx={{ bgcolor: '#FEF3C7', color: '#B45309', fontWeight: 800 }} />
              </Box>

              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, maxHeight: { xs: 420, lg: 'calc(100vh - 300px)' }, minHeight: 180, overflowY: 'auto', pr: 1, mr: -1, scrollbarWidth: 'thin', scrollbarColor: '#CBD5E1 transparent', '&::-webkit-scrollbar': { width: 6 }, '&::-webkit-scrollbar-thumb': { bgcolor: '#CBD5E1', borderRadius: 8 }, '&::-webkit-scrollbar-track': { bgcolor: 'transparent' }, }}
              >
                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 900, textTransform: 'uppercase' }}>
                  Previous Job Card Bill
                </Typography>
                {currentServices.length ? (
                  currentServices.map((service) => (
                    <Box key={service.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: '#334155' }}>
                        {service.name} <Typography component="span" variant="caption" color="text.secondary">x{service.qty}</Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{formatCurrency(Number(service.price || 0) * Number(service.qty || 1))}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                    No previous services found for this job card.
                  </Typography>
                )}

                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />

                <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 900, textTransform: 'uppercase' }}>
                  {additionalBillLabel}
                </Typography>
                {selectedAdditionalServices.length ? (
                  selectedAdditionalServices.map((service) => (
                    <Box key={service.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Typography variant="body2" sx={{ color: '#334155' }}>
                        {service.name} <Typography component="span" variant="caption" color="text.secondary">x1</Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800 }}>{formatCurrency(service.price)}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography variant="body2" sx={{ color: '#64748B', fontStyle: 'italic' }}>
                    Select additional services to add them here.
                  </Typography>
                )}

                <Divider sx={{ borderStyle: 'dashed', my: 1 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Previous Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(baseSubtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">{additionalBillLabel}</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(additionalSubtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Tax ({TAX_RATE}%)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(tax)}</Typography>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontWeight: 900 }}>Approval Total</Typography>
                  <Typography sx={{ fontWeight: 900, color: '#0F766E' }}>{formatCurrency(total)}</Typography>
                </Box>
              </Box>
              <Button fullWidth type="submit" variant="primary" leftIcon={Send} isLoading={isSending} sx={{ mt: 2.5 }}>
                {sendButtonLabel}
              </Button>
            </SectionCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function CreateRequest() {
  return <AdditionalWorkRequestScreen />;
}
