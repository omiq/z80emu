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

1. Open `index.html` in a modern web browser
2. The emulator will automatically load CP/M 2.2 and boot it
3. CP/M will start running immediately - no manual commands needed!
4. Type `h` for help to see available commands (when not in CP/M)

## Key Commands

- `h` - Show help
- `r filename` - Read Intel HEX file into memory
- `d [address]` - Dump memory
- `g [address]` - Run program
- `F d` - Format disk drive (0-3)
- `dsk d` - Access disk drive (0-3)
- `io` - Show I/O status

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
