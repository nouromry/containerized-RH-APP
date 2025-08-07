import api from './api';

export const getMyApplications = async () => {
  const { data } = await api.get('/users/applications');
  return data;
};

export const inviteCandidate = async (inviteData) => {
  const { data } = await api.post('/users/invite', inviteData);
  return data;
};

export const toggleSaveJob = async (jobId) => {
  const { data } = await api.post('/users/save-job', { jobId });
  return data;
};

export const getSavedJobs = async () => {
  const { data } = await api.get('/users/saved-jobs');
  return data;
};