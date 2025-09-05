# Z80 Instructions Currently Implemented in the Emulator

This document lists all Z80 instructions currently implemented in the `z80-adapter-browser.js` file.

## Basic 8-bit Load Instructions

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x06 | LD B,n | Load immediate value into B | 7 |
| 0x0E | LD C,n | Load immediate value into C | 7 |
| 0x16 | LD D,n | Load immediate value into D | 7 |
| 0x1E | LD E,n | Load immediate value into E | 7 |
| 0x26 | LD H,n | Load immediate value into H | 7 |
| 0x2E | LD L,n | Load immediate value into L | 7 |
| 0x3E | LD A,n | Load immediate value into A | 7 |

## 16-bit Load Instructions

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x01 | LD BC,nn | Load immediate value into BC | 10 |
| 0x11 | LD DE,nn | Load immediate value into DE | 10 |
| 0x21 | LD HL,nn | Load immediate value into HL | 10 |
| 0x31 | LD SP,nn | Load immediate value into SP | 10 |

## Register-to-Register Load Instructions

### B Register Loads
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x40 | LD B,B | Load B into B | 4 |
| 0x41 | LD B,C | Load C into B | 4 |
| 0x42 | LD B,D | Load D into B | 4 |
| 0x43 | LD B,E | Load E into B | 4 |
| 0x44 | LD B,H | Load H into B | 4 |
| 0x45 | LD B,L | Load L into B | 4 |
| 0x47 | LD B,A | Load A into B | 4 |

### C Register Loads
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x48 | LD C,B | Load B into C | 4 |
| 0x49 | LD C,C | Load C into C | 4 |
| 0x4A | LD C,D | Load D into C | 4 |
| 0x4B | LD C,E | Load E into C | 4 |
| 0x4C | LD C,H | Load H into C | 4 |
| 0x4D | LD C,L | Load L into C | 4 |
| 0x4F | LD C,A | Load A into C | 4 |

### D Register Loads
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x50 | LD D,B | Load B into D | 4 |
| 0x51 | LD D,C | Load C into D | 4 |
| 0x52 | LD D,D | Load D into D | 4 |
| 0x53 | LD D,E | Load E into D | 4 |
| 0x54 | LD D,H | Load H into D | 4 |
| 0x55 | LD D,L | Load L into D | 4 |
| 0x57 | LD D,A | Load A into D | 4 |

### E Register Loads
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x58 | LD E,B | Load B into E | 4 |
| 0x59 | LD E,C | Load C into E | 4 |
| 0x5A | LD E,D | Load D into E | 4 |
| 0x5B | LD E,E | Load E into E | 4 |
| 0x5C | LD E,H | Load H into E | 4 |
| 0x5D | LD E,L | Load L into E | 4 |
| 0x5F | LD E,A | Load A into E | 4 |

### H Register Loads
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x60 | LD H,B | Load B into H | 4 |
| 0x61 | LD H,C | Load C into H | 4 |
| 0x62 | LD H,D | Load D into H | 4 |
| 0x63 | LD H,E | Load E into H | 4 |
| 0x64 | LD H,H | Load H into H | 4 |
| 0x65 | LD H,L | Load L into H | 4 |
| 0x67 | LD H,A | Load A into H | 4 |

### L Register Loads
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x68 | LD L,B | Load B into L | 4 |
| 0x69 | LD L,C | Load C into L | 4 |
| 0x6A | LD L,D | Load D into L | 4 |
| 0x6B | LD L,E | Load E into L | 4 |
| 0x6C | LD L,H | Load H into L | 4 |
| 0x6D | LD L,L | Load L into L | 4 |
| 0x6F | LD L,A | Load A into L | 4 |

### A Register Loads
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x78 | LD A,B | Load B into A | 4 |
| 0x79 | LD A,C | Load C into A | 4 |
| 0x7A | LD A,D | Load D into A | 4 |
| 0x7B | LD A,E | Load E into A | 4 |
| 0x7C | LD A,H | Load H into A | 4 |
| 0x7D | LD A,L | Load L into A | 4 |
| 0x7F | LD A,A | Load A into A | 4 |

## Memory Operations

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x02 | LD (BC),A | Store A to memory at BC | 7 |
| 0x0A | LD A,(BC) | Load A from memory at BC | 7 |
| 0x12 | LD (DE),A | Store A to memory at DE | 7 |
| 0x1A | LD A,(DE) | Load A from memory at DE | 7 |
| 0x36 | LD (HL),n | Store immediate value to memory at HL | 10 |
| 0x77 | LD (HL),A | Store A to memory at HL | 7 |
| 0x7E | LD A,(HL) | Load A from memory at HL | 7 |
| 0x46 | LD B,(HL) | Load B from memory at HL | 7 |
| 0x4E | LD C,(HL) | Load C from memory at HL | 7 |
| 0x56 | LD D,(HL) | Load D from memory at HL | 7 |
| 0x5E | LD E,(HL) | Load E from memory at HL | 7 |
| 0x66 | LD H,(HL) | Load H from memory at HL | 7 |
| 0x6E | LD L,(HL) | Load L from memory at HL | 7 |
| 0x32 | LD (nn),A | Store A to absolute address | 13 |
| 0x3A | LD A,(nn) | Load A from absolute address | 13 |
| 0x22 | LD (nn),HL | Store HL to absolute address | 16 |
| 0x2A | LD HL,(nn) | Load HL from absolute address | 16 |

