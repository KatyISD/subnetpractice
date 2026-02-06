// IP Address Calculation Functions
class IPCalculator {
    static ipToNumber(ip) {
        const octets = ip.split('.').map(Number);
        // Use >>> 0 to ensure unsigned 32-bit integer
        return ((octets[0] << 24) >>> 0) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
    }

    static numberToIP(num) {
        return [
            (num >>> 24) & 255,
            (num >>> 16) & 255,
            (num >>> 8) & 255,
            num & 255
        ].join('.');
    }

    static cidrToMask(cidr) {
        const mask = ~((1 << (32 - cidr)) - 1);
        return this.numberToIP(mask >>> 0);
    }

    static maskToCIDR(mask) {
        const octets = mask.split('.').map(Number);
        const binary = octets.map(octet => octet.toString(2).padStart(8, '0')).join('');
        return binary.split('1').length - 1;
    }

    static validateIP(ip) {
        const parts = ip.split('.');
        if (parts.length !== 4) return false;
        return parts.every(part => {
            const num = Number(part);
            return num >= 0 && num <= 255 && part === num.toString();
        });
    }

    static validateMask(mask) {
        if (!this.validateIP(mask)) return false;
        const num = this.ipToNumber(mask);
        const binary = num.toString(2).padStart(32, '0');
        return /^1*0*$/.test(binary);
    }

    static parseMask(input) {
        input = input.trim();
        if (input.startsWith('/')) {
            const cidr = parseInt(input.substring(1));
            if (cidr >= 0 && cidr <= 32) {
                return this.cidrToMask(cidr);
            }
        } else if (this.validateIP(input) && this.validateMask(input)) {
            return input;
        }
        return null;
    }

    static calculate(ip, mask) {
        const ipNum = this.ipToNumber(ip);
        const maskNum = this.ipToNumber(mask);
        const wildcardNum = ~maskNum >>> 0;
        
        const networkNum = (ipNum & maskNum) >>> 0;
        const broadcastNum = (networkNum | wildcardNum) >>> 0;
        const firstNum = networkNum + 1;
        const lastNum = broadcastNum - 1;
        const cidr = this.maskToCIDR(mask);
        const hostBits = 32 - cidr;
        const availableHosts = hostBits <= 1 ? (hostBits === 1 ? 2 : 1) : Math.pow(2, hostBits) - 2;

        return {
            network: this.numberToIP(networkNum),
            broadcast: this.numberToIP(broadcastNum),
            first: this.numberToIP(firstNum),
            last: this.numberToIP(lastNum),
            available: availableHosts,
            mask: mask,
            cidr: '/' + cidr,
            wildcard: this.numberToIP(wildcardNum)
        };
    }

    static toBinary(ip) {
        return ip.split('.').map(octet => 
            parseInt(octet).toString(2).padStart(8, '0')
        ).join('.');
    }

    static generateRandomIP(difficulty) {
        let cidr;
        switch(difficulty) {
            case 'classful':
                // Only /8, /16, or /24 (octet boundaries)
                const classfulOptions = [8, 16, 24];
                cidr = classfulOptions[Math.floor(Math.random() * classfulOptions.length)];
                break;
            case 'easy':
                cidr = 24 + Math.floor(Math.random() * 7); // /24 to /30
                break;
            case 'medium':
                cidr = 16 + Math.floor(Math.random() * 15); // /16 to /30
                break;
            case 'hard':
                cidr = 8 + Math.floor(Math.random() * 23); // /8 to /30
                break;
            case 'mixed':
            default:
                cidr = 8 + Math.floor(Math.random() * 23);
                break;
        }

        const octet1 = Math.floor(Math.random() * 223) + 1; // Avoid 0, 224-255
        const octet2 = Math.floor(Math.random() * 256);
        const octet3 = Math.floor(Math.random() * 256);
        const octet4 = Math.floor(Math.random() * 254) + 1; // Avoid 0 and 255

        return {
            ip: `${octet1}.${octet2}.${octet3}.${octet4}`,
            mask: this.cidrToMask(cidr),
            cidr: cidr
        };
    }
}

// UI Controller
class UIController {
    constructor() {
        this.currentMode = 'calculator';
        this.currentProblem = null;
        this.score = 0;
        this.total = 0;
        this.initEventListeners();
    }

