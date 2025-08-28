# Z80 CPU Emulator with CP/M 2.2

A Zilog Z80 CPU emulator that runs CP/M 2.2 in modern web browsers. This emulator has been updated to use IndexedDB instead of the deprecated Web SQL Database API, making it compatible with all modern browsers.

## 🌟 Live Demo

**Try it now:** https://cpm.retrogamecoders.com

## ✨ Features

### 🚀 Auto-Boot Experience
- **Instant CP/M 2.2** - Boots automatically on page load
- **Pre-loaded Microsoft BASIC** - Ready for programming immediately
- **No manual setup** - Just open the page and start computing

### 💾 Visual Disk Management
- **Retro floppy disk icons** - Authentic green-on-black aesthetic
- **Drive A (locked)** - Boot disk, visually dimmed and non-interactive
- **Drives B/C/D (interactive)** - Click to mount, drag-and-drop support
- **Real-time status** - Shows mounted disk names and status

### 🖥️ Terminal Emulation
- **VT52 font** - Authentic retro terminal appearance
- **Green-on-black theme** - Classic CP/M aesthetic
- **Proper line feeding** - Correct terminal behavior
- **80x24 display** - Standard CP/M terminal dimensions

### 🔧 Technical Features
- **Full Z80 CPU emulation** - Complete instruction set support
- **IndexedDB storage** - Modern browser compatibility
- **Persistent disk storage** - Your disks survive browser restarts
- **Drag-and-drop support** - Mount your own disk images

## 🎮 Quick Start

### For Users
1. **Visit** https://cpm.retrogamecoders.com
2. **Wait** for auto-boot to complete (CP/M loads automatically)
3. **Start programming** - Type `B:MBASIC` to enter Microsoft BASIC
4. **Mount additional disks** - Click any drive icon (B/C/D) to open disk manager

### For Developers
1. **Clone the repository**
2. **Start a local web server** (required for full functionality)
3. **Open** `index.html` in your browser
4. **Test features** with local disk images

## 💾 Disk Management

### Visual Drive Interface
The emulator displays four disk drives in the top-right corner:

- **🖥️ A:** (dimmed) - Boot disk (CP/M 2.2) - **Read-only**
- **💾 B:** (bright) - Microsoft BASIC - **Interactive**
- **💾 C:** (bright) - Empty - **Interactive**  
- **💾 D:** (bright) - Empty - **Interactive**

### Mounting Your Own Disks

**Important:** You can drag disk images from your local filesystem - they don't need to exist on the server!

1. **Click any drive icon** (B, C, or D) to open the Disk Manager
2. **Drag a .dsk file** from your computer onto any drive
3. **Wait** for the mount to complete
4. **Switch to that drive** in CP/M (e.g., `C:`)
5. **Use the programs** on your mounted disk

### Supported Disk Formats
- **8" SSSD CP/M disks** (250KB, 77 tracks × 26 sectors × 128 bytes)
- **Standard .dsk files** compatible with CP/M emulators
- **Any CP/M disk image** that matches the 250KB format

### Downloading Modified Disks
1. **Click any drive icon** (B, C, or D)
2. **Click "Download .dsk"** button
3. **Save the file** to your computer
4. **Your programs and data** are preserved

## 🖥️ CP/M Usage

### Basic Commands
```bash
DIR              # List files on current drive
B:               # Switch to drive B
C:               # Switch to drive C
D:               # Switch to drive D
A:               # Switch back to drive A (boot disk)
```

### Programming with BASIC
```bash
B:MBASIC         # Start Microsoft BASIC
# BASIC commands will appear
NEW              # Start a new program
10 PRINT "HELLO WORLD"
20 GOTO 10
RUN              # Run your program
SAVE "MYPROG"    # Save your program
LOAD "MYPROG"    # Load a saved program
```

### File Management
```bash
DIR              # List files
ERA FILENAME.COM # Delete a file
REN NEWNAME.COM=OLDNAME.COM  # Rename a file
TYPE FILENAME.TXT # Display a text file
```

## 🔧 Developer Information

### Architecture

#### Core Components
- **`emulator.js`** - Main emulator logic and state management
- **`z80.js`** - Z80 CPU emulation with full instruction set
- **`memio.js`** - Memory and I/O subsystem with IndexedDB
- **`vt100.js`** - Terminal emulation with VT52 support
- **`styles.css`** - Retro styling and disk drive interface

#### Key Features Implementation

