# IP Address Practice Tool for AP Networking Students

A comprehensive web-based tool designed to help AP Networking students master IP address calculations, including network addresses, broadcast addresses, and host IP ranges.

## 🎯 Features

### Calculator Mode
- Calculate all network parameters from any IP address and subnet mask
- Support for both dotted decimal notation (255.255.255.0) and CIDR notation (/24)
- Display of:
  - Network Address
  - Broadcast Address
  - First Available Host IP
  - Last Available Host IP
  - Number of Available Hosts
  - Subnet Mask (both formats)
  - Wildcard Mask
- Binary representation toggle for educational purposes

### Practice Mode
- Generate random IP/subnet problems
- Four difficulty levels:
  - **Easy**: Class C networks (/24 to /30)
  - **Medium**: Class B & C networks (/16 to /30)
  - **Hard**: All classes (/8 to /30)
  - **Mixed**: Random from all ranges
- Instant answer validation with visual feedback
- Score tracking and percentage display
- Detailed feedback showing correct answers

## 🚀 Getting Started

### Installation
1. Download all files to a folder:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

2. Open `index.html` in any modern web browser

No server, build process, or dependencies required!

## 📖 How to Use

### Calculator Mode
1. Enter an IP address (e.g., `192.168.1.45`)
2. Enter a subnet mask in either format:
   - Dotted decimal: `255.255.255.0`
   - CIDR notation: `/24`
3. Click **Calculate** to see all network parameters
4. Optional: Check **Show Binary** to see binary representations
5. Click **Clear** to start over

### Practice Mode
1. Select your difficulty level
2. Click **Generate Problem** to get a random IP/subnet combination
3. Calculate and enter your answers for all five fields:
   - Network Address
   - Broadcast Address
   - First Available IP
   - Last Available IP
   - Number of Available Hosts
4. Click **Check Answers** to see your results
5. Review feedback (green = correct, red = incorrect)
6. Click **Next Problem** to continue practicing

## 💡 Subnetting Quick Reference

### Key Concepts
- **Network Address**: First IP in the subnet (all host bits = 0)
- **Broadcast Address**: Last IP in the subnet (all host bits = 1)
- **First Available Host**: Network address + 1
- **Last Available Host**: Broadcast address - 1
- **Available Hosts**: 2^(host bits) - 2

### Common CIDR Notations
| CIDR | Subnet Mask | Total IPs | Available Hosts |
|------|-------------|-----------|-----------------|
| /24  | 255.255.255.0 | 256 | 254 |
| /25  | 255.255.255.128 | 128 | 126 |
| /26  | 255.255.255.192 | 64 | 62 |
| /27  | 255.255.255.224 | 32 | 30 |
| /28  | 255.255.255.240 | 16 | 14 |
| /29  | 255.255.255.248 | 8 | 6 |
| /30  | 255.255.255.252 | 4 | 2 |

## 🧮 Example Calculations

### Example 1: Class C Network
**Given**: IP = `192.168.1.45`, Mask = `255.255.255.0` (/24)

**Results**:
- Network: `192.168.1.0`
- Broadcast: `192.168.1.255`
- First Available: `192.168.1.1`
- Last Available: `192.168.1.254`
- Available Hosts: `254`

### Example 2: Smaller Subnet
**Given**: IP = `10.20.30.40`, Mask = `255.255.255.240` (/28)

**Results**:
- Network: `10.20.30.32`
- Broadcast: `10.20.30.47`
- First Available: `10.20.30.33`
- Last Available: `10.20.30.46`
- Available Hosts: `14`

### Example 3: Class B Network
**Given**: IP = `172.16.50.100`, Mask = `255.255.255.192` (/26)

**Results**:
- Network: `172.16.50.64`
- Broadcast: `172.16.50.127`
- First Available: `172.16.50.65`
- Last Available: `172.16.50.126`
- Available Hosts: `62`

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks or libraries required

### Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers supported

### Features
- Fully responsive design (works on phones, tablets, desktops)
- Keyboard navigation support
- Input validation with helpful error messages
- Clean, educational interface
- No external dependencies

## 📱 Mobile Support
The tool is fully responsive and works great on mobile devices. The layout automatically adjusts for smaller screens.

## 🎓 Educational Resources

### Learning Subnetting
- [Subnet Calculator](https://www.subnet-calculator.com/)
- [Cisco Networking Academy](https://www.netacad.com/)
- [Professor Messer's Subnetting Videos](https://www.professormesser.com/)

### Practice Tips
1. Start with easy problems (/24 to /30)
2. Master the binary method for understanding
3. Learn to recognize common subnet sizes
4. Practice calculating in your head
5. Use the calculator mode to verify your work

## 🤝 Contributing
This tool was created for AP Networking students. Feel free to modify and enhance it for your classroom needs!

## 📄 License
Free to use for educational purposes.

## ✨ Tips for Success
1. **Understand the concepts**: Don't just memorize formulas
2. **Practice regularly**: Use the practice mode daily
3. **Learn binary**: Understanding binary makes subnetting easier
4. **Start simple**: Master /24, /25, /26 before moving to harder subnets
5. **Use the calculator**: Verify your work and learn from mistakes

---

**Created for AP Networking Students** | Practice makes perfect! 🎯