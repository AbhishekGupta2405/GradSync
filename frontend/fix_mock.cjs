const fs = require('fs');
const path = require('path');

const authPath = path.join(__dirname, 'src', 'contexts', 'AuthContext.tsx');
let authContent = fs.readFileSync(authPath, 'utf8');

const match = authContent.match(/export const mockAlumni: User\[\] = \[[\s\S]*?\]/);
if (match) {
    const mockDataStr = `import { User } from '@/contexts/AuthContext';\n\n` + match[0] + '\n';
    fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'mockData.ts'), mockDataStr);
    
    authContent = authContent.replace(match[0], '');
    fs.writeFileSync(authPath, authContent);
}

const filesToUpdate = [
    'src/pages/Directory.tsx',
    'src/components/dashboard/StudentDashboard.tsx',
    'src/components/dashboard/AlumniDashboard.tsx'
];

filesToUpdate.forEach(f => {
    const p = path.join(__dirname, f);
    if(fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        content = content.replace(/import\s+\{([^}]*)mockAlumni([^}]*)\}\s+from\s+'@\/contexts\/AuthContext'/, (full, g1, g2) => {
            const p1 = g1.trim().replace(/,$/, '');
            const p2 = g2.trim().replace(/^,/, '').trim();
            const hasOther = (p1 || p2);
            const otherImports = [p1, p2].filter(Boolean).join(', ');
            return `import { mockAlumni } from '@/lib/mockData'\n` + (hasOther ? `import { ${otherImports} } from '@/contexts/AuthContext'` : '');
        });
        fs.writeFileSync(p, content);
    }
});
