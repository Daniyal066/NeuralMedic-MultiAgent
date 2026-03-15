"""
NeuralMedic — Doctor's Active Pipeline
Real-time monitoring dashboard for the multi-agent diagnostic pipeline.
"""

import streamlit as st
import psycopg2
import psycopg2.extras
import pandas as pd
import os
import time
from datetime import datetime

# ─── Config ───────────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="NeuralMedic — Doctor Pipeline",
    page_icon="📊",
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

    .pipeline-header h2 {
        background: linear-gradient(135deg, #00D4AA, #00A3FF);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 700;
    }

    /* Pipeline step styling */
    .pipeline-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0;
        padding: 24px 0;
        flex-wrap: wrap;
    }
    .pipeline-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 130px;
        padding: 16px 12px;
    }
    .step-circle {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.4rem;
        margin-bottom: 10px;
        transition: all 0.3s ease;
    }
    .step-active {
        background: linear-gradient(135deg, #00D4AA, #00A3FF);
        box-shadow: 0 0 20px rgba(0, 212, 170, 0.4);
        animation: pulse 2s infinite;
    }
    .step-done {
        background: rgba(0, 212, 170, 0.2);
        border: 2px solid #00D4AA;
    }
    .step-pending {
        background: rgba(100, 100, 130, 0.2);
        border: 2px solid #444;
    }
    .step-failed {
        background: rgba(255, 75, 75, 0.2);
        border: 2px solid #FF4B4B;
    }
    .step-label {
        font-size: 0.78rem;
        color: #8892A8;
        text-align: center;
        font-weight: 500;
    }
    .step-arrow {
        font-size: 1.5rem;
        color: rgba(0, 212, 170, 0.3);
        margin: 0 4px;
        padding-bottom: 24px;
    }

    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 20px rgba(0, 212, 170, 0.4); }
        50% { box-shadow: 0 0 35px rgba(0, 212, 170, 0.7); }
    }

    /* Stats cards */
    .stat-card {
        background: linear-gradient(135deg, #1A1F2E 0%, #222842 100%);
        border: 1px solid rgba(0, 212, 170, 0.15);
        border-radius: 12px;
        padding: 20px;
        text-align: center;
    }
    .stat-card h1 { color: #00D4AA; margin: 0; font-size: 2rem; }
    .stat-card p { color: #8892A8; margin: 4px 0 0 0; font-size: 0.85rem; }

    .session-card {
        background: linear-gradient(135deg, #1A1F2E 0%, #1E2540 100%);
        border: 1px solid rgba(0, 212, 170, 0.12);
        border-radius: 14px;
        padding: 24px;
        margin: 10px 0;
    }

    .status-chip {
        display: inline-block;
        padding: 3px 10px;
        border-radius: 6px;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.5px;
    }
    .chip-pending { background: rgba(255, 193, 7, 0.15); color: #FFC107; }
    .chip-processing { background: rgba(0, 163, 255, 0.15); color: #00A3FF; }
    .chip-done { background: rgba(0, 212, 170, 0.15); color: #00D4AA; }
    .chip-failed { background: rgba(255, 75, 75, 0.15); color: #FF4B4B; }

    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)


# ─── Database Helper ──────────────────────────────────────────────────────────
@st.cache_resource(ttl=5)
def get_db_connection():
    """Create a database connection (cached for 5s)."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
        )
        return conn
    except Exception as e:
        return None


def fetch_pipeline_data():
    """Fetch all job statuses from the database."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT
                job_id,
                session_id,
                worker_type,
                status,
                created_at,
                updated_at
            FROM job_status
            ORDER BY created_at DESC
            LIMIT 100
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return None


def fetch_session_summary():
    """Fetch aggregated session-level stats."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT
                session_id,
                COUNT(*) as total_jobs,
                COUNT(*) FILTER (WHERE status = 'DONE') as done_count,
                COUNT(*) FILTER (WHERE status = 'PROCESSING') as processing_count,
                COUNT(*) FILTER (WHERE status = 'PENDING') as pending_count,
                COUNT(*) FILTER (WHERE status = 'FAILED') as failed_count,
                MIN(created_at) as started_at,
                MAX(updated_at) as last_updated
            FROM job_status
            GROUP BY session_id
            ORDER BY MIN(created_at) DESC
        """)
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        return None


def check_final_diagnosis(session_id: str):
    """Check if a final diagnosis exists for a session."""
    try:
        conn = psycopg2.connect(
            host=DB_HOST,
            port=DB_PORT,
            dbname=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
        )
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            "SELECT id FROM final_diagnoses WHERE session_id = %s LIMIT 1",
            (session_id,),
        )
        row = cur.fetchone()
        cur.close()
        conn.close()
        return row is not None
    except Exception:
        return False


# ─── Header ───────────────────────────────────────────────────────────────────
st.markdown("""
<div class="pipeline-header">
    <h2>📊 Doctor's Active Pipeline</h2>
</div>
""", unsafe_allow_html=True)
st.caption("Real-time monitoring of active patient sessions across the multi-agent diagnostic pipeline.")
st.markdown("---")

# ─── Controls ─────────────────────────────────────────────────────────────────
ctrl_col1, ctrl_col2, ctrl_col3 = st.columns([2, 1, 1])
with ctrl_col1:
    auto_refresh = st.toggle("🔄 Auto-refresh (10s)", value=False)
with ctrl_col2:
    if st.button("⟳ Refresh Now"):
        st.cache_resource.clear()
        st.rerun()
with ctrl_col3:
    # Winner Node ID — HA proof
    orchestrator_node = os.getenv("HOSTNAME", "frontend-node")
    st.markdown(
        f"<p style='color:#555; font-size:0.7rem; text-align:right;'>"
        f"Node: <code>{orchestrator_node}</code></p>",
        unsafe_allow_html=True,
    )

# ─── Fetch Data ───────────────────────────────────────────────────────────────
sessions = fetch_session_summary()
all_jobs = fetch_pipeline_data()

if sessions is None or all_jobs is None:
    st.error("⚠️ Unable to connect to the database. Is PostgreSQL running?")
    st.stop()

# ─── Summary Stats ────────────────────────────────────────────────────────────
st.markdown("### 📈 Pipeline Overview")

total_sessions = len(sessions)
total_jobs_count = len(all_jobs)
done_jobs = sum(1 for j in all_jobs if j["status"] == "DONE")
active_jobs = sum(1 for j in all_jobs if j["status"] in ("PENDING", "PROCESSING"))
failed_jobs = sum(1 for j in all_jobs if j["status"] == "FAILED")

s1, s2, s3, s4, s5 = st.columns(5)

stats = [
    (s1, total_sessions, "Sessions"),
    (s2, total_jobs_count, "Total Jobs"),
    (s3, done_jobs, "Completed"),
    (s4, active_jobs, "Active"),
    (s5, failed_jobs, "Failed"),
]

for col, value, label in stats:
    with col:
        st.markdown(
            f'<div class="stat-card"><h1>{value}</h1><p>{label}</p></div>',
            unsafe_allow_html=True,
        )

st.markdown("---")

# ─── Session Pipeline View ───────────────────────────────────────────────────
st.markdown("### 🔬 Session Pipelines")

if not sessions:
    st.info("No active sessions. Submit a patient interview to begin.")
else:
    for sess in sessions:
        session_id = sess["session_id"]
        has_diagnosis = check_final_diagnosis(session_id)

        # Determine pipeline stage
        if has_diagnosis:
            stage = "completed"
        elif sess["done_count"] == sess["total_jobs"] and sess["total_jobs"] > 0:
            stage = "synthesizing"
        elif sess["processing_count"] > 0:
            stage = "processing"
        elif sess["pending_count"] > 0:
            stage = "pending"
        elif sess["failed_count"] > 0:
            stage = "failed"
        else:
            stage = "pending"

        with st.expander(f"📋 Session **{session_id}** — {stage.upper()}", expanded=(stage in ("processing", "synthesizing"))):
            # Pipeline visualization
            steps = [
                ("🩺", "Interviewed", stage in ("pending", "processing", "synthesizing", "completed")),
                ("⚙️", "Processing", stage in ("processing", "synthesizing", "completed")),
                ("🧠", "Synthesizing", stage in ("synthesizing", "completed")),
                ("✅", "Completed", stage == "completed"),
            ]

            is_failed = stage == "failed"

            html_steps = ""
            for i, (icon, label, is_done) in enumerate(steps):
                if is_failed:
                    css_class = "step-failed"
                elif is_done and i == len([s for s in steps if s[2]]) - 1:
                    css_class = "step-active"
                elif is_done:
                    css_class = "step-done"
                else:
                    css_class = "step-pending"

                html_steps += f"""
                <div class="pipeline-step">
                    <div class="step-circle {css_class}">{icon}</div>
                    <span class="step-label">{label}</span>
                </div>
                """
                if i < len(steps) - 1:
                    html_steps += '<span class="step-arrow">➜</span>'

            st.markdown(
                f'<div class="pipeline-container">{html_steps}</div>',
                unsafe_allow_html=True,
            )

            # Job detail table for this session
            session_jobs = [j for j in all_jobs if j["session_id"] == session_id]
            if session_jobs:
                df = pd.DataFrame(session_jobs)
                df = df[["job_id", "worker_type", "status", "created_at", "updated_at"]]
                df.columns = ["Job ID", "Worker", "Status", "Created", "Updated"]

                # Style the status column
                def style_status(val):
                    colors = {
                        "PENDING": "color: #FFC107",
                        "PROCESSING": "color: #00A3FF",
                        "DONE": "color: #00D4AA",
                        "FAILED": "color: #FF4B4B",
                    }
                    return colors.get(val, "")

                styled_df = df.style.applymap(style_status, subset=["Status"])
                st.dataframe(styled_df, use_container_width=True, hide_index=True)

            # HA Cluster Node Info (collapsed)
            with st.container():
                st.markdown(
                    f"<p style='color:#444; font-size:0.7rem;'>"
                    f"🖥️ Winner Node ID: <code>{orchestrator_node}</code> "
                    f"| Last Updated: {sess.get('last_updated', 'N/A')}</p>",
                    unsafe_allow_html=True,
                )

# ─── Auto Refresh ─────────────────────────────────────────────────────────────
if auto_refresh:
    time.sleep(10)
    st.rerun()
