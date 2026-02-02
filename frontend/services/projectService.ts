
const API_URL = 'http://localhost:5000/api/projects';

export interface Project {
    _id?: string;
    title: string;
    description: string;
    status: string;
    progress?: number;
    roadmap?: any;
    user?: string;
    createdAt?: string;
}

const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userInfo.token}`,
    };
};

export const getProjects = async (): Promise<Project[]> => {
    const response = await fetch(API_URL, {
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch projects');
    }

    return response.json();
};

export const createProject = async (projectData: Project): Promise<Project> => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
    });

    if (!response.ok) {
        throw new Error('Failed to create project');
    }

    return response.json();
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
    });

    if (!response.ok) {
        throw new Error('Failed to update project');
    }

    return response.json();
};

export const deleteProject = async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error('Failed to delete project');
    }
};