## LD (HL),<reg> Instructions

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x70 | LD (HL),B | Store B to memory at HL | 7 |
| 0x71 | LD (HL),C | Store C to memory at HL | 7 |
| 0x72 | LD (HL),D | Store D to memory at HL | 7 |
| 0x73 | LD (HL),E | Store E to memory at HL | 7 |
| 0x74 | LD (HL),H | Store H to memory at HL | 7 |
| 0x75 | LD (HL),L | Store L to memory at HL | 7 |

## 8-bit Arithmetic Operations

### ADD Instructions
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x80 | ADD A,B | Add B to A | 4 |
| 0x81 | ADD A,C | Add C to A | 4 |
| 0x82 | ADD A,D | Add D to A | 4 |
| 0x83 | ADD A,E | Add E to A | 4 |
| 0x84 | ADD A,H | Add H to A | 4 |
| 0x85 | ADD A,L | Add L to A | 4 |
| 0x86 | ADD A,(HL) | Add memory at HL to A | 7 |
| 0x87 | ADD A,A | Add A to A | 4 |
| 0xC6 | ADD A,n | Add immediate value to A | 7 |

### ADC Instructions (Add with Carry)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x8F | ADC A,A | Add A with carry to A | 4 |
| 0xCE | ADC A,n | Add immediate with carry to A | 7 |

### SUB Instructions
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x90 | SUB B | Subtract B from A | 4 |
| 0x91 | SUB C | Subtract C from A | 4 |
| 0x92 | SUB D | Subtract D from A | 4 |
| 0x93 | SUB E | Subtract E from A | 4 |
| 0x94 | SUB H | Subtract H from A | 4 |
| 0x95 | SUB L | Subtract L from A | 4 |
| 0x96 | SUB (HL) | Subtract memory at HL from A | 7 |
| 0x97 | SUB A | Subtract A from A | 4 |
| 0xD6 | SUB A,n | Subtract immediate value from A | 7 |

### SBC Instructions (Subtract with Carry)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x98 | SBC A,B | Subtract B from A with carry | 4 |
| 0x99 | SBC A,C | Subtract C from A with carry | 4 |
| 0x9A | SBC A,D | Subtract D from A with carry | 4 |
| 0x9B | SBC A,E | Subtract E from A with carry | 4 |
| 0x9C | SBC A,H | Subtract H from A with carry | 4 |
| 0x9D | SBC A,L | Subtract L from A with carry | 4 |
| 0x9E | SBC A,(HL) | Subtract memory at HL from A with carry | 7 |
| 0x9F | SBC A,A | Subtract A from A with carry | 4 |
| 0xDE | SBC A,n | Subtract immediate value from A with carry | 7 |

## 16-bit Arithmetic Operations

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x09 | ADD HL,BC | Add BC to HL | 11 |
| 0x19 | ADD HL,DE | Add DE to HL | 11 |
| 0x29 | ADD HL,HL | Add HL to HL | 11 |
| 0x39 | ADD HL,SP | Add SP to HL | 11 |

## Increment/Decrement Operations

### 8-bit Increment
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x3C | INC A | Increment A | 4 |
| 0x04 | INC B | Increment B | 4 |
| 0x0C | INC C | Increment C | 4 |
| 0x14 | INC D | Increment D | 4 |
| 0x1C | INC E | Increment E | 4 |
| 0x24 | INC H | Increment H | 4 |
| 0x2C | INC L | Increment L | 4 |
| 0x34 | INC (HL) | Increment memory at HL | 10 |

### 8-bit Decrement
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x3D | DEC A | Decrement A | 4 |
| 0x05 | DEC B | Decrement B | 4 |
| 0x0D | DEC C | Decrement C | 4 |
| 0x15 | DEC D | Decrement D | 4 |
| 0x1D | DEC E | Decrement E | 4 |
| 0x25 | DEC H | Decrement H | 4 |
| 0x2D | DEC L | Decrement L | 4 |
| 0x35 | DEC (HL) | Decrement memory at HL | 10 |

### 16-bit Increment
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x03 | INC BC | Increment BC | 6 |
| 0x13 | INC DE | Increment DE | 6 |
| 0x23 | INC HL | Increment HL | 6 |
| 0x33 | INC SP | Increment SP | 6 |

### 16-bit Decrement
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x0B | DEC BC | Decrement BC | 6 |
| 0x1B | DEC DE | Decrement DE | 6 |
| 0x2B | DEC HL | Decrement HL | 6 |
| 0x3B | DEC SP | Decrement SP | 6 |

## Jump Instructions

### Unconditional Jumps
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xC3 | JP nn | Jump to absolute address | 10 |
| 0xE9 | JP (HL) | Jump to address in HL | 4 |

### Conditional Jumps
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xC2 | JP NZ,nn | Jump if not zero | 10 |
| 0xCA | JP Z,nn | Jump if zero | 10 |
| 0xD2 | JP NC,nn | Jump if no carry | 10 |
| 0xDA | JP C,nn | Jump if carry | 10 |
| 0xFA | JP M,nn | Jump if minus | 10 |

### Relative Jumps
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x18 | JR nn | Jump relative | 12 |
| 0x20 | JR NZ,d | Jump relative if not zero | 7/12 |
| 0x28 | JR Z,d | Jump relative if zero | 7/12 |
| 0x30 | JR NC,d | Jump relative if no carry | 7/12 |
| 0x38 | JR C,d | Jump relative if carry | 7/12 |

## Call Instructions

### Unconditional Calls
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCD | CALL nn | Call subroutine | 17 |

