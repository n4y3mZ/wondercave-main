const fs = require('fs');

const pJSON = fs.readFileSync('data/pages.json', 'utf8');

let newInit = `
    public function init() {
        if (!file_exists($this->dir . '/users.json')) $this->write('users', json_decode('[{"id":1,"name":"Admin Lead","email":"admin@wondercave.nayem.net","password":"password123","role":"Enterprise"},{"id":2,"name":"Tester","email":"test@wondercave.nayem.net","password":"password123","role":"Pro"}]', true));
        if (!file_exists($this->dir . '/products.json')) $this->write('products', json_decode('[{"id":"1","title":"AI Diagnostics","valueProp":"Unify your enterprise data through trusted AI metadata.","description":"Securely connect every system, API, agent, and workflow with built-in governance at scale.","useCases":["Anomaly Detection","Risk Scoring","Data Semantics"],"icon":"Cpu"},{"id":"2","title":"Cloud Infrastructure","valueProp":"Secure, compliant, and high-performance foundation.","description":"Our infrastructure provides deployable assets for various technical and business use cases.","useCases":["Sandbox Environments","Load Balancing","High Availability"],"icon":"Cloud"},{"id":"3","title":"Enterprise CRM","valueProp":"Run your business from anywhere using modular AI tools.","description":"Our business data cloud makes even more impactful decisions with a fully managed SaaS solution.","useCases":["Lead Tracking","Sales Automation","Customer Success"],"icon":"Users"},{"id":"4","title":"WonderCave","valueProp":"Train your team on real-world vulnerabilities.","description":"Interactive labs, expert research, and tracking for enterprise security teams.","useCases":["Red Teaming","Compliance Training","Skill Tracking"],"icon":"Shield"}]', true));
        if (!file_exists($this->dir . '/leaderboard.json')) $this->write('leaderboard', json_decode('[{"id":"1","name":"Sarah Jenkins","role":"Software Engineer","points":24500,"avatar":"https://i.pravatar.cc/150?u=sarah&alt=avatar-sarah-xk9s"},{"id":"2","name":"Marcus Chen","role":"Culture Champion","points":21200,"avatar":"https://i.pravatar.cc/150?u=marcus&alt=avatar-marcus-mc98"},{"id":"3","name":"Elara Vance","role":"Lead Architect","points":19800,"avatar":"https://i.pravatar.cc/150?u=elara&alt=avatar-elara-ev11"},{"id":"4","name":"Tyrell Wellick","role":"Security Researcher","points":15400,"avatar":"https://i.pravatar.cc/150?u=tyrell&alt=avatar-tyrell-tw56"}]', true));
        if (!file_exists($this->dir . '/activity.json')) $this->write('activity', []);
        if (!file_exists($this->dir . '/announcement.json')) $this->write('announcement', json_decode('{"show":true,"message":"WonderCave — Free Cybersecurity Training, Now Live.","linkText":"Learn more ->","linkUrl":"#","backgroundColor":"bg-brand-primary","textColor":"text-white"}', true));
        if (!file_exists($this->dir . '/theme.json')) $this->write('theme', json_decode('{"brandPrimary":"#2563EB","actionIris":"#484DED","bgPeach":"#F3D9DA"}', true));
        if (!file_exists($this->dir . '/pages.json')) $this->write('pages', json_decode('${pJSON.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n')}', true));
    }
`;

const api = fs.readFileSync('backend/api.php', 'utf8');

let updatedApi = api.replace('    public function write($file, $data) {', newInit + '\n    public function write($file, $data) {');

// Add crud init and missing endpoints
updatedApi = updatedApi.replace('$crud = new JsonCRUD($DATA_DIR);', '$crud = new JsonCRUD($DATA_DIR);\n$crud->init();');

const extraEndpoints = `
        case 'theme':
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $crud->write('theme', $input);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode($crud->read('theme'));
            }
            break;

        case 'announcement':
            if ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true);
                $crud->write('announcement', $input);
                echo json_encode(['success' => true]);
            } else {
                echo json_encode($crud->read('announcement'));
            }
            break;

        case 'pages':
            echo json_encode($crud->read('pages'));
            break;
`;

updatedApi = updatedApi.replace("case 'products':", extraEndpoints + "\n        case 'products':");

fs.writeFileSync('backend/api.php', updatedApi);
