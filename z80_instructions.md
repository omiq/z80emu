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

| Opcode | Instruction | Description | Cycles |
|--------|-------------|-------------|---------|
| 0xCB3F | SRL A | Shift right logical A | 8 |
| 0xCB46 | BIT 0,(HL) | Test bit 0 of memory at HL | 12 |
| 0xCB7E | BIT 7,(HL) | Test bit 7 of memory at HL | 12 |
| 0xCB86 | RES 0,(HL) | Reset bit 0 of memory at HL | 15 |
| 0xCBFE | SET 7,(HL) | Set bit 7 of memory at HL | 15 |
| 0xCBFC | SET 7,H | Set bit 7 of H register | 8 |

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
