import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '../data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

class LocalDb {
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.filePath = path.join(DATA_DIR, `${collectionName}.json`);
        this.data = [];
        this.load();
    }

    load() {
        if (fs.existsSync(this.filePath)) {
            try {
                const fileContent = fs.readFileSync(this.filePath, 'utf-8');
                this.data = JSON.parse(fileContent);
            } catch (error) {
                console.error(`Error loading data for ${this.collectionName}:`, error);
                this.data = [];
            }
        } else {
            this.data = [];
            this.save();
        }
    }

    save() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2));
        } catch (error) {
            console.error(`Error saving data for ${this.collectionName}:`, error);
        }
    }

    create(item) {
        const newItem = { _id: uuidv4(), ...item, createdAt: new Date(), updatedAt: new Date() };
        this.data.push(newItem);
        this.save();
        return newItem;
    }

    find(query = {}) {
        return this.data.filter(item => {
            for (let key in query) {
                if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    findOne(query = {}) {
        return this.data.find(item => {
            for (let key in query) {
                if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    findById(id) {
        return this.data.find(item => item._id === id);
    }

    findByIdAndUpdate(id, update) {
        const index = this.data.findIndex(item => item._id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...update, updatedAt: new Date() };
            this.save();
            return this.data[index];
        }
        return null;
    }

    findByIdAndDelete(id) {
        const index = this.data.findIndex(item => item._id === id);
        if (index !== -1) {
            const deletedItem = this.data[index];
            this.data.splice(index, 1);
            this.save();
            return deletedItem;
        }
        return null;
    }
}

export default LocalDb;
