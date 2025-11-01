let currentPath = '/home/user';
let commandHistory = [];
let historyIndex = -1;
let currentFile = null;
let isEditorOpen = false;
let tabs = [];
let activeTabId = 'main';
let tabCounter = 1;
let isGalleryView = false;

const translations = {
    welcome: 'Welcome to my maker space! Type <span class="success">help</span> or test and explore!\nHit <span class="success">Non-Terminal View</span> to see my projects in a gallery view, or the red X to exit my maker page.',
    helpTitle: 'Available commands:',
    filesNav: 'Files and navigation:',
    lsDesc: '- List files and directories',
    cdDesc: '- Change directory',
    pwdDesc: '- Show current directory',
    catDesc: '- Display file content',
    viewDesc: '- View project details',
    projectsDesc: '- List all projects',
    grepDesc: '- Search in project descriptions',
    textEditor: 'Text editor:',
    system: 'System:',
    clearDesc: '- Clear screen',
    shortcuts: 'Shortcuts:',
    arrowKeys: '- Navigate history',
    tabKey: '- Autocompletion',
    fileNotFound: 'No such file or directory',
    notDirectory: 'Not a directory',
    isDirectory: 'Is a directory',
    fileExists: 'File exists',
    missingOperand: 'missing operand',
    commandNotFound: 'command not found',
};

// Projects data from old-maker.md
const projects = {
    'midnight-gunter': {
        name: 'PC: MidnightGunter',
        image: '/images/projects/midnight-gunter.jpg',
        description: 'specs: amd ryzen 9 9950x3d granite, gigabyte x870e aorus elite, asus 5070ti prime OC16gb, flare x5 series 2x 16gb, samsung 9100 pro 2tb, wd blue sn7100 1tb msi mag a850gl pcie5 850w plus gold atx, montech xr tempered glass midtower atx case',
        links: []
    },
    'reggie-tracker': {
        name: "Reggie's Wheel Tracker",
        image: '/images/projects/reggie.jpg',
        description: 'Magnetic reed switch + RPi Zero W + MQTT hosted on my homelab.',
        links: []
    },
    'oasis-homelab': {
        name: 'OASIS Homelab',
        image: '/images/projects/oasis.jpg',
        description: 'Pi5 (8gb ram), nvme base duo, 2x WD blue sn580 1tb = OASIS. (my user is parzival ;) )',
        links: []
    },
    'pcb-wall-art': {
        name: 'PCB Wall Art',
        image: '/images/projects/pcb-wall-art.jpeg',
        description: 'Salvaged parts from laptops and consoles mounted to a painted fence post. Gift to my fiance highlighting important geographical places for us.',
        links: []
    },
    'pcb-earrings': {
        name: 'PCB Earrings',
        image: '/images/projects/pcb-earrings.jpg',
        description: 'Leftover tiny PCBs became fun custom earrings.',
        links: []
    },
    'neon-light': {
        name: 'Neon Light Decoration',
        image: '/images/projects/circuitplayground.png',
        description: 'Fiber optics + NeoPixels + cardboard = hypnotic light show.',
        links: []
    },
    'relationship-clock': {
        name: 'Relationship Clock',
        image: '/images/projects/counter.png',
        description: 'LCD display counting minutes since we started dating. :)',
        links: []
    },
    'ornaments': {
        name: '3D Printed Ornaments',
        image: '/images/projects/ornaments-2.png',
        description: 'Custom-designed in TinkerCad & printed with filament swap layers for friends and family.',
        links: []
    },
    'rick-robot': {
        name: 'Rick Robot',
        image: '/images/projects/rickrobot.png',
        description: 'Autonomous rover using Pi + CV + voice to fetch objects.',
        links: [
            { text: 'Hack Club Hardware Grant', url: 'https://summer.hackclub.com/' },
            { text: 'Adafruit Show & Tell', url: 'https://youtu.be/aRzoo11jABo' }
        ]
    },
    'tesla-ticker': {
        name: '$TSLA Stock Ticker',
        image: '/images/projects/tesla.png',
        description: 'Pi Zero W with LCD1602 pulling data from a stock API in real time.',
        links: []
    },
    'room-sensor': {
        name: 'Room Sensor',
        image: '/images/projects/sense.png',
        description: 'LED-based "traffic light" feedback on temp/humidity from SHT40.',
        details: 'Green = Good\nYellow = Fair\nRed = Bad\nWhite = Error',
        links: []
    }
};

