"use server";

export async function sendChatMessage(sessionId, patientId, message) {
    const maxRetries = 3;
    let lastError = null;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const backendUrl = process.env.INTERVIEW_AGENT_URL || "http://localhost:8001";
            
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
            lastError = error;
            console.warn(`Attempt ${i + 1} failed for sendChatMessage:`, error.message);
            if (i < maxRetries - 1) await new Promise(res => setTimeout(res, 2000));
        }
    }
    
    console.error("Failed to connect to Python backend after retries:", lastError);
    return { 
        success: false, 
        reply: `[Connection Error]: Could not reach the Clinical Engine. Ensure Python FastAPI is running on port 8001.`, 
        status: "error" 
    };
}

export async function fetchPatientContext(sessionId) {
    const maxRetries = 5;
    for (let i = 0; i < maxRetries; i++) {
        try {
            const backendUrl = process.env.CONTEXT_SERVICE_URL || "http://localhost:8000";
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

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
            console.warn(`Attempt ${i + 1} failed for fetchPatientContext:`, error.message);
            if (i < maxRetries - 1) await new Promise(res => setTimeout(res, 3000));
        }
    }
    console.error("Failed to fetch context after multiple retries.");
    return null;
}
