import React, { createContext, useContext, useState, type ReactNode } from 'react';
// import { mockJobs as initialJobs, mockApplications as initialApplications } from '../mock/mockData';

// Types adapted from Jobs.tsx and JobDetails.tsx
export interface Job {
    id: string;
    title: string;
    department: string;
    location: string;
    status: string;
    description: string | null;
    experience_required?: number;
    min_salary?: number | null;
    max_salary?: number | null;
    created_at: string;
    requirements?: string[];
    employment_type?: string;
}

export interface Candidate {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    years_of_experience: number;
    education: string | null;
    skills: string[] | null;
    gap_summary?: string;
    matched_skills?: string;
    missing_skills?: string;
}

export interface Application {
    id: string;
    jobId: string;
    status: string;
    match_score: number;
    applied_at: string;
    candidate: Candidate;
    timeline?: any[];
}

interface JobContextType {
    jobs: Job[];
    applications: Application[];
    addJob: (job: Omit<Job, 'id' | 'created_at'>) => void;
    deleteJob: (jobId: string) => void;
    addApplication: (application: Application) => void;
    updateApplicationStatus: (applicationId: string, status: string) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: ReactNode }) {
    // Initialize with empty arrays as per user request
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);

    const addJob = (newJobData: Omit<Job, 'id' | 'created_at'>) => {
        const newJob: Job = {
            ...newJobData,
            id: `job-${Date.now()}`,
            created_at: new Date().toISOString(),
        };
        setJobs((prev) => [newJob, ...prev]);
    };

    const deleteJob = (jobId: string) => {
        setJobs((prev) => prev.filter((job) => job.id !== jobId));
        // Also remove associated applications? Optional but good practice.
        setApplications((prev) => prev.filter((app) => app.jobId !== jobId));
    };

    const addApplication = (application: Application) => {
        setApplications((prev) => [application, ...prev]);
    };

    const updateApplicationStatus = (applicationId: string, status: string) => {
        setApplications((prev) =>
            prev.map((app) =>
                app.id === applicationId
                    ? { ...app, status, updated_at: new Date().toISOString() } // simplified update
                    : app
            )
        );
    };

    return (
        <JobContext.Provider
            value={{
                jobs,
                applications,
                addJob,
                deleteJob,
                addApplication,
                updateApplicationStatus,
            }}
        >
            {children}
        </JobContext.Provider>
    );
}

export function useJobContext() {
    const context = useContext(JobContext);
    if (context === undefined) {
        throw new Error('useJobContext must be used within a JobProvider');
    }
    return context;
}
