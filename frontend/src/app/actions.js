"use server";

export async function sendChatMessage(sessionId, patientId, message) {
    try {
        const backendUrl = process.env.INTERVIEW_AGENT_URL || "http://localhost:8000";
        
        const response = await fetch(`${backendUrl}/chat/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ patient_id: patientId, message })
        });
        
        if (!response.ok) {
            console.error("API Error: Backend returned", response.status);
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        return { success: true, ...data };
    } catch (error) {
        console.error("Failed to connect to Python backend:", error);
        return { 
            success: false, 
            reply: `[Connection Error]: Could not reach the Clinical Engine. Ensure Python FastAPI is running on localhost:8000.`, 
            status: "error" 
        };
    }
}

export async function fetchPatientContext(sessionId) {
    try {
        const backendUrl = process.env.CONTEXT_SERVICE_URL || "http://localhost:8001";
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${backendUrl}/context/${sessionId}`, {
            cache: 'no-store',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch context:", error);
        return null;
    }
}
