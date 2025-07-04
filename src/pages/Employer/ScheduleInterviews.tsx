import React, { useState } from 'react';
import { collection, addDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase';
 
const ScheduleInterview = ({ application, onClose }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !time || !location) {
      alert('Please fill in date, time, and location.');
      return;
    }
 
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');
 
      await addDoc(collection(db, 'interviews'), {
        graduateId: application.graduateId,
        jobId: application.jobId,
        employerId: user.uid,
        date: Timestamp.fromDate(new Date(`${date}T${time}`)),
        location,
        status: 'Scheduled',
        notes,
      });
 
      // Send notification
      await addDoc(collection(db, 'notifications'), {
        userId: application.graduateId,
        message: `Your interview for "${application.jobTitle}" has been scheduled on ${new Date(`${date}T${time}`).toLocaleString()}`,
        read: false,
        createdAt: serverTimestamp(),
      });
 
      setStatus('Interview scheduled successfully.');
      if (onClose) setTimeout(onClose, 1500);
    } catch (error) {
      console.error('Error scheduling interview:', error);
      setStatus('Failed to schedule interview.');
    }
  };
 
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 12, background: '#f8f8ff', padding: 16, borderRadius: 8 }}>
      <h3>Schedule Interview</h3>
      <label>
        Date:
        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
      </label>
      <br />
      <label>
        Time:
        <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
      </label>
      <br />
      <label>
        Location:
        <input type="text" value={location} onChange={e => setLocation(e.target.value)} required />
      </label>
      <br />
      <label>
        Notes:
        <textarea value={notes} onChange={e => setNotes(e.target.value)} />
      </label>
      <br />
      <button type="submit">Schedule Interview</button>
      <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>Cancel</button>
      {status && <p>{status}</p>}
    </form>
  );
};
 
export default ScheduleInterview;
 
export const ScheduleInterviews = () => <div>Schedule Interviews</div>;
 