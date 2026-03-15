"""
NeuralMedic — Final Synthesis Report
Clean, readable medical report view for completed diagnostic sessions.
"""

import streamlit as st
import psycopg2
import psycopg2.extras
import os
import json
from datetime import datetime

# ─── Config ───────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="NeuralMedic — Diagnostic Report",
    page_icon="📄",
    layout="wide",
)

DB_HOST = os.getenv("DB_HOST", "postgres")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME", "neuralmedic")
DB_USER = os.getenv("DB_USER", "admin")
DB_PASS = os.getenv("DB_PASS", "password123")

# ─── Custom CSS ───────────────────────────────────────────────────────────────
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

    .report-header h2 {
        background: linear-gradient(135deg, #00D4AA, #00A3FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
    }

    .report-card {
        background: linear-gradient(135deg, #1A1F2E 0%, #1E2540 100%);
        border: 1px solid rgba(0, 212, 170, 0.12);
        border-radius: 14px;
        padding: 28px;
        margin: 12px 0;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
    }
    .report-card h3 {
        color: #E0E0E0;
        margin-bottom: 12px;
        font-size: 1.1rem;
    }
    .report-card p, .report-card li {
        color: #B0B8CC;
        font-size: 0.92rem;
        line-height: 1.7;
    }

    .confidence-gauge {
        background: linear-gradient(135deg, #1A1F2E 0%, #222842 100%);
        border: 1px solid rgba(0, 212, 170, 0.2);
        border-radius: 14px;
        padding: 24px;
        text-align: center;
    }
    .confidence-value {
        font-size: 3rem;
        font-weight: 700;
        margin: 8px 0;
    }
    .confidence-high { color: #00D4AA; }
    .confidence-medium { color: #FFC107; }
    .confidence-low { color: #FF4B4B; }

    .action-badge {
        display: inline-block;
        padding: 6px 18px;
        border-radius: 20px;
        font-size: 0.82rem;
        font-weight: 700;
        letter-spacing: 0.5px;
    }
    .badge-final { background: rgba(0, 212, 170, 0.15); color: #00D4AA; border: 1px solid rgba(0, 212, 170, 0.3); }
    .badge-recursive { background: rgba(255, 193, 7, 0.15); color: #FFC107; border: 1px solid rgba(255, 193, 7, 0.3); }

    .section-divider {
        border: none;
        border-top: 1px solid rgba(0, 212, 170, 0.1);
        margin: 20px 0;
    }

    .empty-state {
        text-align: center;
        padding: 60px 20px;
        color: #555;
    }
    .empty-state h3 { color: #666; }

    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)


# ─── Database Helpers ─────────────────────────────────────────────────────────
def fetch_completed_sessions():
    """Fetch all sessions that have a final diagnosis."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
            user=DB_USER, password=DB_PASS,
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT DISTINCT
                fd.session_id,
                fd.created_at,
                fd.confidence_score
            FROM final_diagnoses fd
            ORDER BY fd.created_at DESC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception:
        return None


def fetch_diagnosis(session_id: str):
    """Fetch the full diagnosis for a session."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
            user=DB_USER, password=DB_PASS,
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT
                id, session_id, clinical_summary,
                confidence_score, created_at
            FROM final_diagnoses
            WHERE session_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (session_id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        return row
    except Exception:
        return None


def fetch_reasoning_paths(session_id: str):
    """Fetch reasoning paths (worker results) for a session."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
            user=DB_USER, password=DB_PASS,
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT
                rp.worker_name,
                rp.reasoning_jsonb,
                rp.evidence_links_array,
                rp.created_at
            FROM reasoning_paths rp
            JOIN job_status js ON rp.job_id = js.job_id
            WHERE js.session_id = %s
            ORDER BY rp.created_at ASC
        """, (session_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception:
        return []


def fetch_job_results(session_id: str):
    """Fetch job results from job_status table for a session."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST, port=DB_PORT, dbname=DB_NAME,
            user=DB_USER, password=DB_PASS,
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT worker_type, status, result, updated_at
            FROM job_status
            WHERE session_id = %s AND status = 'DONE'
            ORDER BY updated_at ASC
        """, (session_id,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception:
        return []


# ─── Header ───────────────────────────────────────────────────────────────────
st.markdown("""
<div class="report-header">
    <h2>📄 Final Synthesis Report</h2>
</div>
""", unsafe_allow_html=True)
st.caption("AI-generated diagnostic reports from the NeuralMedic Synthesizer Agent.")
st.markdown("---")

# ─── Session Selector ─────────────────────────────────────────────────────────
sessions = fetch_completed_sessions()

if sessions is None:
    st.error("⚠️ Unable to connect to the database. Is PostgreSQL running?")
    st.stop()

if not sessions:
    st.markdown("""
    <div class="empty-state">
        <h3>📋 No Completed Reports Yet</h3>
        <p>Diagnostic reports will appear here once the Synthesizer Agent has completed processing.<br>
        Start by submitting a patient interview through the <strong>Patient Portal</strong>.</p>
    </div>
    """, unsafe_allow_html=True)
    st.stop()

# Session dropdown
session_options = {
    f"🏷️ {s['session_id']}  —  {s['created_at'].strftime('%b %d, %Y %I:%M %p') if s['created_at'] else 'N/A'}  |  Confidence: {s.get('confidence_score', 'N/A')}": s["session_id"]
    for s in sessions
}

selected_label = st.selectbox(
    "Select a completed session",
    options=list(session_options.keys()),
)
selected_session = session_options[selected_label]

st.markdown("---")

# ─── Fetch and Render Report ─────────────────────────────────────────────────
diagnosis = fetch_diagnosis(selected_session)

if not diagnosis:
    st.warning("Could not load the diagnosis for this session.")
    st.stop()

# Parse clinical summary — try JSON first, fall back to raw text
clinical_summary = diagnosis.get("clinical_summary", "")
report_data = None
try:
    if clinical_summary.strip().startswith("{"):
        report_data = json.loads(clinical_summary)
    elif "{" in clinical_summary:
        start = clinical_summary.find("{")
        end = clinical_summary.rfind("}") + 1
        report_data = json.loads(clinical_summary[start:end])
except (json.JSONDecodeError, ValueError):
    report_data = None

# ─── Confidence Score ─────────────────────────────────────────────────────────
score_col, meta_col = st.columns([1, 2])

with score_col:
    confidence = diagnosis.get("confidence_score")
    if confidence is None and report_data:
        confidence = report_data.get("confidence_score")

    if confidence is not None:
        try:
            score_val = float(confidence)
        except (TypeError, ValueError):
            score_val = 0.0

        if score_val >= 0.85:
            color_class = "confidence-high"
        elif score_val >= 0.60:
            color_class = "confidence-medium"
        else:
            color_class = "confidence-low"

        display_pct = f"{score_val * 100:.0f}%" if score_val <= 1 else f"{score_val:.0f}%"

        st.markdown(f"""
        <div class="confidence-gauge">
            <p style="color:#8892A8; font-size:0.85rem; margin:0;">AI Confidence</p>
            <div class="confidence-value {color_class}">{display_pct}</div>
            <p style="color:#555; font-size:0.75rem; margin:0;">Synthesizer Assessment</p>
        </div>
        """, unsafe_allow_html=True)
    else:
        st.markdown("""
        <div class="confidence-gauge">
            <p style="color:#8892A8;">AI Confidence</p>
            <div class="confidence-value confidence-medium">N/A</div>
        </div>
        """, unsafe_allow_html=True)

with meta_col:
    action = "FINAL_DIAGNOSIS"
    if report_data:
        action = report_data.get("action", "FINAL_DIAGNOSIS")

    badge_class = "badge-final" if action == "FINAL_DIAGNOSIS" else "badge-recursive"
    badge_text = "✅ FINAL DIAGNOSIS" if action == "FINAL_DIAGNOSIS" else "🔄 RECURSIVE TRIGGER"

    st.markdown(f"""
    <div class="report-card">
        <h3>📋 Report Metadata</h3>
        <p><strong>Session ID:</strong> {selected_session}</p>
        <p><strong>Generated:</strong> {diagnosis.get('created_at', 'N/A')}</p>
        <p><strong>Action:</strong> <span class="action-badge {badge_class}">{badge_text}</span></p>
    </div>
    """, unsafe_allow_html=True)

st.markdown('<hr class="section-divider">', unsafe_allow_html=True)

# ─── Report Sections ─────────────────────────────────────────────────────────
if report_data:
    # Structured JSON report from synthesizer

    # Diagnosis Summary
    summary = report_data.get("diagnosis_summary", "")
    if summary:
        st.markdown(f"""
        <div class="report-card">
            <h3>📋 Diagnosis Summary</h3>
            <p>{summary}</p>
        </div>
        """, unsafe_allow_html=True)

    # Two-column layout for Pathology and Risk
    col_path, col_risk = st.columns(2)

    with col_path:
        findings = report_data.get("pathological_findings", "")
        st.markdown(f"""
        <div class="report-card">
            <h3>🔬 Pathological Findings</h3>
            <p>{findings if findings else 'No specific pathological findings reported.'}</p>
        </div>
        """, unsafe_allow_html=True)

    with col_risk:
        risk = report_data.get("risk_assessment", "")
        st.markdown(f"""
        <div class="report-card">
            <h3>⚠️ Risk Assessment</h3>
            <p>{risk if risk else 'No specific risk factors identified.'}</p>
        </div>
        """, unsafe_allow_html=True)

    # Contradictions
    contradictions = report_data.get("contradictions_found", [])
    if contradictions and contradictions != ["None"] and contradictions != []:
        items_html = "".join(f"<li>{c}</li>" for c in contradictions)
        st.markdown(f"""
        <div class="report-card" style="border-color: rgba(255, 193, 7, 0.3);">
            <h3>🔍 Contradictions Detected</h3>
            <ul>{items_html}</ul>
        </div>
        """, unsafe_allow_html=True)

    # Missing Info (for recursive triggers)
    missing = report_data.get("missing_info", [])
    if missing and missing != []:
        items_html = "".join(f"<li>{m}</li>" for m in missing)
        st.markdown(f"""
        <div class="report-card" style="border-color: rgba(255, 75, 75, 0.3);">
            <h3>❓ Missing Information</h3>
            <ul>{items_html}</ul>
        </div>
        """, unsafe_allow_html=True)

    # Next Steps
    next_steps = report_data.get("next_steps", "")
    if next_steps:
        st.markdown(f"""
        <div class="report-card" style="border-color: rgba(0, 212, 170, 0.3);">
            <h3>✅ Recommended Next Steps</h3>
            <p>{next_steps}</p>
        </div>
        """, unsafe_allow_html=True)

else:
    # Raw text report
    st.markdown(f"""
    <div class="report-card">
        <h3>📋 Clinical Summary</h3>
        <p>{clinical_summary}</p>
    </div>
    """, unsafe_allow_html=True)

# ─── Worker Reports (Expandable) ─────────────────────────────────────────────
st.markdown('<hr class="section-divider">', unsafe_allow_html=True)
st.markdown("### 🧪 Individual Worker Reports")

job_results = fetch_job_results(selected_session)

if job_results:
    for job in job_results:
        worker = job.get("worker_type", "Unknown Worker")
        icon = "🔬" if "pathology" in worker.lower() else "⚠️"

        with st.expander(f"{icon} {worker.replace('_', ' ').title()} — COMPLETED"):
            result = job.get("result")
            if result:
                if isinstance(result, str):
                    try:
                        result = json.loads(result)
                    except json.JSONDecodeError:
                        pass

                if isinstance(result, dict):
                    # Pretty render the worker result
                    for key, value in result.items():
                        if isinstance(value, list):
                            st.markdown(f"**{key.replace('_', ' ').title()}:**")
                            for item in value:
                                if isinstance(item, dict):
                                    st.json(item)
                                else:
                                    st.markdown(f"- {item}")
                        elif isinstance(value, dict):
                            st.markdown(f"**{key.replace('_', ' ').title()}:**")
                            st.json(value)
                        else:
                            st.markdown(f"**{key.replace('_', ' ').title()}:** {value}")
                else:
                    st.text(str(result))
            else:
                st.info("No result data available.")

            st.caption(f"Completed at: {job.get('updated_at', 'N/A')}")
else:
    # Try reasoning_paths table
    reasoning = fetch_reasoning_paths(selected_session)
    if reasoning:
        for rp in reasoning:
            worker = rp.get("worker_name", "Unknown")
            icon = "🔬" if "pathology" in worker.lower() else "⚠️"
            with st.expander(f"{icon} {worker.replace('_', ' ').title()}"):
                st.json(rp.get("reasoning_jsonb", {}))
                evidence = rp.get("evidence_links_array", [])
                if evidence:
                    st.markdown("**Evidence Links:**")
                    for link in evidence:
                        st.markdown(f"- {link}")
    else:
        st.info("No individual worker reports available for this session.")

# ─── Raw JSON (Debug) ────────────────────────────────────────────────────────
with st.expander("🛠️ Raw Diagnosis Data (Debug)"):
    st.json({
        "session_id": selected_session,
        "clinical_summary": clinical_summary,
        "confidence_score": str(diagnosis.get("confidence_score", "N/A")),
        "created_at": str(diagnosis.get("created_at", "N/A")),
        "parsed_report": report_data,
    })