// Simple translation helper (returns translation or the key)
function t(key) {
    return translations[key] || key;
}

let fileSystem = {
    '/': {
        type: 'directory',
        children: {
            'home': {
                type: 'directory',
                children: {
                    'user': {
                        type: 'directory',
                        children: {
                            'projects': {
                                type: 'directory',
                                children: Object.keys(projects).reduce((acc, key) => {
                                    acc[key] = {
                                        type: 'file',
                                        content: projects[key].description,
                                        project: key
                                    };
                                    return acc;
                                }, {})
                            },
                            'readme.md': { 
                                type: 'file', 
                                content: 'Welcome to my maker space!\n\nTry these commands:\n- ls projects        : See all my projects\n- view [project]     : View project details\n- grep [term]       : Search projects\n- help              : Show all commands'
                            }
                        }
                    }
                }
            }
        }
    }
};

const terminal = document.getElementById('terminal');
const output = document.getElementById('output');
const commandInput = document.getElementById('commandInput');
const prompt = document.getElementById('prompt');
const viewToggleBtn = document.getElementById('viewToggle');

const commands = {
    help: () => `${t('helpTitle')}

    ${t('filesNav')}
    ls [path]       ${t('lsDesc')}
    cd [path]       ${t('cdDesc')}
    pwd             ${t('pwdDesc')}
    cat [file]      ${t('catDesc')}
    view [project]   ${t('viewDesc')}
    projects        ${t('projectsDesc')}
    grep [term]     ${t('grepDesc')}
    
    ${t('system')}
    clear           ${t('clearDesc')}

    ${t('shortcuts')}
    ↑/↓            ${t('arrowKeys')}
    Tab            ${t('tabKey')}`,
    
    projects: () => {
        const projectList = Object.keys(projects).map(key => 
            `<span class="info">${projects[key].name.toLowerCase().replace(/\s+/g, '-')}</span>`
        ).join('  ');
        return `Available projects:\n\n${projectList}\n\nTry: <span class="success">view [project-name]</span> or <span class="success">cat projects/[name]</span>`;
    },
    
    view: (args) => {
        if (!args.trim()) return `view: ${t('missingOperand')}\nTry: <span class="info">view midnight-gunter</span> or <span class="info">view rick-robot</span>`;
        
        const projectKey = args.trim().toLowerCase();
        const project = projects[projectKey];
        
        if (!project) {
            const matches = Object.keys(projects).filter(k => k.includes(projectKey) || projects[k].name.toLowerCase().includes(projectKey));
            if (matches.length === 0) {
                return `<span class="error">Project not found: ${projectKey}</span>\nTry: <span class="info">projects</span> to see all available projects`;
            }
            if (matches.length === 1) {
                showProjectCard(projects[matches[0]]);
                return '';
            }
            return `Multiple matches: ${matches.map(m => projects[m].name).join(', ')}\nBe more specific!`;
        }
        
        showProjectCard(project);
        return '';
    },
    
    grep: (args) => {
        if (!args.trim()) return `grep: ${t('missingOperand')}\nUsage: grep [search-term]`;
        
        const searchTerm = args.trim().toLowerCase();
        const matches = Object.entries(projects).filter(([key, proj]) => 
            proj.description.toLowerCase().includes(searchTerm) || 
            proj.name.toLowerCase().includes(searchTerm)
        );
        
        if (matches.length === 0) {
            return `No projects found matching "${searchTerm}"`;
        }
        
        return matches.map(([key, proj]) => 
            `<span class="info">${proj.name.toLowerCase().replace(/\s+/g, '-')}</span>: ${proj.description}`
        ).join('\n\n');
    },

    ls: (args = '') => {
        const targetPath = resolveRelativePath(args.trim() || currentPath);
        const dir = getDirectoryAtPath(targetPath);
        
        if (!dir) return `ls: ${targetPath}: ${t('fileNotFound')}`;
        if (dir.type !== 'directory') return `ls: ${targetPath}: ${t('notDirectory')}`;
        
        const items = Object.entries(dir.children).map(([name, item]) => {
            if (item.type === 'directory') {
                return `<span class="info">${name}/</span>`;
            } else {
                return `<span class="success">${name}</span>`;
            }
        });
        
        return items.length > 0 ? items.join('  ') : '';
    },

    cd: (args) => {
        if (!args.trim()) {
            currentPath = '/home/user';
            updatePrompt();
            return '';
        }
        
        const targetPath = resolveRelativePath(args.trim());
        const dir = getDirectoryAtPath(targetPath);
        
        if (!dir) return `cd: ${targetPath}: ${t('fileNotFound')}`;
        if (dir.type !== 'directory') return `cd: ${targetPath}: ${t('notDirectory')}`;
        
        currentPath = targetPath;
        updatePrompt();
        return '';
    },

    pwd: () => currentPath,

    cat: (args) => {
        if (!args.trim()) return `cat: ${t('missingOperand')}`;
        
        const targetPath = resolveRelativePath(args.trim());
        const file = getDirectoryAtPath(targetPath);
        
        if (!file) return `cat: ${targetPath}: ${t('fileNotFound')}`;
        if (file.type !== 'file') return `cat: ${targetPath}: ${t('isDirectory')}`;
        
        return file.content || '';
    },

    clear: () => {
        output.innerHTML = '';
        return '';
    },

    // TODO: add in some easter eggs! or maybe some more commands....
};

 
function resolveRelativePath(path) {
    if (path.startsWith('/')) return path;
    if (path === '..') {
        const parts = currentPath.split('/').filter(p => p);
        parts.pop();
        return '/' + parts.join('/');
    }
    if (path === '.') return currentPath;
    return currentPath === '/' ? `/${path}` : `${currentPath}/${path}`;
}

