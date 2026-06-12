import { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Car, Clock, Wrench, CheckCircle2, Volume2, Maximize } from 'lucide-react';
import styles from './Kiosk.module.css';
import { formatDateTime } from '../../utils/formatters';

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

function DisplaySection({ title, icon: Icon, items, color, bg }) {
  return (
    <div className={styles.section} style={{ '--section-color': color, '--section-bg': bg }}>
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

        {/* Announcement Ticker */}
        <div className={styles.tickerWrapper}>
          <Volume2 size={18} className={styles.tickerIcon} />
          <div className={styles.tickerText}>
            <span>Welcome to DVSOS Service Center • Please wait in the lounge while your vehicle is serviced • Vehicle TN 02 CD 5566 is ready for delivery • Please collect your gate pass at the billing counter</span>
          </div>
        </div>

        <div className={styles.clockControls}>
          <div className={styles.clock}>
            <span className={styles.timeStr}>{formatDateTime(time).split(' ')[1]}</span>
            <span className={styles.dateStr}>{formatDateTime(time).split(' ')[0]}</span>
          </div>
          <button className={styles.fsBtn} onClick={toggleFullscreen} title="Toggle Fullscreen">
            <Maximize size={20} />
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className={styles.grid}>
        <Row className="g-4 h-100">
          <Col lg={3} className="h-100">
            <DisplaySection title="Mechanical" icon={Wrench} items={MOCK_LIVE_DATA.mechanical} color="#3B82F6" bg="rgba(59, 130, 246, 0.1)" />
          </Col>
          <Col lg={3} className="h-100">
            <DisplaySection title="Body Shop" icon={Wrench} items={MOCK_LIVE_DATA.bodyShop} color="#F59E0B" bg="rgba(245, 158, 11, 0.1)" />
          </Col>
          <Col lg={3} className="h-100">
            <DisplaySection title="Water Wash" icon={Wrench} items={MOCK_LIVE_DATA.waterWash} color="#06B6D4" bg="rgba(6, 182, 212, 0.1)" />
          </Col>
          <Col lg={3} className="h-100">
            <div className={styles.section} style={{ '--section-color': '#10B981', '--section-bg': 'rgba(16, 185, 129, 0.1)' }}>
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
                      <span className={styles.readyBadge}>READY</span>
                      <span className={styles.time}>Since {item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}
