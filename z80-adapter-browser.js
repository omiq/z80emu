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
            0x87: () => { this.a = this.add1(this.a, this.a); this.cycles += 4; }, // ADD A,A
            
            // Increment/Decrement
            0x03: () => { this.bc = (this.bc + 1) & 0xFFFF; this.cycles += 6; }, // INC BC
            0x13: () => { this.de = (this.de + 1) & 0xFFFF; this.cycles += 6; }, // INC DE
            0x23: () => { this.hl = (this.hl + 1) & 0xFFFF; this.cycles += 6; }, // INC HL
            0x33: () => { this.sp = (this.sp + 1) & 0xFFFF; this.cycles += 6; }, // INC SP
            
            0x0B: () => { this.bc = (this.bc - 1) & 0xFFFF; this.cycles += 6; }, // DEC BC
            0x1B: () => { this.de = (this.de - 1) & 0xFFFF; this.cycles += 6; }, // DEC DE
            0x2B: () => { this.hl = (this.hl - 1) & 0xFFFF; this.cycles += 6; }, // DEC HL
            0x3B: () => { this.sp = (this.sp - 1) & 0xFFFF; this.cycles += 6; }, // DEC SP
            
            // Jumps
            0xC3: () => { this.pc = this.next2(); this.cycles += 10; }, // JP nn
            0xC2: () => { if (!this.zf) { this.pc = this.next2(); this.cycles += 10; } else { this.pc += 2; this.cycles += 10; } }, // JP NZ,nn
            0xCA: () => { if (this.zf) { this.pc = this.next2(); this.cycles += 10; } else { this.pc += 2; this.cycles += 10; } }, // JP Z,nn
            0xC4: () => { if (!this.zf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL NZ,nn
            0xCC: () => { if (this.zf) { this.push(this.pc + 2); this.pc = this.next2(); this.cycles += 17; } else { this.pc += 2; this.cycles += 10; } }, // CALL Z,nn
            
            // Returns
            0xC9: () => { this.pc = this.pop(); this.cycles += 10; }, // RET
            0xC0: () => { if (!this.zf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET NZ
            0xC8: () => { if (this.zf) { this.pc = this.pop(); this.cycles += 11; } else { this.cycles += 5; } }, // RET Z
            
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
            0x97: () => { this.a = this.sub1(this.a, this.a); this.cycles += 4; }, // SUB A
            
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
            
            // Critical control for CP/M
            0xF3: () => { this.iff1 = false; this.iff2 = false; this.cycles += 4; }, // DI
            0xFB: () => { this.iff1 = true; this.iff2 = true; this.cycles += 4; }, // EI
        };
    }

    // Step through one instruction
    step() {
        if (this.halted) {
            this.cycles += 4;
            return false;
        }

        try {
            const opcode = this.next1();
            const instruction = this.instructions[opcode];
            
            if (instruction) {
                instruction();
                return true;
            } else {
                console.warn(`Unimplemented instruction: 0x${opcode.toString(16).padStart(2, '0')} at PC=0x${this.pc.toString(16).padStart(4, '0')}`);
                this.cycles += 4;
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

    // Flag calculation helpers
    calcParity(value) {
        let parity = 0;
        for (let i = 0; i < 8; i++) {
            if (value & (1 << i)) parity++;
        }
        return (parity & 1) === 0;
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
