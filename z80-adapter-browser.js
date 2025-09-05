/*
 * Z80 Adapter Browser Version - Simplified Z80 emulator for browser compatibility
 * This provides a basic Z80 instruction set that should be sufficient for CP/M and C compilers
 */

class Z80Adapter {
    constructor(memio) {
        this.memio = memio;
        
        // Initialize registers
        this.reset();
        
        // Initialize instruction tables
        this.initInstructionTables();
    }

    // Reset the Z80 to initial state
    reset() {
        this.a = 0;
        this.f = 0;
        this.b = 0;
        this.c = 0;
        this.d = 0;
        this.e = 0;
        this.h = 0;
        this.l = 0;
        this.pc = 0;
        this.sp = 0xF000;
        this.ix = 0;
        this.iy = 0;
        this.i = 0;
        this.r = 0;
        this.iff1 = false;
        this.iff2 = false;
        this.im = 0;
        this.cycles = 0;
        this.halted = false;
        this.prefix = 0; // For handling prefix bytes (CB, ED, DD, FD)
        
        // Z80 alternate registers
        this.a_ = 0;
        this.f_ = 0;
        this.b_ = 0;
        this.c_ = 0;
        this.d_ = 0;
        this.e_ = 0;
        this.h_ = 0;
        this.l_ = 0;
    }

