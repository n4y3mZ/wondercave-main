const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Update fetch calls for GET requests
      let newContent = content.replace(/'\/api\/([^']+)'/g, "'/backend/api.php?action=$1'");
      newContent = newContent.replace(/"\/api\/([^"]+)"/g, '"/backend/api.php?action=$1"');
      newContent = newContent.replace(/`\/api\/([^`]+)`/g, '`/backend/api.php?action=$1`');

      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log("Updated", fullPath);
      }
    }
  }
}

processDir('src');
console.log("Done");
