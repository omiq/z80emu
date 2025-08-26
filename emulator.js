//
// Emulator -- Z80 CPU emulator
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
// You may at your option choose to remove this additional permission from
// the work, or from any part of it.
//
// It is possible to build this program in a way that it loads OpenSSL
// libraries at run-time. If doing so, the following notices are required
// by the OpenSSL and SSLeay licenses:
//
// This product includes software developed by the OpenSSL Project
// for use in the OpenSSL Toolkit. (http://www.openssl.org/)
//
// This product includes cryptographic software written by Eric Young
// (eay@cryptsoft.com)
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
  subClass.prototype.constructor = subClass;
  subClass.prototype.superClass  = baseClass.prototype;
};

function Emulator(container) {
  this.superClass.constructor.call(this, container);
  this.autoBooting = false; // Initialize auto-boot flag
  this.keys = ''; // Initialize keys buffer
  this.line = ''; // Initialize line buffer
  this.waitloop = 0; // Initialize wait loop counter
  this.gotoState(1 /* STATE_INIT */);
};
extend(Emulator, VT100);

Emulator.prototype.keysPressed = function(ch) {
  if (this.state == 5 /* STATE_EXEC */) {
    for (var i = 0; i < ch.length; i++) {
      var c  = ch.charAt(i);
      //this.vt100(">"+ch.charCodeAt(i)+"<");
      if (c =='\u000e') {
        this.keys = '';
        this.error('Interrupted');
	this.vt100('^.\r\n');
        return;
      }
      this.keys += c;
    }
  }
  this.keys += ch;
  this.gotoState(this.state);
};

Emulator.prototype.gotoState = function(state, tmo) {
  this.state       = state;
  if (!this.timer || tmo) {
    if (!tmo) {
      tmo          = 1;
    }
    this.nextTimer = setTimeout(function(emulator) {
                                  return function() {
                                    emulator.emulator();
                                  };
                                }(this), tmo);
  }
};

Emulator.prototype.emulator = function() {
  var done                  = false;
  this.nextTimer            = undefined;
  while (!done) {
    var state               = this.state;
    this.state              = 2 /* STATE_PROMPT */;
    switch (state) {
    case 1 /* STATE_INIT */:
      done                  = this.doInit();
      break;
    case 2 /* STATE_PROMPT */:
      done                  = this.doPrompt();
      break;
    case 3 /* STATE_READLINE */:
      done                  = this.doReadLine();
      break;
    case 4 /* STATE_COMMAND */:
      done                  = this.doCommand();
      break;
    case 5 /* STATE_EXEC */:
      done                  = this.doExec();
      break;
    case 6 /* STATE_MODIFY  */:
      done                  = this.doModify();
      break;
    case 7 /* STATE_IOWAIT  */:
      done                  = this.doWaitIO();
      break;
    default:
      done                  = true;
      break;
    }
  }
  this.timer                = this.nextTimer;
  this.nextTimer            = undefined;
};

Emulator.prototype.ok = function() {
  this.vt100('OK\r\n');
  this.gotoState(2 /* STATE_PROMPT */);
};

Emulator.prototype.error = function(msg) {
  if (msg == undefined) {
    msg = 'Error';
  }
  this.gotoState(2 /* STATE_PROMPT */);
  return undefined;
};