### Conditional Calls
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xC4 | CALL NZ,nn | Call if not zero | 10/17 |
| 0xCC | CALL Z,nn | Call if zero | 10/17 |
| 0xD4 | CALL NC,nn | Call if no carry | 10/17 |
| 0xDC | CALL C,nn | Call if carry | 10/17 |
| 0xE4 | CALL PO,nn | Call if parity odd | 10/17 |
| 0xEC | CALL PE,nn | Call if parity even | 10/17 |
| 0xF4 | CALL P,nn | Call if positive | 10/17 |
| 0xFC | CALL M,nn | Call if minus | 10/17 |

## Return Instructions

### Unconditional Returns
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xC9 | RET | Return from subroutine | 10 |

### Conditional Returns
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xC0 | RET NZ | Return if not zero | 5/11 |
| 0xC8 | RET Z | Return if zero | 5/11 |
| 0xD0 | RET NC | Return if no carry | 5/11 |
| 0xD8 | RET C | Return if carry | 5/11 |
| 0xE0 | RET PO | Return if parity odd | 5/11 |
| 0xE8 | RET PE | Return if parity even | 5/11 |
| 0xF0 | RET P | Return if positive | 5/11 |
| 0xF8 | RET M | Return if minus | 5/11 |

## Stack Operations

### Push Operations
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xC5 | PUSH BC | Push BC onto stack | 11 |
| 0xD5 | PUSH DE | Push DE onto stack | 11 |
| 0xE5 | PUSH HL | Push HL onto stack | 11 |
| 0xF5 | PUSH AF | Push AF onto stack | 11 |

### Pop Operations
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xC1 | POP BC | Pop BC from stack | 10 |
| 0xD1 | POP DE | Pop DE from stack | 10 |
| 0xE1 | POP HL | Pop HL from stack | 10 |
| 0xF1 | POP AF | Pop AF from stack | 10 |

## Logical Operations

### AND Operations
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xA0 | AND B | AND B with A | 4 |
| 0xA1 | AND C | AND C with A | 4 |
| 0xA2 | AND D | AND D with A | 4 |
| 0xA3 | AND E | AND E with A | 4 |
| 0xA4 | AND H | AND H with A | 4 |
| 0xA5 | AND L | AND L with A | 4 |
| 0xA6 | AND (HL) | AND memory at HL with A | 7 |
| 0xA7 | AND A | AND A with A | 4 |
| 0xE6 | AND n | AND immediate value with A | 7 |

### OR Operations
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xB0 | OR B | OR B with A | 4 |
| 0xB1 | OR C | OR C with A | 4 |
| 0xB2 | OR D | OR D with A | 4 |
| 0xB3 | OR E | OR E with A | 4 |
| 0xB4 | OR H | OR H with A | 4 |
| 0xB5 | OR L | OR L with A | 4 |
| 0xB6 | OR (HL) | OR memory at HL with A | 7 |
| 0xB7 | OR A | OR A with A | 4 |
| 0xF6 | OR n | OR immediate value with A | 7 |

### XOR Operations
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xA8 | XOR B | XOR B with A | 4 |
| 0xAA | XOR D | XOR D with A | 4 |
| 0xAB | XOR E | XOR E with A | 4 |
| 0xAF | XOR A | XOR A with A (zero A) | 4 |
| 0xEE | XOR n | XOR immediate with A | 7 |

## Compare Operations

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xB8 | CP B | Compare B with A | 4 |
| 0xB9 | CP C | Compare C with A | 4 |
| 0xBA | CP D | Compare D with A | 4 |
| 0xBB | CP E | Compare E with A | 4 |
| 0xBC | CP H | Compare H with A | 4 |
| 0xBD | CP L | Compare L with A | 4 |
| 0xBE | CP (HL) | Compare memory at HL with A | 7 |
| 0xBF | CP A | Compare A with A | 4 |
| 0xFE | CP n | Compare immediate value with A | 7 |

## Rotate and Shift Operations

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x07 | RLCA | Rotate A left circular | 4 |
| 0x0F | RRCA | Rotate A right circular | 4 |
| 0x17 | RLA | Rotate A left through carry | 4 |
| 0x1F | RRA | Rotate A right through carry | 4 |
| 0x2F | CPL | Complement A | 4 |
| 0x3F | CCF | Complement carry flag | 4 |

## CB Prefix Instructions (Bit Manipulation)

### Rotate Circular Instructions (0xCB00-0xCB0F)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCB00 | RLC B | Rotate left circular B | 8 |
| 0xCB01 | RLC C | Rotate left circular C | 8 |
| 0xCB02 | RLC D | Rotate left circular D | 8 |
| 0xCB03 | RLC E | Rotate left circular E | 8 |
| 0xCB04 | RLC H | Rotate left circular H | 8 |
| 0xCB05 | RLC L | Rotate left circular L | 8 |
| 0xCB06 | RLC (HL) | Rotate left circular memory at HL | 15 |
| 0xCB07 | RLC A | Rotate left circular A | 8 |
| 0xCB08 | RRC B | Rotate right circular B | 8 |
| 0xCB09 | RRC C | Rotate right circular C | 8 |
| 0xCB0A | RRC D | Rotate right circular D | 8 |
| 0xCB0B | RRC E | Rotate right circular E | 8 |
| 0xCB0C | RRC H | Rotate right circular H | 8 |
| 0xCB0D | RRC L | Rotate right circular L | 8 |
| 0xCB0E | RRC (HL) | Rotate right circular memory at HL | 15 |
| 0xCB0F | RRC A | Rotate right circular A | 8 |

