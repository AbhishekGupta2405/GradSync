const fs = require('fs');
const path = require('path');

const pagesDir = 'D:\\\\Gradsync2.0\\\\frontend\\\\src\\\\pages';

const files = fs.readdirSync(pagesDir);

files.forEach(file => {
    if (file.endsWith('.tsx')) {
        const filePath = path.join(pagesDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(/\(\) \)/g, '()');
        fs.writeFileSync(filePath, content);
        console.log('Fixed', file);
    }
});
