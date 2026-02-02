
import LocalDb from '../utils/localDb.js';

const projectDb = new LocalDb('projects');

class Project {
    static create(projectData) {
        // Ensure default values
        if (!projectData.status) {
            projectData.status = 'Planned';
        }
        return projectDb.create(projectData);
    }

    static find(query) {
        return projectDb.find(query);
    }

    static findById(id) {
        return projectDb.findById(id);
    }

    static findByIdAndUpdate(id, update) {
        return projectDb.findByIdAndUpdate(id, update);
    }

    static findByIdAndDelete(id) {
        return projectDb.findByIdAndDelete(id);
    }
}

export default Project;