### Rotate Through Carry Instructions (0xCB10-0xCB1F)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCB10 | RL B | Rotate left through carry B | 8 |
| 0xCB11 | RL C | Rotate left through carry C | 8 |
| 0xCB12 | RL D | Rotate left through carry D | 8 |
| 0xCB13 | RL E | Rotate left through carry E | 8 |
| 0xCB14 | RL H | Rotate left through carry H | 8 |
| 0xCB15 | RL L | Rotate left through carry L | 8 |
| 0xCB16 | RL (HL) | Rotate left through carry memory at HL | 15 |
| 0xCB17 | RL A | Rotate left through carry A | 8 |
| 0xCB18 | RR B | Rotate right through carry B | 8 |
| 0xCB19 | RR C | Rotate right through carry C | 8 |
| 0xCB1A | RR D | Rotate right through carry D | 8 |
| 0xCB1B | RR E | Rotate right through carry E | 8 |
| 0xCB1C | RR H | Rotate right through carry H | 8 |
| 0xCB1D | RR L | Rotate right through carry L | 8 |
| 0xCB1E | RR (HL) | Rotate right through carry memory at HL | 15 |
| 0xCB1F | RR A | Rotate right through carry A | 8 |

### Shift Arithmetic Instructions (0xCB20-0xCB2F)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCB20 | SLA B | Shift left arithmetic B | 8 |
| 0xCB21 | SLA C | Shift left arithmetic C | 8 |
| 0xCB22 | SLA D | Shift left arithmetic D | 8 |
| 0xCB23 | SLA E | Shift left arithmetic E | 8 |
| 0xCB24 | SLA H | Shift left arithmetic H | 8 |
| 0xCB25 | SLA L | Shift left arithmetic L | 8 |
| 0xCB26 | SLA (HL) | Shift left arithmetic memory at HL | 15 |
| 0xCB27 | SLA A | Shift left arithmetic A | 8 |
| 0xCB28 | SRA B | Shift right arithmetic B | 8 |
| 0xCB29 | SRA C | Shift right arithmetic C | 8 |
| 0xCB2A | SRA D | Shift right arithmetic D | 8 |
| 0xCB2B | SRA E | Shift right arithmetic E | 8 |
| 0xCB2C | SRA H | Shift right arithmetic H | 8 |
| 0xCB2D | SRA L | Shift right arithmetic L | 8 |
| 0xCB2E | SRA (HL) | Shift right arithmetic memory at HL | 15 |
| 0xCB2F | SRA A | Shift right arithmetic A | 8 |

### Shift Logical Instructions (0xCB30-0xCB3F)
| Opcode | Instruction | Description | Cycles | Notes |
|--------|-------------|-------------|---------|-------|
| 0xCB30 | SLL B | Shift left logical B | 8 | Undocumented |
| 0xCB31 | SLL C | Shift left logical C | 8 | Undocumented |
| 0xCB32 | SLL D | Shift left logical D | 8 | Undocumented |
| 0xCB33 | SLL E | Shift left logical E | 8 | Undocumented |
| 0xCB34 | SLL H | Shift left logical H | 8 | Undocumented |
| 0xCB35 | SLL L | Shift left logical L | 8 | Undocumented |
| 0xCB36 | SLL (HL) | Shift left logical memory at HL | 15 | Undocumented |
| 0xCB37 | SLL A | Shift left logical A | 8 | Undocumented |
| 0xCB38 | SRL B | Shift right logical B | 8 |
| 0xCB39 | SRL C | Shift right logical C | 8 |
| 0xCB3A | SRL D | Shift right logical D | 8 |
| 0xCB3B | SRL E | Shift right logical E | 8 |
| 0xCB3C | SRL H | Shift right logical H | 8 |
| 0xCB3D | SRL L | Shift right logical L | 8 |
| 0xCB3E | SRL (HL) | Shift right logical memory at HL | 15 |
| 0xCB3F | SRL A | Shift right logical A | 8 |

