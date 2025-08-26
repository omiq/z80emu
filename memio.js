// Copyright Stefan Tramm, 2010
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice,
//    this list of conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice,
//    this list of conditions and the following disclaimer in the documentation
//    and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// DEVELOPERS AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
// OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR
// OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
// ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//

// Import idb library for modern IndexedDB support
// This will be loaded from CDN in the HTML file

function pad(str, n) {
  var r = [];
  for(var i=0; i < (n - str.length); ++i)
    r.push("0");
  r.push(str);
  return r.join("");
}


function Memio(conso, consi, conss, prn)
{
  // reset and initialize RAM
  this.ram = new Array(65536);
  for (var i=0; i < this.ram.length; ++i)
    this.ram[i] = 0;
  // reset io components
  this.db = null; // IndexedDB connection for drives and sectors
  this.drv = 0; // A:
  this.trk = 0;
  this.sec = 1; // sector numbers start at 1
  this.dma = 0x0000;
  this.dskstat = 0; // diskstatus
  this.iocount = 0; // number of pending requests
  this.writeCompleteCB = null; // will be called after drive formatting
  this.drives = [{tracks:77, sectors:26, name:"dsk0.cpm"},
                 {tracks:77, sectors:26, name:"dsk1.cpm"},
                 {tracks:77, sectors:26, name:"dsk2.cpm"},
                 {tracks:77, sectors:26, name:"dsk3.cpm"}];

  this.cBuf= new Array(128); // for 4FDC
  this.cNxt= 0;
  this.cDrq= 0;
  this.cDone=0;

  this.dbInit(); // will retrieve drive geomatries, TBD error handling
  // store console in and out functions
  this.co = conso; //out
  this.ci = consi; //in
  this.cs = conss; //status
  this.pr = prn;   //printer out
  //
  this.initTape();
  this.initPuncher();
  this.dumpdata = "";
}

Memio.prototype.rd = function(a) {
  return this.ram[a];
}

Memio.prototype.wr = function(a, b) {
  this.ram[a & 0xffff] = b & 0xff;
  return b;
}

Memio.prototype.iostatus = function() {
  var s = '';
  s += " drv:" + this.drv;
  s += " trk:" + this.trk;
  s += " sec:" + this.sec;
  s += " dma:" + pad(this.dma.toString(16), 4);
  s += " stat:" + this.dskstat;
  s += " iocnt:" + this.iocount;
  s += '\r\n';
  s += ' ptr:' + this.tapename;
  s += ' len:' + this.tape.length;
  s += ' pos:' + this.tapepos;
  s += '\r\n';
  s += ' ptp:' + this.punchername;
  s += ' len:' + this.puncher.length;
  return s;
}

// dump one page starting at address a
Memio.prototype.dump = function(a) {
  var i, j, c, s;
  s = 'Addr   ';
  for (i = 0; i < 16; ++i) {
    s += i.toString(16);
    s += '  ';
  }
  s += 'ASCII\r\n';
  for (i = 0; i < 16; ++i) {
    s += pad(a.toString(16), 4); // addr
    s += ': ';
    for (j = 0; j < 16; ++j) {
      s += pad(this.rd(a+j).toString(16),2);
      s += ' ';
    }
    s += ' ';
    for (j = 0; j < 16; ++j) {
      c = this.rd(a+j);
      s += (c >= 0x20 && c <= 0x7f) ? String.fromCharCode(c) : '.';
    }
    s += '\r\n';
    a = (a + 16) & 0xffff;
  }
  return [s, a];
}

// Load the string from the array into memory
// starting at address.
Memio.prototype.load = function (address, data) {
  if (data.length == 0) return false;
  if (typeof data[0] == "string") {
    for (var i = 0; i < data.length; ++i)
      this.wr(address+i, parseInt(data[i],16));
      /*
      var c = data.charCodeAt(i);
      var out = 0;
      if (c > 0x7f) {
	out = (c & 0x003f) | ((c & 0x0300) >> 2);
	c = out;
      }
      this.wr(address+i, c);
      */
  } else {
    for (var i = 0; i < data.length; ++i)
      this.wr(address+i, data[i]);
  }
  return true;
};

