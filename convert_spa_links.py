import os
import re

files = ['Dashboard.jsx', 'HistoryPortal.jsx', 'Intake.jsx', 'ShareHub.jsx']
directory = 'CareCortex/src/pages'

for filename in files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add the import if not present
    if "import { Link }" not in content:
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { Link } from 'react-router-dom';")

    # Convert <a href="/something">...</a> to <Link to="/something">...</Link>
    # Using non-greedy matched groups
    content = re.sub(
        r'<a\b([^>]*?)href="(/(?:history|intake|share)?)"([^>]*)>(.*?)</a>',
        r'<Link \1to="\2"\3>\4</Link>',
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Links converted to fast React Router SPA Links.")
