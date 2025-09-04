/*
 * Z80 Adapter - Wraps z80-emulator library for compatibility with existing interface
 * This adapter provides the same interface as our custom Z80 emulator but uses the
 * proven z80-emulator library underneath.
 */

const { Z80 } = require('z80-emulator');

class Z80Adapter {
    constructor(memio) {
        this.memio = memio;
        this.z80 = new Z80(this);
        
        // Initialize registers to match our existing interface
        this.reset();
    }

    // Reset the Z80 to initial state
    reset() {
        this.z80.reset();
        this.z80.regs.pc = 0;
        this.z80.regs.sp = 0xF000;
        this.z80.regs.af = 0;
        this.z80.regs.bc = 0;
        this.z80.regs.de = 0;
        this.z80.regs.hl = 0;
        this.z80.regs.ix = 0;
        this.z80.regs.iy = 0;
        this.z80.regs.af_ = 0;
        this.z80.regs.bc_ = 0;
        this.z80.regs.de_ = 0;
        this.z80.regs.hl_ = 0;
        this.z80.regs.ix_ = 0;
        this.z80.regs.iy_ = 0;
        this.z80.regs.i = 0;
        this.z80.regs.r = 0;
        this.z80.regs.iff1 = false;
        this.z80.regs.iff2 = false;
        this.z80.regs.im = 0;
    }

    // Step through one instruction
    step() {
        try {
            this.z80.step();
            return true;
        } catch (error) {
            console.error('Z80 step error:', error);
            return false;
        }
    }

    // Get register values (compatibility with existing interface)
    get a() { return this.z80.regs.a; }
    get f() { return this.z80.regs.f; }
    get b() { return this.z80.regs.b; }
    get c() { return this.z80.regs.c; }
    get d() { return this.z80.regs.d; }
    get e() { return this.z80.regs.e; }
    get h() { return this.z80.regs.h; }
    get l() { return this.z80.regs.l; }
    get pc() { return this.z80.regs.pc; }
    get sp() { return this.z80.regs.sp; }
    get ix() { return this.z80.regs.ix; }
    get iy() { return this.z80.regs.iy; }
    get i() { return this.z80.regs.i; }
    get r() { return this.z80.regs.r; }

    // Set register values
    set a(value) { this.z80.regs.a = value & 0xFF; }
    set f(value) { this.z80.regs.f = value & 0xFF; }
    set c(value) { this.z80.regs.c = value & 0xFF; }
    set b(value) { this.z80.regs.b = value & 0xFF; }
    set d(value) { this.z80.regs.d = value & 0xFF; }
    set e(value) { this.z80.regs.e = value & 0xFF; }
    set h(value) { this.z80.regs.h = value & 0xFF; }
    set l(value) { this.z80.regs.l = value & 0xFF; }
    set pc(value) { this.z80.regs.pc = value & 0xFFFF; }
    set sp(value) { this.z80.regs.sp = value & 0xFFFF; }
    set ix(value) { this.z80.regs.ix = value & 0xFFFF; }
    set iy(value) { this.z80.regs.iy = value & 0xFFFF; }
    set i(value) { this.z80.regs.i = value & 0xFF; }
    set r(value) { this.z80.regs.r = value & 0xFF; }

    // Register pair getters/setters
    get af() { return (this.z80.regs.a << 8) | this.z80.regs.f; }
    get bc() { return (this.z80.regs.b << 8) | this.z80.regs.c; }
    get de() { return (this.z80.regs.d << 8) | this.z80.regs.e; }
    get hl() { return (this.z80.regs.h << 8) | this.z80.regs.l; }

    set af(value) { 
        this.z80.regs.a = (value >> 8) & 0xFF; 
        this.z80.regs.f = value & 0xFF; 
    }
    set bc(value) { 
        this.z80.regs.b = (value >> 8) & 0xFF; 
        this.z80.regs.c = value & 0xFF; 
    }
    set de(value) { 
        this.z80.regs.d = (value >> 8) & 0xFF; 
        this.z80.regs.e = value & 0xFF; 
    }
    set hl(value) { 
        this.z80.regs.h = (value >> 8) & 0xFF; 
        this.z80.regs.l = value & 0xFF; 
    }

    // Flag getters
    get cf() { return (this.z80.regs.f & 0x01) !== 0; }
    get nf() { return (this.z80.regs.f & 0x02) !== 0; }
    get pf() { return (this.z80.regs.f & 0x04) !== 0; }
    get vf() { return (this.z80.regs.f & 0x04) !== 0; }
    get hf() { return (this.z80.regs.f & 0x10) !== 0; }
    get zf() { return (this.z80.regs.f & 0x40) !== 0; }
    get sf() { return (this.z80.regs.f & 0x80) !== 0; }

    // Flag setters
    set cf(value) { 
        if (value) this.z80.regs.f |= 0x01; 
        else this.z80.regs.f &= 0xFE; 
    }
    set nf(value) { 
        if (value) this.z80.regs.f |= 0x02; 
        else this.z80.regs.f &= 0xFD; 
    }
    set pf(value) { 
        if (value) this.z80.regs.f |= 0x04; 
        else this.z80.regs.f &= 0xFB; 
    }
    set vf(value) { 
        if (value) this.z80.regs.f |= 0x04; 
        else this.z80.regs.f &= 0xFB; 
    }
    set hf(value) { 
        if (value) this.z80.regs.f |= 0x10; 
        else this.z80.regs.f &= 0xEF; 
    }
    set zf(value) { 
        if (value) this.z80.regs.f |= 0x40; 
        else this.z80.regs.f &= 0xBF; 
    }
    set sf(value) { 
        if (value) this.z80.regs.f |= 0x80; 
        else this.z80.regs.f &= 0x7F; 
    }

    // Memory and I/O interface for z80-emulator
    readMemory(address) {
        return this.memio.rd(address);
    }

    writeMemory(address, value) {
        this.memio.wr(address, value);
    }

    readPort(address) {
        return this.memio.rdPort ? this.memio.rdPort(address) : 0;
    }

    writePort(address, value) {
        if (this.memio.wrPort) {
            this.memio.wrPort(address, value);
        }
    }

    // Clock cycle tracking
    get cycles() {
        return this.z80.hal.tStateCount;
    }

    set cycles(value) {
        // Note: z80-emulator manages cycles internally
        // This is for compatibility only
    }

    // Interrupt handling
    interrupt() {
        this.z80.interrupt();
    }

    nonMaskableInterrupt() {
        this.z80.nonMaskableInterrupt();
    }

    // Utility methods for compatibility
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
}

module.exports = Z80Adapter;
