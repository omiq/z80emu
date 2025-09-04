#!/usr/bin/env node

console.log("🔍 Disk Loading Debug Script");
console.log("=============================\n");

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
    this.iocount = 0;
    this.dskstat = 0;
  }

  rd(address) {
    return this.ram[address & 0xFFFF];
  }

  wr(address, value) {
    this.ram[address & 0xFFFF] = value & 0xFF;
    return value;
  }

  input(port) {
    switch (port) {
      case 0: return 0xFF; // Console status - always ready
      case 1: return 0x1A; // Console input - CTRL-Z
      default: return 0x00;
    }
  }

  output(port, value) {
    if (port === 1) {
      process.stdout.write(String.fromCharCode(value));
    }
  }

  readSector(drv, trk, sec, dma) {
    console.log(`📖 readSector called: Drive=${drv}, Track=${trk}, Sector=${sec}, DMA=${dma.toString(16).padStart(4, '0')}`);
    
    // Simulate async operation
    this.iocount = 1;
    
    setTimeout(() => {
      console.log(`⏰ Sector read completed`);
      
      // Load a realistic CP/M boot sector
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
      
      this.iocount = 0;
      this.dskstat = 0;
      
    }, 100);
    
    return Promise.resolve();
  }
}

// Test the disk loading process
async function testDiskLoading() {
  console.log("🧪 Testing disk loading process...");
  
  const memio = new MockMemio();
  
  // Test 1: Check if boot sector exists
  console.log("\n📋 Test 1: Checking boot sector existence...");
  try {
    const sector = await memio.dbPromise.then(db => db.get('sectors', 0*65536+0*256+1-1));
    console.log(`Boot sector check result:`, sector ? "Found" : "Not found");
  } catch (error) {
    console.log(`Boot sector check error:`, error.message);
  }
  
  // Test 2: Load boot sector
  console.log("\n📥 Test 2: Loading boot sector...");
  try {
    await memio.readSector(0, 0, 1, 0);
    console.log("Boot sector load initiated");
    
    // Wait for async completion
    let attempts = 0;
    while (memio.iocount > 0 && attempts < 50) {
      await new Promise(resolve => setTimeout(resolve, 10));
      attempts++;
    }
    
    if (memio.iocount === 0) {
      console.log("✅ Boot sector load completed successfully");
      
      // Verify memory contents
      let memDump = "Final memory at 0x0000: ";
      for (let i = 0; i < 16; i++) {
        memDump += `0x${memio.ram[i].toString(16).padStart(2, '0')} `;
      }
      console.log(memDump);
      
      // Test 3: CPU execution
      console.log("\n🚀 Test 3: Testing CPU execution...");
      
      // Load Z80 adapter
      const fs = require('fs');
      const z80Code = fs.readFileSync('./z80-adapter-browser.js', 'utf8');
      
      const mockEnv = {
        console: console,
        window: {},
        document: {},
        setTimeout: (fn, ms) => setTimeout(fn, ms),
        clearTimeout: clearTimeout
      };
      
      const createZ80Adapter = new Function('console', 'window', 'document', 'setTimeout', 'clearTimeout', z80Code + '; return Z80Adapter;');
      const Z80Adapter = createZ80Adapter(console, mockEnv.console, mockEnv.window, mockEnv.document, mockEnv.setTimeout, mockEnv.clearTimeout);
      
      const cpu = new Z80Adapter(memio);
      cpu.pc = 0;
      
      console.log(`CPU initialized: PC=0x${cpu.pc.toString(16).padStart(4, '0')}`);
      
      // Execute a few instructions
      for (let i = 0; i < 5; i++) {
        console.log(`\n--- CPU Step ${i + 1} ---`);
        console.log(`PC before: 0x${cpu.pc.toString(16).padStart(4, '0')}`);
        
        const result = cpu.step();
        console.log(`Step result: ${result}`);
        console.log(`PC after: 0x${cpu.pc.toString(16).padStart(4, '0')}`);
        console.log(`A register: 0x${cpu.a.toString(16).padStart(2, '0')}`);
        
        if (!result) {
          console.log("❌ CPU step failed - stopping execution");
          break;
        }
        
        if (cpu.pc >= 0x0100) {
          console.log("🎯 CPU jumped to CP/M entry point - success!");
          break;
        }
      }
      
    } else {
      console.log("❌ Boot sector load timed out");
    }
    
  } catch (error) {
    console.error("❌ Error during boot sector load:", error);
  }
}

// Run the test
testDiskLoading().then(() => {
  console.log("\n🏁 Disk loading test completed");
}).catch(error => {
  console.error("❌ Test failed:", error);
});