Emulator.prototype.doInit = function() {
  // init RAM and IO
  this.memio  = new Memio(
    function(vt){return function(c){vt.vt100(c)}}(this),      //out
    function(vt){return function(){var c = vt.keys.charAt(0); //in
				   vt.keys = '';
                                   return c.charCodeAt(0) & 0x7f}
                }(this),
    function(vt){return function(){var s = vt.keys.length>0;  //status
                                   vt.waitloop = s ? 0 : vt.waitloop+1;
                                   return s;
		}}(this),
    function(vt){return function(c){vt.sendToPrinter(c)}}(this)//printer
    );
  // init the CPU here
  this.cpu = new Cpu(this.memio, null);
  this.addr = this.cpu.pc;
  this.instrcnt = 640; // 640 ~ 2MHz
  // function interrupt(n) {
  //   if (n == 0x10) // or 0x08
  //     ...
  // }
  // 
  // init the drag methods
  var body =  document.getElementsByTagName("body")[0];
  body.addEventListener("dragenter",
	function(vt){return function(e){vt.handleDrag(e)}}(this), false);
  body.addEventListener("dragend",
	function(vt){return function(e){vt.handleDrag(e)}}(this), false);
  // for Chrome and Safari "dragover" must be cancelled so that "drop" works
  // http://help.dottoro.com/ljbflwps.php
  body.addEventListener("dragover", this.cancelEvent, false);
  body.addEventListener("drop",
	function(vt){return function(e){vt.handleDrop(e)}}(this), false);

  this.printUnicode(
    '\u001Bc\u001B[34;4m' +
    '\r\n' +
    'Zilog Z80 CPU Emulator\u001B[0m\r\n' +
    'Release 0.01 Copyright (C) 2017 by Greg Sydney-Smith\r\n'+
    '\r\n' +
    'Based on:\r\n' +
    '- emu8080 by Stefan Tramm (http://www.tramm.li/i8080/emu8080.html)\r\n' +
    '- ShellInABox and its marvelous VT100 emulator by Markus Gutschke\r\n' +
    '  (http://code.google.com/p/shellinabox/)\r\n' +
    '- js8080 by Chris Double (http://www.bluishcoder.co.nz/js8080/)\r\n' +
    '- z80pack by Udo Munk (http://www.unix4fun.org/z80pack/)\r\n' +
    '\r\n' +
    'Auto-booting CP/M 2.2...\r\n' +
    '\r\n');
  
  // Auto-boot sequence: load CP/M disk and boot
  this.autoBootSequence();
  
  return false;
};

Emulator.prototype.autoBootSequence = function() {
  // Auto-boot sequence: equivalent to "r 0 emu-cpm22a.dsk", "b", "g"
  this.vt100("Loading CP/M 2.2 disk image...\r\n");
  
  // Step 1: Load disk image into drive 0
  var file = "../disks/emu-cpm22a.dsk";
  this.vt100("Loading " + file + " into drive 0...\r\n");
  this.autoBooting = true; // Flag to indicate auto-boot sequence
  this.io_op = 3; // netload of disc image
  this.loaddrv = 0;
  this.loaddrvurl = file;
  this.netload(file);
  this.gotoState(7 /* STATE_IOWAIT */);
};

Emulator.prototype.doPrompt = function() {
  this.keys = '';
  this.line = '';
  this.vt100((this.cursorX != 0 ? '\r\n' : '') + '>>> ');
  this.gotoState(3 /* STATE_READLINE */);
  return false;
};

Emulator.prototype.printUnicode = function(s) {
  var out = '';
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    if (c < '\x0080') {
      out += c;
    } else {
      var c = s.charCodeAt(i);
      if (c < 0x800) {
        out += String.fromCharCode(0xC0 +  (c >>  6)        ) +
               String.fromCharCode(0x80 + ( c        & 0x3F));
      } else if (c < 0x10000) {
        out += String.fromCharCode(0xE0 +  (c >> 12)        ) +
               String.fromCharCode(0x80 + ((c >>  6) & 0x3F)) +
               String.fromCharCode(0x80 + ( c        & 0x3F));
      } else if (c < 0x110000) {
        out += String.fromCharCode(0xF0 +  (c >> 18)        ) +
               String.fromCharCode(0x80 + ((c >> 12) & 0x3F)) +
               String.fromCharCode(0x80 + ((c >>  6) & 0x3F)) +
               String.fromCharCode(0x80 + ( c        & 0x3F));
      }
    }
  }
  this.vt100(out);
};