Memio.prototype.loadIntelHex = function (buf) {
  var res = {
    ok: true,
    saddr: 0x0000,
    eaddr: 0x0000,
    len:   0x0000,
  };

  var count = 0;
  var addr  = 0;
  var saddr = this.ram.length;
  var eaddr = 0;
  var data;
  var s = 0;
  while (s < buf.length) {
    while (buf[s++] != ":") {
      if (s >= buf.length) {
	res.ok = false;
	return res;
      }
    }
    // checksum test
    var chk = 0;
    var s1 = s;
    while ((c = buf[s1]) >= '0') {
      chk += parseInt(buf.substr(s1, 2),16); s1+=2;
    }
    if ((chk & 0xff) != 0) {
      res.ok = false;
      return res;
    }
    count = parseInt(buf.substr(s, 2),16); s+=2;
    if (count == 0)
      break;
    addr = parseInt(buf.substr(s, 4),16); s+=4;
    if (addr < saddr)
      saddr = addr;
    eaddr = addr + count - 1;
    s += 2; // skip fill bytes
    for (var i = 0; i < count; i++) {
      data = parseInt(buf.substr(s, 2),16); s+=2;
      this.wr(addr + i, data);
    }
  }
  res.saddr = saddr;
  res.eaddr = eaddr;
  res.len   = eaddr - saddr + 1;
  return res;
}

Memio.prototype.initTape = function () {
  this.tapename = 'EOT';
  this.tapepos = 0;
  this.tape = '';
}

Memio.prototype.mountTape = function (name, content) {
  this.tapename = name;
  this.tapepos = 0;
  this.tape = content;
}

Memio.prototype.rewindTape = function () {
  this.tapepos = 0;
}

Memio.prototype.initPuncher = function (name) {
  this.punchername = name ? name : 'puncher.txt';
  this.puncher = '';
}

// ---------------------------------------------
// IO Subsystem
// ---------------------------------------------
Memio.prototype.input = function(port) {
  // port 0 is console status (0xff == input avail, else 00)
  // port 1 is console input
  switch (port) {
  case 0:
    return this.cs() ? 0xff : 0x00;
    break;
  case 1:
    return this.ci();
    break;
  case 4:
    return 0xff; // always input avail (at least CTRL-Z)
    break;
  case 5:  // auxin == paper tape
    if (this.tapepos >= this.tape.length) return 0x1a; // CTRL-Z
    return this.tape.charCodeAt(this.tapepos++) & 0xff;
    break;
  case 10: // 0x0a FDC drive
    return this.drv;
    break;
  case 11: // 0x0b FDC track
    return this.trk;
    break;
  case 12: // 0x0c FDC sector
    return this.sec;
    break;
  case 13: // 0x0d FDC command IO ready?
    return this.iocount == 0 ? 0xff : 0x00;
    break;
  case 14: // 0x0e FDC status
    return this.dskstatus;
    break;
  case 15: // 0x0f DMA low
    return this.dma & 0xff;
    break;
  case 16: // 0x10 DMA high
    return (this.dma & 0xff00) >> 8;
    break;
  }
  return 0x1a; // Ctrl-Z to simulate EOF
}

Memio.prototype.output = function(port, value) {
//this.co("output "+port+"="+value+":");
  switch (port) {
  case 1: // console out
    this.co(String.fromCharCode(value));
    break;
  case 3: // printer out
    this.pr(String.fromCharCode(value));
    break;
  case 4: // rewind tape (aux)
    if (value & 0x01) this.rewindTape();
    break;
  case 5: // aux out
    this.puncher += String.fromCharCode(value);
    break;
  case 10: // 0x0a FDC drive
    this.drv = value & 0xff;
    break;
  case 11: // 0x0b FDC track
    this.trk = value & 0xff;
    break;
  case 12: // 0x0c FDC sector
    this.sec = value & 0xff;
    break;
  case 13: // 0x0d FDC command
    if (this.drv >= this.drives.length) {
      this.dskstatus = 1; // illegal drive
      return null;
    }
    if (this.trk >= this.drives[this.drv].tracks) {
      this.dskstatus = 2; // illegal track
      return null;
    }
    if (this.sec == 0 || this.sec > this.drives[this.drv].sectors) {
      this.dskstatus = 3; // illegal sector
      return null;
    }
    if (value == 0) {        // read
      if (this.dma > this.ram.length - 128) {
	this.dskstatus = 5;  // read error
      } else {
	this.readSector(this.drv, this.trk, this.sec, this.dma, this.dma + 128);
	// dskstatus set by readSector
      }
    } else if (value == 1) { // write
      if (this.dma > this.ram.length - 128) {
	this.dskstatus = 6;  // write error
      } else {
	this.writeSector(this.drv, this.trk, this.sec, this.dma, this.dma + 128);
	// dskstatus set by writeSector
      }
    } else {
      this.dskstatus = 7;    // illegal command
    }
    break;
  case 15: // 0x0f DMA low
    this.dma = (this.dma & 0xff00) | (value & 0xff);
    break;
  case 16: // 0x10 DMA high
    this.dma = (this.dma & 0x00ff) | ((value & 0xff) << 8);
    break;
  }
  return null;
}