### Bit Test Instructions (0xCB40-0xCB7F)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCB40 | BIT 0,B | Test bit 0 of B | 8 |
| 0xCB41 | BIT 0,C | Test bit 0 of C | 8 |
| 0xCB42 | BIT 0,D | Test bit 0 of D | 8 |
| 0xCB43 | BIT 0,E | Test bit 0 of E | 8 |
| 0xCB44 | BIT 0,H | Test bit 0 of H | 8 |
| 0xCB45 | BIT 0,L | Test bit 0 of L | 8 |
| 0xCB46 | BIT 0,(HL) | Test bit 0 of memory at HL | 12 |
| 0xCB47 | BIT 0,A | Test bit 0 of A | 8 |
| 0xCB48 | BIT 1,B | Test bit 1 of B | 8 |
| 0xCB49 | BIT 1,C | Test bit 1 of C | 8 |
| 0xCB4A | BIT 1,D | Test bit 1 of D | 8 |
| 0xCB4B | BIT 1,E | Test bit 1 of E | 8 |
| 0xCB4C | BIT 1,H | Test bit 1 of H | 8 |
| 0xCB4D | BIT 1,L | Test bit 1 of L | 8 |
| 0xCB4E | BIT 1,(HL) | Test bit 1 of memory at HL | 12 |
| 0xCB4F | BIT 1,A | Test bit 1 of A | 8 |
| 0xCB50 | BIT 2,B | Test bit 2 of B | 8 |
| 0xCB51 | BIT 2,C | Test bit 2 of C | 8 |
| 0xCB52 | BIT 2,D | Test bit 2 of D | 8 |
| 0xCB53 | BIT 2,E | Test bit 2 of E | 8 |
| 0xCB54 | BIT 2,H | Test bit 2 of H | 8 |
| 0xCB55 | BIT 2,L | Test bit 2 of L | 8 |
| 0xCB56 | BIT 2,(HL) | Test bit 2 of memory at HL | 12 |
| 0xCB57 | BIT 2,A | Test bit 2 of A | 8 |
| 0xCB58 | BIT 3,B | Test bit 3 of B | 8 |
| 0xCB59 | BIT 3,C | Test bit 3 of C | 8 |
| 0xCB5A | BIT 3,D | Test bit 3 of D | 8 |
| 0xCB5B | BIT 3,E | Test bit 3 of E | 8 |
| 0xCB5C | BIT 3,H | Test bit 3 of H | 8 |
| 0xCB5D | BIT 3,L | Test bit 3 of L | 8 |
| 0xCB5E | BIT 3,(HL) | Test bit 3 of memory at HL | 12 |
| 0xCB5F | BIT 3,A | Test bit 3 of A | 8 |
| 0xCB60 | BIT 4,B | Test bit 4 of B | 8 |
| 0xCB61 | BIT 4,C | Test bit 4 of C | 8 |
| 0xCB62 | BIT 4,D | Test bit 4 of D | 8 |
| 0xCB63 | BIT 4,E | Test bit 4 of E | 8 |
| 0xCB64 | BIT 4,H | Test bit 4 of H | 8 |
| 0xCB65 | BIT 4,L | Test bit 4 of L | 8 |
| 0xCB66 | BIT 4,(HL) | Test bit 4 of memory at HL | 12 |
| 0xCB67 | BIT 4,A | Test bit 4 of A | 8 |
| 0xCB68 | BIT 5,B | Test bit 5 of B | 8 |
| 0xCB69 | BIT 5,C | Test bit 5 of C | 8 |
| 0xCB6A | BIT 5,D | Test bit 5 of D | 8 |
| 0xCB6B | BIT 5,E | Test bit 5 of E | 8 |
| 0xCB6C | BIT 5,H | Test bit 5 of H | 8 |
| 0xCB6D | BIT 5,L | Test bit 5 of L | 8 |
| 0xCB6E | BIT 5,(HL) | Test bit 5 of memory at HL | 12 |
| 0xCB6F | BIT 5,A | Test bit 5 of A | 8 |
| 0xCB70 | BIT 6,B | Test bit 6 of B | 8 |
| 0xCB71 | BIT 6,C | Test bit 6 of C | 8 |
| 0xCB72 | BIT 6,D | Test bit 6 of D | 8 |
| 0xCB73 | BIT 6,E | Test bit 6 of E | 8 |
| 0xCB74 | BIT 6,H | Test bit 6 of H | 8 |
| 0xCB75 | BIT 6,L | Test bit 6 of L | 8 |
| 0xCB76 | BIT 6,(HL) | Test bit 6 of memory at HL | 12 |
| 0xCB77 | BIT 6,A | Test bit 6 of A | 8 |
| 0xCB78 | BIT 7,B | Test bit 7 of B | 8 |
| 0xCB79 | BIT 7,C | Test bit 7 of C | 8 |
| 0xCB7A | BIT 7,D | Test bit 7 of D | 8 |
| 0xCB7B | BIT 7,E | Test bit 7 of E | 8 |
| 0xCB7C | BIT 7,H | Test bit 7 of H | 8 |
| 0xCB7D | BIT 7,L | Test bit 7 of L | 8 |
| 0xCB7E | BIT 7,(HL) | Test bit 7 of memory at HL | 12 |
| 0xCB7F | BIT 7,A | Test bit 7 of A | 8 |

