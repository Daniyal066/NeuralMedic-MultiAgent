import os
import re

files = ['Dashboard.jsx', 'HistoryPortal.jsx', 'Intake.jsx', 'ShareHub.jsx']
directory = 'CareCortex/src/pages'

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Convert all remaining <a ... href="#"> to <Link ... to="/">
    content = re.sub(r'<a\b([^>]*?)href="#"([^>]*)>(.*?)</a>',
                     r'<Link \1to="/"\2>\3</Link>',
                     content, flags=re.DOTALL)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print("Finished fixing remaining anchors.")
