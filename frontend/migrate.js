const fs = require('fs');
const path = require('path');

const srcDir = 'D:\\\\gradsync\\\\src';
const destDir = 'D:\\\\Gradsync2.0\\\\frontend\\\\src';

// Ensure destination directories exist
function ensureDir(dirName) {
    const dirPath = path.join(destDir, dirName);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

// Copy components
function copyComponents() {
    ensureDir('components');
    ensureDir('components/dashboard');
    
    const copyRecursiveSync = (src, dest) => {
        const exists = fs.existsSync(src);
        const stats = exists && fs.statSync(src);
        const isDirectory = exists && stats.isDirectory();
        if (isDirectory) {
            fs.mkdirSync(dest, { recursive: true });
            fs.readdirSync(src).forEach(childItemName => {
                copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
            });
        } else {
            console.log(`Copying component: ${src} to ${dest}`);
            let content = fs.readFileSync(src, 'utf-8');
            content = replaceNextSpecifics(content);
            fs.writeFileSync(dest, content);
        }
    };
    
    copyRecursiveSync(path.join(srcDir, 'components'), path.join(destDir, 'components'));
}

// Complex next.js replacements
function replaceNextSpecifics(content) {
    let result = content;
    
    // Remove "use client"
    result = result.replace(/^"use client";?\r?\n/m, '');
    result = result.replace(/^'use client';?\r?\n/m, '');
    
    // Replace next/link
    result = result.replace(/import\s+Link\s+from\s+['"]next\/link['"];?/g, "import { Link } from 'react-router-dom';");
    
    // Replace next/image
    result = result.replace(/import\s+Image\s+from\s+['"]next\/image['"];?/g, "");
    // Replace <Image /> with <img />
    result = result.replace(/<Image/g, '<img');
    
    // Replace next/navigation useRouter
    result = result.replace(/import\s+\{\s*useRouter\s*\}\s+from\s+['"]next\/navigation['"];?/g, "import { useNavigate as useRouter } from 'react-router-dom';");
    result = result.replace(/router\.push\(/g, 'router('); // since useNavigate returns the function directly
    
    return result;
}

// Copy pages
function copyPages() {
    ensureDir('pages');
    
    // Map Next.js routes to component names
    const routesToPages = {
        'page.tsx': 'Home.tsx',
        'layout.tsx': 'Layout.tsx',
        'about/page.tsx': 'About.tsx',
        'about-us/page.tsx': 'AboutUs.tsx',
        'auth/login/page.tsx': 'Login.tsx',
        'auth/register/page.tsx': 'Register.tsx',
        'batches/page.tsx': 'Batches.tsx',
        'dashboard/page.tsx': 'Dashboard.tsx',
        'directory/page.tsx': 'Directory.tsx',
        'events/page.tsx': 'Events.tsx',
        'jobs/page.tsx': 'Jobs.tsx'
    };
    
    for (const [routePath, destName] of Object.entries(routesToPages)) {
        const srcPath = path.join(srcDir, 'app', ...routePath.split('/'));
        const destPath = path.join(destDir, 'pages', destName);
        
        if (fs.existsSync(srcPath)) {
            console.log(`Migrating page: ${srcPath} to ${destPath}`);
            let content = fs.readFileSync(srcPath, 'utf-8');
            content = replaceNextSpecifics(content);
            
            // Rename the default export slightly if it's generic "export default function Page()"
            content = content.replace(/export\s+default\s+function\s+([A-Za-z0-9_]*Page)?\s*\(/g, `export default function ${destName.replace('.tsx', '')}() `);
            content = content.replace(/export\s+default\s+function\s+Home\s*\(/g, `export default function ${destName.replace('.tsx', '')}() `);
            
            fs.writeFileSync(destPath, content);
        }
    }
}

function main() {
    console.log('Starting migration script...');
    copyComponents();
    copyPages();
    console.log('Migration complete!');
}

main();
