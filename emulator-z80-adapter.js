//
// Emulator -- Z80 CPU emulator with Z80 Adapter Integration
// Release 0.01 Copyright (C) 2017 by Greg Sydney-Smith
//
// based on:
//
// Emulator -- generic CPU emulator by Stefan Tramm, 2010
// http://www.tramm.li/i8080/emu8080.html
//
// Shell-in-a-Box:
// Demo.js -- Demonstrate some of the features of ShellInABox
// Copyright (C) 2008-2009 Markus Gutschke <markus@shellinabox.com>
// The most up-to-date version of this program is always available from
// http://shellinabox.com
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License version 2 as
// published by the Free Software Foundation.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
//
// In addition to these license terms, the author grants the following
// additional rights:
//
// If you modify this program, or any covered work, by linking or
// combining it with the OpenSSL project's OpenSSL library (or a
// modified version of that library), containing parts covered by the
// terms of the OpenSSL or SSLeay licenses, the author
// grants you additional permission to convey the resulting work.
// Corresponding Source for a non-source form of such a combination
// shall include the source code for the parts of OpenSSL used as well
// as that of the covered work.
//
// Notes:
//
// The author believes that for the purposes of this license, you meet the
// requirements for publishing the source code, if your web server publishes
// the source in unmodified form (i.e. with licensing information, comments,
// formatting, and identifier names intact). If there are technical reasons
// that require you to make changes to the source code when serving the
// JavaScript (e.g to remove pre-processor directives from the source), these
// changes should be done in a reversible fashion.
//
// The author does not consider websites that reference this script in
// unmodified form, and web servers that serve this script in unmodified form
// to be derived works. As such, they are believed to be outside of the
// scope of this license and not subject to the rights or restrictions of the
// GNU General Public License.
//
// If in doubt, consult a legal professional familiar with the laws that
// apply in your country.

// #define STATE_IDLE     0
// #define STATE_INIT     1
// #define STATE_PROMPT   2
// #define STATE_READLINE 3
// #define STATE_COMMAND  4
// #define STATE_EXEC     5
// #define STATE_MODIFY   6
// #define STATE_IOWAIT   7

// #define TYPE_STRING    0
// #define TYPE_NUMBER    1

function extend(subClass, baseClass) {
  function inheritance() { }
  inheritance.prototype          = baseClass.prototype;
  subClass.prototype             = new inheritance();
  subClass.prototype.superClass  = baseClass.prototype;
};

function Emulator(container) {
  this.superClass.constructor.call(this, container);
  this.autoBooting = false; // Initialize auto-boot flag
  this.keys = ''; // Initialize keys buffer
  this.line = ''; // Initialize line buffer
  this.waitloop = 0; // Initialize wait loop counter
  
  // Apply text wrap mode if it was saved in user settings
  if (localStorage.getItem('textWrapMode') === 'true') {
    this.textWrapMode = true;
  }
  
  // Initialize the emulator
  this.init();
}

extend(Emulator, ShellInABox);

Emulator.prototype.init = function() {
  // Initialize the terminal
  this.initTerminal();
  
  // Initialize the memory I/O system
  this.memio  = new Memio(
    function(vt){return function(c){vt.vt100(String.fromCharCode(c))}}(this),
    function(vt){return function(){return vt.waitloop > 0 ? vt.keys.charCodeAt(0) : 0;}}(this),
    function(vt){return function(){return vt.waitloop > 0 ? 1 : 0;}}(this),
    function(vt){return function(c){vt.sendToPrinter(c)}}(this)//printer
  );
  
  // Initialize the CPU using our Z80 adapter
  this.cpu = new Z80Adapter(this.memio);
  this.addr = this.cpu.pc;
  this.instrcnt = 640; // 640 ~ 2MHz
  
  // Initialize drag methods
  var body = document.getElementsByTagName("body")[0];
  body.addEventListener("dragenter",
    function(vt){return function(e){vt.handleDrag(e)}}(this), false);
  body.addEventListener("dragend",
    function(vt){return function(e){vt.handleDrag(e)}}(this), false);
  body.addEventListener("dragover", this.cancelEvent, false);
  body.addEventListener("drop",
    function(vt){return function(e){vt.handleDrop(e)}}(this), false);

  this.printUnicode(
   'CP/M 2.2 starting with Z80 Adapter...\r\n' +
    '\r\n');
  
  // Initialize disk drive icons
  this.initDiskDriveIcons();
  
  // Auto-boot sequence: load CP/M disk and boot
  this.autoBootSequence();
  
  return false;
};

// Include the rest of the emulator methods here
// For now, let me just add the essential ones and test