Emulator.prototype.doReadLine = function() {
  this.gotoState(3 /* STATE_READLINE */);
  var keys  = this.keys;
  this.keys = '';
  for (var i = 0; i < keys.length; i++) {
    var ch  = keys.charAt(i);
    if (ch == '\u0008' || ch == '\u007F') {
      if (this.line.length > 0) {
        this.line = this.line.substr(0, this.line.length - 1);
        if (this.cursorX == 0) {
          var x = this.terminalWidth - 1;
          var y = this.cursorY - 1;
          this.gotoXY(x, y);
          this.vt100(' ');
          this.gotoXY(x, y);
        } else {
          this.vt100('\u0008 \u0008');
        }
      } else {
        this.vt100('\u0007');
      }
    } else if (ch >= ' ') {
      this.line += ch;
      this.printUnicode(ch);
    } else if (ch == '\r' || ch == '\n') {
      this.vt100('\r\n');
      this.gotoState(4 /* STATE_COMMAND */);
      return false;
    } else if (ch == '\u001B') {
      // This was probably a function key. Just eat all of the following keys.
      break;
    }
  }
  return true;
};

Emulator.prototype.doCommand = function() {
  this.gotoState(2 /* STATE_PROMPT */);

  var parms = this.line.split(/[ \t]+/);
  var cmd = parms[0];
  switch (cmd) {
  case undefined: // newline; single step
  case '':
    if (this.cpu.step() == false) { this.vt100("HALT\r\n"); }
    this.addr = this.cpu.pc;
  case 'x': // examine register dump
    if (parms.length > 1) this.vt100(this.cpu.setRegisters(parms));
    this.vt100(this.cpu.cpuStatus());
    break;
  case 'g':
    if (parms.length > 1) this.cpu.pc = parseInt(parms[1],16);
    this.gotoState(5 /* STATE_EXEC */);
    break;
  case 'd': // memory dump
    if (parms.length > 1) this.addr = parseInt(parms[1],16);
    var sa = this.memio.dump(this.addr);
    this.vt100(sa[0]);
    this.addr = sa[1];
    break
  case 'l': // list/disassemble // TODO: Z80ize
    if (parms.length > 1) this.addr = parseInt(parms[1],16);
    var sa = this.cpu.disassemble(this.addr);
    this.vt100(sa[0]);
    this.addr = sa[1];
    break;
  case 'm': // modify memory
    if (parms.length > 1) this.addr = parseInt(parms[1],16);
    this.line = "";
    this.vt100(pad(this.addr.toString(16),4) + ": " +
	       pad(this.memio.rd(this.addr).toString(16),2) +
	       " - ");
    this.gotoState(6 /* STATE_MODIFY */);
    break;
  case 'z':
    if (parms.length > 1) this.cpu.cycles = parseInt(parms[1]) || 0;
    this.vt100('cycle ' + this.cpu.cycles + '\r\n');
    break; 
  case 'instr':
    if (parms.length > 1) this.instrcnt = parseInt(parms[1]) || 640;
    this.vt100('instructions per timeslice ' + this.instrcnt + '\r\n');
    break; 
  case 'rew': // rewind tape
    this.memio.rewindTape();
    // fall through to 'io'
  case 'io':
  case 'p':
    var iostat = this.memio.iostatus();
    this.vt100(iostat + "\r\n");
    break;
  case 'b': // boot
    var drv = 0;
    var addr = 0;
    if (parms.length > 1) drv  = parseInt(parms[1]);
    if (parms.length > 2) addr = parseInt(parms[2],16);
    this.vt100("load bootloader from drive " + drv);
    this.memio.readSector(drv, 0, 1, addr);
    this.cpu.pc = addr;
    this.io_op = 4; // wait for disk io completion
    this.gotoState(7 /* STATE_IOWAIT */);
    break;
  case 'r': // read program into memory
    // add 3 7; echo A forever
    //this.memio.load(0, [0xdb, 0x00, 0x3e, 0x03, 0x47, 0x3e, 0x07, 0x80, 0x3e, 
    //0x41, 0xd3, 0x01, 0xc3, 09, 00]);
    //this.memio.load(0, [0xdb, 0x00, 0xb7, 0xca, 0x00, 0x00, 0xdb, 0x01, 0xd3, 
    //0x01, 0xc3, 0x00, 0x00]);
    switch (parms.length) {
    case 1: // file listing
      this.netload('../disks/list.html');
      this.io_op = 2; // dir listing
      this.gotoState(7 /* STATE_IOWAIT */);
      break;
    case 2: // load intel hex into main memory
      var file = parms[1];
      if (file.match(/^pt[rp]:$/)) {
        this.vt100("reading from device " + file + " into main memory..\r\n");
	var hex = (file == "ptr:" ? this.memio.tape : this.memio.puncher);
	if (hex.length >= 11) {
          var r = this.memio.loadIntelHex(hex);
          this.vt100('start:' + pad(r.saddr.toString(16),4) + '\r\n');
          this.vt100('end  :' + pad(r.eaddr.toString(16),4) + '\r\n');
          this.vt100('len  :' + r.len);
          this.cpu.pc = r.saddr;
	} else {
	  this.vt100("empty?\r\n");
	}
      } else {
        if (! file.match(/.hex$/))
          file += ".hex";
        file= "../disks/"+file;
        this.vt100("reading " + file + " into main memory..");
        this.io_op = 1; // netload of hex files
        this.netload(file);
        this.gotoState(7 /* STATE_IOWAIT */);
      }
      break;
    case 3: // load disk image into drive n
      var drv  = parms[1];
      if (! (drv >= 0 && drv <= 3)) {
	this.vt100("drive must be in range 0..3\r\n");
	break;
      }
      var file = parms[2];
      if (! file.match(/.dsk$/)) file += ".dsk";
      file= "../disks/"+file;
      this.vt100("loading image "  + file + "..");
      this.io_op = 3; // netload of disc image
      this.loaddrv = drv;
      this.loaddrvurl = file;
      this.netload(file);
      this.gotoState(7 /* STATE_IOWAIT */);
      break;
    default:
      this.vt100("??? type h for help\r\n");
    }
    break;
  case 'F': // format drive
    var drv  = parms[1];
    if (! (drv >= 0 && drv <= 3)) {
      this.vt100("drive must be in range 0..3");
    } else {
      this.memio.formatDrive(drv); // A: is 0
      this.vt100("please wait 30sec for completion of drive formatting");
    }
    break;
  case 'ptp':
    if (parms.length == 2) {
      this.memio.initPuncher(parms[1]);
      this.vt100("puncher cleared\r\n");
    } else {
      this.openPostWindow('ptp', this.memio.punchername, this.memio.puncher);
    }
    break;
  case 'dsk':
    var drv  = parms[1];
    if (! (drv >= 0 && drv <= 3)) {
      this.vt100("dont use disks until mounted, please.\r\n");
      this.openDiskMountWindow();
    } else {
      this.memio.dumpDisk(drv,
        function (emulator) {
	  return function(data) {
	    emulator.openPostWindow('dsk', emulator.memio.drives[drv].name, data);
	  };
	}(this)
      );
      this.vt100("drive " + drv + " dumped\r\n");
    }
    break;
  case 'prn': // send the string to the printer
    var s = parms[1] || "Hello printer";
    this.sendToPrinter(s);
    this.sendToPrinter("\r\n");
    break;
  case 'W': // wipe the DB tables
    this.memio.dbWipe();
    this.vt100("DB wiped! now reload this page, please\r\n");
    break;
  case '?':
  case 'H':
  case 'h':
  default:  // help
    this.vt100(
      'r              show listing of available files\r\n' +
      'r filename     read Intel HEX file into memory\r\n' +
      'r d filename   load disk image file into drive 0..3\r\n' +
      'r ptr:         read Intel HEX from ptr: device into memory\r\n' +
      'r ptp:         read Intel HEX from ptp: device into memory\r\n' +
      'd [address]    dump memory\r\n' +
      'l [address]    list memory\r\n' +
      'm [address]    modify memory\r\n' +
      'g [address]    run program\r\n' +
      '<CR>           single step program\r\n' +
      'x [register]   show/modify register (a b c d e h l af bc de hl sp pc)\r\n' +
      'x f<flag>      modify flag (s z i h p c)\r\n' +
      'b [d [addr]]   load bootsector from drive d to addr, default 0\r\n' +
      'io             show current disc io, tape, and puncher parameters\r\n' +
      'rew            rewind tape (mount tape by drag-n-drop)\r\n' +
      'ptp [name]     send puncher content to a server or create new puncher (name)\r\n' +
      'dsk [d]        show/mount disks or send disk 0..3 image to a server\r\n' +
      'z [n]          show/modify clock cycle count\r\n' +
      'instr [n]      show/modify instructions per JS timeslice\r\n' +
      'F d            format disk drive 0..3\r\n' +
      'W              wipe out diskdrives\r\n' +
      'Chrome users:  enable popups, "dsk", "ptp", and line printer open a new window\r\n' +
      '');
  }
  return false;
};

