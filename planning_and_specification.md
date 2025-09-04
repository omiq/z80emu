# CP/M Emulator Development and Enhancement Plan

In the directory /Users/chrisg/github/cpm-emulator there is a working javascript based project that *can* execute hi-tech C compiler and Rogue-VT.com locally on desktop using the mac/linux commandline (ie. has no interactive terminal, it is intended for testing software compiled for CP/M). This might be useful as reference to figure out why certain programs do not execute in our project, for example c compilers and games such as Rogue-VT

## Current Status ✅

**CONFIRMED WORKING STATE**: The emulator is now confirmed working at commit `64383a8` where CP/M 2.2 boots correctly:
- ✅ Boot CP/M 2.2 successfully and reach `A>` prompt
- ✅ Switch between drives (A:, B:, C:, etc.)
- ✅ Load and run basic CP/M programs
- ✅ Execute *some* .COM files from disk images
- ✅ Microsoft BASIC works correctly on drive B:
- ✅ **CONFIRMED**: Successfully loaded and ran Star Trek (.BAS) in Microsoft BASIC

**Test Results**:
- ✅ CP/M boots to `A>` prompt
- ✅ Drive switching works (`B:` command)
- ✅ Microsoft BASIC loads from drive B:
- ✅ Star Trek game loads and runs in BASIC
- ✅ Terminal interface working correctly on port 8080

## Known Issues (From Working State)

### 1. C Compiler Integration Problems ❌
- **HiTech C Compiler**: Disk loads but `C.COM` fails to run
- **HELLO.COM**: Program fails to execute properly
- **Root Cause**: Likely Z80 emulator instruction implementation issues
- **Status**: Need to debug Z80 emulator for specific instructions used by C compilers

### 2. Disk Capacity Issues ❌
- **HiTech C Disk**: Under 720KB capacity (should be larger)
- **Data Storage**: Disk images don't store correct amount of data
- **Root Cause**: Large disk support implementation incomplete
- **Status**: Need to fix disk capacity and data storage

### 3. Program Execution Issues ❌
- **Compiled Programs**: C.COM and HELLO.COM fail to run
- **Z80 Instructions**: Specific Z80 instructions may not be implemented correctly
- **Status**: Need to identify and fix missing Z80 instruction implementations

## Development Strategy

### Main Branch (Stable)
- **Goal**: Keep the main branch with the working CP/M 2.2 boot state
- **Policy**: Only merge changes that have been thoroughly tested and don't break existing functionality
- **Current State**: Working CP/M 2.2 emulator with basic disk operations

### Development Branch (Future Work)
- **Goal**: Fix C compiler integration and disk capacity issues
- **Branch Name**: `feature/c-compiler-fixes`
- **Features to implement**:
  - Fix Z80 instruction implementations for C compilers
  - Fix disk capacity and data storage issues
  - Test C compiler workflow end-to-end
  - Cross-compilation with z88dk

## Future Goals

### Phase 1: Fix C Compiler Issues (Development Branch)
- [ ] **Z80 Emulator Debugging**
  - [ ] Identify which Z80 instructions C.COM uses
  - [ ] Fix missing or incorrect Z80 instruction implementations
  - [ ] Test HELLO.COM execution step-by-step
  - [ ] Verify C compiler can compile and run programs

- [ ] **Disk Capacity Fixes**
  - [ ] Fix large disk support (720KB+ capacity)
  - [ ] Ensure disk images store correct amount of data
  - [ ] Test HiTech C disk with full capacity
  - [ ] Verify all files fit on disk properly

### Phase 2: C Compiler Integration (Development Branch)
- [ ] **In-CPM C Compilers**
  - [ ] HiTech C compiler integration (fix C.COM)
  - [ ] BDS C compiler integration  
  - [ ] Manx Aztec C compiler integration
  - [ ] Test compilation workflow within CP/M

- [ ] **Cross-Compilation Support**
  - [ ] z88dk integration for cross-compilation
  - [ ] File transfer between host and emulator
  - [ ] .COM file execution from cross-compiled sources
  - [ ] Development workflow documentation

