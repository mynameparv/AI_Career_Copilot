const API_URL = 'http://localhost:5000/api/jobs';

export interface JobApplication {
    _id?: string;
    companyName: string;
    role: string;
    appliedAt: string;
    interviewDate?: string;
    status: 'Applied' | 'Interviewing' | 'Selected' | 'Rejected' | 'Offer Received' | 'Withdrawn';
    packageOffer?: string;
    description?: string;
    aiAdvice?: string;
}

const getHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`,
    };
};

export const getApplications = async (): Promise<JobApplication[]> => {
    const response = await fetch(API_URL, {
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
};

export const addApplication = async (app: JobApplication): Promise<JobApplication> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(app),
    });
    if (!response.ok) throw new Error('Failed to add application');
    return response.json();
};

export const updateApplication = async (id: string, app: Partial<JobApplication>): Promise<JobApplication> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(app),
    });
    if (!response.ok) throw new Error('Failed to update application');
    return response.json();
};

export const deleteApplication = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete application');
};