function getDirectoryAtPath(path) {
    if (path === '/') return fileSystem['/'];
    
    const parts = path.split('/').filter(p => p);
    let current = fileSystem['/'];
    
    for (const part of parts) {
        if (!current.children || !current.children[part]) return null;
        current = current.children[part];
    }
    
    return current;
}

function getCompletions(input) {
    const parts = input.trim().split(' ');
    const command = parts[0];
    const arg = parts[parts.length - 1] || '';
    
    if (parts.length === 1) {
        return Object.keys(commands).filter(cmd => cmd.startsWith(command));
    }
    
    if (['ls', 'cd', 'cat'].includes(command)) {
        const currentDir = getDirectoryAtPath(currentPath);
        if (currentDir && currentDir.children) {
            return Object.keys(currentDir.children).filter(name => name.startsWith(arg));
        }
    }
    
    if (command === 'view') {
        return Object.keys(projects).filter(key => key.startsWith(arg.toLowerCase()));
    }
    
    return [];
}

 
function executeCommand(commandLine) {
    if (!commandLine.trim()) return;

    const [command, ...args] = commandLine.trim().split(' ');
    const argString = args.join(' ');

    commandHistory.push(commandLine);
    historyIndex = -1;
 
    const commandDiv = document.createElement('div');
    commandDiv.className = 'command-line';
    commandDiv.innerHTML = `<span class="prompt">${getPromptText()}</span>${commandLine}`;
    output.appendChild(commandDiv);

    let result;
    if (commands[command]) {
        result = commands[command](argString);
    } else {
        result = `<span class="error">bash: ${command}: ${t('commandNotFound')}</span>`;
    }

    if (result && command !== 'clear') {
        const outputDiv = document.createElement('div');
        outputDiv.className = 'command-output';
        outputDiv.innerHTML = result;
        output.appendChild(outputDiv);
    }

    // Auto-scroll to keep input visible
    scrollToInput();
}

