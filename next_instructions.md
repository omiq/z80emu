You must stop patching one opcode at a time. The goal is to produce a complete coverage checklist.

Rules
1) Do not propose edits yet. Only list analysis results.
2) Work in numbered steps and stop after Step 3.
3) Do not recalculate CBxx keys. Use the same combined-key convention already in the code: (prefix<<8)|opcode. For example, CB FC = 0xCBFC.
4) Do not repeat “0xCBF4”. That value is wrong and must never appear in the output.

Task
Step 1. Scan z80-adapter-browser.js. Collect every implemented instruction key (0x00..0xFF, and prefixed groups 0xCBxx, 0xEDxx, 0xDDxx, 0xFDxx, and 0xDDCB/0xFDCB if present).

Step 2. Compare this against the full Z80 instruction set required by CP/M 2.2:
- All 8-bit loads, arithmetic, logic, rotates/shifts, bit/test/set/res ops.
- All 16-bit register pairs (BC, DE, HL, SP, IX, IY) and stack operations.
- All jump/call/return conditions.
- All ED-prefix block I/O and block memory ops (LDI, LDIR, CPI, CPIR, OUTI, OTIR, etc.).
- All index register operations (IX/IY with displacement).
- All bit operations on (IX+d)/(IY+d).
- Interrupt enable/disable and NOP/HALT.

Step 3. Output a Markdown table with these columns:
- Opcode (hex)
- Mnemonic
- Implemented? (Yes/No)
- Notes (e.g. “needed for CP/M boot” or “stub present but incomplete”)

End the output with:
- A count of total missing opcodes
- A short list of high-priority ones required by CP/M boot/BIOS (based on known CP/M sources)

Guardrails
- Do not output diffs or code. Only output the coverage table and summary.
- Do not attempt to auto-patch.
- If an instruction is present as a stub but not fully correct (e.g. FD CB handler), mark as “Partial”.

Opcode,Prefix,Mnemonic,Bytes,Cycles,Notes
00,,NOP,1,4,
01,,LD BC,nn,3,10,
02,,LD (BC),A,1,7,
03,,INC BC,1,6,
04,,INC B,1,4,
05,,DEC B,1,4,
06,,LD B,n,2,7,
07,,RLCA,1,4,
08,,EX AF,AF',1,4,
09,,ADD HL,BC,1,11,
0A,,LD A,(BC),1,7,
0B,,DEC BC,1,6,
0C,,INC C,1,4,
0D,,DEC C,1,4,
0E,,LD C,n,2,7,
0F,,RRCA,1,4,
10,,DJNZ,e,2,8/13,
11,,LD DE,nn,3,10,
...
CB,xx,RLC r,2,8,Rotate left circular (registers)
CB,xx,RR r,2,8,Rotate right (registers)
CB,xx,SRL r,2,8,Shift right logical
CB,xx,BIT b,r,2,8,Test bit
CB,xx,RES b,r,2,8,Reset bit
CB,xx,SET b,r,2,8,Set bit
ED,xx,LDI,2,16,Block transfer
ED,xx,LDIR,2,21,Block transfer repeat
ED,xx,CPI,2,16,Block compare
ED,xx,CPIR,2,21,Block compare repeat
ED,xx,OUTI,2,16,Block out
ED,xx,OTIR,2,21,Block out repeat
ED,xx,INI,2,16,Block in
ED,xx,INIR,2,21,Block in repeat
DD,xx,LD IX,nn,3,14,Index load
DDCB,xx,BIT b,(IX+d),4,20,Bit test with displacement
FDCB,xx,BIT b,(IY+d),4,20,Bit test with displacement
...
