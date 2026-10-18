const fs = require('fs');
const file = 'src/pages/Home.tsx';
let content = fs.readFileSync(file, 'utf8');

// The Latest array
content = content.replace(
  /\{\s*title:\s*"Web cache deception",\s*labs:\s*"5 labs"\s*\}/,
  '{ title: "Web cache deception", slug: "web-cache-deception", labs: "5 labs" }'
).replace(
  /\{\s*title:\s*"Web LLM attacks",\s*labs:\s*"7 labs"\s*\}/,
  '{ title: "Web LLM attacks", slug: "web-llm-attacks", labs: "7 labs" }'
).replace(
  /\{\s*title:\s*"API testing",\s*labs:\s*"5 labs"\s*\}/,
  '{ title: "API testing", slug: "api-testing", labs: "5 labs" }'
).replace(
  /\{\s*title:\s*"NoSQL injection",\s*labs:\s*"4 labs"\s*\}/,
  '{ title: "NoSQL injection", slug: "nosql-injection", labs: "4 labs" }'
);

// The Featured array
content = content.replace(
  /\{\s*title:\s*"SQL injection",\s*labs:\s*"16 labs"\s*\}/,
  '{ title: "SQL injection", slug: "sql-injection", labs: "16 labs" }'
).replace(
  /\{\s*title:\s*"Cross-site scripting \\(XSS\\)",\s*labs:\s*"30 labs"\s*\}/,
  '{ title: "Cross-site scripting (XSS)", slug: "cross-site-scripting", labs: "30 labs" }'
).replace(
  /\{\s*title:\s*"Cross-site request forgery \\(CSRF\\)",\s*labs:\s*"8 labs"\s*\}/,
  '{ title: "Cross-site request forgery (CSRF)", slug: "cross-site-request-forgery", labs: "8 labs" }'
).replace(
  /\{\s*title:\s*"XXE injection",\s*labs:\s*"9 labs"\s*\}/,
  '{ title: "XXE injection", slug: "xxe-injection", labs: "9 labs" }'
);

// Replace mapping 1
content = content.replace(
  /<div key=\{i\} className="group bg-text-onyx /g,
  '<Link key={i} to={`/topics/${topic.slug}`} className="block group bg-text-onyx '
);

// Replace closing div of the map
content = content.replace(
  /<\/div>\n\s*\}\)\}/g,
  '</Link>\n              })}'
);

fs.writeFileSync(file, content);
