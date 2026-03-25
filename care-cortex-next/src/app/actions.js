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
            reply: `[Connection Error]: Could not reach the Clinical Engine. Ensure Python FastAPI is running.`, 
            status: "error" 
        };
    }
}

export async function fetchPatientContext(sessionId) {
    try {
        const backendUrl = process.env.CONTEXT_SERVICE_URL || "http://localhost:8000";
        
        // Timeout aggressively at 2 seconds so the Next.js page doesn't hang in the browser
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${backendUrl}/context/${sessionId}`, {
            cache: 'no-store',
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            return null; // Return null if session doesn't exist yet
        }
        
        const data = await response.json();
        return data; // Returns List[ContextResponse]
    } catch (error) {
        console.error("Failed to fetch context:", error);
        return null;
    }
}