**Auto-Boot Sequence:**
```javascript
// Multi-step boot process
1. Load emu-cpm22a.dsk into drive 0
2. Load mbasic.dsk into drive 1  
3. Boot CP/M from drive 0
4. Start execution
```

**Disk Drive Icons:**
```javascript
// Visual state management
- Drive A: locked class (40% opacity, not-allowed cursor)
- Drives B/C/D: mounted/empty classes with hover effects
- Real-time updates when disks are mounted/unmounted
```

**IndexedDB Integration:**
```javascript
// Modern database for disk storage
- Replaces deprecated Web SQL Database
- Persistent storage across browser sessions
- Sector-based disk image storage
- Automatic drive geometry detection
```

### Browser Compatibility

**Supported Browsers:**
- Chrome 23+
- Firefox 16+
- Safari 10+
- Edge 12+
- Opera 15+

**Required Features:**
- IndexedDB support
- FileReader API (for drag-and-drop)
- ES6+ JavaScript features

### Local Development

#### Setup
```bash
# Clone the repository
git clone <repository-url>
cd z80emu

# Start a local web server (required for full functionality)
python3 -m http.server 8080
# or
npx serve .
# or
php -S localhost:8080
```

#### File Structure
```
z80emu/
├── index.html          # Main entry point
├── emulator.js         # Emulator logic
├── z80.js             # Z80 CPU emulation
├── memio.js           # Memory and I/O
├── vt100.js           # Terminal emulation
├── styles.css         # Styling
├── vt52.ttf           # VT52 font
├── cpmfs              # CP/M filesystem utility
├── cpmfs.c            # CP/M filesystem source
└── disks/             # Disk images directory
    ├── emu-cpm22a.dsk # CP/M 2.2 (auto-loaded)
    ├── mbasic.dsk     # Microsoft BASIC (auto-loaded)
    └── *.dsk          # Additional disk images
```

#### Building Disk Images
```bash
# Compile the CP/M filesystem utility
gcc -o cpmfs cpmfs.c

# Create a new disk image
./cpmfs newdisk.dsk make

# Add files to the disk
./cpmfs newdisk.dsk w filename.com filename.com

# List files on the disk
./cpmfs newdisk.dsk dir
```

### Deployment

#### Production Deployment
```bash
# Run the deployment script
./deployment.sh

# This will:
# 1. Test connection to remote server
# 2. Create backup of current deployment
# 3. Upload files via rsync
# 4. Test the live website
```

#### Manual Deployment
```bash
# Upload files to your web server
rsync -avz --exclude='.git/' --exclude='deployment.sh' ./ user@server:/path/to/webroot/
```

## 🐛 Troubleshooting

### Common Issues

**"IndexedDB library not loaded"**
- Ensure the `idb` library is accessible
- Check browser console for network errors

**"FileReader not supported"**
- Update to a modern browser
- Safari users may need to enable FileReader

**"Wrong file format error"**
- Ensure disk images are exactly 250KB (256,256 bytes)
- Use 8" SSSD CP/M format (77×26×128 bytes)

**"Database initialization failed"**
- Clear browser data and reload
- Check browser's IndexedDB support

### Debug Commands
```bash
# In CP/M monitor (type 'bye' to exit CP/M)
io              # Show I/O status
dsk 1           # Dump drive B contents
debug 100       # Show first 16 bytes at address 0x100
```

## 📝 Recent Changes (2025)

### Major Updates
- **IndexedDB Migration** - Replaced deprecated Web SQL Database
- **Auto-Boot Feature** - CP/M loads automatically on startup
- **Visual Disk Management** - Retro floppy icons with drag-and-drop
- **Terminal Improvements** - Proper line feeding and cursor positioning
- **Modern Browser Support** - Works in all current browsers

### Technical Improvements
- **Cache-busting** - Version parameters ensure fresh code loads
- **Error Handling** - Better error messages and recovery
- **Performance** - Optimized disk I/O and memory management
- **Accessibility** - Improved keyboard navigation and screen reader support

## 📄 License

This project is based on the original Z80 emulator by Greg Sydney-Smith and includes contributions from the open source community. See `credits.txt` for detailed attribution.

## 🤝 Contributing

Contributions are welcome! Please:
1. Test your changes thoroughly
2. Maintain the retro aesthetic
3. Ensure browser compatibility
4. Update documentation as needed

## 🌐 Links

- **Live Demo:** https://cpm.retrogamecoders.com
- **Repository:** [GitHub URL]
- **Issues:** [GitHub Issues URL]

---

*Experience authentic CP/M computing in your modern browser!* 🖥️💾