Emulator.prototype.doExec = function() {
  // 2MHz CPU: 10msec == 20'000 cycles
  //  400 ~ 1.25MHz
  //  640 ~ 2.00MHz
  // 1280 ~ 4.00MHz
  // 2560 ~ 8.00MHz
  var polllimit = this.instrcnt / 200;
  if (polllimit < 3) polllimit = 3;
  this.waitloop = 0;
  for (var i = 0; i < this.instrcnt; ++i) { // number of instructions not cycles!
    if (this.cpu.step() == false) {
      this.vt100("\r\nHALT\r\n");
      this.gotoState(2 /* STATE_PROMPT */);
      return false;
    }
    if (this.waitloop > polllimit) break; // premature timeslot yield
  }
  this.gotoState(5 /* STATE_EXEC */, 10);
  return true;
};

Emulator.prototype.doModify = function() {
  this.gotoState(6 /* STATE_MODIFY  */);
  var keys  = this.keys;
  this.keys = '';
  for (var i = 0; i < keys.length; i++) {
    var ch  = keys.charAt(i);
    if (ch == '\u0008' || ch == '\u007F' || ch == '-') {
      if (this.line.length > 0) {
        this.line = this.line.substr(0, this.line.length - 1);
        if (this.cursorX == 0) {
          var x = this.terminalWidth - 1;
          var y = this.cursorY - 1;
          this.gotoXY(x, y);
          this.vt100(' ');
          this.gotoXY(x, y);
        } else {
          this.vt100('\u0008 \u0008');
        }
      } else {
        this.addr = this.cpu.add(this.addr, -1);
	this.line = '';
        this.vt100('#\r\n' +
                   pad(this.addr.toString(16),4) + ': ' +
                   pad(this.memio.rd(this.addr).toString(16),2) +
                   ' - ');
      }
    } else if ((ch >= '0' && ch <= '9') || (ch >= 'a' && ch <= 'f')) {
      if (this.line.length > 1) {
	this.memio.wr(this.addr, parseInt(this.line,16));
        this.addr = this.cpu.add(this.addr, 1);
        this.vt100('\r\n' +
                   pad(this.addr.toString(16),4) + ': ' +
                   pad(this.memio.rd(this.addr).toString(16),2) +
                   ' - ');
	this.line = ch;
      } else {
        this.line += ch;
      }
      this.printUnicode(ch);
    } else if (ch == ' ' || ch == '\r' || ch == '\n') {
      if (this.line.length > 0) {
	this.memio.wr(this.addr, parseInt(this.line,16));
	this.line = '';
      }
      this.addr = this.cpu.add(this.addr, 1);
      this.vt100('\r\n' +
		 pad(this.addr.toString(16),4) + ': ' +
                 pad(this.memio.rd(this.addr).toString(16),2) +
                 ' - ');
    } else if (ch == '.' || ch == '\u0003') {
      if (this.line.length > 0) {
	this.memio.wr(this.addr, parseInt(this.line,16));
      }
      this.vt100('.\r\n');
      this.gotoState(2 /* STATE_PROMPT */);
      return false;
    } else if (ch == '\u001B') {
      // This was probably a function key. Just eat all of the following keys.
      break;
    }
  }
  return true;
};

