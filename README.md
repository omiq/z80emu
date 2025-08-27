# Z80 CPU Emulator

A Zilog Z80 CPU emulator that runs in modern web browsers. This emulator has been updated to use IndexedDB instead of the deprecated Web SQL Database API, making it compatible with all modern browsers.

## Features

- Full Z80 CPU emulation
- Disk drive emulation with persistent storage using IndexedDB
- Tape drive emulation
- Paper tape punch/reader
- Console I/O
- Memory inspection and modification
- Intel HEX file loading
- CP/M disk image support

## Browser Compatibility

This emulator now works in all modern browsers that support IndexedDB:

- Chrome 23+
- Firefox 16+
- Safari 10+
- Edge 12+
- Opera 15+

## Quick Start

### Option 1: Direct File Access (Limited)
1. Open `index.html` in a modern web browser
2. The emulator will automatically load CP/M 2.2 and boot it
3. CP/M will start running immediately - no manual commands needed!
4. Type `h` for help to see available commands (when not in CP/M)

**Note:** Direct file access has limitations - you won't be able to load additional disk files or Intel HEX files due to browser security restrictions.

### Option 2: Local Web Server (Recommended)
For full functionality including loading disk files and programs:

1. **Start a local web server:**
   ```bash
   
   # Example with a specific port
   python3 -m http.server 8080
   ```

2. **Open the emulator:**
   ```
   http://localhost:8080
   ```

3. **Load additional files:**
   - Place `.hex` files in the project directory
   - Place `.dsk` files in a `disks/` subdirectory
   - Use commands like `r program.hex` to load them

4. **Full functionality:**
   - Auto-boot CP/M 2.2
   - Load additional disk images with `r 0 newdisk.dsk`
   - Load Intel HEX programs with `r program.hex`
   - Access all emulator features

## Key Commands

- `h` - Show help
- `r filename` - Read Intel HEX file into memory
- `d [address]` - Dump memory
- `g [address]` - Run program
- `F d` - Format disk drive (0-3)
- `dsk d` - Access disk drive (0-3)
- `io` - Show I/O status

## Loading Programs and Data into Memory

The Z80 emulator supports multiple ways to load programs and data into memory without rebooting:

### 1. Intel HEX Files
Load Intel HEX format files (most common for Z80 programs):
```
r program.hex          # Load from file
r ptr:                 # Load from paper tape reader
r ptp:                 # Load from paper tape punch
```

### 2. Memory Commands
Direct memory manipulation:
```
m [address]            # Modify memory at address
d [address]            # Dump memory starting at address
l [address]            # List/disassemble memory
```

### 3. Programmatic Loading (JavaScript)
Inject code directly via browser console:
```javascript
// Load raw binary data
var program = [0x3E, 0x41, 0xD3, 0x01, 0xC3, 0x00, 0x00]; // Print 'A' forever
emulator.memio.load(0x1000, program);
emulator.cpu.pc = 0x1000;
emulator.gotoState(5); // Start execution

// Load Intel HEX string
var hexData = ":10000000C30000C30000C30000C30000C30000C3...";
var result = emulator.memio.loadIntelHex(hexData);
emulator.cpu.pc = result.saddr;
emulator.gotoState(5);
```

### 4. File Formats Supported
- **Intel HEX** (.hex) - Standard format for Z80 programs
- **Raw binary** - Direct byte arrays
- **CP/M disk images** (.dsk) - Full disk images
- **Paper tape** - Via ptr: and ptp: devices

### 5. Memory Regions
- **0x0000-0x00FF** - CP/M system area
- **0x0100-0x7FFF** - Available for programs
- **0x8000-0xFFFF** - Extended memory

### 6. Example: Loading a Simple Program
```
# Load a program that prints 'Hello'
r hello.hex
g 100                    # Run starting at address 0x100
```

### 8. File Organization for Local Development
When using a local web server, organize your files like this:
```
z80emu/
├── index.html          # Main emulator
├── emulator.js         # Emulator logic
├── memio.js           # Memory and I/O
├── z80.js             # Z80 CPU
├── vt100.js           # Terminal
├── styles.css         # Styling
├── vt52.ttf           # VT52 font
├── hello.hex          # Intel HEX programs
├── test.hex           # More programs
└── disks/             # Disk images directory
    ├── emu-cpm22a.dsk # CP/M 2.2 (auto-loaded)
    ├── games.dsk      # Additional disk images
    └── utilities.dsk  # More disk images
```

### 9. Example Commands with Local Server
```
# Load and run a program
r hello.hex            # Load Intel HEX file
g 100                  # Run at address 0x100

# Load additional disk images
r 0 games.dsk          # Load into drive A:
r 1 utilities.dsk      # Load into drive B:

# Access disk contents
dsk 0                  # View drive A: contents
dsk 1                  # View drive B: contents

# Format a new disk
F 2                    # Format drive C:
```

### 7. Debugging Commands
```
x [register]            # Show/modify registers (a, b, c, d, e, h, l, af, bc, de, hl, sp, pc)
x f<flag>              # Modify flags (s, z, i, h, p, c)
<CR>                   # Single step execution
```

## Recent Changes

### Auto-Boot Feature (2025)

The emulator now automatically loads and boots CP/M 2.2 on startup, eliminating the need for manual commands. Users no longer need to type:
- `r 0 emu-cpm22a.dsk` (load disk)
- `b` (boot)
- `g` (go/run)

The emulator handles this automatically and CP/M starts running immediately.

### IndexedDB Migration (2025)

The emulator has been updated to use IndexedDB instead of the deprecated Web SQL Database API. This change:

- **Enables compatibility with all modern browsers** - Web SQL Database was deprecated and removed from modern browsers
- **Improves performance** - IndexedDB is more efficient for the types of operations performed
- **Provides better error handling** - More robust error handling with Promise-based operations
- **Maintains all existing functionality** - All disk operations work exactly as before

### Technical Details

- Replaced `openDatabase()` calls with `idb.openDB()`
- Converted SQL queries to IndexedDB object store operations
- Updated all database operations to use Promises
- Added proper error handling for database operations
- Maintained backward compatibility with existing disk images

## Testing

To test that the IndexedDB migration works correctly:

1. Open `test.html` in a modern browser
2. The test will automatically verify database operations
3. Check the console for detailed logs

## File Structure

- `index.html` - Main emulator interface
- `memio.js` - Memory and I/O subsystem (updated for IndexedDB)
- `z80.js` - Z80 CPU emulation
- `vt100.js` - Terminal emulation
- `emulator.js` - Main emulator logic
- `styles.css` - User interface styling
- `test.html` - IndexedDB functionality test

## Dependencies

- [idb](https://github.com/jakearchibald/idb) - IndexedDB wrapper library (loaded from CDN)

## License

This project is based on the Intel 8080 CPU Emulator by Stefan Tramm (2010) and has been updated for Z80 compatibility and modern browser support.

## Credits

- Original Intel 8080 emulator: Stefan Tramm (2010)
- Z80 port: Greg Sydney-Smith (2017)
- IndexedDB migration: 2025
- ShellInABox terminal: Markus Gutschke (2008-2009)
