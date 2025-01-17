import React, { useEffect, useState } from 'react';
import styles from '../Announcement/AnnouncementsPage.module.css';
import { Link } from "react-router-dom";
import { format } from 'date-fns';

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/announcements')
      .then((res) => res.json())
      .then((data) => {
        console.log('Announcements fetched:', data); // Log fetched data
        setAnnouncements(data || []);
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
        setAnnouncements([]);
      });
  }, []);

  return (
    <div className={styles.announcements_page}>
      <Link to="/"><div className={styles.back_button}> 
        <span>&larr;</span>
      </div></Link>
      <h1 className={styles.announcements_title}>Announcements</h1>
      <div className={styles.announcements_list}>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
          <div key={announcement.id} className={styles.announcement_card}>
            {announcement.author && (
              <p className={styles.announcement_author}>{announcement.author}</p>
            )}
            <p className={styles.announcement_content}>{announcement.content}</p>
            <p>{format(new Date(announcement.date), 'MMMM d, yyyy @ h:mm a')}</p>
          </div>
                 ))
                ) : (
                  <p>No announcements available.</p>
                )}
      </div>
    </div>
  );
};

export default AnnouncementsPage;