### Reset Bit Instructions (0xCB80-0xCBBF)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCB80 | RES 0,B | Reset bit 0 of B | 8 |
| 0xCB81 | RES 0,C | Reset bit 0 of C | 8 |
| 0xCB82 | RES 0,D | Reset bit 0 of D | 8 |
| 0xCB83 | RES 0,E | Reset bit 0 of E | 8 |
| 0xCB84 | RES 0,H | Reset bit 0 of H | 8 |
| 0xCB85 | RES 0,L | Reset bit 0 of L | 8 |
| 0xCB86 | RES 0,(HL) | Reset bit 0 of memory at HL | 15 |
| 0xCB87 | RES 0,A | Reset bit 0 of A | 8 |
| 0xCB88 | RES 1,B | Reset bit 1 of B | 8 |
| 0xCB89 | RES 1,C | Reset bit 1 of C | 8 |
| 0xCB8A | RES 1,D | Reset bit 1 of D | 8 |
| 0xCB8B | RES 1,E | Reset bit 1 of E | 8 |
| 0xCB8C | RES 1,H | Reset bit 1 of H | 8 |
| 0xCB8D | RES 1,L | Reset bit 1 of L | 8 |
| 0xCB8E | RES 1,(HL) | Reset bit 1 of memory at HL | 15 |
| 0xCB8F | RES 1,A | Reset bit 1 of A | 8 |
| 0xCB90 | RES 2,B | Reset bit 2 of B | 8 |
| 0xCB91 | RES 2,C | Reset bit 2 of C | 8 |
| 0xCB92 | RES 2,D | Reset bit 2 of D | 8 |
| 0xCB93 | RES 2,E | Reset bit 2 of E | 8 |
| 0xCB94 | RES 2,H | Reset bit 2 of H | 8 |
| 0xCB95 | RES 2,L | Reset bit 2 of L | 8 |
| 0xCB96 | RES 2,(HL) | Reset bit 2 of memory at HL | 15 |
| 0xCB97 | RES 2,A | Reset bit 2 of A | 8 |
| 0xCB98 | RES 3,B | Reset bit 3 of B | 8 |
| 0xCB99 | RES 3,C | Reset bit 3 of C | 8 |
| 0xCB9A | RES 3,D | Reset bit 3 of D | 8 |
| 0xCB9B | RES 3,E | Reset bit 3 of E | 8 |
| 0xCB9C | RES 3,H | Reset bit 3 of H | 8 |
| 0xCB9D | RES 3,L | Reset bit 3 of L | 8 |
| 0xCB9E | RES 3,(HL) | Reset bit 3 of memory at HL | 15 |
| 0xCB9F | RES 3,A | Reset bit 3 of A | 8 |
| 0xCBA0 | RES 4,B | Reset bit 4 of B | 8 |
| 0xCBA1 | RES 4,C | Reset bit 4 of C | 8 |
| 0xCBA2 | RES 4,D | Reset bit 4 of D | 8 |
| 0xCBA3 | RES 4,E | Reset bit 4 of E | 8 |
| 0xCBA4 | RES 4,H | Reset bit 4 of H | 8 |
| 0xCBA5 | RES 4,L | Reset bit 4 of L | 8 |
| 0xCBA6 | RES 4,(HL) | Reset bit 4 of memory at HL | 15 |
| 0xCBA7 | RES 4,A | Reset bit 4 of A | 8 |
| 0xCBA8 | RES 5,B | Reset bit 5 of B | 8 |
| 0xCBA9 | RES 5,C | Reset bit 5 of C | 8 |
| 0xCBAA | RES 5,D | Reset bit 5 of D | 8 |
| 0xCBAB | RES 5,E | Reset bit 5 of E | 8 |
| 0xCBAC | RES 5,H | Reset bit 5 of H | 8 |
| 0xCBAD | RES 5,L | Reset bit 5 of L | 8 |
| 0xCBAE | RES 5,(HL) | Reset bit 5 of memory at HL | 15 |
| 0xCBAF | RES 5,A | Reset bit 5 of A | 8 |
| 0xCBB0 | RES 6,B | Reset bit 6 of B | 8 |
| 0xCBB1 | RES 6,C | Reset bit 6 of C | 8 |
| 0xCBB2 | RES 6,D | Reset bit 6 of D | 8 |
| 0xCBB3 | RES 6,E | Reset bit 6 of E | 8 |
| 0xCBB4 | RES 6,H | Reset bit 6 of H | 8 |
| 0xCBB5 | RES 6,L | Reset bit 6 of L | 8 |
| 0xCBB6 | RES 6,(HL) | Reset bit 6 of memory at HL | 15 |
| 0xCBB7 | RES 6,A | Reset bit 6 of A | 8 |
| 0xCBB8 | RES 7,B | Reset bit 7 of B | 8 |
| 0xCBB9 | RES 7,C | Reset bit 7 of C | 8 |
| 0xCBBA | RES 7,D | Reset bit 7 of D | 8 |
| 0xCBBB | RES 7,E | Reset bit 7 of E | 8 |
| 0xCBBC | RES 7,H | Reset bit 7 of H | 8 |
| 0xCBBD | RES 7,L | Reset bit 7 of L | 8 |
| 0xCBBE | RES 7,(HL) | Reset bit 7 of memory at HL | 15 |
| 0xCBBF | RES 7,A | Reset bit 7 of A | 8 |