// ---------------------------------------------
// Disk Subsystem
// ---------------------------------------------
Memio.prototype.dbInit = function() {
  var memio = this;
  
  // Check if idb library is available
  if (typeof idb === 'undefined') {
    alert("IndexedDB library not loaded. Please ensure the idb library is included.");
    return [false, "IndexedDB library not available."];
  }

  try {
    // Open IndexedDB database
    var dbPromise = idb.openDB('emu8080', 1, {
      upgrade: function(db, oldVersion, newVersion) {
        // Create drives store
        if (!db.objectStoreNames.contains('drives')) {
          db.createObjectStore('drives', { keyPath: 'drive' });
        }
        
        // Create sectors store
        if (!db.objectStoreNames.contains('sectors')) {
          var sectorsStore = db.createObjectStore('sectors', { keyPath: 'id' });
          sectorsStore.createIndex('drive', 'drive', { unique: false });
        }
      },
      blocked: function() {
        console.log('Database opening blocked');
      },
      blocking: function() {
        console.log('Database is blocking previous version');
      },
      terminated: function() {
        console.log('Database connection terminated');
      }
    });

    // Store the database promise
    this.dbPromise = dbPromise;
    
    // Load existing drive configurations
    dbPromise.then(function(db) {
      memio.db = db;
      return db.getAll('drives');
    }).then(function(drives) {
      for (var i = 0; i < drives.length; i++) {
        var drive = drives[i];
        var drv = drive.drive;
        if (drv < memio.drives.length) {
          memio.drives[drv].tracks = drive.maxtrack;
          memio.drives[drv].sectors = drive.maxsector;
          memio.drives[drv].name = drive.url;
        }
      }
    }).catch(function(error) {
      console.error('Database initialization error:', error);
      alert("Database initialization error: " + error.message);
    });

  } catch(e) {
    console.error('Database initialization failed:', e);
    alert("Database initialization failed: " + e.message);
    return [false, "Database initialization failed."];
  }
  
  return [true, "OK"];
}

// format a drive
Memio.prototype.formatDrive = function(drv) {
  if (drv < 0 || drv >= this.drives.length) return false;
  var dname = "dsk" + drv + ".cpm";
  var maxtrack = this.drives[drv].tracks;
  var maxsector = this.drives[drv].sectors;
  var emptysector = new Array(128);
  this.drives[drv].name = dname;
  // fake empty CP/M dir entries
  for (var i = 0; i < 128; i++) emptysector[i] = 0;
  emptysector[ 0] = 0xe5;
  emptysector[32] = 0xe5;
  emptysector[64] = 0xe5;
  emptysector[96] = 0xe5;
  
  var memio = this;
  
  // create drive
  this.dbPromise.then(function(db) {
    return db.put('drives', {
      drive: drv,
      url: dname,
      maxtrack: maxtrack,
      maxsector: maxsector
    });
  }).then(function() {
    // write all sectors
    var promises = [];
    for (var t = 0; t < maxtrack; ++t) {
      for (var s = 1; s <= maxsector; ++s) {
        promises.push(memio._writeSector(drv, t, s, emptysector, 0)); // non dirty
      }
    }
    return Promise.all(promises);
  }).catch(function(error) {
    console.error('Drive formatting error:', error);
    alert("Drive formatting error: " + error.message);
  });
}