    // Initialize instruction tables
    initInstructionTables() {
        // Basic instruction set - we'll add more as needed
        this.instructions = {
            // Basic 8-bit loads
            0x06: () => { this.b = this.next1(); this.cycles += 7; }, // LD B,n
            0x0E: () => { this.c = this.next1(); this.cycles += 7; }, // LD C,n
            0x16: () => { this.d = this.next1(); this.cycles += 7; }, // LD D,n
            0x1E: () => { this.e = this.next1(); this.cycles += 7; }, // LD E,n
            0x26: () => { this.h = this.next1(); this.cycles += 7; }, // LD H,n
            0x2E: () => { this.l = this.next1(); this.cycles += 7; }, // LD L,n
            0x3E: () => { this.a = this.next1(); this.cycles += 7; }, // LD A,n
            
            // 16-bit loads
            0x01: () => { this.bc = this.next2(); this.cycles += 10; }, // LD BC,nn
            0x11: () => { this.de = this.next2(); this.cycles += 10; }, // LD DE,nn
            0x21: () => { this.hl = this.next2(); this.cycles += 10; }, // LD HL,nn
            0x31: () => { this.sp = this.next2(); this.cycles += 10; }, // LD SP,nn
            
            // Register to register moves
            0x40: () => { this.b = this.b; this.cycles += 4; }, // LD B,B
            0x41: () => { this.b = this.c; this.cycles += 4; }, // LD B,C
            0x42: () => { this.b = this.d; this.cycles += 4; }, // LD B,D
            0x43: () => { this.b = this.e; this.cycles += 4; }, // LD B,E
            0x44: () => { this.b = this.h; this.cycles += 4; }, // LD B,H
            0x45: () => { this.b = this.l; this.cycles += 4; }, // LD B,L
            0x47: () => { this.b = this.a; this.cycles += 4; }, // LD B,A
            
            0x48: () => { this.c = this.b; this.cycles += 4; }, // LD C,B
            0x49: () => { this.c = this.c; this.cycles += 4; }, // LD C,C
            0x4A: () => { this.c = this.d; this.cycles += 4; }, // LD C,D
            0x4B: () => { this.c = this.e; this.cycles += 4; }, // LD C,E
            0x4C: () => { this.c = this.h; this.cycles += 4; }, // LD C,H
            0x4D: () => { this.c = this.l; this.cycles += 4; }, // LD C,L
            0x4F: () => { this.c = this.a; this.cycles += 4; }, // LD C,A
            
            0x50: () => { this.d = this.b; this.cycles += 4; }, // LD D,B
            0x51: () => { this.d = this.c; this.cycles += 4; }, // LD D,C
            0x52: () => { this.d = this.d; this.cycles += 4; }, // LD D,D
            0x53: () => { this.d = this.e; this.cycles += 4; }, // LD D,E
            0x54: () => { this.d = this.h; this.cycles += 4; }, // LD D,H
            0x55: () => { this.d = this.l; this.cycles += 4; }, // LD D,L
            0x57: () => { this.d = this.a; this.cycles += 4; }, // LD D,A
            
            0x58: () => { this.e = this.b; this.cycles += 4; }, // LD E,B
            0x59: () => { this.e = this.c; this.cycles += 4; }, // LD E,C
            0x5A: () => { this.e = this.d; this.cycles += 4; }, // LD E,D
            0x5B: () => { this.e = this.e; this.cycles += 4; }, // LD E,E
            0x5C: () => { this.e = this.h; this.cycles += 4; }, // LD E,H
            0x5D: () => { this.e = this.l; this.cycles += 4; }, // LD E,L
            0x5F: () => { this.e = this.a; this.cycles += 4; }, // LD E,A
            
            0x60: () => { this.h = this.b; this.cycles += 4; }, // LD H,B
            0x61: () => { this.h = this.c; this.cycles += 4; }, // LD H,C
            0x62: () => { this.h = this.d; this.cycles += 4; }, // LD H,D
            0x63: () => { this.h = this.e; this.cycles += 4; }, // LD H,E
            0x64: () => { this.h = this.h; this.cycles += 4; }, // LD H,H
            0x65: () => { this.h = this.l; this.cycles += 4; }, // LD H,L
            0x67: () => { this.h = this.a; this.cycles += 4; }, // LD H,A
            
            0x68: () => { this.l = this.b; this.cycles += 4; }, // LD L,B
            0x69: () => { this.l = this.c; this.cycles += 4; }, // LD L,C
            0x6A: () => { this.l = this.d; this.cycles += 4; }, // LD L,D
            0x6B: () => { this.l = this.e; this.cycles += 4; }, // LD L,E
            0x6C: () => { this.l = this.h; this.cycles += 4; }, // LD L,H
            0x6D: () => { this.l = this.l; this.cycles += 4; }, // LD L,L
            0x6F: () => { this.l = this.a; this.cycles += 4; }, // LD L,A
            
            0x78: () => { this.a = this.b; this.cycles += 4; }, // LD A,B
            0x79: () => { this.a = this.c; this.cycles += 4; }, // LD A,C
            0x7A: () => { this.a = this.d; this.cycles += 4; }, // LD A,D
            0x7B: () => { this.a = this.e; this.cycles += 4; }, // LD A,E
            0x7C: () => { this.a = this.h; this.cycles += 4; }, // LD A,H
            0x7D: () => { this.a = this.l; this.cycles += 4; }, // LD A,L
            0x7F: () => { this.a = this.a; this.cycles += 4; }, // LD A,A
            
            // Memory operations
            0x02: () => { this.w1(this.bc, this.a); this.cycles += 7; }, // LD (BC),A
            0x0A: () => { this.a = this.r1(this.bc); this.cycles += 7; }, // LD A,(BC)
            0x12: () => { this.w1(this.de, this.a); this.cycles += 7; }, // LD (DE),A
            0x1A: () => { this.a = this.r1(this.de); this.cycles += 7; }, // LD A,(DE)
            0x36: () => { this.w1(this.hl, this.next1()); this.cycles += 10; }, // LD (HL),n
            
            // 8-bit arithmetic operations
            0x80: () => { this.a = this.add1(this.a, this.b); this.cycles += 4; }, // ADD A,B
            0x81: () => { this.a = this.add1(this.a, this.c); this.cycles += 4; }, // ADD A,C
            0x82: () => { this.a = this.add1(this.a, this.d); this.cycles += 4; }, // ADD A,D
            0x83: () => { this.a = this.add1(this.a, this.e); this.cycles += 4; }, // ADD A,E
            0x84: () => { this.a = this.add1(this.a, this.h); this.cycles += 4; }, // ADD A,H
            0x85: () => { this.a = this.add1(this.a, this.l); this.cycles += 4; }, // ADD A,L
            0x86: () => { this.a = this.add1(this.a, this.r1(this.hl)); this.cycles += 7; }, // ADD A,(HL)
            0x87: () => { this.a = this.add1(this.a, this.a); this.cycles += 4; }, // ADD A,A
            0xC6: () => { this.a = this.add1(this.a, this.next1()); this.cycles += 7; }, // ADD A,n
            
            // 8-bit subtraction operations
            0x90: () => { this.a = this.sub1(this.a, this.b); this.cycles += 4; }, // SUB A,B
            0x91: () => { this.a = this.sub1(this.a, this.c); this.cycles += 4; }, // SUB A,C
            0x92: () => { this.a = this.sub1(this.a, this.d); this.cycles += 4; }, // SUB A,D
            0x93: () => { this.a = this.sub1(this.a, this.e); this.cycles += 4; }, // SUB A,E
            0x94: () => { this.a = this.sub1(this.a, this.h); this.cycles += 4; }, // SUB A,H
            0x95: () => { this.a = this.sub1(this.a, this.l); this.cycles += 4; }, // SUB A,L
            0x96: () => { this.a = this.sub1(this.a, this.r1(this.hl)); this.cycles += 7; }, // SUB A,(HL)
            0x97: () => { this.a = this.sub1(this.a, this.a); this.cycles += 4; }, // SUB A,A
            0xD6: () => { this.a = this.sub1(this.a, this.next1()); this.cycles += 7; }, // SUB A,n
            
            // LD <reg>,A instructions - CRITICAL FOR CP/M BOOT!
            0x47: () => { this.b = this.a; this.cycles += 4; }, // LD B,A
            0x4F: () => { this.c = this.a; this.cycles += 4; }, // LD C,A
            0x57: () => { this.d = this.a; this.cycles += 4; }, // LD D,A
            0x5F: () => { this.e = this.a; this.cycles += 4; }, // LD E,A
            0x62: () => { this.h = this.d; this.cycles += 4; }, // LD H,D
            0x67: () => { this.h = this.a; this.cycles += 4; }, // LD H,A
            0x6B: () => { this.l = this.e; this.cycles += 4; }, // LD L,E
            0x6F: () => { this.l = this.a; this.cycles += 4; }, // LD L,A
            
            // Memory operations
            0x02: () => { this.w1(this.bc, this.a); this.cycles += 7; }, // LD (BC),A
            0x12: () => { this.w1(this.de, this.a); this.cycles += 7; }, // LD (DE),A
            0x0A: () => { this.a = this.r1(this.bc); this.cycles += 7; }, // LD A,(BC)
            0x1A: () => { this.a = this.r1(this.de); this.cycles += 7; }, // LD A,(DE)
            
            // Arithmetic operations
            0x80: () => { this.a = this.add1(this.a, this.b); this.cycles += 4; }, // ADD A,B
            0x81: () => { this.a = this.add1(this.a, this.c); this.cycles += 4; }, // ADD A,C
            0x82: () => { this.a = this.add1(this.a, this.d); this.cycles += 4; }, // ADD A,D
            0x83: () => { this.a = this.add1(this.a, this.e); this.cycles += 4; }, // ADD A,E
            0x84: () => { this.a = this.add1(this.a, this.h); this.cycles += 4; }, // ADD A,H
            0x85: () => { this.a = this.add1(this.a, this.l); this.cycles += 4; }, // ADD A,L
            0x86: () => { this.a = this.add1(this.a, this.r1(this.hl)); this.cycles += 7; }, // ADD A,(HL)
            0x87: () => { this.a = this.add1(this.a, this.a); this.cycles += 4; }, // ADD A,A
            0xC6: () => { this.a = this.add1(this.a, this.next1()); this.cycles += 7; }, // ADD A,n
            
            // Increment/Decrement
            0x03: () => { this.bc = (this.bc + 1) & 0xFFFF; this.cycles += 6; }, // INC BC
            0x13: () => { this.de = (this.de + 1) & 0xFFFF; this.cycles += 6; }, // INC DE
            0x23: () => { this.hl = (this.hl + 1) & 0xFFFF; this.cycles += 6; }, // INC HL
            0x33: () => { this.sp = (this.sp + 1) & 0xFFFF; this.cycles += 6; }, // INC SP
            0x34: () => { const addr = this.hl; const value = this.r1(addr); this.w1(addr, this.inc1(value)); this.cycles += 10; }, // INC (HL)
            0x35: () => { const addr = this.hl; const value = this.r1(addr); this.w1(addr, this.dec1(value)); this.cycles += 10; }, // DEC (HL)
            
            // 16-bit arithmetic operations - CRITICAL FOR CP/M BOOT!
            0x09: () => { this.hl = this.add2(this.hl, this.bc); this.cycles += 11; }, // ADD HL,BC
            0x19: () => { this.hl = this.add2(this.hl, this.de); this.cycles += 11; }, // ADD HL,DE
            0x29: () => { this.hl = this.add2(this.hl, this.hl); this.cycles += 11; }, // ADD HL,HL
            0x39: () => { this.hl = this.add2(this.hl, this.sp); this.cycles += 11; }, // ADD HL,SP
            
                // Conditional jump instructions - CRITICAL FOR CP/M BOOT!
            0xC2: () => { const addr = this.next2(); if (!this.zf) this.pc = addr; this.cycles += 10; }, // JP NZ,nn
            0xCA: () => { const addr = this.next2(); if (this.zf) this.pc = addr; this.cycles += 10; }, // JP Z,nn
            0xD2: () => { const addr = this.next2(); if (!this.cf) this.pc = addr; this.cycles += 10; }, // JP NC,nn
            0xDA: () => { const addr = this.next2(); if (this.cf) this.pc = addr; this.cycles += 10; }, // JP C,nn
            0xFA: () => { const addr = this.next2(); if (this.sf) this.pc = addr; this.cycles += 10; }, // JP M,nn

                // Exchange instructions - CRITICAL FOR CP/M BOOT!
            0xEB: () => { const temp = this.de; this.de = this.hl; this.hl = temp; this.cycles += 4; }, // EX DE,HL
            
            // Stack pointer instructions - CRITICAL FOR CP/M BOOT!
            0xF9: () => { this.sp = this.hl; this.cycles += 6; }, // LD SP,HL
            
            // Rotate instructions - CRITICAL FOR CP/M BOOT!
            0x1F: () => { const old_cf = this.cf; this.cf = (this.a & 0x01) !== 0; this.a = ((this.a >> 1) | (old_cf ? 0x80 : 0)) & 0xFF; this.cycles += 4; }, // RRA
            
            0x0B: () => { this.bc = (this.bc - 1) & 0xFFFF; this.cycles += 6; }, // DEC BC
            0x1B: () => { this.de = (this.de - 1) & 0xFFFF; this.cycles += 6; }, // DEC DE
            0x2B: () => { this.hl = (this.hl - 1) & 0xFFFF; this.cycles += 6; }, // DEC HL
            0x3B: () => { this.sp = (this.sp - 1) & 0xFFFF; this.cycles += 6; }, // DEC SP
            
            // Jumps
            0xC3: () => { this.pc = this.next2(); this.cycles += 10; }, // JP nn
            0xC4: () => { if (!this.zf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL NZ,nn
            0xCC: () => { if (this.zf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL Z,nn
            0xD4: () => { if (!this.cf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL NC,nn
            0xDC: () => { if (this.cf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL C,nn
            0xEC: () => { if (this.pf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL PE,nn
            0xE4: () => { if (!this.pf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL PO,nn
            0xF4: () => { if (!this.sf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL P,nn
            0xFC: () => { if (this.sf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL M,nn
            
            // Returns
            0xC9: () => { this.pc = this.pop(); this.cycles += 10; }, // RET
            0xC0: () => { if (!this.zf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET NZ
            0xC8: () => { if (this.zf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET Z
            0xE8: () => { if (this.pf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET PE
            0xE0: () => { if (!this.pf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET PO
            0xF0: () => { if (!this.sf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET P
            0xF8: () => { if (this.sf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET M
            
            // Stack operations
            0xC5: () => { this.push(this.bc); this.cycles += 11; }, // PUSH BC
            0xD5: () => { this.push(this.de); this.cycles += 11; }, // PUSH DE
            0xE5: () => { this.push(this.hl); this.cycles += 11; }, // PUSH HL
            0xF5: () => { this.push(this.af); this.cycles += 11; }, // PUSH AF
            
            0xC1: () => { this.bc = this.pop(); this.cycles += 10; }, // POP BC
            0xD1: () => { this.de = this.pop(); this.cycles += 10; }, // POP DE
            0xE1: () => { this.hl = this.pop(); this.cycles += 10; }, // POP HL
            0xF1: () => { this.af = this.pop(); this.cycles += 10; }, // POP AF
            
            // Control
            0x76: () => { this.halted = true; this.cycles += 4; }, // HALT
            0x00: () => { this.cycles += 4; }, // NOP
            
            // Critical memory operations for CP/M
            0x36: () => { this.w1(this.hl, this.next1()); this.cycles += 10; }, // LD (HL),n
            0x77: () => { this.w1(this.hl, this.a); this.cycles += 7; }, // LD (HL),A
            0x7E: () => { this.a = this.r1(this.hl); this.cycles += 7; }, // LD A,(HL)
            0x46: () => { this.b = this.r1(this.hl); this.cycles += 7; }, // LD B,(HL)
            0x4E: () => { this.c = this.r1(this.hl); this.cycles += 7; }, // LD C,(HL)
            0x56: () => { this.d = this.r1(this.hl); this.cycles += 7; }, // LD D,(HL)
            0x5E: () => { this.e = this.r1(this.hl); this.cycles += 7; }, // LD E,(HL)
            0x66: () => { this.h = this.r1(this.hl); this.cycles += 7; }, // LD H,(HL)
            0x6E: () => { this.l = this.r1(this.hl); this.cycles += 7; }, // LD L,(HL)
            
            // Critical arithmetic for CP/M
            0x90: () => { this.a = this.sub1(this.a, this.b); this.cycles += 4; }, // SUB B
            0x91: () => { this.a = this.sub1(this.a, this.c); this.cycles += 4; }, // SUB C
            0x92: () => { this.a = this.sub1(this.a, this.d); this.cycles += 4; }, // SUB D
            0x93: () => { this.a = this.sub1(this.a, this.e); this.cycles += 4; }, // SUB E
            0x94: () => { this.a = this.sub1(this.a, this.h); this.cycles += 4; }, // SUB H
            0x95: () => { this.a = this.sub1(this.a, this.l); this.cycles += 4; }, // SUB L
            0x96: () => { this.a = this.sub1(this.a, this.r1(this.hl)); this.cycles += 7; }, // SUB (HL)
            0x97: () => { this.a = this.sub1(this.a, this.a); this.cycles += 4; }, // SUB A
            0xD6: () => { this.a = this.sub1(this.a, this.next1()); this.cycles += 7; }, // SUB A,n
            
            // SBC (Subtract with Carry) instructions - CRITICAL FOR CP/M BOOT!
            0x98: () => { this.a = this.sbc1(this.a, this.b); this.cycles += 4; }, // SBC A,B
            0x99: () => { this.a = this.sbc1(this.a, this.c); this.cycles += 4; }, // SBC A,C
            0x9A: () => { this.a = this.sbc1(this.a, this.d); this.cycles += 4; }, // SBC A,D
            0x9B: () => { this.a = this.sbc1(this.a, this.e); this.cycles += 4; }, // SBC A,E
            0x9C: () => { this.a = this.sbc1(this.a, this.h); this.cycles += 4; }, // SBC A,H
            0x9D: () => { this.a = this.sbc1(this.a, this.l); this.cycles += 4; }, // SBC A,L
            0x9E: () => { this.a = this.sbc1(this.a, this.r1(this.hl)); this.cycles += 7; }, // SBC A,(HL)
            0x9F: () => { this.a = this.sbc1(this.a, this.a); this.cycles += 4; }, // SBC A,A
            0xDE: () => { this.a = this.sbc1(this.a, this.next1()); this.cycles += 7; }, // SBC A,n
            
            // Critical increment/decrement for CP/M
            0x3C: () => { this.a = this.inc1(this.a); this.cycles += 4; }, // INC A
            0x04: () => { this.b = this.inc1(this.b); this.cycles += 4; }, // INC B
            0x0C: () => { this.c = this.inc1(this.c); this.cycles += 4; }, // INC C
            0x14: () => { this.d = this.inc1(this.d); this.cycles += 4; }, // INC D
            0x1C: () => { this.e = this.inc1(this.e); this.cycles += 4; }, // INC E
            0x24: () => { this.h = this.inc1(this.h); this.cycles += 4; }, // INC H
            0x2C: () => { this.l = this.inc1(this.l); this.cycles += 4; }, // INC L
            
            0x3D: () => { this.a = this.dec1(this.a); this.cycles += 4; }, // DEC A
            0x05: () => { this.b = this.dec1(this.b); this.cycles += 4; }, // DEC B
            0x0D: () => { this.c = this.dec1(this.c); this.cycles += 4; }, // DEC C
            0x15: () => { this.d = this.dec1(this.d); this.cycles += 4; }, // DEC D
            0x1D: () => { this.e = this.dec1(this.e); this.cycles += 4; }, // DEC E
            0x25: () => { this.h = this.dec1(this.h); this.cycles += 4; }, // DEC H
            0x2D: () => { this.l = this.dec1(this.l); this.cycles += 4; }, // DEC L
            
            // Critical jumps for CP/M
            0xCD: () => { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; }, // CALL nn
            0xE9: () => { this.pc = this.hl; this.cycles += 4; }, // JP (HL)
            0x18: () => { // JR nn (Jump Relative)
                const offset = this.next1s();
                this.pc = (this.pc + offset) & 0xFFFF;
                this.cycles += 12;
            }, // JR nn
            0x28: () => { // JR Z,d (Jump Relative if Zero)
                const offset = this.next1s();
                this.cycles += 7;
                if (this.zf) {
                    this.pc = (this.pc + offset) & 0xFFFF;
                    this.cycles += 5;
                }
            }, // JR Z,d
            0x20: () => { // JR NZ,d (Jump Relative if Not Zero)
                const offset = this.next1s();
                this.cycles += 7;
                if (!this.zf) {
                    this.pc = (this.pc + offset) & 0xFFFF;
                    this.cycles += 5;
                }
            }, // JR NZ,d
            0x38: () => { // JR C,d (Jump Relative if Carry)
                const offset = this.next1s();
                this.cycles += 7;
                if (this.cf) {
                    this.pc = (this.pc + offset) & 0xFFFF;
                    this.cycles += 5;
                }
            }, // JR C,d
            0x30: () => { // JR NC,d (Jump Relative if No Carry)
                const offset = this.next1s();
                this.cycles += 7;
                if (!this.cf) {
                    this.pc = (this.pc + offset) & 0xFFFF;
                    this.cycles += 5;
                }
            }, // JR NC,d
            0xCB3F: () => { // SRL A (Shift Right Logical A)
                this.a = this.srl1(this.a);
                this.cycles += 8;
            }, // SRL A
            0xDD36: () => { // LD (IX+d),n
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                const value = this.next1();
                this.w1(addr, value);
                this.cycles += 19;
            }, // LD (IX+d),n
            0xDD75: () => { // LD (IX+d),L
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.w1(addr, this.l);
                this.cycles += 19;
            }, // LD (IX+d),L
            0xDD74: () => { // LD (IX+d),H
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.w1(addr, this.h);
                this.cycles += 19;
            }, // LD (IX+d),H
            0xDD5E: () => { // LD E,(IX+d)
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.e = this.r1(addr);
                this.cycles += 19;
            }, // LD E,(IX+d)
            0xDD56: () => { // LD D,(IX+d)
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.d = this.r1(addr);
                this.cycles += 19;
            }, // LD D,(IX+d)
            0xDD4E: () => { // LD C,(IX+d)
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.c = this.r1(addr);
                this.cycles += 19;
            }, // LD C,(IX+d)
            0x10: () => { // DJNZ (Decrement B and Jump if Not Zero)
                const offset = this.next1s();
                this.b = (this.b - 1) & 0xFF;
                this.cycles += 10;
                if (this.b !== 0) {
                    this.pc = (this.pc + offset) & 0xFFFF;
                    this.cycles += 5;
                }
            }, // DJNZ
            
            // Critical control for CP/M
            0xF3: () => { this.iff1 = false; this.iff2 = false; this.cycles += 4; }, // DI
            0xFB: () => { this.iff1 = true; this.iff2 = true; this.cycles += 4; }, // EI
            
            // More critical instructions for CP/M boot
            0x32: () => { this.w1(this.next2(), this.a); this.cycles += 13; }, // LD (nn),A
            0x3A: () => { this.a = this.r1(this.next2()); this.cycles += 13; }, // LD A,(nn)
            0x22: () => { this.w2(this.next2(), this.hl); this.cycles += 16; }, // LD (nn),HL
            0x2A: () => { this.hl = this.r2(this.next2()); this.cycles += 16; }, // LD HL,(nn)
            
            // Logical operations
            0xA0: () => { this.a = this.a & this.b; this.cycles += 4; }, // AND B
            0xA1: () => { this.a = this.a & this.c; this.cycles += 4; }, // AND C
            0xA2: () => { this.a = this.a & this.d; this.cycles += 4; }, // AND D
            0xA3: () => { this.a = this.a & this.e; this.cycles += 4; }, // AND E
            0xA4: () => { this.a = this.a & this.h; this.cycles += 4; }, // AND H
            0xA5: () => { this.a = this.a & this.l; this.cycles += 4; }, // AND L
            0xA6: () => { this.a = this.a & this.r1(this.hl); this.cycles += 7; }, // AND (HL)
            0xA7: () => { this.a = this.a & this.a; this.cycles += 4; }, // AND A
            0xE6: () => { this.a = this.a & this.next1(); this.cycles += 7; }, // AND n
            0x2F: () => { this.a ^= 0xFF; this.cycles += 4; }, // CPL (Complement A)
            
            
            // Compare operations
            0xB8: () => { this.sub1(this.a, this.b); this.cycles += 4; }, // CP B
            0xB9: () => { this.sub1(this.a, this.c); this.cycles += 4; }, // CP C
            0xBA: () => { this.sub1(this.a, this.d); this.cycles += 4; }, // CP D
            0xBB: () => { this.sub1(this.a, this.e); this.cycles += 4; }, // CP E
            0xBC: () => { this.sub1(this.a, this.h); this.cycles += 4; }, // CP H
            0xBD: () => { this.sub1(this.a, this.l); this.cycles += 4; }, // CP L
            0xBE: () => { this.sub1(this.a, this.r1(this.hl)); this.cycles += 7; }, // CP (HL)
            0xBF: () => { this.sub1(this.a, this.a); this.cycles += 4; }, // CP A
            0xFE: () => { this.sub1(this.a, this.next1()); this.cycles += 7; }, // CP n
            
            // More jumps and calls
            0xD0: () => { if (!this.cf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET NC
            0xD8: () => { if (this.cf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET C
            
            // Rotate and shift operations
            0x07: () => { this.a = ((this.a << 1) | (this.a >> 7)) & 0xFF; this.cf = (this.a & 0x01) !== 0; this.cycles += 4; }, // RLCA
            0x0F: () => { this.a = ((this.a >> 1) | (this.a << 7)) & 0xFF; this.cf = (this.a & 0x80) !== 0; this.cycles += 4; }, // RRCA
            0x17: () => { const old_cf = this.cf; this.cf = (this.a & 0x80) !== 0; this.a = ((this.a << 1) | (old_cf ? 0x01 : 0)) & 0xFF; this.cycles += 4; }, // RLA
            0x1F: () => { const old_cf = this.cf; this.cf = (this.a & 0x01) !== 0; this.a = ((this.a >> 1) | (old_cf ? 0x80 : 0)) & 0xFF; this.cycles += 4; }, // RRA
            0x3F: () => { this.cf = !this.cf; this.cycles += 4; }, // CCF (Complement Carry Flag)
            
            // Register exchange instructions
            0xD9: () => { // EXX (Exchange register pairs)
                // Exchange BC, DE, HL with their alternate counterparts
                let temp;
                temp = this.b; this.b = this.b_; this.b_ = temp;
                temp = this.c; this.c = this.c_; this.c_ = temp;
                temp = this.d; this.d = this.d_; this.d_ = temp;
                temp = this.e; this.e = this.e_; this.e_ = temp;
                temp = this.h; this.h = this.h_; this.h_ = temp;
                temp = this.l; this.l = this.l_; this.l_ = temp;
                this.cycles += 4;
            }, // EXX
            
            // I/O operations essential for CP/M boot (uses ports 0x0a-0x10)
            0xDB: () => { const port = this.next1(); this.a = this.memio.input(port) & 0xFF; this.cycles += 11; }, // IN A,(n)
            0xD3: () => { const port = this.next1(); this.memio.output(port, this.a); this.cycles += 11; }, // OUT (n),A

            // Common zeroing of A used in boot code
            0xA8: () => { this.a = this.xorByte(this.a, this.b); this.cycles += 4; }, // XOR B
            0xAF: () => { this.a = 0; this.zf = true; this.sf = false; this.pf = true; this.cf = false; this.hf = false; this.nf = false; this.cycles += 4; }, // XOR A
            
            // OR operations - CRITICAL FOR CP/M BOOT!
            0xB0: () => { this.a = this.or1(this.a, this.b); this.cycles += 4; }, // OR B
            0xB1: () => { this.a = this.or1(this.a, this.c); this.cycles += 4; }, // OR C
            0xB2: () => { this.a = this.or1(this.a, this.d); this.cycles += 4; }, // OR D
            0xB3: () => { this.a = this.or1(this.a, this.e); this.cycles += 4; }, // OR E
            0xB4: () => { this.a = this.or1(this.a, this.h); this.cycles += 4; }, // OR H
            0xB5: () => { this.a = this.or1(this.a, this.l); this.cycles += 4; }, // OR L
            0xB6: () => { this.a = this.or1(this.a, this.r1(this.hl)); this.cycles += 7; }, // OR (HL)
            0xB7: () => { this.a = this.or1(this.a, this.a); this.cycles += 4; }, // OR A (test A)
            0xF6: () => { this.a = this.or1(this.a, this.next1()); this.cycles += 7; }, // OR n
            
            // Missing LD (HL),<reg> instructions - CRITICAL FOR CP/M BOOT!
            0x70: () => { this.w1(this.hl, this.b); this.cycles += 7; }, // LD (HL),B
            0x71: () => { this.w1(this.hl, this.c); this.cycles += 7; }, // LD (HL),C
            0x72: () => { this.w1(this.hl, this.d); this.cycles += 7; }, // LD (HL),D
            0x73: () => { this.w1(this.hl, this.e); this.cycles += 7; }, // LD (HL),E
            0x74: () => { this.w1(this.hl, this.h); this.cycles += 7; }, // LD (HL),H
            0x75: () => { this.w1(this.hl, this.l); this.cycles += 7; }, // LD (HL),L
            
            // ED prefix instructions (Extended Z80 instructions)
            0xED40: () => { this.b = this.memio.input(this.bc) & 0xFF; this.cycles += 12; }, // IN B,(C)
            0xED41: () => { this.memio.output(this.bc, this.b); this.cycles += 12; }, // OUT (C),B
            0xED42: () => { this.hl = (this.hl - this.bc - (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // SBC HL,BC
            0xED43: () => { const addr = this.next2(); this.w2(addr, this.bc); this.cycles += 20; }, // LD (nn),BC
            0xED44: () => { this.a = this.neg(this.a); this.cycles += 8; }, // NEG
            0xED45: () => { this.pc = this.pop(); this.cycles += 14; }, // RETN
            0xED46: () => { this.im = 0; this.cycles += 8; }, // IM 0
            0xED47: () => { this.i = this.a; this.cycles += 9; }, // LD I,A
            0xED48: () => { this.c = this.memio.input(this.bc) & 0xFF; this.cycles += 12; }, // IN C,(C)
            0xED49: () => { this.memio.output(this.bc, this.c); this.cycles += 12; }, // OUT (C),C
            0xED4A: () => { this.hl = (this.hl + this.bc + (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // ADC HL,BC
            0xED4B: () => { const addr = this.next2(); this.bc = this.r2(addr); this.cycles += 20; }, // LD BC,(nn)
            0xED4D: () => { this.pc = this.pop(); this.cycles += 14; }, // RETI
            0xED4F: () => { this.r = this.a; this.cycles += 9; }, // LD R,A
            0xED50: () => { this.d = this.memio.input(this.bc) & 0xFF; this.cycles += 12; }, // IN D,(C)
            0xED51: () => { this.memio.output(this.bc, this.d); this.cycles += 12; }, // OUT (C),D
            0xED52: () => { this.hl = (this.hl - this.de - (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // SBC HL,DE
            0xED53: () => { const addr = this.next2(); this.w2(addr, this.de); this.cycles += 20; }, // LD (nn),DE
            0xED56: () => { this.im = 1; this.cycles += 8; }, // IM 1
            0xED57: () => { this.a = this.i; this.cycles += 9; }, // LD A,I
            0xED58: () => { this.e = this.memio.input(this.bc) & 0xFF; this.cycles += 12; }, // IN E,(C)
            0xED59: () => { this.memio.output(this.bc, this.e); this.cycles += 12; }, // OUT (C),E
            0xED5A: () => { this.hl = (this.hl + this.de + (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // ADC HL,DE
            0xED5B: () => { const addr = this.next2(); this.de = this.r2(addr); this.cycles += 20; }, // LD DE,(nn)
            0xED5E: () => { this.im = 2; this.cycles += 8; }, // IM 2
            0xED5F: () => { this.a = this.r; this.cycles += 9; }, // LD A,R
            0xED60: () => { this.h = this.memio.input(this.bc) & 0xFF; this.cycles += 12; }, // IN H,(C)
            0xED61: () => { this.memio.output(this.bc, this.h); this.cycles += 12; }, // OUT (C),H
            0xED62: () => { this.hl = (this.hl - this.hl - (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // SBC HL,HL
            0xED63: () => { const addr = this.next2(); this.w2(addr, this.hl); this.cycles += 20; }, // LD (nn),HL
            0xED67: () => { this.a = this.rrd(this.a, this.hl); this.cycles += 18; }, // RRD
            0xED68: () => { this.l = this.memio.input(this.bc) & 0xFF; this.cycles += 12; }, // IN L,(C)
            0xED69: () => { this.memio.output(this.bc, this.l); this.cycles += 12; }, // OUT (C),L
            0xED6A: () => { this.hl = (this.hl + this.hl + (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // ADC HL,HL
            0xED6B: () => { const addr = this.next2(); this.hl = this.r2(addr); this.cycles += 20; }, // LD HL,(nn)
            0xED6F: () => { this.a = this.rld(this.a, this.hl); this.cycles += 18; }, // RLD
            0xED70: () => { this.memio.input(this.bc); this.cycles += 12; }, // IN (C) - dummy read
            0xED71: () => { this.memio.output(this.bc, 0); this.cycles += 12; }, // OUT (C),0
            0xED72: () => { this.hl = (this.hl - this.sp - (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // SBC HL,SP
            0xED73: () => { const addr = this.next2(); this.w2(addr, this.sp); this.cycles += 20; }, // LD (nn),SP
            0xED78: () => { this.a = this.memio.input(this.bc) & 0xFF; this.cycles += 12; }, // IN A,(C)
            0xED79: () => { this.memio.output(this.bc, this.a); this.cycles += 12; }, // OUT (C),A
            0xED7A: () => { this.hl = (this.hl + this.sp + (this.cf ? 1 : 0)) & 0xFFFF; this.cycles += 15; }, // ADC HL,SP
            0xED7B: () => { const addr = this.next2(); this.sp = this.r2(addr); this.cycles += 20; }, // LD SP,(nn)
            
            // Block transfer instructions
            0xEDB0: () => { // LDIR (Load, Increment, Repeat)
                do {
                    const value = this.r1(this.hl);
                    this.w1(this.de, value);
                    this.hl = (this.hl + 1) & 0xFFFF;
                    this.de = (this.de + 1) & 0xFFFF;
                    this.bc = (this.bc - 1) & 0xFFFF;
                    this.cycles += 21;
                } while (this.bc !== 0);
                this.cycles += 5; // Extra cycles when BC becomes 0
                this.zf = true; // ZF is set when BC becomes 0
                this.nf = false; // NF is reset
                this.hf = false; // HF is reset
                this.pf = false; // PF is reset
            }, // LDIR
            
            // FD prefix instructions (IY register instructions)
            0xFDE5: () => { // PUSH IY
                this.push(this.iy);
                this.cycles += 15;
            }, // PUSH IY
            0xFDE1: () => { // POP IY
                this.iy = this.pop();
                this.cycles += 14;
            }, // POP IY
            0xFDE3: () => { // EX (SP),IY (Exchange IY with stack)
                const temp = this.iy;
                this.iy = this.r2(this.sp);
                this.w2(this.sp, temp);
                this.cycles += 23;
            }, // EX (SP),IY
            0xFD21: () => { // LD IY,nn
                const value = this.next2();
                this.iy = value;
                this.cycles += 14;
            }, // LD IY,nn
            0xFDCB: () => { // FD CB prefix instruction (IY register with CB bit operations)
                // This is a complex instruction that requires special handling
                // The format is: FD CB dd op
                // where dd is signed displacement and op is the CB operation
                const offset = this.next1s();
                const op = this.next1();
                const addr = (this.iy + offset) & 0xFFFF;
                
                // For now, we'll implement a basic version that handles common operations
                // This is a simplified implementation - a full implementation would need
                // to handle all CB operations with IY+displacement addressing
                console.log(`🔍 FD CB instruction: offset=${offset}, op=0x${op.toString(16)}, addr=0x${addr.toString(16)}`);
                
                // Basic implementation - just read the value and set some flags
                const value = this.r1(addr);
                this.zf = (value === 0);
                this.sf = (value & 0x80) !== 0;
                this.cycles += 23; // Base cycles for FD CB instruction
            }, // FD CB prefix
            0xFD7E: () => { // LD A,(IY+d)
                const offset = this.next1s();
                const addr = (this.iy + offset) & 0xFFFF;
                this.a = this.r1(addr);
                this.cycles += 19;
            }, // LD A,(IY+d)
            0xFD6E: () => { // LD L,(IY+d)
                const offset = this.next1s();
                const addr = (this.iy + offset) & 0xFFFF;
                this.l = this.r1(addr);
                this.cycles += 19;
            }, // LD L,(IY+d)
            0xFD66: () => { // LD H,(IY+d)
                const offset = this.next1s();
                const addr = (this.iy + offset) & 0xFFFF;
                this.h = this.r1(addr);
                this.cycles += 19;
            }, // LD H,(IY+d)
            0xFDB6: () => { // OR (IY+d)
                const offset = this.next1s();
                const addr = (this.iy + offset) & 0xFFFF;
                const value = this.r1(addr);
                this.a = this.or1(this.a, value);
                this.cycles += 19;
            }, // OR (IY+d)
            0xFD36: () => { // LD (IY+d),n
                const offset = this.next1s();
                const addr = (this.iy + offset) & 0xFFFF;
                const value = this.next1();
                this.w1(addr, value);
                this.cycles += 19;
            }, // LD (IY+d),n
            0xFD23: () => { // INC IY
                this.iy = (this.iy + 1) & 0xFFFF;
                this.cycles += 10;
            }, // INC IY
            0xFDE9: () => { // JP (IY)
                this.pc = this.iy;
                this.cycles += 8;
            }, // JP (IY)
            
            // DD prefix instructions (IX register instructions)
            0xDDE5: () => { // PUSH IX
                this.push(this.ix);
                this.cycles += 15;
            }, // PUSH IX
            0xDDE1: () => { // POP IX
                this.ix = this.pop();
                this.cycles += 14;
            }, // POP IX
            0xDD21: () => { // LD IX,nn
                const value = this.next2();
                this.ix = value;
                this.cycles += 14;
            }, // LD IX,nn
            0xDD39: () => { // ADD IX,SP
                const result = (this.ix + this.sp) & 0xFFFF;
                this.ix = result;
                // Set flags: CF if result > 0xFFFF, HF for half-carry, NF reset
                this.cf = (this.ix + this.sp) > 0xFFFF;
                this.hf = ((this.ix & 0x0FFF) + (this.sp & 0x0FFF)) > 0x0FFF;
                this.nf = false;
                this.cycles += 15;
            }, // ADD IX,SP
            0xDD6E: () => { // LD L,(IX+d)
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.l = this.r1(addr);
                this.cycles += 19;
            }, // LD L,(IX+d)
            0xDD66: () => { // LD H,(IX+d)
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.h = this.r1(addr);
                this.cycles += 19;
            }, // LD H,(IX+d)
            0xDD77: () => { // LD (IX+d),A
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.w1(addr, this.a);
                this.cycles += 19;
            }, // LD (IX+d),A
            0xDD7E: () => { // LD A,(IX+d)
                const offset = this.next1s();
                const addr = (this.ix + offset) & 0xFFFF;
                this.a = this.r1(addr);
                this.cycles += 19;
            }, // LD A,(IX+d)
            0xDDF9: () => { // LD SP,IX
                this.sp = this.ix;
                this.cycles += 10;
            }, // LD SP,IX
            0xDDE9: () => { // JP (IX)
                this.pc = this.ix;
                this.cycles += 8;
            }, // JP (IX)
        };
    }

    // Step through one instruction
    step() {
        if (this.halted) {
            this.cycles += 4;
            return false;
        }

        try {
            let opcode = this.next1();
            
            // Handle prefix bytes for Z80 instructions
            if (this.prefix === 0) {
                // Check for prefix bytes
                if (opcode === 0xCB || opcode === 0xED || opcode === 0xDD || opcode === 0xFD) {
                    this.prefix = opcode;
                    // Read the next byte as the actual instruction
                    opcode = this.next1();
                    console.log(`🔍 PREFIX DETECTED: 0x${this.prefix.toString(16)} + 0x${opcode.toString(16)} = 0x${(this.prefix * 0x100 + opcode).toString(16)}`);
                }
            }
            
            const instruction = this.instructions[this.prefix * 0x100 + opcode];
            
            // Debug logging for first few steps
            if (this.pc < 0x100) {
                console.log(`🔍 Z80 Step: PC=0x${(this.pc - 1).toString(16).padStart(4, '0')}, Opcode=0x${opcode.toString(16).padStart(2, '0')}, A=0x${this.a.toString(16).padStart(2, '0')}`);
                
                // Show memory contents around PC for debugging
                if (this.pc < 0x20) {
                    let memDump = "Memory: ";
                    for (let i = 0; i < 16; i++) {
                        const addr = (this.pc - 1 + i) & 0xFFFF;
                        memDump += `0x${this.memio.rd(addr).toString(16).padStart(2, '0')} `;
                    }
                    console.log(memDump);
                }
            }
            
            if (instruction) {
                instruction();
                // Reset prefix after executing instruction
                this.prefix = 0;
                return true;
            } else {
                console.error(`❌ UNIMPLEMENTED INSTRUCTION: 0x${(this.prefix * 0x100 + opcode).toString(16).padStart(2, '0')} at PC=0x${(this.pc - 1).toString(16).padStart(4, '0')}`);
                console.error(`   This instruction is needed for CP/M to boot!`);
                this.cycles += 4;
                // Reset prefix after error
                this.prefix = 0;
                return false;
            }
        } catch (error) {
            console.error('Z80 step error:', error);
            return false;
        }
    }

    // Register pair getters/setters
    get af() { return (this.a << 8) | this.f; }
    get bc() { return (this.b << 8) | this.c; }
    get de() { return (this.d << 8) | this.e; }
    get hl() { return (this.h << 8) | this.l; }

    set af(value) { 
        this.a = (value >> 8) & 0xFF; 
        this.f = value & 0xFF; 
    }
    set bc(value) { 
        this.b = (value >> 8) & 0xFF; 
        this.c = value & 0xFF; 
    }
    set de(value) { 
        this.d = (value >> 8) & 0xFF; 
        this.e = value & 0xFF; 
    }
    set hl(value) { 
        this.h = (value >> 8) & 0xFF; 
        this.l = value & 0xFF; 
    }

    // Flag getters
    get cf() { return (this.f & 0x01) !== 0; }
    get nf() { return (this.f & 0x02) !== 0; }
    get pf() { return (this.f & 0x04) !== 0; }
    get vf() { return (this.f & 0x04) !== 0; }
    get hf() { return (this.f & 0x10) !== 0; }
    get zf() { return (this.f & 0x40) !== 0; }
    get sf() { return (this.f & 0x80) !== 0; }

    // Flag setters
    set cf(value) { 
        if (value) this.f |= 0x01; 
        else this.f &= 0xFE; 
    }
    set nf(value) { 
        if (value) this.f |= 0x02; 
        else this.f &= 0xFD; 
    }
    set pf(value) { 
        if (value) this.f |= 0x04; 
        else this.f &= 0xFB; 
    }
    set vf(value) { 
        if (value) this.f |= 0x04; 
        else this.f &= 0xFB; 
    }
    set hf(value) { 
        if (value) this.f |= 0x10; 
        else this.f &= 0xEF; 
    }
    set zf(value) { 
        if (value) this.f |= 0x40; 
        else this.f &= 0xBF; 
    }
    set sf(value) { 
        if (value) this.f |= 0x80; 
        else this.f &= 0x7F; 
    }

    // Utility methods
    next1() {
        const value = this.memio.rd(this.pc);
        this.pc = (this.pc + 1) & 0xFFFF;
        return value;
    }

    next2() {
        const low = this.next1();
        const high = this.next1();
        return (high << 8) | low;
    }

    next1s() {
        const value = this.next1();
        return (value & 0x80) ? (value - 256) : value;
    }

    // Stack operations
    push(value) {
        this.sp = (this.sp - 2) & 0xFFFF;
        this.memio.wr(this.sp, value & 0xFF);
        this.memio.wr((this.sp + 1) & 0xFFFF, (value >> 8) & 0xFF);
    }

    pop() {
        const low = this.memio.rd(this.sp);
        const high = this.memio.rd((this.sp + 1) & 0xFFFF);
        this.sp = (this.sp + 2) & 0xFFFF;
        return (high << 8) | low;
    }

    // Memory read/write helpers
    r1(address) {
        return this.memio.rd(address);
    }

    r2(address) {
        const low = this.memio.rd(address);
        const high = this.memio.rd((address + 1) & 0xFFFF);
        return (high << 8) | low;
    }

    w1(address, value) {
        this.memio.wr(address, value & 0xFF);
    }

    w2(address, value) {
        this.memio.wr(address, value & 0xFF);
        this.memio.wr((address + 1) & 0xFFFF, (value >> 8) & 0xFF);
    }

    // Arithmetic helpers
    add1(a, b) {
        const result = (a + b) & 0xFF;
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = ((a & 0x0F) + (b & 0x0F)) > 0x0F;
        this.cf = (a + b) > 0xFF;
        this.pf = this.calcParity(result);
        this.nf = false;
        return result;
    }

    add2(a, b) {
        const result = (a + b) & 0xFFFF;
        this.zf = (result === 0);
        this.sf = (result & 0x8000) !== 0;
        this.hf = ((a & 0x0FFF) + (b & 0x0FFF)) > 0x0FFF;
        this.cf = (a + b) > 0xFFFF;
        this.pf = this.calcParity(result);
        this.nf = false;
        return result;
    }

    sub1(a, b) {
        const result = (a - b) & 0xFF;
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = (a & 0x0F) < (b & 0x0F);
        this.cf = a < b;
        this.pf = this.calcParity(result);
        this.nf = true;
        return result;
    }

    sbc1(a, b) {
        const carry = this.cf ? 1 : 0;
        const result = (a - b - carry) & 0xFF;
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = (a & 0x0F) < ((b & 0x0F) + carry);
        this.cf = a < (b + carry);
        this.pf = this.calcParity(result);
        this.nf = true;
        return result;
    }
    
    // Helper functions for ED prefix instructions
    neg(value) {
        const result = (0 - value) & 0xFF;
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = ((0 & 0x0F) - (value & 0x0F)) < 0;
        this.pf = this.calcParity(result);
        this.cf = value !== 0;
        this.nf = true;
        return result;
    }
    
    rrd(a, hl) {
        const mem = this.r1(hl);
        const result = ((a & 0xF0) | (mem & 0x0F)) & 0xFF;
        this.w1(hl, ((mem >> 4) | (a << 4)) & 0xFF);
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = false;
        this.pf = this.calcParity(result);
        this.nf = false;
        return result;
    }
    
    rld(a, hl) {
        const mem = this.r1(hl);
        const result = ((a & 0xF0) | ((mem >> 4) & 0x0F)) & 0xFF;
        this.w1(hl, ((mem << 4) | (a & 0x0F)) & 0xFF);
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = false;
        this.pf = this.calcParity(result);
        this.nf = false;
        return result;
    }

    sub2(a, b) {
        const result = (a - b) & 0xFFFF;
        this.zf = (result === 0);
        this.sf = (result & 0x8000) !== 0;
        this.hf = (a & 0x0FFF) < (b & 0x0FFF);
        this.cf = a < b;
        this.pf = this.calcParity(result);
        this.nf = true;
        return result;
    }

    or1(a, b) {
        const result = (a | b) & 0xFF;
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = false;
        this.cf = false;
        this.pf = this.calcParity(result);
        this.nf = false;
        return result;
    }

    xorByte(a, b) {
        const result = (a ^ b) & 0xFF;
        this.zf = (result === 0);
        this.sf = (result & 0x80) !== 0;
        this.hf = false;
        this.cf = false;
        this.pf = this.calcParity(result);
        this.nf = false;
        return result;
    }

    srl1(v) { // SRL r - Shift Right Logical
        const result = v >> 1;
        this.cf = (v & 0x01) !== 0;
        this.zf = (result === 0);
        this.sf = false;
        this.hf = false;
        this.pf = this.calcParity(result);
        this.nf = false;
        return result;
    }

    // Flag calculation helpers
    calcParity(value) {
        let parity = 0;
        for (let i = 0; i < 8; i++) {
            if (value & (1 << i)) parity++;
        }
        return (parity & 1) === 0;
    }
    
    // Debug helper
    debugStep() {
        console.log(`🔍 Z80 Step: PC=0x${this.pc.toString(16).padStart(4, '0')}, A=0x${this.a.toString(16).padStart(2, '0')}, F=0x${this.f.toString(16).padStart(2, '0')}`);
    }

    inc1(value) {
        return this.add1(value, 1);
    }

    dec1(value) {
        return this.sub1(value, 1);
    }

    // Interrupt handling (stubs for now)
    interrupt() {
        // TODO: Implement interrupt handling
    }

    nonMaskableInterrupt() {
        // TODO: Implement NMI handling
    }

    // Additional methods required by the emulator
    setRegisters(r) {
        let s = "";
        for (let i = 1; i < r.length; i += 2) {
            const reg = r[i].toLowerCase();
            const n = parseInt(r[i + 1], 16);
            
            switch (reg) {
                case 'a':
                    this.a = n & 0xFF;
                    break;
                case 'b':
                    this.b = n & 0xFF;
                    break;
                case 'c':
                    this.c = n & 0xFF;
                    break;
                case 'd':
                    this.d = n & 0xFF;
                    break;
                case 'e':
                    this.e = n & 0xFF;
                    break;
                case 'h':
                    this.h = n & 0xFF;
                    break;
                case 'l':
                    this.l = n & 0xFF;
                    break;
                case 'f':
                    this.f = n & 0xFF;
                    break;
                case 'af':
                    this.af = n;
                    break;
                case 'bc':
                    this.bc = n;
                    break;
                case 'de':
                    this.de = n;
                    break;
                case 'hl':
                    this.hl = n;
                    break;
                case 'sp':
                    this.sp = n & 0xFFFF;
                    break;
                case 'pc':
                    this.pc = n & 0xFFFF;
                    break;
                default:
                    s += " unknown register " + reg;
            }
        }
        if (s) s += '\r\n';
        return s;
    }

    cpuStatus() {
        let s = "";
        s += " AF:" + this.pad(this.af.toString(16), 4);
        s += " " +
             (this.f & 0x80 ? "s" : ".") +
             (this.f & 0x40 ? "z" : ".") +
             (this.f & 0x10 ? "h" : ".") +
             (this.f & 0x04 ? "p" : ".") +
             (this.f & 0x01 ? "c" : ".");
        s += " BC:" + this.pad(this.bc.toString(16), 4);
        s += " DE:" + this.pad(this.de.toString(16), 4);
        s += " HL:" + this.pad(this.hl.toString(16), 4);
        s += " (HL):" + this.pad(this.memio.rd(this.hl).toString(16), 2);
        s += " SP:" + this.pad(this.sp.toString(16), 4);
        s += " PC:"; // + this.pad(this.pc.toString(16), 4);
        s += this.disassemble1(this.pc)[1];
        return s;
    }

    disassemble(addr) {
        let r = [];
        for (let i = 0; i < 16; ++i) {
            const l = this.disassemble1(addr);
            r.push(l[1]);
            r.push("\r\n");
            addr = l[0];
        }
        return [r.join(""), addr];
    }

    disassemble1(addr) {
        let r = [];
        const d = this.disassembleInstruction(addr);
        r.push(this.pad(addr.toString(16), 4));
        r.push(": ");
        let j;
        for (j = 0; j < d[0] - addr; j++) {
            r.push(this.pad(this.memio.rd(addr + j).toString(16), 2));
        }
        while (j < 3) {
            r.push("  ");
            j++;
        }
        r.push(" ");
        r.push(d[1]);
        return [d[0], r.join("")];
    }

    disassembleInstruction(addr) {
        const opcode = this.memio.rd(addr);
        let r = "";
        
        // Basic instruction disassembly - we'll expand this
        switch (opcode) {
            case 0x00: r = "NOP"; break;
            case 0x3E: r = "LD A,n"; break;
            case 0x06: r = "LD B,n"; break;
            case 0x0E: r = "LD C,n"; break;
            case 0x16: r = "LD D,n"; break;
            case 0x1E: r = "LD E,n"; break;
            case 0x26: r = "LD H,n"; break;
            case 0x2E: r = "LD L,n"; break;
            case 0x76: r = "HALT"; break;
            case 0xC3: r = "JP nn"; break;
            case 0xC9: r = "RET"; break;
            default: r = "DB " + opcode.toString(16).padStart(2, '0');
        }
        
        return [addr + 1, r];
    }

    add(a, b) {
        return (a + b) & 0xFFFF;
    }

    pad(str, n) {
        let r = [];
        for (let i = 0; i < (n - str.length); ++i) {
            r.push("0");
        }
        r.push(str);
        return r.join("");
    }
}

// Export for browser use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Z80Adapter;
} else {
    window.Z80Adapter = Z80Adapter;
}
