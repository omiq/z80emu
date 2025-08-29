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

- **A:** (dimmed) - Boot disk (CP/M 2.2) - **Read-only**
- **B:** (bright) - Microsoft BASIC - **Interactive**
- **C:** (bright) - Empty - **Interactive**  
- **D:** (bright) - Empty - **Interactive**

### Mounting Your Own Disks

**Important:** You can drag disk images from your local filesystem - they don't need to exist on the server!

1. **Click any drive icon** (B, C, or D) to open the Disk Manager
2. **Drag a .dsk file** from your computer onto any drive
3. **Wait** for the mount to complete
4. **Switch to that drive** in CP/M (e.g., `C:`)
5. **Use the programs** on your mounted disk

### Supported Disk Formats
- **8" SSSD CP/M disks** (250KB, 77 tracks × 26 sectors × 128 bytes)
- **8" DDDD CP/M disks** (500KB, 77 tracks × 52 sectors × 128 bytes)
- **5.25" DDDD CP/M disks** (260KB, 40 tracks × 52 sectors × 128 bytes)
- **Hard disk images** (32MB, 1024 tracks × 256 sectors × 128 bytes)
- **Custom disk sizes** - Auto-detected based on file size
- **Standard .dsk, .hdd, .img files** compatible with CP/M emulators

### Downloading Modified Disks
1. **Click any drive icon** (B, C, or D)
2. **Click "Download .dsk"** button
3. **Save the file** to your computer
4. **Your programs and data** are preserved

## CP/M Usage

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

### Modern Development Workflow (PTR/PTP)

**Skip the old CP/M text editors!** Use your modern text editor and drag-and-drop files:

#### For C Programming:
1. **Mount BDS C disk** - Click drive C or D, drag `bdsc1.dsk` and `bdsc2.dsk`
2. **Write C code** - Use your favorite text editor (VS Code, Sublime, etc.)
3. **Drag source file** - Drop your `.c` file onto the emulator window
4. **Load into CP/M** - Use `r ptr:` to load the source file
5. **Compile** - Switch to C: drive and run `CC filename.c`
6. **Download result** - Use `ptp` to save the compiled program

#### For BASIC Programming:
1. **Write BASIC** - Use your modern text editor
2. **Drag .bas file** - Drop onto emulator window  
3. **Load into CP/M** - Use `r ptr:` to load the source
4. **Run in BASIC** - Start `B:MBASIC` and use `LOAD "filename"`
5. **Save modified** - Use `SAVE "filename"` then `ptp` to download

#### Example C Workflow:
```bash
# 1. Write hello.c in your editor
# 2. Drag hello.c onto emulator
# 3. Load source into CP/M
r ptr:

# 4. Switch to C: drive (BDS C compiler)
C:

# 5. Compile the program
CC HELLO.C

# 6. Download the compiled program
ptp hello.com
```

#### Example BASIC Workflow:
```bash
# 1. Write program.bas in your editor
# 2. Drag program.bas onto emulator
# 3. Load into CP/M
r ptr:

# 4. Start BASIC
B:MBASIC

# 5. Load and run
LOAD "PROGRAM"
RUN

# 6. Save and download
SAVE "PROGRAM"
# Exit BASIC with BYE
BYE
ptp program.bas
```

**Benefits:**
- ✅ Use modern text editors with syntax highlighting
- ✅ Copy/paste from tutorials and examples
- ✅ Version control with Git
- ✅ No need to learn CP/M text editors
- ✅ Easy file transfer between modern and vintage systems

### File Management
```bash
DIR              # List files
ERA FILENAME.COM # Delete a file
REN NEWNAME.COM=OLDNAME.COM  # Rename a file
TYPE FILENAME.TXT # Display a text file
```

## 📄 Paper Tape Devices (PTR/PTP)

The emulator includes virtual paper tape reader (PTR) and paper tape punch (PTP) devices for loading and saving programs.

### Paper Tape Reader (PTR)
**Purpose:** Load Intel HEX programs from virtual paper tape

**How to use:**
1. **Mount a tape** - Drag and drop any file onto the emulator window
2. **Load the program** - Use `r ptr:` command to load Intel HEX from tape
3. **Run the program** - Use `g <address>` to execute

**Example workflow:**
```bash
# 1. Drag a .hex file onto the emulator window
# 2. Load the program from tape
r ptr:

# 3. Run the program (address shown in output)
g 100
```

### Paper Tape Punch (PTP)
**Purpose:** Save program output to virtual paper tape

**How to use:**
1. **Clear the punch** - Use `ptp filename` to start a new punch file
2. **Run programs** - Programs can output to the punch device
3. **Download the tape** - Use `ptp` command to save the punched data

**Example workflow:**
```bash
# 1. Start a new punch file
ptp myprogram.hex

# 2. Run a program that outputs to punch
# (Some CP/M programs can punch Intel HEX)

# 3. Download the punched data
ptp
# This opens a save window with the punched data
```

### Tape Commands
```bash
rew              # Rewind the paper tape reader
io               # Show tape status (name, length, position)
r ptr:           # Read Intel HEX from tape into memory
r ptp:           # Read Intel HEX from punch into memory
ptp [filename]   # Start new punch file or download current punch
```

### Technical Details
- **PTR (Port 5 input):** Reads characters from mounted tape file
- **PTP (Port 5 output):** Accumulates characters into punch buffer
- **Tape format:** Any file can be mounted, but Intel HEX format is most useful
- **Position tracking:** Tape reader tracks current position, can be rewound
- **EOF handling:** Returns CTRL-Z (0x1A) when tape reaches end

### Server Integration
The `ptp` and `dsk` commands can send data to a server for processing:

**Current behavior:** Opens a form window with:
- **URL field:** Default `http://localhost/cgi-bin/savefile`
- **Content field:** The punched data or disk image
- **Submit button:** Sends data to server

**Backend requirements:** You'll need a server script to handle the POST data:
```bash
# Example CGI script (savefile.cgi)
#!/bin/bash
echo "Content-Type: text/plain"
echo ""
read POST_DATA
echo "$POST_DATA" > /tmp/received_data
echo "Data saved successfully"
```

**Note:** The server integration is optional - you can also save files locally using the browser's download functionality.

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
1. Load emu-cpm.dsk into drive 0
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

# Create different disk types
./cpmfs -t 8sssd disk.dsk make    # 250KB standard CP/M
./cpmfs -t 8dddd disk.dsk make    # 500KB double density
./cpmfs -t 5dddd disk.dsk make    # 260KB 5.25" format
./cpmfs -t hdd disk.dsk make      # 32MB hard disk

# Add files to the disk (supports wildcards!)
./cpmfs disk.dsk w filename.com filename.com
./cpmfs disk.dsk w "*.txt"        # Add all .txt files
./cpmfs disk.dsk w "test*"        # Add all files starting with "test"
./cpmfs disk.dsk w "*"            # Add all files in directory

# List files on the disk
./cpmfs disk.dsk dir
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
- **Auto-Disk Detection** - Automatically detects disk geometry from file size
- **Wildcard Support** - Add multiple files to disks using patterns like `*.txt`
- **Large Disk Support** - Support for 500KB, 260KB, and 32MB disk formats

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