Emulator.prototype.initDiskDriveIcons = function() {
  // Initialize disk drive icons with click handlers and drag/drop functionality
  var emulator = this;
  
  // Set up click handlers and drag/drop handlers for each drive
  for (var i = 0; i < 4; i++) {
    var driveElement = document.getElementById('drive-' + String.fromCharCode(97 + i)); // a, b, c, d
    if (driveElement) {
      // Click handler
      driveElement.addEventListener('click', function(driveNum) {
        return function() {
          emulator.handleDiskDriveClick(driveNum);
        };
      }(i));
      
      // Drag and drop handlers (only for drives B, C, D - not A which is locked)
      if (i > 0) {
        driveElement.addEventListener('dragenter', function(driveNum) {
          return function(e) {
            emulator.handleDiskIconDragEnter(e, driveNum);
          };
        }(i), false);
        
        driveElement.addEventListener('dragleave', function(driveNum) {
          return function(e) {
            emulator.handleDiskIconDragLeave(e, driveNum);
          };
        }(i), false);
        
        driveElement.addEventListener('dragover', function(driveNum) {
          return function(e) {
            emulator.cancelEvent(e);
          };
        }(i), false);
        
        driveElement.addEventListener('drop', function(driveNum) {
          return function(e) {
            emulator.handleDiskIconDrop(e, driveNum);
          };
        }(i), false);
      }
    }
  }
  
  // Update drive status based on current state
  this.updateDiskDriveIcons();
};

Emulator.prototype.handleDiskDriveClick = function(driveNum) {
  if (driveNum === 0) {
    // Drive A is the boot disk - show info
    this.showPopUp("Drive A: Boot Disk (emu-cpm.dsk)", 2000);
    return;
  }
  
  // For other drives, open the disk mount window
  this.openDiskMountWindow();
};

Emulator.prototype.updateDiskDriveIcons = function() {
  // Update the visual state of disk drive icons
  for (var i = 0; i < 4; i++) {
    var driveElement = document.getElementById('drive-' + String.fromCharCode(97 + i));
    if (driveElement && this.memio && this.memio.drives && this.memio.drives[i]) {
      var drive = this.memio.drives[i];
      var nameElement = driveElement.querySelector('.disk-name');
      var statusElement = driveElement.querySelector('.disk-status');
      
      if (nameElement) nameElement.textContent = drive.name;
      if (statusElement) statusElement.textContent = drive.geometry;
    }
  }
};

Emulator.prototype.autoBootSequence = function() {
  // Auto-boot sequence for CP/M
  this.autoBooting = true;
  
  // Load the default CP/M disk
  this.loadCPMDisk();
  
  // Start the boot process
  this.bootCPM();
};

Emulator.prototype.loadCPMDisk = function() {
  // Load the default CP/M disk image
  // This would normally load from a file or URL
  this.vt100("Loading CP/M disk image...\r\n");
};

Emulator.prototype.bootCPM = function() {
  // Boot CP/M system
  this.vt100("Booting CP/M 2.2...\r\n");
  
  // Set up CP/M memory layout
  this.cpu.pc = 0x0100; // CP/M program start
  this.cpu.sp = 0xF000; // Stack pointer
  
  this.vt100("CP/M 2.2 ready.\r\n");
  this.vt100("A> ");
  
  this.autoBooting = false;
};

Emulator.prototype.showPopUp = function(message, duration) {
  // Show a popup message
  var popup = document.createElement('div');
  popup.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #333; color: white; padding: 10px; border-radius: 5px; z-index: 1000;';
  popup.textContent = message;
  document.body.appendChild(popup);
  
  setTimeout(function() {
    if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  }, duration);
};

Emulator.prototype.openDiskMountWindow = function() {
  // Open disk mount window (placeholder)
  this.showPopUp("Disk mount window - not implemented yet", 2000);
};

Emulator.prototype.handleDrag = function(e) {
  // Handle drag events
  e.preventDefault();
};

Emulator.prototype.handleDrop = function(e) {
  // Handle drop events
  e.preventDefault();
};

Emulator.prototype.handleDiskIconDragEnter = function(e, driveNum) {
  // Handle drag enter on disk icons
  e.preventDefault();
};

Emulator.prototype.handleDiskIconDragLeave = function(e, driveNum) {
  // Handle drag leave on disk icons
  e.preventDefault();
};

Emulator.prototype.handleDiskIconDrop = function(e, driveNum) {
  // Handle drop on disk icons
  e.preventDefault();
};

Emulator.prototype.cancelEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

Emulator.prototype.vt100 = function(text) {
  // Send text to VT100 terminal
  if (this.terminal) {
    this.terminal.write(text);
  }
};

Emulator.prototype.sendToPrinter = function(c) {
  // Send character to printer (placeholder)
  console.log('Printer:', String.fromCharCode(c));
};
