const fs = require('fs');
const path = require('path');
function walk(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('@alif/database')) {
        let newContent = content;
        if (content.includes('"use client"') || content.includes("'use client'")) {
          newContent = newContent.replace(/"@alif\/database"/g, '"@alif/database/client"');
        } else {
          newContent = newContent.replace(/"@alif\/database"/g, '"@alif/database/server"');
        }
        if (newContent !== content) {
          fs.writeFileSync(fullPath, newContent);
          console.log('Updated ' + fullPath);
        }
      }
    }
  }
}
walk('apps/web/src');
walk('apps/admin/src');