Emulator.prototype.netload = function(fname) {
  var req = new XMLHttpRequest();
  req.onreadystatechange = function(emulator){
    return function() {
      try {
	switch (this.readyState) {
	case 3: // pouring in
	  emulator.vt100(".");
	  break;
	case 4:
	  //emulator.vt100("s4: rlen " + this.responseText.length + "\r\n");
	  if ((this.status == 200) || (this.status == 0) &&
	      this.responseText != null && this.responseText.length > 0) {
	    //emulator.vt100("OK\r\n");
	    emulator.netResponse = ['OK', this.responseText];
	  } else {
	    //emulator.vt100("ERROR\r\n");
	    emulator.netResponse = ['ERROR', this.status];
	  }
	  break;
	}
      } catch (e) {
	// ignore it
	emulator.netResponse = ['ERROR', 99];
	emulator.vt100("catched exception " + e + "\r\n");
      }
    }
  }(this);
  this.netResponse = [];
  req.open("GET", "../disks/"+fname);
  //XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com] 
  if (req.overrideMimeType) req.overrideMimeType('text/plain; charset=x-user-defined');
  req.send(null);
}

Emulator.prototype.doWaitIO = function() {
  switch (this.io_op) {
  case 1: // load intel hex file
    if (this.netResponse.length > 0) {
      this.vt100(this.netResponse[0] + "\r\n");
      if (this.netResponse[0] == 'OK') {
	var r = this.memio.loadIntelHex(this.netResponse[1]);
        this.vt100('start:' + pad(r.saddr.toString(16),4) + '\r\n');
        this.vt100('end  :' + pad(r.eaddr.toString(16),4) + '\r\n');
        this.vt100('len  :' + r.len);
	this.cpu.pc = r.saddr;
      }
      this.io_op = 0; // no pending op
      this.gotoState(2 /* STATE_PROMPT */);
      return false;
    }
    break;
  case 2: // list all hex and disk files
    if (this.netResponse.length > 0 && (this.netResponse[0] == 'OK')) {
      this.vt100("available files:\r\n");
      var files = this.netResponse[1].match(/href="[^"]*/g);
      for (var i = 0; i < files.length; i++) {
	var f = files[i].substr(6);
	if (f.match(/.*\.(hex|dsk)$/)) this.vt100(' ' + f + '\r\n');
      }
      this.io_op = 0; // no pending op
      this.gotoState(2 /* STATE_PROMPT */);
      return false;
    }
    break;
  case 3: // load disk image
    if (this.netResponse.length > 0) {
      this.vt100(this.netResponse[0] + "\r\n");
      if (this.netResponse[0] == 'OK') {
        var binimage = this.netResponse[1];
        this.vt100("writing to disk " + this.loaddrv);
        this.io_op = 4; // now wait for diskio
        this.memio.loadDriveBin(this.loaddrv, this.loaddrvurl, binimage);
      } else {
	// error, file not found
        this.io_op = 0; // no pending op
        this.gotoState(2 /* STATE_PROMPT */);
        return false;
      }
    }
    break;
  case 4: // wait for disk io completion
    this.vt100(".");
    if (this.memio.iocount == 0) {
      this.vt100("DONE\r\n");
      this.io_op = 0; // no pending op
      this.loaddrv = null;
      this.loaddrvurl = null;
      
      // Check if this was part of auto-boot sequence
      if (this.autoBooting) {
        this.autoBooting = false;
        this.vt100("Booting CP/M 2.2...\r\n");
        // Load bootloader from drive 0 to address 0
        this.memio.readSector(0, 0, 1, 0);
        this.cpu.pc = 0;
        this.io_op = 5; // wait for boot sector load
        this.gotoState(7 /* STATE_IOWAIT */);
        return false;
      }
      
      this.gotoState(2 /* STATE_PROMPT */);
      return false;
    }
    break;
  case 5: // wait for boot sector load completion
    this.vt100(".");
    if (this.memio.iocount == 0) {
      this.vt100("DONE\r\n");
      this.io_op = 0; // no pending op
      this.vt100("Starting CP/M 2.2...\r\n");
      this.gotoState(5 /* STATE_EXEC */); // Start execution
      return false;
    }
    break;
  default:
    this.vt100('oops, unknown IO -- ignored\r\n');
    this.io_op = 0; // no pending op
    this.gotoState(2 /* STATE_PROMPT */);
    return false;
  }
  this.gotoState(7 /* STATE_IOWAIT */, 100);
  return true;
}

