import React, { useState } from 'react';
import RescheduleModal from './RescheduleModal';
import styles from './StatusAndScheduling.module.css'
import Header from '../Header/Header';

function StatusAndScheduling() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: 'Submission of Necessary Credentials',
      completed: true
    },
    {
      number: 2,
      title: 'Advising and Face-to-Face Submission of Requirements',
      completed: true
    },
    {
      number: 3,
      title: 'Schedule for Enrollment',
      completed: true
    },
    {
      number: 4,
      title: 'Face-to-Face Enrollment',
      completed: true,
      current: true
    },
    {
      number: 5,
      title: 'Fully Enrolled',
      completed: false
    }
  ];

  return (
    <main className={styles.content}>      
    <div>
      <Header />
    </div>
    
      <div className={styles.page_title}>
        <h1>Status and Scheduling</h1>
      </div>
      
      <section className={styles.status_section}>
        <h2 className={styles.section_title}>Enrollment Status</h2>
        <div className={styles.progress_tracker}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.progress_step}>
              <div className={styles.step_number}>
                {step.number}
              </div>
              <div className={styles.step_title}>{step.title}</div>
              {step.current && <div className={styles.current_step}>Step 2</div>}
              {index < steps.length - 1 && <div className={styles.step_line} />}
            </div>
          ))}
        </div>
      </section>

      <section className={styles.status_section}>
        <h2 className={styles.section_title}>Enrollment Date</h2>
        <div className={styles.enrollment_date_container}>
          <div className={styles.enrollment_date_content}>
            <h3 className={styles.enrollment_date}>September 20, 2024</h3>
            <button 
              className={styles.appeal_button}
              onClick={() => setIsModalOpen(true)}
            >
              Appeal for Reschedule
            </button>
          </div>
            <div className={styles.feedback_header}>
              <h4>Rescheduling Feedback</h4>
              <p className={styles.feedback_name}>Princess Mae Binalagbag</p>
              <span className={styles.approval_status}>APPROVED</span>
            </div>
        </div>
      </section>

      <RescheduleModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </main>
  );
};

export default StatusAndScheduling;