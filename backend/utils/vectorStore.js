import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VECTOR_DIR = path.join(__dirname, '../data');

// Ensure vector directory exists
if (!fs.existsSync(VECTOR_DIR)) {
    fs.mkdirSync(VECTOR_DIR, { recursive: true });
}

/**
 * Simple FAISS-like Vector Store using cosine similarity
 * This is a lightweight alternative to FAISS for Node.js environments
 */
class VectorStore {
    constructor(storeName = 'vectors') {
        this.storeName = storeName;
        this.filePath = path.join(VECTOR_DIR, `${storeName}.json`);
        this.vectors = [];
        this.load();
    }

    load() {
        if (fs.existsSync(this.filePath)) {
            try {
                const fileContent = fs.readFileSync(this.filePath, 'utf-8');
                this.vectors = JSON.parse(fileContent);
            } catch (error) {
                console.error(`Error loading vectors for ${this.storeName}:`, error);
                this.vectors = [];
            }
        } else {
            this.vectors = [];
            this.save();
        }
    }

    save() {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.vectors, null, 2));
        } catch (error) {
            console.error(`Error saving vectors for ${this.storeName}:`, error);
        }
    }

    /**
     * Add a vector with metadata
     * @param {Array} vector - The vector array (e.g., embeddings)
     * @param {Object} metadata - Additional metadata to store with the vector
     * @returns {String} - The ID of the stored vector
     */
    addVector(vector, metadata = {}) {
        const id = `vec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.vectors.push({ id, vector, metadata, createdAt: new Date() });
        this.save();
        return id;
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    cosineSimilarity(vecA, vecB) {
        if (vecA.length !== vecB.length) {
            throw new Error('Vectors must have the same dimensions');
        }

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i];
            normA += vecA[i] * vecA[i];
            normB += vecB[i] * vecB[i];
        }

        normA = Math.sqrt(normA);
        normB = Math.sqrt(normB);

        if (normA === 0 || normB === 0) {
            return 0;
        }

        return dotProduct / (normA * normB);
    }

    /**
     * Search for similar vectors
     * @param {Array} queryVector - The query vector
     * @param {Number} k - Number of nearest neighbors to return (default: 5)
     * @returns {Array} - Array of {id, similarity, metadata} objects
     */
    search(queryVector, k = 5) {
        const similarities = this.vectors.map(item => ({
            id: item.id,
            similarity: this.cosineSimilarity(queryVector, item.vector),
            metadata: item.metadata
        }));

        // Sort by similarity (descending)
        similarities.sort((a, b) => b.similarity - a.similarity);

        // Return top k results
        return similarities.slice(0, k);
    }

    /**
     * Get vector by ID
     */
    getById(id) {
        return this.vectors.find(item => item.id === id);
    }

    /**
     * Delete vector by ID
     */
    deleteById(id) {
        const index = this.vectors.findIndex(item => item.id === id);
        if (index !== -1) {
            const deleted = this.vectors[index];
            this.vectors.splice(index, 1);
            this.save();
            return deleted;
        }
        return null;
    }

    /**
     * Clear all vectors
     */
    clear() {
        this.vectors = [];
        this.save();
    }

    /**
     * Get total number of vectors
     */
    count() {
        return this.vectors.length;
    }
}

export default VectorStore;
