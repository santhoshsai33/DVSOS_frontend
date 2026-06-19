import { useState, useEffect } from 'react';
import { Grid } from '@mui/material';
import { Car, Clock, Wrench, CheckCircle2, LogOut, Maximize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Kiosk.module.css';
import { ROUTES } from '../../config/routes';
import { ROLES } from '../../constants/roles';
import useAuthStore from '../../store/useAuthStore';

// Mock data simulating live updates
const MOCK_LIVE_DATA = {
  mechanical: [
    { id: 'JC-1042', vehicle: 'TN 01 AB 1234', model: 'Hyundai i20', status: 'IN_PROGRESS', waitTime: '45 mins' },
    { id: 'JC-1045', vehicle: 'KA 05 XY 9876', model: 'Maruti Swift', status: 'IN_PROGRESS', waitTime: '1 hr 10 min' },
    { id: 'JC-1047', vehicle: 'AP 16 ZZ 7700', model: 'Tata Nexon', status: 'IN_PROGRESS', waitTime: '20 mins' },
  ],
  bodyShop: [
    { id: 'JC-1038', vehicle: 'MH 12 PQ 4567', model: 'Honda City', status: 'IN_PROGRESS', waitTime: '2 hrs' },
    { id: 'JC-1041', vehicle: 'TN 09 LM 8899', model: 'Mahindra XUV', status: 'IN_PROGRESS', waitTime: '3.5 hrs' },
  ],
  waterWash: [
    { id: 'JC-1050', vehicle: 'DL 04 RS 3344', model: 'Toyota Fortuner', status: 'IN_PROGRESS', waitTime: '15 mins' },
    { id: 'JC-1052', vehicle: 'TN 11 GG 2211', model: 'Honda Jazz', status: 'IN_PROGRESS', waitTime: '5 mins' },
  ],
  ready: [
    { id: 'JC-1033', vehicle: 'TN 02 CD 5566', model: 'Hyundai Creta', status: 'READY', time: '10:15 AM' },
    { id: 'JC-1035', vehicle: 'KL 10 EE 4433', model: 'Maruti Baleno', status: 'READY', time: '11:30 AM' },
  ],
};

const roleHome = {
  [ROLES.GATE_SECURITY]: ROUTES.GATE_DASHBOARD,
  [ROLES.CRM_TEAM]: ROUTES.CRM_DASHBOARD,
  [ROLES.FLOOR_SUPERVISOR]: ROUTES.FLOOR_DASHBOARD,
  [ROLES.BODY_SHOP_SUPERVISOR]: ROUTES.BODY_SHOP_QUEUE,
  [ROLES.WATER_WASH_TEAM]: ROUTES.WATER_WASH_DASHBOARD,
  [ROLES.MANAGER]: ROUTES.MANAGER_DASHBOARD,
  [ROLES.MD]: ROUTES.MD_DASHBOARD,
  [ROLES.SUPER_ADMIN]: ROUTES.ADMIN_DASHBOARD,
};

function DisplaySection({ title, icon: Icon, items, statusClass }) {
  return (
    <div className={`${styles.section} ${statusClass}`}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>
          <Icon size={24} /> {title}
        </div>
        <span className={styles.countBadge}>{items.length}</span>
      </div>
      <div className={styles.list}>
        {items.map((item, i) => (
          <div key={i} className={styles.listItem}>
            <div className={styles.itemMain}>
              <span className={styles.vehicleNo}>{item.vehicle}</span>
              <span className={styles.modelName}>{item.model}</span>
            </div>
            <div className={styles.itemMeta}>
              <span className={styles.jobId}>{item.id}</span>
              <span className={styles.time}><Clock size={14} /> {item.waitTime || item.time}</span>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className={styles.empty}>No vehicles in queue</div>}
      </div>
    </div>
  );
}

export default function KioskDisplay() {
  const navigate = useNavigate();
  const { role, isAuthenticated } = useAuthStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const exitKiosk = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    navigate(isAuthenticated ? roleHome[role] || ROUTES.MANAGER_DASHBOARD : ROUTES.LOGIN);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.logo}><Car size={28} /></div>
          <div>
            <h1 className={styles.brandName}>DVSOS Live Status</h1>
            <p className={styles.brandSub}>Vehicle Service Operations Center</p>
          </div>
        </div>

        <div className={styles.controlsGroup}>
          <div className={styles.clockRight}>
            <div className={styles.clockDate}>{time.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            <div className={styles.clockTime}>{time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</div>
          </div>
          <button className={styles.fsBtn} onClick={toggleFullscreen} title="Toggle Fullscreen">
            <Maximize size={22} />
          </button>
          <button className={styles.exitBtn} onClick={exitKiosk} title="Exit Kiosk">
            <LogOut size={20} />
            <span>Exit</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className={styles.grid}>
        <Grid container spacing={3} sx={{ height: '100%' }}>
          <Grid item xs={12} lg={3} sx={{ height: '100%' }}>
            <DisplaySection title="Mechanical" icon={Wrench} items={MOCK_LIVE_DATA.mechanical} statusClass={styles.mechSection} />
          </Grid>
          <Grid item xs={12} lg={3} sx={{ height: '100%' }}>
            <DisplaySection title="Body Shop" icon={Wrench} items={MOCK_LIVE_DATA.bodyShop} statusClass={styles.bodySection} />
          </Grid>
          <Grid item xs={12} lg={3} sx={{ height: '100%' }}>
            <DisplaySection title="Water Wash" icon={Wrench} items={MOCK_LIVE_DATA.waterWash} statusClass={styles.washSection} />
          </Grid>
          <Grid item xs={12} lg={3} sx={{ height: '100%' }}>
            <div className={`${styles.section} ${styles.readySection}`}>
              <div className={styles.sectionHeader}>
                <div className={styles.sectionTitle}><CheckCircle2 size={24} /> Ready for Delivery</div>
              </div>
              <div className={styles.list}>
                {MOCK_LIVE_DATA.ready.map((item, i) => (
                  <div key={i} className={[styles.listItem, styles.readyItem].join(' ')}>
                    <div className={styles.itemMain}>
                      <span className={styles.vehicleNo}>{item.vehicle}</span>
                      <span className={styles.modelName}>{item.model}</span>
                    </div>
                    <div className={styles.itemMeta}>
                      <span className={styles.jobId}>{item.id}</span>
                      <span className={styles.time}>Since {item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