// Scroll terminal to keep input line visible
function scrollToInput() {
    const terminalContent = document.querySelector('.terminal-content');
    const inputLine = document.querySelector('.input-line');
    
    if (terminalContent && inputLine) {
        setTimeout(() => {
            // Scroll to bottom so input line is always visible
            terminalContent.scrollTop = terminalContent.scrollHeight;
        }, 10);
    }
}

function updatePrompt() {
    prompt.textContent = getPromptText();
}

function getPromptText() {
    const pathDisplay = currentPath.replace('/home/user', '~');
    return `maker@juliagersey:${pathDisplay}$ `;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `command-output ${type}`;
    notification.textContent = message;
    output.appendChild(notification);
    output.scrollTop = output.scrollHeight;
}

// Event handlers
function setupEventListeners() {
    // Close button - navigate away from maker page
    const closeBtn = document.querySelector('.control-btn.close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Navigate to home page or main site
            window.location.href = '/';
        });
    }
    
    commandInput.addEventListener('keydown', (e) => {
        if (isEditorOpen) return;

        if (e.key === 'Enter') {
            e.preventDefault();
            executeCommand(commandInput.value);
            commandInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                if (historyIndex === -1) historyIndex = commandHistory.length - 1;
                else historyIndex = Math.max(0, historyIndex - 1);
                commandInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                historyIndex++;
                if (historyIndex >= commandHistory.length) {
                    historyIndex = -1;
                    commandInput.value = '';
                } else {
                    commandInput.value = commandHistory[historyIndex];
                }
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const completions = getCompletions(commandInput.value);
            if (completions.length === 1) {
                const parts = commandInput.value.trim().split(' ');
                if (parts.length === 1) {
                    commandInput.value = completions[0] + ' ';
                } else {
                    parts[parts.length - 1] = completions[0];
                    commandInput.value = parts.join(' ') + ' ';
                }
            }
        }
    });
    
    // View toggle button - switch to gallery/non-terminal view
    if (viewToggleBtn) {
        viewToggleBtn.addEventListener('click', toggleGalleryView);
    }

}

function init() {
    setupEventListeners();
    updatePrompt();
    
    tabs.push('main');
    activeTabId = 'main';
    
    document.querySelector('[data-tab="main"]').addEventListener('click', () => {
        switchTab('main');
    });
    
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'command-output info';
    welcomeDiv.innerHTML = t('welcome');
    output.appendChild(welcomeDiv);
    scrollToInput();
    commandInput.focus();
}

function createTab(tabId, title, content) {
    const tabsContainer = document.querySelector('.tabs-container');
    const tab = document.createElement('div');
    tab.className = 'tab active';
    tab.setAttribute('data-tab', tabId);
    tab.innerHTML = `
        <span class="tab-title">${title}</span>
        <span class="tab-close">×</span>
    `;
    
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tabsContainer.appendChild(tab); 
    const terminalContent = document.querySelector('.terminal-content');
    const tabContent = document.createElement('div');
    tabContent.className = 'tab-content';
    tabContent.id = `tab-content-${tabId}`;
    tabContent.style.display = 'none';
    tabContent.innerHTML = content;
    terminalContent.appendChild(tabContent);
    
    switchTab(tabId);
    
    tab.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(tabId);
    });
    
    tab.addEventListener('click', () => {
        switchTab(tabId);
    });
    
    tabs.push(tabId);
    return tabId;
}

