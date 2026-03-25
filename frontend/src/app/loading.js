import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#0b1326] flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-[#4edea3]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#4edea3] rounded-full border-t-transparent animate-spin"></div>
                <span className="material-symbols-outlined text-[#4edea3] text-4xl animate-pulse">medical_services</span>
            </div>
            <h2 className="mt-8 text-[#4edea3] font-bold uppercase tracking-[0.2em] text-sm animate-pulse">Syncing Neural Context...</h2>
        </div>
    );
}
