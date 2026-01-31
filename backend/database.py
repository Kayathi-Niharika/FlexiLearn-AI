import sqlite3

# Create database connection
conn = sqlite3.connect("flexilearn.db", check_same_thread=False)
cursor = conn.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    interest TEXT,
    explanation TEXT
)
""")
conn.commit()

def save_session(topic, interest, explanation):
    cursor.execute(
        "INSERT INTO history (topic, interest, explanation) VALUES (?, ?, ?)",
        (topic, interest, explanation)
    )
    conn.commit()

def get_history():
    cursor.execute("SELECT topic, interest FROM history")
    rows = cursor.fetchall()
    return [{"topic": r[0], "interest": r[1]} for r in rows]
