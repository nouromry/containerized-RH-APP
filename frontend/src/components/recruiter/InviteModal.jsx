import React, { useState } from 'react';
import './recruiter.css'; // We'll add styles to this file

const InviteModal = ({ isOpen, onClose, candidate, job, onInvite }) => {
  const [inviteType, setInviteType] = useState('interview'); // 'interview' or 'test'
  const [interviewType, setInterviewType] = useState('online'); // 'online' or 'in-person'
  const [details, setDetails] = useState({ date: '', link: '', time: '' });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const inviteData = {
      candidateId: candidate.applicant._id,
      jobId: job._id,
      inviteType,
      details: {
        ...details,
        interviewType: interviewType,
      }
    };
    onInvite(inviteData);
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Invite {candidate.applicant.name}</h2>
        <p>For the position: <strong>{job.title}</strong></p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Invitation Type</label>
            <div className="radio-group">
              <label><input type="radio" value="interview" checked={inviteType === 'interview'} onChange={() => setInviteType('interview')} /> Interview</label>
              <label><input type="radio" value="test" checked={inviteType === 'test'} onChange={() => setInviteType('test')} /> Technical Test</label>
            </div>
          </div>

          {inviteType === 'test' && (
            <div className="form-group">
              <label>Test Deadline Date</label>
              <input type="date" value={details.date} onChange={e => setDetails({...details, date: e.target.value})} required />
            </div>
          )}

          {inviteType === 'interview' && (
            <>
              <div className="form-group">
                <label>Interview Type</label>
                <div className="radio-group">
                  <label><input type="radio" value="online" checked={interviewType === 'online'} onChange={() => setInterviewType('online')} /> Online</label>
                  <label><input type="radio" value="in-person" checked={interviewType === 'in-person'} onChange={() => setInterviewType('in-person')} /> In-Person</label>
                </div>
              </div>
              {interviewType === 'online' ? (
                <div className="form-group">
                  <label>Meeting Link (Google Meet, Zoom, etc.)</label>
                  <input type="url" placeholder="https://meet.google.com/..." value={details.link} onChange={e => setDetails({...details, link: e.target.value})} required />
                </div>
              ) : (
                <div className="form-group">
                  <label>Interview Time</label>
                  <input type="text" placeholder="e.g., August 10, 2025 at 2:00 PM" value={details.time} onChange={e => setDetails({...details, time: e.target.value})} required />
                </div>
              )}
            </>
          )}

          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="form-button">Send Invitation</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;