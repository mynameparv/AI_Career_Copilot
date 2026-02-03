import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// ============================================
// Custom Hook: useLocalStorage
// Syncs React state with localStorage
// ============================================
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
    // Initialize state from localStorage or use default
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // Sync to localStorage whenever state changes
    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(storedValue));
        } catch (error) {
            console.error(`Error writing to localStorage key "${key}":`, error);
        }
    }, [key, storedValue]);

    return [storedValue, setStoredValue];
}

// ============================================
// Types for Chat and ATS Data
// ============================================
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface ATSFeedback {
    id: string;
    fileName: string;
    atsScore: number;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    summary: string;
    jobDescription?: string;
    analyzedAt: number;
}

// ============================================
// Custom Hook: useChatStorage
// Manages chatbot conversation messages
// ============================================
export function useChatStorage() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo._id || 'guest';
    const storageKey = `copilot_chat_messages_${userId}`;

    const [messages, setMessages] = useLocalStorage<ChatMessage[]>(storageKey, []);

    // Add a new user message
    const addUserMessage = (content: string) => {
        const newMessage: ChatMessage = {
            id: `user_${Date.now()}`,
            role: 'user',
            content,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
    };

    // Add AI response message
    const addAIMessage = (content: string) => {
        const newMessage: ChatMessage = {
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content,
            timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
    };

    // Clear all chat messages
    const clearChat = () => {
        setMessages([]);
    };

    return {
        messages,
        addUserMessage,
        addAIMessage,
        clearChat,
    };
}

// ============================================
// Custom Hook: useATSStorage
// Manages ATS resume analysis feedback
// ============================================
export function useATSStorage() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    const userId = userInfo._id || 'guest';
    const historyKey = `copilot_ats_feedback_${userId}`;
    const currentKey = `copilot_ats_current_${userId}`;

    const [feedbackHistory, setFeedbackHistory] = useLocalStorage<ATSFeedback[]>(historyKey, []);
    const [currentFeedback, setCurrentFeedback] = useLocalStorage<ATSFeedback | null>(currentKey, null);

    // Save new ATS analysis feedback
    const saveATSFeedback = (
        fileName: string,
        analysis: {
            atsScore: number;
            strengths: string[];
            weaknesses: string[];
            suggestions: string[];
            summary: string;
        },
        jobDescription?: string
    ) => {
        const feedback: ATSFeedback = {
            id: `ats_${Date.now()}`,
            fileName,
            ...analysis,
            jobDescription,
            analyzedAt: Date.now(),
        };

        // Set as current feedback
        setCurrentFeedback(feedback);

        // Add to history (keep last 10)
        setFeedbackHistory((prev) => [feedback, ...prev].slice(0, 10));

        return feedback;
    };

    // Get a specific feedback from history
    const getFeedbackById = (id: string) => {
        return feedbackHistory.find((f) => f.id === id);
    };

    // Clear current feedback (but keep history)
    const clearCurrentFeedback = () => {
        setCurrentFeedback(null);
    };

    // Clear all ATS data
    const clearAllATSData = () => {
        setCurrentFeedback(null);
        setFeedbackHistory([]);
    };

    return {
        currentFeedback,
        feedbackHistory,
        saveATSFeedback,
        getFeedbackById,
        clearCurrentFeedback,
        clearAllATSData,
    };
}

// ============================================
// Helper: Clear All Temporary Data
// Clears both chat and ATS data from localStorage
// ============================================
export function clearAllTemporaryData() {
    localStorage.removeItem('copilot_chat_messages');
    localStorage.removeItem('copilot_ats_feedback');
    localStorage.removeItem('copilot_ats_current');
}
