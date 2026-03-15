"""
NeuralMedic — Patient Portal
Conversational AI interview interface with file upload and analysis submission.
"""

import streamlit as st
import httpx
import os
import uuid
import json
import time

# ─── Config ───────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="NeuralMedic — Patient Portal",
    page_icon="🩺",
    layout="wide",
)

INTERVIEW_AGENT_URL = os.getenv("INTERVIEW_AGENT_URL", "http://interview_agent:8001")

# ─── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

    /* Chat message styling */
    [data-testid="stChatMessage"] {
        border-radius: 12px;
        margin-bottom: 8px;
        border: 1px solid rgba(0, 212, 170, 0.08);
    }

    /* Upload area */
    [data-testid="stFileUploader"] {
        border: 2px dashed rgba(0, 212, 170, 0.25);
        border-radius: 12px;
        padding: 8px;
    }

    .portal-header {
        padding: 20px 0 10px 0;
    }
    .portal-header h2 {
        background: linear-gradient(135deg, #00D4AA, #00A3FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
    }

    .status-badge {
        display: inline-block;
        padding: 5px 16px;
        border-radius: 20px;
        font-size: 0.8rem;
        font-weight: 600;
    }
    .badge-ongoing { background: rgba(0, 163, 255, 0.15); color: #00A3FF; border: 1px solid rgba(0, 163, 255, 0.3); }
    .badge-complete { background: rgba(0, 212, 170, 0.15); color: #00D4AA; border: 1px solid rgba(0, 212, 170, 0.3); }

    .info-panel {
        background: linear-gradient(135deg, #1A1F2E 0%, #1E2540 100%);
        border: 1px solid rgba(0, 212, 170, 0.12);
        border-radius: 14px;
        padding: 24px;
        margin: 10px 0;
    }

    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# ─── Session State Init ──────────────────────────────────────────────────────
if "session_id" not in st.session_state:
    st.session_state.session_id = f"sess_{uuid.uuid4().hex[:8]}"
if "patient_id" not in st.session_state:
    st.session_state.patient_id = f"pat_{uuid.uuid4().hex[:6]}"
if "chat_history" not in st.session_state:
    st.session_state.chat_history = []
if "interview_status" not in st.session_state:
    st.session_state.interview_status = "ongoing"
if "uploaded_files" not in st.session_state:
    st.session_state.uploaded_files = []

# ─── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🩺 Patient Portal")
    st.markdown("---")

    # Session info
    st.markdown("**Session Details**")
    st.code(f"Session: {st.session_state.session_id}", language=None)
    st.code(f"Patient: {st.session_state.patient_id}", language=None)

    status_class = "badge-complete" if st.session_state.interview_status == "complete" else "badge-ongoing"
    status_text = "✅ COMPLETE" if st.session_state.interview_status == "complete" else "💬 IN PROGRESS"
    st.markdown(
        f'<span class="status-badge {status_class}">{status_text}</span>',
        unsafe_allow_html=True,
    )

    st.markdown("---")

    # New session button
    if st.button("🔄 New Session", use_container_width=True):
        st.session_state.session_id = f"sess_{uuid.uuid4().hex[:8]}"
        st.session_state.patient_id = f"pat_{uuid.uuid4().hex[:6]}"
        st.session_state.chat_history = []
        st.session_state.interview_status = "ongoing"
        st.session_state.uploaded_files = []
        st.rerun()

    st.markdown("---")

    # File upload section
    st.markdown("**📎 Medical Records**")
    uploaded = st.file_uploader(
        "Upload CSV or PDF files",
        type=["csv", "pdf", "txt"],
        accept_multiple_files=True,
        key="file_uploader",
    )
    if uploaded:
        st.session_state.uploaded_files = uploaded
        for f in uploaded:
            st.success(f"✓ {f.name} ({f.size / 1024:.1f} KB)")

# ─── Header ───────────────────────────────────────────────────────────────────
st.markdown("""
<div class="portal-header">
    <h2>🩺 Patient Interview Portal</h2>
</div>
""", unsafe_allow_html=True)

st.caption("Have a conversation with our AI medical assistant. It will gather your symptoms and medical history.")

st.markdown("---")

# ─── Chat Container ──────────────────────────────────────────────────────────
# Display existing messages
for msg in st.session_state.chat_history:
    role = msg["role"]
    with st.chat_message(role, avatar="🧑‍⚕️" if role == "assistant" else "🙋"):
        st.markdown(msg["content"])

# ─── Chat Input ──────────────────────────────────────────────────────────────
if st.session_state.interview_status != "complete":
    if prompt := st.chat_input("Describe your symptoms or answer the doctor's questions..."):
        # Display user message immediately
        with st.chat_message("user", avatar="🙋"):
            st.markdown(prompt)
        st.session_state.chat_history.append({"role": "user", "content": prompt})

        # Call Interview Agent API
        with st.chat_message("assistant", avatar="🧑‍⚕️"):
            with st.spinner("Dr. Neural is thinking..."):
                try:
                    response = httpx.post(
                        f"{INTERVIEW_AGENT_URL}/chat/{st.session_state.session_id}",
                        json={
                            "patient_id": st.session_state.patient_id,
                            "message": prompt,
                        },
                        timeout=30.0,
                    )
                    response.raise_for_status()
                    data = response.json()

                    reply = data.get("reply", "I'm sorry, I couldn't process your message.")
                    status = data.get("status", "ongoing")

                    st.markdown(reply)
                    st.session_state.chat_history.append({"role": "assistant", "content": reply})

                    if status == "complete":
                        st.session_state.interview_status = "complete"
                        st.rerun()

                except httpx.HTTPStatusError as e:
                    st.error(f"⚠️ Server error: {e.response.status_code}")
                except httpx.RequestError as e:
                    st.error(f"⚠️ Could not reach the Interview Agent. Is the backend running?")
                except Exception as e:
                    st.error(f"⚠️ Unexpected error: {str(e)}")
else:
    # Interview complete — show completion state
    st.markdown("""
    <div class="info-panel" style="text-align:center;">
        <h3 style="color:#00D4AA;">✅ Interview Complete</h3>
        <p style="color:#8892A8;">
            Your symptoms and medical history have been recorded.
            The data has been automatically submitted to the diagnostic pipeline.
        </p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("")

    # Submit for Analysis button (manual re-trigger)
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        if st.button(
            "🚀 Submit for Analysis",
            use_container_width=True,
            type="primary",
        ):
            with st.spinner("Triggering multi-agent triage pipeline..."):
                try:
                    # The interview_agent already emits JOB_READY on completion.
                    # This button is a manual re-trigger via the same chat endpoint
                    # with a special message indicating re-submission.
                    response = httpx.post(
                        f"{INTERVIEW_AGENT_URL}/chat/{st.session_state.session_id}",
                        json={
                            "patient_id": st.session_state.patient_id,
                            "message": "[SYSTEM] Patient has requested re-analysis of their case.",
                        },
                        timeout=30.0,
                    )
                    if response.status_code == 200:
                        st.success("✅ Analysis pipeline triggered! Track progress in the **Doctor Pipeline** page.")
                        st.balloons()
                    else:
                        st.warning(f"Received status {response.status_code} from Interview Agent.")
                except Exception as e:
                    st.error(f"⚠️ Failed to trigger pipeline: {str(e)}")

    # Show uploaded files summary
    if st.session_state.uploaded_files:
        st.markdown("---")
        st.markdown("**📎 Attached Medical Records**")
        for f in st.session_state.uploaded_files:
            st.info(f"📄 {f.name} — {f.size / 1024:.1f} KB")
