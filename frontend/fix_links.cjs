const fs = require('fs');
const path = require('path');

const targets = [
    'D:\\\\Gradsync2.0\\\\frontend\\\\src\\\\components',
    'D:\\\\Gradsync2.0\\\\frontend\\\\src\\\\pages'
];

function fixRecursive(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            fixRecursive(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            // Replace <Link href=... with <Link to=...
            content = content.replace(/<Link([^>]*)\s+href=(['"{])/g, '<Link$1 to=$2');
            content = content.replace(/<Link([^>]*)\s+href=([^>]*)\s*>/g, '<Link$1 to=$2>');
            
            fs.writeFileSync(fullPath, content);
        }
    });
}

targets.forEach(t => fixRecursive(t));
console.log('Fixed Link components!');