Emulator.prototype.showPopUp = function(s, ms) {
  // reuse the vt100 cursize div for a message (its a hack)
  var msgBox = this.getChildById(this.container, 'cursize');
 
  msgBox.innerHTML = s;
  msgBox.style.left = (this.terminalWidth*this.cursorWidth -
                       this.curSizeBox.clientWidth)/2 + 'px';
  msgBox.style.top = (this.terminalHeight*this.cursorHeight -
                      this.curSizeBox.clientHeight)/2 + 'px';
  msgBox.style.visibility = '';
  if (this.curSizeTimeout) {
    clearTimeout(this.curSizeTimeout);
  }
  this.curSizeTimeout = setTimeout(function(vt100) {
    return function() {
      vt100.curSizeTimeout              = null;
      vt100.curSizeBox.style.visibility = 'hidden';
    };
  }(this), ms);
 
}

Emulator.prototype.cancelEvent = function(evt) {
  evt.stopPropagation(); // stop
  evt.preventDefault();  // cancel
}

Emulator.prototype.handleDrag = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  this.showPopUp("mount paper tape ...", 1000);
}

Emulator.prototype.handleDrop = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.dataTransfer.files;

  if (files.length != 1) {
    this.showPopUp("only one tape can be mounted -- IGNORED", 1000);
  } else {
    this.showPopUp("preparing...", 1000);
    var fname = files[0].name;
    /*if (!(typeof(window.File) == 'object'
	  && typeof(window.FileReader) == 'function'
	  && typeof(window.FileList) == 'object')) {*/
    if (!(typeof window["FileReader"] === "function")) {
      this.showPopUp("ERROR -- FileReader not supported by your browser", 2000);
      return false;
      // Safari does not support FileReader(), filed a bugreport
      // ID# 8428903
    }
    var reader = new FileReader();
    reader.onload = function(vt, fname) { return function(e) {
      vt.memio.mountTape(fname, e.target.result);
      vt.showPopUp("paper tape '" + fname + "' mounted.", 2000)
    }}(this, fname);
    reader.onerror = function(vt) { return function(e) {
      vt.showPopUp("tape error")
    }}(this);
    reader.readAsBinaryString(files[0]);
  }
}