### Set Bit Instructions (0xCBC0-0xCBFF)
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCBC0 | SET 0,B | Set bit 0 of B | 8 |
| 0xCBC1 | SET 0,C | Set bit 0 of C | 8 |
| 0xCBC2 | SET 0,D | Set bit 0 of D | 8 |
| 0xCBC3 | SET 0,E | Set bit 0 of E | 8 |
| 0xCBC4 | SET 0,H | Set bit 0 of H | 8 |
| 0xCBC5 | SET 0,L | Set bit 0 of L | 8 |
| 0xCBC6 | SET 0,(HL) | Set bit 0 of memory at HL | 15 |
| 0xCBC7 | SET 0,A | Set bit 0 of A | 8 |
| 0xCBC8 | SET 1,B | Set bit 1 of B | 8 |
| 0xCBC9 | SET 1,C | Set bit 1 of C | 8 |
| 0xCBCA | SET 1,D | Set bit 1 of D | 8 |
| 0xCBCB | SET 1,E | Set bit 1 of E | 8 |
| 0xCBCC | SET 1,H | Set bit 1 of H | 8 |
| 0xCBCD | SET 1,L | Set bit 1 of L | 8 |
| 0xCBCE | SET 1,(HL) | Set bit 1 of memory at HL | 15 |
| 0xCBCF | SET 1,A | Set bit 1 of A | 8 |
| 0xCBD0 | SET 2,B | Set bit 2 of B | 8 |
| 0xCBD1 | SET 2,C | Set bit 2 of C | 8 |
| 0xCBD2 | SET 2,D | Set bit 2 of D | 8 |
| 0xCBD3 | SET 2,E | Set bit 2 of E | 8 |
| 0xCBD4 | SET 2,H | Set bit 2 of H | 8 |
| 0xCBD5 | SET 2,L | Set bit 2 of L | 8 |
| 0xCBD6 | SET 2,(HL) | Set bit 2 of memory at HL | 15 |
| 0xCBD7 | SET 2,A | Set bit 2 of A | 8 |
| 0xCBD8 | SET 3,B | Set bit 3 of B | 8 |
| 0xCBD9 | SET 3,C | Set bit 3 of C | 8 |
| 0xCBDA | SET 3,D | Set bit 3 of D | 8 |
| 0xCBDB | SET 3,E | Set bit 3 of E | 8 |
| 0xCBDC | SET 3,H | Set bit 3 of H | 8 |
| 0xCBDD | SET 3,L | Set bit 3 of L | 8 |
| 0xCBDE | SET 3,(HL) | Set bit 3 of memory at HL | 15 |
| 0xCBDF | SET 3,A | Set bit 3 of A | 8 |
| 0xCBE0 | SET 4,B | Set bit 4 of B | 8 |
| 0xCBE1 | SET 4,C | Set bit 4 of C | 8 |
| 0xCBE2 | SET 4,D | Set bit 4 of D | 8 |
| 0xCBE3 | SET 4,E | Set bit 4 of E | 8 |
| 0xCBE4 | SET 4,H | Set bit 4 of H | 8 |
| 0xCBE5 | SET 4,L | Set bit 4 of L | 8 |
| 0xCBE6 | SET 4,(HL) | Set bit 4 of memory at HL | 15 |
| 0xCBE7 | SET 4,A | Set bit 4 of A | 8 |
| 0xCBE8 | SET 5,B | Set bit 5 of B | 8 |
| 0xCBE9 | SET 5,C | Set bit 5 of C | 8 |
| 0xCBEA | SET 5,D | Set bit 5 of D | 8 |
| 0xCBEB | SET 5,E | Set bit 5 of E | 8 |
| 0xCBEC | SET 5,H | Set bit 5 of H | 8 |
| 0xCBED | SET 5,L | Set bit 5 of L | 8 |
| 0xCBEE | SET 5,(HL) | Set bit 5 of memory at HL | 15 |
| 0xCBEF | SET 5,A | Set bit 5 of A | 8 |
| 0xCBF0 | SET 6,B | Set bit 6 of B | 8 |
| 0xCBF1 | SET 6,C | Set bit 6 of C | 8 |
| 0xCBF2 | SET 6,D | Set bit 6 of D | 8 |
| 0xCBF3 | SET 6,E | Set bit 6 of E | 8 |
| 0xCBF4 | SET 6,H | Set bit 6 of H | 8 |
| 0xCBF5 | SET 6,L | Set bit 6 of L | 8 |
| 0xCBF6 | SET 6,(HL) | Set bit 6 of memory at HL | 15 |
| 0xCBF7 | SET 6,A | Set bit 6 of A | 8 |
| 0xCBF8 | SET 7,B | Set bit 7 of B | 8 |
| 0xCBF9 | SET 7,C | Set bit 7 of C | 8 |
| 0xCBFA | SET 7,D | Set bit 7 of D | 8 |
| 0xCBFB | SET 7,E | Set bit 7 of E | 8 |
| 0xCBFC | SET 7,H | Set bit 7 of H | 8 |
| 0xCBFD | SET 7,L | Set bit 7 of L | 8 |
| 0xCBFE | SET 7,(HL) | Set bit 7 of memory at HL | 15 |
| 0xCBFF | SET 7,A | Set bit 7 of A | 8 |

## ED Prefix Instructions (Extended Z80)

### I/O Operations
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xED40 | IN B,(C) | Input to B from port C | 12 |
| 0xED41 | OUT (C),B | Output B to port C | 12 |
| 0xED48 | IN C,(C) | Input to C from port C | 12 |
| 0xED49 | OUT (C),C | Output C to port C | 12 |
| 0xED50 | IN D,(C) | Input to D from port C | 12 |
| 0xED51 | OUT (C),D | Output D to port C | 12 |
| 0xED58 | IN E,(C) | Input to E from port C | 12 |
| 0xED59 | OUT (C),E | Output E to port C | 12 |
| 0xED60 | IN H,(C) | Input to H from port C | 12 |
| 0xED61 | OUT (C),H | Output H to port C | 12 |
| 0xED68 | IN L,(C) | Input to L from port C | 12 |
| 0xED69 | OUT (C),L | Output L to port C | 12 |
| 0xED78 | IN A,(C) | Input to A from port C | 12 |
| 0xED79 | OUT (C),A | Output A to port C | 12 |
| 0xED70 | IN (C) | Input to port C (dummy) | 12 |
| 0xED71 | OUT (C),0 | Output 0 to port C | 12 |

### 16-bit Arithmetic
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xED42 | SBC HL,BC | Subtract BC from HL with carry | 15 |
| 0xED4A | ADC HL,BC | Add BC to HL with carry | 15 |
| 0xED52 | SBC HL,DE | Subtract DE from HL with carry | 15 |
| 0xED5A | ADC HL,DE | Add DE to HL with carry | 15 |
| 0xED62 | SBC HL,HL | Subtract HL from HL with carry | 15 |
| 0xED6A | ADC HL,HL | Add HL to HL with carry | 15 |
| 0xED72 | SBC HL,SP | Subtract SP from HL with carry | 15 |
| 0xED7A | ADC HL,SP | Add SP to HL with carry | 15 |

### Memory Operations
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xED43 | LD (nn),BC | Store BC to absolute address | 20 |
| 0xED4B | LD BC,(nn) | Load BC from absolute address | 20 |
| 0xED53 | LD (nn),DE | Store DE to absolute address | 20 |
| 0xED5B | LD DE,(nn) | Load DE from absolute address | 20 |
| 0xED63 | LD (nn),HL | Store HL to absolute address | 20 |
| 0xED6B | LD HL,(nn) | Load HL from absolute address | 20 |
| 0xED73 | LD (nn),SP | Store SP to absolute address | 20 |
| 0xED7B | LD SP,(nn) | Load SP from absolute address | 20 |

### Block Transfer
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xEDA0 | LDI | Load, increment (single) | 16 |
| 0xEDB0 | LDIR | Load, increment, repeat | 21/16 |

### Block Compare
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xEDA1 | CPI | Compare, increment (single) | 16 |
| 0xEDB1 | CPIR | Compare, increment, repeat | 21/16 |