function switchTab(tabId) {
    activeTabId = tabId;
    
    document.querySelectorAll('.tab').forEach(t => {
        if (t.getAttribute('data-tab') === tabId) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });
    
    document.querySelectorAll('.tab-content').forEach(tc => {
        tc.style.display = 'none';
    });
    
    const output = document.getElementById('output');
    const inputLine = document.querySelector('.input-line');
    
    if (tabId === 'main') {
        output.style.display = 'block';
        inputLine.style.display = 'flex';
        scrollToInput();
        commandInput.focus();
    } else {
        output.style.display = 'none';
        inputLine.style.display = 'none';
        const activeContent = document.getElementById(`tab-content-${tabId}`);
        if (activeContent) {
            activeContent.style.display = 'block';
        }
    }
}

function closeTab(tabId) {
    if (tabId === 'main') return; // Can't close main tab by design
    
    const tab = document.querySelector(`[data-tab="${tabId}"]`);
    if (tab) tab.remove();
    const content = document.getElementById(`tab-content-${tabId}`);
    if (content) content.remove();
    tabs = tabs.filter(id => id !== tabId);
    if (activeTabId === tabId) {
        switchTab('main');
    }
}

function showProjectCard(project) {
    const tabId = `project-${tabCounter++}`;
    let content = `<div class="project-tab-content">`;
    content += `<div class="project-header">`;
    content += `<h2 class="project-title">${project.name}</h2>`;
    if (project.image) {
        content += `<img src="${project.image}" alt="${project.name}" class="project-image" onerror="this.style.display='none'">`;
    }
    content += `</div>`;
    content += `<div class="project-description">${project.description}</div>`;
    
    if (project.details) {
        content += `<div class="project-details">${project.details.replace(/\n/g, '<br>')}</div>`;
    }
    
    if (project.links && project.links.length > 0) {
        content += `<div class="project-links">`;
        project.links.forEach(link => {
            content += `<a href="${link.url}" target="_blank" class="project-link">→ ${link.text}</a>`;
        });
        content += `</div>`;
    }
    content += `</div>`;
    
    createTab(tabId, project.name, content);
    
    return ''; // return empty so command doesn't show extra text
}

function toggleGalleryView() {
    isGalleryView = !isGalleryView;
    
    const terminalWindow = document.querySelector('.terminal-window');
    const viewToggleBtn = document.getElementById('viewToggle');
    const gallery = document.getElementById('gallery-view');
    
    if (isGalleryView) {
        terminalWindow.style.display = 'none';
        if (viewToggleBtn) {
            viewToggleBtn.style.display = 'none';
        }
        
        if (gallery) {
            gallery.innerHTML = `
                <div class="gallery-controls">
                    <button class="gallery-btn" id="galleryHomeBtn" onclick="window.location.href='/'">← Return to Homepage</button>
                    <button class="gallery-btn" id="galleryTerminalBtn" onclick="toggleGalleryView()">Terminal View →</button>
                </div>
                <div class="gallery-header">
                    <h2>My Maker Projects</h2>
                    <p>Outside of research, I love 3D printing, tinkering (& breaking things...) with my homelab, hooking up new sensors for my hedgehog's <i>smart home</i>, repurposing old tech as futuristic decor, and building whatever I can get my hands on.</p>
                </div>
                <div class="gallery-grid">
                    ${Object.values(projects).map(project => `
                        <div class="gallery-card">
                            <img src="${project.image}" alt="${project.name}" onerror="this.style.display='none'">
                            <div class="gallery-card-content">
                                <h3>${project.name}</h3>
                                <p>${project.description}</p>
                                ${project.details ? `<p class="gallery-details">${project.details.replace(/\n/g, '<br>')}</p>` : ''}
                                ${project.links && project.links.length > 0 ? `
                                    <div class="gallery-links">
                                        ${project.links.map(link => `<a href="${link.url}" target="_blank">${link.text}</a>`).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            gallery.style.display = 'block';
        }
    } else {
        terminalWindow.style.display = 'block';
        if (viewToggleBtn) {
            viewToggleBtn.style.display = 'block';
        }
        if (gallery) {
            gallery.style.display = 'none';
        }
        commandInput.focus();
        scrollToInput();
    }
}

document.addEventListener('DOMContentLoaded', init); 