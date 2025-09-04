#!/usr/bin/env node

console.log("🔍 Z80 Adapter Debug Script");
console.log("============================\n");

// Mock the browser environment
global.window = {};
global.console = console;

// Mock the idb library
global.idb = {
  openDB: () => Promise.resolve({
    get: () => Promise.resolve({ data: new Array(128).fill(0) }),
    put: () => Promise.resolve(),
    getAll: () => Promise.resolve([])
  })
};

// Mock Memio class for testing
class MockMemio {
  constructor() {
    this.ram = new Array(65536).fill(0);
    this.drives = [
      { tracks: 77, sectors: 26, name: "test.dsk", geometry: "auto" }
    ];
    this.dbPromise = Promise.resolve({
      get: () => Promise.resolve({ data: new Array(128).fill(0) }),
      put: () => Promise.resolve()
    });
  }

  rd(address) {
    return this.ram[address & 0xFFFF];
  }

  wr(address, value) {
    this.ram[address & 0xFFFF] = value & 0xFF;
    return value;
  }

  input(port) {
    // Mock I/O ports
    switch (port) {
      case 0: return 0xFF; // Console status - always ready
      case 1: return 0x1A; // Console input - CTRL-Z
      default: return 0x00;
    }
  }

  output(port, value) {
    // Mock I/O output
    if (port === 1) {
      process.stdout.write(String.fromCharCode(value));
    }
  }

  readSector(drv, trk, sec, dma) {
    // Mock reading a CP/M boot sector
    console.log(`📖 Reading sector: Drive=${drv}, Track=${trk}, Sector=${sec}, DMA=${dma.toString(16).padStart(4, '0')}`);
    
    // Load a simple CP/M boot sector pattern
    const bootSector = [
      0xC3, 0x00, 0x01,  // JP 0x0100 (jump to CP/M entry point)
      0x00, 0x00, 0x00,  // NOPs
      0x00, 0x00, 0x00,  // NOPs
      0x00, 0x00, 0x00,  // NOPs
      0x00, 0x00, 0x00,  // NOPs
      0x00, 0x00, 0x00   // NOPs
    ];
    
    // Copy boot sector to memory
    for (let i = 0; i < bootSector.length; i++) {
      this.ram[dma + i] = bootSector[i];
    }
    
    console.log(`✅ Boot sector loaded to memory at 0x${dma.toString(16).padStart(4, '0')}`);
    
    // Show memory dump
    let memDump = "Memory at 0x0000: ";
    for (let i = 0; i < 16; i++) {
      memDump += `0x${this.ram[i].toString(16).padStart(2, '0')} `;
    }
    console.log(memDump);
    
    return Promise.resolve();
  }
}

// Load the Z80 adapter
try {
  console.log("📁 Loading Z80 adapter...");
  
  // Read the Z80 adapter file
  const fs = require('fs');
  const z80Code = fs.readFileSync('./z80-adapter-browser.js', 'utf8');
  
  // Create a mock environment and evaluate the code
  const mockEnv = {
    console: console,
    window: {},
    document: {},
    setTimeout: (fn, ms) => setTimeout(fn, ms),
    clearTimeout: clearTimeout
  };
  
  // Create a function context with the mock environment
  const createZ80Adapter = new Function('console', 'window', 'document', 'setTimeout', 'clearTimeout', z80Code + '; return Z80Adapter;');
  const Z80Adapter = createZ80Adapter(console, mockEnv.window, mockEnv.document, mockEnv.setTimeout, mockEnv.clearTimeout);
  
  console.log("✅ Z80 adapter loaded successfully\n");
  
  // Test the Z80 adapter
  console.log("🧪 Testing Z80 adapter...");
  
  const memio = new MockMemio();
  const cpu = new Z80Adapter(memio);
  
  console.log(`CPU initialized: PC=0x${cpu.pc.toString(16).padStart(4, '0')}, A=0x${cpu.a.toString(16).padStart(2, '0')}`);
  
  // Load boot sector
  console.log("\n📥 Loading boot sector...");
  memio.readSector(0, 0, 1, 0).then(() => {
    console.log("\n🚀 Starting CPU execution...");
    
    // Set PC to 0 and start executing
    cpu.pc = 0;
    
    // Execute a few instructions
    for (let i = 0; i < 10; i++) {
      console.log(`\n--- Step ${i + 1} ---`);
      console.log(`PC before: 0x${cpu.pc.toString(16).padStart(4, '0')}`);
      
      const result = cpu.step();
      console.log(`Step result: ${result}`);
      console.log(`PC after: 0x${cpu.pc.toString(16).padStart(4, '0')}`);
      console.log(`A register: 0x${cpu.a.toString(16).padStart(2, '0')}`);
      console.log(`Cycles: ${cpu.cycles}`);
      
      if (!result) {
        console.log("❌ CPU step failed - stopping execution");
        break;
      }
      
      // Check if we've jumped to CP/M entry point
      if (cpu.pc >= 0x0100) {
        console.log("🎯 CPU jumped to CP/M entry point - success!");
        break;
      }
    }
    
    console.log("\n🏁 Execution test completed");
    
  }).catch(error => {
    console.error("❌ Error during testing:", error);
  });
  
} catch (error) {
  console.error("❌ Failed to load Z80 adapter:", error);
  console.error("Stack trace:", error.stack);
}
