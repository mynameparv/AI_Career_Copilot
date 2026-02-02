
import LocalDb from '../utils/localDb.js';

const jobDb = new LocalDb('jobs');

class Job {
    static create(jobData) {
        // Ensure default values
        if (!jobData.status) {
            jobData.status = 'Applied';
        }
        if (!jobData.dateApplied) {
            jobData.dateApplied = new Date();
        }
        return jobDb.create(jobData);
    }

    static find(query) {
        return jobDb.find(query);
    }

    static findById(id) {
        return jobDb.findById(id);
    }

    static findByIdAndUpdate(id, update) {
        return jobDb.findByIdAndUpdate(id, update);
    }

    static findByIdAndDelete(id) {
        return jobDb.findByIdAndDelete(id);
    }
}

export default Job;