### Block I/O
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xEDA2 | INI | Input, increment (single) | 16 |
| 0xEDB2 | INIR | Input, increment, repeat | 21/16 |
| 0xEDA3 | OUTI | Output, increment (single) | 16 |
| 0xEDB3 | OTIR | Output, increment, repeat | 21/16 |

### Other ED Instructions
| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xED44 | NEG | Negate A | 8 |
| 0xED45 | RETN | Return from NMI | 14 |
| 0xED46 | IM 0 | Set interrupt mode 0 | 8 |
| 0xED47 | LD I,A | Load A into I register | 9 |
| 0xED4D | RETI | Return from interrupt | 14 |
| 0xED4F | LD R,A | Load A into R register | 9 |
| 0xED56 | IM 1 | Set interrupt mode 1 | 8 |
| 0xED57 | LD A,I | Load I register into A | 9 |
| 0xED5E | IM 2 | Set interrupt mode 2 | 8 |
| 0xED5F | LD A,R | Load R register into A | 9 |
| 0xED67 | RRD | Rotate right decimal | 18 |
| 0xED6F | RLD | Rotate left decimal | 18 |

## DD Prefix Instructions (IX Register)

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xDDE5 | PUSH IX | Push IX onto stack | 15 |
| 0xDDE1 | POP IX | Pop IX from stack | 14 |
| 0xDD21 | LD IX,nn | Load immediate value into IX | 14 |
| 0xDD36 | LD (IX+d),n | Store immediate value to IX+displacement | 19 |
| 0xDD39 | ADD IX,SP | Add SP to IX | 15 |
| 0xDD4E | LD C,(IX+d) | Load C from IX+displacement | 19 |
| 0xDD56 | LD D,(IX+d) | Load D from IX+displacement | 19 |
| 0xDD5E | LD E,(IX+d) | Load E from IX+displacement | 19 |
| 0xDD66 | LD H,(IX+d) | Load H from IX+displacement | 19 |
| 0xDD6E | LD L,(IX+d) | Load L from IX+displacement | 19 |
| 0xDD74 | LD (IX+d),H | Store H to IX+displacement | 19 |
| 0xDD75 | LD (IX+d),L | Store L to IX+displacement | 19 |
| 0xDD77 | LD (IX+d),A | Store A to IX+displacement | 19 |
| 0xDD7E | LD A,(IX+d) | Load A from IX+displacement | 19 |
| 0xDD34 | INC (IX+d) | Increment memory at IX+displacement | 23 |
| 0xDDF9 | LD SP,IX | Load SP with IX | 10 |
| 0xDDE9 | JP (IX) | Jump to address in IX | 8 |

## FD Prefix Instructions (IY Register)

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xFDE5 | PUSH IY | Push IY onto stack | 15 |
| 0xFDE1 | POP IY | Pop IY from stack | 14 |
| 0xFD21 | LD IY,nn | Load immediate value into IY | 14 |
| 0xFD23 | INC IY | Increment IY | 10 |
| 0xFD19 | ADD IY,DE | Add DE to IY | 15 |
| 0xFD36 | LD (IY+d),n | Store immediate value to IY+displacement | 19 |
| 0xFD56 | LD D,(IY+d) | Load D from IY+displacement | 19 |
| 0xFD5E | LD E,(IY+d) | Load E from IY+displacement | 19 |
| 0xFD66 | LD H,(IY+d) | Load H from IY+displacement | 19 |
| 0xFD6E | LD L,(IY+d) | Load L from IY+displacement | 19 |
| 0xFD74 | LD (IY+d),H | Store H to IY+displacement | 19 |
| 0xFD75 | LD (IY+d),L | Store L to IY+displacement | 19 |
| 0xFD77 | LD (IY+d),A | Store A to IY+displacement | 19 |
| 0xFD7E | LD A,(IY+d) | Load A from IY+displacement | 19 |
| 0xFDB6 | OR (IY+d) | OR memory at IY+displacement with A | 19 |
| 0xFDCB | FD CB prefix | Complex IY+CB instruction | 23 |
| 0xFDE3 | EX (SP),IY | Exchange IY with stack | 23 |
| 0xFDE9 | JP (IY) | Jump to address in IY | 8 |

## Control Instructions

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x00 | NOP | No operation | 4 |
| 0x76 | HALT | Halt processor | 4 |
| 0xF3 | DI | Disable interrupts | 4 |
| 0xFB | EI | Enable interrupts | 4 |

## I/O Instructions

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xDB | IN A,(n) | Input to A from port n | 11 |
| 0xD3 | OUT (n),A | Output A to port n | 11 |

## Exchange Instructions

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xEB | EX DE,HL | Exchange DE and HL | 4 |
| 0xD9 | EXX | Exchange register pairs | 4 |
| 0xF9 | LD SP,HL | Load SP with HL | 6 |

## Special Instructions

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0x10 | DJNZ | Decrement B and jump if not zero | 10/13 |

## Notes

- **Cycle counts** are based on the original Z80 specifications
- **Conditional instructions** show two cycle counts: first for condition not met, second for condition met
- **Prefix instructions** (CB, ED, DD, FD) modify the behavior of subsequent instructions
- **Indexed addressing** uses signed displacement values
- **Flag operations** are handled automatically by the arithmetic and logical operations
- **Memory operations** use the memio subsystem for actual memory access

## Missing Instructions

The following instruction was previously missing and causing CP/M boot failures:
- **0xCBFC** - SET 7,H (Set bit 7 of H register) - **IMPLEMENTED**

This document represents the current state of the Z80 instruction set implementation as of the latest update.
