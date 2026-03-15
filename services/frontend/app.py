"""
NeuralMedic Multi-Agent System — Frontend Dashboard
Main entry point for the multi-page Streamlit application.
"""

import streamlit as st
import httpx

# ─── Page Config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="NeuralMedic — AI Diagnostic Platform",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
    /* Global font override */
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

    /* Sidebar branding */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #0E1117 0%, #131B2E 100%);
        border-right: 1px solid rgba(0, 212, 170, 0.15);
    }

    /* Metric cards */
    [data-testid="stMetric"] {
        background: linear-gradient(135deg, #1A1F2E 0%, #222842 100%);
        border: 1px solid rgba(0, 212, 170, 0.2);
        border-radius: 12px;
        padding: 16px 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    [data-testid="stMetric"] label { color: #8892A8 !important; font-size: 0.8rem; }
    [data-testid="stMetric"] [data-testid="stMetricValue"] { color: #00D4AA !important; font-weight: 600; }

    /* Hero header */
    .hero-header {
        text-align: center;
        padding: 40px 0 20px 0;
    }
    .hero-header h1 {
        font-size: 2.8rem;
        font-weight: 700;
        background: linear-gradient(135deg, #00D4AA, #00A3FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 8px;
    }
    .hero-header p {
        color: #8892A8;
        font-size: 1.1rem;
        font-weight: 300;
    }

    /* Status pill */
    .status-pill {
        display: inline-block;
        padding: 4px 14px;
        border-radius: 20px;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.5px;
    }
    .status-online { background: rgba(0, 212, 170, 0.15); color: #00D4AA; border: 1px solid rgba(0, 212, 170, 0.3); }
    .status-offline { background: rgba(255, 75, 75, 0.15); color: #FF4B4B; border: 1px solid rgba(255, 75, 75, 0.3); }

    /* Card container */
    .info-card {
        background: linear-gradient(135deg, #1A1F2E 0%, #1E2540 100%);
        border: 1px solid rgba(0, 212, 170, 0.12);
        border-radius: 14px;
        padding: 28px;
        margin: 10px 0;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .info-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 32px rgba(0, 212, 170, 0.1);
    }
    .info-card h3 { color: #E0E0E0; margin-bottom: 8px; }
    .info-card p { color: #8892A8; font-size: 0.92rem; line-height: 1.6; }

    /* Divider accent */
    hr { border-color: rgba(0, 212, 170, 0.15) !important; }

    /* Hide default Streamlit elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# ─── Sidebar ──────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🧠 NeuralMedic")
    st.caption("Multi-Agent Diagnostic Platform")
    st.markdown("---")
    st.markdown("""
    **Navigation**
    - 🏠 **Home** — System Overview
    - 🩺 **Patient Portal** — AI Interview
    - 📊 **Doctor Pipeline** — Live Monitoring
    - 📄 **Final Synthesis** — Reports
    """)
    st.markdown("---")
    st.markdown(
        "<p style='color:#555; font-size:0.75rem; text-align:center;'>"
        "NeuralMedic v1.0 • HA Cluster</p>",
        unsafe_allow_html=True,
    )

# ─── Hero Section ─────────────────────────────────────────────────────────────
st.markdown("""
<div class="hero-header">
    <h1>🧠 NeuralMedic</h1>
    <p>Multi-Agent AI Diagnostic Platform — Powered by High-Availability Microservices</p>
</div>
""", unsafe_allow_html=True)

st.markdown("---")

# ─── System Health ────────────────────────────────────────────────────────────
import os

INTERVIEW_AGENT_URL = os.getenv("INTERVIEW_AGENT_URL", "http://interview_agent:8001")
ORCHESTRATOR_URL = os.getenv("ORCHESTRATOR_URL", "http://orchestrator:8000")
SYNTHESIZER_URL = os.getenv("SYNTHESIZER_URL", "http://synthesizer_agent:8005")

def check_health(url: str, name: str) -> dict:
    """Ping a service health endpoint."""
    try:
        resp = httpx.get(f"{url}/health", timeout=3.0)
        if resp.status_code == 200:
            return {"name": name, "status": "online", "detail": resp.json()}
        return {"name": name, "status": "offline", "detail": f"HTTP {resp.status_code}"}
    except Exception:
        return {"name": name, "status": "offline", "detail": "Unreachable"}

st.subheader("⚡ System Health")

col1, col2, col3 = st.columns(3)

services = [
    (INTERVIEW_AGENT_URL, "Interview Agent", col1),
    (ORCHESTRATOR_URL, "Orchestrator (HA)", col2),
    (SYNTHESIZER_URL, "Synthesizer Agent", col3),
]

for url, name, col in services:
    result = check_health(url, name)
    pill_class = "status-online" if result["status"] == "online" else "status-offline"
    label = "● ONLINE" if result["status"] == "online" else "● OFFLINE"
    with col:
        st.markdown(f"""
        <div class="info-card" style="text-align:center; min-height:140px;">
            <h3>{name}</h3>
            <span class="status-pill {pill_class}">{label}</span>
        </div>
        """, unsafe_allow_html=True)

st.markdown("---")

# ─── Feature Cards ────────────────────────────────────────────────────────────
st.subheader("🔬 Platform Modules")

c1, c2, c3 = st.columns(3)

with c1:
    st.markdown("""
    <div class="info-card">
        <h3>🩺 Patient Portal</h3>
        <p>Conversational AI interview powered by Llama 3.3. Upload medical records and submit for multi-agent triage analysis.</p>
    </div>
    """, unsafe_allow_html=True)

with c2:
    st.markdown("""
    <div class="info-card">
        <h3>📊 Doctor Pipeline</h3>
        <p>Real-time monitoring of the diagnostic pipeline. Track jobs across pathology, risk analysis, and synthesis stages.</p>
    </div>
    """, unsafe_allow_html=True)

with c3:
    st.markdown("""
    <div class="info-card">
        <h3>📄 Final Synthesis</h3>
        <p>AI-generated diagnostic reports with risk assessment, pathological findings, and clinical recommendations.</p>
    </div>
    """, unsafe_allow_html=True)

# ─── Architecture Summary ────────────────────────────────────────────────────
st.markdown("---")
st.subheader("🏗️ Architecture")

st.markdown("""
<div class="info-card">
    <p style="text-align:center; font-size:1rem; color:#B0B8CC;">
        <strong>Patient</strong> → 🩺 Interview Agent → 📨 Outbox Poller → ⚙️ Orchestrator (3× HA + Redlock)
        → 🔬 Pathology Worker + ⚠️ Risk Worker → 🧠 Synthesizer → 📄 Final Diagnosis
    </p>
</div>
""", unsafe_allow_html=True)