### Phase 3: Enhanced Development Environment
- [ ] **File Management**
  - [ ] Drag-and-drop file upload to emulator
  - [ ] Download compiled .COM files
  - [ ] Multiple disk image support
  - [ ] Virtual disk creation and management

- [ ] **Development Tools**
  - [ ] Integrated editor for source files
  - [ ] Build automation within CP/M
  - [ ] Debugging tools integration
  - [ ] Project management features

## Technical Specifications

### Current Working Configuration (Commit 64383a8)
- **CPU**: Z80 emulation (basic instructions working)
- **OS**: CP/M 2.2 (boots correctly)
- **Memory**: 64KB RAM
- **Storage**: Virtual disk images (.dsk files) - capacity issues
- **I/O**: VT100 terminal emulation

### Target Configuration (Development Branch)
- **Z80 Emulator**: Complete instruction set for C compilers
- **Disk Support**: Full capacity (720KB+) with proper data storage
- **C Compilers**: Multiple CP/M-native C compilers working
- **Cross-Compilation**: z88dk integration
- **File Transfer**: Web-based file upload/download

## Implementation Notes

### Branch Management
1. **Main Branch**: Keep working CP/M 2.2 state (commit 64383a8)
2. **Development Branch**: Fix C compiler and disk issues
3. **Testing**: Thoroughly test all changes before merging to main
4. **Documentation**: Keep planning document updated with progress

### Development Workflow
1. Create feature branch from main (commit 64383a8)
2. Implement and test fixes incrementally
3. Document changes in planning document
4. Merge to main only when fully tested and working
5. Preserve working state at all times

## Lessons Learned

### What Works (Commit 64383a8) - CONFIRMED
- ✅ CP/M 2.2 boot process is stable
- ✅ Basic disk image loading works
- ✅ Basic CP/M command execution is reliable
- ✅ Microsoft BASIC integration works on drive B:
- ✅ Terminal interface works correctly on port 8080
- ✅ **CONFIRMED**: Star Trek game loads and runs successfully
- ✅ Drive switching and disk access works properly

### What's Broken (Needs Fixing)
- ❌ C.COM fails to run (Z80 instruction issue)
- ❌ HELLO.COM fails to execute (Z80 instruction issue)
- ❌ Disk capacity limited (large disk support incomplete)
- ❌ Data storage incomplete (files don't fit properly)

### What Broke the System
- ❌ Recent CP/M BDOS changes broke boot process
- ❌ State machine modifications caused freezing
- ❌ Complex JavaScript integration without proper testing
- ❌ Browser caching issues with updates

### Best Practices
- Always test changes thoroughly before committing
- Keep working code on main branch
- Use feature branches for experimental work
- Update planning document regularly
- Preserve working state with git reset --hard to known good commit

## Next Steps

1. **Immediate**: Verify working state is restored (commit 64383a8)
2. **Short-term**: Create development branch for C compiler fixes
3. **Medium-term**: Fix Z80 instruction implementations
4. **Long-term**: Fix disk capacity and C compiler integration

## Debugging Strategy

### Z80 Instruction Issues
1. **Trace C.COM execution**: Identify which instructions fail
2. **Compare with working programs**: See what instructions work
3. **Implement missing instructions**: Add support for C compiler requirements
4. **Test incrementally**: Fix one instruction at a time

### Disk Capacity Issues
1. **Analyze disk format**: Understand current disk structure
2. **Fix large disk support**: Implement proper capacity handling
3. **Test data storage**: Verify files fit and load correctly
4. **Validate HiTech C disk**: Ensure full compiler fits

---

**Last Updated**: January 28, 2025
**Status**: ✅ CONFIRMED WORKING - CP/M 2.2 emulator working (commit 64383a8), Microsoft BASIC and Star Trek confirmed running
**Working Commit**: 64383a8fac3250c1316d4078f64c8e20c5781ae9
**Tested**: ✅ Star Trek game loads and runs successfully on drive B:
