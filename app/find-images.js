const fs = require('fs');
const text = fs.readFileSync('C:/Users/Developer/.gemini/antigravity-ide/brain/af6a013c-af66-4165-88c0-2c36b2441ef7/.system_generated/steps/136/content.md', 'utf8');
const imgUrls = text.match(/https:\/\/maduvedibbana\.com\/wp-content\/uploads\/[^\s"'\>)]+/g);
if(imgUrls) {
  console.log([...new Set(imgUrls)].join('\n'));
} else {
  console.log("No images found");
}