Emulator.prototype.openPostWindow = function (typ, name, content) {
  var pre =
    '<?xml version="1.0" encoding="utf-8"?>\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xml:lang="en" lang="en">\
  <head>\
    <title>Zilog Z80 CPU Emulator</title>\
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">\
    <style type="text/css">\
      body, pre, input, textarea { font-family: "DejaVu Sans Mono", "Everson Mono", FreeMono, "Andale Mono", "Lucida Console", monospace;}\
    </style>\
  </head>\
  <body>';

  var form1 = '<form id="postform" action="" method="post"\
	onsubmit="this.action=this.url.value?this.url.value:window.close();">\
	<label for="url"> Enter the URL:\
	<input type="text" name="url" id="url" size="60"\
               value="http://localhost/cgi-bin/savefile">\
	</label><br>';


  var form2 = '<input type="hidden" name="eof" value="eof"><input type="submit" value="Post it"></form>';
  var post = '</body></html>'

  var w = window.open("", "PostWindow", "") 
  w.document.write(pre);

  w.document.write(form1);
  switch (typ) {
  case 'ptp':
    var formp = '<label for="name">puncher file name:\
	<input type="text" name="name" id="name" value="' + name + '">\
	</label><br>\
        <label for="content">puncher content:\
	<textarea name="text" id="text" rows="24" cols="80"></textarea>\
        <input type="hidden" name="content" id="content" value="">\
	</label><br>';
    w.document.write(formp);
    break;
  case 'dsk':
    var formd = '<label for="name">disk image name:\
	<input type="text" name="name" id="name" value="' + name + '">\
	</label><br>\
        <input type="hidden" name="text" id="text" value="">\
        <input type="hidden" name="content" id="content" value="">\
	<br>';
    w.document.write(formd);
    break;
  default:
    break;
  }
  w.document.write(form2);

  w.document.write(post);
  w.document.forms[0].elements["text"].value = content;
  w.document.forms[0].elements["content"].value = escape(content);
  w.document.close();
}

