import os
import re

files = ['Dashboard.jsx', 'HistoryPortal.jsx', 'Intake.jsx', 'ShareHub.jsx']
directory = 'CareCortex/src/pages'

replacements = {
    r'(<a[^>]+href=)"#"([^>]*>.*?Overview.*?</a>)': r'\1"/"\2',
    r'(<a[^>]+href=)"#"([^>]*>.*?Symptom Checker.*?</a>)': r'\1"/intake"\2',
    r'(<a[^>]+href=)"#"([^>]*>.*?Medical Records.*?</a>)': r'\1"/history"\2',
    r'(<a[^>]+href=)"#"([^>]*>.*?Lab Results.*?</a>)': r'\1"/"\2',
    r'(<a[^>]+href=)"#"([^>]*>.*?Doctor Access.*?</a>)': r'\1"/share"\2',
    r'(<a[^>]+href=)"#"([^>]*>Health</a>)': r'\1"/"\2',
    r'(<a[^>]+href=)"#"([^>]*>History</a>)': r'\1"/history"\2',
    r'(<a[^>]+href=)"#"([^>]*>Consult</a>)': r'\1"/intake"\2',
    r'(<a[^>]+href=)"#"([^>]*>Settings</a>)': r'\1"/share"\2',
}

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for pattern, replacement in replacements.items():
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Navigation fixed.")
