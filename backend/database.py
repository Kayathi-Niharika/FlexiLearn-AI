import sqlite3
from datetime import datetime

# Create database connection
conn = sqlite3.connect("flexilearn.db", check_same_thread=False)
cursor = conn.cursor()

# Create table (existing structure)
cursor.execute("""
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    interest TEXT,
    explanation TEXT
)
""")
conn.commit()

# ✅ ADD timestamp column safely (NO BREAKING)
try:
    cursor.execute("ALTER TABLE history ADD COLUMN created_at TEXT")
    conn.commit()
except:
    # Column already exists — ignore
    pass


# ===============================
# EXISTING FUNCTIONS (UNCHANGED)
# ===============================

def save_session(topic, interest, explanation):
    cursor.execute(
        "INSERT INTO history (topic, interest, explanation, created_at) VALUES (?, ?, ?, ?)",
        (topic, interest, explanation, datetime.now().strftime("%Y-%m-%d %H:%M"))
    )
    conn.commit()


def get_history():
    cursor.execute("SELECT topic, interest FROM history")
    rows = cursor.fetchall()
    return [{"topic": r[0], "interest": r[1]} for r in rows]


# ===============================
# ✅ NEW FUNCTIONS (ADDED SAFELY)
# ===============================

def get_full_history():
    cursor.execute(
        "SELECT id, topic, interest, explanation, created_at FROM history ORDER BY id DESC"
    )
    rows = cursor.fetchall()

    return [
        {
            "id": r[0],
            "topic": r[1],
            "interest": r[2],
            "explanation": r[3],
            "date": r[4]
        }
        for r in rows
    ]


def get_session_by_id(session_id):
    cursor.execute(
        "SELECT topic, interest, explanation FROM history WHERE id = ?",
        (session_id,)
    )
    row = cursor.fetchone()

    if row:
        return {
            "topic": row[0],
            "interest": row[1],
            "explanation": row[2]
        }
    return None