    initEventListeners() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchMode(e.target.dataset.mode));
        });

        // Calculator mode
        document.getElementById('calc-btn').addEventListener('click', () => this.handleCalculate());
        document.getElementById('clear-calc-btn').addEventListener('click', () => this.clearCalculator());
        document.getElementById('show-binary').addEventListener('change', (e) => this.toggleBinary(e.target.checked));
        
        // Enter key for calculator
        document.getElementById('calc-ip').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleCalculate();
        });
        document.getElementById('calc-mask').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleCalculate();
        });

        // Practice mode
        document.getElementById('generate-btn').addEventListener('click', () => this.generateProblem());
        document.getElementById('check-btn').addEventListener('click', () => this.checkAnswers());
        document.getElementById('next-btn').addEventListener('click', () => this.nextProblem());

        // Enter key for practice inputs
        ['ans-network', 'ans-broadcast', 'ans-first', 'ans-last', 'ans-available'].forEach(id => {
            document.getElementById(id).addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.checkAnswers();
            });
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        document.querySelectorAll('.mode-section').forEach(section => {
            section.classList.toggle('active', section.id === `${mode}-mode`);
        });
    }

    handleCalculate() {
        const ip = document.getElementById('calc-ip').value.trim();
        const maskInput = document.getElementById('calc-mask').value.trim();
        const errorEl = document.getElementById('calc-error');

        errorEl.textContent = '';

        if (!ip || !maskInput) {
            errorEl.textContent = 'Please enter both IP address and subnet mask.';
            return;
        }

        if (!IPCalculator.validateIP(ip)) {
            errorEl.textContent = 'Invalid IP address format. Use xxx.xxx.xxx.xxx (0-255 for each octet).';
            return;
        }

        const mask = IPCalculator.parseMask(maskInput);
        if (!mask) {
            errorEl.textContent = 'Invalid subnet mask. Use dotted decimal (e.g., 255.255.255.0) or CIDR (e.g., /24).';
            return;
        }

        const results = IPCalculator.calculate(ip, mask);
        this.displayResults(results);
    }

    displayResults(results) {
        document.getElementById('result-network').textContent = results.network;
        document.getElementById('result-broadcast').textContent = results.broadcast;
        document.getElementById('result-first').textContent = results.first;
        document.getElementById('result-last').textContent = results.last;
        document.getElementById('result-available').textContent = results.available;
        document.getElementById('result-mask').textContent = results.mask;
        document.getElementById('result-cidr').textContent = results.cidr;
        document.getElementById('result-wildcard').textContent = results.wildcard;

        document.getElementById('calc-results').style.display = 'block';

        if (document.getElementById('show-binary').checked) {
            this.displayBinary(results);
        }
    }

    displayBinary(results) {
        const binaryDisplay = document.getElementById('binary-display');
        binaryDisplay.innerHTML = `
            <div class="binary-row">
                <span class="binary-label">IP Address:</span>
                <span class="binary-value">${IPCalculator.toBinary(document.getElementById('calc-ip').value)}</span>
            </div>
            <div class="binary-row">
                <span class="binary-label">Subnet Mask:</span>
                <span class="binary-value">${IPCalculator.toBinary(results.mask)}</span>
            </div>
            <div class="binary-row">
                <span class="binary-label">Network Address:</span>
                <span class="binary-value">${IPCalculator.toBinary(results.network)}</span>
            </div>
            <div class="binary-row">
                <span class="binary-label">Broadcast Address:</span>
                <span class="binary-value">${IPCalculator.toBinary(results.broadcast)}</span>
            </div>
        `;
    }

    toggleBinary(show) {
        const binarySection = document.getElementById('binary-section');
        if (show && document.getElementById('calc-results').style.display !== 'none') {
            const ip = document.getElementById('calc-ip').value.trim();
            const maskInput = document.getElementById('calc-mask').value.trim();
            if (ip && maskInput) {
                const mask = IPCalculator.parseMask(maskInput);
                const results = IPCalculator.calculate(ip, mask);
                this.displayBinary(results);
                binarySection.style.display = 'block';
            }
        } else {
            binarySection.style.display = 'none';
        }
    }

    clearCalculator() {
        document.getElementById('calc-ip').value = '';
        document.getElementById('calc-mask').value = '';
        document.getElementById('calc-error').textContent = '';
        document.getElementById('calc-results').style.display = 'none';
        document.getElementById('binary-section').style.display = 'none';
        document.getElementById('show-binary').checked = false;
    }

    generateProblem() {
        const difficulty = document.getElementById('difficulty').value;
        const problem = IPCalculator.generateRandomIP(difficulty);
        this.currentProblem = IPCalculator.calculate(problem.ip, problem.mask);

        document.getElementById('problem-display').innerHTML = `
            <p>📝 Calculate the network parameters for:</p>
            <p style="font-size: 1.4rem; margin-top: 10px;">
                IP: <strong>${problem.ip}</strong> &nbsp;|&nbsp; Subnet: <strong>${problem.mask}</strong> (<strong>/${problem.cidr}</strong>)
            </p>
        `;

        // Clear previous answers
        ['ans-network', 'ans-broadcast', 'ans-first', 'ans-last', 'ans-available'].forEach(id => {
            const input = document.getElementById(id);
            input.value = '';
            input.classList.remove('correct', 'incorrect');
        });

        document.getElementById('practice-inputs').style.display = 'block';
        document.getElementById('practice-feedback').style.display = 'none';
    }

    checkAnswers() {
        if (!this.currentProblem) return;

        const answers = {
            network: document.getElementById('ans-network').value.trim(),
            broadcast: document.getElementById('ans-broadcast').value.trim(),
            first: document.getElementById('ans-first').value.trim(),
            last: document.getElementById('ans-last').value.trim(),
            available: document.getElementById('ans-available').value.trim()
        };

        const correct = {
            network: answers.network === this.currentProblem.network,
            broadcast: answers.broadcast === this.currentProblem.broadcast,
            first: answers.first === this.currentProblem.first,
            last: answers.last === this.currentProblem.last,
            available: answers.available === this.currentProblem.available.toString()
        };

        // Update input styling
        Object.keys(correct).forEach(key => {
            const input = document.getElementById(`ans-${key}`);
            input.classList.remove('correct', 'incorrect');
            input.classList.add(correct[key] ? 'correct' : 'incorrect');
        });

        // Display feedback
        this.displayFeedback(answers, correct);

        // Update score
        const allCorrect = Object.values(correct).every(v => v);
        this.total++;
        if (allCorrect) this.score++;
        this.updateScore();
    }

    displayFeedback(answers, correct) {
        const feedbackContent = document.getElementById('feedback-content');
        const allCorrect = Object.values(correct).every(v => v);

        let html = allCorrect 
            ? '<div style="text-align: center; padding: 20px; background: #f0fdf4; border-radius: 8px; margin-bottom: 15px;"><h3 style="color: #10b981; margin: 0;">🎉 Perfect! All answers correct!</h3></div>'
            : '<div style="text-align: center; padding: 15px; background: #fef2f2; border-radius: 8px; margin-bottom: 15px;"><h4 style="color: #ef4444; margin: 0;">Some answers need correction. See below:</h4></div>';

        const fields = [
            { key: 'network', label: 'Network Address' },
            { key: 'broadcast', label: 'Broadcast Address' },
            { key: 'first', label: 'First Available IP' },
            { key: 'last', label: 'Last Available IP' },
            { key: 'available', label: 'Available Hosts' }
        ];

        fields.forEach(field => {
            const isCorrect = correct[field.key];
            html += `
                <div class="feedback-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div>
                        <div class="feedback-label">${field.label}</div>
                        <div class="feedback-answer">Your answer: ${answers[field.key] || '(empty)'}</div>
                        ${!isCorrect ? `<div class="correct-answer">Correct: ${this.currentProblem[field.key]}</div>` : ''}
                    </div>
                </div>
            `;
        });

        feedbackContent.innerHTML = html;
        document.getElementById('practice-feedback').style.display = 'block';
    }

    updateScore() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('total').textContent = this.total;
        const percentage = this.total > 0 ? Math.round((this.score / this.total) * 100) : 0;
        document.getElementById('percentage').textContent = percentage + '%';
    }

    nextProblem() {
        this.generateProblem();
        document.getElementById('practice-feedback').style.display = 'none';
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});