// load a drive with content from binary
Memio.prototype.loadDriveBin = function(drv, url, bin) {
  if (drv < 0 || drv >= this.drives.length) return false;
  var maxtrack = this.drives[drv].tracks;
  var maxsector = this.drives[drv].sectors;
  this.drives[drv].name = url;
  
  var memio = this;
  
  // create drive
  this.dbPromise.then(function(db) {
    return db.put('drives', {
      drive: drv,
      url: url,
      maxtrack: maxtrack,
      maxsector: maxsector
    });
  }).then(function() {
    // write all sectors
    var promises = [];
    var ix = 0;
    for (var t = 0; t < maxtrack; ++t) {
      for (var s = 1; s <= maxsector; ++s) {
        var data = [];
        for (var i = 0; i < 128; ++i) {
          data[i] = bin.charCodeAt(ix++) & 0xff;
        }
        promises.push(memio._writeSector(drv, t, s, data, 0));
      }
    }
    return Promise.all(promises);
  }).catch(function(error) {
    console.error('Drive loading error:', error);
    alert("Drive loading error: " + error.message);
  });
}

Memio.prototype.callCB = function(res) {
  var cb = this.writeCompleteCB; 
  if (cb) {
    this.writeCompleteCB = null;
    cb(res);
  }
}

Memio.prototype._writeSector = function(drv, trk, sec, data, dirty) {
  var memio = this;
  this.iocount += 1;
  
  return this.dbPromise.then(function(db) {
    return db.put('sectors', {
      id: drv*65536+trk*256+sec-1,
      drive: drv,
      track: trk,
      sector: sec,
      dirty: dirty,
      data: data
    });
  }).then(function() {
    memio.iocount -= 1;
    memio.dskstat = 0;
    if (memio.iocount == 0) memio.callCB(true);
  }).catch(function(error) {
    memio.iocount -= 1;
    memio.dskstat = 8;
    if (memio.iocount == 0) memio.callCB(false);
    console.error("disk write error", error);
    alert("disk write error " + error.message);
  });
}

Memio.prototype.writeSector = function(drv, trk, sec, dma, end) {
  var data = this.ram.slice(dma, end);
  this._writeSector(drv, trk, sec, data, 1); // dirty write
}

Memio.prototype.readSector = function(drv, trk, sec, dma) {
  var memio = this;
  this.iocount += 1;
  
  this.dbPromise.then(function(db) {
    return db.get('sectors', drv*65536+trk*256+sec-1);
  }).then(function(sector) {
    if (!sector) {
      memio.dskstat = 8;
      memio.iocount -= 1;
      alert("sector not found d" + drv + " t" + trk + " s" + sec);
      return;
    }
    
    var data = sector.data;
    for (var i = 0; i < data.length; ++i) {
      memio.ram[dma+i] = data[i];
    }
    memio.iocount -= 1;
    memio.dskstat = 0;
  }).catch(function(error) {
    memio.iocount -= 1;
    memio.dskstat = 8;
    console.error("disk error", error);
    alert("disk error " + error.message);
  });
}

Memio.prototype.dumpDisk = function(drv, postAction) {
  if (drv < 0 || drv >= this.drives.length) return false;
  var maxtrack = this.drives[drv].tracks;
  var maxsector = this.drives[drv].sectors;
  var memio = this;
  this.dumpdata = "";
  this.iocount += 1;
  
  this.dbPromise.then(function(db) {
    var tx = db.transaction('sectors', 'readonly');
    var store = tx.objectStore('sectors');
    var index = store.index('drive');
    return index.getAll(drv);
  }).then(function(sectors) {
    if (sectors.length != maxtrack * maxsector) {
      memio.dskstat = 8;
      memio.iocount -= 1;
      alert("disc error, wrong number of sectors " + sectors.length);
      return;
    }
    
    // Sort sectors by track and sector
    sectors.sort(function(a, b) {
      if (a.track !== b.track) return a.track - b.track;
      return a.sector - b.sector;
    });
    
    for (var i = 0; i < sectors.length; i++) {
      var sector = sectors[i];
      var data = sector.data;
      for (var j = 0; j < data.length; ++j) {
        memio.dumpdata += String.fromCharCode(data[j]);
      }
    }
    
    memio.iocount -= 1;
    memio.dskstat = 0;
    if (postAction) {
      postAction(memio.dumpdata); // normally opens the save window
    }
  }).catch(function(error) {
    memio.iocount -= 1;
    memio.dskstat = 8;
    console.error("disk error", error);
    alert("disk error " + error.message);
  });
}

// for development purposes
Memio.prototype.dbWipe = function() {
  if (this.dbPromise) {
    this.dbPromise.then(function(db) {
      return idb.deleteDB('emu8080');
    }).then(function() {
      console.log('Database wiped successfully');
    }).catch(function(error) {
      console.error('Database wipe error:', error);
    });
  }
}


// vim: set shiftwidth=2 :