Emulator.prototype.openDiskMountWindow = function (typ, name, content) {
  var pre = '<?xml version="1.0" encoding="utf-8"?>\
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xml:lang="en" lang="en">\
  <head>\
    <title>Zilog Z80 CPU Emulator</title>\
    <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">\
    <style type="text/css">\
      body, pre, input, textarea { font-family: "DejaVu Sans Mono", "Everson Mono", FreeMono, "Andale Mono", "Lucida Console", monospace;}\
    </style>\
  </head>\
  <body>Drop disk images in the areas below.<br/><br/><hr/>';
  var post = '<form id="postform" action="" method="post"\
onsubmit="window.close();">\
<input type="submit" value="Close Window"></form></body></html>';

  var w = window.open("", "DiskMountWindow", "");
  w.document.write(pre);

  for (var d = 0; d < 4; d++) {
    var disk = "dsk" + d;
    var name = this.memio.drives[d].name;
    w.document.write('<div id="' + disk + '"><br/>');
    w.document.write(disk + ': <span id="' + disk + 'name">' + name + '</span>');
    w.document.write(' <span id="' + disk + 'msg"></span>');
    w.document.write('<br/><br/></div>');
    w.document.write('<hr/>');
  }

  for (var drv = 0; drv < 4; drv++) {
    var div = w.document.getElementById("dsk"+drv);
    var msg = w.document.getElementById("dsk"+drv+"msg");
    var dname = w.document.getElementById("dsk"+drv+"name");
    div.addEventListener("dragenter",
        function(vt){var m=msg;return function(e){vt.handleDskDragS(e, m)}}(this), false);
    div.addEventListener("dragleave",
        function(vt){var m=msg;return function(e){vt.handleDskDragE(e, m)}}(this), false);
    div.addEventListener("dragend",
        function(vt){var m=msg;return function(e){vt.handleDskDragE(e, m)}}(this), false);
    // for Chrome and Safari "dragover" must be cancelled so that "drop" works
    // http://help.dottoro.com/ljbflwps.php
    div.addEventListener("dragover", this.cancelEvent, false);
    div.addEventListener("drop",
			 function(vt){var m=msg; var n=dname; var d=drv;
          return function(e){vt.handleDskDrop(e, m, n, d)}
	}(this), false);
  }

  w.document.write(post);
  w.document.close();
}

Emulator.prototype.handleDskDragS = function(evt, div) {
  evt.stopPropagation();
  evt.preventDefault();
  div.innerHTML = "mount...";
}

Emulator.prototype.handleDskDragE = function(evt, div) {
  evt.stopPropagation();
  evt.preventDefault();
  div.innerHTML = "";
}

Emulator.prototype.handleDskDrop = function(evt, div, divname, drv) {
  evt.stopPropagation();
  evt.preventDefault();
  var files = evt.dataTransfer.files;
  if (files.length != 1) {
    div.innerHTML = "only mount one disk image file at a time";
    return false;
  }
  var fname = files[0].name;
  if (!(typeof window["FileReader"] === "function")) {
    div.innerHTML = "ERROR -- FileReader not supported by your browser";
    return false;
    // Safari does not support FileReader(), filed a bugreport
    // ID# 8428903
  }
  div.innerHTML = "loading " + fname;
  var reader = new FileReader();
  reader.onload = function(vt, f, m, n, d) { return function(e) {
      if (e.target.result.length
	  != vt.memio.drives[d].tracks * vt.memio.drives[d].sectors * 128) {
	m.innerHTML = f + " wrong file format error";
	return false;
      }
      m.innerHTML = "mounting " + fname + " on dsk" + d +", please wait...";
      vt.memio.writeCompleteCB = function(res) {
        if (res) {
	  n.innerHTML = f;
	  m.innerHTML = "mounted succesfully.";
	} else {
	  m.innerHTML = f + " mount error."
	}
      };
      //vt.memio.callCB(true);
      vt.memio.loadDriveBin(d, f, e.target.result);
    }}(this, fname, div, divname, drv);
  reader.onerror = function(vt, m, f) { return function(e) {
      m.innerHTML = f + " file not readable error";
      return false;
    }}(this, div, fname);
  reader.readAsBinaryString(files[0]);
}
// vim: set shiftwidth=2 :
