"use server";

export async function sendChatMessage(sessionId, patientId, message) {
    const maxRetries = 2;
    let lastError = null;
    
    for (let i = 0; i < maxRetries; i++) {
        try {
            const backendUrl = process.env.INTERVIEW_AGENT_URL || "http://localhost:8001";
            const internalKey = process.env.INTERNAL_API_KEY || "default_internal_secret_key";
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            
            const response = await fetch(`${backendUrl}/chat/${sessionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': internalKey,
                },
                body: JSON.stringify({ patient_id: patientId, message }),
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) {
                const errorBody = await response.text().catch(() => '');
                console.error("API Error:", response.status, errorBody);
                
                // Parse detail message for better user-facing errors
                try {
                    const errJson = JSON.parse(errorBody);
                    if (errJson.detail?.includes('invalid_api_key') || errJson.detail?.includes('Invalid API Key')) {
                        return {
                            success: false,
                            reply: "I'm unable to process your request right now — the AI service API key needs to be updated. Please contact your administrator.",
                            status: "config_error"
                        };
                    }
                } catch (_) {}
                
                throw new Error(`API returned ${response.status}: ${errorBody.substring(0, 200)}`);
            }
            
            const data = await response.json();
            return { success: true, ...data };
        } catch (error) {
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    reply: "The AI is taking longer than expected. Please try again.",
                    status: "timeout"
                };
            }
            lastError = error;
            console.warn(`Attempt ${i + 1} failed for sendChatMessage:`, error.message);
            if (i < maxRetries - 1) await new Promise(res => setTimeout(res, 1500));
        }
    }
    
    console.error("Failed to connect to backend:", lastError?.message);
    return { 
        success: false, 
        reply: "Unable to connect to the clinical AI engine. Please check that all services are running and try again.",
        status: "error" 
    };
}

export async function fetchPatientContext(sessionId) {
    try {
        const backendUrl = process.env.CONTEXT_SERVICE_URL || "http://localhost:8000";
        const internalKey = process.env.INTERNAL_API_KEY || "default_internal_secret_key";
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${backendUrl}/context/${sessionId}`, {
            cache: 'no-store',
            headers: { 'X-API-Key': internalKey },
            signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) return null;
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.warn("fetchPatientContext failed:", error.message);
        return null;
    }
}

export async function fetchHealthStatus() {
    try {
        const backendUrl = process.env.CONTEXT_SERVICE_URL || "http://localhost:8000";
        const res = await fetch(`${backendUrl}/health`, { cache: 'no-store' });
        if (!res.ok) return { status: 'degraded' };
        return await res.json();
    } catch {
        return { status: 'offline' };
    }
}
