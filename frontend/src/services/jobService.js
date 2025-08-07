import api from './api';

export const getJobs = async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/jobs?${params.toString()}`);
    return response.data;
};

export const getJobById = async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
};

export const postJob = async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
};

export const applyToJob = async (jobId, formData) => {
    const response = await api.post(`/jobs/${jobId}/apply`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getJobCandidates = async (jobId) => {
    const response = await api.get(`/jobs/${jobId}/candidates`);
    return response.data;
};

export const getRecruiterJobs = async () => {
    const response = await api.get('/jobs/my-jobs');
    return response.data;
};