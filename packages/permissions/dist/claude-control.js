import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all6) => {
  for (var name in all6)
    __defProp(target, name, { get: all6[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/graceful-fs/polyfills.js
var require_polyfills = __commonJS({
  "../../node_modules/graceful-fs/polyfills.js"(exports, module) {
    var constants2 = __require("constants");
    var origCwd = process.cwd;
    var cwd = null;
    var platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
    process.cwd = function() {
      if (!cwd)
        cwd = origCwd.call(process);
      return cwd;
    };
    try {
      process.cwd();
    } catch (er) {
    }
    if (typeof process.chdir === "function") {
      chdir = process.chdir;
      process.chdir = function(d) {
        cwd = null;
        chdir.call(process, d);
      };
      if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, chdir);
    }
    var chdir;
    module.exports = patch3;
    function patch3(fs2) {
      if (constants2.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
        patchLchmod(fs2);
      }
      if (!fs2.lutimes) {
        patchLutimes(fs2);
      }
      fs2.chown = chownFix(fs2.chown);
      fs2.fchown = chownFix(fs2.fchown);
      fs2.lchown = chownFix(fs2.lchown);
      fs2.chmod = chmodFix(fs2.chmod);
      fs2.fchmod = chmodFix(fs2.fchmod);
      fs2.lchmod = chmodFix(fs2.lchmod);
      fs2.chownSync = chownFixSync(fs2.chownSync);
      fs2.fchownSync = chownFixSync(fs2.fchownSync);
      fs2.lchownSync = chownFixSync(fs2.lchownSync);
      fs2.chmodSync = chmodFixSync(fs2.chmodSync);
      fs2.fchmodSync = chmodFixSync(fs2.fchmodSync);
      fs2.lchmodSync = chmodFixSync(fs2.lchmodSync);
      fs2.stat = statFix(fs2.stat);
      fs2.fstat = statFix(fs2.fstat);
      fs2.lstat = statFix(fs2.lstat);
      fs2.statSync = statFixSync(fs2.statSync);
      fs2.fstatSync = statFixSync(fs2.fstatSync);
      fs2.lstatSync = statFixSync(fs2.lstatSync);
      if (fs2.chmod && !fs2.lchmod) {
        fs2.lchmod = function(path, mode, cb) {
          if (cb) process.nextTick(cb);
        };
        fs2.lchmodSync = function() {
        };
      }
      if (fs2.chown && !fs2.lchown) {
        fs2.lchown = function(path, uid, gid, cb) {
          if (cb) process.nextTick(cb);
        };
        fs2.lchownSync = function() {
        };
      }
      if (platform === "win32") {
        fs2.rename = typeof fs2.rename !== "function" ? fs2.rename : (function(fs$rename) {
          function rename3(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
              if (er && (er.code === "EACCES" || er.code === "EPERM" || er.code === "EBUSY") && Date.now() - start < 6e4) {
                setTimeout(function() {
                  fs2.stat(to, function(stater, st) {
                    if (stater && stater.code === "ENOENT")
                      fs$rename(from, to, CB);
                    else
                      cb(er);
                  });
                }, backoff);
                if (backoff < 100)
                  backoff += 10;
                return;
              }
              if (cb) cb(er);
            });
          }
          if (Object.setPrototypeOf) Object.setPrototypeOf(rename3, fs$rename);
          return rename3;
        })(fs2.rename);
      }
      fs2.read = typeof fs2.read !== "function" ? fs2.read : (function(fs$read) {
        function read2(fd, buffer3, offset, length, position, callback_) {
          var callback4;
          if (callback_ && typeof callback_ === "function") {
            var eagCounter = 0;
            callback4 = function(er, _, __) {
              if (er && er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                return fs$read.call(fs2, fd, buffer3, offset, length, position, callback4);
              }
              callback_.apply(this, arguments);
            };
          }
          return fs$read.call(fs2, fd, buffer3, offset, length, position, callback4);
        }
        if (Object.setPrototypeOf) Object.setPrototypeOf(read2, fs$read);
        return read2;
      })(fs2.read);
      fs2.readSync = typeof fs2.readSync !== "function" ? fs2.readSync : /* @__PURE__ */ (function(fs$readSync) {
        return function(fd, buffer3, offset, length, position) {
          var eagCounter = 0;
          while (true) {
            try {
              return fs$readSync.call(fs2, fd, buffer3, offset, length, position);
            } catch (er) {
              if (er.code === "EAGAIN" && eagCounter < 10) {
                eagCounter++;
                continue;
              }
              throw er;
            }
          }
        };
      })(fs2.readSync);
      function patchLchmod(fs3) {
        fs3.lchmod = function(path, mode, callback4) {
          fs3.open(
            path,
            constants2.O_WRONLY | constants2.O_SYMLINK,
            mode,
            function(err, fd) {
              if (err) {
                if (callback4) callback4(err);
                return;
              }
              fs3.fchmod(fd, mode, function(err2) {
                fs3.close(fd, function(err22) {
                  if (callback4) callback4(err2 || err22);
                });
              });
            }
          );
        };
        fs3.lchmodSync = function(path, mode) {
          var fd = fs3.openSync(path, constants2.O_WRONLY | constants2.O_SYMLINK, mode);
          var threw = true;
          var ret;
          try {
            ret = fs3.fchmodSync(fd, mode);
            threw = false;
          } finally {
            if (threw) {
              try {
                fs3.closeSync(fd);
              } catch (er) {
              }
            } else {
              fs3.closeSync(fd);
            }
          }
          return ret;
        };
      }
      function patchLutimes(fs3) {
        if (constants2.hasOwnProperty("O_SYMLINK") && fs3.futimes) {
          fs3.lutimes = function(path, at, mt, cb) {
            fs3.open(path, constants2.O_SYMLINK, function(er, fd) {
              if (er) {
                if (cb) cb(er);
                return;
              }
              fs3.futimes(fd, at, mt, function(er2) {
                fs3.close(fd, function(er22) {
                  if (cb) cb(er2 || er22);
                });
              });
            });
          };
          fs3.lutimesSync = function(path, at, mt) {
            var fd = fs3.openSync(path, constants2.O_SYMLINK);
            var ret;
            var threw = true;
            try {
              ret = fs3.futimesSync(fd, at, mt);
              threw = false;
            } finally {
              if (threw) {
                try {
                  fs3.closeSync(fd);
                } catch (er) {
                }
              } else {
                fs3.closeSync(fd);
              }
            }
            return ret;
          };
        } else if (fs3.futimes) {
          fs3.lutimes = function(_a, _b, _c, cb) {
            if (cb) process.nextTick(cb);
          };
          fs3.lutimesSync = function() {
          };
        }
      }
      function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
          return orig.call(fs2, target, mode, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
          try {
            return orig.call(fs2, target, mode);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
          return orig.call(fs2, target, uid, gid, function(er) {
            if (chownErOk(er)) er = null;
            if (cb) cb.apply(this, arguments);
          });
        };
      }
      function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
          try {
            return orig.call(fs2, target, uid, gid);
          } catch (er) {
            if (!chownErOk(er)) throw er;
          }
        };
      }
      function statFix(orig) {
        if (!orig) return orig;
        return function(target, options3, cb) {
          if (typeof options3 === "function") {
            cb = options3;
            options3 = null;
          }
          function callback4(er, stats) {
            if (stats) {
              if (stats.uid < 0) stats.uid += 4294967296;
              if (stats.gid < 0) stats.gid += 4294967296;
            }
            if (cb) cb.apply(this, arguments);
          }
          return options3 ? orig.call(fs2, target, options3, callback4) : orig.call(fs2, target, callback4);
        };
      }
      function statFixSync(orig) {
        if (!orig) return orig;
        return function(target, options3) {
          var stats = options3 ? orig.call(fs2, target, options3) : orig.call(fs2, target);
          if (stats) {
            if (stats.uid < 0) stats.uid += 4294967296;
            if (stats.gid < 0) stats.gid += 4294967296;
          }
          return stats;
        };
      }
      function chownErOk(er) {
        if (!er)
          return true;
        if (er.code === "ENOSYS")
          return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
          if (er.code === "EINVAL" || er.code === "EPERM")
            return true;
        }
        return false;
      }
    }
  }
});

// ../../node_modules/graceful-fs/legacy-streams.js
var require_legacy_streams = __commonJS({
  "../../node_modules/graceful-fs/legacy-streams.js"(exports, module) {
    var Stream3 = __require("stream").Stream;
    module.exports = legacy;
    function legacy(fs2) {
      return {
        ReadStream,
        WriteStream
      };
      function ReadStream(path, options3) {
        if (!(this instanceof ReadStream)) return new ReadStream(path, options3);
        Stream3.call(this);
        var self = this;
        this.path = path;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = "r";
        this.mode = 438;
        this.bufferSize = 64 * 1024;
        options3 = options3 || {};
        var keys3 = Object.keys(options3);
        for (var index2 = 0, length = keys3.length; index2 < length; index2++) {
          var key = keys3[index2];
          this[key] = options3[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.end === void 0) {
            this.end = Infinity;
          } else if ("number" !== typeof this.end) {
            throw TypeError("end must be a Number");
          }
          if (this.start > this.end) {
            throw new Error("start must be <= end");
          }
          this.pos = this.start;
        }
        if (this.fd !== null) {
          process.nextTick(function() {
            self._read();
          });
          return;
        }
        fs2.open(this.path, this.flags, this.mode, function(err, fd) {
          if (err) {
            self.emit("error", err);
            self.readable = false;
            return;
          }
          self.fd = fd;
          self.emit("open", fd);
          self._read();
        });
      }
      function WriteStream(path, options3) {
        if (!(this instanceof WriteStream)) return new WriteStream(path, options3);
        Stream3.call(this);
        this.path = path;
        this.fd = null;
        this.writable = true;
        this.flags = "w";
        this.encoding = "binary";
        this.mode = 438;
        this.bytesWritten = 0;
        options3 = options3 || {};
        var keys3 = Object.keys(options3);
        for (var index2 = 0, length = keys3.length; index2 < length; index2++) {
          var key = keys3[index2];
          this[key] = options3[key];
        }
        if (this.start !== void 0) {
          if ("number" !== typeof this.start) {
            throw TypeError("start must be a Number");
          }
          if (this.start < 0) {
            throw new Error("start must be >= zero");
          }
          this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
          this._open = fs2.open;
          this._queue.push([this._open, this.path, this.flags, this.mode, void 0]);
          this.flush();
        }
      }
    }
  }
});

// ../../node_modules/graceful-fs/clone.js
var require_clone = __commonJS({
  "../../node_modules/graceful-fs/clone.js"(exports, module) {
    "use strict";
    module.exports = clone;
    var getPrototypeOf = Object.getPrototypeOf || function(obj) {
      return obj.__proto__;
    };
    function clone(obj) {
      if (obj === null || typeof obj !== "object")
        return obj;
      if (obj instanceof Object)
        var copy4 = { __proto__: getPrototypeOf(obj) };
      else
        var copy4 = /* @__PURE__ */ Object.create(null);
      Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy4, key, Object.getOwnPropertyDescriptor(obj, key));
      });
      return copy4;
    }
  }
});

// ../../node_modules/graceful-fs/graceful-fs.js
var require_graceful_fs = __commonJS({
  "../../node_modules/graceful-fs/graceful-fs.js"(exports, module) {
    var fs2 = __require("fs");
    var polyfills = require_polyfills();
    var legacy = require_legacy_streams();
    var clone = require_clone();
    var util = __require("util");
    var gracefulQueue;
    var previousSymbol;
    if (typeof Symbol === "function" && typeof Symbol.for === "function") {
      gracefulQueue = Symbol.for("graceful-fs.queue");
      previousSymbol = Symbol.for("graceful-fs.previous");
    } else {
      gracefulQueue = "___graceful-fs.queue";
      previousSymbol = "___graceful-fs.previous";
    }
    function noop() {
    }
    function publishQueue(context3, queue2) {
      Object.defineProperty(context3, gracefulQueue, {
        get: function() {
          return queue2;
        }
      });
    }
    var debug = noop;
    if (util.debuglog)
      debug = util.debuglog("gfs4");
    else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || ""))
      debug = function() {
        var m = util.format.apply(util, arguments);
        m = "GFS4: " + m.split(/\n/).join("\nGFS4: ");
        console.error(m);
      };
    if (!fs2[gracefulQueue]) {
      queue = global[gracefulQueue] || [];
      publishQueue(fs2, queue);
      fs2.close = (function(fs$close) {
        function close3(fd, cb) {
          return fs$close.call(fs2, fd, function(err) {
            if (!err) {
              resetQueue();
            }
            if (typeof cb === "function")
              cb.apply(this, arguments);
          });
        }
        Object.defineProperty(close3, previousSymbol, {
          value: fs$close
        });
        return close3;
      })(fs2.close);
      fs2.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
          fs$closeSync.apply(fs2, arguments);
          resetQueue();
        }
        Object.defineProperty(closeSync, previousSymbol, {
          value: fs$closeSync
        });
        return closeSync;
      })(fs2.closeSync);
      if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || "")) {
        process.on("exit", function() {
          debug(fs2[gracefulQueue]);
          __require("assert").equal(fs2[gracefulQueue].length, 0);
        });
      }
    }
    var queue;
    if (!global[gracefulQueue]) {
      publishQueue(global, fs2[gracefulQueue]);
    }
    module.exports = patch3(clone(fs2));
    if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !fs2.__patched) {
      module.exports = patch3(fs2);
      fs2.__patched = true;
    }
    function patch3(fs3) {
      polyfills(fs3);
      fs3.gracefulify = patch3;
      fs3.createReadStream = createReadStream;
      fs3.createWriteStream = createWriteStream;
      var fs$readFile = fs3.readFile;
      fs3.readFile = readFile3;
      function readFile3(path, options3, cb) {
        if (typeof options3 === "function")
          cb = options3, options3 = null;
        return go$readFile(path, options3, cb);
        function go$readFile(path2, options4, cb2, startTime) {
          return fs$readFile(path2, options4, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$readFile, [path2, options4, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$writeFile = fs3.writeFile;
      fs3.writeFile = writeFile3;
      function writeFile3(path, data, options3, cb) {
        if (typeof options3 === "function")
          cb = options3, options3 = null;
        return go$writeFile(path, data, options3, cb);
        function go$writeFile(path2, data2, options4, cb2, startTime) {
          return fs$writeFile(path2, data2, options4, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$writeFile, [path2, data2, options4, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$appendFile = fs3.appendFile;
      if (fs$appendFile)
        fs3.appendFile = appendFile;
      function appendFile(path, data, options3, cb) {
        if (typeof options3 === "function")
          cb = options3, options3 = null;
        return go$appendFile(path, data, options3, cb);
        function go$appendFile(path2, data2, options4, cb2, startTime) {
          return fs$appendFile(path2, data2, options4, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$appendFile, [path2, data2, options4, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$copyFile = fs3.copyFile;
      if (fs$copyFile)
        fs3.copyFile = copyFile3;
      function copyFile3(src, dest, flags, cb) {
        if (typeof flags === "function") {
          cb = flags;
          flags = 0;
        }
        return go$copyFile(src, dest, flags, cb);
        function go$copyFile(src2, dest2, flags2, cb2, startTime) {
          return fs$copyFile(src2, dest2, flags2, function(err) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$copyFile, [src2, dest2, flags2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      var fs$readdir = fs3.readdir;
      fs3.readdir = readdir;
      var noReaddirOptionVersions = /^v[0-5]\./;
      function readdir(path, options3, cb) {
        if (typeof options3 === "function")
          cb = options3, options3 = null;
        var go$readdir = noReaddirOptionVersions.test(process.version) ? function go$readdir2(path2, options4, cb2, startTime) {
          return fs$readdir(path2, fs$readdirCallback(
            path2,
            options4,
            cb2,
            startTime
          ));
        } : function go$readdir2(path2, options4, cb2, startTime) {
          return fs$readdir(path2, options4, fs$readdirCallback(
            path2,
            options4,
            cb2,
            startTime
          ));
        };
        return go$readdir(path, options3, cb);
        function fs$readdirCallback(path2, options4, cb2, startTime) {
          return function(err, files) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([
                go$readdir,
                [path2, options4, cb2],
                err,
                startTime || Date.now(),
                Date.now()
              ]);
            else {
              if (files && files.sort)
                files.sort();
              if (typeof cb2 === "function")
                cb2.call(this, err, files);
            }
          };
        }
      }
      if (process.version.substr(0, 4) === "v0.8") {
        var legStreams = legacy(fs3);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
      }
      var fs$ReadStream = fs3.ReadStream;
      if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
      }
      var fs$WriteStream = fs3.WriteStream;
      if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
      }
      Object.defineProperty(fs3, "ReadStream", {
        get: function() {
          return ReadStream;
        },
        set: function(val) {
          ReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(fs3, "WriteStream", {
        get: function() {
          return WriteStream;
        },
        set: function(val) {
          WriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileReadStream = ReadStream;
      Object.defineProperty(fs3, "FileReadStream", {
        get: function() {
          return FileReadStream;
        },
        set: function(val) {
          FileReadStream = val;
        },
        enumerable: true,
        configurable: true
      });
      var FileWriteStream = WriteStream;
      Object.defineProperty(fs3, "FileWriteStream", {
        get: function() {
          return FileWriteStream;
        },
        set: function(val) {
          FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
      });
      function ReadStream(path, options3) {
        if (this instanceof ReadStream)
          return fs$ReadStream.apply(this, arguments), this;
        else
          return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
      }
      function ReadStream$open() {
        var that = this;
        open3(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            if (that.autoClose)
              that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
            that.read();
          }
        });
      }
      function WriteStream(path, options3) {
        if (this instanceof WriteStream)
          return fs$WriteStream.apply(this, arguments), this;
        else
          return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
      }
      function WriteStream$open() {
        var that = this;
        open3(that.path, that.flags, that.mode, function(err, fd) {
          if (err) {
            that.destroy();
            that.emit("error", err);
          } else {
            that.fd = fd;
            that.emit("open", fd);
          }
        });
      }
      function createReadStream(path, options3) {
        return new fs3.ReadStream(path, options3);
      }
      function createWriteStream(path, options3) {
        return new fs3.WriteStream(path, options3);
      }
      var fs$open = fs3.open;
      fs3.open = open3;
      function open3(path, flags, mode, cb) {
        if (typeof mode === "function")
          cb = mode, mode = null;
        return go$open(path, flags, mode, cb);
        function go$open(path2, flags2, mode2, cb2, startTime) {
          return fs$open(path2, flags2, mode2, function(err, fd) {
            if (err && (err.code === "EMFILE" || err.code === "ENFILE"))
              enqueue([go$open, [path2, flags2, mode2, cb2], err, startTime || Date.now(), Date.now()]);
            else {
              if (typeof cb2 === "function")
                cb2.apply(this, arguments);
            }
          });
        }
      }
      return fs3;
    }
    function enqueue(elem) {
      debug("ENQUEUE", elem[0].name, elem[1]);
      fs2[gracefulQueue].push(elem);
      retry5();
    }
    var retryTimer;
    function resetQueue() {
      var now2 = Date.now();
      for (var i = 0; i < fs2[gracefulQueue].length; ++i) {
        if (fs2[gracefulQueue][i].length > 2) {
          fs2[gracefulQueue][i][3] = now2;
          fs2[gracefulQueue][i][4] = now2;
        }
      }
      retry5();
    }
    function retry5() {
      clearTimeout(retryTimer);
      retryTimer = void 0;
      if (fs2[gracefulQueue].length === 0)
        return;
      var elem = fs2[gracefulQueue].shift();
      var fn3 = elem[0];
      var args2 = elem[1];
      var err = elem[2];
      var startTime = elem[3];
      var lastTime = elem[4];
      if (startTime === void 0) {
        debug("RETRY", fn3.name, args2);
        fn3.apply(null, args2);
      } else if (Date.now() - startTime >= 6e4) {
        debug("TIMEOUT", fn3.name, args2);
        var cb = args2.pop();
        if (typeof cb === "function")
          cb.call(null, err);
      } else {
        var sinceAttempt = Date.now() - lastTime;
        var sinceStart = Math.max(lastTime - startTime, 1);
        var desiredDelay = Math.min(sinceStart * 1.2, 100);
        if (sinceAttempt >= desiredDelay) {
          debug("RETRY", fn3.name, args2);
          fn3.apply(null, args2.concat([startTime]));
        } else {
          fs2[gracefulQueue].push(elem);
        }
      }
      if (retryTimer === void 0) {
        retryTimer = setTimeout(retry5, 0);
      }
    }
  }
});

// ../../node_modules/retry/lib/retry_operation.js
var require_retry_operation = __commonJS({
  "../../node_modules/retry/lib/retry_operation.js"(exports, module) {
    function RetryOperation(timeouts, options3) {
      if (typeof options3 === "boolean") {
        options3 = { forever: options3 };
      }
      this._originalTimeouts = JSON.parse(JSON.stringify(timeouts));
      this._timeouts = timeouts;
      this._options = options3 || {};
      this._maxRetryTime = options3 && options3.maxRetryTime || Infinity;
      this._fn = null;
      this._errors = [];
      this._attempts = 1;
      this._operationTimeout = null;
      this._operationTimeoutCb = null;
      this._timeout = null;
      this._operationStart = null;
      if (this._options.forever) {
        this._cachedTimeouts = this._timeouts.slice(0);
      }
    }
    module.exports = RetryOperation;
    RetryOperation.prototype.reset = function() {
      this._attempts = 1;
      this._timeouts = this._originalTimeouts;
    };
    RetryOperation.prototype.stop = function() {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      this._timeouts = [];
      this._cachedTimeouts = null;
    };
    RetryOperation.prototype.retry = function(err) {
      if (this._timeout) {
        clearTimeout(this._timeout);
      }
      if (!err) {
        return false;
      }
      var currentTime = (/* @__PURE__ */ new Date()).getTime();
      if (err && currentTime - this._operationStart >= this._maxRetryTime) {
        this._errors.unshift(new Error("RetryOperation timeout occurred"));
        return false;
      }
      this._errors.push(err);
      var timeout3 = this._timeouts.shift();
      if (timeout3 === void 0) {
        if (this._cachedTimeouts) {
          this._errors.splice(this._errors.length - 1, this._errors.length);
          this._timeouts = this._cachedTimeouts.slice(0);
          timeout3 = this._timeouts.shift();
        } else {
          return false;
        }
      }
      var self = this;
      var timer = setTimeout(function() {
        self._attempts++;
        if (self._operationTimeoutCb) {
          self._timeout = setTimeout(function() {
            self._operationTimeoutCb(self._attempts);
          }, self._operationTimeout);
          if (self._options.unref) {
            self._timeout.unref();
          }
        }
        self._fn(self._attempts);
      }, timeout3);
      if (this._options.unref) {
        timer.unref();
      }
      return true;
    };
    RetryOperation.prototype.attempt = function(fn3, timeoutOps) {
      this._fn = fn3;
      if (timeoutOps) {
        if (timeoutOps.timeout) {
          this._operationTimeout = timeoutOps.timeout;
        }
        if (timeoutOps.cb) {
          this._operationTimeoutCb = timeoutOps.cb;
        }
      }
      var self = this;
      if (this._operationTimeoutCb) {
        this._timeout = setTimeout(function() {
          self._operationTimeoutCb();
        }, self._operationTimeout);
      }
      this._operationStart = (/* @__PURE__ */ new Date()).getTime();
      this._fn(this._attempts);
    };
    RetryOperation.prototype.try = function(fn3) {
      console.log("Using RetryOperation.try() is deprecated");
      this.attempt(fn3);
    };
    RetryOperation.prototype.start = function(fn3) {
      console.log("Using RetryOperation.start() is deprecated");
      this.attempt(fn3);
    };
    RetryOperation.prototype.start = RetryOperation.prototype.try;
    RetryOperation.prototype.errors = function() {
      return this._errors;
    };
    RetryOperation.prototype.attempts = function() {
      return this._attempts;
    };
    RetryOperation.prototype.mainError = function() {
      if (this._errors.length === 0) {
        return null;
      }
      var counts = {};
      var mainError = null;
      var mainErrorCount = 0;
      for (var i = 0; i < this._errors.length; i++) {
        var error = this._errors[i];
        var message = error.message;
        var count = (counts[message] || 0) + 1;
        counts[message] = count;
        if (count >= mainErrorCount) {
          mainError = error;
          mainErrorCount = count;
        }
      }
      return mainError;
    };
  }
});

// ../../node_modules/retry/lib/retry.js
var require_retry = __commonJS({
  "../../node_modules/retry/lib/retry.js"(exports) {
    var RetryOperation = require_retry_operation();
    exports.operation = function(options3) {
      var timeouts = exports.timeouts(options3);
      return new RetryOperation(timeouts, {
        forever: options3 && options3.forever,
        unref: options3 && options3.unref,
        maxRetryTime: options3 && options3.maxRetryTime
      });
    };
    exports.timeouts = function(options3) {
      if (options3 instanceof Array) {
        return [].concat(options3);
      }
      var opts = {
        retries: 10,
        factor: 2,
        minTimeout: 1 * 1e3,
        maxTimeout: Infinity,
        randomize: false
      };
      for (var key in options3) {
        opts[key] = options3[key];
      }
      if (opts.minTimeout > opts.maxTimeout) {
        throw new Error("minTimeout is greater than maxTimeout");
      }
      var timeouts = [];
      for (var i = 0; i < opts.retries; i++) {
        timeouts.push(this.createTimeout(i, opts));
      }
      if (options3 && options3.forever && !timeouts.length) {
        timeouts.push(this.createTimeout(i, opts));
      }
      timeouts.sort(function(a, b) {
        return a - b;
      });
      return timeouts;
    };
    exports.createTimeout = function(attempt, opts) {
      var random3 = opts.randomize ? Math.random() + 1 : 1;
      var timeout3 = Math.round(random3 * opts.minTimeout * Math.pow(opts.factor, attempt));
      timeout3 = Math.min(timeout3, opts.maxTimeout);
      return timeout3;
    };
    exports.wrap = function(obj, options3, methods) {
      if (options3 instanceof Array) {
        methods = options3;
        options3 = null;
      }
      if (!methods) {
        methods = [];
        for (var key in obj) {
          if (typeof obj[key] === "function") {
            methods.push(key);
          }
        }
      }
      for (var i = 0; i < methods.length; i++) {
        var method = methods[i];
        var original = obj[method];
        obj[method] = function retryWrapper(original2) {
          var op = exports.operation(options3);
          var args2 = Array.prototype.slice.call(arguments, 1);
          var callback4 = args2.pop();
          args2.push(function(err) {
            if (op.retry(err)) {
              return;
            }
            if (err) {
              arguments[0] = op.mainError();
            }
            callback4.apply(this, arguments);
          });
          op.attempt(function() {
            original2.apply(obj, args2);
          });
        }.bind(obj, original);
        obj[method].options = options3;
      }
    };
  }
});

// ../../node_modules/retry/index.js
var require_retry2 = __commonJS({
  "../../node_modules/retry/index.js"(exports, module) {
    module.exports = require_retry();
  }
});

// ../../node_modules/proper-lockfile/node_modules/signal-exit/signals.js
var require_signals = __commonJS({
  "../../node_modules/proper-lockfile/node_modules/signal-exit/signals.js"(exports, module) {
    module.exports = [
      "SIGABRT",
      "SIGALRM",
      "SIGHUP",
      "SIGINT",
      "SIGTERM"
    ];
    if (process.platform !== "win32") {
      module.exports.push(
        "SIGVTALRM",
        "SIGXCPU",
        "SIGXFSZ",
        "SIGUSR2",
        "SIGTRAP",
        "SIGSYS",
        "SIGQUIT",
        "SIGIOT"
        // should detect profiler and enable/disable accordingly.
        // see #21
        // 'SIGPROF'
      );
    }
    if (process.platform === "linux") {
      module.exports.push(
        "SIGIO",
        "SIGPOLL",
        "SIGPWR",
        "SIGSTKFLT",
        "SIGUNUSED"
      );
    }
  }
});

// ../../node_modules/proper-lockfile/node_modules/signal-exit/index.js
var require_signal_exit = __commonJS({
  "../../node_modules/proper-lockfile/node_modules/signal-exit/index.js"(exports, module) {
    var process2 = global.process;
    var processOk = function(process3) {
      return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
    };
    if (!processOk(process2)) {
      module.exports = function() {
        return function() {
        };
      };
    } else {
      assert = __require("assert");
      signals = require_signals();
      isWin = /^win/i.test(process2.platform);
      EE = __require("events");
      if (typeof EE !== "function") {
        EE = EE.EventEmitter;
      }
      if (process2.__signal_exit_emitter__) {
        emitter = process2.__signal_exit_emitter__;
      } else {
        emitter = process2.__signal_exit_emitter__ = new EE();
        emitter.count = 0;
        emitter.emitted = {};
      }
      if (!emitter.infinite) {
        emitter.setMaxListeners(Infinity);
        emitter.infinite = true;
      }
      module.exports = function(cb, opts) {
        if (!processOk(global.process)) {
          return function() {
          };
        }
        assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
        if (loaded === false) {
          load2();
        }
        var ev = "exit";
        if (opts && opts.alwaysLast) {
          ev = "afterexit";
        }
        var remove7 = function() {
          emitter.removeListener(ev, cb);
          if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
            unload();
          }
        };
        emitter.on(ev, cb);
        return remove7;
      };
      unload = function unload2() {
        if (!loaded || !processOk(global.process)) {
          return;
        }
        loaded = false;
        signals.forEach(function(sig) {
          try {
            process2.removeListener(sig, sigListeners[sig]);
          } catch (er) {
          }
        });
        process2.emit = originalProcessEmit;
        process2.reallyExit = originalProcessReallyExit;
        emitter.count -= 1;
      };
      module.exports.unload = unload;
      emit = function emit2(event, code, signal) {
        if (emitter.emitted[event]) {
          return;
        }
        emitter.emitted[event] = true;
        emitter.emit(event, code, signal);
      };
      sigListeners = {};
      signals.forEach(function(sig) {
        sigListeners[sig] = function listener() {
          if (!processOk(global.process)) {
            return;
          }
          var listeners = process2.listeners(sig);
          if (listeners.length === emitter.count) {
            unload();
            emit("exit", null, sig);
            emit("afterexit", null, sig);
            if (isWin && sig === "SIGHUP") {
              sig = "SIGINT";
            }
            process2.kill(process2.pid, sig);
          }
        };
      });
      module.exports.signals = function() {
        return signals;
      };
      loaded = false;
      load2 = function load3() {
        if (loaded || !processOk(global.process)) {
          return;
        }
        loaded = true;
        emitter.count += 1;
        signals = signals.filter(function(sig) {
          try {
            process2.on(sig, sigListeners[sig]);
            return true;
          } catch (er) {
            return false;
          }
        });
        process2.emit = processEmit;
        process2.reallyExit = processReallyExit;
      };
      module.exports.load = load2;
      originalProcessReallyExit = process2.reallyExit;
      processReallyExit = function processReallyExit2(code) {
        if (!processOk(global.process)) {
          return;
        }
        process2.exitCode = code || /* istanbul ignore next */
        0;
        emit("exit", process2.exitCode, null);
        emit("afterexit", process2.exitCode, null);
        originalProcessReallyExit.call(process2, process2.exitCode);
      };
      originalProcessEmit = process2.emit;
      processEmit = function processEmit2(ev, arg) {
        if (ev === "exit" && processOk(global.process)) {
          if (arg !== void 0) {
            process2.exitCode = arg;
          }
          var ret = originalProcessEmit.apply(this, arguments);
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          return ret;
        } else {
          return originalProcessEmit.apply(this, arguments);
        }
      };
    }
    var assert;
    var signals;
    var isWin;
    var EE;
    var emitter;
    var unload;
    var emit;
    var sigListeners;
    var loaded;
    var load2;
    var originalProcessReallyExit;
    var processReallyExit;
    var originalProcessEmit;
    var processEmit;
  }
});

// ../../node_modules/proper-lockfile/lib/mtime-precision.js
var require_mtime_precision = __commonJS({
  "../../node_modules/proper-lockfile/lib/mtime-precision.js"(exports, module) {
    "use strict";
    var cacheSymbol = Symbol();
    function probe(file2, fs2, callback4) {
      const cachedPrecision = fs2[cacheSymbol];
      if (cachedPrecision) {
        return fs2.stat(file2, (err, stat3) => {
          if (err) {
            return callback4(err);
          }
          callback4(null, stat3.mtime, cachedPrecision);
        });
      }
      const mtime = new Date(Math.ceil(Date.now() / 1e3) * 1e3 + 5);
      fs2.utimes(file2, mtime, mtime, (err) => {
        if (err) {
          return callback4(err);
        }
        fs2.stat(file2, (err2, stat3) => {
          if (err2) {
            return callback4(err2);
          }
          const precision = stat3.mtime.getTime() % 1e3 === 0 ? "s" : "ms";
          Object.defineProperty(fs2, cacheSymbol, { value: precision });
          callback4(null, stat3.mtime, precision);
        });
      });
    }
    function getMtime(precision) {
      let now2 = Date.now();
      if (precision === "s") {
        now2 = Math.ceil(now2 / 1e3) * 1e3;
      }
      return new Date(now2);
    }
    module.exports.probe = probe;
    module.exports.getMtime = getMtime;
  }
});

// ../../node_modules/proper-lockfile/lib/lockfile.js
var require_lockfile = __commonJS({
  "../../node_modules/proper-lockfile/lib/lockfile.js"(exports, module) {
    "use strict";
    var path = __require("path");
    var fs2 = require_graceful_fs();
    var retry5 = require_retry2();
    var onExit4 = require_signal_exit();
    var mtimePrecision = require_mtime_precision();
    var locks = {};
    function getLockFile(file2, options3) {
      return options3.lockfilePath || `${file2}.lock`;
    }
    function resolveCanonicalPath(file2, options3, callback4) {
      if (!options3.realpath) {
        return callback4(null, path.resolve(file2));
      }
      options3.fs.realpath(file2, callback4);
    }
    function acquireLock(file2, options3, callback4) {
      const lockfilePath = getLockFile(file2, options3);
      options3.fs.mkdir(lockfilePath, (err) => {
        if (!err) {
          return mtimePrecision.probe(lockfilePath, options3.fs, (err2, mtime, mtimePrecision2) => {
            if (err2) {
              options3.fs.rmdir(lockfilePath, () => {
              });
              return callback4(err2);
            }
            callback4(null, mtime, mtimePrecision2);
          });
        }
        if (err.code !== "EEXIST") {
          return callback4(err);
        }
        if (options3.stale <= 0) {
          return callback4(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file: file2 }));
        }
        options3.fs.stat(lockfilePath, (err2, stat3) => {
          if (err2) {
            if (err2.code === "ENOENT") {
              return acquireLock(file2, { ...options3, stale: 0 }, callback4);
            }
            return callback4(err2);
          }
          if (!isLockStale(stat3, options3)) {
            return callback4(Object.assign(new Error("Lock file is already being held"), { code: "ELOCKED", file: file2 }));
          }
          removeLock(file2, options3, (err3) => {
            if (err3) {
              return callback4(err3);
            }
            acquireLock(file2, { ...options3, stale: 0 }, callback4);
          });
        });
      });
    }
    function isLockStale(stat3, options3) {
      return stat3.mtime.getTime() < Date.now() - options3.stale;
    }
    function removeLock(file2, options3, callback4) {
      options3.fs.rmdir(getLockFile(file2, options3), (err) => {
        if (err && err.code !== "ENOENT") {
          return callback4(err);
        }
        callback4();
      });
    }
    function updateLock(file2, options3) {
      const lock2 = locks[file2];
      if (lock2.updateTimeout) {
        return;
      }
      lock2.updateDelay = lock2.updateDelay || options3.update;
      lock2.updateTimeout = setTimeout(() => {
        lock2.updateTimeout = null;
        options3.fs.stat(lock2.lockfilePath, (err, stat3) => {
          const isOverThreshold = lock2.lastUpdate + options3.stale < Date.now();
          if (err) {
            if (err.code === "ENOENT" || isOverThreshold) {
              return setLockAsCompromised(file2, lock2, Object.assign(err, { code: "ECOMPROMISED" }));
            }
            lock2.updateDelay = 1e3;
            return updateLock(file2, options3);
          }
          const isMtimeOurs = lock2.mtime.getTime() === stat3.mtime.getTime();
          if (!isMtimeOurs) {
            return setLockAsCompromised(
              file2,
              lock2,
              Object.assign(
                new Error("Unable to update lock within the stale threshold"),
                { code: "ECOMPROMISED" }
              )
            );
          }
          const mtime = mtimePrecision.getMtime(lock2.mtimePrecision);
          options3.fs.utimes(lock2.lockfilePath, mtime, mtime, (err2) => {
            const isOverThreshold2 = lock2.lastUpdate + options3.stale < Date.now();
            if (lock2.released) {
              return;
            }
            if (err2) {
              if (err2.code === "ENOENT" || isOverThreshold2) {
                return setLockAsCompromised(file2, lock2, Object.assign(err2, { code: "ECOMPROMISED" }));
              }
              lock2.updateDelay = 1e3;
              return updateLock(file2, options3);
            }
            lock2.mtime = mtime;
            lock2.lastUpdate = Date.now();
            lock2.updateDelay = null;
            updateLock(file2, options3);
          });
        });
      }, lock2.updateDelay);
      if (lock2.updateTimeout.unref) {
        lock2.updateTimeout.unref();
      }
    }
    function setLockAsCompromised(file2, lock2, err) {
      lock2.released = true;
      if (lock2.updateTimeout) {
        clearTimeout(lock2.updateTimeout);
      }
      if (locks[file2] === lock2) {
        delete locks[file2];
      }
      lock2.options.onCompromised(err);
    }
    function lock(file2, options3, callback4) {
      options3 = {
        stale: 1e4,
        update: null,
        realpath: true,
        retries: 0,
        fs: fs2,
        onCompromised: (err) => {
          throw err;
        },
        ...options3
      };
      options3.retries = options3.retries || 0;
      options3.retries = typeof options3.retries === "number" ? { retries: options3.retries } : options3.retries;
      options3.stale = Math.max(options3.stale || 0, 2e3);
      options3.update = options3.update == null ? options3.stale / 2 : options3.update || 0;
      options3.update = Math.max(Math.min(options3.update, options3.stale / 2), 1e3);
      resolveCanonicalPath(file2, options3, (err, file3) => {
        if (err) {
          return callback4(err);
        }
        const operation2 = retry5.operation(options3.retries);
        operation2.attempt(() => {
          acquireLock(file3, options3, (err2, mtime, mtimePrecision2) => {
            if (operation2.retry(err2)) {
              return;
            }
            if (err2) {
              return callback4(operation2.mainError());
            }
            const lock2 = locks[file3] = {
              lockfilePath: getLockFile(file3, options3),
              mtime,
              mtimePrecision: mtimePrecision2,
              options: options3,
              lastUpdate: Date.now()
            };
            updateLock(file3, options3);
            callback4(null, (releasedCallback) => {
              if (lock2.released) {
                return releasedCallback && releasedCallback(Object.assign(new Error("Lock is already released"), { code: "ERELEASED" }));
              }
              unlock(file3, { ...options3, realpath: false }, releasedCallback);
            });
          });
        });
      });
    }
    function unlock(file2, options3, callback4) {
      options3 = {
        fs: fs2,
        realpath: true,
        ...options3
      };
      resolveCanonicalPath(file2, options3, (err, file3) => {
        if (err) {
          return callback4(err);
        }
        const lock2 = locks[file3];
        if (!lock2) {
          return callback4(Object.assign(new Error("Lock is not acquired/owned by you"), { code: "ENOTACQUIRED" }));
        }
        lock2.updateTimeout && clearTimeout(lock2.updateTimeout);
        lock2.released = true;
        delete locks[file3];
        removeLock(file3, options3, callback4);
      });
    }
    function check2(file2, options3, callback4) {
      options3 = {
        stale: 1e4,
        realpath: true,
        fs: fs2,
        ...options3
      };
      options3.stale = Math.max(options3.stale || 0, 2e3);
      resolveCanonicalPath(file2, options3, (err, file3) => {
        if (err) {
          return callback4(err);
        }
        options3.fs.stat(getLockFile(file3, options3), (err2, stat3) => {
          if (err2) {
            return err2.code === "ENOENT" ? callback4(null, false) : callback4(err2);
          }
          return callback4(null, !isLockStale(stat3, options3));
        });
      });
    }
    function getLocks() {
      return locks;
    }
    onExit4(() => {
      for (const file2 in locks) {
        const options3 = locks[file2].options;
        try {
          options3.fs.rmdirSync(getLockFile(file2, options3));
        } catch (e) {
        }
      }
    });
    module.exports.lock = lock;
    module.exports.unlock = unlock;
    module.exports.check = check2;
    module.exports.getLocks = getLocks;
  }
});

// ../../node_modules/proper-lockfile/lib/adapter.js
var require_adapter = __commonJS({
  "../../node_modules/proper-lockfile/lib/adapter.js"(exports, module) {
    "use strict";
    var fs2 = require_graceful_fs();
    function createSyncFs(fs3) {
      const methods = ["mkdir", "realpath", "stat", "rmdir", "utimes"];
      const newFs = { ...fs3 };
      methods.forEach((method) => {
        newFs[method] = (...args2) => {
          const callback4 = args2.pop();
          let ret;
          try {
            ret = fs3[`${method}Sync`](...args2);
          } catch (err) {
            return callback4(err);
          }
          callback4(null, ret);
        };
      });
      return newFs;
    }
    function toPromise(method) {
      return (...args2) => new Promise((resolve6, reject) => {
        args2.push((err, result3) => {
          if (err) {
            reject(err);
          } else {
            resolve6(result3);
          }
        });
        method(...args2);
      });
    }
    function toSync(method) {
      return (...args2) => {
        let err;
        let result3;
        args2.push((_err, _result) => {
          err = _err;
          result3 = _result;
        });
        method(...args2);
        if (err) {
          throw err;
        }
        return result3;
      };
    }
    function toSyncOptions(options3) {
      options3 = { ...options3 };
      options3.fs = createSyncFs(options3.fs || fs2);
      if (typeof options3.retries === "number" && options3.retries > 0 || options3.retries && typeof options3.retries.retries === "number" && options3.retries.retries > 0) {
        throw Object.assign(new Error("Cannot use retries with the sync api"), { code: "ESYNC" });
      }
      return options3;
    }
    module.exports = {
      toPromise,
      toSync,
      toSyncOptions
    };
  }
});

// ../../node_modules/proper-lockfile/index.js
var require_proper_lockfile = __commonJS({
  "../../node_modules/proper-lockfile/index.js"(exports, module) {
    "use strict";
    var lockfile2 = require_lockfile();
    var { toPromise, toSync, toSyncOptions } = require_adapter();
    async function lock(file2, options3) {
      const release = await toPromise(lockfile2.lock)(file2, options3);
      return toPromise(release);
    }
    function lockSync(file2, options3) {
      const release = toSync(lockfile2.lock)(file2, toSyncOptions(options3));
      return toSync(release);
    }
    function unlock(file2, options3) {
      return toPromise(lockfile2.unlock)(file2, options3);
    }
    function unlockSync(file2, options3) {
      return toSync(lockfile2.unlock)(file2, toSyncOptions(options3));
    }
    function check2(file2, options3) {
      return toPromise(lockfile2.check)(file2, options3);
    }
    function checkSync(file2, options3) {
      return toSync(lockfile2.check)(file2, toSyncOptions(options3));
    }
    module.exports = lock;
    module.exports.lock = lock;
    module.exports.unlock = unlock;
    module.exports.lockSync = lockSync;
    module.exports.unlockSync = unlockSync;
    module.exports.check = check2;
    module.exports.checkSync = checkSync;
  }
});

// ../../node_modules/effect/dist/Pipeable.js
var pipeArguments = (self, args2) => {
  switch (args2.length) {
    case 0:
      return self;
    case 1:
      return args2[0](self);
    case 2:
      return args2[1](args2[0](self));
    case 3:
      return args2[2](args2[1](args2[0](self)));
    case 4:
      return args2[3](args2[2](args2[1](args2[0](self))));
    case 5:
      return args2[4](args2[3](args2[2](args2[1](args2[0](self)))));
    case 6:
      return args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))));
    case 7:
      return args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))));
    case 8:
      return args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self))))))));
    case 9:
      return args2[8](args2[7](args2[6](args2[5](args2[4](args2[3](args2[2](args2[1](args2[0](self)))))))));
    default: {
      let ret = self;
      for (let i = 0, len = args2.length; i < len; i++) {
        ret = args2[i](ret);
      }
      return ret;
    }
  }
};
var Prototype = {
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var Class = /* @__PURE__ */ (function() {
  function PipeableBase() {
  }
  PipeableBase.prototype = Prototype;
  return PipeableBase;
})();

// ../../node_modules/effect/dist/Function.js
var dual = function(arity, body) {
  if (typeof arity === "function") {
    return function() {
      return arity(arguments) ? body.apply(this, arguments) : (self) => body(self, ...arguments);
    };
  }
  switch (arity) {
    case 0:
    case 1:
      throw new RangeError(`Invalid arity ${arity}`);
    case 2:
      return function(a, b) {
        if (arguments.length >= 2) {
          return body(a, b);
        }
        return function(self) {
          return body(self, a);
        };
      };
    case 3:
      return function(a, b, c) {
        if (arguments.length >= 3) {
          return body(a, b, c);
        }
        return function(self) {
          return body(self, a, b);
        };
      };
    default:
      return function() {
        if (arguments.length >= arity) {
          return body.apply(this, arguments);
        }
        const args2 = arguments;
        return function(self) {
          return body(self, ...args2);
        };
      };
  }
};
var identity = (a) => a;
var constant = (value3) => () => value3;
var constTrue = /* @__PURE__ */ constant(true);
var constFalse = /* @__PURE__ */ constant(false);
var constNull = /* @__PURE__ */ constant(null);
var constUndefined = /* @__PURE__ */ constant(void 0);
var constVoid = constUndefined;
function pipe(a, ...args2) {
  return pipeArguments(a, args2);
}
function flow(ab, bc, cd, de, ef, fg, gh, hi, ij) {
  switch (arguments.length) {
    case 1:
      return ab;
    case 2:
      return function() {
        return bc(ab.apply(this, arguments));
      };
    case 3:
      return function() {
        return cd(bc(ab.apply(this, arguments)));
      };
    case 4:
      return function() {
        return de(cd(bc(ab.apply(this, arguments))));
      };
    case 5:
      return function() {
        return ef(de(cd(bc(ab.apply(this, arguments)))));
      };
    case 6:
      return function() {
        return fg(ef(de(cd(bc(ab.apply(this, arguments))))));
      };
    case 7:
      return function() {
        return gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))));
      };
    case 8:
      return function() {
        return hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments))))))));
      };
    case 9:
      return function() {
        return ij(hi(gh(fg(ef(de(cd(bc(ab.apply(this, arguments)))))))));
      };
  }
  return;
}
function memoize(f) {
  const cache2 = /* @__PURE__ */ new WeakMap();
  return (a) => {
    const cached3 = cache2.get(a);
    if (cached3 !== void 0) return cached3;
    const result3 = f(a);
    cache2.set(a, result3);
    return result3;
  };
}
function memoizeIdempotent(f) {
  const cache2 = /* @__PURE__ */ new WeakMap();
  return (a) => {
    const cached3 = cache2.get(a);
    if (cached3 !== void 0) return cached3;
    const result3 = f(a);
    cache2.set(a, result3);
    if (result3 !== a) {
      cache2.set(result3, result3);
    }
    return result3;
  };
}

// ../../node_modules/effect/dist/internal/equal.js
var getAllObjectKeys = (obj) => {
  const keys3 = new Set(Reflect.ownKeys(obj));
  if (obj.constructor === Object) return keys3;
  if (obj instanceof Error) {
    keys3.delete("stack");
  }
  const proto = Object.getPrototypeOf(obj);
  let current = proto;
  while (current !== null && current !== Object.prototype) {
    const ownKeys = Reflect.ownKeys(current);
    for (let i = 0; i < ownKeys.length; i++) {
      keys3.add(ownKeys[i]);
    }
    current = Object.getPrototypeOf(current);
  }
  if (keys3.has("constructor") && typeof obj.constructor === "function" && proto === obj.constructor.prototype) {
    keys3.delete("constructor");
  }
  return keys3;
};
var byReferenceInstances = /* @__PURE__ */ new WeakSet();
var viewBytes = (view) => new Uint8Array(view.buffer, view.byteOffset, view.byteLength);

// ../../node_modules/effect/dist/internal/hash.js
var backEdges = 0;
var addBackEdge = () => {
  backEdges++;
};

// ../../node_modules/effect/dist/Predicate.js
function isString(input) {
  return typeof input === "string";
}
function isNumber(input) {
  return typeof input === "number";
}
function isBoolean(input) {
  return typeof input === "boolean";
}
function isBigInt(input) {
  return typeof input === "bigint";
}
function isSymbol(input) {
  return typeof input === "symbol";
}
function isPropertyKey(u) {
  return isString(u) || isNumber(u) || isSymbol(u);
}
function isFunction(input) {
  return typeof input === "function";
}
function isUndefined(input) {
  return input === void 0;
}
function isNotUndefined(input) {
  return input !== void 0;
}
function isNotNullish(input) {
  return input != null;
}
function isNever(_) {
  return false;
}
function isUnknown(_) {
  return true;
}
function isObject(input) {
  return typeof input === "object" && input !== null && !Array.isArray(input);
}
function isObjectKeyword(input) {
  return typeof input === "object" && input !== null || isFunction(input);
}
var hasProperty = /* @__PURE__ */ dual(2, (self, property) => isObjectKeyword(self) && property in self);
var isTagged = /* @__PURE__ */ dual(2, (self, tag2) => hasProperty(self, "_tag") && self["_tag"] === tag2);
function isError(input) {
  return input instanceof Error;
}
function isIterable(input) {
  return hasProperty(input, Symbol.iterator) || isString(input);
}
var or = /* @__PURE__ */ dual(2, (self, that) => (a) => self(a) || that(a));

// ../../node_modules/effect/dist/Hash.js
var symbol = "~effect/Hash";
var hash = (self) => {
  switch (typeof self) {
    case "number":
      return number(self);
    case "bigint":
      return string(self.toString(10));
    case "string":
      return string(self);
    case "function":
    case "object": {
      if (self === null) {
        break;
      } else if (self instanceof Date) {
        if (Number.isNaN(self.getTime())) {
          return string("Invalid Date");
        }
        return string(self.toISOString());
      } else if (self instanceof RegExp) {
        return string(self.toString());
      } else {
        if (byReferenceInstances.has(self)) {
          return random(self);
        }
        const cached3 = hashCache.get(self);
        if (cached3 !== void 0) {
          return cached3;
        }
        if (visitedObjects.has(self)) {
          addBackEdge();
          return string("[Circular]");
        }
        visitedObjects.add(self);
        const seen = backEdges;
        let h;
        try {
          if (symbol in self) {
            h = self[symbol]();
          } else if (typeof self === "function") {
            h = random(self);
          } else if (self instanceof DataView) {
            h = array(viewBytes(self));
          } else if (Array.isArray(self) || ArrayBuffer.isView(self)) {
            h = array(self);
          } else if (self instanceof Map) {
            h = hashMap(self);
          } else if (self instanceof Set) {
            h = hashSet(self);
          } else {
            h = structure(self);
          }
        } finally {
          visitedObjects.delete(self);
        }
        if (seen === backEdges) {
          hashCache.set(self, h);
        }
        return h;
      }
    }
  }
  return optimize(mix(string(String(self))));
};
var random = (self) => {
  if (!randomHashCache.has(self)) {
    randomHashCache.set(self, optimize(Math.random() * 4294967296 | 0));
  }
  return randomHashCache.get(self);
};
var mix = (h) => {
  h ^= h >>> 16;
  h = Math.imul(h, 2246822507);
  h ^= h >>> 13;
  h = Math.imul(h, 3266489909);
  return h ^ h >>> 16;
};
var combine = /* @__PURE__ */ dual(2, (self, b) => mix(Math.imul(self, 2654435761) + Math.imul(b, 2246822507)));
var optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
var float64 = /* @__PURE__ */ new DataView(/* @__PURE__ */ new ArrayBuffer(8));
var number = (n) => {
  const h = n | 0;
  if (h === n) {
    return optimize(h);
  }
  float64.setFloat64(0, n !== n ? NaN : n);
  return optimize(combine(float64.getInt32(0), float64.getInt32(4)));
};
var string = (str) => {
  let h = 5381, i = str.length;
  while (i) {
    h = h * 33 ^ str.charCodeAt(--i);
  }
  return optimize(h);
};
var structureKeys = (o, keys3) => {
  let h = 12289;
  for (const key of keys3) {
    h ^= combine(hash(key), hash(o[key]));
  }
  return optimize(h);
};
var structure = (o) => structureKeys(o, getAllObjectKeys(o));
var unordered = (seed, f) => (iter) => {
  let h = seed;
  for (const element of iter) {
    h ^= f(element);
  }
  return optimize(h);
};
var array = (arr) => {
  let h = 6151;
  for (const element of arr) {
    h = combine(h, hash(element));
  }
  return optimize(h);
};
var hashMap = /* @__PURE__ */ unordered(/* @__PURE__ */ string("Map"), ([k, v]) => combine(hash(k), hash(v)));
var setSeed = /* @__PURE__ */ string("Set");
var hashSet = /* @__PURE__ */ unordered(setSeed, (element) => combine(setSeed, hash(element)));
var randomHashCache = /* @__PURE__ */ new WeakMap();
var hashCache = /* @__PURE__ */ new WeakMap();
var visitedObjects = /* @__PURE__ */ new WeakSet();

// ../../node_modules/effect/dist/Equal.js
var symbol2 = "~effect/Equal";
function equals() {
  if (arguments.length === 1) {
    return (self) => compareBoth(self, arguments[0]);
  }
  return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
  if (self === that) return true;
  if (self == null || that == null) return false;
  const selfType = typeof self;
  if (selfType !== typeof that) {
    return false;
  }
  if (selfType === "number" && self !== self && that !== that) {
    return true;
  }
  if (selfType !== "object" && selfType !== "function") {
    return false;
  }
  if (byReferenceInstances.has(self) || byReferenceInstances.has(that)) {
    return false;
  }
  return compareObjects(self, that);
}
function compareObjects(self, that) {
  const depth = pathLeft.length;
  for (let i = depth; i-- > 0; ) {
    if (pathLeft[i] === self && pathRight[i] === that) return true;
  }
  if (depth) return compareOnPath(self, that);
  let known = results.get(self);
  if (!known) results.set(self, known = /* @__PURE__ */ new WeakMap());
  let result3 = known.get(that);
  if (result3 === void 0) known.set(that, result3 = compareOnPath(self, that));
  return result3;
}
function compareOnPath(self, that) {
  pathLeft.push(self);
  pathRight.push(that);
  try {
    return compareStructure(self, that);
  } finally {
    pathLeft.pop();
    pathRight.pop();
  }
}
var pathLeft = [];
var pathRight = [];
var results = /* @__PURE__ */ new WeakMap();
function compareStructure(self, that) {
  if (hash(self) !== hash(that)) {
    return false;
  } else if (self instanceof Date) {
    if (!(that instanceof Date)) return false;
    const selfTime = self.getTime();
    const thatTime = that.getTime();
    return selfTime === thatTime || Number.isNaN(selfTime) && Number.isNaN(thatTime);
  } else if (self instanceof RegExp) {
    return that instanceof RegExp && self.toString() === that.toString();
  }
  const bothEquals = isEqual(self);
  if (bothEquals !== isEqual(that) || typeof self === "function" && !bothEquals) {
    return false;
  } else if (bothEquals) {
    return self[symbol2](that);
  } else if (Array.isArray(self)) {
    if (!Array.isArray(that) || self.length !== that.length) {
      return false;
    }
    return compareArrays(self, that);
  } else if (ArrayBuffer.isView(self)) {
    const selfIsDataView = self instanceof DataView;
    if (!ArrayBuffer.isView(that) || self.byteLength !== that.byteLength || selfIsDataView !== that instanceof DataView) {
      return false;
    }
    if (selfIsDataView) {
      return compareTypedArrays(viewBytes(self), viewBytes(that));
    }
    return compareTypedArrays(self, that);
  } else if (self instanceof Map) {
    if (!(that instanceof Map) || self.size !== that.size) {
      return false;
    }
    return compareHashed(self, that, entryHash, equalEntries);
  } else if (self instanceof Set) {
    if (!(that instanceof Set) || self.size !== that.size) {
      return false;
    }
    return compareHashed(self, that, hash, compareBoth);
  }
  return compareRecords(self, that);
}
function compareArrays(self, that) {
  for (let i = 0; i < self.length; i++) {
    if (!compareBoth(self[i], that[i])) {
      return false;
    }
  }
  return true;
}
function compareTypedArrays(self, that) {
  if (self.length !== that.length) {
    return false;
  }
  for (let i = 0; i < self.length; i++) {
    if (self[i] !== that[i]) {
      return false;
    }
  }
  return true;
}
function compareRecords(self, that) {
  const selfKeys = getAllObjectKeys(self);
  const thatKeys = getAllObjectKeys(that);
  if (selfKeys.size !== thatKeys.size) {
    return false;
  }
  for (const key of selfKeys) {
    if (!thatKeys.has(key) || !compareBoth(self[key], that[key])) {
      return false;
    }
  }
  return true;
}
function compareHashed(self, that, hashOf, equivalent) {
  const groups = /* @__PURE__ */ new Map();
  for (const item of that) {
    const h = hashOf(item);
    const group = groups.get(h);
    if (group) group.push(item);
    else groups.set(h, [item]);
  }
  outer: for (const item of self) {
    const group = groups.get(hashOf(item));
    if (group) {
      for (let i = 0; i < group.length; i++) {
        if (equivalent(item, group[i])) {
          group[i] = group[group.length - 1];
          group.pop();
          continue outer;
        }
      }
    }
    return false;
  }
  return true;
}
var entryHash = (entry) => hash(entry[0]);
var equalEntries = (self, that) => compareBoth(self[0], that[0]) && compareBoth(self[1], that[1]);
var sameGroup = () => 0;
function makeCompareMap(keyEquivalence, valueEquivalence) {
  return makeCompareSet((self, that) => keyEquivalence(self[0], that[0]) && valueEquivalence(self[1], that[1]));
}
function makeCompareSet(equivalence) {
  return function compareSets(self, that) {
    return compareHashed(self, that, sameGroup, equivalence);
  };
}
var isEqual = (u) => hasProperty(u, symbol2);
var asEquivalence = () => equals;
var byReferenceUnsafe = (obj) => {
  byReferenceInstances.add(obj);
  return obj;
};

// ../../node_modules/effect/dist/Redactable.js
var symbolRedactable = /* @__PURE__ */ Symbol.for("~effect/Redactable");
var isRedactable = (u) => hasProperty(u, symbolRedactable);
function redact(u) {
  if (isRedactable(u)) return getRedacted(u);
  return u;
}
function getRedacted(redactable) {
  return redactable[symbolRedactable](globalThis[currentFiberTypeId]?.context ?? emptyContext);
}
var currentFiberTypeId = "~effect/Fiber/currentFiber";
var emptyMap = /* @__PURE__ */ new Map();
var emptyContext = {
  "~effect/Context": {},
  base: emptyMap,
  depth: 0,
  mapUnsafe: emptyMap,
  pipe() {
    return pipeArguments(this, arguments);
  }
};

// ../../node_modules/effect/dist/Formatter.js
function format(input, options3) {
  const space = options3?.space ?? 0;
  const ancestors = /* @__PURE__ */ new WeakSet();
  const gap = !space ? "" : typeof space === "number" ? " ".repeat(space) : space;
  const ind = (d) => gap.repeat(d);
  const wrap = (v, body) => {
    const ctor = v?.constructor;
    return ctor && ctor !== Object.prototype.constructor && ctor.name ? `${ctor.name}(${body})` : body;
  };
  const ownKeys = (o) => {
    try {
      return Reflect.ownKeys(o);
    } catch {
      return ["[ownKeys threw]"];
    }
  };
  function recur2(v, d = 0) {
    try {
      return recurUnsafe(v, d);
    } catch {
      if (typeof v === "object" && v !== null || typeof v === "function") ancestors.delete(v);
      return "[inspection threw]";
    }
  }
  function recurUnsafe(v, d = 0) {
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "number" || v == null || typeof v === "boolean" || typeof v === "symbol") return String(v);
    if (typeof v === "bigint") return String(v) + "n";
    if (typeof v === "object" || typeof v === "function") {
      if (ancestors.has(v)) return CIRCULAR;
      ancestors.add(v);
      let output;
      if (symbolRedactable in v) {
        output = recur2(getRedacted(v), d);
      } else if (Array.isArray(v)) {
        output = !gap || v.length <= 1 ? `[${v.map((x) => recur2(x, d)).join(",")}]` : `[
${ind(d + 1)}${v.map((x) => recur2(x, d + 1)).join(",\n" + ind(d + 1))}
${ind(d)}]`;
      } else if (v instanceof Date) {
        output = formatDate(v);
      } else if (!options3?.ignoreToString && hasProperty(v, "toString") && typeof v["toString"] === "function" && v["toString"] !== Object.prototype.toString && v["toString"] !== Array.prototype.toString) {
        const s = safeToString(v);
        output = v instanceof Error && v.cause !== void 0 ? `${s} (cause: ${recur2(v.cause, d)})` : s;
      } else if (Symbol.iterator in v) {
        output = `${v.constructor.name}(${recur2(Array.from(v), d)})`;
      } else {
        const keys3 = ownKeys(v);
        if (!gap || keys3.length <= 1) {
          const body = `{${keys3.map((k) => `${formatPropertyKey(k)}:${recur2(safeGet(v, k), d)}`).join(",")}}`;
          output = wrap(v, body);
        } else {
          const body = `{
${keys3.map((k) => `${ind(d + 1)}${formatPropertyKey(k)}: ${recur2(safeGet(v, k), d + 1)}`).join(",\n")}
${ind(d)}}`;
          output = wrap(v, body);
        }
      }
      ancestors.delete(v);
      return output;
    }
    return String(v);
  }
  return recur2(input, 0);
}
var CIRCULAR = "[Circular]";
function formatPropertyKey(name) {
  return typeof name === "string" ? JSON.stringify(name) : String(name);
}
function formatPath(path) {
  return path.map((key) => `[${formatPropertyKey(key)}]`).join("");
}
function formatDate(date) {
  try {
    return date.toISOString();
  } catch {
    return "Invalid Date";
  }
}
function safeToString(input) {
  try {
    const s = input.toString();
    return typeof s === "string" ? s : String(s);
  } catch {
    return "[toString threw]";
  }
}
function safeGet(input, key) {
  try {
    return input[key];
  } catch {
    return "[property access threw]";
  }
}
function formatJson(input, options3) {
  const ancestors = [];
  return JSON.stringify(input, function(key, value3) {
    const original = Object.getOwnPropertyDescriptor(this, key)?.value;
    const redacted = hasProperty(original, symbolRedactable) ? redact(original) : redact(value3);
    if (typeof redacted === "bigint") {
      return format(redacted);
    }
    if (typeof redacted !== "object" || redacted === null) {
      return redacted;
    }
    const current = redacted instanceof Error && !hasProperty(redacted, "toJSON") ? {
      ...redacted,
      name: redacted.name,
      message: redacted.message
    } : redacted;
    while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
      ancestors.pop();
    }
    if (ancestors.includes(redacted)) {
      return void 0;
    }
    ancestors.push(redacted);
    if (current !== redacted) {
      ancestors.push(current);
    }
    return current;
  }, options3?.space) ?? "null";
}

// ../../node_modules/effect/dist/Inspectable.js
var NodeInspectSymbol = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
var toJson = (input) => {
  try {
    input = redact(input);
    if (hasProperty(input, "toJSON") && isFunction(input["toJSON"]) && input["toJSON"].length === 0) {
      return input.toJSON();
    } else if (Array.isArray(input)) {
      return input.map(toJson);
    }
    return input;
  } catch {
    return "[toJSON threw]";
  }
};
var toStringUnknown = (u, whitespace = 2) => {
  if (typeof u === "string") {
    return u;
  }
  try {
    return typeof u === "object" ? formatJson(u, {
      space: whitespace
    }) : format(u, {
      space: whitespace
    });
  } catch {
    return String(u);
  }
};
var BaseProto = {
  toJSON() {
    return toJson(this);
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  toString() {
    return format(this.toJSON());
  }
};
var Class2 = class {
  /**
   * Node.js custom inspection method.
   *
   * **When to use**
   *
   * Use to expose the class JSON representation to Node.js inspection.
   *
   * @since 2.0.0
   */
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  /**
   * Returns a formatted string representation of this object.
   *
   * **When to use**
   *
   * Use to format the class JSON representation as a string.
   *
   * @since 2.0.0
   */
  toString() {
    return format(this.toJSON());
  }
};

// ../../node_modules/effect/dist/internal/stackTraceLimit.js
var isStackTraceLimitWritable = () => {
  const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
  if (desc === void 0) {
    return Object.isExtensible(Error);
  }
  return Object.hasOwn(desc, "writable") ? desc.writable === true : desc.set !== void 0;
};
var canWriteStackTraceLimit = /* @__PURE__ */ isStackTraceLimitWritable();
var getStackTraceLimit = () => Error.stackTraceLimit;
var setStackTraceLimit = (value3) => {
  if (canWriteStackTraceLimit) {
    ;
    Error.stackTraceLimit = value3;
  }
};

// ../../node_modules/effect/dist/Utils.js
var SingleShotGen = class {
  constructor(self) {
    this.value = self;
    this.done = false;
  }
  /**
   * Yields the stored value once, then completes with the value sent back in.
   *
   * **When to use**
   *
   * Use to advance a `SingleShotGen` through its single yield and completion
   * step.
   *
   * @since 2.0.0
   */
  next(a) {
    if (this.done) {
      this.value = a;
      return this;
    }
    this.done = true;
    return {
      value: this.value,
      done: false
    };
  }
};
var pickInternalCall = () => {
  const InternalTypeId = "~effect/Utils/internal";
  const standard = {
    [InternalTypeId]: (body) => {
      return body();
    }
  };
  const forced = {
    [InternalTypeId]: (body) => {
      try {
        return body();
      } finally {
      }
    }
  };
  const isNotOptimizedAway = getStackTraceLimit() !== 0 && standard[InternalTypeId](() => new Error().stack)?.includes(InternalTypeId) === true;
  return isNotOptimizedAway ? standard[InternalTypeId] : forced[InternalTypeId];
};
var internalCall = /* @__PURE__ */ pickInternalCall();

// ../../node_modules/effect/dist/internal/record.js
function assignProperty(self, key, value3) {
  if (key === "__proto__") {
    Object.defineProperty(self, key, {
      value: value3,
      writable: true,
      enumerable: true,
      configurable: true
    });
  } else {
    ;
    self[key] = value3;
  }
}
function assignProperties(self, source) {
  for (const key of Reflect.ownKeys(source)) {
    if (Object.prototype.propertyIsEnumerable.call(source, key)) {
      assignProperty(self, key, source[key]);
    }
  }
}

// ../../node_modules/effect/dist/internal/core.js
var EffectTypeId = `~effect/Effect`;
var ExitTypeId = `~effect/Exit`;
var effectVariance = {
  _A: identity,
  _E: identity,
  _R: identity
};
var identifier = `${EffectTypeId}/identifier`;
var args = `${EffectTypeId}/args`;
var evaluate = `${EffectTypeId}/evaluate`;
var contA = `${EffectTypeId}/successCont`;
var contE = `${EffectTypeId}/failureCont`;
var contAll = `${EffectTypeId}/ensureCont`;
var Yield = /* @__PURE__ */ Symbol.for("effect/Effect/Yield");
var PipeInspectableProto = {
  pipe() {
    return pipeArguments(this, arguments);
  },
  toJSON() {
    return {
      ...this
    };
  },
  toString() {
    return format(this.toJSON(), {
      ignoreToString: true,
      space: 2
    });
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var StructuralProto = {
  [symbol]() {
    return structureKeys(this, Object.keys(this));
  },
  [symbol2](that) {
    const selfKeys = Object.keys(this);
    const thatKeys = Object.keys(that);
    if (selfKeys.length !== thatKeys.length) return false;
    for (let i = 0; i < selfKeys.length; i++) {
      if (selfKeys[i] !== thatKeys[i] || !equals(this[selfKeys[i]], that[selfKeys[i]])) {
        return false;
      }
    }
    return true;
  }
};
var EffectProto = {
  [EffectTypeId]: effectVariance,
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  },
  toJSON() {
    return {
      _id: "Effect",
      op: this[identifier],
      ...args in this ? {
        args: this[args]
      } : void 0
    };
  }
};
var isEffect = (u) => hasProperty(u, EffectTypeId);
var isExit = (u) => hasProperty(u, ExitTypeId);
var CauseTypeId = "~effect/Cause";
var CauseReasonTypeId = "~effect/Cause/Reason";
var isCause = (self) => hasProperty(self, CauseTypeId);
var isCauseReason = (self) => hasProperty(self, CauseReasonTypeId);
var CauseImpl = class {
  constructor(failures) {
    this[CauseTypeId] = CauseTypeId;
    this.reasons = failures;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toJSON() {
    return {
      _id: "Cause",
      failures: this.reasons.map((f) => f.toJSON())
    };
  }
  toString() {
    return `Cause(${format(this.reasons)})`;
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  [symbol2](that) {
    return isCause(that) && this.reasons.length === that.reasons.length && this.reasons.every((e, i) => equals(e, that.reasons[i]));
  }
  [symbol]() {
    return array(this.reasons);
  }
};
var annotationsMap = /* @__PURE__ */ new WeakMap();
var ReasonBase = class {
  [CauseReasonTypeId];
  annotations;
  _tag;
  constructor(_tag, annotations, originalError) {
    this[CauseReasonTypeId] = CauseReasonTypeId;
    this._tag = _tag;
    if (annotations !== constEmptyAnnotations && typeof originalError === "object" && originalError !== null && annotations.size > 0) {
      const prevAnnotations = annotationsMap.get(originalError);
      if (prevAnnotations) {
        annotations = new Map([...prevAnnotations, ...annotations]);
      }
      annotationsMap.set(originalError, annotations);
    }
    this.annotations = annotations;
  }
  annotate(annotations, options3) {
    if (annotations.mapUnsafe.size === 0) return this;
    const newAnnotations = new Map(this.annotations);
    annotations.mapUnsafe.forEach((value3, key) => {
      if (options3?.overwrite !== true && newAnnotations.has(key)) return;
      newAnnotations.set(key, value3);
    });
    const self = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
    self.annotations = newAnnotations;
    return self;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  toString() {
    return format(this);
  }
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var constEmptyAnnotations = /* @__PURE__ */ new Map();
var Fail = class extends ReasonBase {
  constructor(error, annotations = constEmptyAnnotations) {
    super("Fail", annotations, error);
    this.error = error;
  }
  toString() {
    return `Fail(${format(this.error)})`;
  }
  toJSON() {
    return {
      _tag: "Fail",
      error: this.error
    };
  }
  [symbol2](that) {
    return isFailReason(that) && equals(this.error, that.error) && equals(this.annotations, that.annotations);
  }
  [symbol]() {
    return combine(string(this._tag))(combine(hash(this.error))(hash(this.annotations)));
  }
};
var causeFromReasons = (reasons) => new CauseImpl(reasons);
var dedupeReasons = (self, that) => {
  const buckets = /* @__PURE__ */ new Map();
  const out = [];
  for (const reason of self.concat(that)) {
    const hash2 = hash(reason);
    const bucket = buckets.get(hash2);
    if (bucket === void 0) {
      buckets.set(hash2, [reason]);
    } else if (bucket.some((previous) => equals(previous, reason))) {
      continue;
    } else {
      bucket.push(reason);
    }
    out.push(reason);
  }
  return out;
};
var causeCombine = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.reasons.length === 0) {
    return that;
  } else if (that.reasons.length === 0) {
    return self;
  }
  const newCause = new CauseImpl(dedupeReasons(self.reasons, that.reasons));
  return equals(self, newCause) ? self : newCause;
});
var causeEmpty = /* @__PURE__ */ new CauseImpl([]);
var causeFail = (error) => new CauseImpl([new Fail(error)]);
var Die = class extends ReasonBase {
  constructor(defect, annotations = constEmptyAnnotations) {
    super("Die", annotations, defect);
    this.defect = defect;
  }
  toString() {
    return `Die(${format(this.defect)})`;
  }
  toJSON() {
    return {
      _tag: "Die",
      defect: this.defect
    };
  }
  [symbol2](that) {
    return isDieReason(that) && equals(this.defect, that.defect) && equals(this.annotations, that.annotations);
  }
  [symbol]() {
    return combine(string(this._tag))(combine(hash(this.defect))(hash(this.annotations)));
  }
};
var causeDie = (defect) => new CauseImpl([new Die(defect)]);
var causeAnnotate = /* @__PURE__ */ dual((args2) => isCause(args2[0]), (self, annotations, options3) => {
  if (annotations.mapUnsafe.size === 0) return self;
  return new CauseImpl(self.reasons.map((f) => f.annotate(annotations, options3)));
});
var isFailReason = (self) => self._tag === "Fail";
var isDieReason = (self) => self._tag === "Die";
var isInterruptReason = (self) => self._tag === "Interrupt";
function defaultEvaluate(_fiber) {
  return exitDie(`Effect.evaluate: Not implemented`);
}
var makePrimitiveProto = (options3) => ({
  ...EffectProto,
  [identifier]: options3.op,
  [evaluate]: options3[evaluate] ?? defaultEvaluate,
  [contA]: options3[contA],
  [contE]: options3[contE],
  [contAll]: options3[contAll]
});
var makePrimitive = (options3) => {
  const Proto13 = makePrimitiveProto(options3);
  const PrimitiveImpl = function(value3) {
    this[args] = value3;
  };
  PrimitiveImpl.prototype = Proto13;
  return function(value3) {
    return new PrimitiveImpl(value3);
  };
};
var makeExit = (options3) => {
  const Proto13 = {
    [ExitTypeId]: ExitTypeId,
    _tag: options3.op,
    get [options3.prop]() {
      return this[args];
    },
    ...makePrimitiveProto(options3),
    toString() {
      return `${options3.op}(${format(this[args])})`;
    },
    toJSON() {
      return {
        _id: "Exit",
        _tag: options3.op,
        [options3.prop]: this[args]
      };
    },
    [symbol2](that) {
      return isExit(that) && that._tag === this._tag && equals(this[args], that[args]);
    },
    [symbol]() {
      return combine(string(options3.op), hash(this[args]));
    }
  };
  const ExitPrimitive = function(value3) {
    this[args] = value3;
  };
  ExitPrimitive.prototype = Proto13;
  return function(value3) {
    return new ExitPrimitive(value3);
  };
};
var exitSucceed = /* @__PURE__ */ makeExit({
  op: "Success",
  prop: "value",
  [evaluate](fiber3) {
    const cont = fiber3.getCont(contA);
    return cont ? cont[contA](this[args], fiber3, this) : fiber3.yieldWith(this);
  }
});
var StackTraceKey = {
  key: "effect/Cause/StackTrace"
};
var InterruptorStackTrace = {
  key: "effect/Cause/InterruptorStackTrace"
};
var exitFailCause = /* @__PURE__ */ makeExit({
  op: "Failure",
  prop: "cause",
  [evaluate](fiber3) {
    let cause = this[args];
    let annotated = false;
    if (fiber3.cache.stackFrame) {
      cause = causeAnnotate(cause, {
        mapUnsafe: /* @__PURE__ */ new Map([[StackTraceKey.key, fiber3.cache.stackFrame]])
      });
      annotated = true;
    }
    let cont = fiber3.getCont(contE);
    const interruptedCause = fiber3._interruptedCause;
    if (interruptedCause && fiber3.interruptible) {
      let skippedHandler = false;
      while (cont && fiber3.interruptible) {
        skippedHandler ||= identifier in cont;
        cont = fiber3.getCont(contE);
      }
      if (skippedHandler) {
        cause = causeFromReasons(cause.reasons.filter((reason) => reason._tag !== "Fail"));
      }
      cause = causeCombine(cause, interruptedCause);
      annotated = true;
    }
    return cont ? cont[contE](cause, fiber3, annotated ? void 0 : this) : fiber3.yieldWith(annotated ? exitFailCause(cause) : this);
  }
});
var exitFail = (e) => exitFailCause(causeFail(e));
var exitDie = (defect) => exitFailCause(causeDie(defect));
var withFiber = /* @__PURE__ */ makePrimitive({
  op: "WithFiber",
  [evaluate](fiber3) {
    return this[args](fiber3);
  }
});
var withFiberSucceed = /* @__PURE__ */ makePrimitive({
  op: "WithFiberSucceed",
  [evaluate](fiber3) {
    const value3 = this[args](fiber3);
    const cont = fiber3.getCont(contA);
    return cont ? cont[contA](value3, fiber3) : fiber3.yieldWith(exitSucceed(value3));
  }
});
var YieldableError = /* @__PURE__ */ (function() {
  class YieldableError2 extends globalThis.Error {
  }
  const proto = /* @__PURE__ */ makePrimitiveProto({
    op: "YieldableError",
    [evaluate]() {
      return exitFail(this);
    }
  });
  delete proto.toString;
  Object.assign(YieldableError2.prototype, proto);
  return YieldableError2;
})();
var Error2 = /* @__PURE__ */ (function() {
  const plainArgsSymbol = /* @__PURE__ */ Symbol.for("effect/Data/Error/plainArgs");
  return class Base extends YieldableError {
    constructor(args2) {
      super(args2?.message, args2?.cause ? {
        cause: args2.cause
      } : void 0);
      if (args2) {
        assignProperties(this, args2);
        Object.defineProperty(this, plainArgsSymbol, {
          value: args2,
          enumerable: false
        });
      }
    }
    toJSON() {
      return {
        ...this[plainArgsSymbol],
        ...this
      };
    }
  };
})();
var TaggedError = (tag2) => {
  class Base extends Error2 {
    _tag = tag2;
  }
  ;
  Base.prototype.name = tag2;
  return Base;
};
var NoSuchElementErrorTypeId = "~effect/Cause/NoSuchElementError";
var isNoSuchElementError = (u) => hasProperty(u, NoSuchElementErrorTypeId);
var NoSuchElementError = class extends (/* @__PURE__ */ TaggedError("NoSuchElementError")) {
  [NoSuchElementErrorTypeId] = NoSuchElementErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var DoneTypeId = "~effect/Cause/Done";
var isDone = (u) => hasProperty(u, DoneTypeId);
var DoneVoid = {
  [DoneTypeId]: DoneTypeId,
  _tag: "Done",
  value: void 0
};
var Done = (value3) => {
  if (value3 === void 0) return DoneVoid;
  return {
    [DoneTypeId]: DoneTypeId,
    _tag: "Done",
    value: value3
  };
};
var doneVoid = /* @__PURE__ */ exitFail(DoneVoid);
var done = (value3) => {
  if (value3 === void 0) return doneVoid;
  return exitFail(Done(value3));
};

// ../../node_modules/effect/dist/Effectable.js
var Prototype2 = (options3) => makePrimitiveProto({
  op: options3.label,
  [evaluate]: options3.evaluate
});

// ../../node_modules/effect/dist/Option.js
var Option_exports = {};
__export(Option_exports, {
  Do: () => Do,
  all: () => all,
  andThen: () => andThen,
  as: () => as,
  asVoid: () => asVoid,
  bind: () => bind2,
  bindTo: () => bindTo2,
  composeK: () => composeK,
  contains: () => contains,
  containsWith: () => containsWith,
  exists: () => exists,
  filter: () => filter,
  filterMap: () => filterMap,
  firstSomeOf: () => firstSomeOf,
  flatMap: () => flatMap,
  flatMapNullishOr: () => flatMapNullishOr,
  flatten: () => flatten,
  fromIterable: () => fromIterable,
  fromNullOr: () => fromNullOr,
  fromNullishOr: () => fromNullishOr,
  fromUndefinedOr: () => fromUndefinedOr,
  gen: () => gen,
  getFailure: () => getFailure2,
  getOrElse: () => getOrElse,
  getOrNull: () => getOrNull,
  getOrThrow: () => getOrThrow,
  getOrThrowWith: () => getOrThrowWith,
  getOrUndefined: () => getOrUndefined,
  getSuccess: () => getSuccess2,
  isNone: () => isNone2,
  isOption: () => isOption2,
  isSome: () => isSome2,
  let: () => let_2,
  lift2: () => lift2,
  liftNullishOr: () => liftNullishOr,
  liftPredicate: () => liftPredicate,
  liftThrowable: () => liftThrowable,
  makeCombinerFailFast: () => makeCombinerFailFast,
  makeEquivalence: () => makeEquivalence,
  makeOrder: () => makeOrder,
  makeReducer: () => makeReducer,
  makeReducerFailFast: () => makeReducerFailFast,
  map: () => map,
  match: () => match,
  none: () => none2,
  orElse: () => orElse,
  orElseResult: () => orElseResult,
  orElseSome: () => orElseSome,
  partitionMap: () => partitionMap,
  product: () => product,
  productMany: () => productMany,
  reduceCompact: () => reduceCompact,
  some: () => some2,
  tap: () => tap,
  toArray: () => toArray,
  toRefinement: () => toRefinement,
  void: () => void_,
  zipLeft: () => zipLeft,
  zipRight: () => zipRight,
  zipWith: () => zipWith
});

// ../../node_modules/effect/dist/Combiner.js
function make(combine3) {
  return {
    combine: combine3
  };
}

// ../../node_modules/effect/dist/Reducer.js
function make2(combine3, initialValue, combineAll) {
  return {
    combine: combine3,
    initialValue,
    combineAll: combineAll ?? ((collection) => {
      let out = initialValue;
      for (const value3 of collection) {
        out = combine3(out, value3);
      }
      return out;
    })
  };
}

// ../../node_modules/effect/dist/Equivalence.js
var make3 = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
var isStrictEquivalent = (x, y) => x === y;
var strictEqual = () => isStrictEquivalent;
function Tuple(elements) {
  return make3((self, that) => {
    if (self.length !== that.length) {
      return false;
    }
    for (let i = 0; i < self.length; i++) {
      if (!elements[i](self[i], that[i])) {
        return false;
      }
    }
    return true;
  });
}
function Array_(item) {
  return make3((self, that) => {
    if (self.length !== that.length) return false;
    for (let i = 0; i < self.length; i++) {
      if (!item(self[i], that[i])) return false;
    }
    return true;
  });
}

// ../../node_modules/effect/dist/internal/doNotation.js
var let_ = (map12) => dual(3, (self, name, f) => map12(self, (a) => ({
  ...a,
  [name]: f(a)
})));
var bindTo = (map12) => dual(2, (self, name) => map12(self, (a) => ({
  [name]: a
})));
var bind = (map12, flatMap8) => dual(3, (self, name, f) => flatMap8(self, (a) => map12(f(a), (b) => ({
  ...a,
  [name]: b
}))));

// ../../node_modules/effect/dist/internal/option.js
var TypeId = "~effect/Option";
var CommonProto = {
  [TypeId]: {
    _A: (_) => _
  },
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SomeProto = /* @__PURE__ */ Object.defineProperty(/* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "Some",
  _op: "Some",
  [symbol2](that) {
    return isOption(that) && isSome(that) && equals(this.value, that.value);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.value));
  },
  toString() {
    return `some(${format(this.value)})`;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag,
      value: toJson(this.value)
    };
  }
}), "valueOrUndefined", {
  get() {
    return this.value;
  }
});
var NoneHash = /* @__PURE__ */ hash("None");
var NoneProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto), {
  _tag: "None",
  _op: "None",
  valueOrUndefined: void 0,
  [symbol2](that) {
    return isOption(that) && isNone(that);
  },
  [symbol]() {
    return NoneHash;
  },
  toString() {
    return `none()`;
  },
  toJSON() {
    return {
      _id: "Option",
      _tag: this._tag
    };
  }
});
var isOption = (input) => hasProperty(input, TypeId);
var isNone = (fa) => fa._tag === "None";
var isSome = (fa) => fa._tag === "Some";
var none = /* @__PURE__ */ Object.create(NoneProto);
var SomeImpl = function(value3) {
  this.value = value3;
};
SomeImpl.prototype = SomeProto;
var some = (value3) => new SomeImpl(value3);

// ../../node_modules/effect/dist/internal/result.js
var TypeId2 = "~effect/Result";
var CommonProto2 = {
  [TypeId2]: {
    /* v8 ignore next 2 */
    _A: (_) => _,
    _E: (_) => _
  },
  ...PipeInspectableProto,
  [Symbol.iterator]() {
    return new SingleShotGen(this);
  }
};
var SuccessProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Success",
  _op: "Success",
  [symbol2](that) {
    return isResult(that) && isSuccess(that) && equals(this.success, that.success);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.success));
  },
  toString() {
    return `success(${format(this.success)})`;
  },
  toJSON() {
    return {
      _id: "Result",
      _tag: this._tag,
      value: toJson(this.success)
    };
  }
});
var FailureProto = /* @__PURE__ */ Object.assign(/* @__PURE__ */ Object.create(CommonProto2), {
  _tag: "Failure",
  _op: "Failure",
  [symbol2](that) {
    return isResult(that) && isFailure(that) && equals(this.failure, that.failure);
  },
  [symbol]() {
    return combine(hash(this._tag))(hash(this.failure));
  },
  toString() {
    return `failure(${format(this.failure)})`;
  },
  toJSON() {
    return {
      _id: "Result",
      _tag: this._tag,
      failure: toJson(this.failure)
    };
  }
});
var isResult = (input) => hasProperty(input, TypeId2);
var isFailure = (result3) => result3._tag === "Failure";
var isSuccess = (result3) => result3._tag === "Success";
var FailureImpl = function(failure) {
  this.failure = failure;
};
FailureImpl.prototype = FailureProto;
var fail = (failure) => new FailureImpl(failure);
var SuccessImpl = function(success) {
  this.success = success;
};
SuccessImpl.prototype = SuccessProto;
var succeed = (success) => new SuccessImpl(success);
var getFailure = (self) => isSuccess(self) ? none : some(self.failure);
var getSuccess = (self) => isFailure(self) ? none : some(self.success);

// ../../node_modules/effect/dist/Order.js
function make4(compare2) {
  return (self, that) => self === that ? 0 : compare2(self, that);
}
var String2 = /* @__PURE__ */ make4((self, that) => self < that ? -1 : 1);
var Number2 = /* @__PURE__ */ make4((self, that) => {
  if (globalThis.Number.isNaN(self) && globalThis.Number.isNaN(that)) return 0;
  if (globalThis.Number.isNaN(self)) return -1;
  if (globalThis.Number.isNaN(that)) return 1;
  return self < that ? -1 : 1;
});
var BigInt2 = /* @__PURE__ */ make4((self, that) => self < that ? -1 : 1);
var mapInput = /* @__PURE__ */ dual(2, (self, f) => make4((b1, b2) => self(f(b1), f(b2))));
var Date2 = /* @__PURE__ */ mapInput(Number2, (date) => date.getTime());
var isLessThan = (O) => dual(2, (self, that) => O(self, that) === -1);
var isGreaterThan = (O) => dual(2, (self, that) => O(self, that) === 1);
var isLessThanOrEqualTo = (O) => dual(2, (self, that) => O(self, that) !== 1);
var isGreaterThanOrEqualTo = (O) => dual(2, (self, that) => O(self, that) !== -1);
var max = (O) => dual(2, (self, that) => self === that || O(self, that) > -1 ? self : that);

// ../../node_modules/effect/dist/Option.js
var none2 = () => none;
var some2 = some;
var isOption2 = isOption;
var isNone2 = isNone;
var isSome2 = isSome;
var match = /* @__PURE__ */ dual(2, (self, {
  onNone,
  onSome
}) => isNone2(self) ? onNone() : onSome(self.value));
var toRefinement = (f) => (a) => isSome2(f(a));
var fromIterable = (collection) => {
  for (const a of collection) {
    return some2(a);
  }
  return none2();
};
var getSuccess2 = getSuccess;
var getFailure2 = getFailure;
var getOrElse = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? onNone() : self.value);
var orElse = /* @__PURE__ */ dual(2, (self, that) => isNone2(self) ? that() : self);
var orElseSome = /* @__PURE__ */ dual(2, (self, onNone) => isNone2(self) ? some2(onNone()) : self);
var orElseResult = /* @__PURE__ */ dual(2, (self, that) => isNone2(self) ? map(that(), succeed) : map(self, fail));
var firstSomeOf = (collection) => {
  let out = none2();
  for (out of collection) {
    if (isSome2(out)) {
      return out;
    }
  }
  return out;
};
var fromNullishOr = (a) => a == null ? none2() : some2(a);
var fromUndefinedOr = (a) => a === void 0 ? none2() : some2(a);
var fromNullOr = (a) => a === null ? none2() : some2(a);
var liftNullishOr = (f) => (...a) => fromNullishOr(f(...a));
var getOrNull = /* @__PURE__ */ getOrElse(constNull);
var getOrUndefined = /* @__PURE__ */ getOrElse(constUndefined);
var liftThrowable = (f) => (...a) => {
  try {
    return some2(f(...a));
  } catch {
    return none2();
  }
};
var getOrThrowWith = /* @__PURE__ */ dual(2, (self, onNone) => {
  if (isSome2(self)) {
    return self.value;
  }
  throw onNone();
});
var getOrThrow = /* @__PURE__ */ getOrThrowWith(() => new Error("getOrThrow called on a None"));
var map = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : some2(f(self.value)));
var as = /* @__PURE__ */ dual(2, (self, b) => map(self, () => b));
var asVoid = /* @__PURE__ */ as(void 0);
var void_ = /* @__PURE__ */ some2(void 0);
var flatMap = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : f(self.value));
var andThen = /* @__PURE__ */ dual(2, (self, f) => flatMap(self, (a) => {
  const b = isFunction(f) ? f(a) : f;
  return isOption2(b) ? b : some2(b);
}));
var flatMapNullishOr = /* @__PURE__ */ dual(2, (self, f) => isNone2(self) ? none2() : fromNullishOr(f(self.value)));
var flatten = /* @__PURE__ */ flatMap(identity);
var zipRight = /* @__PURE__ */ dual(2, (self, that) => flatMap(self, () => that));
var zipLeft = /* @__PURE__ */ dual(2, (self, that) => tap(self, () => that));
var composeK = /* @__PURE__ */ dual(2, (afb, bfc) => (a) => flatMap(afb(a), bfc));
var tap = /* @__PURE__ */ dual(2, (self, f) => flatMap(self, (a) => map(f(a), () => a)));
var product = /* @__PURE__ */ dual(2, (self, that) => isSome2(self) && isSome2(that) ? some2([self.value, that.value]) : none2());
var productMany = /* @__PURE__ */ dual(2, (self, collection) => {
  if (isNone2(self)) {
    return none2();
  }
  const out = [self.value];
  for (const o of collection) {
    if (isNone2(o)) {
      return none2();
    }
    out.push(o.value);
  }
  return some2(out);
});
var all = (input) => {
  if (Symbol.iterator in input) {
    const out2 = [];
    for (const o of input) {
      if (isNone2(o)) {
        return none2();
      }
      out2.push(o.value);
    }
    return some2(out2);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const o = input[key];
    if (isNone2(o)) {
      return none2();
    }
    assignProperty(out, key, o.value);
  }
  return some2(out);
};
var zipWith = /* @__PURE__ */ dual(3, (self, that, f) => map(product(self, that), ([a, b]) => f(a, b)));
var reduceCompact = /* @__PURE__ */ dual(3, (self, b, f) => {
  let out = b;
  for (const oa of self) {
    if (isSome2(oa)) {
      out = f(out, oa.value);
    }
  }
  return out;
});
var toArray = (self) => isNone2(self) ? [] : [self.value];
var partitionMap = /* @__PURE__ */ dual(2, (self, f) => {
  if (isNone2(self)) {
    return [none2(), none2()];
  }
  const e = f(self.value);
  return isFailure(e) ? [none2(), some2(e.failure)] : [some2(e.success), none2()];
});
var filterMap = /* @__PURE__ */ dual(2, (self, f) => {
  if (isNone2(self)) {
    return none2();
  }
  const next = f(self.value);
  return isSuccess(next) ? some2(next.success) : none2();
});
var filter = /* @__PURE__ */ dual(2, (self, predicate) => isNone2(self) ? none2() : predicate(self.value) ? some2(self.value) : none2());
var makeEquivalence = (isEquivalent) => make3((x, y) => isNone2(x) ? isNone2(y) : isNone2(y) ? false : isEquivalent(x.value, y.value));
var makeOrder = (O) => make4((self, that) => isSome2(self) ? isSome2(that) ? O(self.value, that.value) : 1 : -1);
var lift2 = (f) => dual(2, (self, that) => zipWith(self, that, f));
var liftPredicate = /* @__PURE__ */ dual(2, (b, predicate) => predicate(b) ? some2(b) : none2());
var containsWith = (isEquivalent) => dual(2, (self, a) => isNone2(self) ? false : isEquivalent(self.value, a));
var contains = /* @__PURE__ */ containsWith(/* @__PURE__ */ asEquivalence());
var exists = /* @__PURE__ */ dual(2, (self, refinement) => isNone2(self) ? false : refinement(self.value));
var bindTo2 = /* @__PURE__ */ bindTo(map);
var let_2 = /* @__PURE__ */ let_(map);
var bind2 = /* @__PURE__ */ bind(map, flatMap);
var Do = /* @__PURE__ */ some2({});
var gen = (...args2) => {
  const f = args2.length === 1 ? args2[0] : args2[1].bind(args2[0]);
  const iterator = f();
  let state = iterator.next();
  while (!state.done) {
    const current = state.value;
    if (isNone2(current)) {
      return current;
    }
    state = iterator.next(current.value);
  }
  return some2(state.value);
};
function makeReducer(combiner) {
  return make2((self, that) => {
    if (isNone2(self)) return that;
    if (isNone2(that)) return self;
    return some2(combiner.combine(self.value, that.value));
  }, none2());
}
function makeCombinerFailFast(combiner) {
  return make((self, that) => {
    if (isNone2(self) || isNone2(that)) return none2();
    return some2(combiner.combine(self.value, that.value));
  });
}
function makeReducerFailFast(reducer) {
  const combine3 = makeCombinerFailFast(reducer).combine;
  const initialValue = some2(reducer.initialValue);
  return make2(combine3, initialValue, (collection) => {
    let out = initialValue;
    for (const value3 of collection) {
      out = combine3(out, value3);
      if (isNone2(out)) return out;
    }
    return out;
  });
}

// ../../node_modules/effect/dist/Context.js
var ServiceTypeId = "~effect/Context/Service";
var Service = function() {
  function KeyClass() {
  }
  const self = KeyClass;
  Object.setPrototypeOf(self, ServiceProto);
  const init = (key, options3) => {
    self.key = key;
    if (options3?.defaultValue) {
      self[ReferenceTypeId] = ReferenceTypeId;
      self.defaultValue = options3.defaultValue;
    }
    if (options3?.make) {
      ;
      self.make = options3.make;
    }
    if (options3?.fiberCached) {
      cacheKeys.add(key);
    }
    return self;
  };
  return arguments.length > 0 ? init(arguments[0], arguments[1]) : init;
};
var ServiceProto = {
  [ServiceTypeId]: ServiceTypeId,
  .../* @__PURE__ */ Prototype2({
    label: "Service",
    evaluate(fiber3) {
      return exitSucceed(get(fiber3.context, this));
    }
  }),
  toJSON() {
    return {
      _id: "Service",
      key: this.key
    };
  },
  of(self) {
    return self;
  },
  context(self) {
    return make5(this, self);
  },
  use(f) {
    return withFiber((fiber3) => f(get(fiber3.context, this)));
  },
  useSync(f) {
    return withFiber((fiber3) => exitSucceed(f(get(fiber3.context, this))));
  }
};
var cacheKeys = /* @__PURE__ */ new Set();
var ReferenceTypeId = "~effect/Context/Reference";
var TypeId3 = "~effect/Context";
var MaxDepth = 8;
var FlattenAfterBaseHits = 8;
var makeImpl = (cacheRoot, base, overlay, depth) => {
  const self = Object.create(Proto);
  self.cacheRoot = cacheRoot ?? self;
  self.base = base;
  self.overlay = overlay;
  self.depth = depth;
  self._flat = void 0;
  self.baseHits = 0;
  return self;
};
var applyOverlays = (map12, overlay) => {
  if (!overlay) return;
  applyOverlays(map12, overlay.parent);
  map12.set(overlay.key, overlay.value);
};
var flatten2 = (self) => {
  if (self._flat) return self._flat;
  if (!self.overlay) return self._flat = self.base;
  const map12 = new Map(self.base);
  applyOverlays(map12, self.overlay);
  return self._flat = map12;
};
var withFlat = (self, f) => {
  const map12 = new Map(self.mapUnsafe);
  f(map12);
  return makeUnsafe(map12);
};
var notFound = /* @__PURE__ */ Symbol();
var lookup = (self, key) => {
  const impl = self;
  for (let overlay = impl.overlay; overlay; overlay = overlay.parent) {
    if (overlay.key === key) return overlay.value;
  }
  const value3 = impl.base.get(key);
  if (value3 === void 0 && !impl.base.has(key)) return notFound;
  if (impl.overlay && ++impl.baseHits >= impl.base.size && impl.baseHits >= FlattenAfterBaseHits) {
    impl.base = flatten2(impl);
    impl.overlay = void 0;
    impl.depth = 0;
  }
  return value3;
};
var makeUnsafe = (mapUnsafe) => makeImpl(void 0, mapUnsafe, void 0, 0);
var Proto = {
  get mapUnsafe() {
    return flatten2(this);
  },
  ...PipeInspectableProto,
  [TypeId3]: {
    _Services: (_) => _
  },
  toJSON() {
    return {
      _id: "Context",
      services: Array.from(this.mapUnsafe).map(([key, value3]) => ({
        key,
        value: value3
      }))
    };
  },
  [symbol2](that) {
    if (!isContext(that)) return false;
    const self = this.mapUnsafe;
    const other = that.mapUnsafe;
    if (self.size !== other.size) return false;
    for (const [key, value3] of self) {
      if (!other.has(key) || !equals(value3, other.get(key))) return false;
    }
    return true;
  },
  [symbol]() {
    return number(this.mapUnsafe.size);
  }
};
var hasSameCache = (self, that) => self.cacheRoot === that.cacheRoot;
var isContext = (u) => hasProperty(u, TypeId3);
var isReference = (u) => !!u[ReferenceTypeId];
var empty = () => emptyContext2;
var emptyContext2 = /* @__PURE__ */ makeUnsafe(/* @__PURE__ */ new Map());
var make5 = (key, service3) => makeUnsafe(/* @__PURE__ */ new Map([[key.key, service3]]));
var add = /* @__PURE__ */ dual(3, (self, key, service3) => addUnsafe(self, key.key, service3));
var addUnsafe = (self, key, service3) => {
  const impl = self;
  const cacheRoot = cacheKeys.has(key) ? void 0 : impl.cacheRoot;
  if (impl.depth >= MaxDepth) {
    const map12 = new Map(impl.mapUnsafe);
    map12.set(key, service3);
    return makeImpl(cacheRoot, map12, void 0, 0);
  }
  return makeImpl(cacheRoot, impl.base, {
    key,
    value: service3,
    parent: impl.overlay
  }, impl.depth + 1);
};
var getOrUndefined2 = /* @__PURE__ */ dual(2, (self, key) => getOrUndefinedUnsafe(self, key.key));
var getOrUndefinedUnsafe = (self, key) => {
  const value3 = lookup(self, key);
  return value3 === notFound ? void 0 : value3;
};
var getUnsafe = /* @__PURE__ */ dual(2, (self, service3) => {
  const value3 = lookup(self, service3.key);
  if (value3 === notFound) {
    if (isReference(service3)) return getDefaultValue(service3);
    throw serviceNotFoundError(service3);
  }
  return value3;
});
var get = getUnsafe;
var defaultValueCacheKey = "~effect/Context/defaultValue";
var getDefaultValue = (ref) => {
  if (defaultValueCacheKey in ref) {
    return ref[defaultValueCacheKey];
  }
  return ref[defaultValueCacheKey] = ref.defaultValue();
};
var serviceNotFoundError = (service3) => {
  const error = new Error(`Service not found${service3.key ? `: ${String(service3.key)}` : ""}`);
  if (error.stack) {
    const lines = error.stack.split("\n");
    lines.splice(1, 3);
    error.stack = lines.join("\n");
  }
  return error;
};
var getOption = /* @__PURE__ */ dual(2, (self, service3) => {
  const value3 = lookup(self, service3.key);
  if (value3 !== notFound) return some2(value3);
  return isReference(service3) ? some2(getDefaultValue(service3)) : none2();
});
var merge = /* @__PURE__ */ dual(2, (self, that) => {
  if (self.mapUnsafe.size === 0) return that;
  if (that.mapUnsafe.size === 0) return self;
  return withFlat(self, (map12) => that.mapUnsafe.forEach((value3, key) => map12.set(key, value3)));
});
var mergeAll = (...ctxs) => {
  const map12 = /* @__PURE__ */ new Map();
  for (let i = 0; i < ctxs.length; i++) {
    ctxs[i].mapUnsafe.forEach((value3, key) => {
      map12.set(key, value3);
    });
  }
  return makeUnsafe(map12);
};
var Reference = Service;

// ../../node_modules/effect/dist/internal/array.js
var isArrayNonEmpty = (self) => self.length > 0;

// ../../node_modules/effect/dist/internal/count.js
var normalize = (n) => n > 0 ? Math.floor(n) : 0;

// ../../node_modules/effect/dist/Result.js
var succeed2 = succeed;
var fail2 = fail;
var try_ = (evaluate2) => {
  if (isFunction(evaluate2)) {
    try {
      return succeed2(evaluate2());
    } catch (e) {
      return fail2(e);
    }
  } else {
    try {
      return succeed2(evaluate2.try());
    } catch (e) {
      return fail2(evaluate2.catch(e));
    }
  }
};
var isResult2 = isResult;
var isFailure2 = isFailure;
var isSuccess2 = isSuccess;
var mapError = /* @__PURE__ */ dual(2, (self, f) => isFailure2(self) ? fail2(f(self.failure)) : self);
var map2 = /* @__PURE__ */ dual(2, (self, f) => isSuccess2(self) ? succeed2(f(self.success)) : self);
var match2 = /* @__PURE__ */ dual(2, (self, {
  onFailure,
  onSuccess
}) => isFailure2(self) ? onFailure(self.failure) : onSuccess(self.success));
var getOrElse2 = /* @__PURE__ */ dual(2, (self, onFailure) => isFailure2(self) ? onFailure(self.failure) : self.success);
var getOrThrowWith2 = /* @__PURE__ */ dual(2, (self, onFailure) => {
  if (isSuccess2(self)) {
    return self.success;
  }
  throw onFailure(self.failure);
});
var getOrThrow2 = /* @__PURE__ */ getOrThrowWith2(identity);
var flatMap2 = /* @__PURE__ */ dual(2, (self, f) => isFailure2(self) ? fail2(self.failure) : f(self.success));
var all2 = (input) => {
  if (Symbol.iterator in input) {
    const out2 = [];
    for (const e of input) {
      if (isFailure2(e)) {
        return e;
      }
      out2.push(e.success);
    }
    return succeed2(out2);
  }
  const out = {};
  for (const key of Object.keys(input)) {
    const e = input[key];
    if (isFailure2(e)) {
      return e;
    }
    assignProperty(out, key, e.success);
  }
  return succeed2(out);
};

// ../../node_modules/effect/dist/Tuple.js
var makeEquivalence2 = Tuple;

// ../../node_modules/effect/dist/Iterable.js
var findFirst = /* @__PURE__ */ dual(2, (self, f) => {
  let i = 0;
  for (const a of self) {
    const o = f(a, i);
    if (isBoolean(o)) {
      if (o) {
        return some2(a);
      }
    } else {
      if (isSome2(o)) {
        return o;
      }
    }
    i++;
  }
  return none2();
});
var filter2 = /* @__PURE__ */ dual(2, (self, predicate) => ({
  [Symbol.iterator]() {
    const iterator = self[Symbol.iterator]();
    let i = 0;
    return {
      next() {
        let result3 = iterator.next();
        while (!result3.done) {
          if (predicate(result3.value, i++)) {
            return {
              done: false,
              value: result3.value
            };
          }
          result3 = iterator.next();
        }
        return {
          done: true,
          value: void 0
        };
      }
    };
  }
}));

// ../../node_modules/effect/dist/Record.js
var isEmptyRecord = (self) => Object.keys(self).length === 0;
var has = /* @__PURE__ */ dual(2, (self, key) => Object.hasOwn(self, key));
var map3 = /* @__PURE__ */ dual(2, (self, f) => {
  const out = {
    ...self
  };
  for (const key of keys(self)) {
    assignProperty(out, key, f(self[key], key));
  }
  return out;
});
var keys = (self) => Object.keys(self);
var isSubrecordBy = (equivalence) => dual(2, (self, that) => {
  for (const key of keys(self)) {
    if (!has(that, key) || !equivalence(self[key], that[key])) {
      return false;
    }
  }
  return true;
});
var makeEquivalence3 = (equivalence) => {
  const is3 = isSubrecordBy(equivalence);
  return (self, that) => is3(self, that) && is3(that, self);
};

// ../../node_modules/effect/dist/Array.js
var Array2 = globalThis.Array;
var fromIterable2 = (collection) => Array2.isArray(collection) ? collection : Array2.from(collection);
var append = /* @__PURE__ */ dual(2, (self, last) => [...self, last]);
var appendAll = /* @__PURE__ */ dual(2, (self, that) => fromIterable2(self).concat(fromIterable2(that)));
var isArray = Array2.isArray;
var isArrayNonEmpty2 = isArrayNonEmpty;
var isReadonlyArrayNonEmpty = isArrayNonEmpty;
function isCanonicalArrayIndex(key) {
  const index2 = Number(key);
  return String(index2) === key && Number.isInteger(index2) && index2 >= 0 && index2 < 2 ** 32 - 1;
}
var findFirst2 = findFirst;
var hashBucketsAdd = (buckets, value3) => {
  const hash2 = hash(value3);
  const bucket = buckets.get(hash2);
  if (bucket === void 0) {
    buckets.set(hash2, [value3]);
    return true;
  }
  for (const previous of bucket) {
    if (equals(previous, value3)) {
      return false;
    }
  }
  bucket.push(value3);
  return true;
};
var empty2 = () => [];
var of = (a) => [a];
var map4 = /* @__PURE__ */ dual(2, (self, f) => self.map(f));
var filter3 = /* @__PURE__ */ dual(2, (self, predicate) => {
  const as4 = fromIterable2(self);
  const out = [];
  for (let i = 0; i < as4.length; i++) {
    if (predicate(as4[i], i)) {
      out.push(as4[i]);
    }
  }
  return out;
});
var partition = /* @__PURE__ */ dual(2, (self, f) => {
  const passes = [];
  const fails = [];
  let i = 0;
  for (const a of self) {
    const result3 = f(a, i++);
    if (isSuccess2(result3)) {
      passes.push(result3.success);
    } else {
      fails.push(result3.failure);
    }
  }
  return [passes, fails];
});
var makeEquivalence4 = Array_;
var dedupe = (self) => {
  const input = fromIterable2(self);
  if (input.length < 2) {
    return [...input];
  }
  const buckets = /* @__PURE__ */ new Map();
  const out = [];
  for (const value3 of input) {
    if (hashBucketsAdd(buckets, value3)) {
      out.push(value3);
    }
  }
  return out;
};

// ../../node_modules/effect/dist/Duration.js
var TypeId4 = "~effect/Duration";
var bigint0 = /* @__PURE__ */ BigInt(0);
var bigint1 = /* @__PURE__ */ BigInt(1);
var bigint2 = /* @__PURE__ */ BigInt(2);
var bigint10 = /* @__PURE__ */ BigInt(10);
var bigint24 = /* @__PURE__ */ BigInt(24);
var bigint60 = /* @__PURE__ */ BigInt(60);
var bigint1e3 = /* @__PURE__ */ BigInt(1e3);
var bigint1e6 = /* @__PURE__ */ BigInt(1e6);
var roundTiesAwayFromZero = (input) => BigInt(input < 0 ? Math.ceil(input - 0.5) : Math.floor(input + 0.5));
var roundMillisToNanos = (millis2) => roundTiesAwayFromZero(millis2 * 1e6);
var parseNanos = (input, scale) => {
  const decimalIndex = input.indexOf(".");
  if (decimalIndex === -1) return BigInt(input) * scale;
  const isNegative2 = input[0] === "-";
  const fractional = input.slice(decimalIndex + 1);
  const fractionalScale = bigint10 ** BigInt(fractional.length);
  const scaled = (BigInt(input.slice(isNegative2 ? 1 : 0, decimalIndex)) * fractionalScale + BigInt(fractional)) * scale;
  const rounded = scaled / fractionalScale + (scaled % fractionalScale * bigint2 >= fractionalScale ? bigint1 : bigint0);
  return isNegative2 ? -rounded : rounded;
};
var DURATION_REGEXP = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
var fromInputUnsafe = (input) => {
  switch (typeof input) {
    case "number":
      return millis(input);
    case "bigint":
      return nanos(input);
    case "string": {
      if (input === "Infinity") {
        return infinity;
      }
      if (input === "-Infinity") {
        return negativeInfinity;
      }
      const match7 = DURATION_REGEXP.exec(input);
      if (!match7) break;
      const [_, valueStr, unit] = match7;
      if (unit === "nano" || unit === "nanos") {
        return nanos(parseNanos(valueStr, bigint1));
      }
      if (unit === "micro" || unit === "micros") {
        return nanos(parseNanos(valueStr, bigint1e3));
      }
      const value3 = Number(valueStr);
      switch (unit) {
        case "milli":
        case "millis":
          return millis(value3);
        case "second":
        case "seconds":
          return seconds(value3);
        case "minute":
        case "minutes":
          return minutes(value3);
        case "hour":
        case "hours":
          return hours(value3);
        case "day":
        case "days":
          return days(value3);
        case "week":
        case "weeks":
          return weeks(value3);
      }
      break;
    }
    case "object": {
      if (input === null) break;
      if (TypeId4 in input) return input;
      if (Array.isArray(input)) {
        if (input.length !== 2 || !input.every(isNumber)) {
          return invalid(input);
        }
        if (Number.isNaN(input[0]) || Number.isNaN(input[1])) {
          return zero;
        }
        if (input[0] === -Infinity || input[1] === -Infinity) {
          return negativeInfinity;
        }
        if (input[0] === Infinity || input[1] === Infinity) {
          return infinity;
        }
        return make6(roundTiesAwayFromZero(input[0] * 1e9 + input[1]));
      }
      const obj = input;
      let millis2 = 0;
      if (obj.weeks) millis2 += obj.weeks * 6048e5;
      if (obj.days) millis2 += obj.days * 864e5;
      if (obj.hours) millis2 += obj.hours * 36e5;
      if (obj.minutes) millis2 += obj.minutes * 6e4;
      if (obj.seconds) millis2 += obj.seconds * 1e3;
      if (obj.milliseconds) millis2 += obj.milliseconds;
      if (!obj.microseconds && !obj.nanoseconds) return make6(millis2);
      return make6(roundTiesAwayFromZero(millis2 * 1e6 + (obj.microseconds ?? 0) * 1e3 + (obj.nanoseconds ?? 0)));
    }
  }
  return invalid(input);
};
var invalid = (input) => {
  throw new Error(`Invalid Input: ${input}`);
};
var fromInput = /* @__PURE__ */ liftThrowable(fromInputUnsafe);
var zeroDurationValue = {
  _tag: "Millis",
  millis: 0
};
var infinityDurationValue = {
  _tag: "Infinity"
};
var negativeInfinityDurationValue = {
  _tag: "NegativeInfinity"
};
var DurationProto = {
  [TypeId4]: TypeId4,
  [symbol]() {
    switch (this.value._tag) {
      case "Millis": {
        const nanos2 = this.value.millis * 1e6;
        return Number.isFinite(nanos2) ? hash(roundTiesAwayFromZero(nanos2)) : number(this.value.millis);
      }
      case "Nanos":
        return hash(this.value.nanos);
      default:
        return structure(this.value);
    }
  },
  [symbol2](that) {
    return isDuration(that) && equals2(this, that);
  },
  toString() {
    switch (this.value._tag) {
      case "Infinity":
        return "Infinity";
      case "NegativeInfinity":
        return "-Infinity";
      case "Nanos":
        return `${this.value.nanos} nanos`;
      case "Millis":
        return `${this.value.millis} millis`;
    }
  },
  toJSON() {
    switch (this.value._tag) {
      case "Millis":
        return {
          _id: "Duration",
          _tag: "Millis",
          millis: this.value.millis
        };
      case "Nanos":
        return {
          _id: "Duration",
          _tag: "Nanos",
          nanos: String(this.value.nanos)
        };
      case "Infinity":
        return {
          _id: "Duration",
          _tag: "Infinity"
        };
      case "NegativeInfinity":
        return {
          _id: "Duration",
          _tag: "NegativeInfinity"
        };
    }
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make6 = (input) => {
  const duration = Object.create(DurationProto);
  if (typeof input === "number") {
    if (isNaN(input) || input === 0 || Object.is(input, -0)) {
      duration.value = zeroDurationValue;
    } else if (!Number.isFinite(input)) {
      duration.value = input > 0 ? infinityDurationValue : negativeInfinityDurationValue;
    } else if (!Number.isInteger(input)) {
      duration.value = {
        _tag: "Nanos",
        nanos: roundMillisToNanos(input)
      };
    } else {
      duration.value = {
        _tag: "Millis",
        millis: input
      };
    }
  } else if (input === bigint0) {
    duration.value = zeroDurationValue;
  } else {
    duration.value = {
      _tag: "Nanos",
      nanos: input
    };
  }
  return duration;
};
var isDuration = (u) => hasProperty(u, TypeId4);
var isFinite = (self) => self.value._tag !== "Infinity" && self.value._tag !== "NegativeInfinity";
var isZero = (self) => {
  switch (self.value._tag) {
    case "Millis":
      return self.value.millis === 0;
    case "Nanos":
      return self.value.nanos === bigint0;
    case "Infinity":
    case "NegativeInfinity":
      return false;
  }
};
var isNegative = (self) => {
  switch (self.value._tag) {
    case "Millis":
      return self.value.millis < 0;
    case "Nanos":
      return self.value.nanos < bigint0;
    case "NegativeInfinity":
      return true;
    case "Infinity":
      return false;
  }
};
var abs = (self) => {
  switch (self.value._tag) {
    case "Infinity":
    case "NegativeInfinity":
      return infinity;
    case "Millis":
      return self.value.millis < 0 ? make6(-self.value.millis) : self;
    case "Nanos":
      return self.value.nanos < bigint0 ? make6(-self.value.nanos) : self;
  }
};
var zero = /* @__PURE__ */ make6(0);
var infinity = /* @__PURE__ */ make6(Infinity);
var negativeInfinity = /* @__PURE__ */ make6(-Infinity);
var nanos = (nanos2) => make6(nanos2);
var millis = (millis2) => make6(millis2);
var seconds = (seconds2) => make6(seconds2 * 1e3);
var minutes = (minutes2) => make6(minutes2 * 6e4);
var hours = (hours2) => make6(hours2 * 36e5);
var days = (days2) => make6(days2 * 864e5);
var weeks = (weeks2) => make6(weeks2 * 6048e5);
var toMillis = (self) => match3(fromInputUnsafe(self), {
  onMillis: identity,
  onNanos: (nanos2) => Number(nanos2) / 1e6,
  onInfinity: () => Infinity,
  onNegativeInfinity: () => -Infinity
});
var toSeconds = (self) => match3(fromInputUnsafe(self), {
  onMillis: (millis2) => millis2 / 1e3,
  onNanos: (nanos2) => Number(nanos2) / 1e9,
  onInfinity: () => Infinity,
  onNegativeInfinity: () => -Infinity
});
var toNanosUnsafe = (input) => {
  const self = fromInputUnsafe(input);
  switch (self.value._tag) {
    case "Infinity":
    case "NegativeInfinity":
      throw new Error("Cannot convert infinite duration to nanos");
    case "Nanos":
      return self.value.nanos;
    case "Millis":
      return roundMillisToNanos(self.value.millis);
  }
};
var toNanos = /* @__PURE__ */ liftThrowable(toNanosUnsafe);
var match3 = /* @__PURE__ */ dual(2, (self, options3) => {
  switch (self.value._tag) {
    case "Millis":
      return options3.onMillis(self.value.millis);
    case "Nanos":
      return options3.onNanos(self.value.nanos);
    case "Infinity":
      return options3.onInfinity();
    case "NegativeInfinity":
      return (options3.onNegativeInfinity ?? options3.onInfinity)();
  }
});
var matchPair = /* @__PURE__ */ dual(3, (self, that, options3) => {
  if (self.value._tag === "Infinity" || self.value._tag === "NegativeInfinity" || that.value._tag === "Infinity" || that.value._tag === "NegativeInfinity") return options3.onInfinity(self, that);
  if (self.value._tag === "Millis") {
    return that.value._tag === "Millis" ? options3.onMillis(self.value.millis, that.value.millis) : options3.onNanos(toNanosUnsafe(self), that.value.nanos);
  } else {
    return options3.onNanos(self.value.nanos, toNanosUnsafe(that));
  }
});
var Order = /* @__PURE__ */ make4((self, that) => matchPair(self, that, {
  onMillis: (self2, that2) => self2 < that2 ? -1 : self2 > that2 ? 1 : 0,
  onNanos: (self2, that2) => self2 < that2 ? -1 : self2 > that2 ? 1 : 0,
  onInfinity: (self2, that2) => {
    if (self2.value._tag === that2.value._tag) return 0;
    if (self2.value._tag === "Infinity") return 1;
    if (self2.value._tag === "NegativeInfinity") return -1;
    if (that2.value._tag === "Infinity") return -1;
    return 1;
  }
}));
var Equivalence = (self, that) => matchPair(self, that, {
  onMillis: (self2, that2) => self2 === that2,
  onNanos: (self2, that2) => self2 === that2,
  onInfinity: (self2, that2) => self2.value._tag === that2.value._tag
});
var max2 = /* @__PURE__ */ max(Order);
var subtract = /* @__PURE__ */ dual(2, (self, that) => matchPair(self, that, {
  onMillis: (self2, that2) => make6(self2 - that2),
  onNanos: (self2, that2) => make6(self2 - that2),
  onInfinity: (self2, that2) => {
    const s = self2.value._tag;
    const t = that2.value._tag;
    if (s === "Infinity") return t === "Infinity" ? zero : infinity;
    if (s === "NegativeInfinity") return t === "NegativeInfinity" ? zero : negativeInfinity;
    return t === "Infinity" ? negativeInfinity : infinity;
  }
}));
var equals2 = /* @__PURE__ */ dual(2, (self, that) => Equivalence(self, that));
var parts = (self) => {
  if (self.value._tag === "Infinity") {
    return {
      days: Infinity,
      hours: Infinity,
      minutes: Infinity,
      seconds: Infinity,
      millis: Infinity,
      nanos: Infinity
    };
  }
  if (self.value._tag === "NegativeInfinity") {
    return {
      days: -Infinity,
      hours: -Infinity,
      minutes: -Infinity,
      seconds: -Infinity,
      millis: -Infinity,
      nanos: -Infinity
    };
  }
  const n = toNanosUnsafe(self);
  const neg = n < bigint0;
  const a = neg ? -n : n;
  const ms = a / bigint1e6;
  const sec = ms / bigint1e3;
  const min5 = sec / bigint60;
  const hr = min5 / bigint60;
  const d = hr / bigint24;
  const sign2 = neg ? -1 : 1;
  return {
    days: sign2 * Number(d),
    hours: sign2 * Number(hr % bigint24),
    minutes: sign2 * Number(min5 % bigint60),
    seconds: sign2 * Number(sec % bigint60),
    millis: sign2 * Number(ms % bigint1e3),
    nanos: sign2 * Number(a % bigint1e6)
  };
};
var format2 = (self) => {
  if (self.value._tag === "Infinity") {
    return "Infinity";
  }
  if (self.value._tag === "NegativeInfinity") {
    return "-Infinity";
  }
  if (isZero(self)) {
    return "0";
  }
  if (isNegative(self)) {
    return "-" + format2(abs(self));
  }
  const fragments = parts(self);
  const pieces = [];
  if (fragments.days !== 0) {
    pieces.push(`${fragments.days}d`);
  }
  if (fragments.hours !== 0) {
    pieces.push(`${fragments.hours}h`);
  }
  if (fragments.minutes !== 0) {
    pieces.push(`${fragments.minutes}m`);
  }
  if (fragments.seconds !== 0) {
    pieces.push(`${fragments.seconds}s`);
  }
  if (fragments.millis !== 0) {
    pieces.push(`${fragments.millis}ms`);
  }
  if (fragments.nanos !== 0) {
    pieces.push(`${fragments.nanos}ns`);
  }
  return pieces.join(" ");
};

// ../../node_modules/effect/dist/Scheduler.js
var Scheduler = /* @__PURE__ */ Reference("effect/Scheduler", {
  fiberCached: true,
  defaultValue: () => new MixedScheduler()
});
var setMicrotask = (f) => {
  let cancelled = false;
  Promise.resolve().then(() => {
    if (!cancelled) f();
  });
  return () => {
    cancelled = true;
  };
};
var setTimer = "setImmediate" in globalThis ? (f) => {
  const timer = globalThis.setImmediate(f);
  return () => globalThis.clearImmediate(timer);
} : (f) => {
  const timer = setTimeout(f, 0);
  return () => clearTimeout(timer);
};
var setImmediate = (f) => {
  try {
    return setTimer(f);
  } catch {
    return setMicrotask(f);
  }
};
var PriorityBuckets = class {
  buckets = [];
  scheduleTask(task, priority) {
    const buckets = this.buckets;
    const len = buckets.length;
    let bucket;
    let index2 = 0;
    for (; index2 < len; index2++) {
      if (buckets[index2][0] > priority) break;
      bucket = buckets[index2];
    }
    if (bucket && bucket[0] === priority) {
      bucket[1].push(task);
    } else if (index2 === len) {
      buckets.push([priority, [task]]);
    } else {
      buckets.splice(index2, 0, [priority, [task]]);
    }
  }
  drain() {
    const buckets = this.buckets;
    this.buckets = [];
    return buckets;
  }
};
var MixedScheduler = class {
  executionMode;
  setImmediate;
  constructor(executionMode = "async", setImmediateFn) {
    this.executionMode = executionMode;
    this.setImmediate = setImmediateFn ?? (executionMode === "sync" ? setMicrotask : setImmediate);
  }
  /**
   * Returns whether the fiber has reached its operation budget and should yield.
   *
   * **When to use**
   *
   * Use to decide whether a fiber should yield after consuming its current
   * operation budget.
   *
   * @since 2.0.0
   */
  shouldYield(fiber3) {
    return fiber3.currentOpCount >= fiber3.cache.maxOpsBeforeYield;
  }
  /**
   * Creates a dispatcher that schedules work through this scheduler.
   *
   * **When to use**
   *
   * Use when you need a standalone dispatcher from a scheduler instance, for
   * example in tests that enqueue tasks and then flush them deterministically.
   *
   * @since 4.0.0
   */
  makeDispatcher() {
    return new MixedSchedulerDispatcher(this.setImmediate);
  }
};
var MixedSchedulerDispatcher = class {
  tasks = /* @__PURE__ */ new PriorityBuckets();
  running = void 0;
  setImmediate;
  constructor(setImmediateFn = setImmediate) {
    this.setImmediate = setImmediateFn;
  }
  /**
   * @since 2.0.0
   */
  scheduleTask(task, priority) {
    this.tasks.scheduleTask(task, priority);
    if (this.running === void 0) {
      this.running = this.setImmediate(this.afterScheduled);
    }
  }
  /**
   * @since 2.0.0
   */
  afterScheduled = () => {
    this.running = void 0;
    this.runTasks();
  };
  /**
   * @since 2.0.0
   */
  runTasks() {
    const buckets = this.tasks.drain();
    for (let i = 0; i < buckets.length; i++) {
      const toRun = buckets[i][1];
      for (let j = 0; j < toRun.length; j++) {
        toRun[j]();
      }
    }
  }
  /**
   * @since 2.0.0
   */
  flush() {
    while (this.tasks.buckets.length > 0) {
      if (this.running !== void 0) {
        this.running();
        this.running = void 0;
      }
      this.runTasks();
    }
  }
};
var MaxOpsBeforeYield = /* @__PURE__ */ Reference("effect/Scheduler/MaxOpsBeforeYield", {
  fiberCached: true,
  defaultValue: () => 2048
});
var PreventSchedulerYield = /* @__PURE__ */ Reference("effect/Scheduler/PreventSchedulerYield", {
  fiberCached: true,
  defaultValue: () => false
});

// ../../node_modules/effect/dist/Data.js
var Class3 = class extends Class {
  constructor(props) {
    super();
    if (props) {
      assignProperties(this, props);
    }
  }
};
var Error3 = Error2;
var TaggedError2 = TaggedError;

// ../../node_modules/effect/dist/encoding/EncodingError.js
var EncodingErrorTypeId = "~effect/encoding/EncodingError";
var EncodingError = class extends (/* @__PURE__ */ TaggedError2("EncodingError")) {
  /**
   * Marks this value as an encoding or decoding error for runtime guards.
   *
   * **When to use**
   *
   * Use to identify `EncodingError` instances through `isEncodingError`.
   *
   * @since 4.0.0
   */
  [EncodingErrorTypeId] = EncodingErrorTypeId;
};

// ../../node_modules/effect/dist/encoding/Hex.js
var encode = (input) => typeof input === "string" ? hexEncodeUint8Array(encoder.encode(input)) : hexEncodeUint8Array(input);
var random2 = (length) => {
  switch (length) {
    case 16:
      return random16();
    case 32:
      return random32();
    default: {
      let result3 = "";
      for (let i = length >>> 3; i > 0; i--) {
        result3 += random8();
      }
      return result3;
    }
  }
};
var hexCharCodes = /* @__PURE__ */ Uint8Array.from("0123456789abcdef", (c) => c.charCodeAt(0));
var randomWord = () => Math.random() * 4294967296 >>> 0;
var random8 = () => {
  const a = randomWord();
  return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15]);
};
var random16 = () => {
  const a = randomWord();
  const b = randomWord();
  return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15], hexCharCodes[b >>> 28], hexCharCodes[b >>> 24 & 15], hexCharCodes[b >>> 20 & 15], hexCharCodes[b >>> 16 & 15], hexCharCodes[b >>> 12 & 15], hexCharCodes[b >>> 8 & 15], hexCharCodes[b >>> 4 & 15], hexCharCodes[b & 15]);
};
var random32 = () => {
  const a = randomWord();
  const b = randomWord();
  const c = randomWord();
  const d = randomWord();
  return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15], hexCharCodes[b >>> 28], hexCharCodes[b >>> 24 & 15], hexCharCodes[b >>> 20 & 15], hexCharCodes[b >>> 16 & 15], hexCharCodes[b >>> 12 & 15], hexCharCodes[b >>> 8 & 15], hexCharCodes[b >>> 4 & 15], hexCharCodes[b & 15], hexCharCodes[c >>> 28], hexCharCodes[c >>> 24 & 15], hexCharCodes[c >>> 20 & 15], hexCharCodes[c >>> 16 & 15], hexCharCodes[c >>> 12 & 15], hexCharCodes[c >>> 8 & 15], hexCharCodes[c >>> 4 & 15], hexCharCodes[c & 15], hexCharCodes[d >>> 28], hexCharCodes[d >>> 24 & 15], hexCharCodes[d >>> 20 & 15], hexCharCodes[d >>> 16 & 15], hexCharCodes[d >>> 12 & 15], hexCharCodes[d >>> 8 & 15], hexCharCodes[d >>> 4 & 15], hexCharCodes[d & 15]);
};
var decode = (str) => {
  const bytes2 = new TextEncoder().encode(str);
  if (bytes2.length % 2 !== 0) {
    return fail2(new EncodingError({
      module: "Hex",
      kind: "Decode",
      input: str,
      message: `Length must be a multiple of 2, but is ${bytes2.length}`
    }));
  }
  try {
    const length = bytes2.length / 2;
    const result3 = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      const a = fromHexChar(bytes2[i * 2]);
      const b = fromHexChar(bytes2[i * 2 + 1]);
      result3[i] = a << 4 | b;
    }
    return succeed2(result3);
  } catch (e) {
    return fail2(new EncodingError({
      module: "Hex",
      kind: "Decode",
      input: str,
      message: e instanceof Error ? e.message : "Invalid input"
    }));
  }
};
var decodeString = (str) => map2(decode(str), (_) => decoder.decode(_));
var encoder = /* @__PURE__ */ new TextEncoder();
var decoder = /* @__PURE__ */ new TextDecoder();
var byteToHex = /* @__PURE__ */ Array.from({
  length: 256
}, (_, i) => i.toString(16).padStart(2, "0"));
var hexEncodeUint8Array = (bytes2) => {
  let result3 = "";
  for (let i = 0; i < bytes2.length; i++) {
    result3 += byteToHex[bytes2[i]];
  }
  return result3;
};
var fromHexChar = (byte) => {
  if (48 <= byte && byte <= 57) {
    return byte - 48;
  }
  if (97 <= byte && byte <= 102) {
    return byte - 97 + 10;
  }
  if (65 <= byte && byte <= 70) {
    return byte - 65 + 10;
  }
  throw new TypeError("Invalid input");
};

// ../../node_modules/effect/dist/Tracer.js
var ParentSpanKey = "effect/Tracer/ParentSpan";
var ParentSpan = class extends (/* @__PURE__ */ Service()(ParentSpanKey, {
  fiberCached: true
})) {
};
var make7 = (options3) => options3;
var DisablePropagation = /* @__PURE__ */ Reference("effect/Tracer/DisablePropagation", {
  defaultValue: constFalse
});
var CurrentTraceLevel = /* @__PURE__ */ Reference("effect/Tracer/CurrentTraceLevel", {
  defaultValue: () => "Info"
});
var MinimumTraceLevel = /* @__PURE__ */ Reference("effect/Tracer/MinimumTraceLevel", {
  defaultValue: () => "All"
});
var TracerKey = "effect/Tracer";
var Tracer = /* @__PURE__ */ Reference(TracerKey, {
  fiberCached: true,
  defaultValue: () => nativeTracer
});
var nativeTracer = /* @__PURE__ */ make7({
  span: (options3) => new NativeSpan(options3)
});
var NativeSpan = class {
  _tag = "Span";
  sampled;
  name;
  parent;
  annotations;
  links;
  startTime;
  kind;
  status;
  _traceId = void 0;
  _spanId = void 0;
  _attributes = void 0;
  _events = void 0;
  constructor(options3) {
    this.name = options3.name;
    this.parent = options3.parent;
    this.annotations = options3.annotations;
    this.links = options3.links;
    this.startTime = options3.startTime;
    this.kind = options3.kind;
    this.sampled = options3.sampled;
    this.status = {
      _tag: "Started",
      startTime: options3.startTime
    };
  }
  get traceId() {
    return this._traceId ??= getOrUndefined(this.parent)?.traceId ?? random2(32);
  }
  get spanId() {
    return this._spanId ??= random2(16);
  }
  get attributes() {
    return this._attributes ??= /* @__PURE__ */ new Map();
  }
  get events() {
    return this._events ??= [];
  }
  end(endTime, exit3) {
    this.status = {
      _tag: "Ended",
      endTime,
      exit: exit3,
      startTime: this.status.startTime
    };
  }
  attribute(key, value3) {
    this.attributes.set(key, value3);
  }
  event(name, startTime, attributes) {
    this.events.push([name, startTime, attributes ?? {}]);
  }
  addLinks(links) {
    this.links.push(...links);
  }
};

// ../../node_modules/effect/dist/internal/metric.js
var FiberRuntimeMetricsKey = "effect/Metric/FiberRuntimeMetrics";

// ../../node_modules/effect/dist/internal/references.js
var CurrentErrorReporters = /* @__PURE__ */ Reference("effect/ErrorReporter/CurrentErrorReporters", {
  defaultValue: () => /* @__PURE__ */ new Set()
});
var CurrentStackFrame = /* @__PURE__ */ Reference("effect/References/CurrentStackFrame", {
  fiberCached: true,
  defaultValue: constUndefined
});
var TracerEnabled = /* @__PURE__ */ Reference("effect/References/TracerEnabled", {
  fiberCached: true,
  defaultValue: constTrue
});
var TracerTimingEnabled = /* @__PURE__ */ Reference("effect/References/TracerTimingEnabled", {
  defaultValue: constTrue
});
var TracerSpanAnnotations = /* @__PURE__ */ Reference("effect/References/TracerSpanAnnotations", {
  defaultValue: () => ({})
});
var TracerSpanLinks = /* @__PURE__ */ Reference("effect/References/TracerSpanLinks", {
  defaultValue: () => []
});
var CurrentLogAnnotations = /* @__PURE__ */ Reference("effect/References/CurrentLogAnnotations", {
  defaultValue: () => ({})
});
var CurrentLogLevel = /* @__PURE__ */ Reference("effect/References/CurrentLogLevel", {
  fiberCached: true,
  defaultValue: () => "Info"
});
var MinimumLogLevel = /* @__PURE__ */ Reference("effect/References/MinimumLogLevel", {
  fiberCached: true,
  defaultValue: () => "Info"
});
var CurrentLogSpans = /* @__PURE__ */ Reference("effect/References/CurrentLogSpans", {
  defaultValue: () => []
});

// ../../node_modules/effect/dist/internal/tracer.js
var addSpanStackTrace = (options3) => {
  if (options3?.captureStackTrace === false) {
    return options3;
  } else if (options3?.captureStackTrace !== void 0 && typeof options3.captureStackTrace !== "boolean") {
    return options3;
  }
  const limit = getStackTraceLimit();
  if (limit === 0 && options3?.captureStackTrace !== true) {
    return {
      ...options3,
      captureStackTrace: false
    };
  }
  setStackTraceLimit(3);
  const traceError = new Error();
  setStackTraceLimit(limit);
  return {
    ...options3,
    captureStackTrace: spanCleaner(() => traceError.stack)
  };
};
var makeStackCleaner = (line) => (stack) => {
  let cache2;
  return () => {
    if (cache2 !== void 0) return cache2;
    const trace2 = stack();
    if (!trace2) return void 0;
    const lines = trace2.split("\n");
    if (lines[line] !== void 0) {
      cache2 = lines[line].trim();
      return cache2;
    }
  };
};
var spanCleaner = /* @__PURE__ */ makeStackCleaner(3);

// ../../node_modules/effect/dist/internal/effect.js
var Interrupt = class extends ReasonBase {
  constructor(fiberId3, annotations = constEmptyAnnotations) {
    super("Interrupt", annotations, "Interrupted");
    this.fiberId = fiberId3;
  }
  toString() {
    return `Interrupt(${this.fiberId})`;
  }
  toJSON() {
    return {
      _tag: "Interrupt",
      fiberId: this.fiberId
    };
  }
  [symbol2](that) {
    return isInterruptReason(that) && this.fiberId === that.fiberId && this.annotations === that.annotations;
  }
  [symbol]() {
    return combine(string(`${this._tag}:${this.fiberId}`))(random(this.annotations));
  }
};
var makeInterruptReason = (fiberId3) => new Interrupt(fiberId3);
var causeInterrupt = (fiberId3) => new CauseImpl([new Interrupt(fiberId3)]);
var findFail = (self) => {
  const reason = self.reasons.find(isFailReason);
  return reason ? succeed2(reason) : fail2(self);
};
var findError = (self) => {
  for (let i = 0; i < self.reasons.length; i++) {
    const reason = self.reasons[i];
    if (reason._tag === "Fail") {
      return succeed2(reason.error);
    }
  }
  return fail2(self);
};
var hasDies = (self) => self.reasons.some(isDieReason);
var findDefect = (self) => {
  const reason = self.reasons.find(isDieReason);
  return reason ? succeed2(reason.defect) : fail2(self);
};
var hasInterrupts = (self) => self.reasons.some(isInterruptReason);
var causeFilterInterruptors = (self) => {
  let interruptors;
  for (let i = 0; i < self.reasons.length; i++) {
    const f = self.reasons[i];
    if (f._tag !== "Interrupt") continue;
    interruptors ??= /* @__PURE__ */ new Set();
    if (f.fiberId !== void 0) {
      interruptors.add(f.fiberId);
    }
  }
  return interruptors ? succeed2(interruptors) : fail2(self);
};
var causeMap = /* @__PURE__ */ dual(2, (self, f) => {
  let hasFail = false;
  const failures = self.reasons.map((failure) => {
    if (isFailReason(failure)) {
      hasFail = true;
      return new Fail(f(failure.error), failure.annotations);
    }
    return failure;
  });
  return hasFail ? causeFromReasons(failures) : self;
});
var causeSquash = (self) => {
  let die5;
  for (const reason of self.reasons) {
    if (reason._tag === "Fail") return reason.error;
    if (reason._tag === "Die") die5 ??= reason;
  }
  if (die5 !== void 0) return die5.defect;
  if (self.reasons.length > 0) return new globalThis.Error("All fibers interrupted without error");
  return new globalThis.Error("Empty cause");
};
var causePrettyErrors = (self, options3) => {
  const errors = [];
  const interrupts = [];
  if (self.reasons.length === 0) return errors;
  const prevStackLimit = getStackTraceLimit();
  if (prevStackLimit !== 0) setStackTraceLimit(1);
  try {
    for (const failure of self.reasons) {
      if (failure._tag === "Interrupt") {
        interrupts.push(failure);
        continue;
      }
      errors.push(causePrettyError(failure._tag === "Die" ? failure.defect : failure.error, failure.annotations, options3));
    }
    if (errors.length === 0) {
      const cause = new Error("The fiber was interrupted by:");
      cause.name = "InterruptCause";
      cause.stack = interruptCauseStack(cause, interrupts);
      const error = new globalThis.Error("All fibers interrupted without error", {
        cause
      });
      error.name = "InterruptError";
      error.stack = `${error.name}: ${error.message}`;
      errors.push(causePrettyError(error, interrupts[0].annotations, options3));
    }
  } finally {
    if (prevStackLimit !== 0) setStackTraceLimit(prevStackLimit);
  }
  return errors;
};
var causePrettyError = (original, annotations, options3) => {
  const kind = typeof original;
  let error;
  if (original && kind === "object") {
    error = new globalThis.Error(causePrettyMessage(original), {
      cause: original.cause ? causePrettyError(original.cause) : void 0
    });
    if (typeof original.name === "string") {
      error.name = original.name;
    }
    if (typeof original.stack === "string") {
      error.stack = cleanErrorStack(original.stack, error, annotations);
    } else {
      const stack = `${error.name}: ${error.message}`;
      error.stack = annotations ? addStackAnnotations(stack, annotations) : stack;
    }
    if (options3?.includeCauseInStack) {
      error.stack = renderPrettyError(error);
    }
    for (const key of Object.keys(original)) {
      if (!(key in error)) {
        ;
        error[key] = original[key];
      }
    }
  } else {
    error = new globalThis.Error(!original ? `Unknown error: ${original}` : kind === "string" ? original : formatJson(original));
  }
  return error;
};
var causePrettyMessage = (u) => {
  if (typeof u.message === "string") {
    return u.message;
  } else if (typeof u.toString === "function" && u.toString !== Object.prototype.toString && u.toString !== Array.prototype.toString) {
    try {
      return u.toString();
    } catch {
    }
  }
  return formatJson(u);
};
var locationRegExp = /\((.*)\)/g;
var cleanErrorStack = (stack, error, annotations) => {
  const message = `${error.name}: ${error.message}`;
  const lines = (stack.startsWith(message) ? stack.slice(message.length) : stack).split("\n");
  const out = [message];
  for (let i = 1; i < lines.length; i++) {
    if (/Generator\.next|~effect\/(?:Effect|Utils)/.test(lines[i])) {
      break;
    }
    out.push(lines[i]);
  }
  return annotations ? addStackAnnotations(out.join("\n"), annotations) : out.join("\n");
};
var addStackAnnotations = (stack, annotations) => {
  const frame = annotations?.get(StackTraceKey.key);
  if (frame) {
    stack = `${stack}
${currentStackTrace(frame)}`;
  }
  return stack;
};
var interruptCauseStack = (error, interrupts) => {
  const out = [`${error.name}: ${error.message}`];
  for (const current of interrupts) {
    const fiberId3 = current.fiberId !== void 0 ? `#${current.fiberId}` : "unknown";
    const frame = current.annotations.get(InterruptorStackTrace.key);
    out.push(`    at fiber (${fiberId3})`);
    if (frame) out.push(currentStackTrace(frame));
  }
  return out.join("\n");
};
var currentStackTrace = (frame) => {
  const out = [];
  let current = frame;
  let i = 0;
  while (current && i < 10) {
    const stack = current.stack();
    if (stack) {
      const locationMatchAll = stack.matchAll(locationRegExp);
      let match7 = false;
      for (const [, location2] of locationMatchAll) {
        match7 = true;
        out.push(`    at ${current.name} (${location2})`);
      }
      if (!match7) {
        out.push(`    at ${current.name} (${stack.replace(/^at /, "")})`);
      }
    } else {
      out.push(`    at ${current.name}`);
    }
    current = current.parent;
    i++;
  }
  return out.join("\n");
};
var causePretty = (cause) => causePrettyErrors(cause).map(renderPrettyError).join("\n");
var renderPrettyError = (e) => e.cause ? `${e.stack} {
${renderErrorCause(e.cause, "  ")}
}` : e.stack;
var renderErrorCause = (cause, prefix) => {
  const lines = cause.stack.split("\n");
  let stack = `${prefix}[cause]: ${lines[0]}`;
  for (let i = 1, len = lines.length; i < len; i++) {
    stack += `
${prefix}${lines[i]}`;
  }
  if (cause.cause) {
    stack += ` {
${renderErrorCause(cause.cause, `${prefix}  `)}
${prefix}}`;
  }
  return stack;
};
var FiberTypeId = "~effect/Fiber";
var fiberVariance = {
  _A: identity,
  _E: identity
};
var fiberIdStore = {
  id: 0
};
var AsyncResource = /* @__PURE__ */ (() => {
  try {
    return globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncResource;
  } catch {
    return void 0;
  }
})();
var captureAsyncContext = () => AsyncResource === void 0 ? void 0 : new AsyncResource("effect/Fiber");
var getCurrentFiber = () => globalThis[currentFiberTypeId];
var FiberImpl = class {
  constructor(context3, interruptible3 = true) {
    this.setContext(context3);
    this.id = ++fiberIdStore.id;
    this.currentOpCount = 0;
    this.interruptible = interruptible3;
    this._stack = [];
    this._observers = void 0;
    this._exit = void 0;
    this._children = void 0;
    this._interruptedCause = void 0;
    this._yielded = void 0;
    this._running = false;
    this._deferredInterrupt = false;
    this._parent = void 0;
    this._asyncContext = void 0;
    this.cache.runtimeMetrics?.recordFiberStart(this.context);
  }
  get [FiberTypeId]() {
    return fiberVariance;
  }
  get currentDispatcher() {
    return this._dispatcher ??= this.cache.scheduler.makeDispatcher();
  }
  getRef(ref) {
    return get(this.context, ref);
  }
  addObserver(cb) {
    if (this._exit) {
      cb(this._exit);
      return constVoid;
    }
    if (this._observers === void 0) {
      this._observers = [cb];
    } else {
      this._observers.push(cb);
    }
    return () => this.removeObserver(cb);
  }
  removeObserver(cb) {
    if (this._exit || this._observers === void 0) return;
    const index2 = this._observers.indexOf(cb);
    if (index2 >= 0) {
      this._observers.splice(index2, 1);
    }
  }
  interruptUnsafe(fiberId3, annotations) {
    if (this._exit) {
      return;
    }
    let cause = causeInterrupt(fiberId3);
    if (this.cache.stackFrame) {
      cause = causeAnnotate(cause, make5(StackTraceKey, this.cache.stackFrame));
    }
    if (annotations) {
      cause = causeAnnotate(cause, annotations);
    }
    this._interruptedCause = this._interruptedCause ? causeCombine(this._interruptedCause, cause) : cause;
    if (this.interruptible) {
      if (this._running) {
        this._deferredInterrupt = true;
      } else {
        this.evaluate(failCause(this._interruptedCause));
      }
    }
  }
  pollUnsafe() {
    return this._exit;
  }
  evaluate(effect2) {
    if (this._exit) {
      return;
    } else if (this._asyncContext !== void 0) {
      const asyncContext = this._asyncContext;
      this._asyncContext = void 0;
      return asyncContext.runInAsyncScope(this.evaluate, this, effect2);
    } else if (this._yielded !== void 0) {
      const yielded = this._yielded;
      this._yielded = void 0;
      yielded();
    }
    const exit3 = this.runLoop(effect2);
    if (exit3 === Yield) {
      this._asyncContext = captureAsyncContext();
      return;
    }
    const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
    if (interruptChildren !== void 0) {
      return this.evaluate(flatMap3(interruptChildren, () => exit3));
    }
    this._exit = exit3;
    this.cache.runtimeMetrics?.recordFiberEnd(this.context, this._exit);
    if (this._parent) {
      this._parent._children?.delete(this);
      this._parent = void 0;
    }
    if (this._observers !== void 0) {
      const observers = this._observers;
      this._observers = void 0;
      for (let i = 0; i < observers.length; i++) {
        observers[i](exit3);
      }
    }
    this._stack.length = 0;
    this._children = void 0;
    this.context = empty();
  }
  runLoop(effect2) {
    const prevFiber = globalThis[currentFiberTypeId];
    globalThis[currentFiberTypeId] = this;
    const prevRunning = this._running;
    this._running = true;
    let yielding = false;
    let current = effect2;
    this.currentOpCount = 0;
    try {
      while (true) {
        if (this._deferredInterrupt) {
          this._deferredInterrupt = false;
          current = failCause(this._interruptedCause);
        }
        this.currentOpCount++;
        const cache2 = this.cache;
        if (!yielding && !cache2.preventYield && cache2.scheduler.shouldYield(this)) {
          yielding = true;
          const prev = current;
          current = flatMap3(yieldNow, () => prev);
        }
        current = cache2.tracerContext ? cache2.tracerContext(current, this) : current[evaluate](this);
        if (current === Yield) {
          const yielded = this._yielded;
          if (ExitTypeId in yielded) {
            this._deferredInterrupt = false;
            this._yielded = void 0;
            return yielded;
          } else if (this._deferredInterrupt) {
            this._yielded = void 0;
            yielded();
            continue;
          }
          return Yield;
        }
      }
    } catch (error) {
      if (!hasProperty(current, evaluate)) {
        return exitDie(`Fiber.runLoop: Not a valid effect: ${String(current)}`);
      }
      return this.runLoop(exitDie(error));
    } finally {
      this._running = prevRunning;
      globalThis[currentFiberTypeId] = prevFiber;
    }
  }
  getCont(symbol4) {
    if (this._deferredInterrupt) {
      this._deferredInterrupt = false;
      return deferredInterruptCont;
    }
    while (true) {
      const op = this._stack.pop();
      if (!op) return void 0;
      const all6 = op[contAll];
      if (all6 !== void 0) {
        const cont = all6.call(op, this);
        if (cont) {
          ;
          cont[symbol4] = cont;
          return cont;
        }
      }
      if (op[symbol4]) return op;
    }
  }
  // Passes a success value straight to the next continuation instead of
  // returning an Exit for the run loop to unwrap. Each call counts as an
  // operation, and every `maxInlineSteps`th call returns an Exit instead, so
  // continuations calling continuations never nest deeper than that.
  succeedWith(value3) {
    if ((++this.currentOpCount & maxInlineSteps - 1) === 0) {
      return exitSucceed(value3);
    }
    const cont = this.getCont(contA);
    return cont ? cont[contA](value3, this) : this.yieldWith(exitSucceed(value3));
  }
  yieldWith(value3) {
    this._yielded = value3;
    return Yield;
  }
  children() {
    return this._children ??= /* @__PURE__ */ new Set();
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
  setContext(context3) {
    const previous = this.context;
    this.context = context3;
    if (previous !== void 0 && hasSameCache(previous, context3)) return;
    const root = context3.cacheRoot;
    const cache2 = root._fiberCache ??= makeFiberContextCache(context3);
    if (this.cache?.scheduler !== cache2.scheduler) {
      this._dispatcher = void 0;
    }
    this.cache = cache2;
  }
  get currentSpanLocal() {
    const span2 = this.cache.span;
    return span2?._tag === "Span" ? span2 : void 0;
  }
};
var makeFiberContextCache = (context3) => {
  const currentTracer = getOrUndefinedUnsafe(context3, TracerKey);
  return {
    scheduler: get(context3, Scheduler),
    tracer: currentTracer,
    tracerContext: currentTracer ? currentTracer["context"] : void 0,
    tracerEnabled: get(context3, TracerEnabled),
    span: getOrUndefinedUnsafe(context3, ParentSpanKey),
    logLevel: get(context3, CurrentLogLevel),
    minimumLogLevel: get(context3, MinimumLogLevel),
    stackFrame: get(context3, CurrentStackFrame),
    runtimeMetrics: getOrUndefinedUnsafe(context3, FiberRuntimeMetricsKey),
    maxOpsBeforeYield: get(context3, MaxOpsBeforeYield),
    preventYield: get(context3, PreventSchedulerYield)
  };
};
var deferredInterruptCont = {
  [contA](_value, fiber3) {
    return failCause(fiber3._interruptedCause);
  },
  [contE](_cause, fiber3) {
    return failCause(fiber3._interruptedCause);
  }
};
var maxInlineSteps = 32;
var fiberMiddleware = {
  interruptChildren: void 0
};
var fiberStackAnnotations = (fiber3) => {
  if (!fiber3.cache.stackFrame) return void 0;
  const annotations = /* @__PURE__ */ new Map();
  annotations.set(InterruptorStackTrace.key, fiber3.cache.stackFrame);
  return makeUnsafe(annotations);
};
var fiberInterruptChildren = (fiber3) => {
  if (fiber3._children === void 0 || fiber3._children.size === 0) {
    return void 0;
  }
  return fiberInterruptAll(fiber3._children);
};
var fiberAwait = (self) => {
  const impl = self;
  if (impl._exit) return succeed3(impl._exit);
  return callback((resume) => {
    if (impl._exit) return resume(succeed3(impl._exit));
    return sync(self.addObserver((exit3) => resume(succeed3(exit3))));
  });
};
var fiberAwaitAll = (self) => callback((resume) => {
  const iter = self[Symbol.iterator]();
  const exits = [];
  let cancel = void 0;
  function loop() {
    let result3 = iter.next();
    while (!result3.done) {
      if (result3.value._exit) {
        exits.push(result3.value._exit);
        result3 = iter.next();
        continue;
      }
      cancel = result3.value.addObserver((exit3) => {
        exits.push(exit3);
        loop();
      });
      return;
    }
    resume(succeed3(exits));
  }
  loop();
  return sync(() => cancel?.());
});
var fiberJoin = (self) => {
  const impl = self;
  if (impl._exit) return impl._exit;
  return callback((resume) => {
    if (impl._exit) return resume(impl._exit);
    return sync(self.addObserver(resume));
  });
};
var fiberInterrupt = (self) => withFiber((fiber3) => fiberInterruptAs(self, fiber3.id));
var fiberInterruptAs = /* @__PURE__ */ dual((args2) => hasProperty(args2[0], FiberTypeId), (self, fiberId3, annotations) => withFiber((parent) => {
  let ann = fiberStackAnnotations(parent);
  ann = ann && annotations ? merge(ann, annotations) : ann ?? annotations;
  self.interruptUnsafe(fiberId3, ann);
  return asVoid2(fiberAwait(self));
}));
var fiberInterruptAll = (fibers) => withFiber((parent) => {
  const annotations = fiberStackAnnotations(parent);
  let fiberArr = empty2();
  for (const fiber3 of fibers) {
    fiber3.interruptUnsafe(parent.id, annotations);
    fiberArr.push(fiber3);
  }
  return asVoid2(fiberAwaitAll(fiberArr));
});
var succeed3 = exitSucceed;
var failCause = exitFailCause;
var fail3 = exitFail;
var sync = /* @__PURE__ */ makePrimitive({
  op: "Sync",
  [evaluate](fiber3) {
    const value3 = this[args]();
    const cont = fiber3.getCont(contA);
    return cont ? cont[contA](value3, fiber3) : fiber3.yieldWith(exitSucceed(value3));
  }
});
var suspend = /* @__PURE__ */ makePrimitive({
  op: "Suspend",
  [evaluate](_fiber) {
    return this[args]();
  }
});
var fromOption2 = /* @__PURE__ */ dual((args2) => args2.length >= 2 || isOption2(args2[0]), (option4, onNone) => isNone2(option4) ? fail3(onNone ? onNone() : new NoSuchElementError("Effect.fromOption: Option.none")) : succeed3(option4.value));
var fromResult = /* @__PURE__ */ match2({
  onFailure: fail3,
  onSuccess: succeed3
});
var fromNullishOr2 = (value3) => value3 == null ? fail3(new NoSuchElementError()) : succeed3(value3);
var yieldNowWith = /* @__PURE__ */ makePrimitive({
  op: "Yield",
  [evaluate](fiber3) {
    let resumed = false;
    fiber3.currentDispatcher.scheduleTask(() => {
      if (resumed) return;
      fiber3.evaluate(exitVoid);
    }, this[args] ?? 0);
    return fiber3.yieldWith(() => {
      resumed = true;
    });
  }
});
var yieldNow = /* @__PURE__ */ yieldNowWith(0);
var succeedSome = (a) => succeed3(some2(a));
var succeedNone = /* @__PURE__ */ succeed3(/* @__PURE__ */ none2());
var transposeOption = (self) => isNone2(self) ? succeedNone : map5(self.value, some2);
var failCauseSync = (evaluate2) => suspend(() => failCause(evaluate2()));
var die = (defect) => exitDie(defect);
var failSync = (error) => suspend(() => fail3(error()));
var void_2 = /* @__PURE__ */ succeed3(void 0);
var try_2 = (options3) => {
  const evaluate2 = typeof options3 === "function" ? options3 : options3.try;
  const catcher = typeof options3 === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.try") : options3.catch;
  return suspend(() => {
    try {
      return succeed3(evaluate2());
    } catch (err) {
      return fail3(catcher(err));
    }
  });
};
var promise = (evaluate2) => callbackOptions(function(resume, signal) {
  evaluate2(signal).then((a) => resume(succeed3(a)), (e) => resume(die(e)));
}, evaluate2.length !== 0);
var tryPromise = (options3) => {
  const f = typeof options3 === "function" ? options3 : options3.try;
  const catcher = typeof options3 === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.tryPromise") : options3.catch;
  return callbackOptions(function(resume, signal) {
    const failWithCatch = (cause) => suspend(() => {
      try {
        return fail3(internalCall(() => catcher(cause)));
      } catch (err) {
        return die(err);
      }
    });
    try {
      f(signal).then((a) => resume(succeed3(a)), (e) => resume(failWithCatch(e)));
    } catch (err) {
      resume(failWithCatch(err));
    }
  }, f.length !== 0);
};
var withFiberId = (f) => withFiber((fiber3) => f(fiber3.id));
var fiber = /* @__PURE__ */ withFiber(succeed3);
var fiberId = /* @__PURE__ */ withFiberId(succeed3);
var callbackOptions = /* @__PURE__ */ (function() {
  const Proto13 = /* @__PURE__ */ makePrimitiveProto({
    op: "Async",
    [evaluate](fiber3) {
      let resumed = false;
      let yielded = false;
      const controller = this.withSignal ? new AbortController() : void 0;
      const onCancel = this.register.call(fiber3.cache.scheduler, (effect2) => {
        if (resumed) return;
        resumed = true;
        if (yielded) {
          fiber3.evaluate(effect2);
        } else {
          yielded = effect2;
        }
      }, controller?.signal);
      if (yielded !== false) return yielded;
      yielded = true;
      fiber3._yielded = () => {
        resumed = true;
      };
      if (controller === void 0 && onCancel === void 0) {
        return Yield;
      }
      fiber3._stack.push(asyncFinalizer(() => {
        resumed = true;
        controller?.abort();
        return onCancel ?? exitVoid;
      }));
      return Yield;
    }
  });
  const AsyncImpl = function(register, withSignal) {
    this.register = register;
    this.withSignal = withSignal;
  };
  AsyncImpl.prototype = Proto13;
  return function(register, withSignal) {
    return new AsyncImpl(register, withSignal);
  };
})();
var asyncFinalizer = /* @__PURE__ */ makePrimitive({
  op: "AsyncFinalizer",
  [contAll](fiber3) {
    if (fiber3.interruptible) {
      fiber3.interruptible = false;
      fiber3._stack.push(setInterruptibleTrue);
    }
  },
  [contE](cause, _fiber) {
    return hasInterrupts(cause) ? flatMap3(combineFinalizerCause(exitFailCause(cause), this[args]()), () => failCause(cause)) : failCause(cause);
  }
});
var callback = (register) => callbackOptions(register, register.length >= 2);
var never = /* @__PURE__ */ callback(constVoid);
var gen2 = (...args2) => {
  if (args2.length === 1) {
    const body2 = args2[0];
    return suspend(() => fromIteratorUnsafe(body2()));
  }
  const [options3, body] = args2;
  return suspend(() => fromIteratorUnsafe(body.call(options3.self)));
};
var fnUntraced = (body, ...pipeables) => {
  const fn3 = pipeables.length === 0 ? function() {
    return suspend(() => fromIteratorUnsafe(body.apply(this, arguments)));
  } : function() {
    let effect2 = suspend(() => fromIteratorUnsafe(body.apply(this, arguments)));
    for (let i = 0; i < pipeables.length; i++) {
      effect2 = pipeables[i](effect2, ...arguments);
    }
    return effect2;
  };
  return defineFunctionLength(body.length, fn3);
};
var defineFunctionLength = (length, fn3) => Object.defineProperty(fn3, "length", {
  value: length,
  configurable: true
});
var fnStackCleaner = /* @__PURE__ */ makeStackCleaner(2);
var fn = function() {
  const nameFirst = typeof arguments[0] === "string";
  const name = nameFirst ? arguments[0] : "Effect.fn";
  const spanOptions = nameFirst ? arguments[1] : void 0;
  const prevLimit = getStackTraceLimit();
  let defError;
  if (prevLimit !== 0) {
    setStackTraceLimit(2);
    defError = new globalThis.Error();
    setStackTraceLimit(prevLimit);
  }
  if (nameFirst) {
    return (body, ...pipeables) => makeFn(name, body, defError, pipeables, nameFirst, spanOptions);
  }
  return makeFn(name, arguments[0], defError, Array.prototype.slice.call(arguments, 1), nameFirst, spanOptions);
};
var makeFn = (name, bodyOrOptions, defError, pipeables, addSpan, spanOptions) => {
  const body = typeof bodyOrOptions === "function" ? bodyOrOptions : pipeables.shift().bind(bodyOrOptions.self);
  const definitionName = `${name} (definition)`;
  const definitionStack = defError ? fnStackCleaner(() => defError.stack) : constUndefined;
  return defineFunctionLength(body.length, function(...args2) {
    let result3 = suspend(() => {
      const iter = body.apply(this, arguments);
      return isEffect(iter) ? iter : fromIteratorUnsafe(iter);
    });
    for (let i = 0; i < pipeables.length; i++) {
      result3 = pipeables[i](result3, ...args2);
    }
    if (!isEffect(result3)) {
      return result3;
    }
    const prevLimit = getStackTraceLimit();
    let callError;
    if (prevLimit !== 0) {
      setStackTraceLimit(2);
      callError = new globalThis.Error();
      setStackTraceLimit(prevLimit);
    }
    return updateService(addSpan ? useSpan(name, spanOptions, (span2) => provideParentSpan(result3, span2)) : result3, CurrentStackFrame, (prev) => ({
      name,
      stack: callError ? fnStackCleaner(() => callError.stack) : constUndefined,
      parent: {
        name: definitionName,
        stack: definitionStack,
        parent: prev
      }
    }));
  });
};
var fnUntracedEager = (body, ...pipeables) => defineFunctionLength(body.length, pipeables.length === 0 ? function() {
  return fromIteratorEagerUnsafe(() => body.apply(this, arguments));
} : function() {
  let effect2 = fromIteratorEagerUnsafe(() => body.apply(this, arguments));
  for (const pipeable of pipeables) {
    effect2 = pipeable(effect2, ...arguments);
  }
  return effect2;
});
var fromIteratorEagerUnsafe = (evaluate2) => {
  try {
    const iterator = evaluate2();
    let value3 = void 0;
    while (true) {
      const state = iterator.next(value3);
      if (state.done) {
        return succeed3(state.value);
      }
      const primitive = state.value;
      if (primitive && primitive._tag === "Success") {
        value3 = primitive.value;
        continue;
      } else if (primitive && primitive._tag === "Failure") {
        return state.value;
      } else {
        let isFirstExecution = true;
        return suspend(() => {
          if (isFirstExecution) {
            isFirstExecution = false;
            return flatMap3(state.value, (value4) => fromIteratorUnsafe(iterator, value4));
          } else {
            return suspend(() => fromIteratorUnsafe(evaluate2()));
          }
        });
      }
    }
  } catch (error) {
    return die(error);
  }
};
var fromIteratorUnsafe = /* @__PURE__ */ (function() {
  const Proto13 = /* @__PURE__ */ makePrimitiveProto({
    op: "Iterator",
    [contA](value3, fiber3) {
      const iter = this.iterator;
      while (true) {
        const state = iter.next(value3);
        if (state.done) return succeed3(state.value);
        if (!effectIsExit(state.value)) {
          fiber3._stack.push(this);
          return state.value;
        } else if (state.value._tag === "Failure") {
          return state.value;
        }
        value3 = state.value.value;
      }
    },
    [evaluate](fiber3) {
      return this[contA](this.initial, fiber3);
    }
  });
  const IteratorImpl = function(iterator, initial) {
    this.iterator = iterator;
    this.initial = initial;
  };
  IteratorImpl.prototype = Proto13;
  return function(iterator, initial) {
    return new IteratorImpl(iterator, initial);
  };
})();
var as2 = /* @__PURE__ */ dual(2, (self, value3) => new ContImpl(self, returnPayload, succeed3(value3)));
var evaluateCont = function(fiber3) {
  fiber3._stack.push(this);
  return this[args];
};
var OnSuccessProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccess",
  [evaluate]: evaluateCont
});
var ContImpl = function(self, cont, payload) {
  this[args] = self;
  this[contA] = cont;
  this.payload = payload;
};
ContImpl.prototype = OnSuccessProto;
var returnPayload = function() {
  return this.payload;
};
var succeedPayload = function(_value, fiber3) {
  return fiber3.succeedWith(this.payload);
};
var continuationMarksStack = /* @__PURE__ */ (() => {
  const marker = "~effect/Effect/stackProbe";
  const probe = {
    [marker]: function stackProbe() {
      return new Error().stack;
    }
  };
  return probe[marker]()?.includes("[as " + marker + "]") === true;
})();
var mapCont = function(value3, fiber3) {
  const f = this.payload;
  return fiber3.succeedWith(continuationMarksStack ? f(value3) : internalCall(() => f(value3)));
};
var andThenCont = function(value3) {
  const f = this.payload;
  return f(value3);
};
var tapCont = function(value3) {
  const f = this.payload;
  return new ContImpl(f(value3), succeedPayload, value3);
};
var tapEffectCont = function(value3) {
  return new ContImpl(this.payload, succeedPayload, value3);
};
var asSome = (self) => map5(self, some2);
var flip = (self) => matchEffect(self, {
  onFailure: succeed3,
  onSuccess: fail3
});
var andThen2 = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, isEffect(f) ? returnPayload : andThenCont, f));
var tap2 = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, isEffect(f) ? tapEffectCont : tapCont, f));
var asVoid2 = (self) => new ContImpl(self, returnPayload, exitVoid);
var sandbox = (self) => catchCause(self, fail3);
var raceAll = (all6, options3) => withFiber((parent) => {
  const fibers = /* @__PURE__ */ new Set();
  onExitUnsafe(parent, () => fibers.size === 0 ? void 0 : fiberInterruptAll(fibers));
  return callback((resume) => {
    const effects = fromIterable2(all6);
    const len = effects.length;
    let doneCount = 0;
    let done3 = false;
    const failures = [];
    const onExit4 = (exit3, fiber3, i) => {
      doneCount++;
      if (exit3._tag === "Failure") {
        failures.push(...exit3.cause.reasons);
        if (doneCount >= len) {
          resume(failCause(causeFromReasons(failures)));
        }
        return;
      }
      const isWinner = !done3;
      done3 = true;
      resume(exit3);
      if (isWinner && options3?.onWinner) {
        options3.onWinner({
          fiber: fiber3,
          index: i,
          parentFiber: parent
        });
      }
    };
    for (let i = 0; i < len; i++) {
      const fiber3 = forkUnsafe(parent, effects[i], true, true, false);
      fibers.add(fiber3);
      fiber3.addObserver((exit3) => {
        fibers.delete(fiber3);
        onExit4(exit3, fiber3, i);
      });
      if (done3) break;
    }
  });
});
var raceAllFirst = (all6, options3) => withFiber((parent) => {
  const fibers = /* @__PURE__ */ new Set();
  onExitUnsafe(parent, () => fibers.size === 0 ? void 0 : fiberInterruptAll(fibers));
  return callback((resume) => {
    let done3 = false;
    let i = 0;
    for (const effect2 of all6) {
      if (done3) break;
      const index2 = i++;
      const fiber3 = forkUnsafe(parent, effect2, true, true, false);
      fibers.add(fiber3);
      fiber3.addObserver((exit3) => {
        fibers.delete(fiber3);
        const isWinner = !done3;
        done3 = true;
        resume(exit3);
        if (isWinner && options3?.onWinner) {
          options3.onWinner({
            fiber: fiber3,
            index: index2,
            parentFiber: parent
          });
        }
      });
    }
  });
});
var race = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options3) => raceAll([self, that], options3));
var raceFirst = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options3) => raceAllFirst([self, that], options3));
var flatMap3 = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, andThenCont, f));
var matchCauseEffectEager = /* @__PURE__ */ dual(2, (self, options3) => {
  if (effectIsExit(self)) {
    return self._tag === "Success" ? options3.onSuccess(self.value) : options3.onFailure(self.cause);
  }
  return matchCauseEffect(self, options3);
});
var effectIsExit = (effect2) => effect2[ExitTypeId] !== void 0;
var flatMapEager = /* @__PURE__ */ dual(2, (self, f) => {
  if (effectIsExit(self)) {
    return self._tag === "Success" ? f(self.value) : self;
  }
  return flatMap3(self, f);
});
var flatten3 = (self) => flatMap3(self, identity);
var map5 = /* @__PURE__ */ dual(2, (self, f) => new ContImpl(self, mapCont, f));
var mapEager = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMap(self, f) : map5(self, f));
var mapErrorEager = /* @__PURE__ */ dual(2, (self, f) => effectIsExit(self) ? exitMapError(self, f) : mapError2(self, f));
var mapBothEager = /* @__PURE__ */ dual(2, (self, options3) => effectIsExit(self) ? exitMapBoth(self, options3) : mapBoth(self, options3));
var catchEager = /* @__PURE__ */ dual(2, (self, f) => {
  if (effectIsExit(self)) {
    if (self._tag === "Success") return self;
    const error = findError(self.cause);
    if (isFailure2(error)) return self;
    return f(error.success);
  }
  return catch_(self, f);
});
var exitInterrupt = (fiberId3) => exitFailCause(causeInterrupt(fiberId3));
var exitIsSuccess = (self) => self._tag === "Success";
var exitIsFailure = (self) => self._tag === "Failure";
var exitFilterCause = (self) => self._tag === "Failure" ? succeed2(self.cause) : fail2(self);
var exitHasInterrupts = (self) => self._tag === "Failure" && hasInterrupts(self.cause);
var exitVoid = /* @__PURE__ */ exitSucceed(void 0);
var exitMap = /* @__PURE__ */ dual(2, (self, f) => self._tag === "Success" ? exitSucceed(f(self.value)) : self);
var exitMapError = /* @__PURE__ */ dual(2, (self, f) => {
  if (self._tag === "Success") return self;
  const error = findError(self.cause);
  if (isFailure2(error)) return self;
  return exitFail(f(error.success));
});
var exitMapBoth = /* @__PURE__ */ dual(2, (self, options3) => {
  if (self._tag === "Success") return exitSucceed(options3.onSuccess(self.value));
  const error = findError(self.cause);
  if (isFailure2(error)) return self;
  return exitFail(options3.onFailure(error.success));
});
var exitZipRight = /* @__PURE__ */ dual(2, (self, that) => exitIsSuccess(self) ? that : self);
var exitAsVoidAll = (exits) => {
  const failures = [];
  for (const exit3 of exits) {
    if (exit3._tag === "Failure") {
      failures.push(...exit3.cause.reasons);
    }
  }
  return failures.length === 0 ? exitVoid : exitFailCause(causeFromReasons(failures));
};
var service = (service3) => service3;
var serviceOption = (service3) => withFiber((fiber3) => succeed3(getOption(fiber3.context, service3)));
var serviceOptional = (service3) => withFiber((fiber3) => fromOption2(getOption(fiber3.context, service3)));
var updateContext = /* @__PURE__ */ dual(2, (self, f) => withFiber((fiber3) => {
  const prevContext = fiber3.context;
  const nextContext = f(prevContext);
  if (prevContext === nextContext) return self;
  fiber3.setContext(nextContext);
  onExitUnsafe(fiber3, () => {
    fiber3.setContext(prevContext);
    return void 0;
  });
  return self;
}));
var updateService = /* @__PURE__ */ dual(3, (self, service3, f) => updateContext(self, (s) => {
  const prev = getUnsafe(s, service3);
  const next = f(prev);
  if (prev === next) return s;
  return add(s, service3, next);
}));
var updateServiceScoped = (service3, update3, options3) => uninterruptible(withFiber((fiber3) => {
  const original = getUnsafe(fiber3.context, service3);
  const updated = update3(original);
  fiber3.setContext(add(fiber3.context, service3, updated));
  return scopeAddFinalizerExit(getUnsafe(fiber3.context, scopeTag), (_) => {
    const currentOption = getOption(fiber3.context, service3);
    if (isNone2(currentOption)) return void_2;
    const current = currentOption.value;
    let next;
    if (options3?.reset === void 0) {
      if (current !== updated) return void_2;
      next = original;
    } else {
      next = options3.reset(original, updated, current);
    }
    fiber3.setContext(add(fiber3.context, service3, next));
    return void_2;
  });
}));
var context = () => getContext;
var getContext = /* @__PURE__ */ withFiber((fiber3) => succeed3(fiber3.context));
var contextWith = (f) => withFiber((fiber3) => f(fiber3.context));
var setContext = /* @__PURE__ */ dual(2, (self, context3) => updateContext(self, constant(context3)));
var provideContext = /* @__PURE__ */ dual(2, (self, context3) => {
  if (effectIsExit(self)) return self;
  return updateContext(self, merge(context3));
});
var provideService = function() {
  if (arguments.length === 1) {
    return dual(2, (self, impl) => provideServiceImpl(self, arguments[0], impl));
  }
  return dual(3, (self, service3, impl) => provideServiceImpl(self, service3, impl)).apply(this, arguments);
};
var provideServiceImpl = (self, service3, implementation) => updateContext(self, add(service3, implementation));
var provideServiceEffect = /* @__PURE__ */ dual(3, (self, service3, acquire) => flatMap3(acquire, (implementation) => provideService(self, service3, implementation)));
var zip = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, options3) => zipWith2(self, that, (a, a2) => [a, a2], options3));
var zipWith2 = /* @__PURE__ */ dual((args2) => isEffect(args2[1]), (self, that, f, options3) => options3?.concurrent ? map5(all3([self, that], {
  concurrency: 2
}), ([a, a2]) => f(a, a2)) : flatMap3(self, (a) => map5(that, (a2) => f(a, a2))));
var filterOrFail = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, predicate, orFailWith) => filterOrElse(self, predicate, orFailWith ? (a) => fail3(orFailWith(a)) : () => fail3(new NoSuchElementError())));
var when = /* @__PURE__ */ dual(2, (self, condition) => flatMap3(condition, (pass) => pass ? asSome(self) : succeedNone));
var replicate = /* @__PURE__ */ dual(2, (self, n) => Array.from({
  length: n
}, () => self));
var replicateEffect = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, n, options3) => all3(replicate(self, n), options3));
var forever = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options3) => whileLoop({
  while: constTrue,
  body: constant(options3?.disableYield ? self : flatMap3(self, (_) => yieldNow)),
  step: constVoid
}));
var catchCause = /* @__PURE__ */ dual(2, (self, f) => new OnFailureImpl(self, f.length !== 1 ? (cause) => f(cause) : f));
var OnFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnFailure",
  [evaluate]: evaluateCont
});
var OnFailureImpl = function(self, f) {
  this[args] = self;
  this[contE] = f;
};
OnFailureImpl.prototype = OnFailureProto;
var catchCauseIf = /* @__PURE__ */ dual(3, (self, predicate, f) => catchCause(self, (cause) => {
  if (!predicate(cause)) {
    return failCause(cause);
  }
  return f(cause);
}));
var catchCauseFilter = /* @__PURE__ */ dual(3, (self, filter9, f) => catchCause(self, (cause) => {
  const eb = filter9(cause);
  return isFailure2(eb) ? failCause(eb.failure) : f(eb.success, cause);
}));
var catch_ = /* @__PURE__ */ dual(2, (self, f) => catchCauseFilter(self, findError, (e) => f(e)));
var catchNoSuchElement = (self) => matchEffect(self, {
  onFailure: (error) => isNoSuchElementError(error) ? succeedNone : fail3(error),
  onSuccess: succeedSome
});
var catchDefect = /* @__PURE__ */ dual(2, (self, f) => catchCauseFilter(self, findDefect, f));
var tapCause = /* @__PURE__ */ dual(2, (self, f) => catchCause(self, (cause) => andThen2(f(cause), failCause(cause))));
var tapCauseIf = /* @__PURE__ */ dual(3, (self, predicate, f) => catchCauseIf(self, predicate, (cause) => andThen2(f(cause), failCause(cause))));
var tapCauseFilter = /* @__PURE__ */ dual(3, (self, filter9, f) => catchCause(self, (cause) => {
  const result3 = filter9(cause);
  if (isFailure2(result3)) {
    return failCause(cause);
  }
  return andThen2(f(result3.success, cause), failCause(cause));
}));
var tapError = /* @__PURE__ */ dual(2, (self, f) => tapCauseFilter(self, findError, (e) => f(e)));
var tapErrorTag = /* @__PURE__ */ dual(3, (self, k, f) => {
  const predicate = Array.isArray(k) ? (e) => hasProperty(e, "_tag") && k.includes(e._tag) : isTagged(k);
  return tapError(self, (error) => predicate(error) ? f(error) : void_2);
});
var tapDefect = /* @__PURE__ */ dual(2, (self, f) => tapCauseFilter(self, findDefect, (_) => f(_)));
var catchIf = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, predicate, f, orElse2) => catchCause(self, (cause) => {
  const error = findError(cause);
  if (isFailure2(error)) return failCause(error.failure);
  if (!predicate(error.success)) {
    return orElse2 ? orElse2(error.success) : failCause(cause);
  }
  return f(error.success);
}));
var catchFilter = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, filter9, f, orElse2) => catchCause(self, (cause) => {
  const error = findError(cause);
  if (isFailure2(error)) return failCause(error.failure);
  const result3 = filter9(error.success);
  if (isFailure2(result3)) {
    return orElse2 ? orElse2(result3.failure) : failCause(cause);
  }
  return f(result3.success);
}));
var catchTag = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, k, f, orElse2) => {
  const pred = Array.isArray(k) ? (e) => hasProperty(e, "_tag") && k.includes(e._tag) : isTagged(k);
  return catchIf(self, pred, f, orElse2);
});
var catchTags = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, cases, orElse2) => {
  let keys3;
  return catchFilter(self, (e) => {
    keys3 ??= Object.keys(cases);
    return hasProperty(e, "_tag") && isString(e["_tag"]) && keys3.includes(e["_tag"]) ? succeed2(e) : fail2(e);
  }, (e) => cases[e["_tag"]](e), orElse2);
});
var catchReason = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, errorTag, reasonTag, f, orElse2) => catchIf(self, (e) => isTagged(e, errorTag) && hasProperty(e, "reason") && (orElse2 !== void 0 || isTagged(e.reason, reasonTag)), (e) => {
  const reason = e.reason;
  if (isTagged(reason, reasonTag)) return f(reason, e);
  return orElse2 ? orElse2(reason, e) : fail3(e);
}));
var catchReasons = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, errorTag, cases, orElse2) => {
  let keys3;
  return catchIf(self, (e) => isTagged(e, errorTag) && hasProperty(e, "reason") && hasProperty(e.reason, "_tag") && isString(e.reason._tag) && (orElse2 !== void 0 || (keys3 ??= Object.keys(cases)).includes(e.reason._tag)), (e) => {
    const reason = e.reason;
    keys3 ??= Object.keys(cases);
    if (keys3.includes(reason._tag)) {
      return cases[reason._tag](reason, e);
    }
    return orElse2 ? orElse2(reason, e) : fail3(e);
  });
});
var unwrapReason = /* @__PURE__ */ dual(2, (self, errorTag) => catchFilter(self, (e) => {
  if (isTagged(e, errorTag) && hasProperty(e, "reason")) {
    return succeed2(e.reason);
  }
  return fail2(e);
}, fail3));
var mapError2 = /* @__PURE__ */ dual(2, (self, f) => catch_(self, (error) => failSync(() => f(error))));
var mapBoth = /* @__PURE__ */ dual(2, (self, options3) => matchEffect(self, {
  onFailure: (e) => failSync(() => options3.onFailure(e)),
  onSuccess: (a) => sync(() => options3.onSuccess(a))
}));
var orDie = (self) => catch_(self, die);
var orElseSucceed = /* @__PURE__ */ dual(2, (self, f) => catch_(self, (error) => sync(() => f(error))));
var firstSuccessOf = (effects) => suspend(() => {
  const iterator = effects[Symbol.iterator]();
  let state = iterator.next();
  if (state.done) {
    return die(new Error("Received an empty collection of effects"));
  }
  function loop(current) {
    const next = iterator.next();
    if (next.done) return current.value;
    return catch_(current.value, (_) => loop(next));
  }
  return loop(state);
});
var eventually = (self) => catch_(self, (_) => flatMap3(yieldNow, () => eventually(self)));
var ignore = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options3) => {
  if (!options3?.log) {
    return matchEffect(self, {
      onFailure: (_) => void_2,
      onSuccess: (_) => void_2
    });
  }
  const logEffect = logWithLevel(options3.log === true ? void 0 : options3.log);
  return matchCauseEffect(self, {
    onFailure(cause) {
      const failure = findFail(cause);
      return isFailure2(failure) ? failCause(failure.failure) : options3.message === void 0 ? logEffect(cause) : logEffect(options3.message, cause);
    },
    onSuccess: (_) => void_2
  });
});
var ignoreCause = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options3) => {
  if (!options3?.log) {
    return matchCauseEffect(self, {
      onFailure: (_) => void_2,
      onSuccess: (_) => void_2
    });
  }
  const logEffect = logWithLevel(options3.log === true ? void 0 : options3.log);
  return matchCauseEffect(self, {
    onFailure: (cause) => options3.message === void 0 ? logEffect(cause) : logEffect(options3.message, cause),
    onSuccess: (_) => void_2
  });
});
var option = (self) => match4(self, {
  onFailure: none2,
  onSuccess: some2
});
var result = (self) => matchEager(self, {
  onFailure: fail2,
  onSuccess: succeed2
});
var matchCauseEffect = /* @__PURE__ */ dual(2, (self, options3) => new OnSuccessAndFailureImpl(self, options3.onSuccess.length !== 1 ? (a) => options3.onSuccess(a) : options3.onSuccess, options3.onFailure.length !== 1 ? (cause) => options3.onFailure(cause) : options3.onFailure));
var OnSuccessAndFailureProto = /* @__PURE__ */ makePrimitiveProto({
  op: "OnSuccessAndFailure",
  [evaluate]: evaluateCont
});
var OnSuccessAndFailureImpl = function(self, onSuccess, onFailure) {
  this[args] = self;
  this[contA] = onSuccess;
  this[contE] = onFailure;
};
OnSuccessAndFailureImpl.prototype = OnSuccessAndFailureProto;
var matchSuccess = function(value3, fiber3) {
  const handlers = this.payload;
  return fiber3.succeedWith(continuationMarksStack ? handlers.onSuccess(value3) : internalCall(() => handlers.onSuccess(value3)));
};
var makeMatch = (op, onFailure) => {
  const Proto13 = makePrimitiveProto({
    op,
    [evaluate]: evaluateCont,
    [contA]: matchSuccess,
    [contE]: onFailure
  });
  const MatchImpl2 = function(self, handlers) {
    this[args] = self;
    this.payload = handlers;
  };
  MatchImpl2.prototype = Proto13;
  return MatchImpl2;
};
var MatchImpl = /* @__PURE__ */ makeMatch("Match", function(cause, fiber3) {
  const fail11 = cause.reasons.find(isFailReason);
  if (fail11 === void 0) return failCause(cause);
  const handlers = this.payload;
  return fiber3.succeedWith(continuationMarksStack ? handlers.onFailure(fail11.error) : internalCall(() => handlers.onFailure(fail11.error)));
});
var MatchCauseImpl = /* @__PURE__ */ makeMatch("MatchCause", function(cause, fiber3) {
  const handlers = this.payload;
  return fiber3.succeedWith(continuationMarksStack ? handlers.onFailure(cause) : internalCall(() => handlers.onFailure(cause)));
});
var matchCause = /* @__PURE__ */ dual(2, (self, options3) => new MatchCauseImpl(self, options3));
var matchEffect = /* @__PURE__ */ dual(2, (self, options3) => matchCauseEffect(self, {
  onFailure: (cause) => {
    const fail11 = cause.reasons.find(isFailReason);
    return fail11 ? options3.onFailure(fail11.error) : failCause(cause);
  },
  onSuccess: options3.onSuccess
}));
var match4 = /* @__PURE__ */ dual(2, (self, options3) => new MatchImpl(self, options3));
var matchEager = /* @__PURE__ */ dual(2, (self, options3) => {
  if (effectIsExit(self)) {
    if (self._tag === "Success") return exitSucceed(options3.onSuccess(self.value));
    const error = findError(self.cause);
    if (isFailure2(error)) return self;
    return exitSucceed(options3.onFailure(error.success));
  }
  return match4(self, options3);
});
var matchCauseEager = /* @__PURE__ */ dual(2, (self, options3) => {
  if (effectIsExit(self)) {
    if (self._tag === "Success") return exitSucceed(options3.onSuccess(self.value));
    return exitSucceed(options3.onFailure(self.cause));
  }
  return matchCause(self, options3);
});
var exit = (self) => effectIsExit(self) ? exitSucceed(self) : exitPrimitive(self);
var exitPrimitive = /* @__PURE__ */ makePrimitive({
  op: "Exit",
  [evaluate](fiber3) {
    fiber3._stack.push(this);
    return this[args];
  },
  [contA](value3, fiber3, exit3) {
    return fiber3.succeedWith(exit3 ?? exitSucceed(value3));
  },
  [contE](cause, fiber3, exit3) {
    return fiber3.succeedWith(exit3 ?? exitFailCause(cause));
  }
});
var isFailure3 = /* @__PURE__ */ matchEager({
  onFailure: () => true,
  onSuccess: () => false
});
var isSuccess3 = /* @__PURE__ */ matchEager({
  onFailure: () => false,
  onSuccess: () => true
});
var delay = /* @__PURE__ */ dual(2, (self, duration) => andThen2(sleep(duration), self));
var timeoutOrElse = /* @__PURE__ */ dual(2, (self, options3) => flatMap3(timeoutOption(self, options3.duration), (option4) => isNone2(option4) ? options3.orElse() : succeed3(option4.value)));
var timeoutErrorFromDuration = (duration) => new TimeoutError(`Operation timed out after '${format2(duration)}'`);
var timeout = /* @__PURE__ */ dual(2, (self, duration) => {
  const decoded = fromInputUnsafe(duration);
  return timeoutOrElse(self, {
    duration: decoded,
    orElse: () => fail3(timeoutErrorFromDuration(decoded))
  });
});
var timeoutOption = /* @__PURE__ */ dual(2, (self, duration) => raceFirst(asSome(self), as2(sleep(duration), none2())));
var timed = (self) => clockWith((clock) => {
  const start = clock.monotonicTimeNanosUnsafe();
  return map5(self, (a) => [nanos(clock.monotonicTimeNanosUnsafe() - start), a]);
});
var ScopeTypeId = "~effect/Scope";
var ScopeCloseableTypeId = "~effect/Scope/Closeable";
var scopeTag = /* @__PURE__ */ Service("effect/Scope");
var scopeClose = (self, exit_) => withFiber((fiber3) => {
  const close3 = scopeCloseUnsafe(self, exit_);
  if (close3 === void 0) return void_2;
  fiberEnterUninterruptibleUnsafe(fiber3);
  return close3;
});
var scopeCloseUnsafe = (self, exit_) => {
  const state = self.state;
  if (state._tag === "Closed") return;
  self.state = {
    _tag: "Closed",
    exit: exit_
  };
  if (self.parent !== void 0) {
    scopeRemoveFinalizerUnsafe(self.parent, self);
  }
  if (state._tag === "Empty") return;
  if (state.finalizer !== void 0) {
    return runFinalizer(state.finalizer, exit_);
  }
  const finalizers = state.finalizers;
  if (finalizers.size === 1) {
    return runFinalizer(finalizers.values().next().value, exit_);
  }
  return scopeCloseFinalizers(self, finalizers, exit_);
};
var runFinalizer = (finalizer, exit_) => {
  try {
    return finalizer(exit_);
  } catch (defect) {
    return exitDie(defect);
  }
};
var combineFinalizerCause = (exit_, finalizer) => exitIsSuccess(exit_) ? finalizer : catchCause(finalizer, (cause) => failCause(causeCombine(exit_.cause, cause)));
var scopeCloseFinalizers = /* @__PURE__ */ fnUntraced(function* (self, finalizers, exit_) {
  let exits = [];
  const fibers = [];
  const arr = Array.from(finalizers.values());
  const parent = getCurrentFiber();
  for (let i = arr.length - 1; i >= 0; i--) {
    const finalizer = arr[i];
    if (self.strategy === "sequential") {
      exits.push(yield* exit(runFinalizer(finalizer, exit_)));
    } else {
      fibers.push(forkUnsafe(parent, runFinalizer(finalizer, exit_), true, true, "inherit"));
    }
  }
  if (fibers.length > 0) {
    exits = yield* fiberAwaitAll(fibers);
  }
  return yield* exitAsVoidAll(exits);
});
var scopeForkUnsafe = (scope3, finalizerStrategy) => {
  const child = makeScope(finalizerStrategy, scope3);
  if (scope3.state._tag === "Closed") {
    child.state = scope3.state;
    return child;
  }
  scopeAddFinalizerUnsafe(scope3, child, (exit3) => scopeClose(child, exit3));
  return child;
};
var scopeAddFinalizerExit = (scope3, finalizer) => {
  return suspend(() => {
    if (scope3.state._tag === "Closed") {
      return finalizer(scope3.state.exit);
    }
    scopeAddFinalizerUnsafe(scope3, {}, finalizer);
    return void_2;
  });
};
var scopeAddFinalizer = (scope3, finalizer) => scopeAddFinalizerExit(scope3, constant(finalizer));
var scopeAddFinalizerUnsafe = (scope3, key, finalizer) => {
  if (scope3.state._tag === "Empty") {
    scope3.state = {
      _tag: "Open",
      finalizerKey: key,
      finalizer,
      finalizers: void 0
    };
  } else if (scope3.state._tag === "Open") {
    const state = scope3.state;
    if (state.finalizer !== void 0) {
      state.finalizers = /* @__PURE__ */ new Map([[state.finalizerKey, state.finalizer]]);
      state.finalizerKey = void 0;
      state.finalizer = void 0;
      state.finalizers.set(key, finalizer);
    } else {
      state.finalizers.set(key, finalizer);
    }
  }
};
var scopeRemoveFinalizerUnsafe = (scope3, key) => {
  if (scope3.state._tag !== "Open") return;
  const state = scope3.state;
  if (state.finalizerKey === key) {
    scope3.state = constScopeEmpty;
  } else if (state.finalizers !== void 0) {
    state.finalizers.delete(key);
    if (state.finalizers.size === 0) {
      scope3.state = constScopeEmpty;
    }
  }
};
var scopeMakeUnsafe = (finalizerStrategy) => makeScope(finalizerStrategy, void 0);
var makeScope = (finalizerStrategy = "sequential", parent) => ({
  [ScopeCloseableTypeId]: ScopeCloseableTypeId,
  [ScopeTypeId]: ScopeTypeId,
  strategy: finalizerStrategy,
  parent,
  state: constScopeEmpty
});
var constScopeEmpty = {
  _tag: "Empty"
};
var scope = scopeTag;
var provideScope = /* @__PURE__ */ provideService(scopeTag);
var scoped = (self) => withFiber((fiber3) => {
  const prev = fiber3.context;
  const scope3 = scopeMakeUnsafe();
  fiber3.setContext(add(fiber3.context, scopeTag, scope3));
  onExitUnsafe(fiber3, (exit3) => {
    fiber3.setContext(prev);
    return scopeCloseUnsafe(scope3, exit3);
  });
  return self;
});
var scopedWith = (f) => suspend(() => {
  const scope3 = scopeMakeUnsafe();
  return onExit(f(scope3), (exit3) => suspend(() => scopeCloseUnsafe(scope3, exit3) ?? void_2));
});
var acquireRelease = (acquire, release, options3) => contextWith((context3) => uninterruptibleMask((restore) => flatMap3(scope, (scope3) => tap2(options3?.interruptible ? restore(acquire) : acquire, (a) => scopeAddFinalizerExit(scope3, (exit3) => provideContext(release(a, exit3), context3))))));
var addFinalizer = (finalizer) => flatMap3(scope, (scope3) => contextWith((context3) => scopeAddFinalizerExit(scope3, (exit3) => provideContext(finalizer(exit3), context3))));
var OnExitImpl = /* @__PURE__ */ (function() {
  const Proto13 = /* @__PURE__ */ makePrimitiveProto({
    op: "OnExit",
    [evaluate](fiber3) {
      fiber3._stack.push(this);
      return this.effect;
    },
    [contAll](fiber3) {
      if (fiber3.interruptible && this.interruptible !== true) {
        fiber3._stack.push(setInterruptibleTrue);
        fiber3.interruptible = false;
      }
    },
    [contA](value3, _, exit3) {
      exit3 ??= exitSucceed(value3);
      let eff;
      try {
        eff = this.onExit(exit3);
      } catch (defect) {
        eff = exitDie(defect);
      }
      return eff ? flatMap3(eff, (_2) => exit3) : exit3;
    },
    [contE](cause, _, exit3) {
      exit3 ??= exitFailCause(cause);
      let eff;
      try {
        eff = this.onExit(exit3);
      } catch (defect) {
        eff = exitDie(defect);
      }
      return eff ? flatMap3(combineFinalizerCause(exit3, eff), (_2) => exit3) : exit3;
    }
  });
  const OnExitImpl2 = function(effect2, onExit4, interruptible3) {
    this.effect = effect2;
    this.onExit = onExit4;
    this.interruptible = interruptible3;
  };
  OnExitImpl2.prototype = Proto13;
  return OnExitImpl2;
})();
var onExitPrimitive = (effect2, onExit4, interruptible3) => new OnExitImpl(effect2, onExit4, interruptible3);
var onExitUnsafe = (fiber3, f) => {
  ;
  fiber3._stack.push(new OnExitImpl(void 0, f, void 0));
};
var onExit = /* @__PURE__ */ dual(2, onExitPrimitive);
var ensuring = /* @__PURE__ */ dual(2, (self, finalizer) => onExit(self, (_) => finalizer));
var onExitIf = /* @__PURE__ */ dual(3, (self, predicate, f) => onExit(self, (exit3) => {
  if (!predicate(exit3)) {
    return void_2;
  }
  return f(exit3);
}));
var onExitFilter = /* @__PURE__ */ dual(3, (self, filter9, f) => onExit(self, (exit3) => {
  const b = filter9(exit3);
  return isFailure2(b) ? void_2 : f(b.success, exit3);
}));
var onError = /* @__PURE__ */ dual(2, (self, f) => onExitFilter(self, exitFilterCause, f));
var onErrorIf = /* @__PURE__ */ dual(3, (self, predicate, f) => onExitIf(self, (exit3) => {
  if (exit3._tag !== "Failure") {
    return false;
  }
  return predicate(exit3.cause);
}, (exit3) => f(exit3.cause)));
var onErrorFilter = /* @__PURE__ */ dual(3, (self, filter9, f) => onExit(self, (exit3) => {
  if (exit3._tag !== "Failure") {
    return void_2;
  }
  const result3 = filter9(exit3.cause);
  return isFailure2(result3) ? void_2 : f(result3.success, exit3.cause);
}));
var onInterrupt = /* @__PURE__ */ dual(2, (self, finalizer) => onErrorFilter(causeFilterInterruptors, finalizer)(self));
var acquireUseRelease = (acquire, use, release) => uninterruptibleMask((restore) => flatMap3(acquire, (a) => onExitPrimitive(suspend(() => restore(use(a))), (exit3) => release(a, exit3), true)));
var acquireDisposable = (acquire) => acquireRelease(acquire, (resource) => hasProperty(resource, Symbol.asyncDispose) ? promise(() => resource[Symbol.asyncDispose]()) : sync(() => resource[Symbol.dispose]()));
var cachedInvalidateWithTTL = /* @__PURE__ */ dual(2, (self, ttl) => sync(() => makeCachedUnsafe(self, typeof ttl === "function" ? (exit3) => toMillis(fromInputUnsafe(ttl(exit3))) : constant(toMillis(fromInputUnsafe(ttl))))));
var infiniteTTL = /* @__PURE__ */ constant(Infinity);
var makeCachedUnsafe = (self, ttlMillis) => {
  let expiresAt = 0;
  let exit3;
  let current;
  const join4 = (fiber3, run3) => {
    run3.awaiters++;
    onExitUnsafe(fiber3, () => {
      if (--run3.awaiters > 0 || current !== run3) return;
      current = void 0;
      return fiberInterrupt(run3.fiber);
    });
    return fiberJoin(run3.fiber);
  };
  return [withFiber((fiber3) => {
    if (current !== void 0) return join4(fiber3, current);
    if (exit3 !== void 0 && (expiresAt === Infinity || fiber3.getRef(ClockRef).currentTimeMillisUnsafe() < expiresAt)) {
      return exit3;
    }
    exit3 = void 0;
    const clock = fiber3.getRef(ClockRef);
    const run3 = {
      fiber: void 0,
      awaiters: 0
    };
    current = run3;
    run3.fiber = forkUnsafe(fiber3, onExitPrimitive(self, (exit_) => {
      if (current !== run3) return;
      current = void 0;
      if (exitHasInterrupts(exit_)) return;
      const duration = ttlMillis(exit_);
      expiresAt = duration === Infinity ? Infinity : clock.currentTimeMillisUnsafe() + duration;
      exit3 = exit_;
    }), true, true);
    return run3.fiber._exit ?? join4(fiber3, run3);
  }), sync(() => {
    exit3 = void 0;
  })];
};
var cachedWithTTL = /* @__PURE__ */ dual(2, (self, timeToLive) => map5(cachedInvalidateWithTTL(self, timeToLive), (tuple2) => tuple2[0]));
var cached = (self) => sync(() => makeCachedUnsafe(self, infiniteTTL)[0]);
var interrupt = /* @__PURE__ */ withFiber((fiber3) => failCause(causeInterrupt(fiber3.id)));
var uninterruptible = (self) => withFiber((fiber3) => {
  if (!fiber3.interruptible) return self;
  fiber3.interruptible = false;
  fiber3._stack.push(setInterruptibleTrue);
  return self;
});
var setInterruptible = /* @__PURE__ */ makePrimitive({
  op: "SetInterruptible",
  [contAll](fiber3) {
    fiber3.interruptible = this[args];
    if (fiber3._interruptedCause && fiber3.interruptible) {
      return () => failCause(fiber3._interruptedCause);
    }
  }
});
var setInterruptibleTrue = /* @__PURE__ */ setInterruptible(true);
var setInterruptibleFalse = /* @__PURE__ */ setInterruptible(false);
var setFiberInterruptible = (fiber3) => {
  fiber3.interruptible = true;
  fiber3._stack.push(setInterruptibleFalse);
  if (fiber3._interruptedCause) return failCause(fiber3._interruptedCause);
};
var fiberEnterUninterruptibleUnsafe = (fiber3) => {
  const impl = fiber3;
  if (!impl.interruptible) return;
  impl.interruptible = false;
  impl._stack.push(setInterruptibleTrue);
};
var interruptible = (self) => withFiber((fiber3) => {
  if (fiber3.interruptible) return self;
  return setFiberInterruptible(fiber3) ?? self;
});
var uninterruptibleMask = (f) => withFiber((fiber3) => {
  if (!fiber3.interruptible) return f(identity);
  fiber3.interruptible = false;
  fiber3._stack.push(setInterruptibleTrue);
  return f(interruptible);
});
var interruptibleMask = (f) => withFiber((fiber3) => {
  if (fiber3.interruptible) return f(identity);
  const interrupted = setFiberInterruptible(fiber3);
  const effect2 = f(uninterruptible);
  return interrupted ?? effect2;
});
var abortSignal = /* @__PURE__ */ map5(/* @__PURE__ */ acquireRelease(/* @__PURE__ */ sync(() => new AbortController()), (controller) => sync(() => controller.abort())), (_) => _.signal);
var all3 = (arg, options3) => {
  if (isIterable(arg)) {
    return options3?.mode === "result" ? forEach(arg, result, options3) : forEach(arg, identity, options3);
  } else if (options3?.discard) {
    return options3.mode === "result" ? forEach(Object.values(arg), result, options3) : forEach(Object.values(arg), identity, options3);
  }
  return suspend(() => {
    const out = {};
    return as2(forEach(Object.entries(arg), ([key, effect2]) => map5(options3?.mode === "result" ? result(effect2) : effect2, (value3) => {
      assignProperty(out, key, value3);
    }), {
      discard: true,
      concurrency: options3?.concurrency
    }), out);
  });
};
var partition2 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, f, options3) => map5(forEach(elements, (a, i) => result(f(a, i)), options3), (results2) => partition(results2, identity)));
var reduce = /* @__PURE__ */ dual(3, (elements, zero4, f) => {
  const arr = fromIterable2(elements);
  if (arr.length === 0) return sync(zero4);
  return suspend(() => {
    let index2 = 0;
    let state = zero4();
    return map5(whileLoop({
      while: () => index2 < arr.length,
      body: () => f(state, arr[index2], index2),
      step(next) {
        state = next;
        index2++;
      }
    }), () => state);
  });
});
var validate = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, f, options3) => flatMap3(partition2(elements, f, {
  concurrency: options3?.concurrency
}), ([passes, fails]) => {
  if (isArrayNonEmpty2(fails)) {
    return fail3(fails);
  }
  return options3?.discard ? void_2 : succeed3(passes);
}));
var findFirst3 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, predicate) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const next = iterator.next();
  if (!next.done) {
    return findFirstLoop(iterator, 0, predicate, next.value);
  }
  return succeed3(none2());
}));
var findFirstLoop = (iterator, index2, predicate, value3) => flatMap3(predicate(value3, index2), (keep) => {
  if (keep) {
    return succeed3(some2(value3));
  }
  const next = iterator.next();
  if (!next.done) {
    return findFirstLoop(iterator, index2 + 1, predicate, next.value);
  }
  return succeed3(none2());
});
var findFirstFilter = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, filter9) => suspend(() => {
  const iterator = elements[Symbol.iterator]();
  const next = iterator.next();
  if (!next.done) {
    return findFirstFilterLoop(iterator, 0, filter9, next.value);
  }
  return succeed3(none2());
}));
var findFirstFilterLoop = (iterator, index2, filter9, value3) => flatMap3(filter9(value3, index2), (result3) => {
  if (isSuccess2(result3)) {
    return succeed3(some2(result3.success));
  }
  const next = iterator.next();
  if (!next.done) {
    return findFirstFilterLoop(iterator, index2 + 1, filter9, next.value);
  }
  return succeed3(none2());
});
var whileLoop = /* @__PURE__ */ makePrimitive({
  op: "While",
  [contA](value3, fiber3) {
    this[args].step(value3);
    if (this[args].while()) {
      fiber3._stack.push(this);
      return this[args].body();
    }
    return exitVoid;
  },
  [evaluate](fiber3) {
    if (this[args].while()) {
      fiber3._stack.push(this);
      return this[args].body();
    }
    return exitVoid;
  }
});
var forEach = /* @__PURE__ */ dual((args2) => typeof args2[1] === "function", (iterable, f, options3) => suspend(() => {
  const concurrency = resolveConcurrency(options3?.concurrency);
  if (concurrency === 1) {
    return forEachSequential(iterable, f, options3);
  }
  const items = fromIterable2(iterable);
  let length = items.length;
  if (length === 0) {
    return options3?.discard ? void_2 : succeed3([]);
  }
  const out = options3?.discard ? void 0 : new Array(length);
  const eff = forEachConcurrent({
    f,
    out
  }, items, {
    concurrency
  });
  return eff ? as2(eff, out) : succeed3(out);
}));
var head = (self) => flatMap3(self, (elements) => {
  const result3 = elements[Symbol.iterator]().next();
  return result3.done ? fail3(new NoSuchElementError()) : succeed3(result3.value);
});
var forEachSequential = (iterable, f, options3) => suspend(() => {
  const out = options3?.discard ? void 0 : [];
  const iterator = iterable[Symbol.iterator]();
  let state = iterator.next();
  let index2 = 0;
  return as2(whileLoop({
    while: () => !state.done,
    body: () => f(state.value, index2++),
    step: (b) => {
      if (out) out.push(b);
      state = iterator.next();
    }
  }), out);
});
var resolveConcurrency = (concurrency) => concurrency === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrency ?? 1);
var iterateEager = () => (options3) => {
  const onItem = options3.onItem;
  const step = options3.step;
  const resumeSequential = (state, items, index2, end, effect2) => flatMap3(exit(effect2), (itemExit) => step(state, items[index2], itemExit, index2) ?? runSequential(state, items, index2 + 1, end) ?? void_2);
  const runSequential = (state, items, index2 = 0, end = items.length) => {
    for (; index2 < end; index2++) {
      const item = items[index2];
      const effect2 = onItem(state, item, index2);
      if (!effectIsExit(effect2)) {
        return resumeSequential(state, items, index2, end, effect2);
      }
      const terminal = step(state, item, effect2, index2);
      if (terminal) return terminal._tag === "Failure" ? terminal : void 0;
    }
  };
  return runSequential;
};
var iterateConcurrentImpl = (options3) => {
  const onItem = options3.onItem;
  const step = options3.step;
  return (state, items, opts) => {
    let index2 = 0;
    const end = opts.end ?? items.length;
    const concurrency = opts.concurrency;
    let done3 = false;
    let parentFiber;
    let fibers;
    let resume;
    let terminal;
    let effect2;
    const failDefect = (error) => {
      const defect = exitDie(error);
      terminal = defect;
      done3 = true;
      return fibers && fibers.size > 0 ? flatMap3(uninterruptible(fiberInterruptAll(Array.from(fibers))), () => terminal ?? defect) : defect;
    };
    const go = () => {
      let paused = false;
      for (; !terminal && index2 < end; index2++) {
        const item = items[index2];
        const eff = effect2 ?? onItem(state, item, index2);
        if (effectIsExit(eff)) {
          terminal = step(state, item, eff, index2);
          if (terminal) break;
        } else if (!parentFiber) {
          return callback((cb) => {
            parentFiber = getCurrentFiber();
            fibers = /* @__PURE__ */ new Set();
            effect2 = eff;
            resume = cb;
            let result3;
            try {
              result3 = go();
            } catch (error) {
              return cb(failDefect(error));
            }
            if (result3) return cb(result3);
            return suspend(() => {
              terminal ??= exitVoid;
              return flatMap3(fibers ? fiberInterruptAll(fibers) : void_2, () => terminal?._tag === "Failure" ? terminal : void_2);
            });
          });
        } else {
          effect2 = void 0;
          const fiber3 = forkUnsafe(parentFiber, eff, true, true, "inherit");
          if (fiber3._exit) {
            terminal = step(state, item, fiber3._exit, index2);
            if (terminal) break;
            continue;
          }
          fibers.add(fiber3);
          const currentIndex = index2;
          fiber3.addObserver((exit3) => {
            fibers.delete(fiber3);
            try {
              if (terminal) {
                if (exit3._tag === "Failure") {
                  const reasons = exit3.cause.reasons.filter((reason) => reason._tag !== "Interrupt");
                  if (reasons.length > 0) {
                    const cause = causeFromReasons(reasons);
                    terminal = exitFailCause(terminal._tag === "Failure" ? causeCombine(terminal.cause, cause) : cause);
                  }
                }
              } else {
                const result3 = step(state, item, exit3, currentIndex);
                if (result3) {
                  terminal = result3;
                  go();
                }
              }
              if (paused) {
                const eff2 = go();
                if (eff2) resume(eff2);
              } else if (done3 && fibers.size === 0) {
                resume(terminal ?? void_2);
              }
            } catch (error) {
              resume(failDefect(error));
            }
          });
          if (fibers.size < concurrency) continue;
          paused = true;
          index2++;
          return;
        }
      }
      done3 = true;
      if (terminal) {
        if (fibers && fibers.size > 0) {
          const annotations = fiberStackAnnotations(parentFiber);
          fibers.forEach((f) => f.interruptUnsafe(parentFiber.id, annotations));
          return;
        }
        if (resume || terminal._tag === "Failure") {
          return terminal;
        }
      } else if (resume) {
        if (!fibers) {
          return exitVoid;
        } else if (fibers.size === 0) {
          resume(void_2);
        }
      }
    };
    return go();
  };
};
var iterateConcurrent = () => (options3) => iterateConcurrentImpl(options3);
var forEachConcurrent = /* @__PURE__ */ iterateConcurrentImpl({
  onItem(state, item, index2) {
    return state.f(item, index2);
  },
  step(state, _, exit3, index2) {
    if (exit3._tag === "Failure") return exit3;
    else if (state.out) {
      state.out[index2] = exit3.value;
    }
  }
});
var filterOrElse = /* @__PURE__ */ dual(3, (self, predicate, orElse2) => flatMap3(self, (a) => predicate(a) ? succeed3(a) : orElse2(a)));
var filterMapOrElse = /* @__PURE__ */ dual(3, (self, filter9, orElse2) => flatMap3(self, (a) => {
  const result3 = filter9(a);
  return isFailure2(result3) ? orElse2(result3.failure) : succeed3(result3.success);
}));
var filterMapOrFail = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, filter9, orFailWith) => filterMapOrElse(self, filter9, orFailWith ? (x) => fail3(orFailWith(x)) : () => fail3(new NoSuchElementError())));
var filter4 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, predicate, options3) => suspend(() => {
  const out = [];
  return as2(forEach(elements, (a, i) => {
    const result3 = predicate(a, i);
    if (typeof result3 === "boolean") {
      if (result3) out.push(a);
      return void_2;
    }
    return map5(result3, (keep) => {
      if (keep) {
        out.push(a);
      }
    });
  }, {
    discard: true,
    concurrency: options3?.concurrency
  }), out);
}));
var filterMap2 = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, filter9) => suspend(() => {
  const out = [];
  for (const a of elements) {
    const result3 = filter9(a);
    if (isSuccess2(result3)) {
      out.push(result3.success);
    }
  }
  return succeed3(out);
}));
var filterMapEffect = /* @__PURE__ */ dual((args2) => isIterable(args2[0]) && !isEffect(args2[0]), (elements, filter9, options3) => suspend(() => {
  const out = [];
  return as2(forEach(elements, (a) => map5(filter9(a), (result3) => {
    if (isSuccess2(result3)) {
      out.push(result3.success);
    }
  }), {
    discard: true,
    concurrency: options3?.concurrency
  }), out);
}));
var Do2 = /* @__PURE__ */ succeed3({});
var bindTo3 = /* @__PURE__ */ bindTo(map5);
var bind3 = /* @__PURE__ */ bind(map5, flatMap3);
var let_3 = /* @__PURE__ */ let_(map5);
var forkChild = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options3) => withFiber((fiber3) => {
  interruptChildrenPatch();
  return succeed3(forkUnsafe(fiber3, self, options3?.startImmediately, false, options3?.uninterruptible ?? false));
}));
var forkUnsafe = (parent, effect2, immediate = false, daemon = false, uninterruptible3 = false) => {
  const parentRuntime = parent;
  const interruptible3 = uninterruptible3 === "inherit" ? parentRuntime.interruptible : !uninterruptible3;
  const child = new FiberImpl(parentRuntime.context, interruptible3);
  if (immediate) {
    child.evaluate(effect2);
  } else {
    child._asyncContext = captureAsyncContext();
    parentRuntime.currentDispatcher.scheduleTask(() => child.evaluate(effect2), 0);
  }
  if (!daemon && !child._exit) {
    parentRuntime.children().add(child);
    child._parent = parentRuntime;
  }
  return child;
};
var forkDetach = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options3) => withFiber((fiber3) => succeed3(forkUnsafe(fiber3, self, options3?.startImmediately, true, options3?.uninterruptible))));
var awaitAllChildren = (self) => withFiber((fiber3) => {
  const initialChildren = fiber3._children && new Set(fiber3._children);
  const isInterruptible = fiber3.interruptible;
  return onExitPrimitive(self, (_) => {
    let children = fiber3._children;
    if (children === void 0 || children.size === 0) {
      return void_2;
    } else if (initialChildren) {
      children = filter2(children, (child) => !initialChildren.has(child));
    }
    const awaitChildren = asVoid2(fiberAwaitAll(children));
    return isInterruptible ? interruptible(awaitChildren) : awaitChildren;
  });
});
var forkIn = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, scope3, options3) => withFiber((parent) => {
  const fiber3 = forkUnsafe(parent, self, options3?.startImmediately, true, options3?.uninterruptible);
  if (!fiber3._exit) {
    if (scope3.state._tag !== "Closed") {
      const key = {};
      const finalizer = () => withFiberId((interruptor) => interruptor === fiber3.id ? void_2 : fiberInterrupt(fiber3));
      scopeAddFinalizerUnsafe(scope3, key, finalizer);
      fiber3.addObserver(() => scopeRemoveFinalizerUnsafe(scope3, key));
    } else {
      fiber3.interruptUnsafe(parent.id, fiberStackAnnotations(parent));
    }
  }
  return succeed3(fiber3);
}));
var forkScoped = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options3) => flatMap3(scope, (scope3) => forkIn(self, scope3, options3)));
var runForkWith = (context3) => (effect2, options3) => {
  const fiber3 = new FiberImpl(options3?.scheduler ? add(context3, Scheduler, options3.scheduler) : context3, options3?.uninterruptible !== true);
  fiber3.evaluate(effect2);
  if (fiber3._exit) return fiber3;
  if (options3?.signal) {
    if (options3.signal.aborted) {
      fiber3.interruptUnsafe();
    } else {
      const abort = () => fiber3.interruptUnsafe();
      options3.signal.addEventListener("abort", abort, {
        once: true
      });
      fiber3.addObserver(() => options3.signal.removeEventListener("abort", abort));
    }
  }
  if (options3?.onFiberStart) {
    options3.onFiberStart(fiber3);
  }
  return fiber3;
};
var runFork = /* @__PURE__ */ runForkWith(/* @__PURE__ */ empty());
var runCallbackWith = (context3) => {
  const runFork3 = runForkWith(context3);
  return (effect2, options3) => {
    const fiber3 = runFork3(effect2, options3);
    if (options3?.onExit) {
      fiber3.addObserver(options3.onExit);
    }
    return (interruptor) => {
      return fiber3.interruptUnsafe(interruptor);
    };
  };
};
var runCallback = /* @__PURE__ */ runCallbackWith(/* @__PURE__ */ empty());
var runPromiseExitWith = (context3) => {
  const runFork3 = runForkWith(context3);
  return (effect2, options3) => {
    const fiber3 = runFork3(effect2, options3);
    return new Promise((resolve6) => {
      fiber3.addObserver((exit3) => resolve6(exit3));
    });
  };
};
var runPromiseExit = /* @__PURE__ */ runPromiseExitWith(/* @__PURE__ */ empty());
var runPromiseWith = (context3) => {
  const runPromiseExit3 = runPromiseExitWith(context3);
  return (effect2, options3) => runPromiseExit3(effect2, options3).then((exit3) => {
    if (exit3._tag === "Failure") {
      throw causeSquash(exit3.cause);
    }
    return exit3.value;
  });
};
var runPromise = /* @__PURE__ */ runPromiseWith(/* @__PURE__ */ empty());
var runSyncExitWith = (context3) => {
  const runFork3 = runForkWith(context3);
  return (effect2) => {
    if (effectIsExit(effect2)) return effect2;
    const scheduler = new MixedScheduler("sync");
    const fiber3 = runFork3(effect2, {
      scheduler
    });
    fiber3._dispatcher?.flush();
    return fiber3._exit ?? exitDie(new AsyncFiberError(fiber3));
  };
};
var runSyncExit = /* @__PURE__ */ runSyncExitWith(/* @__PURE__ */ empty());
var runSyncWith = (context3) => {
  const runSyncExit3 = runSyncExitWith(context3);
  return (effect2) => {
    const exit3 = runSyncExit3(effect2);
    if (exit3._tag === "Failure") throw causeSquash(exit3.cause);
    return exit3.value;
  };
};
var runSync = /* @__PURE__ */ runSyncWith(/* @__PURE__ */ empty());
var succeedTrue = /* @__PURE__ */ succeed3(true);
var succeedFalse = /* @__PURE__ */ succeed3(false);
var Latch = class {
  waiters = [];
  scheduled = void 0;
  _isOpen;
  constructor(isOpen) {
    this._isOpen = isOpen;
  }
  scheduleUnsafe(fiber3) {
    if (this.waiters.length === 0) {
      return succeedTrue;
    }
    if (this.scheduled === void 0) {
      this.scheduled = this.waiters;
      fiber3.currentDispatcher.scheduleTask(this.flushScheduled, 0);
    } else {
      for (let i = 0; i < this.waiters.length; i++) {
        this.scheduled.push(this.waiters[i]);
      }
    }
    this.waiters = [];
    return succeedTrue;
  }
  flushScheduled = () => {
    if (this.scheduled === void 0) return;
    const waiters = this.scheduled;
    this.scheduled = void 0;
    for (let i = 0; i < waiters.length; i++) {
      waiters[i](exitVoid);
    }
  };
  flushWaiters() {
    const waiters = this.waiters;
    this.waiters = [];
    this.flushScheduled();
    for (let i = 0; i < waiters.length; i++) {
      waiters[i](exitVoid);
    }
  }
  open = /* @__PURE__ */ withFiber((fiber3) => {
    if (this._isOpen) return succeedFalse;
    this._isOpen = true;
    return this.scheduleUnsafe(fiber3);
  });
  release = /* @__PURE__ */ withFiber((fiber3) => this._isOpen ? succeedFalse : this.scheduleUnsafe(fiber3));
  openUnsafe() {
    if (this._isOpen) return false;
    this._isOpen = true;
    this.flushWaiters();
    return true;
  }
  await = /* @__PURE__ */ callback((resume) => {
    if (this._isOpen) {
      return resume(void_2);
    }
    this.waiters.push(resume);
    return sync(() => {
      let index2 = this.waiters.indexOf(resume);
      if (index2 !== -1) {
        this.waiters.splice(index2, 1);
      } else if (this.scheduled !== void 0) {
        index2 = this.scheduled.indexOf(resume);
        if (index2 !== -1) {
          this.scheduled.splice(index2, 1);
        }
      }
    });
  });
  closeUnsafe() {
    if (!this._isOpen) return false;
    this._isOpen = false;
    return true;
  }
  close = /* @__PURE__ */ sync(() => this.closeUnsafe());
  whenOpen = (self) => flatMap3(this.await, () => self);
  isOpen() {
    return this._isOpen;
  }
};
var makeLatchUnsafe = (open3) => new Latch(open3 ?? false);
var tracer = /* @__PURE__ */ withFiber((fiber3) => succeed3(fiber3.getRef(Tracer)));
var withTracer = /* @__PURE__ */ dual(2, (effect2, tracer3) => provideService(effect2, Tracer, tracer3));
var withTracerEnabled = /* @__PURE__ */ provideService(TracerEnabled);
var withTracerTiming = /* @__PURE__ */ provideService(TracerTimingEnabled);
var bigint02 = /* @__PURE__ */ BigInt(0);
var NoopSpanProto = {
  _tag: "Span",
  spanId: "noop",
  traceId: "noop",
  sampled: false,
  status: {
    _tag: "Ended",
    startTime: bigint02,
    endTime: bigint02,
    exit: exitVoid
  },
  attributes: /* @__PURE__ */ new Map(),
  links: [],
  kind: "internal",
  attribute() {
  },
  event() {
  },
  end() {
  },
  addLinks() {
  }
};
var noopSpan = (options3) => Object.assign(Object.create(NoopSpanProto), options3);
var filterDisablePropagation = (span2) => {
  if (!span2) return none2();
  return get(span2.annotations, DisablePropagation) ? span2._tag === "Span" ? filterDisablePropagation(getOrUndefined(span2.parent)) : none2() : some2(span2);
};
var makeSpanUnsafe = (fiber3, name, options3) => {
  const disablePropagation = !fiber3.cache.tracerEnabled || options3?.annotations && get(options3.annotations, DisablePropagation);
  const parent = options3?.parent !== void 0 ? some2(options3.parent) : options3?.root ? none2() : filterDisablePropagation(fiber3.cache.span);
  let span2;
  if (disablePropagation) {
    span2 = noopSpan({
      name,
      parent,
      annotations: add(options3?.annotations ?? empty(), DisablePropagation, true)
    });
  } else {
    const tracer3 = fiber3.cache.tracer ?? nativeTracer;
    const clock = fiber3.getRef(ClockRef);
    const timingEnabled = fiber3.getRef(TracerTimingEnabled);
    const annotationsFromEnv = fiber3.getRef(TracerSpanAnnotations);
    const linksFromEnv = fiber3.getRef(TracerSpanLinks);
    const level = options3?.level ?? fiber3.getRef(CurrentTraceLevel);
    const links = options3?.links !== void 0 ? [...linksFromEnv, ...options3.links] : linksFromEnv.length === 0 ? [] : linksFromEnv.slice();
    span2 = tracer3.span({
      name,
      parent,
      annotations: options3?.annotations ?? empty(),
      links,
      startTime: timingEnabled ? clock.currentTimeNanosUnsafe() : bigint02,
      kind: options3?.kind ?? "internal",
      root: options3?.root ?? isNone2(parent),
      sampled: options3?.sampled ?? (isSome2(parent) && parent.value.sampled === false ? false : !isLogLevelGreaterThan(fiber3.getRef(MinimumTraceLevel), level))
    });
    for (const key in annotationsFromEnv) {
      span2.attribute(key, annotationsFromEnv[key]);
    }
    if (options3?.attributes !== void 0) {
      for (const key in options3.attributes) {
        span2.attribute(key, options3.attributes[key]);
      }
    }
  }
  return span2;
};
var makeSpan = (name, options3) => withFiber((fiber3) => succeed3(makeSpanUnsafe(fiber3, name, options3)));
var makeSpanScoped = (name, options3) => uninterruptible(withFiber((fiber3) => {
  const scope3 = getUnsafe(fiber3.context, scopeTag);
  const span2 = makeSpanUnsafe(fiber3, name, options3 ?? {});
  const clock = fiber3.getRef(ClockRef);
  const timingEnabled = fiber3.getRef(TracerTimingEnabled);
  return as2(scopeAddFinalizerExit(scope3, (exit3) => endSpan(span2, exit3, clock, timingEnabled)), span2);
}));
var withSpanScoped = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const options3 = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
  if (dataFirst) {
    const self = arguments[0];
    return flatMap3(makeSpanScoped(name, options3), (span2) => withParentSpan(self, span2, options3));
  }
  return (self) => flatMap3(makeSpanScoped(name, options3), (span2) => withParentSpan(self, span2, options3));
};
var provideSpanStackFrame = (name, stack) => {
  stack = typeof stack === "function" ? stack : constUndefined;
  return updateService(CurrentStackFrame, (parent) => ({
    name,
    stack,
    parent
  }));
};
var spanAnnotations = TracerSpanAnnotations;
var spanLinks = TracerSpanLinks;
var linkSpans = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, span2, attributes = {}) => {
  const spans = Array.isArray(span2) ? span2 : [span2];
  const links = spans.map((span3) => ({
    span: span3,
    attributes
  }));
  return updateService(self, TracerSpanLinks, (current) => [...current, ...links]);
});
var endSpan = (span2, exit3, clock, timingEnabled) => sync(() => {
  if (span2.status._tag === "Ended") return;
  span2.end(timingEnabled ? clock.currentTimeNanosUnsafe() : bigint02, exit3);
});
var useSpan = (name, ...args2) => {
  const options3 = args2.length === 1 ? void 0 : args2[0];
  const evaluate2 = args2[args2.length - 1];
  return withFiber((fiber3) => {
    const span2 = makeSpanUnsafe(fiber3, name, options3);
    const clock = fiber3.getRef(ClockRef);
    const timingEnabled = fiber3.getRef(TracerTimingEnabled);
    onExitUnsafe(fiber3, (exit3) => endSpan(span2, exit3, clock, timingEnabled));
    return evaluate2(span2);
  });
};
var provideParentSpan = /* @__PURE__ */ provideService(ParentSpan);
var withParentSpan = function() {
  const dataFirst = isEffect(arguments[0]);
  const span2 = dataFirst ? arguments[1] : arguments[0];
  let options3 = dataFirst ? arguments[2] : arguments[1];
  let provideStackFrame = identity;
  if (span2._tag === "Span") {
    options3 = addSpanStackTrace(options3);
    provideStackFrame = provideSpanStackFrame(span2.name, options3?.captureStackTrace);
  }
  if (dataFirst) {
    return provideParentSpan(provideStackFrame(arguments[0]), span2);
  }
  return (self) => provideParentSpan(provideStackFrame(self), span2);
};
var withSpan = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const traceOptions = addSpanStackTrace(arguments[2]);
  if (dataFirst) {
    const self = arguments[0];
    return useSpan(name, arguments[2], (span2) => withParentSpan(self, span2, traceOptions));
  }
  const fnArg = typeof arguments[1] === "function" ? arguments[1] : void 0;
  const options3 = fnArg ? void 0 : arguments[1];
  return (self, ...args2) => useSpan(name, fnArg ? fnArg(...args2) : options3, (span2) => withParentSpan(self, span2, traceOptions));
};
var annotateSpans = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (effect2, ...args2) => updateService(effect2, TracerSpanAnnotations, (annotations) => {
  const newAnnotations = args2.length === 1 ? {
    ...annotations,
    ...args2[0]
  } : {
    ...annotations
  };
  if (args2.length === 1) {
    return newAnnotations;
  } else {
    assignProperty(newAnnotations, args2[0], args2[1]);
  }
  return newAnnotations;
}));
var annotateCurrentSpan = (...args2) => withFiber((fiber3) => {
  const span2 = fiber3.currentSpanLocal;
  if (span2) {
    if (args2.length === 1) {
      for (const [key, value3] of Object.entries(args2[0])) {
        span2.attribute(key, value3);
      }
    } else {
      span2.attribute(args2[0], args2[1]);
    }
  }
  return void_2;
});
var currentSpan = /* @__PURE__ */ withFiber((fiber3) => {
  const span2 = fiber3.currentSpanLocal;
  return span2 ? succeed3(span2) : fail3(new NoSuchElementError());
});
var currentParentSpan = /* @__PURE__ */ serviceOptional(ParentSpan);
var ClockRef = /* @__PURE__ */ Reference("effect/Clock", {
  defaultValue: () => new ClockImpl()
});
var MAX_TIMER_MILLIS = 2 ** 31 - 1;
var ClockImpl = class {
  currentTimeMillisUnsafe() {
    return Date.now();
  }
  currentTimeMillis = /* @__PURE__ */ sync(() => this.currentTimeMillisUnsafe());
  currentTimeNanosUnsafe() {
    return wallTimeNanos();
  }
  currentTimeNanos = /* @__PURE__ */ sync(() => this.currentTimeNanosUnsafe());
  monotonicTimeNanosUnsafe() {
    return monotonicNowNanos();
  }
  monotonicTimeNanos = /* @__PURE__ */ sync(() => this.monotonicTimeNanosUnsafe());
  sleep(duration) {
    return this.sleepMillis(toMillis(duration));
  }
  sleepMillis(millis2) {
    if (millis2 <= 0) return yieldNow;
    else if (!Number.isFinite(millis2)) return never;
    return callback((resume) => {
      const continuation = millis2 > MAX_TIMER_MILLIS ? this.sleepMillis(millis2 - MAX_TIMER_MILLIS) : void_2;
      const handle = setTimeout(() => resume(continuation), Math.min(millis2, MAX_TIMER_MILLIS));
      return sync(() => clearTimeout(handle));
    });
  }
};
var nanosPerMilli = /* @__PURE__ */ BigInt(1e6);
var monotonicNowNanos = /* @__PURE__ */ (function() {
  const processHrtime = globalThis.process?.hrtime;
  if (typeof processHrtime?.bigint === "function") {
    return () => processHrtime.bigint();
  }
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return () => BigInt(Math.round(performance.now() * 1e6));
  }
  let previous = /* @__PURE__ */ BigInt(0);
  return () => {
    const current = BigInt(Date.now()) * nanosPerMilli;
    if (current > previous) {
      previous = current;
    }
    return previous;
  };
})();
var wallTimeNanos = /* @__PURE__ */ (function() {
  const reanchorThresholdNanos = /* @__PURE__ */ BigInt(1e9);
  let origin;
  return () => {
    const monotonic = monotonicNowNanos();
    const wall = BigInt(Date.now()) * nanosPerMilli;
    if (origin === void 0) {
      origin = wall - monotonic;
    } else {
      const projected = origin + monotonic;
      const skew = wall > projected ? wall - projected : projected - wall;
      if (skew > reanchorThresholdNanos) {
        origin = wall - monotonic;
      }
    }
    return origin + monotonic;
  };
})();
var clockWith = (f) => withFiber((fiber3) => f(fiber3.getRef(ClockRef)));
var sleep = (duration) => clockWith((clock) => clock.sleep(fromInputUnsafe(duration)));
var currentTimeMillis = /* @__PURE__ */ clockWith((clock) => clock.currentTimeMillis);
var currentTimeNanos = /* @__PURE__ */ clockWith((clock) => clock.currentTimeNanos);
var monotonicTimeNanos = /* @__PURE__ */ clockWith((clock) => clock.monotonicTimeNanos);
var TimeoutErrorTypeId = "~effect/Cause/TimeoutError";
var isTimeoutError = (u) => hasProperty(u, TimeoutErrorTypeId);
var TimeoutError = class extends (/* @__PURE__ */ TaggedError("TimeoutError")) {
  [TimeoutErrorTypeId] = TimeoutErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var IllegalArgumentErrorTypeId = "~effect/Cause/IllegalArgumentError";
var IllegalArgumentError = class extends (/* @__PURE__ */ TaggedError("IllegalArgumentError")) {
  [IllegalArgumentErrorTypeId] = IllegalArgumentErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var ExceededCapacityErrorTypeId = "~effect/Cause/ExceededCapacityError";
var ExceededCapacityError = class extends (/* @__PURE__ */ TaggedError("ExceededCapacityError")) {
  [ExceededCapacityErrorTypeId] = ExceededCapacityErrorTypeId;
  constructor(message) {
    super({
      message
    });
  }
};
var AsyncFiberErrorTypeId = "~effect/Cause/AsyncFiberError";
var AsyncFiberError = class extends (/* @__PURE__ */ TaggedError("AsyncFiberError")) {
  [AsyncFiberErrorTypeId] = AsyncFiberErrorTypeId;
  constructor(fiber3) {
    super({
      message: "An asynchronous Effect was executed with Effect.runSync",
      fiber: fiber3
    });
  }
};
var UnknownErrorTypeId = "~effect/Cause/UnknownError";
var UnknownError = class extends (/* @__PURE__ */ TaggedError("UnknownError")) {
  [UnknownErrorTypeId] = UnknownErrorTypeId;
  constructor(cause, message) {
    super({
      message,
      cause
    });
  }
};
var ConsoleRef = /* @__PURE__ */ Reference("effect/Console", {
  defaultValue: () => globalThis.console
});
var logLevelToOrder = (level) => {
  switch (level) {
    case "All":
      return Number.MIN_SAFE_INTEGER;
    case "Fatal":
      return 5e4;
    case "Error":
      return 4e4;
    case "Warn":
      return 3e4;
    case "Info":
      return 2e4;
    case "Debug":
      return 1e4;
    case "Trace":
      return 0;
    case "None":
      return Number.MAX_SAFE_INTEGER;
  }
};
var LogLevelOrder = /* @__PURE__ */ mapInput(Number2, logLevelToOrder);
var isLogLevelGreaterThan = /* @__PURE__ */ isGreaterThan(LogLevelOrder);
var CurrentLoggers = /* @__PURE__ */ Reference("effect/Logger/CurrentLoggers", {
  defaultValue: () => /* @__PURE__ */ new Set([defaultLogger, tracerLogger])
});
var LogToStderr = /* @__PURE__ */ Reference("effect/Logger/LogToStderr", {
  defaultValue: constFalse
});
var annotateLogsScoped = function() {
  const entries3 = typeof arguments[0] === "string" ? [[arguments[0], arguments[1]]] : Object.entries(arguments[0]);
  return uninterruptible(withFiber((fiber3) => {
    const prev = fiber3.getRef(CurrentLogAnnotations);
    const next = {
      ...prev
    };
    for (let i = 0; i < entries3.length; i++) {
      const [key, value3] = entries3[i];
      assignProperty(next, key, value3);
    }
    fiber3.setContext(add(fiber3.context, CurrentLogAnnotations, next));
    return scopeAddFinalizerExit(getUnsafe(fiber3.context, scopeTag), (_) => {
      const current = fiber3.getRef(CurrentLogAnnotations);
      const next2 = {
        ...current
      };
      for (let i = 0; i < entries3.length; i++) {
        const [key, value3] = entries3[i];
        if (current[key] !== value3 && !Object.is(current[key], value3)) continue;
        if (Object.hasOwn(prev, key)) {
          assignProperty(next2, key, prev[key]);
        } else {
          delete next2[key];
        }
      }
      fiber3.setContext(add(fiber3.context, CurrentLogAnnotations, next2));
      return void_2;
    });
  }));
};
var LoggerTypeId = "~effect/Logger";
var LoggerProto = {
  [LoggerTypeId]: {
    _Message: identity,
    _Output: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var loggerMake = (log2) => {
  const self = Object.create(LoggerProto);
  self.log = log2;
  return self;
};
var formatLabel = (key) => key.replace(/[\s="]/g, "_");
var formatLogSpan = (self, now2) => {
  const label = formatLabel(self[0]);
  return `${label}=${now2 - self[1]}ms`;
};
var logWithLevel = (level) => (...message) => {
  let cause = void 0;
  for (let i = 0, len = message.length; i < len; i++) {
    const msg = message[i];
    if (isCause(msg)) {
      if (cause) {
        ;
        message.splice(i, 1);
      } else {
        message = message.slice(0, i).concat(message.slice(i + 1));
      }
      cause = cause ? causeFromReasons(cause.reasons.concat(msg.reasons)) : msg;
      i--;
    }
  }
  if (cause === void 0) {
    cause = causeEmpty;
  }
  return withFiber((fiber3) => {
    const logLevel = level ?? fiber3.cache.logLevel;
    if (isLogLevelGreaterThan(fiber3.cache.minimumLogLevel, logLevel)) {
      return void_2;
    }
    const clock = fiber3.getRef(ClockRef);
    const loggers = fiber3.getRef(CurrentLoggers);
    if (loggers.size > 0) {
      const date = new Date(clock.currentTimeMillisUnsafe());
      for (const logger of loggers) {
        logger.log({
          cause,
          fiber: fiber3,
          date,
          logLevel,
          message
        });
      }
    }
    return void_2;
  });
};
var colors = {
  bold: "1",
  red: "31",
  green: "32",
  yellow: "33",
  blue: "34",
  cyan: "36",
  white: "37",
  gray: "90",
  black: "30",
  bgBrightRed: "101"
};
var logLevelColors = {
  None: [],
  All: [],
  Trace: [colors.gray],
  Debug: [colors.blue],
  Info: [colors.green],
  Warn: [colors.yellow],
  Error: [colors.red],
  Fatal: [colors.bgBrightRed, colors.black]
};
var defaultDateFormat = (date) => `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
var defaultLogger = /* @__PURE__ */ loggerMake(({
  cause,
  date,
  fiber: fiber3,
  logLevel,
  message
}) => {
  const message_ = Array.isArray(message) ? message.slice() : [message];
  if (cause.reasons.length > 0) {
    message_.push(causePretty(cause));
  }
  const now2 = date.getTime();
  const spans = fiber3.getRef(CurrentLogSpans);
  let spanString = "";
  for (const span2 of spans) {
    spanString += ` ${formatLogSpan(span2, now2)}`;
  }
  const annotations = fiber3.getRef(CurrentLogAnnotations);
  if (Object.keys(annotations).length > 0) {
    message_.push(annotations);
  }
  const console2 = fiber3.getRef(ConsoleRef);
  const log2 = fiber3.getRef(LogToStderr) ? console2.error : console2.log;
  log2(`[${defaultDateFormat(date)}] ${logLevel.toUpperCase()} (#${fiber3.id})${spanString}:`, ...message_);
});
var tracerLogger = /* @__PURE__ */ loggerMake(({
  cause,
  fiber: fiber3,
  logLevel,
  message
}) => {
  const clock = fiber3.getRef(ClockRef);
  const annotations = fiber3.getRef(CurrentLogAnnotations);
  const span2 = fiber3.cache.span;
  if (span2 === void 0 || span2._tag === "ExternalSpan") return;
  const attributes = {};
  for (const [key, value3] of Object.entries(annotations)) {
    assignProperty(attributes, key, value3);
  }
  attributes["effect.fiberId"] = fiber3.id;
  attributes["effect.logLevel"] = logLevel.toUpperCase();
  if (cause.reasons.length > 0) {
    attributes["effect.cause"] = causePretty(cause);
  }
  span2.event(toStringUnknown(Array.isArray(message) && message.length === 1 ? message[0] : message), clock.currentTimeNanosUnsafe(), attributes);
});
function interruptChildrenPatch() {
  fiberMiddleware.interruptChildren ??= fiberInterruptChildren;
}
var undefined_ = /* @__PURE__ */ succeed3(void 0);
var withErrorReporting = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, options3) => onError(self, (cause) => withFiber((fiber3) => {
  reportCauseUnsafe(fiber3, cause, options3?.defectsOnly);
  return void_2;
})));
var reportCauseUnsafe = (fiber3, cause, defectsOnly) => {
  const reporters = fiber3.getRef(CurrentErrorReporters);
  if (reporters.size === 0) return;
  if (defectsOnly && !hasDies(cause)) return;
  const opts = {
    cause,
    fiber: fiber3,
    timestamp: fiber3.getRef(ClockRef).currentTimeNanosUnsafe()
  };
  reporters.forEach((reporter) => reporter.report(opts));
};

// ../../node_modules/effect/dist/Cause.js
var isCause2 = isCause;
var isReason = isCauseReason;
var isFailReason2 = isFailReason;
var fromReasons = causeFromReasons;
var fail4 = causeFail;
var die2 = causeDie;
var makeFailReason = (error) => new Fail(error);
var makeDieReason = (defect) => new Die(defect);
var makeInterruptReason2 = makeInterruptReason;
var map6 = causeMap;
var squash = causeSquash;
var hasInterrupts2 = hasInterrupts;
var pretty = causePretty;
var isDone2 = isDone;
var done2 = done;
var isTimeoutError2 = isTimeoutError;
var IllegalArgumentError2 = IllegalArgumentError;

// ../../node_modules/effect/dist/Effect.js
var Effect_exports = {};
__export(Effect_exports, {
  Do: () => Do3,
  Transaction: () => Transaction,
  TypeId: () => TypeId12,
  abortSignal: () => abortSignal2,
  acquireDisposable: () => acquireDisposable2,
  acquireRelease: () => acquireRelease2,
  acquireUseRelease: () => acquireUseRelease2,
  addFinalizer: () => addFinalizer3,
  all: () => all4,
  andThen: () => andThen3,
  annotateCurrentSpan: () => annotateCurrentSpan2,
  annotateLogs: () => annotateLogs,
  annotateLogsScoped: () => annotateLogsScoped2,
  annotateSpans: () => annotateSpans2,
  as: () => as3,
  asSome: () => asSome2,
  asVoid: () => asVoid3,
  awaitAllChildren: () => awaitAllChildren2,
  bind: () => bind4,
  bindTo: () => bindTo4,
  cached: () => cached2,
  cachedInvalidateWithTTL: () => cachedInvalidateWithTTL2,
  cachedWithTTL: () => cachedWithTTL2,
  callback: () => callback2,
  catch: () => catch_3,
  catchCause: () => catchCause3,
  catchCauseFilter: () => catchCauseFilter2,
  catchCauseIf: () => catchCauseIf2,
  catchDefect: () => catchDefect2,
  catchEager: () => catchEager2,
  catchFilter: () => catchFilter2,
  catchIf: () => catchIf2,
  catchNoSuchElement: () => catchNoSuchElement2,
  catchReason: () => catchReason2,
  catchReasons: () => catchReasons2,
  catchTag: () => catchTag3,
  catchTags: () => catchTags2,
  clockWith: () => clockWith3,
  context: () => context2,
  contextWith: () => contextWith2,
  currentParentSpan: () => currentParentSpan2,
  currentSpan: () => currentSpan2,
  delay: () => delay2,
  die: () => die3,
  effectify: () => effectify,
  ensuring: () => ensuring2,
  eventually: () => eventually2,
  exit: () => exit2,
  fail: () => fail6,
  failCause: () => failCause3,
  failCauseSync: () => failCauseSync2,
  failSync: () => failSync2,
  fiber: () => fiber2,
  fiberId: () => fiberId2,
  filter: () => filter5,
  filterMap: () => filterMap3,
  filterMapEffect: () => filterMapEffect2,
  filterMapOrElse: () => filterMapOrElse2,
  filterMapOrFail: () => filterMapOrFail2,
  filterOrElse: () => filterOrElse2,
  filterOrFail: () => filterOrFail2,
  findFirst: () => findFirst4,
  findFirstFilter: () => findFirstFilter2,
  firstSuccessOf: () => firstSuccessOf2,
  flatMap: () => flatMap5,
  flatMapEager: () => flatMapEager2,
  flatten: () => flatten4,
  flip: () => flip2,
  fn: () => fn2,
  fnUntraced: () => fnUntraced2,
  fnUntracedEager: () => fnUntracedEager2,
  forEach: () => forEach2,
  forever: () => forever3,
  forkChild: () => forkChild2,
  forkDetach: () => forkDetach2,
  forkIn: () => forkIn2,
  forkScoped: () => forkScoped2,
  fromNullishOr: () => fromNullishOr3,
  fromOption: () => fromOption3,
  fromResult: () => fromResult2,
  gen: () => gen3,
  head: () => head2,
  ignore: () => ignore2,
  ignoreCause: () => ignoreCause2,
  interrupt: () => interrupt2,
  interruptible: () => interruptible2,
  interruptibleMask: () => interruptibleMask2,
  isEffect: () => isEffect2,
  isFailure: () => isFailure5,
  isSuccess: () => isSuccess5,
  let: () => let_4,
  linkSpans: () => linkSpans2,
  log: () => log,
  logDebug: () => logDebug,
  logError: () => logError,
  logFatal: () => logFatal,
  logInfo: () => logInfo,
  logTrace: () => logTrace,
  logWarning: () => logWarning,
  logWithLevel: () => logWithLevel2,
  makeSpan: () => makeSpan2,
  makeSpanScoped: () => makeSpanScoped2,
  map: () => map7,
  mapBoth: () => mapBoth2,
  mapBothEager: () => mapBothEager2,
  mapEager: () => mapEager2,
  mapError: () => mapError3,
  mapErrorEager: () => mapErrorEager2,
  match: () => match5,
  matchCause: () => matchCause2,
  matchCauseEager: () => matchCauseEager2,
  matchCauseEffect: () => matchCauseEffect2,
  matchCauseEffectEager: () => matchCauseEffectEager2,
  matchEager: () => matchEager2,
  matchEffect: () => matchEffect3,
  never: () => never2,
  onError: () => onError2,
  onErrorFilter: () => onErrorFilter2,
  onErrorIf: () => onErrorIf2,
  onExit: () => onExit2,
  onExitFilter: () => onExitFilter2,
  onExitIf: () => onExitIf2,
  onExitPrimitive: () => onExitPrimitive2,
  onInterrupt: () => onInterrupt2,
  option: () => option2,
  orDie: () => orDie3,
  orElseSucceed: () => orElseSucceed2,
  partition: () => partition3,
  promise: () => promise2,
  provide: () => provide4,
  provideContext: () => provideContext2,
  provideService: () => provideService2,
  provideServiceEffect: () => provideServiceEffect2,
  race: () => race2,
  raceAll: () => raceAll2,
  raceAllFirst: () => raceAllFirst2,
  raceFirst: () => raceFirst2,
  reduce: () => reduce2,
  repeat: () => repeat2,
  repeatOrElse: () => repeatOrElse2,
  replicate: () => replicate2,
  replicateEffect: () => replicateEffect2,
  request: () => request2,
  requestUnsafe: () => requestUnsafe2,
  result: () => result2,
  retry: () => retry2,
  retryOrElse: () => retryOrElse2,
  runCallback: () => runCallback2,
  runCallbackWith: () => runCallbackWith2,
  runFork: () => runFork2,
  runForkWith: () => runForkWith2,
  runPromise: () => runPromise2,
  runPromiseExit: () => runPromiseExit2,
  runPromiseExitWith: () => runPromiseExitWith2,
  runPromiseWith: () => runPromiseWith2,
  runSync: () => runSync2,
  runSyncExit: () => runSyncExit2,
  runSyncExitWith: () => runSyncExitWith2,
  runSyncWith: () => runSyncWith2,
  sandbox: () => sandbox2,
  satisfiesErrorType: () => satisfiesErrorType2,
  satisfiesServicesType: () => satisfiesServicesType2,
  satisfiesSuccessType: () => satisfiesSuccessType2,
  schedule: () => schedule,
  scheduleFrom: () => scheduleFrom2,
  scope: () => scope2,
  scoped: () => scoped2,
  scopedWith: () => scopedWith2,
  service: () => service2,
  serviceOption: () => serviceOption2,
  setContext: () => setContext2,
  sleep: () => sleep2,
  spanAnnotations: () => spanAnnotations2,
  spanLinks: () => spanLinks2,
  succeed: () => succeed6,
  succeedNone: () => succeedNone2,
  succeedSome: () => succeedSome2,
  suspend: () => suspend3,
  sync: () => sync3,
  tap: () => tap4,
  tapCause: () => tapCause3,
  tapCauseFilter: () => tapCauseFilter2,
  tapCauseIf: () => tapCauseIf2,
  tapDefect: () => tapDefect2,
  tapError: () => tapError3,
  tapErrorTag: () => tapErrorTag2,
  timed: () => timed2,
  timeout: () => timeout2,
  timeoutOption: () => timeoutOption2,
  timeoutOrElse: () => timeoutOrElse2,
  tracer: () => tracer2,
  track: () => track,
  trackDefects: () => trackDefects,
  trackDuration: () => trackDuration,
  trackErrors: () => trackErrors,
  trackSuccesses: () => trackSuccesses,
  transposeOption: () => transposeOption2,
  try: () => try_3,
  tryPromise: () => tryPromise2,
  tx: () => tx,
  txRetry: () => txRetry,
  undefined: () => undefined_2,
  uninterruptible: () => uninterruptible2,
  uninterruptibleMask: () => uninterruptibleMask2,
  unwrapReason: () => unwrapReason2,
  updateContext: () => updateContext2,
  updateService: () => updateService3,
  updateServiceScoped: () => updateServiceScoped2,
  useSpan: () => useSpan2,
  validate: () => validate2,
  void: () => void_4,
  when: () => when2,
  whileLoop: () => whileLoop2,
  withErrorReporting: () => withErrorReporting2,
  withExecutionPlan: () => withExecutionPlan2,
  withFiber: () => withFiber2,
  withFiberSucceed: () => withFiberSucceed2,
  withLogSpan: () => withLogSpan,
  withLogger: () => withLogger,
  withParentSpan: () => withParentSpan3,
  withSpan: () => withSpan3,
  withSpanScoped: () => withSpanScoped2,
  withTracer: () => withTracer2,
  withTracerEnabled: () => withTracerEnabled2,
  withTracerTiming: () => withTracerTiming2,
  yieldNow: () => yieldNow2,
  yieldNowWith: () => yieldNowWith2,
  zip: () => zip2,
  zipWith: () => zipWith3
});

// ../../node_modules/effect/dist/Exit.js
var isExit2 = isExit;
var succeed4 = exitSucceed;
var failCause2 = exitFailCause;
var fail5 = exitFail;
var void_3 = exitVoid;
var isSuccess4 = exitIsSuccess;
var isFailure4 = exitIsFailure;

// ../../node_modules/effect/dist/Layer.js
var Layer_exports = {};
__export(Layer_exports, {
  CurrentMemoMap: () => CurrentMemoMap,
  build: () => build,
  buildWithMemoMap: () => buildWithMemoMap,
  buildWithScope: () => buildWithScope,
  catch: () => catch_2,
  catchCause: () => catchCause2,
  catchTag: () => catchTag2,
  effect: () => effect,
  effectContext: () => effectContext,
  effectDiscard: () => effectDiscard,
  empty: () => empty3,
  flatMap: () => flatMap4,
  forkMemoMap: () => forkMemoMap,
  forkMemoMapUnsafe: () => forkMemoMapUnsafe,
  fresh: () => fresh,
  fromBuild: () => fromBuild,
  fromBuildMemo: () => fromBuildMemo,
  isLayer: () => isLayer,
  launch: () => launch,
  makeMemoMap: () => makeMemoMap,
  makeMemoMapUnsafe: () => makeMemoMapUnsafe,
  merge: () => merge2,
  mergeAll: () => mergeAll2,
  mock: () => mock,
  orDie: () => orDie2,
  parentSpan: () => parentSpan,
  provide: () => provide2,
  provideMerge: () => provideMerge,
  satisfiesErrorType: () => satisfiesErrorType,
  satisfiesServicesType: () => satisfiesServicesType,
  satisfiesSuccessType: () => satisfiesSuccessType,
  span: () => span,
  succeed: () => succeed5,
  succeedContext: () => succeedContext,
  suspend: () => suspend2,
  sync: () => sync2,
  syncContext: () => syncContext,
  tap: () => tap3,
  tapCause: () => tapCause2,
  tapError: () => tapError2,
  unwrap: () => unwrap,
  updateService: () => updateService2,
  withParentSpan: () => withParentSpan2,
  withSpan: () => withSpan2
});

// ../../node_modules/effect/dist/Deferred.js
var TypeId5 = "~effect/Deferred";
var DeferredProto = {
  [TypeId5]: {
    _A: identity,
    _E: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var DeferredImpl = function() {
  this.resumes = void 0;
  this.effect = void 0;
};
DeferredImpl.prototype = DeferredProto;
var makeUnsafe2 = () => new DeferredImpl();
var _await = (self) => callback((resume) => {
  if (self.effect) return resume(self.effect);
  self.resumes ??= [];
  self.resumes.push(resume);
  return sync(() => {
    const resumes = self.resumes;
    if (resumes === void 0) return;
    const index2 = resumes.indexOf(resume);
    if (index2 >= 0) resumes.splice(index2, 1);
  });
});
var doneUnsafe = (self, effect2) => {
  if (self.effect) return false;
  self.effect = effect2;
  if (self.resumes) {
    const resumes = self.resumes;
    self.resumes = void 0;
    for (let i = 0; i < resumes.length; i++) {
      resumes[i](effect2);
    }
  }
  return true;
};

// ../../node_modules/effect/dist/References.js
var CurrentLogAnnotations2 = CurrentLogAnnotations;
var CurrentLogSpans2 = CurrentLogSpans;
var CurrentStackFrame2 = CurrentStackFrame;

// ../../node_modules/effect/dist/Scope.js
var Scope = scopeTag;
var makeUnsafe3 = scopeMakeUnsafe;
var provide = provideScope;
var addFinalizerExit = scopeAddFinalizerExit;
var addFinalizer2 = scopeAddFinalizer;
var forkUnsafe2 = scopeForkUnsafe;
var close = scopeClose;

// ../../node_modules/effect/dist/Layer.js
var TypeId6 = "~effect/Layer";
var MemoMapTypeId = "~effect/Layer/MemoMap";
var makeMemoMapEntry = (memoMap, layer7) => {
  const entry = {
    observers: 0,
    deferred: makeUnsafe2(),
    scope: makeUnsafe3(),
    finalizer: (exit3) => suspend(() => {
      if (--entry.observers > 0) return void_2;
      memoMap.map.delete(layer7);
      return close(entry.scope, exit3);
    })
  };
  return entry;
};
var memoMapObserve = (entry, scope3) => {
  if (scope3.state._tag === "Closed") return false;
  entry.observers++;
  scopeAddFinalizerUnsafe(scope3, {}, entry.finalizer);
  return true;
};
var isLayer = (u) => hasProperty(u, TypeId6);
var LayerProto = {
  [TypeId6]: {
    _ROut: identity,
    _E: identity,
    _RIn: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromBuildUnsafe = (build2) => {
  const self = Object.create(LayerProto);
  self.build = build2;
  return self;
};
var fromBuild = (build2) => fromBuildUnsafe((memoMap, scope3) => {
  const layerScope = forkUnsafe2(scope3);
  return onExit(build2(memoMap, layerScope), (exit3) => exit3._tag === "Failure" ? close(layerScope, exit3) : void_2);
});
var fromBuildMemo = (build2) => {
  const self = fromBuild((memoMap, scope3) => memoMap.getOrElseMemoize(self, scope3, build2));
  return self;
};
var MemoMapImpl = class {
  get [MemoMapTypeId]() {
    return MemoMapTypeId;
  }
  parent;
  constructor(parent) {
    this.parent = parent;
  }
  map = /* @__PURE__ */ new Map();
  get(layer7, scope3) {
    const local = this.map.get(layer7);
    if (local) {
      memoMapObserve(local, scope3);
      return local.deferred.effect ?? _await(local.deferred);
    }
    return this.parent?.get(layer7, scope3);
  }
  getOrElseMemoize(layer7, scope3, build2) {
    return suspend(() => {
      let deferred;
      return onExitPrimitive(suspend(() => {
        const existing = this.get(layer7, scope3);
        if (existing) return existing;
        const entry = makeMemoMapEntry(this, layer7);
        if (!memoMapObserve(entry, scope3)) return build2(this, scope3);
        deferred = entry.deferred;
        this.map.set(layer7, entry);
        return build2(this, entry.scope);
      }), (exit3) => {
        if (deferred) doneUnsafe(deferred, exit3);
      });
    });
  }
};
var makeMemoMapUnsafe = () => new MemoMapImpl();
var forkMemoMapUnsafe = (parent) => new MemoMapImpl(parent);
var makeMemoMap = /* @__PURE__ */ sync(makeMemoMapUnsafe);
var forkMemoMap = (parent) => sync(() => forkMemoMapUnsafe(parent));
var CurrentMemoMap = class _CurrentMemoMap extends (/* @__PURE__ */ Service()("effect/Layer/CurrentMemoMap")) {
  static forkOrCreate(self) {
    const current = getOrUndefined2(self, _CurrentMemoMap);
    return current ? forkMemoMapUnsafe(current) : makeMemoMapUnsafe();
  }
};
var buildWithMemoMap = /* @__PURE__ */ dual(3, (self, memoMap, scope3) => provideService(map5(self.build(memoMap, scope3), add(CurrentMemoMap, memoMap)), CurrentMemoMap, memoMap));
var build = (self) => withFiber((fiber3) => buildWithMemoMap(self, CurrentMemoMap.forkOrCreate(fiber3.context), getUnsafe(fiber3.context, Scope)));
var buildWithScope = /* @__PURE__ */ dual(2, (self, scope3) => withFiber((fiber3) => buildWithMemoMap(self, CurrentMemoMap.forkOrCreate(fiber3.context), scope3)));
var succeed5 = function() {
  if (arguments.length === 1) {
    return (resource) => succeedContext(make5(arguments[0], resource));
  }
  return succeedContext(make5(arguments[0], arguments[1]));
};
var succeedContext = (context3) => fromBuildUnsafe(constant(succeed3(context3)));
var empty3 = /* @__PURE__ */ succeedContext(/* @__PURE__ */ empty());
var sync2 = function() {
  if (arguments.length === 1) {
    return (evaluate2) => syncContext(() => make5(arguments[0], evaluate2()));
  }
  return syncContext(() => make5(arguments[0], arguments[1]()));
};
var syncContext = (evaluate2) => fromBuildMemo(constant(sync(evaluate2)));
var effect = function() {
  if (arguments.length === 1) {
    return (effect2) => effectImpl(arguments[0], effect2);
  }
  return effectImpl(arguments[0], arguments[1]);
};
var effectImpl = (service3, effect2) => effectContext(map5(effect2, (value3) => make5(service3, value3)));
var effectContext = (effect2) => fromBuildMemo((_, scope3) => provide(effect2, scope3));
var effectDiscard = (effect2) => effectContext(as2(effect2, empty()));
var suspend2 = (evaluate2) => fromBuildMemo((memoMap, scope3) => suspend(() => evaluate2().build(memoMap, scope3)));
var unwrapKey = /* @__PURE__ */ Service("effect/Layer/unwrap");
var unwrap = (self) => flatMap4(effect(unwrapKey)(self), get(unwrapKey));
var mergeAllEffect = (layers, memoMap, scope3) => {
  const parentScope = forkUnsafe2(scope3, "parallel");
  return forEach(layers, (layer7) => layer7.build(memoMap, forkUnsafe2(parentScope, "sequential")), {
    concurrency: layers.length
  }).pipe(map5((context3) => mergeAll(...context3)));
};
var mergeAll2 = (...layers) => fromBuild((memoMap, scope3) => mergeAllEffect(layers, memoMap, scope3));
var merge2 = /* @__PURE__ */ dual(2, (self, that) => mergeAll2(self, ...Array.isArray(that) ? that : [that]));
var provideWith = (self, that, f) => fromBuild((memoMap, scope3) => flatMap3(Array.isArray(that) ? mergeAllEffect(that, memoMap, scope3) : that.build(memoMap, scope3), (context3) => self.build(memoMap, scope3).pipe(provideContext(context3), map5((merged) => f(merged, context3)))));
var provide2 = /* @__PURE__ */ dual(2, (self, that) => provideWith(self, that, identity));
var provideMerge = /* @__PURE__ */ dual(2, (self, that) => provideWith(self, that, (self2, that2) => merge(that2, self2)));
var flatMap4 = /* @__PURE__ */ dual(2, (self, f) => fromBuild((memoMap, scope3) => flatMap3(self.build(memoMap, scope3), (context3) => f(context3).build(memoMap, scope3))));
var tap3 = /* @__PURE__ */ dual(2, (self, f) => fromBuild((memoMap, scope3) => flatMap3(self.build(memoMap, scope3), (context3) => provide(as2(f(context3), context3), scope3))));
var tapError2 = /* @__PURE__ */ dual(2, (self, f) => fromBuild((memoMap, scope3) => catch_(self.build(memoMap, scope3), (error) => provide(andThen2(f(error), fail3(error)), scope3))));
var tapCause2 = /* @__PURE__ */ dual(2, (self, f) => fromBuild((memoMap, scope3) => catchCause(self.build(memoMap, scope3), (cause) => provide(andThen2(f(cause), failCause(cause)), scope3))));
var orDie2 = (self) => fromBuildUnsafe((memoMap, scope3) => orDie(self.build(memoMap, scope3)));
var catch_2 = /* @__PURE__ */ dual(2, (self, onError4) => fromBuildUnsafe((memoMap, scope3) => catch_(self.build(memoMap, scope3), (e) => onError4(e).build(memoMap, scope3))));
var catchTag2 = /* @__PURE__ */ dual(3, (self, k, f) => fromBuildUnsafe((memoMap, scope3) => catchTag(self.build(memoMap, scope3), k, (error) => f(error).build(memoMap, scope3))));
var catchCause2 = /* @__PURE__ */ dual(2, (self, onError4) => fromBuildUnsafe((memoMap, scope3) => catchCause(self.build(memoMap, scope3), (cause) => onError4(cause).build(memoMap, scope3))));
var updateService2 = /* @__PURE__ */ dual(3, (layer7, service3, f) => provide2(layer7, effect(service3, map5(service3, f))));
var fresh = (self) => fromBuildUnsafe((_, scope3) => self.build(makeMemoMapUnsafe(), scope3));
var launch = (self) => scoped(andThen2(build(self), never));
var mock = function() {
  if (arguments.length === 1) {
    return (implementation) => mockImpl(arguments[0], implementation);
  }
  return mockImpl(arguments[0], arguments[1]);
};
var mockImpl = (service3, implementation) => succeed5(service3)(new Proxy({
  ...implementation
}, {
  get(target, prop, _receiver) {
    if (prop in target) {
      return target[prop];
    }
    const prevLimit = getStackTraceLimit();
    setStackTraceLimit(2);
    const error = new Error(`${service3.key}: Unimplemented method "${prop.toString()}"`);
    setStackTraceLimit(prevLimit);
    error.name = "UnimplementedError";
    return makeUnimplemented(error);
  },
  has: constTrue
}));
var makeUnimplemented = (error) => {
  const dead = Object.assign(die(error), {
    [StreamTypeId]: StreamTypeId,
    channel: {
      [ChannelTypeId]: ChannelTypeId,
      transform: () => succeed3(dead),
      pipe() {
        return pipeArguments(this, arguments);
      }
    },
    [ChannelTypeId]: ChannelTypeId,
    transform: () => succeed3(dead)
  });
  function unimplemented() {
    return dead;
  }
  Object.assign(unimplemented, dead);
  Object.setPrototypeOf(unimplemented, Object.getPrototypeOf(dead));
  return unimplemented;
};
var StreamTypeId = "~effect/Stream";
var ChannelTypeId = "~effect/Channel";
var satisfiesSuccessType = () => (layer7) => layer7;
var satisfiesErrorType = () => (layer7) => layer7;
var satisfiesServicesType = () => (layer7) => layer7;
var span = (name, options3) => {
  options3 = addSpanStackTrace(options3);
  return effect(ParentSpan, options3?.onEnd ? tap2(makeSpanScoped(name, options3), (span2) => addFinalizer((exit3) => options3.onEnd(span2, exit3))) : makeSpanScoped(name, options3));
};
var parentSpan = (span2) => succeedContext(ParentSpan.context(span2));
var withSpan2 = function() {
  const dataFirst = typeof arguments[0] !== "string";
  const name = dataFirst ? arguments[1] : arguments[0];
  const options3 = addSpanStackTrace(dataFirst ? arguments[2] : arguments[1]);
  if (dataFirst) {
    const self = arguments[0];
    return unwrap(map5(options3?.onEnd !== void 0 ? tap2(makeSpanScoped(name, options3), (span2) => addFinalizer((exit3) => options3.onEnd(span2, exit3))) : makeSpanScoped(name, options3), (span2) => withParentSpan2(self, span2, options3)));
  }
  return (self) => unwrap(map5(options3?.onEnd !== void 0 ? tap2(makeSpanScoped(name, options3), (span2) => addFinalizer((exit3) => options3.onEnd(span2, exit3))) : makeSpanScoped(name, options3), (span2) => withParentSpan2(self, span2, options3)));
};
var withParentSpan2 = function() {
  const dataFirst = isLayer(arguments[0]);
  const span2 = dataFirst ? arguments[1] : arguments[0];
  let options3 = dataFirst ? arguments[2] : arguments[1];
  let provideStackFrame = identity;
  if (span2._tag === "Span") {
    options3 = addSpanStackTrace(options3);
    provideStackFrame = provideSpanStackFrame2(span2.name, options3?.captureStackTrace);
  }
  const parentSpanLayer = parentSpan(span2);
  if (dataFirst) {
    return provide2(provideStackFrame(arguments[0]), parentSpanLayer);
  }
  return (self) => provide2(provideStackFrame(self), parentSpanLayer);
};
var provideSpanStackFrame2 = (name, stack) => {
  stack = typeof stack === "function" ? stack : constUndefined;
  return updateService2(CurrentStackFrame2, (parent) => ({
    name,
    stack,
    parent
  }));
};

// ../../node_modules/effect/dist/ExecutionPlan.js
var TypeId7 = "~effect/ExecutionPlan";
var Proto2 = {
  [TypeId7]: TypeId7,
  get captureRequirements() {
    const self = this;
    return contextWith((context3) => succeed3(makeProto(self.steps.map((step) => ({
      ...step,
      while: step.while ? (input) => provideContext(step.while(input), context3) : void 0,
      provide: isLayer(step.provide) ? provide2(step.provide, succeedContext(context3)) : step.provide
    })))));
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeProto = (steps) => {
  const self = Object.create(Proto2);
  self.steps = steps;
  return self;
};
var CurrentMetadata = /* @__PURE__ */ Reference("effect/ExecutionPlan/CurrentMetadata", {
  defaultValue: /* @__PURE__ */ constant({
    attempt: 0,
    stepIndex: 0
  })
});

// ../../node_modules/effect/dist/Clock.js
var Clock_exports = {};
__export(Clock_exports, {
  Clock: () => Clock,
  clockWith: () => clockWith2,
  currentTimeMillis: () => currentTimeMillis2,
  currentTimeNanos: () => currentTimeNanos2,
  monotonicTimeNanos: () => monotonicTimeNanos2
});
var Clock = ClockRef;
var clockWith2 = clockWith;
var currentTimeMillis2 = currentTimeMillis;
var currentTimeNanos2 = currentTimeNanos;
var monotonicTimeNanos2 = monotonicTimeNanos;

// ../../node_modules/effect/dist/internal/dateTime.js
var TypeId8 = "~effect/DateTime";
var TimeZoneTypeId = "~effect/DateTime/TimeZone";
var Proto3 = {
  [TypeId8]: TypeId8,
  pipe() {
    return pipeArguments(this, arguments);
  },
  [NodeInspectSymbol]() {
    return this.toString();
  },
  toJSON() {
    return toDateUtc(this).toJSON();
  }
};
var ProtoUtc = {
  ...Proto3,
  _tag: "Utc",
  [symbol]() {
    return number(this.epochMilliseconds);
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Utc" && this.epochMilliseconds === that.epochMilliseconds;
  },
  toString() {
    return `DateTime.Utc(${toDateUtc(this).toJSON()})`;
  }
};
var ProtoZoned = {
  ...Proto3,
  _tag: "Zoned",
  [symbol]() {
    return combine(number(this.epochMilliseconds))(hash(this.zone));
  },
  [symbol2](that) {
    return isDateTime(that) && that._tag === "Zoned" && this.epochMilliseconds === that.epochMilliseconds && equals(this.zone, that.zone);
  },
  toString() {
    return `DateTime.Zoned(${formatIsoZoned(this)})`;
  }
};
var ProtoTimeZone = {
  [TimeZoneTypeId]: TimeZoneTypeId,
  [NodeInspectSymbol]() {
    return this.toString();
  }
};
var ProtoTimeZoneNamed = {
  ...ProtoTimeZone,
  _tag: "Named",
  [symbol]() {
    return string(`Named:${this.id}`);
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Named" && this.id === that.id;
  },
  toString() {
    return `TimeZone.Named(${this.id})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Named",
      id: this.id
    };
  }
};
var ProtoTimeZoneOffset = {
  ...ProtoTimeZone,
  _tag: "Offset",
  [symbol]() {
    return string(`Offset:${this.offset}`);
  },
  [symbol2](that) {
    return isTimeZone(that) && that._tag === "Offset" && this.offset === that.offset;
  },
  toString() {
    return `TimeZone.Offset(${offsetToString(this.offset)})`;
  },
  toJSON() {
    return {
      _id: "TimeZone",
      _tag: "Offset",
      offset: this.offset
    };
  }
};
var makeZonedProto = (epochMillis, zone, partsUtc) => {
  const self = Object.create(ProtoZoned);
  self.epochMilliseconds = epochMillis;
  self.zone = zone;
  Object.defineProperty(self, "partsUtc", {
    value: partsUtc,
    enumerable: false,
    writable: true
  });
  Object.defineProperty(self, "adjustedEpochMillis", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  Object.defineProperty(self, "partsAdjusted", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  return self;
};
var isDateTime = (u) => hasProperty(u, TypeId8);
var isTimeZone = (u) => hasProperty(u, TimeZoneTypeId);
var isTimeZoneOffset = (u) => isTimeZone(u) && u._tag === "Offset";
var isTimeZoneNamed = (u) => isTimeZone(u) && u._tag === "Named";
var isUtc = (self) => self._tag === "Utc";
var isZoned = (self) => self._tag === "Zoned";
var Equivalence2 = /* @__PURE__ */ make3((a, b) => a.epochMilliseconds === b.epochMilliseconds);
var makeUtc = (epochMillis) => {
  const self = Object.create(ProtoUtc);
  self.epochMilliseconds = epochMillis;
  Object.defineProperty(self, "partsUtc", {
    value: void 0,
    enumerable: false,
    writable: true
  });
  return self;
};
var fromDateUnsafe = (date) => {
  const epochMillis = date.getTime();
  if (Number.isNaN(epochMillis)) {
    throw new IllegalArgumentError2("Invalid date");
  }
  return makeUtc(epochMillis);
};
var makeUnsafe4 = (input) => {
  if (isDateTime(input)) {
    return input;
  } else if (input instanceof Date) {
    return fromDateUnsafe(input);
  } else if (typeof input === "object") {
    if ("epochMilliseconds" in input) {
      return fromDateUnsafe(new Date(input.epochMilliseconds));
    }
    const date = /* @__PURE__ */ new Date(0);
    setPartsDate(date, input);
    return fromDateUnsafe(date);
  } else if (typeof input === "string" && !hasZone(input)) {
    return fromDateUnsafe(/* @__PURE__ */ new Date(input + "Z"));
  }
  return fromDateUnsafe(new Date(input));
};
var hasZone = (input) => /Z|GMT|[+-]\d{2}$|[+-]\d{2}:?\d{2}$|\]$/.test(input);
var minEpochMillis = -864e13 + 12 * 60 * 60 * 1e3;
var maxEpochMillis = 864e13 - 14 * 60 * 60 * 1e3;
var makeZonedUnsafe = (input, options3) => {
  let timeZoneOption = options3?.timeZone;
  if (timeZoneOption === void 0 && isDateTime(input) && isZoned(input)) {
    return input;
  }
  const self = makeUnsafe4(input);
  if (self.epochMilliseconds < minEpochMillis || self.epochMilliseconds > maxEpochMillis) {
    throw new RangeError(`Epoch millis out of range: ${self.epochMilliseconds}`);
  }
  if (timeZoneOption === void 0 && typeof input === "object" && "timeZoneId" in input) {
    timeZoneOption = input.timeZoneId;
  }
  let zone;
  if (timeZoneOption === void 0) {
    const offset = new Date(self.epochMilliseconds).getTimezoneOffset() * -60 * 1e3;
    zone = zoneMakeOffset(offset);
  } else if (isTimeZone(timeZoneOption)) {
    zone = timeZoneOption;
  } else if (typeof timeZoneOption === "number") {
    zone = zoneMakeOffset(timeZoneOption);
  } else {
    const parsedZone = zoneFromString(timeZoneOption);
    if (isNone2(parsedZone)) {
      throw new IllegalArgumentError2(`Invalid time zone: ${timeZoneOption}`);
    }
    zone = parsedZone.value;
  }
  if (options3?.adjustForTimeZone !== true) {
    return makeZonedProto(self.epochMilliseconds, zone, self.partsUtc);
  }
  return makeZonedFromAdjusted(self.epochMilliseconds, zone, options3?.disambiguation ?? "compatible");
};
var makeZoned = /* @__PURE__ */ liftThrowable(makeZonedUnsafe);
var make8 = /* @__PURE__ */ liftThrowable(makeUnsafe4);
var zonedStringRegExp = /^(.{17,35})\[(.+)\]$/;
var makeZonedFromString = (input) => {
  const match7 = zonedStringRegExp.exec(input);
  if (match7 === null) {
    const offset = parseOffset(input);
    return offset !== null ? makeZoned(input, {
      timeZone: offset
    }) : none2();
  }
  const [, isoString, timeZone] = match7;
  return makeZoned(isoString, {
    timeZone
  });
};
var toUtc = (self) => makeUtc(self.epochMilliseconds);
var validZoneCache = /* @__PURE__ */ new Map();
var formatOptions = {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZoneName: "longOffset",
  fractionalSecondDigits: 3,
  hourCycle: "h23"
};
var zoneMakeIntl = (format9) => {
  const zoneId = format9.resolvedOptions().timeZone;
  const cached3 = validZoneCache.get(zoneId);
  if (cached3 !== void 0) {
    return cached3;
  }
  const zone = Object.create(ProtoTimeZoneNamed);
  zone.id = zoneId;
  zone.format = format9;
  validZoneCache.set(zoneId, zone);
  return zone;
};
var zoneMakeNamedUnsafe = (zoneId) => {
  const cached3 = validZoneCache.get(zoneId);
  if (cached3 !== void 0) {
    return cached3;
  }
  try {
    const zone = zoneMakeIntl(new Intl.DateTimeFormat("en-US", {
      ...formatOptions,
      timeZone: zoneId
    }));
    validZoneCache.set(zoneId, zone);
    return zone;
  } catch {
    throw new IllegalArgumentError2(`Invalid time zone: ${zoneId}`);
  }
};
var zoneMakeOffset = (offset) => {
  const zone = Object.create(ProtoTimeZoneOffset);
  zone.offset = offset;
  return zone;
};
var zoneMakeNamed = /* @__PURE__ */ liftThrowable(zoneMakeNamedUnsafe);
var offsetZoneRegExp = /^(?:GMT|[+-])/;
var zoneFromString = (zone) => {
  if (offsetZoneRegExp.test(zone)) {
    const offset = parseOffset(zone);
    return offset === null ? none2() : some2(zoneMakeOffset(offset));
  }
  return zoneMakeNamed(zone);
};
var zoneToString = (self) => {
  if (self._tag === "Offset") {
    return offsetToString(self.offset);
  }
  return self.id;
};
var toDateUtc = (self) => new Date(self.epochMilliseconds);
var toDate = (self) => {
  if (self._tag === "Utc") {
    return new Date(self.epochMilliseconds);
  } else if (self.zone._tag === "Offset") {
    return new Date(self.epochMilliseconds + self.zone.offset);
  } else if (self.adjustedEpochMilliseconds !== void 0) {
    return new Date(self.adjustedEpochMilliseconds);
  }
  const parts2 = self.zone.format.formatToParts(self.epochMilliseconds).filter((_) => _.type !== "literal");
  const date = /* @__PURE__ */ new Date(0);
  date.setUTCFullYear(Number(parts2[2].value), Number(parts2[0].value) - 1, Number(parts2[1].value));
  date.setUTCHours(Number(parts2[3].value), Number(parts2[4].value), Number(parts2[5].value), parts2[6]?.type === "fractionalSecond" ? Number(parts2[6].value) : (self.epochMilliseconds % 1e3 + 1e3) % 1e3);
  self.adjustedEpochMilliseconds = date.getTime();
  return date;
};
var zonedOffset = (self) => {
  const date = toDate(self);
  return date.getTime() - toEpochMillis(self);
};
var offsetToString = (offset) => {
  const abs2 = Math.abs(offset);
  let hours2 = Math.floor(abs2 / (60 * 60 * 1e3));
  let minutes2 = Math.round(abs2 % (60 * 60 * 1e3) / (60 * 1e3));
  if (minutes2 === 60) {
    hours2 += 1;
    minutes2 = 0;
  }
  return `${offset < 0 ? "-" : "+"}${String(hours2).padStart(2, "0")}:${String(minutes2).padStart(2, "0")}`;
};
var zonedOffsetIso = (self) => offsetToString(zonedOffset(self));
var toEpochMillis = (self) => self.epochMilliseconds;
var setPartsDate = (date, parts2) => {
  if (parts2.year !== void 0 || parts2.month !== void 0 || parts2.day !== void 0) {
    date.setUTCFullYear(parts2.year ?? date.getUTCFullYear(), parts2.month !== void 0 ? parts2.month - 1 : date.getUTCMonth(), parts2.day ?? date.getUTCDate());
  }
  if (parts2.weekDay !== void 0) {
    const diff = parts2.weekDay - date.getUTCDay();
    date.setUTCDate(date.getUTCDate() + diff);
  }
  if (parts2.hour !== void 0) {
    date.setUTCHours(parts2.hour);
  }
  if (parts2.minute !== void 0) {
    date.setUTCMinutes(parts2.minute);
  }
  if (parts2.second !== void 0) {
    date.setUTCSeconds(parts2.second);
  }
  if (parts2.millisecond !== void 0) {
    date.setUTCMilliseconds(parts2.millisecond);
  }
};
var constDayMillis = 24 * 60 * 60 * 1e3;
var makeZonedFromAdjusted = (adjustedMillis, zone, disambiguation) => {
  if (zone._tag === "Offset") {
    return makeZonedProto(adjustedMillis - zone.offset, zone);
  }
  const beforeOffset = calculateNamedOffset(adjustedMillis - constDayMillis, adjustedMillis, zone);
  const afterOffset = calculateNamedOffset(adjustedMillis + constDayMillis, adjustedMillis, zone);
  if (beforeOffset === afterOffset) {
    return makeZonedProto(adjustedMillis - beforeOffset, zone);
  }
  const isForwards = beforeOffset < afterOffset;
  const transitionMillis = beforeOffset - afterOffset;
  if (isForwards) {
    const currentAfterOffset = calculateNamedOffset(adjustedMillis - afterOffset, adjustedMillis, zone);
    if (currentAfterOffset === afterOffset) {
      return makeZonedProto(adjustedMillis - afterOffset, zone);
    }
    const before = makeZonedProto(adjustedMillis - beforeOffset, zone);
    const beforeAdjustedMillis = toDate(before).getTime();
    if (adjustedMillis !== beforeAdjustedMillis) {
      switch (disambiguation) {
        case "reject": {
          const formatted = new Date(adjustedMillis).toISOString();
          throw new RangeError(`Gap time: ${formatted} does not exist in time zone ${zone.id}`);
        }
        case "earlier":
          return makeZonedProto(adjustedMillis - afterOffset, zone);
        case "compatible":
        case "later":
          return before;
      }
    }
    return before;
  }
  const currentBeforeOffset = calculateNamedOffset(adjustedMillis - beforeOffset, adjustedMillis, zone);
  if (currentBeforeOffset === beforeOffset) {
    if (disambiguation === "earlier" || disambiguation === "compatible") {
      return makeZonedProto(adjustedMillis - beforeOffset, zone);
    }
    const laterOffset = calculateNamedOffset(adjustedMillis - beforeOffset + transitionMillis, adjustedMillis + transitionMillis, zone);
    if (laterOffset === beforeOffset) {
      return makeZonedProto(adjustedMillis - beforeOffset, zone);
    }
    if (disambiguation === "reject") {
      const formatted = new Date(adjustedMillis).toISOString();
      throw new RangeError(`Ambiguous time: ${formatted} occurs twice in time zone ${zone.id}`);
    }
  }
  return makeZonedProto(adjustedMillis - afterOffset, zone);
};
var offsetRegExp = /([+-])(\d{2}):(\d{2})$/;
var parseOffset = (offset) => {
  const match7 = offsetRegExp.exec(offset);
  if (match7 === null) {
    return null;
  }
  const [, sign2, hours2, minutes2] = match7;
  return (sign2 === "+" ? 1 : -1) * (Number(hours2) * 60 + Number(minutes2)) * 60 * 1e3;
};
var calculateNamedOffset = (utcMillis, adjustedMillis, zone) => {
  const offset = zone.format.formatToParts(utcMillis).find((_) => _.type === "timeZoneName")?.value ?? "";
  if (offset === "GMT") {
    return 0;
  }
  const result3 = parseOffset(offset);
  if (result3 === null) {
    return zonedOffset(makeZonedProto(adjustedMillis, zone));
  }
  return result3;
};
var formatIso = (self) => toDateUtc(self).toISOString();
var formatIsoOffset = (self) => {
  const date = toDate(self);
  return self._tag === "Utc" ? date.toISOString() : `${date.toISOString().slice(0, -1)}${zonedOffsetIso(self)}`;
};
var formatIsoZoned = (self) => self.zone._tag === "Offset" ? formatIsoOffset(self) : `${formatIsoOffset(self)}[${self.zone.id}]`;

// ../../node_modules/effect/dist/Number.js
var Number3 = globalThis.Number;
var remainder = /* @__PURE__ */ dual(2, (self, divisor) => {
  if (!globalThis.Number.isFinite(self) || !globalThis.Number.isFinite(divisor) || divisor === 0) {
    return NaN;
  }
  if (globalThis.Number.isInteger(self) && globalThis.Number.isInteger(divisor)) {
    return self % divisor;
  }
  const [selfCoefficient, selfExponent] = toScientificInteger(self);
  const [divisorCoefficient, divisorExponent] = toScientificInteger(divisor);
  const exponent = Math.min(selfExponent, divisorExponent);
  const selfInteger = selfCoefficient * BigInt(10) ** BigInt(selfExponent - exponent);
  const divisorInteger = divisorCoefficient * BigInt(10) ** BigInt(divisorExponent - exponent);
  const out = selfInteger % divisorInteger;
  if (out === BigInt(0)) {
    return self < 0 || Object.is(self, -0) ? -0 : 0;
  }
  const remainder2 = globalThis.Number(`${out}e${exponent}`);
  return remainder2 === 0 ? Math.sign(self) * globalThis.Number.MIN_VALUE : remainder2;
});
function toScientificInteger(n) {
  if (globalThis.Number.isInteger(n)) {
    return [BigInt(n), 0];
  }
  const scientific = Math.abs(n).toExponential();
  const eIndex = scientific.indexOf("e");
  const digits = scientific.slice(0, eIndex).replace(".", "");
  const coefficient = BigInt(digits) * (n < 0 ? -BigInt(1) : BigInt(1));
  return [coefficient, globalThis.Number(scientific.slice(eIndex + 1)) - digits.length + 1];
}

// ../../node_modules/effect/dist/String.js
var String3 = globalThis.String;
var trim = (self) => self.trim();

// ../../node_modules/effect/dist/Pull.js
var catchDone = /* @__PURE__ */ dual(2, (effect2, f) => catchCauseFilter(effect2, filterDoneLeftover, (l) => f(l)));
var isDoneCause = (cause) => cause.reasons.some(isDoneFailure);
var isDoneFailure = (failure) => failure._tag === "Fail" && isDone2(failure.error);
var filterDone = (cause) => {
  let done3;
  let hasFailure = false;
  for (const reason of cause.reasons) {
    if (isDoneFailure(reason)) {
      done3 ??= reason.error;
    } else if (reason._tag !== "Interrupt") {
      hasFailure = true;
    }
  }
  if (done3 === void 0) return fail2(cause);
  return hasFailure ? fail2(fromReasons(cause.reasons.filter((reason) => !isDoneFailure(reason)))) : succeed2(done3);
};
var filterDoneLeftover = (cause) => {
  const done3 = filterDone(cause);
  return isFailure2(done3) ? done3 : succeed2(done3.success.value);
};
var doneExitFromCause = (cause) => {
  const halt = filterDone(cause);
  return !isFailure2(halt) ? succeed4(halt.success.value) : failCause2(halt.failure);
};
var matchEffect2 = /* @__PURE__ */ dual(2, (self, options3) => matchCauseEffect(self, {
  onSuccess: options3.onSuccess,
  onFailure: (cause) => {
    const halt = filterDone(cause);
    return !isFailure2(halt) ? options3.onDone(halt.success.value) : options3.onFailure(halt.failure);
  }
}));

// ../../node_modules/effect/dist/Schedule.js
var TypeId9 = "~effect/Schedule";
var CurrentMetadata2 = /* @__PURE__ */ Reference("effect/Schedule/CurrentMetadata", {
  defaultValue: /* @__PURE__ */ constant({
    input: void 0,
    output: void 0,
    duration: zero,
    attempt: 0,
    start: 0,
    now: 0,
    elapsed: 0,
    elapsedSincePrevious: 0
  })
});
var ScheduleProto = {
  [TypeId9]: {
    _Out: identity,
    _In: identity,
    _Env: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isSchedule = (u) => hasProperty(u, TypeId9);
var fromStep = (step) => {
  const self = Object.create(ScheduleProto);
  self.step = step;
  return self;
};
var metadataFn = () => {
  let n = 0;
  let previous;
  let start;
  return (now2, input) => {
    if (start === void 0) start = now2;
    const elapsed = now2 - start;
    const elapsedSincePrevious = previous === void 0 ? 0 : now2 - previous;
    previous = now2;
    return {
      input,
      attempt: ++n,
      start,
      now: now2,
      elapsed,
      elapsedSincePrevious
    };
  };
};
var fromStepWithMetadata = (step) => fromStep(map5(step, (f) => {
  const meta = metadataFn();
  return (now2, input) => f(meta(now2, input));
}));
var toStep = (schedule3) => catchCause(schedule3.step, (cause) => succeed3(() => failCause(cause)));
var toStepWithMetadata = (schedule3) => clockWith((clock) => map5(toStep(schedule3), (step) => {
  const metaFn = metadataFn();
  return (input) => suspend(() => {
    const now2 = clock.currentTimeMillisUnsafe();
    return flatMap3(step(now2, input), ([output, duration]) => {
      const meta = metaFn(now2, input);
      meta.output = output;
      meta.duration = duration;
      return as2(sleep(duration), meta);
    });
  });
}));
var passthrough = (self) => fromStep(map5(toStep(self), (step) => (now2, input) => matchEffect2(step(now2, input), {
  onSuccess: (result3) => succeed3([input, result3[1]]),
  onFailure: failCause,
  onDone: () => done2(input)
})));
var recurs = (times) => while_(forever2, ({
  attempt
}) => succeed3(attempt <= times));
var spaced = (duration) => {
  const decoded = fromInputUnsafe(duration);
  return fromStepWithMetadata(succeed3((meta) => succeed3([meta.attempt - 1, decoded])));
};
var while_ = /* @__PURE__ */ dual(2, (self, predicate) => fromStep(map5(toStep(self), (step) => {
  const meta = metadataFn();
  return (now2, input) => flatMap3(step(now2, input), (result3) => {
    const [output, duration] = result3;
    const eff = predicate({
      ...meta(now2, input),
      output,
      duration
    });
    return flatMap3(isEffect(eff) ? eff : succeed3(eff), (check2) => check2 ? succeed3(result3) : done2(output));
  });
})));
var forever2 = /* @__PURE__ */ spaced(zero);

// ../../node_modules/effect/dist/internal/layer.js
var provideLayer = (self, layer7, options3) => scopedWith((scope3) => flatMap3(options3?.local ? buildWithMemoMap(layer7, makeMemoMapUnsafe(), scope3) : buildWithScope(layer7, scope3), (context3) => provideContext(self, context3)));
var provide3 = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, source, options3) => isContext(source) ? provideContext(self, source) : provideLayer(self, Array.isArray(source) ? mergeAll2(...source) : source, options3));

// ../../node_modules/effect/dist/internal/schedule.js
var repeatOrElse = /* @__PURE__ */ dual(3, (self, schedule3, orElse2) => flatMap3(toStepWithMetadata(schedule3), (step) => {
  let meta = CurrentMetadata2.defaultValue();
  return catch_(forever(tap2(flatMap3(suspend(() => provideService(self, CurrentMetadata2, meta)), step), (meta_) => sync(() => {
    meta = meta_;
  })), {
    disableYield: true
  }), (error) => isDone(error) ? succeed3(error.value) : orElse2(error, meta.attempt === 0 ? none2() : some2(meta)));
}));
var retryOrElse = /* @__PURE__ */ dual(3, (self, policy, orElse2) => flatMap3(toStepWithMetadata(policy), (step) => {
  let meta = CurrentMetadata2.defaultValue();
  let lastError;
  const loop = catch_(suspend(() => provideService(self, CurrentMetadata2, meta)), (error) => {
    lastError = error;
    return flatMap3(step(error), (meta_) => {
      meta = meta_;
      return loop;
    });
  });
  return catchDone(loop, (out) => internalCall(() => orElse2(lastError, out)));
}));
var repeat = /* @__PURE__ */ dual(2, (self, options3) => {
  const schedule3 = typeof options3 === "function" ? options3(identity) : isSchedule(options3) ? options3 : buildFromOptions(options3);
  return repeatOrElse(self, schedule3, fail3);
});
var retry = /* @__PURE__ */ dual(2, (self, options3) => {
  const schedule3 = typeof options3 === "function" ? options3(identity) : isSchedule(options3) ? options3 : buildFromOptions(options3);
  return retryOrElse(self, schedule3, fail3);
});
var scheduleFrom = /* @__PURE__ */ dual(3, (self, initial, schedule3) => flatMap3(toStepWithMetadata(schedule3), (step) => {
  let meta = CurrentMetadata2.defaultValue();
  const selfWithMeta = suspend(() => provideService(self, CurrentMetadata2, meta));
  return catch_(flatMap3(step(initial), (meta_) => {
    meta = meta_;
    const body = constant(flatMap3(selfWithMeta, step));
    return whileLoop({
      while: constTrue,
      body,
      step(meta_2) {
        meta = meta_2;
      }
    });
  }), (error) => isDone(error) ? succeed3(error.value) : fail3(error));
}));
var passthroughForever = /* @__PURE__ */ passthrough(forever2);
var buildFromOptions = (options3) => {
  let schedule3 = options3.schedule ? passthrough(options3.schedule) : passthroughForever;
  if (options3.while) {
    schedule3 = while_(schedule3, ({
      input
    }) => {
      const applied = options3.while(input);
      return isEffect(applied) ? applied : succeed3(applied);
    });
  }
  if (options3.until) {
    schedule3 = while_(schedule3, ({
      input
    }) => {
      const applied = options3.until(input);
      return isEffect(applied) ? map5(applied, (b) => !b) : succeed3(!applied);
    });
  }
  if (options3.times !== void 0) {
    schedule3 = while_(schedule3, ({
      attempt
    }) => succeed3(attempt <= options3.times));
  }
  return schedule3;
};

// ../../node_modules/effect/dist/internal/executionPlan.js
var makeEventEmitter = (onEvent, currentMetadata) => {
  let lastStepIndex = -1;
  let stepAttempt = 0;
  const emit = (event) => ignoreCause(onEvent(event));
  return {
    begin: clockWith((clock) => suspend(() => {
      const meta = currentMetadata();
      if (meta.stepIndex !== lastStepIndex) {
        lastStepIndex = meta.stepIndex;
        stepAttempt = 0;
      }
      stepAttempt++;
      const state = {
        attempt: meta.attempt,
        stepAttempt,
        stepIndex: meta.stepIndex,
        startNanos: clock.monotonicTimeNanosUnsafe()
      };
      return as2(emit({
        _tag: "AttemptStart",
        attempt: state.attempt,
        stepAttempt: state.stepAttempt,
        stepIndex: state.stepIndex
      }), state);
    })),
    end: (state, exit3) => clockWith((clock) => {
      const duration = nanos(clock.monotonicTimeNanosUnsafe() - state.startNanos);
      return emit(exit3._tag === "Success" ? {
        _tag: "AttemptSuccess",
        attempt: state.attempt,
        stepAttempt: state.stepAttempt,
        stepIndex: state.stepIndex,
        duration
      } : {
        _tag: "AttemptFailure",
        attempt: state.attempt,
        stepAttempt: state.stepAttempt,
        stepIndex: state.stepIndex,
        duration,
        cause: exit3.cause
      });
    })
  };
};
var withExecutionPlan = /* @__PURE__ */ dual((args2) => isEffect(args2[0]), (self, plan, options3) => suspend(() => {
  let i = 0;
  let meta = {
    attempt: 0,
    stepIndex: 0
  };
  const provideMeta = provideServiceEffect(CurrentMetadata, sync(() => {
    meta = {
      attempt: meta.attempt + 1,
      stepIndex: i
    };
    return meta;
  }));
  const emitter = options3?.onEvent === void 0 ? void 0 : makeEventEmitter(options3.onEvent, () => meta);
  const instrument = emitter === void 0 ? identity : (attempt) => uninterruptibleMask((restore) => flatMap3(emitter.begin, (state) => onExit(restore(attempt), (exit3) => emitter.end(state, exit3))));
  let result3;
  return flatMap3(whileLoop({
    while: () => i < plan.steps.length && (result3 === void 0 || isFailure2(result3)),
    body() {
      const step = plan.steps[i];
      let nextEffect = provideMeta(instrument(provide3(self, step.provide)));
      if (result3) {
        let attempted = false;
        const wrapped = nextEffect;
        nextEffect = suspend(() => {
          if (attempted) return wrapped;
          attempted = true;
          return fromResult(result3);
        });
        nextEffect = retry(nextEffect, scheduleFromStep(step, false));
      } else {
        const schedule3 = scheduleFromStep(step, true);
        nextEffect = schedule3 ? retry(nextEffect, schedule3) : nextEffect;
      }
      return result(nextEffect);
    },
    step(result_) {
      result3 = result_;
      i++;
    }
  }), () => fromResult(result3));
}));
var scheduleFromStep = (step, first) => {
  if (!first) {
    return buildFromOptions({
      schedule: step.schedule ? step.schedule : step.attempts ? void 0 : scheduleOnce,
      times: step.attempts,
      while: step.while
    });
  } else if (step.attempts === 1 || !(step.schedule || step.attempts)) {
    return void 0;
  }
  return buildFromOptions({
    schedule: step.schedule,
    while: step.while,
    times: step.attempts ? step.attempts - 1 : void 0
  });
};
var scheduleOnce = /* @__PURE__ */ recurs(1);

// ../../node_modules/effect/dist/Request.js
var TypeId10 = "~effect/Request";
var requestVariance = /* @__PURE__ */ byReferenceUnsafe({
  /* c8 ignore next */
  _E: (_) => _,
  /* c8 ignore next */
  _A: (_) => _,
  /* c8 ignore next */
  _R: (_) => _
});
var RequestPrototype = {
  ...StructuralProto,
  [TypeId10]: requestVariance
};
var makeEntry = (options3) => options3;

// ../../node_modules/effect/dist/internal/request.js
var request = /* @__PURE__ */ dual(2, (self, resolver) => {
  const withResolver = (resolver2) => callback((resume) => {
    const entry = addEntry(resolver2, self, resume, getCurrentFiber());
    return maybeRemoveEntry(resolver2, entry);
  });
  return isEffect(resolver) ? flatMap3(resolver, withResolver) : withResolver(resolver);
});
var requestUnsafe = (self, options3) => {
  const entry = addEntry(options3.resolver, self, options3.onExit, {
    context: options3.context,
    cache: {
      scheduler: get(options3.context, Scheduler)
    }
  });
  return () => removeEntryUnsafe(options3.resolver, entry);
};
var batchPool = [];
var pendingBatches = /* @__PURE__ */ new WeakMap();
var addEntry = (resolver, request3, resume, fiber3) => {
  let batchMap = pendingBatches.get(resolver);
  if (!batchMap) {
    batchMap = /* @__PURE__ */ new Map();
    pendingBatches.set(resolver, batchMap);
  }
  let batch;
  let completed = false;
  const entry = makeEntry({
    request: request3,
    context: fiber3.context,
    uninterruptible: false,
    completeUnsafe(effect2) {
      if (completed) return;
      completed = true;
      if (batch && !batch.entrySet.delete(entry)) return;
      resume(effect2);
    }
  });
  if (resolver.preCheck !== void 0 && !resolver.preCheck(entry)) {
    return entry;
  }
  const key = resolver.batchKey(entry);
  batch = batchMap.get(key);
  if (!batch) {
    if (batchPool.length > 0) {
      batch = batchPool.pop();
      batch.key = key;
      batch.resolver = resolver;
      batch.map = batchMap;
    } else {
      const newBatch = {
        key,
        resolver,
        map: batchMap,
        entrySet: /* @__PURE__ */ new Set(),
        entries: /* @__PURE__ */ new Set(),
        delayEffect: flatMap3(suspend(() => newBatch.resolver.delay), (_) => runBatch(newBatch)),
        run: onExit(suspend(() => newBatch.resolver.runAll(Array.from(newBatch.entries), newBatch.key)), (exit3) => {
          for (const entry2 of newBatch.entrySet) {
            entry2.completeUnsafe(exit3._tag === "Success" ? exitDie(new Error("Effect.request: RequestResolver did not complete request", {
              cause: entry2.request
            })) : exit3);
          }
          newBatch.entries.clear();
          if (batchPool.length < 128) {
            newBatch.entrySet.clear();
            newBatch.key = void 0;
            newBatch.fiber = void 0;
            newBatch.resolver = void 0;
            newBatch.map = void 0;
            batchPool.push(newBatch);
          }
          return void_2;
        })
      };
      batch = newBatch;
    }
    batchMap.set(key, batch);
    batch.fiber = runForkWith(fiber3.context)(batch.delayEffect, {
      scheduler: fiber3.cache.scheduler
    });
  }
  batch.entrySet.add(entry);
  batch.entries.add(entry);
  if (batch.resolver.collectWhile(batch.entries)) return entry;
  batch.fiber.interruptUnsafe(fiber3.id);
  batch.fiber = runForkWith(fiber3.context)(runBatch(batch), {
    scheduler: fiber3.cache.scheduler
  });
  return entry;
};
var removeEntryUnsafe = (resolver, entry) => {
  if (entry.uninterruptible) return;
  const batchMap = pendingBatches.get(resolver);
  if (!batchMap) return;
  const key = resolver.batchKey(entry);
  const batch = batchMap.get(key);
  if (!batch) return;
  if (!batch.entries.delete(entry)) return;
  batch.entrySet.delete(entry);
  let fiber3;
  if (batch.entries.size === 0) {
    batchMap.delete(key);
    fiber3 = batch.fiber;
  }
  entry.completeUnsafe(exitInterrupt());
  fiber3?.interruptUnsafe();
};
var maybeRemoveEntry = (resolver, entry) => sync(() => removeEntryUnsafe(resolver, entry));
function runBatch(batch) {
  if (!batch.map.has(batch.key)) return void_2;
  batch.map.delete(batch.key);
  return batch.run;
}

// ../../node_modules/effect/dist/Metric.js
var CurrentMetricAttributesKey = "effect/Metric/CurrentMetricAttributes";
var CurrentMetricAttributes = /* @__PURE__ */ Reference(CurrentMetricAttributesKey, {
  defaultValue: () => ({})
});
var MetricRegistryKey = "effect/Metric/MetricRegistry";
var MetricRegistry = /* @__PURE__ */ Reference(MetricRegistryKey, {
  defaultValue: () => /* @__PURE__ */ new Map()
});
var TypeId11 = "~effect/Metric";
var Metric$ = class {
  [TypeId11] = TypeId11;
  #extraAttributes;
  #key = "";
  id;
  description;
  attributes;
  constructor(id2, description, attributes) {
    this.id = id2;
    this.description = description;
    this.attributes = attributes;
  }
  valueUnsafe(context3) {
    return this.hook(context3).get(context3);
  }
  modifyUnsafe(input, context3) {
    return this.hook(context3).modify(input, context3);
  }
  updateUnsafe(input, context3) {
    return this.hook(context3).update(input, context3);
  }
  hook(context3) {
    const extraAttributes = get(context3, CurrentMetricAttributes);
    if (extraAttributes !== this.#extraAttributes) {
      this.#extraAttributes = extraAttributes;
      this.#key = makeKey(this, mergeAttributes(this.attributes, extraAttributes));
    }
    const registry = get(context3, MetricRegistry);
    let metadata = registry.get(this.#key);
    if (isUndefined(metadata)) {
      metadata = {
        id: this.id,
        type: this.type,
        description: this.description,
        attributes: Object.keys(extraAttributes).length > 0 ? mergeAttributes(this.attributes, extraAttributes) : this.attributes,
        hooks: this.createHooks()
      };
      registry.set(this.#key, metadata);
    }
    return metadata.hooks;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var update = /* @__PURE__ */ dual(2, (self, input) => contextWith((services) => sync(() => self.updateUnsafe(input, services))));
function makeKey(metric, attributes) {
  const entries3 = Object.entries(attributes).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  return JSON.stringify([metric.type, metric.id, metric.description, entries3]);
}
function mergeAttributes(self, other) {
  return {
    ...attributesToRecord(self),
    ...attributesToRecord(other)
  };
}
function attributesToRecord(attributes) {
  if (isNotUndefined(attributes) && Array.isArray(attributes)) {
    return attributes.reduce((acc, [key, value3]) => {
      assignProperty(acc, key, value3);
      return acc;
    }, {});
  }
  return attributes;
}

// ../../node_modules/effect/dist/Effect.js
var TypeId12 = EffectTypeId;
var isEffect2 = isEffect;
var all4 = all3;
var partition3 = partition2;
var reduce2 = reduce;
var validate2 = validate;
var findFirst4 = findFirst3;
var findFirstFilter2 = findFirstFilter;
var forEach2 = forEach;
var head2 = head;
var whileLoop2 = whileLoop;
var promise2 = promise;
var tryPromise2 = tryPromise;
var succeed6 = succeed3;
var succeedNone2 = succeedNone;
var succeedSome2 = succeedSome;
var suspend3 = suspend;
var sync3 = sync;
var void_4 = void_2;
var undefined_2 = undefined_;
var callback2 = callback;
var never2 = never;
var Do3 = Do2;
var bindTo4 = bindTo3;
var let_4 = let_3;
var bind4 = bind3;
var gen3 = gen2;
var fail6 = fail3;
var failSync2 = failSync;
var failCause3 = failCause;
var failCauseSync2 = failCauseSync;
var die3 = die;
var try_3 = try_2;
var yieldNow2 = yieldNow;
var yieldNowWith2 = yieldNowWith;
var withFiber2 = withFiber;
var withFiberSucceed2 = withFiberSucceed;
var fromResult2 = fromResult;
var fromOption3 = fromOption2;
var transposeOption2 = transposeOption;
var fromNullishOr3 = fromNullishOr2;
var flatMap5 = flatMap3;
var flatten4 = flatten3;
var andThen3 = andThen2;
var tap4 = tap2;
var result2 = result;
var option2 = option;
var exit2 = exit;
var map7 = map5;
var as3 = as2;
var asSome2 = asSome;
var asVoid3 = asVoid2;
var flip2 = flip;
var zip2 = zip;
var zipWith3 = zipWith2;
var catch_3 = catch_;
var catchTag3 = catchTag;
var catchTags2 = catchTags;
var catchReason2 = catchReason;
var catchReasons2 = catchReasons;
var unwrapReason2 = unwrapReason;
var catchCause3 = catchCause;
var catchDefect2 = catchDefect;
var catchIf2 = catchIf;
var catchFilter2 = catchFilter;
var catchNoSuchElement2 = catchNoSuchElement;
var catchCauseIf2 = catchCauseIf;
var catchCauseFilter2 = catchCauseFilter;
var mapError3 = mapError2;
var mapBoth2 = mapBoth;
var orDie3 = orDie;
var tapError3 = tapError;
var tapErrorTag2 = tapErrorTag;
var tapCause3 = tapCause;
var tapCauseIf2 = tapCauseIf;
var tapCauseFilter2 = tapCauseFilter;
var tapDefect2 = tapDefect;
var eventually2 = eventually;
var retry2 = retry;
var retryOrElse2 = retryOrElse;
var sandbox2 = sandbox;
var ignore2 = ignore;
var ignoreCause2 = ignoreCause;
var withExecutionPlan2 = withExecutionPlan;
var withErrorReporting2 = withErrorReporting;
var orElseSucceed2 = orElseSucceed;
var firstSuccessOf2 = firstSuccessOf;
var timeout2 = timeout;
var timeoutOption2 = timeoutOption;
var timeoutOrElse2 = timeoutOrElse;
var delay2 = delay;
var sleep2 = sleep;
var timed2 = timed;
var raceAll2 = raceAll;
var raceAllFirst2 = raceAllFirst;
var race2 = race;
var raceFirst2 = raceFirst;
var filter5 = filter4;
var filterMap3 = filterMap2;
var filterMapEffect2 = filterMapEffect;
var filterOrElse2 = filterOrElse;
var filterMapOrElse2 = filterMapOrElse;
var filterOrFail2 = filterOrFail;
var filterMapOrFail2 = filterMapOrFail;
var when2 = when;
var match5 = match4;
var matchEager2 = matchEager;
var matchCause2 = matchCause;
var matchCauseEager2 = matchCauseEager;
var matchCauseEffectEager2 = matchCauseEffectEager;
var matchCauseEffect2 = matchCauseEffect;
var matchEffect3 = matchEffect;
var isFailure5 = isFailure3;
var isSuccess5 = isSuccess3;
var context2 = context;
var contextWith2 = contextWith;
var provide4 = provide3;
var provideContext2 = provideContext;
var setContext2 = setContext;
var service2 = service;
var serviceOption2 = serviceOption;
var updateContext2 = updateContext;
var updateService3 = updateService;
var updateServiceScoped2 = updateServiceScoped;
var provideService2 = provideService;
var provideServiceEffect2 = provideServiceEffect;
var scope2 = scope;
var scoped2 = scoped;
var scopedWith2 = scopedWith;
var acquireRelease2 = acquireRelease;
var acquireDisposable2 = acquireDisposable;
var acquireUseRelease2 = acquireUseRelease;
var addFinalizer3 = addFinalizer;
var ensuring2 = ensuring;
var onError2 = onError;
var onErrorIf2 = onErrorIf;
var onErrorFilter2 = onErrorFilter;
var onExitPrimitive2 = onExitPrimitive;
var onExit2 = onExit;
var onExitIf2 = onExitIf;
var onExitFilter2 = onExitFilter;
var cached2 = cached;
var cachedWithTTL2 = cachedWithTTL;
var cachedInvalidateWithTTL2 = cachedInvalidateWithTTL;
var interrupt2 = interrupt;
var interruptible2 = interruptible;
var onInterrupt2 = onInterrupt;
var uninterruptible2 = uninterruptible;
var uninterruptibleMask2 = uninterruptibleMask;
var interruptibleMask2 = interruptibleMask;
var abortSignal2 = abortSignal;
var forever3 = forever;
var repeat2 = repeat;
var repeatOrElse2 = repeatOrElse;
var replicate2 = replicate;
var replicateEffect2 = replicateEffect;
var schedule = /* @__PURE__ */ dual(2, (self, schedule3) => scheduleFrom2(self, void 0, schedule3));
var scheduleFrom2 = scheduleFrom;
var tracer2 = tracer;
var withTracer2 = withTracer;
var withTracerEnabled2 = withTracerEnabled;
var withTracerTiming2 = withTracerTiming;
var annotateSpans2 = annotateSpans;
var annotateCurrentSpan2 = annotateCurrentSpan;
var currentSpan2 = currentSpan;
var currentParentSpan2 = currentParentSpan;
var spanAnnotations2 = spanAnnotations;
var spanLinks2 = spanLinks;
var linkSpans2 = linkSpans;
var makeSpan2 = makeSpan;
var makeSpanScoped2 = makeSpanScoped;
var useSpan2 = useSpan;
var withSpan3 = withSpan;
var withSpanScoped2 = withSpanScoped;
var withParentSpan3 = withParentSpan;
var request2 = request;
var requestUnsafe2 = requestUnsafe;
var forkChild2 = forkChild;
var forkIn2 = forkIn;
var forkScoped2 = forkScoped;
var forkDetach2 = forkDetach;
var awaitAllChildren2 = awaitAllChildren;
var fiber2 = fiber;
var fiberId2 = fiberId;
var runFork2 = runFork;
var runForkWith2 = runForkWith;
var runCallbackWith2 = runCallbackWith;
var runCallback2 = runCallback;
var runPromise2 = runPromise;
var runPromiseWith2 = runPromiseWith;
var runPromiseExit2 = runPromiseExit;
var runPromiseExitWith2 = runPromiseExitWith;
var runSync2 = runSync;
var runSyncWith2 = runSyncWith;
var runSyncExit2 = runSyncExit;
var runSyncExitWith2 = runSyncExitWith;
var fnUntraced2 = fnUntraced;
var fn2 = fn;
var clockWith3 = clockWith;
var logWithLevel2 = logWithLevel;
var log = /* @__PURE__ */ logWithLevel();
var logFatal = /* @__PURE__ */ logWithLevel("Fatal");
var logWarning = /* @__PURE__ */ logWithLevel("Warn");
var logError = /* @__PURE__ */ logWithLevel("Error");
var logInfo = /* @__PURE__ */ logWithLevel("Info");
var logDebug = /* @__PURE__ */ logWithLevel("Debug");
var logTrace = /* @__PURE__ */ logWithLevel("Trace");
var withLogger = /* @__PURE__ */ dual(2, (effect2, logger) => updateService(effect2, CurrentLoggers, (loggers) => /* @__PURE__ */ new Set([...loggers, logger])));
var annotateLogs = /* @__PURE__ */ dual((args2) => isEffect2(args2[0]), (effect2, ...args2) => updateService(effect2, CurrentLogAnnotations2, (annotations) => {
  const newAnnotations = args2.length === 1 ? {
    ...annotations,
    ...args2[0]
  } : {
    ...annotations
  };
  if (args2.length === 1) {
    return newAnnotations;
  } else {
    assignProperty(newAnnotations, args2[0], args2[1]);
  }
  return newAnnotations;
}));
var annotateLogsScoped2 = annotateLogsScoped;
var withLogSpan = /* @__PURE__ */ dual(2, (effect2, label) => flatMap3(currentTimeMillis, (now2) => updateService(effect2, CurrentLogSpans2, (spans) => {
  const span2 = [label, now2];
  return [span2, ...spans];
})));
var track = /* @__PURE__ */ dual((args2) => isEffect2(args2[0]), (self, metric, f) => onExit2(self, (exit3) => {
  const input = f === void 0 ? exit3 : f(exit3);
  return update(metric, input);
}));
var trackSuccesses = /* @__PURE__ */ dual((args2) => isEffect2(args2[0]), (self, metric, f) => tap4(self, (value3) => {
  const input = f === void 0 ? value3 : f(value3);
  return update(metric, input);
}));
var trackErrors = /* @__PURE__ */ dual((args2) => isEffect2(args2[0]), (self, metric, f) => tapError3(self, (error) => {
  const input = f === void 0 ? error : f(error);
  return update(metric, input);
}));
var trackDefects = /* @__PURE__ */ dual((args2) => isEffect2(args2[0]), (self, metric, f) => tapDefect2(self, (defect) => {
  const input = f === void 0 ? defect : f(defect);
  return update(metric, input);
}));
var trackDuration = /* @__PURE__ */ dual((args2) => isEffect2(args2[0]), (self, metric, f) => clockWith3((clock) => {
  const startTime = clock.monotonicTimeNanosUnsafe();
  return onExit2(self, () => {
    const endTime = clock.monotonicTimeNanosUnsafe();
    const duration = subtract(fromInputUnsafe(endTime), fromInputUnsafe(startTime));
    const input = f === void 0 ? duration : f(duration);
    return update(metric, input);
  });
}));
var Transaction = class extends (/* @__PURE__ */ Service()("effect/Effect/Transaction")) {
};
var tx = (effect2) => withFiber2((fiber3) => {
  let state = getOrUndefined2(fiber3.context, Transaction);
  if (state) {
    return effect2;
  }
  state = {
    journal: /* @__PURE__ */ new Map(),
    retry: false
  };
  let result3;
  return uninterruptibleMask2((restore) => flatMap5(whileLoop2({
    while: () => !result3,
    body: constant(restore(effect2).pipe(provideService2(Transaction, state), tapCause3(() => {
      if (!state.retry) return void_4;
      return restore(awaitPendingTransaction(state));
    }), exit2)),
    step(exit3) {
      if (state.retry || !isTransactionConsistent(state)) {
        return clearTransaction(state);
      }
      if (isSuccess4(exit3)) {
        commitTransaction(fiber3, state);
      } else {
        clearTransaction(state);
      }
      result3 = exit3;
    }
  }), () => result3));
});
var isTransactionConsistent = (state) => {
  for (const [ref, {
    version
  }] of state.journal) {
    if (ref.version !== version) {
      return false;
    }
  }
  return true;
};
var awaitPendingTransaction = (state) => callback2((resume) => {
  if (!isTransactionConsistent(state)) {
    return resume(void_4);
  }
  const key = {};
  const refs = Array.from(state.journal.keys());
  const clearPending = () => {
    for (const clear2 of refs) {
      clear2.pending.delete(key);
    }
  };
  const onCall = () => {
    clearPending();
    resume(void_4);
  };
  for (const ref of refs) {
    ref.pending.set(key, onCall);
  }
  return sync3(clearPending);
});
function commitTransaction(fiber3, state) {
  for (const [ref, {
    value: value3,
    written
  }] of state.journal) {
    if (!written) continue;
    if (!Object.is(value3, ref.value)) {
      ref.version = ref.version + 1;
      ref.value = value3;
    }
    for (const pending of ref.pending.values()) {
      fiber3.currentDispatcher.scheduleTask(pending, 0);
    }
    ref.pending.clear();
  }
}
function clearTransaction(state) {
  state.retry = false;
  state.journal.clear();
}
var txRetry = /* @__PURE__ */ flatMap5(Transaction, (state) => {
  state.retry = true;
  return interrupt2;
});
var effectify = (fn3, onError4, onSyncError) => (...args2) => callback2((resume) => {
  try {
    fn3(...args2, (err, result3) => {
      if (err) {
        resume(fail6(onError4 ? onError4(err, args2) : err));
      } else {
        resume(succeed6(result3));
      }
    });
  } catch (err) {
    resume(onSyncError ? fail6(onSyncError(err, args2)) : die3(err));
  }
});
var satisfiesSuccessType2 = () => (effect2) => effect2;
var satisfiesErrorType2 = () => (effect2) => effect2;
var satisfiesServicesType2 = () => (effect2) => effect2;
var mapEager2 = mapEager;
var mapErrorEager2 = mapErrorEager;
var mapBothEager2 = mapBothEager;
var flatMapEager2 = flatMapEager;
var catchEager2 = catchEager;
var fnUntracedEager2 = fnUntracedEager;

// ../../node_modules/effect/dist/BigDecimal.js
var FINITE_INT_REGEXP = /^[+-]?\d+$/;
var TypeId13 = "~effect/BigDecimal";
var BigDecimalProto = {
  [TypeId13]: TypeId13,
  [symbol]() {
    const normalized = normalize2(this);
    return combine(string(String(normalized.value)), number(normalized.scale));
  },
  [symbol2](that) {
    return isBigDecimal(that) && compare(this, that) === 0;
  },
  toString() {
    return `BigDecimal(${format3(this)})`;
  },
  toJSON() {
    return {
      _id: "BigDecimal",
      value: String(this.value),
      scale: this.scale
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isBigDecimal = (u) => hasProperty(u, TypeId13);
var make9 = (value3, scale) => {
  if (!Number.isSafeInteger(scale)) {
    throw new RangeError(`Scale must be a safe integer, got ${scale}`);
  }
  const o = Object.create(BigDecimalProto);
  o.value = value3;
  o.scale = scale;
  return o;
};
var makeNormalized = (value3, scale) => {
  const o = make9(value3, scale);
  o.normalized = o;
  return o;
};
var bigint03 = /* @__PURE__ */ BigInt(0);
var bigint12 = /* @__PURE__ */ BigInt(1);
var bigint102 = /* @__PURE__ */ BigInt(10);
var zero2 = /* @__PURE__ */ makeNormalized(bigint03, 0);
var normalize2 = (self) => {
  if (self.normalized === void 0) {
    if (self.value === bigint03) {
      self.normalized = zero2;
    } else {
      const digits = `${self.value}`;
      let end = digits.length;
      while (digits[end - 1] === "0") end--;
      self.normalized = makeNormalized(BigInt(digits.slice(0, end)), self.scale - (digits.length - end));
    }
  }
  return self.normalized;
};
var MAX_COMPARISON_SCALE_ALIGNMENT = 100;
var comparisonPowersOfTen = [bigint12];
var compareBigInt = (self, that) => self === that ? 0 : self < that ? -1 : 1;
var compareMagnitude = (self, that) => {
  const selfDigits = `${self.value < bigint03 ? -self.value : self.value}`;
  const thatDigits = `${that.value < bigint03 ? -that.value : that.value}`;
  const exponentDifference = BigInt(selfDigits.length - thatDigits.length) - BigInt(self.scale) + BigInt(that.scale);
  if (exponentDifference !== bigint03) return exponentDifference < bigint03 ? -1 : 1;
  const length = Math.max(selfDigits.length, thatDigits.length);
  return String2(selfDigits.padEnd(length, "0"), thatDigits.padEnd(length, "0"));
};
var compare = (self, that) => {
  if (self.scale === that.scale) return compareBigInt(self.value, that.value);
  const selfSign = sign(self);
  const thatSign = sign(that);
  if (selfSign !== thatSign) return selfSign < thatSign ? -1 : 1;
  if (selfSign === 0) return 0;
  const scaleDifference = self.scale - that.scale;
  const absoluteScaleDifference = Math.abs(scaleDifference);
  if (absoluteScaleDifference > MAX_COMPARISON_SCALE_ALIGNMENT) {
    return selfSign === -1 ? compareMagnitude(that, self) : compareMagnitude(self, that);
  }
  const powerOfTen = comparisonPowersOfTen[absoluteScaleDifference] ??= bigint102 ** BigInt(absoluteScaleDifference);
  return scaleDifference > 0 ? compareBigInt(self.value, that.value * powerOfTen) : compareBigInt(self.value * powerOfTen, that.value);
};
var Order2 = /* @__PURE__ */ make4(compare);
var sign = (n) => n.value === bigint03 ? 0 : n.value < bigint03 ? -1 : 1;
var fromString = (s) => {
  if (s === "") {
    return some2(zero2);
  }
  let base;
  let exp;
  const seperator = s.search(/[eE]/);
  if (seperator !== -1) {
    const trail = s.slice(seperator + 1);
    base = s.slice(0, seperator);
    exp = Number(trail);
    if (base === "" || !Number.isSafeInteger(exp) || !FINITE_INT_REGEXP.test(trail)) {
      return none2();
    }
  } else {
    base = s;
    exp = 0;
  }
  let digits;
  let offset;
  const dot = base.search(/\./);
  if (dot !== -1) {
    const lead = base.slice(0, dot);
    const trail = base.slice(dot + 1);
    digits = `${lead}${trail}`;
    offset = trail.length;
  } else {
    digits = base;
    offset = 0;
  }
  if (!FINITE_INT_REGEXP.test(digits)) {
    return none2();
  }
  const scale = offset - exp;
  if (!Number.isSafeInteger(scale)) {
    return none2();
  }
  return some2(make9(BigInt(digits), scale));
};
var format3 = (n) => {
  const normalized = normalize2(n);
  if (Math.abs(normalized.scale) >= 16) {
    return toExponential(normalized);
  }
  const negative = normalized.value < bigint03;
  const absolute = `${negative ? -normalized.value : normalized.value}`;
  const digits = normalized.scale > 0 ? absolute.padStart(normalized.scale + 1, "0") : absolute.padEnd(absolute.length - normalized.scale, "0");
  const point = digits.length - normalized.scale;
  const complete = normalized.scale > 0 ? `${digits.slice(0, point)}.${digits.slice(point)}` : digits;
  return negative ? `-${complete}` : complete;
};
var toExponential = (n) => {
  if (isZero2(n)) {
    return "0e+0";
  }
  const normalized = normalize2(n);
  const digits = `${normalized.value}`;
  const point = normalized.value < bigint03 ? 2 : 1;
  const head5 = digits.slice(0, point);
  const tail = digits.slice(point);
  const exp = tail.length - normalized.scale;
  return `${head5}${tail === "" ? "" : `.${tail}`}e${exp >= 0 ? "+" : ""}${exp}`;
};
var isZero2 = (n) => n.value === bigint03;

// ../../node_modules/effect/dist/Schema.js
var Schema_exports = {};
__export(Schema_exports, {
  Any: () => Any2,
  Array: () => ArraySchema,
  ArrayEnsure: () => ArrayEnsure,
  BigDecimal: () => BigDecimal,
  BigDecimalFromString: () => BigDecimalFromString,
  BigInt: () => BigInt6,
  BigIntFromString: () => BigIntFromString,
  Boolean: () => Boolean2,
  BooleanFromBit: () => BooleanFromBit,
  BooleanLiterals: () => BooleanLiterals,
  ByteSize: () => ByteSize,
  ByteSizeFromBigInt: () => ByteSizeFromBigInt,
  ByteSizeFromNumber: () => ByteSizeFromNumber,
  ByteSizeFromString: () => ByteSizeFromString,
  Cause: () => Cause,
  CauseReason: () => CauseReason,
  Char: () => Char,
  Chunk: () => Chunk,
  Class: () => Class4,
  Cookie: () => Cookie,
  Cookies: () => Cookies,
  Date: () => Date4,
  DateFromMillis: () => DateFromMillis,
  DateFromString: () => DateFromString,
  DateTimeUtc: () => DateTimeUtc,
  DateTimeUtcFromDate: () => DateTimeUtcFromDate,
  DateTimeUtcFromMillis: () => DateTimeUtcFromMillis,
  DateTimeUtcFromString: () => DateTimeUtcFromString,
  DateTimeZoned: () => DateTimeZoned,
  DateTimeZonedFromString: () => DateTimeZonedFromString,
  Defect: () => Defect,
  Duration: () => Duration,
  DurationFromMillis: () => DurationFromMillis,
  DurationFromNanos: () => DurationFromNanos,
  DurationFromString: () => DurationFromString,
  Enum: () => Enum2,
  Error: () => Error4,
  ErrorInstance: () => ErrorInstance,
  Exit: () => Exit,
  FalseLiterals: () => FalseLiterals,
  File: () => File,
  Finite: () => Finite,
  FiniteFromString: () => FiniteFromString,
  FormData: () => FormData2,
  Graph: () => Graph,
  HashMap: () => HashMap,
  HashSet: () => HashSet,
  Headers: () => Headers,
  InetAddress: () => InetAddress,
  InetAddressFromString: () => InetAddressFromString,
  InetAddressV4: () => InetAddressV4,
  InetAddressV6: () => InetAddressV6,
  Int: () => Int,
  IpAddress: () => IpAddress,
  IpAddressFromString: () => IpAddressFromString,
  IpInterface: () => IpInterface,
  IpInterfaceFromString: () => IpInterfaceFromString,
  IpLinkLocalAddress: () => IpLinkLocalAddress,
  IpLinkLocalAddressFromString: () => IpLinkLocalAddressFromString,
  IpLoopbackAddress: () => IpLoopbackAddress,
  IpLoopbackAddressFromString: () => IpLoopbackAddressFromString,
  IpMulticastAddress: () => IpMulticastAddress,
  IpMulticastAddressFromString: () => IpMulticastAddressFromString,
  IpNetwork: () => IpNetwork,
  IpNetworkFromString: () => IpNetworkFromString,
  IpUnicastAddress: () => IpUnicastAddress,
  IpUnicastAddressFromString: () => IpUnicastAddressFromString,
  IpUnspecifiedAddress: () => IpUnspecifiedAddress,
  IpUnspecifiedAddressFromString: () => IpUnspecifiedAddressFromString,
  Ipv4Address: () => Ipv4Address,
  Ipv4AddressFromString: () => Ipv4AddressFromString,
  Ipv4BroadcastAddress: () => Ipv4BroadcastAddress,
  Ipv4BroadcastAddressFromString: () => Ipv4BroadcastAddressFromString,
  Ipv4Interface: () => Ipv4Interface,
  Ipv4InterfaceFromString: () => Ipv4InterfaceFromString,
  Ipv4Network: () => Ipv4Network,
  Ipv4NetworkFromString: () => Ipv4NetworkFromString,
  Ipv4PrivateAddress: () => Ipv4PrivateAddress,
  Ipv4PrivateAddressFromString: () => Ipv4PrivateAddressFromString,
  Ipv6Address: () => Ipv6Address,
  Ipv6AddressFromString: () => Ipv6AddressFromString,
  Ipv6Interface: () => Ipv6Interface,
  Ipv6InterfaceFromString: () => Ipv6InterfaceFromString,
  Ipv6Network: () => Ipv6Network,
  Ipv6NetworkFromString: () => Ipv6NetworkFromString,
  Ipv6UniqueLocalAddress: () => Ipv6UniqueLocalAddress,
  Ipv6UniqueLocalAddressFromString: () => Ipv6UniqueLocalAddressFromString,
  Json: () => Json2,
  JsonFromUrlParamsField: () => JsonFromUrlParamsField,
  JsonObject: () => JsonObject,
  Literal: () => Literal2,
  Literals: () => Literals,
  MacAddress: () => MacAddress,
  MacAddressFromString: () => MacAddressFromString,
  MacBroadcastAddress: () => MacBroadcastAddress,
  MacBroadcastAddressFromString: () => MacBroadcastAddressFromString,
  MacLocallyAdministeredAddress: () => MacLocallyAdministeredAddress,
  MacLocallyAdministeredAddressFromString: () => MacLocallyAdministeredAddressFromString,
  MacMulticastAddress: () => MacMulticastAddress,
  MacMulticastAddressFromString: () => MacMulticastAddressFromString,
  MacUnicastAddress: () => MacUnicastAddress,
  MacUnicastAddressFromString: () => MacUnicastAddressFromString,
  MacUniversallyAdministeredAddress: () => MacUniversallyAdministeredAddress,
  MacUniversallyAdministeredAddressFromString: () => MacUniversallyAdministeredAddressFromString,
  MutableJson: () => MutableJson2,
  Natural: () => Natural,
  Never: () => Never2,
  NonEmptyArray: () => NonEmptyArray,
  NonEmptyString: () => NonEmptyString,
  Null: () => Null2,
  NullOr: () => NullOr,
  NullishOr: () => NullishOr,
  Number: () => Number6,
  NumberFromString: () => NumberFromString,
  ObjectKeyword: () => ObjectKeyword2,
  Opaque: () => Opaque,
  Option: () => Option,
  OptionFromNullOr: () => OptionFromNullOr,
  OptionFromNullishOr: () => OptionFromNullishOr,
  OptionFromOptional: () => OptionFromOptional,
  OptionFromOptionalKey: () => OptionFromOptionalKey,
  OptionFromOptionalNullOr: () => OptionFromOptionalNullOr,
  OptionFromUndefinedOr: () => OptionFromUndefinedOr,
  PropertyKey: () => PropertyKey,
  ReadonlyMap: () => ReadonlyMap,
  ReadonlySet: () => ReadonlySet,
  Record: () => Record,
  RecordFromCookies: () => RecordFromCookies,
  RecordFromUrlParams: () => RecordFromUrlParams,
  Redacted: () => Redacted,
  RedactedFromValue: () => RedactedFromValue,
  RegExp: () => RegExp3,
  Result: () => Result,
  SchemaError: () => SchemaError,
  SocketAddress: () => SocketAddress,
  StandardSchemaV1FailureResult: () => StandardSchemaV1FailureResult,
  String: () => String6,
  StringForLiteralAutocomplete: () => StringForLiteralAutocomplete,
  StringFromBase64: () => StringFromBase64,
  StringFromBase64Url: () => StringFromBase64Url,
  StringFromHex: () => StringFromHex,
  StringFromUriComponent: () => StringFromUriComponent,
  Struct: () => Struct,
  StructWithRest: () => StructWithRest,
  Symbol: () => Symbol3,
  TaggedClass: () => TaggedClass,
  TaggedError: () => TaggedError3,
  TaggedStruct: () => TaggedStruct,
  TaggedUnion: () => TaggedUnion,
  TemplateLiteral: () => TemplateLiteral2,
  TemplateLiteralParser: () => TemplateLiteralParser,
  TimeZone: () => TimeZone,
  TimeZoneFromString: () => TimeZoneFromString,
  TimeZoneNamed: () => TimeZoneNamed,
  TimeZoneNamedFromString: () => TimeZoneNamedFromString,
  TimeZoneOffset: () => TimeZoneOffset,
  Tree: () => Tree,
  Trim: () => Trim,
  Trimmed: () => Trimmed,
  TrueLiterals: () => TrueLiterals,
  Tuple: () => Tuple2,
  TupleWithRest: () => TupleWithRest,
  URL: () => URL2,
  URLFromString: () => URLFromString,
  URLSearchParams: () => URLSearchParams2,
  Uint8Array: () => Uint8Array2,
  Uint8ArrayFromBase64: () => Uint8ArrayFromBase64,
  Uint8ArrayFromBase64Url: () => Uint8ArrayFromBase64Url,
  Uint8ArrayFromHex: () => Uint8ArrayFromHex,
  Undefined: () => Undefined2,
  UndefinedOr: () => UndefinedOr,
  Union: () => Union2,
  UniqueArray: () => UniqueArray,
  UniqueSymbol: () => UniqueSymbol2,
  UnixPathAddress: () => UnixPathAddress,
  UnixPathAddressFromString: () => UnixPathAddressFromString,
  Unknown: () => Unknown2,
  UnknownFromJsonString: () => UnknownFromJsonString,
  UrlParams: () => UrlParams,
  Void: () => Void2,
  annotate: () => annotate2,
  annotateEncoded: () => annotateEncoded,
  annotateKey: () => annotateKey2,
  asserts: () => asserts2,
  brand: () => brand,
  catchDecoding: () => catchDecoding,
  catchDecodingWithContext: () => catchDecodingWithContext,
  catchEncoding: () => catchEncoding,
  catchEncodingWithContext: () => catchEncodingWithContext,
  check: () => check,
  declare: () => declare,
  declareConstructor: () => declareConstructor,
  decode: () => decode4,
  decodeEffect: () => decodeEffect2,
  decodeExit: () => decodeExit,
  decodeOption: () => decodeOption2,
  decodePromise: () => decodePromise,
  decodeResult: () => decodeResult,
  decodeSync: () => decodeSync2,
  decodeTo: () => decodeTo2,
  decodeUnknownEffect: () => decodeUnknownEffect2,
  decodeUnknownExit: () => decodeUnknownExit2,
  decodeUnknownOption: () => decodeUnknownOption2,
  decodeUnknownPromise: () => decodeUnknownPromise,
  decodeUnknownResult: () => decodeUnknownResult2,
  decodeUnknownSync: () => decodeUnknownSync2,
  encode: () => encode4,
  encodeEffect: () => encodeEffect2,
  encodeExit: () => encodeExit,
  encodeKeys: () => encodeKeys,
  encodeOption: () => encodeOption2,
  encodePromise: () => encodePromise,
  encodeResult: () => encodeResult,
  encodeSync: () => encodeSync2,
  encodeTo: () => encodeTo,
  encodeUnknownEffect: () => encodeUnknownEffect2,
  encodeUnknownExit: () => encodeUnknownExit2,
  encodeUnknownOption: () => encodeUnknownOption2,
  encodeUnknownPromise: () => encodeUnknownPromise,
  encodeUnknownResult: () => encodeUnknownResult2,
  encodeUnknownSync: () => encodeUnknownSync2,
  extendTo: () => extendTo,
  fieldsAssign: () => fieldsAssign,
  flip: () => flip4,
  fromBrand: () => fromBrand,
  fromFormData: () => fromFormData2,
  fromJsonString: () => fromJsonString2,
  fromURLSearchParams: () => fromURLSearchParams2,
  instanceOf: () => instanceOf,
  is: () => is2,
  isBase64: () => isBase64,
  isBase64Url: () => isBase64Url,
  isBetween: () => isBetween2,
  isBetweenBigDecimal: () => isBetweenBigDecimal,
  isBetweenBigInt: () => isBetweenBigInt,
  isBetweenCodePoints: () => isBetweenCodePoints,
  isBetweenDate: () => isBetweenDate,
  isBetweenLength: () => isBetweenLength,
  isBetweenProperties: () => isBetweenProperties,
  isBetweenSize: () => isBetweenSize,
  isCapitalized: () => isCapitalized,
  isEndingWith: () => isEndingWith,
  isFinite: () => isFinite3,
  isGUID: () => isGUID,
  isGreaterThan: () => isGreaterThan4,
  isGreaterThanBigDecimal: () => isGreaterThanBigDecimal,
  isGreaterThanBigInt: () => isGreaterThanBigInt,
  isGreaterThanDate: () => isGreaterThanDate,
  isGreaterThanOrEqualTo: () => isGreaterThanOrEqualTo4,
  isGreaterThanOrEqualToBigDecimal: () => isGreaterThanOrEqualToBigDecimal,
  isGreaterThanOrEqualToBigInt: () => isGreaterThanOrEqualToBigInt,
  isGreaterThanOrEqualToDate: () => isGreaterThanOrEqualToDate,
  isIncluding: () => isIncluding,
  isInt: () => isInt,
  isInt32: () => isInt32,
  isLessThan: () => isLessThan4,
  isLessThanBigDecimal: () => isLessThanBigDecimal,
  isLessThanBigInt: () => isLessThanBigInt,
  isLessThanDate: () => isLessThanDate,
  isLessThanOrEqualTo: () => isLessThanOrEqualTo5,
  isLessThanOrEqualToBigDecimal: () => isLessThanOrEqualToBigDecimal,
  isLessThanOrEqualToBigInt: () => isLessThanOrEqualToBigInt,
  isLessThanOrEqualToDate: () => isLessThanOrEqualToDate,
  isLowercased: () => isLowercased,
  isMaxCodePoints: () => isMaxCodePoints,
  isMaxLength: () => isMaxLength,
  isMaxProperties: () => isMaxProperties,
  isMaxSize: () => isMaxSize,
  isMinCodePoints: () => isMinCodePoints,
  isMinLength: () => isMinLength,
  isMinProperties: () => isMinProperties,
  isMinSize: () => isMinSize,
  isMultipleOf: () => isMultipleOf,
  isNonEmpty: () => isNonEmpty,
  isPattern: () => isPattern2,
  isPropertyNames: () => isPropertyNames,
  isSchema: () => isSchema,
  isSchemaError: () => isSchemaError2,
  isStartingWith: () => isStartingWith,
  isStringBigInt: () => isStringBigInt2,
  isStringFinite: () => isStringFinite2,
  isStringSymbol: () => isStringSymbol2,
  isTrimmed: () => isTrimmed,
  isULID: () => isULID,
  isUUID: () => isUUID,
  isUint32: () => isUint32,
  isUncapitalized: () => isUncapitalized,
  isUnique: () => isUnique,
  isUniqueKey: () => isUniqueKey,
  isUppercased: () => isUppercased,
  link: () => link,
  linkDecoding: () => linkDecoding,
  make: () => make23,
  makeFilter: () => makeFilter2,
  makeFilterGroup: () => makeFilterGroup,
  makeIsBetween: () => makeIsBetween,
  makeIsGreaterThan: () => makeIsGreaterThan,
  makeIsGreaterThanOrEqualTo: () => makeIsGreaterThanOrEqualTo,
  makeIsLessThan: () => makeIsLessThan,
  makeIsLessThanOrEqualTo: () => makeIsLessThanOrEqualTo,
  makeIsMultipleOf: () => makeIsMultipleOf,
  middlewareDecoding: () => middlewareDecoding2,
  middlewareEncoding: () => middlewareEncoding2,
  mutable: () => mutable2,
  mutableKey: () => mutableKey2,
  optional: () => optional2,
  optionalKey: () => optionalKey2,
  overrideToCodecIso: () => overrideToCodecIso,
  overrideToEquivalence: () => overrideToEquivalence,
  overrideToFormatter: () => overrideToFormatter,
  readonlyKey: () => readonlyKey,
  refine: () => refine,
  required: () => required,
  requiredKey: () => requiredKey,
  resolveAnnotations: () => resolveAnnotations,
  resolveAnnotationsKey: () => resolveAnnotationsKey,
  revealBottom: () => revealBottom,
  revealCodec: () => revealCodec,
  suspend: () => suspend4,
  tag: () => tag,
  tagDefaultOmit: () => tagDefaultOmit,
  toCodecArrayFromSingle: () => toCodecArrayFromSingle2,
  toCodecIso: () => toCodecIso2,
  toCodecJson: () => toCodecJson2,
  toCodecStringTree: () => toCodecStringTree2,
  toDifferJsonPatch: () => toDifferJsonPatch2,
  toEncoded: () => toEncoded2,
  toEncoderXml: () => toEncoderXml2,
  toEquivalence: () => toEquivalence2,
  toFormatter: () => toFormatter2,
  toIso: () => toIso2,
  toIsoFocus: () => toIsoFocus2,
  toIsoSource: () => toIsoSource2,
  toJsonSchemaDocument: () => toJsonSchemaDocument3,
  toRepresentation: () => toRepresentation2,
  toStandardJSONSchemaV1: () => toStandardJSONSchemaV12,
  toStandardSchemaV1: () => toStandardSchemaV12,
  toTaggedUnion: () => toTaggedUnion,
  toType: () => toType2,
  withArrayLengthConstraints: () => withArrayLengthConstraints,
  withConstructorDefault: () => withConstructorDefault2,
  withDecodingDefault: () => withDecodingDefault,
  withDecodingDefaultKey: () => withDecodingDefaultKey,
  withDecodingDefaultType: () => withDecodingDefaultType,
  withDecodingDefaultTypeKey: () => withDecodingDefaultTypeKey
});

// ../../node_modules/effect/dist/BigInt.js
var BigInt3 = globalThis.BigInt;
var toNumber = (b) => {
  if (b > BigInt3(Number.MAX_SAFE_INTEGER) || b < BigInt3(Number.MIN_SAFE_INTEGER)) {
    return none2();
  }
  return some2(Number(b));
};

// ../../node_modules/effect/dist/ByteSize.js
var bigint04 = /* @__PURE__ */ BigInt(0);
var bigint13 = /* @__PURE__ */ BigInt(1);
var decimalBase = /* @__PURE__ */ BigInt(1e3);
var binaryBase = /* @__PURE__ */ BigInt(1024);
var decimalUnits = [{
  symbol: "B",
  factor: bigint13,
  names: ["B", "byte", "bytes"]
}, {
  symbol: "kB",
  factor: decimalBase,
  names: ["kB", "kilobyte", "kilobytes"]
}, {
  symbol: "MB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(2),
  names: ["MB", "megabyte", "megabytes"]
}, {
  symbol: "GB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(3),
  names: ["GB", "gigabyte", "gigabytes"]
}, {
  symbol: "TB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(4),
  names: ["TB", "terabyte", "terabytes"]
}, {
  symbol: "PB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(5),
  names: ["PB", "petabyte", "petabytes"]
}, {
  symbol: "EB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(6),
  names: ["EB", "exabyte", "exabytes"]
}, {
  symbol: "ZB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(7),
  names: ["ZB", "zettabyte", "zettabytes"]
}, {
  symbol: "YB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(8),
  names: ["YB", "yottabyte", "yottabytes"]
}, {
  symbol: "RB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(9),
  names: ["RB", "ronnabyte", "ronnabytes"]
}, {
  symbol: "QB",
  factor: decimalBase ** /* @__PURE__ */ BigInt(10),
  names: ["QB", "quettabyte", "quettabytes"]
}];
var binaryUnits = [decimalUnits[0], {
  symbol: "KiB",
  factor: binaryBase,
  names: ["KiB", "kibibyte", "kibibytes"]
}, {
  symbol: "MiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(2),
  names: ["MiB", "mebibyte", "mebibytes"]
}, {
  symbol: "GiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(3),
  names: ["GiB", "gibibyte", "gibibytes"]
}, {
  symbol: "TiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(4),
  names: ["TiB", "tebibyte", "tebibytes"]
}, {
  symbol: "PiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(5),
  names: ["PiB", "pebibyte", "pebibytes"]
}, {
  symbol: "EiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(6),
  names: ["EiB", "exbibyte", "exbibytes"]
}, {
  symbol: "ZiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(7),
  names: ["ZiB", "zebibyte", "zebibytes"]
}, {
  symbol: "YiB",
  factor: binaryBase ** /* @__PURE__ */ BigInt(8),
  names: ["YiB", "yobibyte", "yobibytes"]
}];
var allUnits = [...decimalUnits, .../* @__PURE__ */ binaryUnits.slice(1)];
var unitsByName = /* @__PURE__ */ new Map(/* @__PURE__ */ allUnits.flatMap((unit) => unit.names.map((name) => [name, unit])));
var make10 = (value3) => value3;
var zero3 = /* @__PURE__ */ make10(bigint04);
var invalid2 = (message) => {
  throw new Error(`Invalid ByteSize: ${message}`);
};
var fromNumber = (input) => {
  if (!Number.isSafeInteger(input) || input < 0) {
    return invalid2(`expected a non-negative safe integer, received ${input}`);
  }
  return make10(BigInt(input));
};
var fromStringUnsafe = (input) => {
  const match7 = /^\s*(\d+)(?:\.(\d+))?\s*([A-Za-z]+)\s*$/.exec(input);
  if (match7 === null) return invalid2(`unsupported syntax ${JSON.stringify(input)}`);
  const unit = unitsByName.get(match7[3]);
  if (unit === void 0) return invalid2(`unsupported unit ${JSON.stringify(match7[3])}`);
  const fraction = match7[2] ?? "";
  const scale = BigInt(10) ** BigInt(fraction.length);
  const numerator = BigInt(match7[1] + fraction) * unit.factor;
  if (numerator % scale !== bigint04) {
    return invalid2(`${JSON.stringify(input)} does not represent an integral number of bytes`);
  }
  return make10(numerator / scale);
};
var fromString2 = /* @__PURE__ */ liftThrowable(fromStringUnsafe);
var fromInputUnsafe2 = (input) => {
  switch (typeof input) {
    case "bigint":
      if (input < bigint04) return invalid2(`expected a non-negative bigint, received ${input}`);
      return make10(input);
    case "number":
      return fromNumber(input);
    case "string":
      return fromStringUnsafe(input);
  }
  return invalid2(`unsupported input ${input}`);
};
var fromInput2 = /* @__PURE__ */ liftThrowable(fromInputUnsafe2);
var bytes = (value3) => typeof value3 === "bigint" ? fromInputUnsafe2(value3) : fromNumber(value3);
var isByteSize = (input) => typeof input === "bigint" && input >= bigint04;
var toBigInt = (self) => self;
var toNumber2 = toNumber;

// ../../node_modules/effect/dist/Chunk.js
var TypeId14 = "~effect/Chunk";
function copy(src, srcPos, dest, destPos, len) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i];
  }
  return dest;
}
var emptyArray = [];
var makeEquivalence5 = (isEquivalent) => make3((self, that) => {
  if (self.length !== that.length) {
    return false;
  }
  const as4 = toReadonlyArray(self);
  const bs = toReadonlyArray(that);
  for (let i = 0; i < as4.length; i++) {
    if (!isEquivalent(as4[i], bs[i])) {
      return false;
    }
  }
  return true;
});
var _equivalence = /* @__PURE__ */ makeEquivalence5(equals);
var ChunkProto = {
  [TypeId14]: {
    _A: (_) => _
  },
  toString() {
    return `Chunk(${format(toReadonlyArray(this))})`;
  },
  toJSON() {
    return {
      _id: "Chunk",
      values: toJson(toReadonlyArray(this))
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    return isChunk(that) && _equivalence(this, that);
  },
  [symbol]() {
    return array(toReadonlyArray(this));
  },
  [Symbol.iterator]() {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]();
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]();
      }
      default: {
        return toReadonlyArray(this)[Symbol.iterator]();
      }
    }
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeChunk = (backing) => {
  const chunk = Object.create(ChunkProto);
  chunk.backing = backing;
  switch (backing._tag) {
    case "IEmpty": {
      chunk.length = 0;
      chunk.depth = 0;
      chunk.left = chunk;
      chunk.right = chunk;
      break;
    }
    case "IConcat": {
      chunk.length = backing.left.length + backing.right.length;
      chunk.depth = 1 + Math.max(backing.left.depth, backing.right.depth);
      chunk.left = backing.left;
      chunk.right = backing.right;
      break;
    }
    case "IArray": {
      chunk.length = backing.array.length;
      chunk.depth = 0;
      chunk.left = _empty;
      chunk.right = _empty;
      break;
    }
    case "ISingleton": {
      chunk.length = 1;
      chunk.depth = 0;
      chunk.left = _empty;
      chunk.right = _empty;
      break;
    }
    case "ISlice": {
      chunk.length = backing.length;
      chunk.depth = 0;
      chunk.left = _empty;
      chunk.right = _empty;
      break;
    }
  }
  return chunk;
};
var isChunk = (u) => hasProperty(u, TypeId14);
var _empty = /* @__PURE__ */ makeChunk({
  _tag: "IEmpty"
});
var empty4 = () => _empty;
var of2 = (a) => makeChunk({
  _tag: "ISingleton",
  a
});
var fromIterable3 = (self) => isChunk(self) ? self : fromArrayUnsafe(fromIterable2(self));
var copyToArray = (self, array2, initial) => {
  switch (self.backing._tag) {
    case "IArray": {
      copy(self.backing.array, 0, array2, initial, self.length);
      break;
    }
    case "IConcat": {
      copyToArray(self.left, array2, initial);
      copyToArray(self.right, array2, initial + self.left.length);
      break;
    }
    case "ISingleton": {
      array2[initial] = self.backing.a;
      break;
    }
    case "ISlice": {
      copy(toReadonlyArray(self.backing.chunk), self.backing.offset, array2, initial, self.length);
      break;
    }
  }
};
var toReadonlyArray_ = (self) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      return emptyArray;
    }
    case "IArray": {
      return self.backing.array;
    }
    default: {
      const arr = new Array(self.length);
      copyToArray(self, arr, 0);
      self.backing = {
        _tag: "IArray",
        array: arr
      };
      self.left = _empty;
      self.right = _empty;
      self.depth = 0;
      return arr;
    }
  }
};
var toReadonlyArray = toReadonlyArray_;
var fromArrayUnsafe = (self) => self.length === 0 ? empty4() : self.length === 1 ? of2(self[0]) : makeChunk({
  _tag: "IArray",
  array: self
});
var size = (self) => self.length;

// ../../node_modules/effect/dist/DateTime.js
var isDateTime2 = isDateTime;
var isTimeZone2 = isTimeZone;
var isTimeZoneOffset2 = isTimeZoneOffset;
var isTimeZoneNamed2 = isTimeZoneNamed;
var isUtc2 = isUtc;
var isZoned2 = isZoned;
var Equivalence4 = Equivalence2;
var makeUnsafe5 = makeUnsafe4;
var makeZonedUnsafe2 = makeZonedUnsafe;
var make11 = make8;
var makeZonedFromString2 = makeZonedFromString;
var toUtc2 = toUtc;
var zoneMakeNamedUnsafe2 = zoneMakeNamedUnsafe;
var zoneMakeOffset2 = zoneMakeOffset;
var zoneMakeNamed2 = zoneMakeNamed;
var zoneFromString2 = zoneFromString;
var zoneToString2 = zoneToString;
var toDateUtc2 = toDateUtc;
var toEpochMillis2 = toEpochMillis;
var formatIso2 = formatIso;
var formatIsoZoned2 = formatIsoZoned;

// ../../node_modules/effect/dist/encoding/Base64.js
var encode2 = (input) => encodeBytes(typeof input === "string" ? encoder2.encode(input) : input);
var decode2 = (str) => {
  const stripped = stripCrlf(str);
  const length = stripped.length;
  if (length % 4 !== 0) {
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: `Length must be a multiple of 4, but is ${length}`
    }));
  }
  const index2 = stripped.indexOf("=");
  if (index2 !== -1 && (index2 < length - 2 || index2 === length - 2 && stripped[length - 1] !== "=")) {
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: "Found a '=' character, but it is not at the end"
    }));
  }
  try {
    const missingOctets = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0;
    const result3 = new Uint8Array(3 * (length / 4) - missingOctets);
    for (let i = 0, j = 0; i < length; i += 4, j += 3) {
      const buffer3 = getCode(stripped.charCodeAt(i)) << 18 | getCode(stripped.charCodeAt(i + 1)) << 12 | getCode(stripped.charCodeAt(i + 2)) << 6 | getCode(stripped.charCodeAt(i + 3));
      result3[j] = buffer3 >> 16;
      result3[j + 1] = buffer3 >> 8 & 255;
      result3[j + 2] = buffer3 & 255;
    }
    return succeed2(result3);
  } catch (cause) {
    return fail2(new EncodingError({
      kind: "Decode",
      module: "Base64",
      input: stripped,
      message: cause instanceof Error ? cause.message : "Invalid input"
    }));
  }
};
var decodeString2 = (str) => map2(decode2(str), (_) => decoder2.decode(_));
var encodeBytes = (bytes2) => {
  const length = bytes2.length;
  let result3 = "";
  let i;
  for (i = 2; i < length; i += 3) {
    result3 += alphabet[bytes2[i - 2] >> 2];
    result3 += alphabet[(bytes2[i - 2] & 3) << 4 | bytes2[i - 1] >> 4];
    result3 += alphabet[(bytes2[i - 1] & 15) << 2 | bytes2[i] >> 6];
    result3 += alphabet[bytes2[i] & 63];
  }
  if (i === length + 1) {
    result3 += alphabet[bytes2[i - 2] >> 2];
    result3 += alphabet[(bytes2[i - 2] & 3) << 4];
    result3 += "==";
  }
  if (i === length) {
    result3 += alphabet[bytes2[i - 2] >> 2];
    result3 += alphabet[(bytes2[i - 2] & 3) << 4 | bytes2[i - 1] >> 4];
    result3 += alphabet[(bytes2[i - 1] & 15) << 2];
    result3 += "=";
  }
  return result3;
};
var encoder2 = /* @__PURE__ */ new TextEncoder();
var decoder2 = /* @__PURE__ */ new TextDecoder();
var stripCrlf = (str) => str.replace(/[\n\r]/g, "");
var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var codes = /* @__PURE__ */ new Uint8Array(123).fill(255);
for (let i = 0; i < alphabet.length; i++) codes[/* @__PURE__ */ alphabet.charCodeAt(i)] = i;
codes[/* @__PURE__ */ "=".charCodeAt(0)] = 0;
var getCode = (charCode) => {
  if (charCode >= codes.length || codes[charCode] === 255) {
    throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
  }
  return codes[charCode];
};

// ../../node_modules/effect/dist/internal/hashMap.js
var HashMapTypeId = "~effect/HashMap";
var SHIFT = 5;
var BUCKET_SIZE = 1 << SHIFT;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var BITMAP_INDEX_MASK = BUCKET_SIZE - 1;
var popcount = (n) => {
  n = n - (n >>> 1 & 1431655765);
  n = (n & 858993459) + (n >>> 2 & 858993459);
  return (n + (n >>> 4) & 252645135) * 16843009 >>> 24;
};
var mask = (hash2, shift) => hash2 >>> shift & BITMAP_INDEX_MASK;
var bitpos = (hash2, shift) => 1 << mask(hash2, shift);
var index = (bitmap, bit) => popcount(bitmap & bit - 1);
function mergeLeaves(edit, shift, hash1, node1, hash2, node2) {
  if (shift > 32) {
    throw new Error("HashMap: max depth exceeded");
  }
  const bit1 = bitpos(hash1, shift);
  const bit2 = bitpos(hash2, shift);
  if (bit1 === bit2) {
    const child = mergeLeaves(edit, shift + SHIFT, hash1, node1, hash2, node2);
    return new IndexedNode(edit, bit1, [child]);
  }
  const bitmap = bit1 | bit2;
  const children = bit1 >>> 0 < bit2 >>> 0 ? [node1, node2] : [node2, node1];
  return new IndexedNode(edit, bitmap, children);
}
var hashMapSeed = /* @__PURE__ */ string("HashMap");
var entryHash2 = (key, value3) => combine(hash(key), hash(value3));
var childrenHash = (children) => {
  let h = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child) h ^= child.subtreeHash();
  }
  return h;
};
var Node = class {
  canEdit(edit) {
    return this.edit === edit;
  }
  subtreeHash() {
    let h = this._hash;
    if (h === void 0) {
      const seen = backEdges;
      h = this.computeHash();
      if (seen === backEdges) {
        this._hash = h;
      }
    }
    return h;
  }
};
var EmptyNode = class extends Node {
  _tag = "EmptyNode";
  edit = 0;
  get size() {
    return 0;
  }
  get(_shift, _hash, _key) {
    return none2();
  }
  has(_shift, _hash, _key) {
    return false;
  }
  set(edit, _shift, hash2, key, value3, added) {
    added.value = true;
    return new LeafNode(edit, hash2, key, value3);
  }
  remove(_edit, _shift, _hash, _key, _removed) {
    return this;
  }
  canEdit(_edit) {
    return false;
  }
  computeHash() {
    return 0;
  }
};
var LeafNode = class _LeafNode extends Node {
  _tag = "LeafNode";
  edit;
  hash;
  key;
  value;
  constructor(edit, hash2, key, value3) {
    super();
    this.edit = edit;
    this.hash = hash2;
    this.key = key;
    this.value = value3;
  }
  get size() {
    return 1;
  }
  get(_shift, hash2, key) {
    if (this.hash === hash2 && equals(this.key, key)) {
      return some2(this.value);
    }
    return none2();
  }
  has(_shift, hash2, key) {
    return this.hash === hash2 && equals(this.key, key);
  }
  set(edit, shift, hash2, key, value3, added) {
    if (this.canEdit(edit)) this._hash = void 0;
    if (this.hash === hash2 && equals(this.key, key)) {
      if (equals(this.value, value3)) {
        return this;
      }
      if (this.canEdit(edit)) {
        this.value = value3;
        return this;
      }
      return new _LeafNode(edit, hash2, key, value3);
    }
    added.value = true;
    if (this.hash === hash2) {
      return new CollisionNode(edit, hash2, [[this.key, this.value], [key, value3]]);
    }
    const newBit = bitpos(hash2, shift);
    const existingBit = bitpos(this.hash, shift);
    if (newBit === existingBit) {
      return new IndexedNode(edit, newBit, [this.set(edit, shift + SHIFT, hash2, key, value3, added)]);
    }
    const bitmap = newBit | existingBit;
    const nodes = newBit >>> 0 < existingBit >>> 0 ? [new _LeafNode(edit, hash2, key, value3), this] : [this, new _LeafNode(edit, hash2, key, value3)];
    return new IndexedNode(edit, bitmap, nodes);
  }
  remove(_edit, _shift, hash2, key, removed) {
    if (this.hash === hash2 && equals(this.key, key)) {
      removed.value = true;
      return void 0;
    }
    return this;
  }
  computeHash() {
    return entryHash2(this.key, this.value);
  }
};
var CollisionNode = class _CollisionNode extends Node {
  _tag = "CollisionNode";
  edit;
  hash;
  entries;
  constructor(edit, hash2, entries3) {
    super();
    this.edit = edit;
    this.hash = hash2;
    this.entries = entries3;
  }
  get size() {
    return this.entries.length;
  }
  get(_shift, hash2, key) {
    if (this.hash !== hash2) {
      return none2();
    }
    for (const [k, v] of this.entries) {
      if (equals(k, key)) {
        return some2(v);
      }
    }
    return none2();
  }
  has(_shift, hash2, key) {
    if (this.hash !== hash2) {
      return false;
    }
    for (const [k] of this.entries) {
      if (equals(k, key)) {
        return true;
      }
    }
    return false;
  }
  set(edit, shift, hash2, key, value3, added) {
    if (this.canEdit(edit)) this._hash = void 0;
    if (this.hash !== hash2) {
      added.value = true;
      return mergeLeaves(edit, shift, this.hash, this, hash2, new LeafNode(edit, hash2, key, value3));
    }
    for (let i = 0; i < this.entries.length; i++) {
      if (equals(this.entries[i][0], key)) {
        if (equals(this.entries[i][1], value3)) {
          return this;
        }
        if (this.canEdit(edit)) {
          this.entries[i] = [key, value3];
          return this;
        }
        const newEntries = [...this.entries];
        newEntries[i] = [key, value3];
        return new _CollisionNode(edit, this.hash, newEntries);
      }
    }
    added.value = true;
    if (this.canEdit(edit)) {
      this.entries.push([key, value3]);
      return this;
    }
    return new _CollisionNode(edit, this.hash, [...this.entries, [key, value3]]);
  }
  remove(edit, _shift, hash2, key, removed) {
    if (this.canEdit(edit)) this._hash = void 0;
    if (this.hash !== hash2) {
      return this;
    }
    const idx = this.entries.findIndex(([k]) => equals(k, key));
    if (idx === -1) {
      return this;
    }
    removed.value = true;
    if (this.entries.length === 1) {
      return void 0;
    }
    if (this.entries.length === 2) {
      const remaining = this.entries[idx === 0 ? 1 : 0];
      return new LeafNode(edit, this.hash, remaining[0], remaining[1]);
    }
    if (this.canEdit(edit)) {
      this.entries.splice(idx, 1);
      return this;
    }
    const newEntries = [...this.entries];
    newEntries.splice(idx, 1);
    return new _CollisionNode(edit, this.hash, newEntries);
  }
  computeHash() {
    let h = 0;
    const entries3 = this.entries;
    for (let i = 0; i < entries3.length; i++) {
      h ^= entryHash2(entries3[i][0], entries3[i][1]);
    }
    return h;
  }
};
var IndexedNode = class _IndexedNode extends Node {
  _tag = "IndexedNode";
  edit;
  _size;
  bitmap;
  children;
  constructor(edit, bitmap, children) {
    super();
    this.edit = edit;
    this.bitmap = bitmap;
    this.children = children;
  }
  get size() {
    if (this._size === void 0) {
      this._size = this.children.reduce((acc, child) => acc + child.size, 0);
    }
    return this._size;
  }
  get(shift, hash2, key) {
    const bit = bitpos(hash2, shift);
    if ((this.bitmap & bit) === 0) {
      return none2();
    }
    const idx = index(this.bitmap, bit);
    return this.children[idx].get(shift + SHIFT, hash2, key);
  }
  has(shift, hash2, key) {
    const bit = bitpos(hash2, shift);
    if ((this.bitmap & bit) === 0) {
      return false;
    }
    const idx = index(this.bitmap, bit);
    return this.children[idx].has(shift + SHIFT, hash2, key);
  }
  set(edit, shift, hash2, key, value3, added) {
    if (this.canEdit(edit)) this._hash = void 0;
    const bit = bitpos(hash2, shift);
    const idx = index(this.bitmap, bit);
    if ((this.bitmap & bit) !== 0) {
      const child = this.children[idx];
      const newChild = child.set(edit, shift + SHIFT, hash2, key, value3, added);
      if (child === newChild) {
        return this;
      }
      if (this.canEdit(edit)) {
        this.children[idx] = newChild;
        return this;
      }
      const newChildren = [...this.children];
      newChildren[idx] = newChild;
      return new _IndexedNode(edit, this.bitmap, newChildren);
    } else {
      added.value = true;
      const newChild = new LeafNode(edit, hash2, key, value3);
      const newBitmap = this.bitmap | bit;
      if (this.canEdit(edit)) {
        this.children.splice(idx, 0, newChild);
        this.bitmap = newBitmap;
        this._size = void 0;
        if (this.children.length > MAX_INDEX_NODE) {
          return this.expand(edit, newBitmap, this.children);
        }
        return this;
      }
      const newChildren = [...this.children];
      newChildren.splice(idx, 0, newChild);
      if (newChildren.length > MAX_INDEX_NODE) {
        return this.expand(edit, newBitmap, newChildren);
      }
      return new _IndexedNode(edit, newBitmap, newChildren);
    }
  }
  remove(edit, shift, hash2, key, removed) {
    if (this.canEdit(edit)) this._hash = void 0;
    const bit = bitpos(hash2, shift);
    if ((this.bitmap & bit) === 0) {
      return this;
    }
    const idx = index(this.bitmap, bit);
    const child = this.children[idx];
    const newChild = child.remove(edit, shift + SHIFT, hash2, key, removed);
    if (!removed.value) {
      return this;
    }
    if (newChild === void 0) {
      const newBitmap = this.bitmap ^ bit;
      if (newBitmap === 0) {
        return void 0;
      }
      if (this.children.length === 2) {
        const remaining = this.children[idx === 0 ? 1 : 0];
        if (remaining._tag === "LeafNode") {
          return remaining;
        }
      }
      if (this.canEdit(edit)) {
        this.children.splice(idx, 1);
        this.bitmap = newBitmap;
        this._size = void 0;
        return this;
      }
      const newChildren2 = [...this.children];
      newChildren2.splice(idx, 1);
      return new _IndexedNode(edit, newBitmap, newChildren2);
    }
    if (child === newChild) {
      return this;
    }
    if (this.canEdit(edit)) {
      this.children[idx] = newChild;
      return this;
    }
    const newChildren = [...this.children];
    newChildren[idx] = newChild;
    return new _IndexedNode(edit, this.bitmap, newChildren);
  }
  expand(edit, bitmap, children) {
    const nodes = new globalThis.Array(BUCKET_SIZE);
    let j = 0;
    for (let i = 0; i < BUCKET_SIZE; i++) {
      if ((bitmap & 1 << i) !== 0) {
        nodes[i] = children[j++];
      }
    }
    return new ArrayNode(edit, children.length, nodes);
  }
  computeHash() {
    return childrenHash(this.children);
  }
};
var ArrayNode = class _ArrayNode extends Node {
  _tag = "ArrayNode";
  edit;
  _size;
  count;
  children;
  constructor(edit, count, children) {
    super();
    this.edit = edit;
    this.count = count;
    this.children = children;
  }
  get size() {
    if (this._size === void 0) {
      this._size = this.children.reduce((acc, child) => acc + (child?.size ?? 0), 0);
    }
    return this._size;
  }
  get(shift, hash2, key) {
    const idx = mask(hash2, shift);
    const child = this.children[idx];
    return child ? child.get(shift + SHIFT, hash2, key) : none2();
  }
  has(shift, hash2, key) {
    const idx = mask(hash2, shift);
    const child = this.children[idx];
    return child ? child.has(shift + SHIFT, hash2, key) : false;
  }
  set(edit, shift, hash2, key, value3, added) {
    if (this.canEdit(edit)) this._hash = void 0;
    const idx = mask(hash2, shift);
    const child = this.children[idx];
    if (child) {
      const newChild = child.set(edit, shift + SHIFT, hash2, key, value3, added);
      if (child === newChild) {
        return this;
      }
      if (this.canEdit(edit)) {
        this.children[idx] = newChild;
        return this;
      }
      const newChildren = [...this.children];
      newChildren[idx] = newChild;
      return new _ArrayNode(edit, this.count, newChildren);
    } else {
      added.value = true;
      const newChild = new LeafNode(edit, hash2, key, value3);
      if (this.canEdit(edit)) {
        this.children[idx] = newChild;
        this.count++;
        this._size = void 0;
        return this;
      }
      const newChildren = [...this.children];
      newChildren[idx] = newChild;
      return new _ArrayNode(edit, this.count + 1, newChildren);
    }
  }
  remove(edit, shift, hash2, key, removed) {
    if (this.canEdit(edit)) this._hash = void 0;
    const idx = mask(hash2, shift);
    const child = this.children[idx];
    if (!child) {
      return this;
    }
    const newChild = child.remove(edit, shift + SHIFT, hash2, key, removed);
    if (!removed.value) {
      return this;
    }
    const newCount = this.count - (newChild ? 0 : 1);
    if (newCount < MIN_ARRAY_NODE) {
      return this.pack(edit, idx, newChild);
    }
    if (child === newChild) {
      return this;
    }
    if (this.canEdit(edit)) {
      this.children[idx] = newChild;
      if (!newChild) {
        this.count = newCount;
      }
      this._size = void 0;
      return this;
    }
    const newChildren = [...this.children];
    newChildren[idx] = newChild;
    return new _ArrayNode(edit, newCount, newChildren);
  }
  pack(edit, excludeIdx, newChild) {
    const children = [];
    let bitmap = 0;
    let bit = 1;
    for (let i = 0; i < this.children.length; i++) {
      const child = i === excludeIdx ? newChild : this.children[i];
      if (child) {
        children.push(child);
        bitmap |= bit;
      }
      bit <<= 1;
    }
    return new IndexedNode(edit, bitmap, children);
  }
  computeHash() {
    return childrenHash(this.children);
  }
};
var HashMapIterator = class {
  stack;
  project;
  entries = [];
  index = 0;
  constructor(root, project) {
    this.stack = [root];
    this.project = project;
  }
  next() {
    while (true) {
      if (this.index < this.entries.length) {
        const entry = this.entries[this.index++];
        return {
          done: false,
          value: this.project(entry[0], entry[1])
        };
      }
      if (this.stack.length === 0) {
        return {
          done: true,
          value: void 0
        };
      }
      const node = this.stack.pop();
      switch (node._tag) {
        case "LeafNode": {
          const leaf = node;
          return {
            done: false,
            value: this.project(leaf.key, leaf.value)
          };
        }
        case "CollisionNode": {
          this.entries = node.entries;
          this.index = 0;
          break;
        }
        case "IndexedNode":
        case "ArrayNode": {
          const children = node.children;
          for (let i = children.length - 1; i >= 0; i--) {
            const child = children[i];
            if (child) this.stack.push(child);
          }
        }
      }
    }
  }
  [Symbol.iterator]() {
    return this;
  }
};
var toEntry = (key, value3) => [key, value3];
var HashMapImpl = class {
  [HashMapTypeId] = HashMapTypeId;
  _editable;
  _edit;
  _root;
  _size;
  constructor(editable, edit, root, size6) {
    this._editable = editable;
    this._edit = edit;
    this._root = root;
    this._size = size6;
  }
  get size() {
    return this._size;
  }
  [Symbol.iterator]() {
    return new HashMapIterator(this._root, toEntry);
  }
  [symbol2](that) {
    if (isHashMap(that)) {
      const thatImpl = that;
      if (this.size !== thatImpl.size) {
        return false;
      }
      for (const [key, value3] of this) {
        const otherValue = pipe(that, get2(key));
        if (isNone2(otherValue) || !equals(value3, otherValue.value)) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  [symbol]() {
    return optimize(hashMapSeed ^ this._root.subtreeHash());
  }
  [NodeInspectSymbol]() {
    return toJson(this);
  }
  toString() {
    return `HashMap(${format(Array.from(this))})`;
  }
  toJSON() {
    return {
      _id: "HashMap",
      values: Array.from(this).map(([k, v]) => [toJson(k), toJson(v)])
    };
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var emptyNode = /* @__PURE__ */ new EmptyNode();
var isHashMap = (u) => hasProperty(u, HashMapTypeId);
var empty5 = () => new HashMapImpl(false, 0, emptyNode, 0);
var fromIterable4 = (entries3) => {
  let root = emptyNode;
  let size6 = 0;
  const added = {
    value: false
  };
  for (const [key, value3] of entries3) {
    const hash2 = hash(key);
    added.value = false;
    root = root.set(NaN, 0, hash2, key, value3, added);
    if (added.value) {
      size6++;
    }
  }
  return new HashMapImpl(false, 0, root, size6);
};
var get2 = /* @__PURE__ */ dual(2, (self, key) => {
  const impl = self;
  return impl._root.get(0, hash(key), key);
});
var has2 = /* @__PURE__ */ dual(2, (self, key) => {
  const impl = self;
  return impl._root.has(0, hash(key), key);
});
var setHash = (self, key, hash2, value3) => {
  const impl = self;
  const added = {
    value: false
  };
  const edit = impl._editable ? impl._edit : NaN;
  const newRoot = impl._root.set(edit, 0, hash2, key, value3, added);
  if (impl._editable) {
    impl._root = newRoot;
    if (added.value) {
      impl._size++;
    }
    return self;
  }
  if (impl._root === newRoot) {
    return self;
  }
  return new HashMapImpl(false, impl._edit, newRoot, impl._size + (added.value ? 1 : 0));
};
var set = /* @__PURE__ */ dual(3, (self, key, value3) => {
  return setHash(self, key, hash(key), value3);
});
var keys2 = (self) => new HashMapIterator(self._root, identity);
var entries = (self) => self[Symbol.iterator]();
var size2 = (self) => self.size;

// ../../node_modules/effect/dist/HashMap.js
var isHashMap2 = isHashMap;
var fromIterable5 = fromIterable4;
var entries2 = entries;
var toEntries = (self) => Array.from(entries2(self));
var size3 = size2;

// ../../node_modules/effect/dist/internal/hashSet.js
var HashSetTypeId = "~effect/HashSet";
var hashSetSeed = /* @__PURE__ */ string(HashSetTypeId);
var HashSetProto = {
  [symbol]() {
    return optimize(combine(hashSetSeed, hash(keyMap(this))));
  },
  [symbol2](that) {
    return isHashSet(that) && size4(this) === size4(that) && every2(this, (value3) => has3(that, value3));
  },
  [Symbol.iterator]() {
    return keys2(keyMap(this));
  },
  toString() {
    return `HashSet(${format(Array.from(this))})`;
  },
  toJSON() {
    return {
      _id: "HashSet",
      values: toJson(Array.from(this))
    };
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var makeImpl2 = (keyMap2) => {
  const set5 = Object.create(HashSetProto);
  set5[HashSetTypeId] = HashSetTypeId;
  set5.keyMap = keyMap2;
  return set5;
};
var isHashSet = (u) => hasProperty(u, HashSetTypeId);
var keyMap = (self) => self.keyMap;
var fromIterable6 = (values2) => {
  let map12 = empty5();
  for (const value3 of values2) {
    map12 = set(map12, value3, true);
  }
  return makeImpl2(map12);
};
var has3 = (self, value3) => has2(keyMap(self), value3);
var size4 = (self) => size2(keyMap(self));
var every2 = (self, predicate) => {
  for (const value3 of self) {
    if (!predicate(value3)) {
      return false;
    }
  }
  return true;
};

// ../../node_modules/effect/dist/HashSet.js
var fromIterable7 = fromIterable6;
var isHashSet2 = isHashSet;
var size5 = size4;

// ../../node_modules/effect/dist/http/Cookies.js
var TypeId15 = "~effect/http/Cookies";
var isCookies = (u) => hasProperty(u, TypeId15);
var CookieTypeId = "~effect/http/Cookies/Cookie";
var isCookie = (u) => hasProperty(u, CookieTypeId);
var CookieErrorTypeId = "~effect/http/Cookies/CookieError";
var CookiesErrorReason = class extends Error3 {
};
var CookiesError = class _CookiesError extends (/* @__PURE__ */ TaggedError2("CookiesError")) {
  /**
   * Creates a cookie error from a reason tag and optional cause.
   *
   * @stability unstable
   * @since 4.0.0
   */
  static fromReason(reason, cause) {
    return new _CookiesError({
      reason: new CookiesErrorReason({
        _tag: reason,
        cause
      })
    });
  }
  /**
   * Marks this value as a cookie validation error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [CookieErrorTypeId] = CookieErrorTypeId;
  /**
   * Uses the concrete cookie error reason as the public message.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    return this.reason._tag;
  }
};
var Proto4 = {
  [TypeId15]: TypeId15,
  ...BaseProto,
  toJSON() {
    return {
      _id: "effect/Cookies",
      cookies: map3(this.cookies, (cookie) => cookie.toJSON())
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromReadonlyRecord = (cookies) => {
  const self = Object.create(Proto4);
  self.cookies = cookies;
  return self;
};
var fromIterable8 = (cookies) => {
  const record2 = {};
  for (const cookie of cookies) {
    assignProperty(record2, cookie.name, cookie);
  }
  return fromReadonlyRecord(record2);
};
var fromSetCookie = (headers) => {
  const arrayHeaders = typeof headers === "string" ? [headers] : headers;
  const cookies = [];
  for (const header of arrayHeaders) {
    const cookie = parseSetCookie(header.trim());
    if (cookie) {
      cookies.push(cookie);
    }
  }
  return fromIterable8(cookies);
};
function parseSetCookie(header) {
  const parts2 = header.split(";").map((_) => _.trim()).filter((_) => _ !== "");
  if (parts2.length === 0) {
    return void 0;
  }
  const firstEqual = parts2[0].indexOf("=");
  if (firstEqual === -1) {
    return void 0;
  }
  const name = parts2[0].slice(0, firstEqual);
  if (!cookieNameRegExp.test(name)) {
    return void 0;
  }
  const valueEncoded = parts2[0].slice(firstEqual + 1);
  const value3 = tryDecodeURIComponent(valueEncoded);
  if (parts2.length === 1) {
    return Object.assign(Object.create(CookieProto), {
      name,
      value: value3,
      valueEncoded
    });
  }
  const options3 = {};
  for (let i = 1; i < parts2.length; i++) {
    const part = parts2[i];
    const equalIndex = part.indexOf("=");
    const key = equalIndex === -1 ? part : part.slice(0, equalIndex).trim();
    const value4 = equalIndex === -1 ? void 0 : part.slice(equalIndex + 1).trim();
    switch (key.toLowerCase()) {
      case "domain": {
        if (value4 === void 0) {
          break;
        }
        const domain = value4.trim().replace(/^\./, "");
        if (domain) {
          options3.domain = domain;
        }
        break;
      }
      case "expires": {
        if (value4 === void 0) {
          break;
        }
        const date = new Date(value4);
        if (!isNaN(date.getTime())) {
          options3.expires = date;
        }
        break;
      }
      case "max-age": {
        if (value4 === void 0) {
          break;
        }
        const maxAge = parseInt(value4, 10);
        if (!isNaN(maxAge)) {
          options3.maxAge = seconds(maxAge);
        }
        break;
      }
      case "path": {
        if (value4 === void 0) {
          break;
        }
        if (value4[0] === "/") {
          options3.path = value4;
        }
        break;
      }
      case "priority": {
        if (value4 === void 0) {
          break;
        }
        switch (value4.toLowerCase()) {
          case "low":
            options3.priority = "low";
            break;
          case "medium":
            options3.priority = "medium";
            break;
          case "high":
            options3.priority = "high";
            break;
        }
        break;
      }
      case "httponly": {
        options3.httpOnly = true;
        break;
      }
      case "secure": {
        options3.secure = true;
        break;
      }
      case "partitioned": {
        options3.partitioned = true;
        break;
      }
      case "samesite": {
        if (value4 === void 0) {
          break;
        }
        switch (value4.toLowerCase()) {
          case "lax":
            options3.sameSite = "lax";
            break;
          case "strict":
            options3.sameSite = "strict";
            break;
          case "none":
            options3.sameSite = "none";
            break;
        }
        break;
      }
    }
  }
  return Object.assign(Object.create(CookieProto), {
    name,
    value: value3,
    valueEncoded,
    options: Object.keys(options3).length > 0 ? options3 : void 0
  });
}
var isEmpty3 = (self) => isEmptyRecord(self.cookies);
var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;
var cookieDomainRegExp = /^[\u0009\u0020-\u003a\u003c-\u007e\u0080-\u00ff]+$/;
var cookiePathRegExp = /^[\u0020-\u003a\u003c-\u007e]+$/;
var CookieProto = {
  [CookieTypeId]: CookieTypeId,
  ...BaseProto,
  toJSON() {
    return {
      _id: "effect/Cookies/Cookie",
      name: this.name,
      value: this.value,
      options: this.options
    };
  }
};
function makeCookie(name, value3, options3) {
  const encodedValue = encodeURIComponent(value3);
  const error = validateCookie(name, encodedValue, options3);
  if (error !== void 0) {
    return fail2(error);
  }
  return succeed2(Object.assign(Object.create(CookieProto), {
    name,
    value: value3,
    valueEncoded: encodedValue,
    options: options3
  }));
}
function validateCookie(name, encodedValue, options3) {
  if (!cookieNameRegExp.test(name)) {
    return CookiesError.fromReason("InvalidCookieName");
  }
  if (encodedValue && !fieldContentRegExp.test(encodedValue)) {
    return CookiesError.fromReason("InvalidCookieValue");
  }
  if (options3?.domain !== void 0 && !cookieDomainRegExp.test(options3.domain)) {
    return CookiesError.fromReason("InvalidCookieDomain");
  }
  if (options3?.path !== void 0 && !cookiePathRegExp.test(options3.path)) {
    return CookiesError.fromReason("InvalidCookiePath");
  }
  if (options3?.maxAge !== void 0 && !isFinite(fromInputUnsafe(options3.maxAge))) {
    return CookiesError.fromReason("CookieInfinityMaxAge");
  }
}
var makeCookieUnsafe = (name, value3, options3) => getOrThrow2(makeCookie(name, value3, options3));
var merge3 = /* @__PURE__ */ dual(2, (self, that) => fromReadonlyRecord({
  ...self.cookies,
  ...that.cookies
}));
function serializeCookie(self) {
  const error = validateCookie(self.name, self.valueEncoded, self.options);
  if (error !== void 0) {
    throw error;
  }
  let str = self.name + "=" + self.valueEncoded;
  if (self.options === void 0) {
    return str;
  }
  const options3 = self.options;
  if (options3.maxAge !== void 0) {
    const maxAge = toSeconds(fromInputUnsafe(options3.maxAge));
    str += "; Max-Age=" + Math.trunc(maxAge);
  }
  if (options3.domain !== void 0) {
    str += "; Domain=" + options3.domain;
  }
  if (options3.path !== void 0) {
    str += "; Path=" + options3.path;
  }
  if (options3.priority !== void 0) {
    switch (options3.priority) {
      case "low":
        str += "; Priority=Low";
        break;
      case "medium":
        str += "; Priority=Medium";
        break;
      case "high":
        str += "; Priority=High";
        break;
    }
  }
  if (options3.expires !== void 0) {
    str += "; Expires=" + options3.expires.toUTCString();
  }
  if (options3.httpOnly) {
    str += "; HttpOnly";
  }
  if (options3.secure) {
    str += "; Secure";
  }
  if (options3.partitioned) {
    str += "; Partitioned";
  }
  if (options3.sameSite !== void 0) {
    switch (options3.sameSite) {
      case "lax":
        str += "; SameSite=Lax";
        break;
      case "strict":
        str += "; SameSite=Strict";
        break;
      case "none":
        str += "; SameSite=None";
        break;
    }
  }
  return str;
}
var toCookieHeader = (self) => Object.values(self.cookies).map((cookie) => `${cookie.name}=${cookie.valueEncoded}`).join("; ");
var toRecord = (self) => {
  const record2 = {};
  const cookies = Object.values(self.cookies);
  for (let index2 = 0; index2 < cookies.length; index2++) {
    const cookie = cookies[index2];
    assignProperty(record2, cookie.name, cookie.value);
  }
  return record2;
};
var toSetCookieHeaders = (self) => Object.values(self.cookies).map(serializeCookie);
var tryDecodeURIComponent = (str) => {
  try {
    return decodeURIComponent(str);
  } catch (_) {
    return str;
  }
};

// ../../node_modules/effect/dist/http/Headers.js
var Headers_exports = {};
__export(Headers_exports, {
  CurrentRedactedNames: () => CurrentRedactedNames,
  Equivalence: () => Equivalence5,
  TypeId: () => TypeId17,
  empty: () => empty7,
  fromInput: () => fromInput3,
  fromRecordUnsafe: () => fromRecordUnsafe,
  get: () => get3,
  has: () => has4,
  isHeaders: () => isHeaders,
  isRedactedName: () => isRedactedName,
  merge: () => merge4,
  redact: () => redact2,
  remove: () => remove5,
  removeMany: () => removeMany2,
  set: () => set3,
  setAll: () => setAll
});

// ../../node_modules/effect/dist/internal/redacted.js
var redactedRegistry = /* @__PURE__ */ new WeakMap();
var value = (self) => {
  if (redactedRegistry.has(self)) {
    return redactedRegistry.get(self);
  } else {
    throw new Error("Unable to get redacted value" + (self.label ? ` with label: "${self.label}"` : ""));
  }
};
var stringOrRedacted = (val) => typeof val === "string" ? val : value(val);

// ../../node_modules/effect/dist/Redacted.js
var TypeId16 = "~effect/Redacted";
var isRedacted = (u) => hasProperty(u, TypeId16);
var make14 = (value3, options3) => {
  const self = Object.create(Proto5);
  if (options3?.label) {
    self.label = options3.label;
  }
  redactedRegistry.set(self, value3);
  return self;
};
var Proto5 = {
  [TypeId16]: {
    _A: (_) => _
  },
  label: void 0,
  ...PipeInspectableProto,
  toJSON() {
    return this.toString();
  },
  toString() {
    return `<redacted${isString(this.label) ? ":" + this.label : ""}>`;
  },
  [symbol]() {
    return hash(redactedRegistry.get(this));
  },
  [symbol2](that) {
    return isRedacted(that) && equals(redactedRegistry.get(this), redactedRegistry.get(that));
  }
};
var value2 = value;
var makeEquivalence6 = (isEquivalent) => make3((x, y) => isEquivalent(value2(x), value2(y)));

// ../../node_modules/effect/dist/http/Headers.js
var TypeId17 = /* @__PURE__ */ Symbol.for("~effect/http/Headers");
var isHeaders = (u) => hasProperty(u, TypeId17);
var Proto6 = /* @__PURE__ */ Object.defineProperties(/* @__PURE__ */ Object.create(null), {
  [TypeId17]: {
    value: TypeId17
  },
  [symbolRedactable]: {
    value(context3) {
      return redact2(this, get(context3, CurrentRedactedNames));
    }
  },
  toJSON: {
    value() {
      return redact(this);
    }
  },
  [symbol2]: {
    value(that) {
      return Equivalence5(this, that);
    }
  },
  [symbol]: {
    value() {
      return structure(this);
    }
  },
  toString: {
    value: BaseProto.toString
  },
  [NodeInspectSymbol]: {
    value: BaseProto[NodeInspectSymbol]
  }
});
var make15 = (input) => Object.assign(Object.create(Proto6), input);
var Equivalence5 = /* @__PURE__ */ makeEquivalence3(/* @__PURE__ */ strictEqual());
var empty7 = /* @__PURE__ */ Object.create(Proto6);
var fromInput3 = (input) => {
  if (input === void 0) {
    return empty7;
  } else if (Symbol.iterator in input) {
    const out2 = Object.create(Proto6);
    for (const [k, v] of input) {
      out2[k.toLowerCase()] = v;
    }
    return out2;
  }
  const out = Object.create(Proto6);
  for (const [k, v] of Object.entries(input)) {
    if (Array.isArray(v)) {
      out[k.toLowerCase()] = v.join(", ");
    } else if (v !== void 0) {
      out[k.toLowerCase()] = v;
    }
  }
  return out;
};
var fromRecordUnsafe = (input) => Object.setPrototypeOf(input, Proto6);
var has4 = /* @__PURE__ */ dual(2, (self, key) => key.toLowerCase() in self);
var get3 = /* @__PURE__ */ dual(2, (self, key) => fromUndefinedOr(self[key.toLowerCase()]));
var set3 = /* @__PURE__ */ dual(3, (self, key, value3) => {
  const out = make15(self);
  out[key.toLowerCase()] = value3;
  return out;
});
var setAll = /* @__PURE__ */ dual(2, (self, headers) => make15({
  ...self,
  ...fromInput3(headers)
}));
var merge4 = /* @__PURE__ */ dual(2, (self, headers) => {
  const out = make15(self);
  Object.assign(out, headers);
  return out;
});
var remove5 = /* @__PURE__ */ dual(2, (self, key) => {
  const out = make15(self);
  delete out[key.toLowerCase()];
  return out;
});
var removeMany2 = /* @__PURE__ */ dual(2, (self, keys3) => {
  const out = make15(self);
  for (const key of keys3) {
    delete out[key.toLowerCase()];
  }
  return out;
});
var redact2 = /* @__PURE__ */ dual(2, (self, key) => {
  const out = {
    ...self
  };
  const modify5 = (key2) => {
    if (typeof key2 === "string") {
      const k = key2.toLowerCase();
      if (k in self) {
        out[k] = make14(self[k]);
      }
    } else {
      for (const name in self) {
        if (name.search(key2) !== -1) {
          out[name] = make14(self[name]);
        }
      }
    }
  };
  if (Array.isArray(key)) {
    for (let i = 0; i < key.length; i++) {
      modify5(key[i]);
    }
  } else {
    modify5(key);
  }
  return out;
});
var isRedactedName = (name, patterns) => {
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    if (typeof pattern === "string") {
      if (pattern.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    } else if (name.search(pattern) !== -1) {
      return true;
    }
  }
  return false;
};
var CurrentRedactedNames = /* @__PURE__ */ Reference("effect/Headers/CurrentRedactedNames", {
  defaultValue: () => ["authorization", "cookie", "set-cookie", "x-api-key"]
});

// ../../node_modules/effect/dist/http/UrlParams.js
var TypeId18 = "~effect/http/UrlParams";
var isUrlParams = (u) => hasProperty(u, TypeId18);
var Proto7 = {
  ...PipeInspectableProto,
  [TypeId18]: TypeId18,
  [Symbol.iterator]() {
    return this.params[Symbol.iterator]();
  },
  toJSON() {
    return {
      _id: "UrlParams",
      params: Object.fromEntries(this.params)
    };
  },
  [symbol2](that) {
    return Equivalence6(this, that);
  },
  [symbol]() {
    return array(this.params.flat());
  }
};
var make16 = (params) => {
  const self = Object.create(Proto7);
  self.params = params;
  return self;
};
var fromInput4 = (input) => {
  if (isUrlParams(input)) {
    return input;
  }
  const parsed = fromInputNested(input);
  const out = [];
  for (let i = 0; i < parsed.length; i++) {
    if (Array.isArray(parsed[i][0])) {
      const [keys3, value3] = parsed[i];
      out.push([`${keys3[0]}[${keys3.slice(1).join("][")}]`, value3]);
    } else {
      out.push(parsed[i]);
    }
  }
  return make16(out);
};
var fromInputNested = (input) => {
  const entries3 = typeof input[Symbol.iterator] === "function" ? fromIterable2(input) : Object.entries(input);
  const out = [];
  for (const [key, value3] of entries3) {
    if (Array.isArray(value3)) {
      for (let i = 0; i < value3.length; i++) {
        if (value3[i] !== void 0) {
          out.push([key, String(value3[i])]);
        }
      }
    } else if (value3 !== null && typeof value3 === "object") {
      const nested = fromInputNested(value3);
      for (const [k, v] of nested) {
        out.push([[key, ...typeof k === "string" ? [k] : k], v]);
      }
    } else if (value3 !== void 0) {
      out.push([key, String(value3)]);
    }
  }
  return out;
};
var Equivalence6 = /* @__PURE__ */ make3((a, b) => arrayEquivalence(a.params, b.params));
var arrayEquivalence = /* @__PURE__ */ makeEquivalence4(/* @__PURE__ */ makeEquivalence2([/* @__PURE__ */ strictEqual(), /* @__PURE__ */ strictEqual()]));
var empty8 = /* @__PURE__ */ make16([]);
var getFirst = /* @__PURE__ */ dual(2, (self, key) => findFirst2(self.params, ([k]) => k === key).pipe(map(([, value3]) => value3)));
var set4 = /* @__PURE__ */ dual(3, (self, key, value3) => make16(append(filter3(self.params, ([k]) => k !== key), [key, String(value3)])));
var transform = /* @__PURE__ */ dual(2, (self, f) => make16(f(self.params)));
var setAll2 = /* @__PURE__ */ dual(2, (self, input) => {
  const params = fromInput4(input).params.slice();
  const keys3 = /* @__PURE__ */ new Set();
  for (let i = 0; i < params.length; i++) {
    keys3.add(params[i][0]);
  }
  for (let i = 0; i < self.params.length; i++) {
    if (keys3.has(self.params[i][0])) continue;
    params.push(self.params[i]);
  }
  return make16(params);
});
var append2 = /* @__PURE__ */ dual(3, (self, key, value3) => make16(append(self.params, [key, String(value3)])));
var appendAll2 = /* @__PURE__ */ dual(2, (self, input) => transform(self, appendAll(fromInput4(input).params)));
var toString = (input) => new URLSearchParams(fromInput4(input).params).toString();
var toRecord2 = (self) => {
  const out = {};
  for (const [k, value3] of self.params) {
    if (!Object.hasOwn(out, k)) {
      assignProperty(out, k, value3);
    } else {
      const current = out[k];
      if (typeof current === "string") {
        assignProperty(out, k, [current, value3]);
      } else {
        current.push(value3);
      }
    }
  }
  return out;
};
var toReadonlyRecord = toRecord2;

// ../../node_modules/effect/dist/internal/graph.js
var TypeId19 = "~effect/Graph";
var isGraph = (u) => hasProperty(u, TypeId19);
var toImpl = (graph) => graph;
var edgeEquals = (type, self, that) => (type === "directed" ? self.source === that.source && self.target === that.target : self.source === that.source && self.target === that.target || self.source === that.target && self.target === that.source) && equals(self.data, that.data);
var edgeHash = (type, edge) => type === "directed" ? hash(edge) : optimize(combine(hash(edge.data), endpointsHash(edge.source, edge.target)));
var endpointsHash = (source, target) => combine(0, hash(source)) + combine(0, hash(target));
var graphSeed = /* @__PURE__ */ string("Graph");
var ProtoGraph = {
  [TypeId19]: {
    _N: (_) => _,
    _E: (_) => _
  },
  [Symbol.iterator]() {
    return this.nodes[Symbol.iterator]();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  },
  [symbol2](that) {
    if (hasProperty(that, TypeId19)) {
      const thatImpl = toImpl(that);
      if (this.nodes.size !== thatImpl.nodes.size || this.edges.size !== thatImpl.edges.size || this.type !== thatImpl.type) {
        return false;
      }
      for (const [nodeIndex, nodeData] of this.nodes) {
        if (!thatImpl.nodes.has(nodeIndex) || !equals(nodeData, thatImpl.nodes.get(nodeIndex))) {
          return false;
        }
      }
      for (const [edgeIndex, edgeData] of this.edges) {
        const otherEdge = thatImpl.edges.get(edgeIndex);
        if (otherEdge === void 0 || !edgeEquals(this.type, edgeData, otherEdge)) {
          return false;
        }
      }
      return true;
    }
    return false;
  },
  [symbol]() {
    let hash2 = graphSeed;
    hash2 = hash2 ^ string(this.type);
    hash2 = hash2 ^ number(this.nodes.size);
    hash2 = hash2 ^ number(this.edges.size);
    for (const [nodeIndex, nodeData] of this.nodes) {
      hash2 ^= combine(hash(nodeIndex), hash(nodeData));
    }
    for (const [edgeIndex, edgeData] of this.edges) {
      hash2 ^= combine(hash(edgeIndex), edgeHash(this.type, edgeData));
    }
    return optimize(hash2);
  },
  toJSON() {
    return {
      _id: "Graph",
      nodeCount: this.nodes.size,
      edgeCount: this.edges.size,
      type: this.type
    };
  },
  toString() {
    return `Graph(${this.type}, ${this.nodes.size}, ${this.edges.size})`;
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var make17 = (type, mutable3) => {
  const graph = Object.create(ProtoGraph);
  graph.type = type;
  graph.mutable = mutable3;
  graph.transforming = false;
  graph.nodes = /* @__PURE__ */ new Map();
  graph.edges = /* @__PURE__ */ new Map();
  graph.adjacency = /* @__PURE__ */ new Map();
  graph.reverseAdjacency = /* @__PURE__ */ new Map();
  graph.nextNodeIndex = 0;
  graph.nextEdgeIndex = 0;
  graph.acyclic = some2(true);
  return graph;
};
var snapshot = (graph) => {
  const impl = toImpl(graph);
  return {
    type: graph.type,
    nodes: Array.from(impl.nodes, ([index2, data]) => ({
      index: index2,
      data
    })).sort((a, b) => a.index - b.index),
    edges: Array.from(impl.edges, ([index2, edge]) => ({
      index: index2,
      source: edge.source,
      target: edge.target,
      data: edge.data
    })).sort((a, b) => a.index - b.index)
  };
};
var hydrate = (snapshot2) => {
  const graph = make17(snapshot2.type, false);
  for (const node of snapshot2.nodes) {
    graph.nodes.set(node.index, node.data);
    graph.adjacency.set(node.index, []);
    graph.reverseAdjacency.set(node.index, []);
  }
  for (const edge of snapshot2.edges) {
    graph.edges.set(edge.index, {
      source: edge.source,
      target: edge.target,
      data: edge.data
    });
    graph.adjacency.get(edge.source).push(edge.index);
    graph.reverseAdjacency.get(edge.target).push(edge.index);
    if (snapshot2.type === "undirected") {
      graph.adjacency.get(edge.target).push(edge.index);
      graph.reverseAdjacency.get(edge.source).push(edge.index);
    }
  }
  graph.nextNodeIndex = snapshot2.nodes.length === 0 ? 0 : snapshot2.nodes[snapshot2.nodes.length - 1].index + 1;
  graph.nextEdgeIndex = snapshot2.edges.length === 0 ? 0 : snapshot2.edges[snapshot2.edges.length - 1].index + 1;
  graph.acyclic = none2();
  return graph;
};

// ../../node_modules/effect/dist/internal/schema/annotations.js
function resolve(ast) {
  return ast.checks ? ast.checks[ast.checks.length - 1].annotations : ast.annotations;
}
function resolveAt(key) {
  return (ast) => resolve(ast)?.[key];
}
var STRUCTURAL_ANNOTATION_KEY = "~structural";
var IDENTIFIER_FALLBACK_KEY = "~identifier";
var SENTINELS_ANNOTATION_KEY = "~sentinels";
var CONSTRUCTOR_ANNOTATION_KEY = "~constructor";
var jsonSchemaAnnotationKeys = ["title", "description", "default", "examples", "readOnly", "writeOnly", "format", "contentEncoding", "contentMediaType", "contentSchema"];
var resolveIdentifier = /* @__PURE__ */ resolveAt("identifier");
var resolveIdentifierFallback = /* @__PURE__ */ resolveAt(IDENTIFIER_FALLBACK_KEY);
var resolveTitle = /* @__PURE__ */ resolveAt("title");
var getExpected = /* @__PURE__ */ memoize((ast) => {
  const identifier2 = resolve(ast)?.identifier;
  if (typeof identifier2 === "string") return identifier2;
  return ast.getExpected(getExpected);
});
var annotationExcludedKeys = /* @__PURE__ */ new Set([SENTINELS_ANNOTATION_KEY, STRUCTURAL_ANNOTATION_KEY, "representation", "arbitraryConstraint", "toJsonSchema", "toCode", "toEquivalence", "toFormatter", "toCodec", "toCodecJson", "toCodecStringTree", "toCodecIso", "toCodecArbitrary"]);

// ../../node_modules/effect/dist/internal/schema/parser.js
var missing = /* @__PURE__ */ Symbol();
var succeed7 = succeed4;
var missingExit = /* @__PURE__ */ succeed7(missing);
var sameExit = /* @__PURE__ */ succeed7(missing);
var toOption = (value3) => value3 === missing ? none2() : some2(value3);
var fromOptionExit = (option4) => option4._tag === "None" ? missingExit : succeed7(option4.value);

// ../../node_modules/effect/dist/SchemaIssue.js
var TypeId20 = "~effect/SchemaIssue/Issue";
function isIssue(u) {
  return hasProperty(u, TypeId20) && u[TypeId20] === TypeId20;
}
function hasInput(issue) {
  return Object.hasOwn(issue, "input");
}
var IssueNodeImpl = class {
  [TypeId20] = TypeId20;
  constructor(input, options3) {
    if (options3?.reportInput === true && input !== missing) {
      this.input = input;
    }
  }
};
var Filter = class extends IssueNodeImpl {
  _tag = "Filter";
  /**
   * The filter that failed.
   */
  filter;
  /**
   * The issue that occurred.
   */
  issue;
  constructor(filter9, issue, input, options3) {
    super(input, options3);
    this.filter = filter9;
    this.issue = issue;
  }
};
var Encoding = class extends IssueNodeImpl {
  _tag = "Encoding";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The issue that occurred.
   */
  issue;
  constructor(ast, issue, input, options3) {
    super(input, options3);
    this.ast = ast;
    this.issue = issue;
  }
};
var Pointer = class extends IssueNodeImpl {
  _tag = "Pointer";
  /**
   * The path to the location in the input that caused the issue.
   */
  path;
  /**
   * The issue that occurred.
   */
  issue;
  constructor(path, issue) {
    super();
    this.path = path;
    this.issue = issue;
  }
};
var MissingKey = class extends IssueNodeImpl {
  _tag = "MissingKey";
  /**
   * The metadata for the issue.
   */
  annotations;
  constructor(annotations) {
    super();
    this.annotations = annotations;
  }
};
var UnexpectedKey = class extends IssueNodeImpl {
  _tag = "UnexpectedKey";
  /**
   * The schema that caused the issue.
   */
  ast;
  constructor(ast, input, options3) {
    super(input, options3);
    this.ast = ast;
  }
};
var Composite = class extends IssueNodeImpl {
  _tag = "Composite";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The issues that occurred.
   */
  issues;
  constructor(ast, issues, input, options3) {
    super(input, options3);
    this.ast = ast;
    this.issues = issues;
  }
};
var InvalidType = class extends IssueNodeImpl {
  _tag = "InvalidType";
  /**
   * The schema that caused the issue.
   */
  ast;
  constructor(ast, input, options3) {
    super(input, options3);
    this.ast = ast;
  }
};
var InvalidValue = class extends IssueNodeImpl {
  _tag = "InvalidValue";
  /**
   * The metadata for the issue.
   */
  annotations;
  constructor(annotations, input, options3) {
    super(input, options3);
    this.annotations = annotations;
  }
};
function makeCompositeAtKey(compositeAst, pointerKey, pointerIssue, compositeInput, parseOptions) {
  return new Composite(compositeAst, [new Pointer([pointerKey], pointerIssue)], compositeInput, parseOptions);
}
var Forbidden = class extends IssueNodeImpl {
  _tag = "Forbidden";
  /**
   * The metadata for the issue.
   */
  annotations;
  constructor(annotations, input, options3) {
    super(input, options3);
    this.annotations = annotations;
  }
};
var AnyOf = class extends IssueNodeImpl {
  _tag = "AnyOf";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The issues that occurred.
   */
  issues;
  constructor(ast, issues, input, options3) {
    super(input, options3);
    this.ast = ast;
    this.issues = issues;
  }
};
var OneOf = class extends IssueNodeImpl {
  _tag = "OneOf";
  /**
   * The schema that caused the issue.
   */
  ast;
  /**
   * The schemas that were successful.
   */
  successes;
  constructor(ast, successes, input, options3) {
    super(input, options3);
    this.ast = ast;
    this.successes = successes;
  }
};
function makeFilterIssue(entry, input, options3) {
  if (isIssue(entry)) {
    return entry;
  }
  if (typeof entry === "string") {
    return new InvalidValue({
      message: entry
    }, input, options3);
  }
  const inner = typeof entry.issue === "string" ? new InvalidValue({
    message: entry.issue
  }, input, options3) : entry.issue;
  return new Pointer(entry.path, inner);
}
function makeSingle(out, input, options3) {
  if (out === void 0) {
    return void 0;
  }
  if (typeof out === "boolean") {
    return out ? void 0 : new InvalidValue(void 0, input, options3);
  }
  return makeFilterIssue(out, input, options3);
}
function normalizeFilterOutput(ast, out, input, options3) {
  if (Array.isArray(out)) {
    if (!isReadonlyArrayNonEmpty(out)) {
      return void 0;
    }
    return out.length === 1 ? makeFilterIssue(out[0], input, options3) : new Composite(ast, map4(out, (entry) => makeFilterIssue(entry, input, options3)), input, options3);
  }
  return makeSingle(out, input, options3);
}
var defaultLeafHook = (issue) => {
  const message = findMessage(issue);
  if (message !== void 0) return message;
  switch (issue._tag) {
    case "InvalidType":
      return getExpectedMessage(getExpected(issue.ast), issue);
    case "InvalidValue": {
      const expected = findExpected(issue);
      if (expected !== void 0) return getExpectedMessage(expected, issue);
      const input = formatInput(issue);
      return input === void 0 ? "Expected a valid value" : `Invalid data ${input}`;
    }
    case "MissingKey":
      return "Missing key";
    case "UnexpectedKey": {
      const input = formatInput(issue);
      return input === void 0 ? "Expected no excess property" : `Unexpected key with value ${input}`;
    }
    case "Forbidden":
      return "Forbidden operation";
    case "OneOf": {
      const input = formatInput(issue);
      return input === void 0 ? "Expected exactly one member to match" : `Expected exactly one member to match the input ${input}`;
    }
  }
};
var defaultCheckHook = (issue) => findMessage(issue.issue) ?? findMessage(issue);
function makeFormatterStandardSchemaV1(options3) {
  return (issue) => ({
    issues: toDefaultIssues(issue, [], options3?.leafHook ?? defaultLeafHook, options3?.checkHook ?? defaultCheckHook)
  });
}
function formatInput(issue) {
  return hasInput(issue) ? format(issue.input) : void 0;
}
function findExpected(issue) {
  const expected = issue.annotations?.expected;
  return typeof expected === "string" ? expected : void 0;
}
function getExpectedMessage(expected, issue) {
  const input = formatInput(issue);
  return input === void 0 ? `Expected ${expected}` : `Expected ${expected}, got ${input}`;
}
function toDefaultIssues(issue, path, leafHook, checkHook) {
  switch (issue._tag) {
    case "Filter": {
      const message = checkHook(issue);
      if (message !== void 0) {
        return [{
          path,
          message
        }];
      }
      if (issue.issue._tag !== "InvalidValue") {
        return toDefaultIssues(issue.issue, path, leafHook, checkHook);
      }
      const expected = findExpected(issue.issue);
      return [{
        path,
        message: expected === void 0 ? getExpectedMessage(formatCheck(issue.filter), issue) : getExpectedMessage(expected, issue.issue)
      }];
    }
    case "Encoding":
      return toDefaultIssues(issue.issue, path, leafHook, checkHook);
    case "Pointer":
      return toDefaultIssues(issue.issue, [...path, ...issue.path], leafHook, checkHook);
    case "Composite":
      return issue.issues.flatMap((issue2) => toDefaultIssues(issue2, path, leafHook, checkHook));
    case "AnyOf": {
      if (issue.issues.length === 0) {
        return [{
          path,
          message: findMessage(issue) ?? getExpectedMessage(getExpected(issue.ast), issue)
        }];
      }
      return issue.issues.flatMap((issue2) => toDefaultIssues(issue2, path, leafHook, checkHook));
    }
    default:
      return [{
        path,
        message: leafHook(issue)
      }];
  }
}
function formatCheck(check2) {
  const expected = check2.annotations?.expected;
  if (typeof expected === "string") return expected;
  switch (check2._tag) {
    case "Filter":
      return "<filter>";
    case "FilterGroup":
      return check2.checks.map((check3) => formatCheck(check3)).join(" & ");
  }
}
function makeFormatterDefault() {
  return (issue) => formatIssue(issue, "");
}
var defaultFormatter = /* @__PURE__ */ makeFormatterDefault();
function formatIssue(issue, path) {
  let message;
  switch (issue._tag) {
    case "Filter": {
      const annotated = defaultCheckHook(issue);
      if (annotated !== void 0) {
        message = annotated;
      } else {
        if (issue.issue._tag !== "InvalidValue") {
          return formatIssue(issue.issue, path);
        }
        const expected = findExpected(issue.issue);
        message = expected === void 0 ? getExpectedMessage(formatCheck(issue.filter), issue) : getExpectedMessage(expected, issue.issue);
      }
      break;
    }
    case "Encoding":
      return formatIssue(issue.issue, path);
    case "Pointer":
      return formatIssue(issue.issue, path + formatPath(issue.path));
    case "Composite":
    case "AnyOf": {
      if (issue._tag === "Composite" || issue.issues.length > 0) {
        return issue.issues.map((issue2) => formatIssue(issue2, path)).join("\n");
      }
      message = findMessage(issue) ?? getExpectedMessage(getExpected(issue.ast), issue);
      break;
    }
    default:
      message = defaultLeafHook(issue);
      break;
  }
  return path ? `${message}
  at ${path}` : message;
}
function findMessage(issue) {
  if (issue._tag === "Pointer") return;
  if (issue._tag === "Encoding") return findMessage(issue.issue);
  const annotations = issue._tag === "Filter" ? issue.filter.annotations : "annotations" in issue ? issue.annotations : issue.ast.annotations;
  const message = annotations?.[issue._tag === "MissingKey" ? "messageMissingKey" : issue._tag === "UnexpectedKey" ? "messageUnexpectedKey" : "message"];
  if (typeof message === "string") return message;
}

// ../../node_modules/effect/dist/internal/schema/cause.js
function getSchemaIssue(cause) {
  let issue;
  for (const reason of cause.reasons) {
    if (!isFailReason2(reason) || !isIssue(reason.error)) {
      return void 0;
    }
    issue ??= reason.error;
  }
  return issue;
}
function getSchemaIssueOrThrow(cause, message) {
  const issue = getSchemaIssue(cause);
  if (issue === void 0) {
    throw new Error(message, {
      cause
    });
  }
  return issue;
}

// ../../node_modules/effect/dist/encoding/Base64Url.js
var encode3 = (input) => encode2(input).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
var decode3 = (str) => {
  const stripped = str.replace(/[\n\r]/g, "");
  const length = stripped.length;
  if (length % 4 === 1) {
    return fail2(new EncodingError({
      module: "Base64Url",
      kind: "Decode",
      input: stripped,
      message: `Length should be a multiple of 4, but is ${length}`
    }));
  }
  if (!/^[-_A-Z0-9]*?={0,2}$/i.test(stripped)) {
    return fail2(new EncodingError({
      module: "Base64Url",
      kind: "Decode",
      input: stripped,
      message: "Invalid input"
    }));
  }
  let sanitized = length % 4 === 2 ? `${stripped}==` : length % 4 === 3 ? `${stripped}=` : stripped;
  sanitized = sanitized.replace(/-/g, "+").replace(/_/g, "/");
  return decode2(sanitized);
};
var decodeString3 = (str) => map2(decode3(str), (_) => decoder3.decode(_));
var decoder3 = /* @__PURE__ */ new TextDecoder();

// ../../node_modules/effect/dist/SchemaGetter.js
var makeGetter = (fields) => Object.assign(Object.create(Prototype), fields);
function fail7(f) {
  return transformOptionalEffect((oe, options3) => fail6(f(oe, options3)));
}
function forbidden(message) {
  return fail7((oe, options3) => {
    const annotations = {
      message: message(oe)
    };
    return isSome2(oe) ? new Forbidden(annotations, oe.value, options3) : new Forbidden(annotations);
  });
}
var forbiddenEncoding = /* @__PURE__ */ forbidden(() => "Encoding is not supported");
var passthrough_ = /* @__PURE__ */ makeGetter({
  _tag: "Passthrough"
});
function passthrough2() {
  return passthrough_;
}
function transform2(f) {
  return makeGetter({
    _tag: "Transform",
    transform: f
  });
}
function transformEffect(f) {
  return makeGetter({
    _tag: "TransformEffect",
    transform: f
  });
}
function transformOptional(f) {
  return makeGetter({
    _tag: "TransformOptional",
    transform: f
  });
}
function transformOptionalEffect(f) {
  return makeGetter({
    _tag: "TransformOptionalEffect",
    transform: f
  });
}
function omit() {
  return transformOptional(() => none2());
}
function withDefault(defaultValue) {
  return transformOptionalEffect((o) => {
    const filtered = filter(o, isNotUndefined);
    return isSome2(filtered) ? succeed6(filtered) : mapEager2(defaultValue, some2);
  });
}
function String4() {
  return transform2(globalThis.String);
}
function Number4() {
  return transform2(globalThis.Number);
}
function BigInt4() {
  return transform2(globalThis.BigInt);
}
function Date3() {
  return transform2((u) => new globalThis.Date(u));
}
function trim2() {
  return transform2(trim);
}
function parseJson(options3) {
  return transformEffect((input, parseOptions) => try_3({
    try: () => JSON.parse(input, options3?.reviver),
    catch: () => new InvalidValue({
      expected: "a valid JSON string"
    }, input, parseOptions)
  }));
}
function stringifyJson(options3) {
  return transformEffect((input, parseOptions) => try_3({
    try: () => {
      const output = JSON.stringify(input, options3?.replacer, options3?.space);
      if (output === void 0) {
        throw new TypeError("Value cannot be represented as JSON");
      }
      return output;
    },
    catch: () => new InvalidValue({
      expected: "a JSON-serializable value"
    }, input, parseOptions)
  }));
}
function encodeBase64() {
  return transform2(encode2);
}
function encodeBase64Url() {
  return transform2(encode3);
}
function encodeHex() {
  return transform2(encode);
}
function decodeBase64() {
  return transformEffect((input, options3) => mapErrorEager2(fromResult2(decode2(input)), () => new InvalidValue({
    expected: "a valid Base64 string"
  }, input, options3)));
}
function decodeBase64String() {
  return transformEffect((input, options3) => match2(decodeString2(input), {
    onFailure: () => fail6(new InvalidValue({
      expected: "a valid Base64 string"
    }, input, options3)),
    onSuccess: succeed6
  }));
}
function decodeBase64Url() {
  return transformEffect((input, options3) => match2(decode3(input), {
    onFailure: () => fail6(new InvalidValue({
      expected: "a valid Base64Url string"
    }, input, options3)),
    onSuccess: succeed6
  }));
}
function decodeBase64UrlString() {
  return transformEffect((input, options3) => match2(decodeString3(input), {
    onFailure: () => fail6(new InvalidValue({
      expected: "a valid Base64Url string"
    }, input, options3)),
    onSuccess: succeed6
  }));
}
function decodeHex() {
  return transformEffect((input, options3) => match2(decode(input), {
    onFailure: () => fail6(new InvalidValue({
      expected: "a valid hexadecimal string"
    }, input, options3)),
    onSuccess: succeed6
  }));
}
function decodeHexString() {
  return transformEffect((input, options3) => match2(decodeString(input), {
    onFailure: () => fail6(new InvalidValue({
      expected: "a valid hexadecimal string"
    }, input, options3)),
    onSuccess: succeed6
  }));
}
function encodeUriComponent() {
  return transform2(encodeURIComponent);
}
function decodeUriComponent() {
  return transformEffect((input, options3) => {
    try {
      return succeed6(globalThis.decodeURIComponent(input));
    } catch {
      return fail6(new InvalidValue({
        expected: "a valid URI component"
      }, input, options3));
    }
  });
}
function decodeFormData() {
  return transform2((input) => makeTreeRecord(Array.from(input.entries())));
}
var collectFormDataEntries = /* @__PURE__ */ collectBracketPathEntries((value3) => typeof value3 === "string" || typeof Blob !== "undefined" && value3 instanceof Blob);
function encodeFormData() {
  return transform2((input) => {
    const out = new FormData();
    if (typeof input === "object" && input !== null) {
      const entries3 = collectFormDataEntries(input);
      entries3.forEach(([key, value3]) => {
        out.append(key, value3);
      });
    }
    return out;
  });
}
function decodeURLSearchParams() {
  return transform2((input) => makeTreeRecord(Array.from(input.entries())));
}
var collectURLSearchParamsEntries = /* @__PURE__ */ collectBracketPathEntries(isString);
function encodeURLSearchParams() {
  return transform2((input) => {
    if (typeof input === "object" && input !== null) {
      return new URLSearchParams(collectURLSearchParamsEntries(input));
    }
    return new URLSearchParams();
  });
}
function bracketPathToTokens(bracketPath) {
  if (bracketPath === "") {
    return [""];
  }
  const replaced = bracketPath.replace(/\[(.*?)\]/g, ".$1");
  const parts2 = replaced.split(".");
  const start = replaced.startsWith(".") ? 1 : 0;
  return parts2.slice(start).map((part) => isCanonicalArrayIndex(part) ? globalThis.Number(part) : part);
}
function makeTreeRecord(bracketPathEntries) {
  const out = {};
  const containers = /* @__PURE__ */ new WeakSet();
  const duplicates = /* @__PURE__ */ new WeakSet();
  function getOrCreateContainer(self, key, shouldBeArray) {
    const current = Object.hasOwn(self, key) ? self[key] : void 0;
    if (containers.has(current) && Array.isArray(current) === shouldBeArray) {
      return current;
    }
    const container = shouldBeArray ? [] : {};
    containers.add(container);
    assignProperty(self, key, container);
    return container;
  }
  bracketPathEntries.forEach(([key, value3]) => {
    const tokens = bracketPathToTokens(key);
    let cur = out;
    tokens.forEach((token, i) => {
      const isLast = i === tokens.length - 1;
      if (Array.isArray(cur) && token === "") {
        if (isLast) {
          cur.push(value3);
        } else {
          const next = tokens[i + 1];
          const shouldBeArray = typeof next === "number" || next === "";
          const index2 = cur.length;
          cur = getOrCreateContainer(cur, index2, shouldBeArray);
        }
      } else if (isLast) {
        const hasOwn = Object.hasOwn(cur, token);
        if (hasOwn && Array.isArray(cur[token]) && (containers.has(cur[token]) || duplicates.has(cur[token]))) {
          cur[token].push(value3);
        } else if (hasOwn) {
          const values2 = [cur[token], value3];
          duplicates.add(values2);
          assignProperty(cur, token, values2);
        } else {
          assignProperty(cur, token, value3);
        }
      } else {
        const next = tokens[i + 1];
        const shouldBeArray = typeof next === "number" || next === "";
        cur = getOrCreateContainer(cur, token, shouldBeArray);
      }
    });
  });
  return out;
}
function collectBracketPathEntries(isLeaf) {
  return (input) => {
    const bracketPathEntries = [];
    function append4(key, value3) {
      if (isLeaf(value3)) {
        bracketPathEntries.push([key, value3]);
      } else if (Array.isArray(value3)) {
        const allLeaves = value3.every(isLeaf);
        if (allLeaves) {
          value3.forEach((v) => {
            bracketPathEntries.push([key, v]);
          });
        } else {
          value3.forEach((v, i) => {
            append4(`${key}[${i}]`, v);
          });
        }
      } else if (typeof value3 === "object" && value3 !== null) {
        for (const [k, v] of Object.entries(value3)) {
          append4(`${key}[${k}]`, v);
        }
      }
    }
    for (const [key, value3] of Object.entries(input)) {
      append4(key, value3);
    }
    return bracketPathEntries;
  };
}

// ../../node_modules/effect/dist/SchemaTransformation.js
var Middleware = class extends Class {
  _tag = "Middleware";
  decode;
  encode;
  constructor(decode5, encode5) {
    super();
    this.decode = decode5;
    this.encode = encode5;
  }
  flip() {
    return new Middleware(this.encode, this.decode);
  }
};
var TypeId21 = "~effect/SchemaTransformation/Transformation";
var Transformation = class extends Class {
  [TypeId21] = TypeId21;
  _tag = "Transformation";
  decode;
  encode;
  constructor(decode5, encode5) {
    super();
    this.decode = decode5;
    this.encode = encode5;
  }
  flip() {
    return new Transformation(this.encode, this.decode);
  }
};
function isTransformation(u) {
  return hasProperty(u, TypeId21) && u[TypeId21] === TypeId21;
}
var makeTransformation = (options3) => {
  if (isTransformation(options3)) {
    return options3;
  }
  return new Transformation(options3.decode, options3.encode);
};
function transformEffect2(options3) {
  return new Transformation(transformEffect(options3.decode), transformEffect(options3.encode));
}
function transform3(options3) {
  return new Transformation(transform2(options3.decode), transform2(options3.encode));
}
function transformOptional2(options3) {
  return new Transformation(transformOptional(options3.decode), transformOptional(options3.encode));
}
function trim3() {
  return new Transformation(trim2(), passthrough2());
}
var passthrough_2 = /* @__PURE__ */ new Transformation(/* @__PURE__ */ passthrough2(), /* @__PURE__ */ passthrough2());
function passthrough3() {
  return passthrough_2;
}
var numberFromString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number4(), /* @__PURE__ */ String4());
var bigintFromString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ BigInt4(), /* @__PURE__ */ String4());
var dateFromString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ Date3(), /* @__PURE__ */ transform2(formatDate));
var dateFromMillis = /* @__PURE__ */ new Transformation(/* @__PURE__ */ Date3(), /* @__PURE__ */ transform2((date) => date.getTime()));
var byteSizeFromString = /* @__PURE__ */ transformEffect2({
  decode: (input, options3) => match(fromString2(input), {
    onNone: () => fail6(new InvalidValue({
      expected: "a valid ByteSize string"
    }, input, options3)),
    onSome: succeed6
  }),
  encode: (byteSize) => succeed6(`${byteSize} ${byteSize === BigInt(1) ? "byte" : "bytes"}`)
});
var byteSizeFromBigInt = /* @__PURE__ */ transformEffect2({
  decode: (input, options3) => match(fromInput2(input), {
    onNone: () => fail6(new InvalidValue({
      expected: "a non-negative bigint byte count"
    }, input, options3)),
    onSome: succeed6
  }),
  encode: (byteSize) => succeed6(toBigInt(byteSize))
});
var byteSizeFromNumber = /* @__PURE__ */ transformEffect2({
  decode: (input, options3) => match(fromInput2(input), {
    onNone: () => fail6(new InvalidValue({
      expected: "a non-negative safe-integer byte count"
    }, input, options3)),
    onSome: succeed6
  }),
  encode: (byteSize, options3) => match(toNumber2(byteSize), {
    onNone: () => fail6(new InvalidValue({
      expected: "a ByteSize representable as a safe integer"
    }, byteSize, options3)),
    onSome: succeed6
  })
});
var isJsonError = (input) => isObject(input) && typeof input["message"] === "string";
var decodeJsonError = (input) => {
  const hasCause = Object.hasOwn(input, "cause");
  const err = hasCause ? new Error(input.message, {
    cause: decodeDefect(input.cause)
  }) : new Error(input.message);
  if (typeof input.name === "string" && input.name !== "Error") err.name = input.name;
  if (typeof input.stack === "string") err.stack = input.stack;
  return err;
};
var encodeUnknownAsJson = (input) => {
  try {
    const json2 = formatJson(input);
    return json2 === void 0 ? format(input) : JSON.parse(json2);
  } catch {
    return format(input);
  }
};
var encodeJsonError = (input, options3, encodeDefect) => {
  const encoded = {
    name: input.name,
    message: typeof input.message === "string" ? input.message : ""
  };
  if (options3?.includeStack && typeof input.stack === "string") {
    encoded.stack = input.stack;
  }
  if (!options3?.excludeCause && input.cause !== void 0) {
    encoded.cause = encodeDefect(input.cause);
  }
  return encoded;
};
var makeEncodeDefect = (options3) => {
  const seen = /* @__PURE__ */ new WeakSet();
  const encode5 = (input) => {
    if (isError(input)) {
      if (seen.has(input)) {
        return "[Circular]";
      }
      seen.add(input);
      const encoded = encodeJsonError(input, options3, encode5);
      seen.delete(input);
      return encoded;
    }
    return encodeUnknownAsJson(input);
  };
  return encode5;
};
var decodeDefect = (input) => isJsonError(input) ? decodeJsonError(input) : input;
var errorFromJsonError = (options3) => transform3({
  decode: decodeJsonError,
  encode: (input) => makeEncodeDefect(options3)(input)
});
var defectFromJson = (options3) => transform3({
  decode: decodeDefect,
  encode: makeEncodeDefect(options3)
});
function optionFromNullOr() {
  return transform3({
    decode: fromNullOr,
    encode: getOrNull
  });
}
function optionFromUndefinedOr() {
  return transform3({
    decode: fromUndefinedOr,
    encode: getOrUndefined
  });
}
function optionFromNullishOr(options3) {
  return transform3({
    decode: fromNullishOr,
    encode: options3?.onNoneEncoding === null ? getOrNull : getOrUndefined
  });
}
function optionFromOptionalKey() {
  return transformOptional2({
    decode: some2,
    encode: flatten
  });
}
function optionFromOptional() {
  return transformOptional2({
    decode: (ot) => ot.pipe(filter(isNotUndefined), some2),
    encode: flatten
  });
}
var urlFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options3) => URL.canParse(s) ? succeed6(new URL(s)) : fail6(new InvalidValue({
    expected: "a valid URL string"
  }, s, options3)),
  encode: (url) => succeed6(url.href)
});
var uint8ArrayFromBase64String = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeBase64(), /* @__PURE__ */ encodeBase64());
var stringFromBase64String = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeBase64String(), /* @__PURE__ */ encodeBase64());
var stringFromBase64UrlString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeBase64UrlString(), /* @__PURE__ */ encodeBase64Url());
var stringFromHexString = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeHexString(), /* @__PURE__ */ encodeHex());
var stringFromUriComponent = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeUriComponent(), /* @__PURE__ */ encodeUriComponent());
function fromJsonString(options3) {
  return new Transformation(parseJson(options3 ?? {}), stringifyJson(options3));
}
var fromFormData = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeFormData(), /* @__PURE__ */ encodeFormData());
var fromURLSearchParams = /* @__PURE__ */ new Transformation(/* @__PURE__ */ decodeURLSearchParams(), /* @__PURE__ */ encodeURLSearchParams());

// ../../node_modules/effect/dist/SchemaAST.js
function makeGuard(tag2) {
  return (ast) => ast._tag === tag2;
}
var isDeclaration = /* @__PURE__ */ makeGuard("Declaration");
var isNever2 = /* @__PURE__ */ makeGuard("Never");
var isLiteral = /* @__PURE__ */ makeGuard("Literal");
var isUniqueSymbol = /* @__PURE__ */ makeGuard("UniqueSymbol");
var isArrays = /* @__PURE__ */ makeGuard("Arrays");
var isObjects = /* @__PURE__ */ makeGuard("Objects");
var isUnion = /* @__PURE__ */ makeGuard("Union");
var isSuspend = /* @__PURE__ */ makeGuard("Suspend");
var Link = class {
  to;
  transformation;
  constructor(to, transformation) {
    this.to = to;
    this.transformation = transformation;
  }
};
var defaultParseOptions = {};
var Context = class {
  isOptional;
  isMutable;
  /** Used for constructor default values (e.g. `withConstructorDefault` API) */
  constructorDefault;
  annotations;
  constructor(isOptional2, isMutable2, constructorDefault = void 0, annotations = void 0) {
    this.isOptional = isOptional2;
    this.isMutable = isMutable2;
    this.constructorDefault = constructorDefault;
    this.annotations = annotations;
  }
};
var TypeId22 = "~effect/Schema";
var ASTNodeImpl = class {
  [TypeId22] = TypeId22;
  annotations;
  checks;
  encoding;
  context;
  constructor(annotations = void 0, checks = void 0, encoding = void 0, context3 = void 0) {
    this.annotations = annotations;
    this.checks = checks;
    this.encoding = encoding;
    this.context = context3;
  }
  toString() {
    return `<${this._tag}>`;
  }
};
var Declaration = class extends ASTNodeImpl {
  _tag = "Declaration";
  typeParameters;
  run;
  encodingChecks;
  /**
   * Parser factory {@link flip} swaps in, so a declaration can behave
   * differently when encoding. `undefined` reuses `run`.
   */
  encodingRun;
  constructor(typeParameters, run3, annotations, checks, encoding, context3, encodingChecks, encodingRun) {
    super(annotations, checks, encoding, context3);
    this.typeParameters = typeParameters;
    this.run = run3;
    this.encodingChecks = encodingChecks;
    this.encodingRun = encodingRun;
  }
  /** @internal */
  getParser() {
    let run3;
    return (input, options3) => {
      if (input === missing) return missingExit;
      return (run3 ??= this.run(this.typeParameters))(input, this, options3);
    };
  }
  _rebuild(recur2, checks, encodingChecks, run3, encodingRun) {
    const tps = mapOrSame(this.typeParameters, recur2);
    return tps === this.typeParameters && checks === this.checks && encodingChecks === this.encodingChecks && run3 === this.run && encodingRun === this.encodingRun ? this : new Declaration(tps, run3, this.annotations, checks, void 0, this.context, encodingChecks, encodingRun);
  }
  /** @internal */
  recur(recur2) {
    return this._rebuild(recur2, this.checks, this.encodingChecks, this.run, this.encodingRun);
  }
  /** @internal */
  flip(recur2) {
    return this._rebuild(recur2, this.encodingChecks, this.checks, this.encodingRun ?? this.run, this.run);
  }
  /** @internal */
  getExpected() {
    const expected = this.annotations?.expected;
    if (typeof expected === "string") return expected;
    return "<Declaration>";
  }
};
var Null = class extends ASTNodeImpl {
  _tag = "Null";
  /** @internal */
  getParser() {
    return fromConst(this, null);
  }
  /** @internal */
  getExpected() {
    return "null";
  }
};
var null_ = /* @__PURE__ */ new Null();
var Undefined = class extends ASTNodeImpl {
  _tag = "Undefined";
  /** @internal */
  getParser() {
    return fromConst(this, void 0);
  }
  /** @internal */
  toCodecJson() {
    return replaceEncoding(this, [undefinedToNull]);
  }
  /** @internal */
  getExpected() {
    return "undefined";
  }
};
var undefinedToNull = /* @__PURE__ */ new Link(null_, /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform2(() => void 0), /* @__PURE__ */ transform2(() => null)));
var undefined_3 = /* @__PURE__ */ new Undefined();
var Void = class extends ASTNodeImpl {
  _tag = "Void";
  /** @internal */
  getParser() {
    const succeed9 = succeed7(void 0);
    return (input) => input === missing ? missingExit : succeed9;
  }
  /** @internal */
  toCodecJson() {
    return replaceEncoding(this, [undefinedToNull]);
  }
  /** @internal */
  getExpected() {
    return "void";
  }
};
var void_5 = /* @__PURE__ */ new Void();
var Never = class extends ASTNodeImpl {
  _tag = "Never";
  /** @internal */
  getParser() {
    return fromRefinement(this, isNever);
  }
  /** @internal */
  getExpected() {
    return "never";
  }
};
var never3 = /* @__PURE__ */ new Never();
var Any = class extends ASTNodeImpl {
  _tag = "Any";
  /** @internal */
  getParser() {
    return fromRefinement(this, isUnknown);
  }
  /** @internal */
  getExpected() {
    return "any";
  }
};
var any = /* @__PURE__ */ new Any();
var Unknown = class extends ASTNodeImpl {
  _tag = "Unknown";
  /** @internal */
  getParser() {
    return fromRefinement(this, isUnknown);
  }
  /** @internal */
  getExpected() {
    return "unknown";
  }
};
var unknown = /* @__PURE__ */ new Unknown();
var ObjectKeyword = class extends ASTNodeImpl {
  _tag = "ObjectKeyword";
  /** @internal */
  getParser() {
    return fromRefinement(this, isObjectKeyword);
  }
  /** @internal */
  getExpected() {
    return "object | array | function";
  }
};
var objectKeyword = /* @__PURE__ */ new ObjectKeyword();
var Enum = class extends ASTNodeImpl {
  _tag = "Enum";
  enums;
  constructor(enums, annotations, checks, encoding, context3) {
    super(annotations, checks, encoding, context3);
    for (const [, value3] of enums) {
      if (typeof value3 === "number" && !globalThis.Number.isFinite(value3)) {
        throw new Error(`A numeric enum value must be finite, got ${format(value3)}`);
      }
    }
    this.enums = enums;
  }
  /** @internal */
  getParser() {
    const values2 = new Set(this.enums.map(([, v]) => v));
    return fromRefinement(this, (input) => values2.has(input));
  }
  /** @internal */
  toCodecStringTree() {
    if (this.enums.some(([_, v]) => typeof v === "number")) {
      const coercions = Object.fromEntries(this.enums.map(([_, v]) => [globalThis.String(v), v]));
      return replaceEncoding(this, [new Link(new Union(Object.keys(coercions).map((k) => new Literal(k))), new Transformation(transform2((s) => coercions[s]), String4()))]);
    }
    return this;
  }
  /** @internal */
  getExpected() {
    return this.enums.map(([_, value3]) => JSON.stringify(value3)).join(" | ");
  }
};
function formatTemplateLiteralPath(path) {
  return typeof path === "number" ? `parts[${path}]` : path;
}
function isTemplateLiteralPart(ast, path, validated) {
  if (validated.has(ast)) return true;
  if (ast.encoding) {
    throw new Error(`TemplateLiteral parts cannot have an encoding at ${formatTemplateLiteralPath(path)}`);
  }
  let valid;
  switch (ast._tag) {
    case "String":
    case "Number":
    case "BigInt":
      valid = true;
      break;
    case "Literal":
      valid = !ast.checks;
      break;
    case "TemplateLiteral": {
      const currentPath = formatTemplateLiteralPath(path);
      valid = !ast.checks && ast.parts.every((part, index2) => isTemplateLiteralPart(part, `${currentPath}.parts[${index2}]`, validated));
      break;
    }
    case "Union": {
      const currentPath = formatTemplateLiteralPath(path);
      valid = !ast.checks && ast.types.every((part, index2) => isTemplateLiteralPart(part, `${currentPath}.types[${index2}]`, validated));
      break;
    }
    default:
      return false;
  }
  if (valid) validated.add(ast);
  return valid;
}
var TemplateLiteral = class extends ASTNodeImpl {
  _tag = "TemplateLiteral";
  parts;
  /** @internal */
  encodedParts;
  /** @internal */
  literals;
  /** @internal */
  suffixLengths;
  constructor(parts2, annotations, checks, encoding, context3) {
    super(annotations, checks, encoding, context3);
    const encodedParts = [];
    const literals = [];
    const validated = /* @__PURE__ */ new Set();
    for (let index2 = 0; index2 < parts2.length; index2++) {
      const part = parts2[index2];
      if (!isTemplateLiteralPart(part, index2, validated)) {
        throw new Error(`Invalid TemplateLiteral part ${part._tag}`);
      }
      encodedParts.push(part);
      literals.push(part._tag === "Literal" ? globalThis.String(part.literal) : void 0);
    }
    const suffixLengths = new Array(encodedParts.length + 1);
    suffixLengths[encodedParts.length] = 0;
    for (let i = encodedParts.length - 1; i >= 0; i--) {
      suffixLengths[i] = suffixLengths[i + 1] + (literals[i]?.length ?? 0);
    }
    this.parts = parts2;
    this.encodedParts = encodedParts;
    this.literals = literals;
    this.suffixLengths = suffixLengths;
  }
  /** @internal */
  getParser(compile2) {
    const tuple2 = new Arrays(false, this.parts.map(partFromString), []);
    const parser = compile2(decodeTo(string2, tuple2, templateLiteralTransformation(this)));
    return (input, options3) => {
      if (input === missing) return missingExit;
      const result3 = parser(input, options3);
      if (result3._tag === "Success") {
        return sameExit;
      }
      return mapBothEager2(result3, {
        onSuccess: () => input,
        onFailure: (issue) => new Composite(this, [issue], input, options3)
      });
    };
  }
  /** @internal */
  getExpected() {
    return "string";
  }
  /** @internal */
  matchPart(s, options3) {
    return segmentTemplateLiteralParts(this, s, options3) === void 0 ? void 0 : s;
  }
};
function templateLiteralParser(parts2) {
  const normalize3 = memoize((encoded) => {
    if (encoded._tag !== "Union") return encoded;
    const types = mapOrSame(encoded.types, normalize3);
    return (encoded.options?.mode ?? "anyOf") === "anyOf" && types === encoded.types ? encoded : new Union(types, encoded.options === void 0 ? void 0 : {
      ...encoded.options,
      mode: "anyOf"
    }, encoded.annotations, encoded.checks, void 0, encoded.context);
  });
  const template = new TemplateLiteral(parts2.map((part) => normalize3(toEncoded(part))));
  const tuple2 = new Arrays(false, parts2.map(partFromString), []);
  return decodeTo(template, tuple2, templateLiteralTransformation(template));
}
function templateLiteralTransformation(template) {
  return new Transformation(transformEffect((s, options3) => {
    const segments = segmentTemplateLiteralParts(template, s, options3);
    if (segments) return succeed6(segments);
    return fail6(new InvalidValue({
      expected: "a string matching template literal parts"
    }, s, options3));
  }), transform2((parts2) => parts2.join("")));
}
var UniqueSymbol = class extends ASTNodeImpl {
  _tag = "UniqueSymbol";
  symbol;
  constructor(symbol4, annotations, checks, encoding, context3) {
    super(annotations, checks, encoding, context3);
    this.symbol = symbol4;
  }
  /** @internal */
  getParser() {
    return fromConst(this, this.symbol);
  }
  /** @internal */
  toCodecStringTree() {
    const key = globalThis.Symbol.keyFor(this.symbol);
    return replaceEncoding(this, [new Link(key === void 0 ? never3 : new Literal(globalThis.String(this.symbol)), symbolToString.transformation)]);
  }
  /** @internal */
  getExpected() {
    return globalThis.String(this.symbol);
  }
};
var Literal = class extends ASTNodeImpl {
  _tag = "Literal";
  literal;
  constructor(literal, annotations, checks, encoding, context3) {
    super(annotations, checks, encoding, context3);
    if (typeof literal === "number" && !globalThis.Number.isFinite(literal)) {
      throw new Error(`A numeric literal must be finite, got ${format(literal)}`);
    }
    this.literal = literal;
  }
  /** @internal */
  getParser() {
    return fromConst(this, this.literal);
  }
  /** @internal */
  matchPart(s, _options) {
    return s === globalThis.String(this.literal) ? this.literal : void 0;
  }
  /** @internal */
  toCodecJson() {
    return typeof this.literal === "bigint" ? literalToString(this) : this;
  }
  /** @internal */
  toCodecStringTree() {
    return typeof this.literal === "string" ? this : literalToString(this);
  }
  /** @internal */
  getExpected() {
    return typeof this.literal === "string" ? JSON.stringify(this.literal) : globalThis.String(this.literal);
  }
};
function literalToString(ast) {
  const literalAsString = globalThis.String(ast.literal);
  return replaceEncoding(ast, [new Link(new Literal(literalAsString), new Transformation(transform2(() => ast.literal), transform2(() => literalAsString)))]);
}
var String5 = class extends ASTNodeImpl {
  _tag = "String";
  /** @internal */
  getParser() {
    return fromRefinement(this, isString);
  }
  /** @internal */
  matchPart(s, options3) {
    const checks = this.checks;
    return checks && !options3.disableChecks && collectIssues(checks, s, void 0, this, options3) ? void 0 : s;
  }
  /** @internal */
  getExpected() {
    return "string";
  }
};
var string2 = /* @__PURE__ */ new String5();
var Number5 = class extends ASTNodeImpl {
  _tag = "Number";
  /** @internal */
  getParser() {
    return fromRefinement(this, isNumber);
  }
  /** @internal */
  matchKey(s, options3) {
    return this._match(isStringNumberRegExp, s, options3);
  }
  /** @internal */
  matchPart(s, options3) {
    return this._match(isStringFiniteRegExp, s, options3);
  }
  _match(regexp, s, options3) {
    if (!regexp.test(s)) return void 0;
    const value3 = globalThis.Number(s);
    if (options3.disableChecks || !this.checks) return value3;
    return collectIssues(this.checks, value3, void 0, this, options3) ? void 0 : value3;
  }
  /** @internal */
  toCodecJson() {
    if (this.checks && (hasCheck(this.checks, "effect/schema/isFinite") || hasCheck(this.checks, "effect/schema/isInt"))) {
      return this;
    }
    return replaceEncoding(this, [numberToJson]);
  }
  /** @internal */
  toCodecStringTree() {
    if (this.toCodecJson() === this) {
      return replaceEncoding(this, [finiteToString]);
    }
    return replaceEncoding(this, [numberToString]);
  }
  /** @internal */
  getExpected() {
    return "number";
  }
};
function hasCheck(checks, id2) {
  return checks.some((check2) => check2.annotations?.representation?.id === id2 || check2._tag === "FilterGroup" && hasCheck(check2.checks, id2));
}
var number2 = /* @__PURE__ */ new Number5();
var Boolean = class extends ASTNodeImpl {
  _tag = "Boolean";
  /** @internal */
  getParser() {
    return fromRefinement(this, isBoolean);
  }
  /** @internal */
  getExpected() {
    return "boolean";
  }
};
var boolean = /* @__PURE__ */ new Boolean();
var Symbol2 = class extends ASTNodeImpl {
  _tag = "Symbol";
  /** @internal */
  getParser() {
    return fromRefinement(this, isSymbol);
  }
  /** @internal */
  matchKey(s, options3) {
    if (options3.disableChecks || !this.checks) return s;
    return collectIssues(this.checks, s, void 0, this, options3) ? void 0 : s;
  }
  /** @internal */
  toCodecStringTree() {
    return replaceEncoding(this, [symbolToString]);
  }
  /** @internal */
  getExpected() {
    return "symbol";
  }
};
var symbol3 = /* @__PURE__ */ new Symbol2();
var BigInt5 = class extends ASTNodeImpl {
  _tag = "BigInt";
  /** @internal */
  getParser() {
    return fromRefinement(this, isBigInt);
  }
  /** @internal */
  matchPart(s, options3) {
    if (!isStringBigIntRegExp.test(s)) return void 0;
    const value3 = globalThis.BigInt(s);
    if (options3.disableChecks || !this.checks) return value3;
    return collectIssues(this.checks, value3, void 0, this, options3) ? void 0 : value3;
  }
  /** @internal */
  toCodecStringTree() {
    return replaceEncoding(this, [bigIntToString]);
  }
  /** @internal */
  getExpected() {
    return "bigint";
  }
};
var bigInt = /* @__PURE__ */ new BigInt5();
var Arrays = class extends ASTNodeImpl {
  _tag = "Arrays";
  isMutable;
  elements;
  rest;
  encodingChecks;
  constructor(isMutable2, elements, rest, annotations, checks, encoding, context3, encodingChecks) {
    super(annotations, checks, encoding, context3);
    this.isMutable = isMutable2;
    this.elements = elements;
    this.rest = rest;
    this.encodingChecks = encodingChecks;
    let hasOptional = false;
    for (let i = 0; i < elements.length; i++) {
      if (isOptional(elements[i])) {
        hasOptional = true;
      } else if (hasOptional) {
        throw new Error("A required element cannot follow an optional element. ts(1257)");
      }
    }
    if (hasOptional && rest.length > 1) {
      throw new Error("A required element cannot follow an optional element. ts(1257)");
    }
    for (let i = 1; i < rest.length; i++) {
      if (isOptional(rest[i])) {
        throw new Error("An optional element cannot follow a rest element. ts(1266)");
      }
    }
  }
  /** @internal */
  getParser(compile2, compileField2 = compile2) {
    const ast = this;
    let elements;
    let rest;
    const elementLen = ast.elements.length;
    const tailLen = Math.max(0, ast.rest.length - 1);
    function getParser(tailThreshold, index2) {
      if (index2 < elementLen) {
        return elements[index2];
      } else if (index2 >= tailThreshold) {
        return rest[index2 - tailThreshold + 1];
      }
      return rest[0];
    }
    const finish = (state) => {
      const {
        input,
        len,
        options: options3
      } = state;
      if (ast.rest.length === 0 && len > elementLen) {
        for (let i = elementLen; i < len; i++) {
          const unexpected = new UnexpectedKey(ast, input[i], options3);
          const issue = new Pointer([i], unexpected);
          if (options3.errors === "all") {
            if (state.issues) state.issues.push(issue);
            else state.issues = [issue];
          } else {
            return fail6(new Composite(ast, [issue], input, options3));
          }
        }
      }
      if (state.issues) {
        return fail6(new Composite(ast, state.issues, input, options3));
      }
      return succeed7(state.output);
    };
    const parse3 = (input, options3) => {
      const len = input.length;
      const state = {
        ast,
        getParser,
        input,
        len,
        tailThreshold: Math.max(elementLen, len - tailLen),
        output: new globalThis.Array(len),
        issues: void 0,
        options: options3
      };
      const end = ast.rest.length === 0 ? elementLen : Math.max(len, elementLen + tailLen);
      const concurrency = options3.concurrency === void 0 ? 1 : resolveConcurrency(options3.concurrency);
      const eff = concurrency === 1 ? parseArray(state, input, 0, end) : parseArrayConcurrent(state, input, {
        concurrency,
        end
      });
      if (!eff) return finish(state);
      if (effectIsExit(eff)) return flatMapEager2(eff, () => finish(state));
      let first = true;
      return suspend3(() => {
        if (!first) return parse3(input, options3);
        first = false;
        return flatMap5(eff, () => finish(state));
      });
    };
    return (input, options3) => {
      if (input === missing) return missingExit;
      try {
        if (!Array.isArray(input)) {
          return fail6(new InvalidType(ast, input, options3));
        }
        if (!elements) {
          elements = ast.elements.map((ast2) => ({
            ast: ast2,
            parser: compileField2(ast2)
          }));
          rest = ast.rest.map((ast2) => ({
            ast: ast2,
            parser: compileField2(ast2)
          }));
        }
        return parse3(input, options3);
      } catch (error) {
        return die3(error);
      }
    };
  }
  _rebuild(recur2, checks, encodingChecks) {
    const elements = mapOrSame(this.elements, recur2);
    const rest = mapOrSame(this.rest, recur2);
    return elements === this.elements && rest === this.rest && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Arrays(this.isMutable, elements, rest, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  /** @internal */
  recur(recur2) {
    return this._rebuild(recur2, this.checks, this.encodingChecks);
  }
  /** @internal */
  flip(recur2) {
    return this._rebuild(recur2, this.encodingChecks, this.checks);
  }
  /** @internal */
  getExpected() {
    return "array";
  }
};
function stepArray(s, item, exit3, i) {
  if (exit3._tag === "Failure") {
    return wrapPropertyKeyIssue(s, s.ast, i, exit3);
  }
  const value3 = exit3 === sameExit ? item : exit3[args];
  if (value3 !== missing) {
    s.output[i] = value3;
  } else {
    const p = s.getParser(s.tailThreshold, i);
    if (isOptional(p.ast)) return;
    const issue = new Pointer([i], new MissingKey(p.ast.context?.annotations));
    if (s.options.errors === "all") {
      if (s.issues) s.issues.push(issue);
      else s.issues = [issue];
    } else {
      return fail5(new Composite(s.ast, [issue], s.input, s.options));
    }
  }
}
var parseArrayOptions = {
  onItem(s, item, i) {
    const value3 = i < s.len ? item : missing;
    return s.getParser(s.tailThreshold, i).parser(value3, s.options);
  },
  step: stepArray
};
var parseArray = /* @__PURE__ */ iterateEager()(parseArrayOptions);
var parseArrayConcurrent = /* @__PURE__ */ iterateConcurrent()(parseArrayOptions);
var wrapPropertyKeyIssue = (s, ast, key, exit3) => {
  if (exit3.cause.reasons.length === 0) {
    return exit3;
  }
  const issue = getSchemaIssue(exit3.cause);
  if (issue === void 0) {
    return failCause2(map6(exit3.cause, (issue2) => new Composite(ast, [new Pointer([key], issue2)], s.input, s.options)));
  }
  const pointer = new Pointer([key], issue);
  if (s.options.errors === "all") {
    if (s.issues) s.issues.push(pointer);
    else s.issues = [pointer];
  } else {
    return fail5(new Composite(ast, [pointer], s.input, s.options));
  }
};
var FINITE_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
function getIndexSignatureKeys(input, parameter, options3 = defaultParseOptions) {
  let stringKeys;
  let symbolKeys;
  function go(parameter2) {
    switch (parameter2._tag) {
      case "String":
      case "TemplateLiteral":
        return (stringKeys ??= Object.keys(input)).filter((k) => parameter2.matchPart(k, options3) !== void 0);
      case "Number":
        return (stringKeys ??= Object.keys(input)).filter((k) => parameter2.matchKey(k, options3) !== void 0);
      case "Symbol":
        return (symbolKeys ??= Object.getOwnPropertySymbols(input)).filter((k) => Object.prototype.propertyIsEnumerable.call(input, k) && parameter2.matchKey(k, options3) !== void 0);
      case "Union":
        return [...new Set(parameter2.types.flatMap(go))];
      default:
        return [];
    }
  }
  return go(parameterFromPropertyKey(toEncoded(parameter)));
}
var PropertySignature = class {
  name;
  type;
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
};
function isIndexSignatureParameterSide(ast) {
  switch (ast._tag) {
    case "String":
    case "Number":
    case "Symbol":
    case "TemplateLiteral":
      return true;
    case "Union":
      return ast.types.every(isIndexSignatureParameterSide);
    default:
      return false;
  }
}
function isIndexSignatureParameterEncodedSide(ast) {
  const encoded = getLastEncoding(ast);
  switch (encoded._tag) {
    case "String":
    case "Number":
    case "Symbol":
    case "TemplateLiteral":
      return true;
    case "Union":
      return encoded.types.every(isIndexSignatureParameterEncodedSide);
    default:
      return false;
  }
}
function isIndexSignatureParameter(ast) {
  return isIndexSignatureParameterSide(ast) && isIndexSignatureParameterEncodedSide(ast);
}
var IndexSignature = class {
  parameter;
  type;
  constructor(parameter, type) {
    if (!isIndexSignatureParameter(parameter)) {
      throw new Error(`Invalid index signature parameter ${parameter._tag}`);
    }
    this.parameter = parameter;
    this.type = type;
    if (isOptional(type) && !containsUndefined(type)) {
      throw new Error("Cannot use `Schema.optionalKey` with index signatures, use `Schema.optional` instead.");
    }
  }
};
var Objects = class extends ASTNodeImpl {
  _tag = "Objects";
  propertySignatures;
  indexSignatures;
  encodingChecks;
  constructor(propertySignatures, indexSignatures, annotations, checks, encoding, context3, encodingChecks) {
    super(annotations, checks, encoding, context3);
    this.propertySignatures = propertySignatures;
    this.indexSignatures = indexSignatures;
    this.encodingChecks = encodingChecks;
  }
  /** @internal */
  getParser(compile2, compileField2 = compile2) {
    const ast = this;
    const hasProperties = ast.propertySignatures.length;
    const indexCount = ast.indexSignatures.length;
    if (!hasProperties && !indexCount) {
      return fromRefinement(ast, isNotNullish);
    }
    let properties;
    let indexes;
    const compileMembers = () => {
      if (!properties) {
        properties = ast.propertySignatures.map((ps) => ({
          parser: compileField2(ps.type),
          name: ps.name,
          type: ps.type
        }));
        indexes = indexCount ? ast.indexSignatures.map((is3) => ({
          is: is3,
          parserKey: compile2(parameterFromPropertyKey(is3.parameter)),
          parserValue: compileField2(is3.type)
        })) : void 0;
      }
      return properties;
    };
    const makeFallback = () => {
      const expectedKeys = new Set(ast.propertySignatures.map((ps) => typeof ps.name === "number" ? globalThis.String(ps.name) : ps.name));
      const finishIndex = (s, key, k2, inputValue, exitValue) => {
        if (exitValue._tag === "Failure") {
          return wrapPropertyKeyIssue(s, ast, key, exitValue) ?? void_3;
        }
        const value3 = exitValue === sameExit ? inputValue : exitValue[args];
        if (k2 !== missing && value3 !== missing) {
          if (hasProperties && (expectedKeys.has(key) || expectedKeys.has(typeof k2 === "number" ? globalThis.String(k2) : k2))) return void_3;
          assignProperty(s.out, k2, value3);
        }
        return void_3;
      };
      const parseIndex = (s, key, index2, exitKey) => {
        if (!exitKey) {
          const eff = index2.parserKey(key, s.options);
          if (!effectIsExit(eff)) {
            return flatMap5(exit2(eff), (exit3) => parseIndex(s, key, index2, exit3));
          }
          exitKey = eff;
        }
        if (exitKey._tag === "Failure") {
          return wrapPropertyKeyIssue(s, ast, key, exitKey) ?? void_3;
        }
        const k2 = exitKey === sameExit ? key : exitKey[args];
        const inputValue = s.input[key];
        const result3 = index2.parserValue(inputValue, s.options);
        return effectIsExit(result3) ? finishIndex(s, key, k2, inputValue, result3) : flatMap5(exit2(result3), (exit3) => finishIndex(s, key, k2, inputValue, exit3));
      };
      const parseStringIndex = (s, key, index2) => {
        const inputValue = s.input[key];
        const result3 = index2.parserValue(inputValue, s.options);
        return effectIsExit(result3) ? finishIndex(s, key, key, inputValue, result3) : flatMap5(exit2(result3), (exit3) => finishIndex(s, key, key, inputValue, exit3));
      };
      const parseIndexes = indexCount ? iterateConcurrent()({
        onItem: (s, [key, index2]) => index2.is.parameter === string2 ? parseStringIndex(s, key, index2) : parseIndex(s, key, index2),
        step: (_s, _item, exit3) => exit3._tag === "Failure" ? exit3 : void 0
      }) : void 0;
      return fnUntracedEager2(function* (input, options3) {
        if (input === missing) {
          return missing;
        }
        if (!(typeof input === "object" && input !== null && !Array.isArray(input))) {
          return yield* fail6(new InvalidType(ast, input, options3));
        }
        compileMembers();
        const record2 = input;
        const out = {};
        const state = {
          ast,
          input: record2,
          out,
          issues: void 0,
          options: options3
        };
        const errorsAllOption = options3.errors === "all";
        const onExcessPropertyError = options3.onExcessProperty === "error";
        const concurrency = options3.concurrency === void 0 ? 1 : resolveConcurrency(options3.concurrency);
        const indexKeys = indexCount && onExcessPropertyError ? ast.indexSignatures.map((index2) => getIndexSignatureKeys(record2, index2.parameter, options3)) : void 0;
        if (onExcessPropertyError) {
          const coveredKeys = indexKeys ? new Set(expectedKeys) : expectedKeys;
          if (indexKeys) {
            for (const keys3 of indexKeys) {
              for (const key of keys3) coveredKeys.add(key);
            }
          }
          const inputKeys = Reflect.ownKeys(record2);
          for (let i = 0; i < inputKeys.length; i++) {
            const key = inputKeys[i];
            if (!coveredKeys.has(key) && Object.prototype.propertyIsEnumerable.call(record2, key)) {
              const unexpected = new UnexpectedKey(ast, record2[key], options3);
              const issue = new Pointer([key], unexpected);
              if (errorsAllOption) {
                if (state.issues) {
                  state.issues.push(issue);
                } else {
                  state.issues = [issue];
                }
                continue;
              } else {
                return yield* fail6(new Composite(ast, [issue], input, options3));
              }
            }
          }
        }
        if (hasProperties) {
          const eff = concurrency === 1 ? parseProperties(state, properties) : parsePropertiesConcurrent(state, properties, {
            concurrency
          });
          if (eff) yield* eff;
        }
        if (indexCount && concurrency === 1) {
          for (let i = 0; i < indexCount; i++) {
            const index2 = indexes[i];
            const parse3 = index2.is.parameter === string2 ? parseStringIndex : parseIndex;
            const keys3 = indexKeys?.[i] ?? (index2.is.parameter === string2 ? Object.keys(record2) : getIndexSignatureKeys(record2, index2.is.parameter, options3));
            for (let j = 0; j < keys3.length; j++) {
              const eff = parse3(state, keys3[j], index2);
              if (!effectIsExit(eff)) yield* eff;
              else if (eff._tag === "Failure") return yield* eff;
            }
          }
        } else if (parseIndexes) {
          const keyPairs = empty2();
          for (let i = 0; i < indexCount; i++) {
            const index2 = indexes[i];
            const keys3 = indexKeys?.[i] ?? (index2.is.parameter === string2 ? Object.keys(record2) : getIndexSignatureKeys(record2, index2.is.parameter, options3));
            for (let j = 0; j < keys3.length; j++) {
              keyPairs.push([keys3[j], index2]);
            }
          }
          const eff = parseIndexes(state, keyPairs, {
            concurrency
          });
          if (eff) yield* eff;
        }
        if (state.issues) {
          return yield* fail6(new Composite(ast, state.issues, input, options3));
        }
        return out;
      });
    };
    if (indexCount) return makeFallback();
    let fallback;
    const resume = (state, index2, pending) => {
      const property = properties[index2];
      return flatMap5(exit2(pending), (exit3) => {
        const terminal = stepProperty(state, property, exit3);
        if (terminal) return terminal;
        const done3 = () => succeed7(state.out);
        const eff = parseProperties(state, properties.slice(index2 + 1));
        return eff ? flatMapEager2(eff, done3) : done3();
      });
    };
    return (input, options3) => {
      if (input === missing) return missingExit;
      if (options3.errors === "all" || options3.onExcessProperty !== void 0 || options3.concurrency !== void 0 && resolveConcurrency(options3.concurrency) !== 1) {
        return (fallback ??= makeFallback())(input, options3);
      }
      if (!(typeof input === "object" && input !== null && !Array.isArray(input))) {
        return fail6(new InvalidType(ast, input, options3));
      }
      const props = compileMembers();
      const record2 = input;
      const out = {};
      const state = {
        ast,
        input: record2,
        out,
        issues: void 0,
        options: options3
      };
      try {
        for (let index2 = 0; index2 < props.length; index2++) {
          const property = props[index2];
          const name = property.name;
          const hasKey = hasPropertySignature(record2, name);
          const value3 = hasKey ? record2[name] : missing;
          const exit3 = property.parser(value3, options3);
          if (!effectIsExit(exit3)) {
            return resume(state, index2, exit3);
          }
          if (exit3 === sameExit) {
            if (hasKey) assignProperty(out, name, value3);
            continue;
          }
          const terminal = stepProperty(state, property, exit3);
          if (terminal) return terminal;
        }
      } catch (error) {
        return die3(error);
      }
      return succeed7(out);
    };
  }
  _rebuild(recur2, recurParameter, checks, encodingChecks) {
    const props = mapOrSame(this.propertySignatures, (ps) => {
      const t = recur2(ps.type);
      return t === ps.type ? ps : new PropertySignature(ps.name, t);
    });
    const indexes = mapOrSame(this.indexSignatures, (is3) => {
      const p = recurParameter(is3.parameter);
      const t = recur2(is3.type);
      return p === is3.parameter && t === is3.type ? is3 : new IndexSignature(p, t);
    });
    return props === this.propertySignatures && indexes === this.indexSignatures && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Objects(props, indexes, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  /** @internal */
  flip(recur2) {
    return this._rebuild(recur2, recur2, this.encodingChecks, this.checks);
  }
  /** @internal */
  recur(recur2, recurParameter = recur2) {
    return this._rebuild(recur2, recurParameter, this.checks, this.encodingChecks);
  }
  /** @internal */
  getExpected() {
    if (this.propertySignatures.length === 0 && this.indexSignatures.length === 0) return "object | array";
    return "object";
  }
};
function stepProperty(s, p, exit3) {
  if (exit3._tag === "Failure") {
    return wrapPropertyKeyIssue(s, s.ast, p.name, exit3);
  }
  if (exit3 === sameExit) return;
  const value3 = exit3[args];
  if (value3 !== missing) {
    assignProperty(s.out, p.name, value3);
    return;
  }
  delete s.out[p.name];
  if (!isOptional(p.type)) {
    const issue = new Pointer([p.name], new MissingKey(p.type.context?.annotations));
    if (s.options.errors === "all") {
      if (s.issues) s.issues.push(issue);
      else s.issues = [issue];
      return;
    } else {
      return fail5(new Composite(s.ast, [issue], s.input, s.options));
    }
  }
}
var parsePropertiesOptions = {
  onItem(s, p) {
    if (!hasPropertySignature(s.input, p.name)) {
      return p.parser(missing, s.options);
    }
    const value3 = s.input[p.name];
    assignProperty(s.out, p.name, value3);
    return p.parser(value3, s.options);
  },
  step: stepProperty
};
var parseProperties = /* @__PURE__ */ iterateEager()(parsePropertiesOptions);
var parsePropertiesConcurrent = /* @__PURE__ */ iterateConcurrent()(parsePropertiesOptions);
function combineChecks(a, b) {
  if (!a) return b;
  if (!b) return a;
  return [...a, ...b];
}
function struct(fields, checks, annotations) {
  return new Objects(Reflect.ownKeys(fields).map((key) => {
    return new PropertySignature(key, fields[key].ast);
  }), [], annotations, checks);
}
function getAST(self) {
  return self.ast;
}
function tuple(elements, checks = void 0) {
  return new Arrays(false, elements.map((e) => e.ast), [], void 0, checks);
}
function union4(members, options3, checks) {
  return new Union(members.map(getAST), options3, void 0, checks);
}
function structWithRest(ast, records) {
  if (ast.encoding || records.some((r) => r.encoding)) {
    throw new Error("StructWithRest does not support encodings");
  }
  let propertySignatures = ast.propertySignatures;
  let indexSignatures = ast.indexSignatures;
  let checks = ast.checks;
  for (const record2 of records) {
    for (const propertySignature of record2.propertySignatures) {
      if (propertySignatures.some((ps) => ps.name === propertySignature.name)) {
        throw new Error(`Duplicate identifier: ${JSON.stringify(propertySignature.name)}. ts(2300)`);
      }
    }
    propertySignatures = propertySignatures.concat(record2.propertySignatures);
    indexSignatures = indexSignatures.concat(record2.indexSignatures);
    checks = combineChecks(checks, record2.checks);
  }
  return new Objects(propertySignatures, indexSignatures, void 0, checks);
}
function tupleWithRest(ast, rest) {
  if (ast.encoding) {
    throw new Error("TupleWithRest does not support encodings");
  }
  return new Arrays(ast.isMutable, ast.elements, rest, void 0, ast.checks);
}
function mutable(ast) {
  if (ast.encoding) {
    throw new Error("mutable does not support encodings");
  }
  return new Arrays(true, ast.elements, ast.rest, ast.annotations, ast.checks, void 0, ast.context, ast.encodingChecks);
}
var toCandidate = /* @__PURE__ */ memoizeIdempotent((ast) => {
  while (true) {
    if (isSuspend(ast)) return unknown;
    const encoding = ast.encoding;
    if (!encoding) {
      return ast.recur?.(toCandidate, identity) ?? ast;
    }
    if (encoding.some((link4) => link4.transformation._tag === "Middleware" && link4.transformation.decode !== identity)) return unknown;
    ast = encoding[encoding.length - 1].to;
  }
});
function getCandidateTypes(ast) {
  switch (ast._tag) {
    case "Null":
      return ["null"];
    case "Undefined":
      return ["undefined"];
    case "String":
    case "TemplateLiteral":
      return ["string"];
    case "Number":
      return ["number"];
    case "Boolean":
      return ["boolean"];
    case "Symbol":
    case "UniqueSymbol":
      return ["symbol"];
    case "BigInt":
      return ["bigint"];
    case "Arrays":
      return ["array"];
    case "ObjectKeyword":
      return ["object", "array", "function"];
    case "Objects":
      return ast.propertySignatures.length || ast.indexSignatures.length ? ["object"] : ["string", "number", "boolean", "symbol", "bigint", "object", "array", "function"];
    case "Enum":
      return Array.from(new Set(ast.enums.map(([, v]) => typeof v)));
    case "Literal":
      return [typeof ast.literal];
    case "Union":
      return Array.from(new Set(ast.types.flatMap(getCandidateTypes)));
    default:
      return ["null", "undefined", "string", "number", "boolean", "symbol", "bigint", "object", "array", "function"];
  }
}
function collectSentinels(ast) {
  switch (ast._tag) {
    default:
      return [];
    case "Declaration": {
      const s = ast.annotations?.[SENTINELS_ANNOTATION_KEY];
      return Array.isArray(s) ? s : [];
    }
    case "Objects":
      return ast.propertySignatures.flatMap((ps) => {
        const type = ps.type;
        if (!isOptional(type)) {
          if (isLiteral(type)) {
            return [{
              key: ps.name,
              literal: type.literal
            }];
          }
          if (isUniqueSymbol(type)) {
            return [{
              key: ps.name,
              literal: type.symbol
            }];
          }
        }
        return [];
      });
    case "Arrays":
      return ast.elements.flatMap((e, i) => {
        if (!isOptional(e)) {
          if (isLiteral(e)) {
            return [{
              key: i,
              literal: e.literal
            }];
          }
          if (isUniqueSymbol(e)) {
            return [{
              key: i,
              literal: e.symbol
            }];
          }
        }
        return [];
      });
    case "Union": {
      if (ast.types.length === 0) return [];
      const members = ast.types.map((type) => collectSentinels(toCandidate(type)));
      return members[0].filter((s) => members.every((sentinels) => sentinels.some((o) => o.key === s.key && o.literal === s.literal)));
    }
    case "Suspend":
      return collectSentinels(ast.thunk());
  }
}
var candidateIndexCache = /* @__PURE__ */ new WeakMap();
var emptyCandidates = /* @__PURE__ */ Object.freeze([]);
var getRuntimeType = (input) => input === null ? "null" : Array.isArray(input) ? "array" : typeof input;
var hasPropertySignature = (input, key) => key === "__proto__" ? Object.hasOwn(input, key) : key in input;
function getCandidateIndex(types) {
  let index2 = candidateIndexCache.get(types);
  if (index2) return index2;
  let bySentinel;
  let sentinelCandidateCount = 0;
  let otherwise;
  let literalCandidates;
  let onlyLiterals = true;
  const literalOf = [];
  for (let i = 0; i < types.length; i++) {
    const a = types[i];
    const encoded = toCandidate(a);
    if (isNever2(encoded)) continue;
    if (isLiteral(encoded) || isUniqueSymbol(encoded)) {
      literalCandidates ??= /* @__PURE__ */ new Map();
      const literal = isLiteral(encoded) ? encoded.literal : encoded.symbol;
      literalOf[i] = literal;
      let arr = literalCandidates.get(literal);
      if (!arr) literalCandidates.set(literal, arr = []);
      arr.push(i);
    } else {
      onlyLiterals = false;
    }
    const sentinels = collectSentinels(encoded);
    if (sentinels.length) {
      bySentinel ??= /* @__PURE__ */ new Map();
      sentinelCandidateCount++;
      for (const {
        key,
        literal
      } of sentinels) {
        let entry = bySentinel.get(key);
        if (!entry) bySentinel.set(key, entry = [/* @__PURE__ */ new Map(), /* @__PURE__ */ new Set()]);
        entry[1].add(i);
        let indexes = entry[0].get(literal);
        if (!indexes) entry[0].set(literal, indexes = /* @__PURE__ */ new Set());
        indexes.add(i);
      }
    } else {
      otherwise ??= {};
      const candidateTypes = getCandidateTypes(encoded);
      for (const t of candidateTypes) (otherwise[t] ??= []).push(i);
    }
  }
  const fallbacks = {};
  const getFallback = (type) => fallbacks[type] ??= Object.freeze(otherwise?.[type] ?? emptyCandidates);
  if (onlyLiterals && literalCandidates) {
    literalCandidates.forEach(Object.freeze);
    index2 = (input) => literalCandidates.get(input) ?? emptyCandidates;
  } else if (bySentinel?.size === 1 && !otherwise) {
    const [key, [byValue]] = bySentinel.entries().next().value;
    const candidates = /* @__PURE__ */ new Map();
    for (const [literal, indexes] of byValue) {
      candidates.set(literal, Object.freeze(Array.from(indexes)));
    }
    const all6 = Object.freeze(types.map((_, i) => i));
    index2 = (input, isConstructor) => {
      if (isObjectKeyword(input)) {
        const value3 = hasPropertySignature(input, key) ? input[key] : void 0;
        if (value3 !== void 0) return candidates.get(value3) ?? emptyCandidates;
        if (isConstructor) return all6;
      }
      return emptyCandidates;
    };
  } else if (bySentinel) {
    let commonSentinel;
    for (const entry of bySentinel) {
      if ((!commonSentinel || entry[1][0].size > commonSentinel[1][0].size) && entry[1][1].size === sentinelCandidateCount) {
        commonSentinel = entry;
      }
    }
    index2 = (input, isConstructor) => {
      const runtimeType = getRuntimeType(input);
      if (!isObjectKeyword(input)) return getFallback(runtimeType);
      const selected = new Set(otherwise?.[runtimeType]);
      let directKey;
      if (commonSentinel) {
        const [key, [byValue]] = commonSentinel;
        const hasKey = hasPropertySignature(input, key);
        const value3 = hasKey ? input[key] : void 0;
        if (hasKey && (!isConstructor || value3 !== void 0)) {
          const match7 = byValue.get(value3);
          if (!match7) return getFallback(runtimeType);
          for (const i of match7) selected.add(i);
          directKey = key;
        }
      }
      if (directKey === void 0) {
        for (const [key, [byValue, all6]] of bySentinel) {
          const hasKey = hasPropertySignature(input, key);
          const value3 = hasKey ? input[key] : void 0;
          if (hasKey && (!isConstructor || value3 !== void 0)) {
            const match7 = byValue.get(value3);
            if (match7) {
              for (const i of match7) selected.add(i);
            }
          } else if (isConstructor) {
            for (const i of all6) selected.add(i);
          }
        }
      }
      for (const [key, [byValue, all6]] of bySentinel) {
        if (key === directKey) continue;
        const hasKey = hasPropertySignature(input, key);
        const value3 = hasKey ? input[key] : void 0;
        if (hasKey && (!isConstructor || value3 !== void 0)) {
          const match7 = byValue.get(value3);
          for (const i of selected) {
            if (all6.has(i) && !match7?.has(i)) selected.delete(i);
          }
        }
      }
      return Array.from(selected).sort((a, b) => a - b);
    };
  } else {
    index2 = (input) => {
      const fallback = getFallback(getRuntimeType(input));
      return literalCandidates ? fallback.filter((i) => literalOf[i] === void 0 || literalOf[i] === input) : fallback;
    };
  }
  candidateIndexCache.set(types, index2);
  return index2;
}
var Union = class extends ASTNodeImpl {
  _tag = "Union";
  types;
  options;
  encodingChecks;
  constructor(types, options3, annotations, checks, encoding, context3, encodingChecks) {
    super(annotations, checks, encoding, context3);
    this.types = types;
    this.options = options3;
    this.encodingChecks = encodingChecks;
  }
  /** @internal */
  getParser(compile2, compileField2) {
    const ast = this;
    const isConstructor = compileField2 !== void 0;
    const parsers = [];
    const parser = (i) => parsers[i] ??= compile2(ast.types[i]);
    let index2;
    return (input, options3) => {
      if (input === missing) {
        return missingExit;
      }
      const candidates = (index2 ??= getCandidateIndex(ast.types))(input, isConstructor);
      if (candidates.length === 0) {
        return fail6(new AnyOf(ast, [], input, options3));
      }
      if (candidates.length === 1) {
        const result3 = parser(candidates[0])(input, options3);
        if (result3._tag === "Success") return result3;
        return effectIsExit(result3) ? failSingleUnionCandidate(ast, result3.cause, input, options3) : catchSingleUnionCandidate(ast, result3, input, options3);
      }
      return parseUnionCandidates(ast, parser, candidates, input, options3);
    };
  }
  _rebuild(recur2, checks, encodingChecks) {
    const types = mapOrSame(this.types, recur2);
    return types === this.types && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Union(types, this.options, this.annotations, checks, void 0, this.context, encodingChecks);
  }
  /** @internal */
  recur(recur2) {
    return this._rebuild(recur2, this.checks, this.encodingChecks);
  }
  /** @internal */
  flip(recur2) {
    return this._rebuild(recur2, this.encodingChecks, this.checks);
  }
  /** @internal */
  matchPart(s, options3) {
    for (const type of this.types) {
      const out = type.matchPart(s, options3);
      if (out !== void 0) return out;
    }
    return void 0;
  }
  /** @internal */
  getExpected(getExpected2) {
    const expected = this.annotations?.expected;
    if (typeof expected === "string") return expected;
    if (this.types.length === 0) return "never";
    const types = this.types.map((type) => {
      const encoded = toEncoded(type);
      switch (encoded._tag) {
        case "Arrays": {
          const literals = encoded.elements.filter(isLiteral);
          if (literals.length > 0) {
            return `${formatIsMutable(encoded.isMutable)}[ ${literals.map((e) => getExpected2(e) + formatIsOptional(e.context?.isOptional)).join(", ")}, ... ]`;
          }
          break;
        }
        case "Objects": {
          const literals = encoded.propertySignatures.filter((ps) => isLiteral(ps.type));
          if (literals.length > 0) {
            return `{ ${literals.map((ps) => `${formatIsMutable(ps.type.context?.isMutable)}${formatPropertyKey(ps.name)}${formatIsOptional(ps.type.context?.isOptional)}: ${getExpected2(ps.type)}`).join(", ")}, ... }`;
          }
          break;
        }
      }
      return getExpected2(encoded);
    });
    return Array.from(new Set(types)).join(" | ");
  }
};
function failSingleUnionCandidate(ast, cause, input, options3) {
  const issue = getSchemaIssue(cause);
  if (!issue) return failCause2(cause);
  return fail5(new AnyOf(ast, [issue], input, options3));
}
function catchSingleUnionCandidate(ast, result3, input, options3) {
  return catchCause3(result3, (cause) => failSingleUnionCandidate(ast, cause, input, options3));
}
function parseUnionCandidates(ast, parser, candidates, input, options3) {
  const state = {
    ast,
    parser,
    input,
    out: void 0,
    successes: ast.options?.mode === "oneOf" ? [] : void 0,
    issues: void 0,
    options: options3
  };
  const eff = parseUnion(state, candidates);
  if (!eff) {
    if (state.out) return state.out;
    return fail6(new AnyOf(ast, state.issues ?? [], input, options3));
  }
  return resumeUnion(eff, state);
}
function resumeUnion(eff, state) {
  return flatMapEager2(eff, (_) => {
    if (state.out === sameExit) return succeed6(state.input);
    if (state.out) return state.out;
    return fail6(new AnyOf(state.ast, state.issues ?? [], state.input, state.options));
  });
}
var parseUnion = /* @__PURE__ */ iterateEager()({
  onItem(s, i) {
    return s.parser(i)(s.input, s.options);
  },
  step(s, i, exit3) {
    if (exit3._tag === "Failure") {
      const issue = getSchemaIssue(exit3.cause);
      if (issue === void 0) {
        return exit3;
      }
      if (s.issues) s.issues.push(issue);
      else s.issues = [issue];
    } else {
      if (s.out && s.successes) {
        s.successes.push(s.ast.types[i]);
        return fail5(new OneOf(s.ast, s.successes, s.input, s.options));
      }
      s.out = exit3;
      if (s.successes) {
        s.successes.push(s.ast.types[i]);
      } else {
        return void_3;
      }
    }
  }
});
var nonFiniteLiterals = /* @__PURE__ */ new Union([/* @__PURE__ */ new Literal("Infinity"), /* @__PURE__ */ new Literal("-Infinity"), /* @__PURE__ */ new Literal("NaN")]);
function formatIsMutable(isMutable2) {
  return isMutable2 ? "" : "readonly ";
}
function formatIsOptional(isOptional2) {
  return isOptional2 ? "?" : "";
}
var Suspend = class extends ASTNodeImpl {
  _tag = "Suspend";
  thunk;
  constructor(thunk, annotations, checks, encoding, context3) {
    if (checks) {
      throw new Error("Cannot add checks to Suspend");
    }
    super(annotations, void 0, encoding, context3);
    let ast;
    this.thunk = () => ast ??= thunk();
  }
  /** @internal */
  getParser(compile2) {
    let parser;
    return (input, options3) => (parser ??= compile2(this.thunk()))(input, options3);
  }
  /** @internal */
  recur(recur2) {
    return new Suspend(() => recur2(this.thunk()), this.annotations, void 0, void 0, this.context);
  }
  /** @internal */
  getExpected(getExpected2) {
    return getExpected2(this.thunk());
  }
};
var Filter2 = class extends Class {
  _tag = "Filter";
  run;
  annotations;
  /**
   * Whether the parsing process should be aborted after this check has failed.
   */
  aborted;
  constructor(run3, annotations = void 0, aborted = false) {
    super();
    this.run = run3;
    this.annotations = annotations;
    this.aborted = aborted;
  }
  annotate(annotations) {
    return new Filter2(this.run, {
      ...this.annotations,
      ...annotations
    }, this.aborted);
  }
  abort() {
    return new Filter2(this.run, this.annotations, true);
  }
  and(other, annotations) {
    return new FilterGroup([this, other], annotations);
  }
};
var FilterGroup = class extends Class {
  _tag = "FilterGroup";
  checks;
  annotations;
  constructor(checks, annotations = void 0) {
    super();
    this.checks = checks;
    this.annotations = annotations;
  }
  annotate(annotations) {
    return new FilterGroup(this.checks, {
      ...this.annotations,
      ...annotations
    });
  }
  and(other, annotations) {
    return new FilterGroup([this, other], annotations);
  }
};
function makeFilter(filter9, annotations, aborted = false) {
  return new Filter2((input, ast, options3) => normalizeFilterOutput(ast, filter9(input, ast, options3), input, options3), annotations, aborted);
}
function makeFilterByGuard(is3, annotations) {
  return new Filter2(
    (input, _ast, options3) => is3(input) ? void 0 : new InvalidValue(void 0, input, options3),
    annotations,
    true
    // after a guard, we always want to abort
  );
}
function isFinite2(annotations) {
  return makeFilter((n) => globalThis.Number.isFinite(n), {
    expected: "a finite number",
    representation: {
      id: "effect/schema/isFinite",
      payload: null
    },
    toJsonSchema: () => ({
      type: "number"
    }),
    toCode: () => ({
      runtime: "Schema.isFinite()"
    }),
    arbitraryConstraint: {
      number: "finite"
    },
    ...annotations
  });
}
var finite = /* @__PURE__ */ appendChecks(number2, [/* @__PURE__ */ isFinite2()]);
var numberToJson = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([finite, nonFiniteLiterals]), /* @__PURE__ */ new Transformation(/* @__PURE__ */ Number4(), /* @__PURE__ */ transform2((n) => globalThis.Number.isFinite(n) ? n : globalThis.String(n))));
function isPattern(regExp, annotations) {
  const copy4 = new globalThis.RegExp(regExp);
  const payload = {
    source: copy4.source,
    flags: copy4.flags
  };
  return makeFilter((s) => {
    copy4.lastIndex = 0;
    return copy4.test(s);
  }, {
    expected: `a string matching the RegExp ${payload.source}`,
    representation: {
      id: "effect/schema/isPattern",
      payload
    },
    // Keep the filter exportable so its JSON Schema annotations are preserved
    // when the RegExp constraint itself is omitted.
    toJsonSchema: () => [{}, true],
    arbitraryConstraint: {
      patterns: [payload]
    },
    ...annotations
  });
}
var bodyOwners = /* @__PURE__ */ new WeakMap();
function copy2(ast, changes) {
  const out = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, changes);
  if (Reflect.ownKeys(changes).every((key) => key === "context" || key === "encoding")) {
    bodyOwners.set(out, getContextOwner(ast));
  }
  return out;
}
function getContextOwner(ast) {
  const existing = bodyOwners.get(ast);
  if (existing !== void 0) return existing;
  if (ast.encoding === void 0) return ast;
  const owner = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, {
    encoding: void 0
  });
  bodyOwners.set(ast, owner);
  return owner;
}
function replaceEncoding(ast, encoding) {
  return ast.encoding === encoding ? ast : copy2(ast, {
    encoding
  });
}
function replaceContext(ast, context3) {
  if (ast.context === context3) {
    return ast;
  }
  const owner = getContextOwner(ast);
  if (owner.context === context3 && owner.encoding === ast.encoding) {
    return owner;
  }
  return copy2(ast, {
    context: context3
  });
}
function getLastEncoding(ast) {
  return ast.encoding ? getLastEncoding(ast.encoding[ast.encoding.length - 1].to) : ast;
}
function annotate(ast, annotations) {
  if (ast.checks) {
    const last = ast.checks[ast.checks.length - 1];
    return replaceChecks(ast, append(ast.checks.slice(0, -1), last.annotate(annotations)));
  }
  return copy2(ast, {
    annotations: {
      ...ast.annotations,
      ...annotations
    }
  });
}
function replaceChecks(ast, checks) {
  if (ast._tag === "Suspend" && checks) {
    throw new Error("Cannot add checks to Suspend");
  }
  if (ast.checks === checks) {
    return ast;
  }
  return copy2(ast, {
    checks
  });
}
function appendChecks(ast, checks) {
  return replaceChecks(ast, combineChecks(ast.checks, checks));
}
function mapLink(link4, f) {
  const to = f(link4.to);
  return to === link4.to ? link4 : new Link(to, link4.transformation);
}
function updateLastLink(encoding, f) {
  const links = encoding;
  const last = links[links.length - 1];
  const out = mapLink(last, f);
  return out === last ? encoding : append(encoding.slice(0, encoding.length - 1), out);
}
function applyToLastLink(f) {
  return (ast) => ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, f)) : ast;
}
function replaceContextLastLink(ast, context3) {
  return applyToLastLink((ast2) => replaceContext(ast2, context3))(ast);
}
function applyToSelfOrLastLinkEncoding(f) {
  function out(ast) {
    return ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, out)) : f(ast);
  }
  return memoize(out);
}
function applyToSelfOrLastLinkEncodingIdempotent(f, options3) {
  function out(ast) {
    if (ast.encoding) {
      const last = ast.encoding[ast.encoding.length - 1];
      return options3?.stopAt?.(last) ? ast : replaceEncoding(ast, updateLastLink(ast.encoding, out));
    }
    return f(ast);
  }
  return memoizeIdempotent(out);
}
function middlewareDecoding(ast, middleware) {
  return appendTransformation(ast, middleware, toType(ast));
}
function middlewareEncoding(ast, middleware) {
  return appendTransformation(toEncoded(ast), middleware, ast);
}
function appendTransformation(from, transformation, to) {
  const link4 = new Link(from, transformation);
  return replaceEncoding(to, to.encoding ? [...to.encoding, link4] : [link4]);
}
function mapOrSame(as4, f) {
  let out;
  for (let i = 0; i < as4.length; i++) {
    const a = as4[i];
    const fa = f(a);
    if (out) {
      out[i] = fa;
    } else if (fa !== a) {
      out = new Array(as4.length);
      for (let j = 0; j < i; j++) {
        out[j] = as4[j];
      }
      out[i] = fa;
    }
  }
  return out ?? as4;
}
function annotateKey(ast, annotations) {
  const context3 = ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, ast.context.constructorDefault, {
    ...ast.context.annotations,
    ...annotations
  }) : new Context(false, false, void 0, annotations);
  return replaceContext(ast, context3);
}
var optionalKey = /* @__PURE__ */ memoizeIdempotent((ast) => {
  const context3 = ast.context ? ast.context.isOptional === false ? new Context(true, ast.context.isMutable, ast.context.constructorDefault, ast.context.annotations) : ast.context : new Context(true, false);
  return optionalKeyLastLink(replaceContext(ast, context3));
});
var optionalKeyLastLink = /* @__PURE__ */ applyToLastLink(optionalKey);
var optional = /* @__PURE__ */ memoize((ast) => optionalKey(new Union([ast, undefined_3])));
var mutableKey = /* @__PURE__ */ memoizeIdempotent((ast) => {
  const context3 = ast.context ? ast.context.isMutable === false ? new Context(ast.context.isOptional, true, ast.context.constructorDefault, ast.context.annotations) : ast.context : new Context(false, true);
  return mutableKeyLastLink(replaceContext(ast, context3));
});
var mutableKeyLastLink = /* @__PURE__ */ applyToLastLink(mutableKey);
function withConstructorDefault(ast, defaultValue) {
  const context3 = ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, defaultValue, ast.context.annotations) : new Context(false, false, defaultValue);
  return replaceContext(ast, context3);
}
function decodeTo(from, to, transformation) {
  return appendTransformation(from, transformation, to);
}
function parseParameter(ast) {
  const literals = [];
  const parameters = [];
  function go(ast2) {
    switch (ast2._tag) {
      case "Literal":
        if (isPropertyKey(ast2.literal) && !literals.includes(ast2.literal)) {
          literals.push(ast2.literal);
        }
        return;
      case "UniqueSymbol":
        if (!literals.includes(ast2.symbol)) {
          literals.push(ast2.symbol);
        }
        return;
      case "Never":
        return;
      case "Union":
        for (let i = 0; i < ast2.types.length; i++) {
          go(ast2.types[i]);
        }
        return;
      default:
        parameters.push(ast2);
    }
  }
  go(ast);
  return {
    literals,
    parameters
  };
}
function record(key, value3) {
  const {
    literals,
    parameters: indexSignatures
  } = parseParameter(key);
  return new Objects(literals.map((literal) => new PropertySignature(literal, value3)), indexSignatures.map((parameter) => new IndexSignature(parameter, value3)));
}
function isOptional(ast) {
  return ast.context?.isOptional ?? false;
}
function isMutable(ast) {
  return ast.context?.isMutable ?? false;
}
function isStructuralCheck(check2) {
  return check2.annotations?.[STRUCTURAL_ANNOTATION_KEY] === true || check2._tag === "FilterGroup" && check2.checks.every(isStructuralCheck);
}
function extractStructuralChecks(checks) {
  function extract(check2) {
    if (isStructuralCheck(check2)) return [check2];
    return check2._tag === "FilterGroup" ? check2.checks.flatMap(extract) : [];
  }
  const out = checks.flatMap(extract);
  return isArrayNonEmpty2(out) ? out : void 0;
}
function canPreserveEncodingChecks(ast) {
  let preserve = true;
  function visit2(child) {
    preserve = preserve && !child.encoding && !isSuspend(child);
    if (preserve && "recur" in child) child.recur(visit2);
    return child;
  }
  if ("recur" in ast) ast.recur(visit2);
  return preserve;
}
var toType = /* @__PURE__ */ memoizeIdempotent((ast) => {
  const owner = getContextOwner(ast);
  if (owner !== ast) {
    const type2 = toType(owner);
    return type2 === owner && ast.encoding === void 0 ? ast : replaceContext(type2, ast.context);
  }
  const type = "recur" in ast ? ast.recur(toType) : ast;
  if ("encodingChecks" in type && type.encodingChecks) {
    const checks = canPreserveEncodingChecks(ast) ? type.encodingChecks : isArrays(type) || isObjects(type) || isDeclaration(type) && type.typeParameters.length > 0 ? extractStructuralChecks(type.encodingChecks) : void 0;
    return copy2(type, {
      encodingChecks: void 0,
      checks: combineChecks(type.checks, checks)
    });
  }
  return type;
});
var toEncoded = /* @__PURE__ */ memoizeIdempotent((ast) => {
  return toType(flip3(ast));
});
function flipEncoding(ast, encoding) {
  const links = encoding;
  const len = links.length;
  const last = links[len - 1];
  const ls = [new Link(flip3(replaceEncoding(ast, void 0)), links[0].transformation.flip())];
  for (let i = 1; i < len; i++) {
    ls.unshift(new Link(flip3(links[i - 1].to), links[i].transformation.flip()));
  }
  const to = flip3(last.to);
  if (to.encoding) {
    return replaceEncoding(to, [...to.encoding, ...ls]);
  } else {
    return replaceEncoding(to, ls);
  }
}
var flip3 = /* @__PURE__ */ memoize((ast) => {
  if (ast.encoding) {
    return flipEncoding(ast, ast.encoding);
  }
  const owner = getContextOwner(ast);
  if (owner !== ast) {
    const flipped = flip3(owner);
    return flipped === owner ? ast : replaceContext(flipped, ast.context);
  }
  return "flip" in ast ? ast.flip(flip3) : "recur" in ast ? ast.recur(flip3) : ast;
});
function containsUndefined(ast) {
  switch (ast._tag) {
    case "Undefined":
      return true;
    case "Union":
      return ast.types.some(containsUndefined);
    default:
      return false;
  }
}
function fromConst(ast, value3) {
  const succeed9 = value3 === 0 ? sameExit : succeed7(value3);
  return (input, options3) => {
    if (input === missing) return missingExit;
    if (input === value3) return succeed9;
    return fail6(new InvalidType(ast, input, options3));
  };
}
function fromRefinement(ast, refinement) {
  return (input, options3) => {
    if (input === missing) return missingExit;
    if (refinement(input)) return sameExit;
    return fail6(new InvalidType(ast, input, options3));
  };
}
function segmentTemplateLiteralParts(ast, input, options3) {
  const parts2 = ast.encodedParts;
  const literals = ast.literals;
  const inputLength = input.length;
  for (let i = 0; i < literals.length; i++) {
    const literal = literals[i];
    if (literal && !input.includes(literal)) return void 0;
  }
  if (ast.suffixLengths[0] > inputLength) return void 0;
  const out = new Array(parts2.length);
  let failures;
  function go(i, pos) {
    if (i === parts2.length) return pos === inputLength;
    if (failures?.has(i * (inputLength + 1) + pos)) return false;
    const part = parts2[i];
    if (i === parts2.length - 1) {
      const s = input.slice(pos);
      if (part.matchPart(s, options3) !== void 0) {
        out[i] = s;
        return true;
      }
    } else if (part._tag === "Literal") {
      const s = literals[i];
      if (input.startsWith(s, pos) && go(i + 1, pos + s.length)) {
        out[i] = s;
        return true;
      }
    } else {
      const maximumEnd = inputLength - ast.suffixLengths[i + 1];
      const anchor = literals[i + 1];
      let end = anchor === void 0 ? maximumEnd : input.lastIndexOf(anchor, maximumEnd);
      while (end >= pos) {
        const s = input.slice(pos, end);
        if (part.matchPart(s, options3) !== void 0 && go(i + 1, end)) {
          out[i] = s;
          return true;
        }
        if (end === 0) break;
        end = anchor === void 0 ? end - 1 : input.lastIndexOf(anchor, end - 1);
      }
    }
    failures ??= /* @__PURE__ */ new Set();
    failures.add(i * (inputLength + 1) + pos);
    return false;
  }
  return go(0, 0) ? out : void 0;
}
var parameterFromPropertyKey = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  switch (ast._tag) {
    default:
      return ast;
    case "Number":
      return ast.toCodecStringTree();
    case "Union":
      return ast.recur(parameterFromPropertyKey);
  }
});
var parameterFromString = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  switch (ast._tag) {
    default:
      return ast;
    case "Symbol":
    case "UniqueSymbol":
      return ast.toCodecStringTree();
    case "Union":
      return ast.recur(parameterFromString);
  }
});
var partFromString = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  switch (ast._tag) {
    default:
      return ast;
    case "Number":
    case "Literal":
    case "BigInt":
      return ast.toCodecStringTree();
    case "Union":
      return ast.recur(partFromString);
  }
});
var STRING_PATTERN = "[\\s\\S]*?";
var isStringFiniteRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${FINITE_PATTERN}$`);
var isStringNumberRegExp = /* @__PURE__ */ new globalThis.RegExp(`^(?:${FINITE_PATTERN}|Infinity|-Infinity|NaN)$`);
function isStringFinite(annotations) {
  return isPattern(isStringFiniteRegExp, {
    expected: "a string representing a finite number",
    representation: {
      id: "effect/schema/isStringFinite",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: isStringFiniteRegExp.source
    }),
    ...annotations
  });
}
var finiteString = /* @__PURE__ */ appendChecks(string2, [/* @__PURE__ */ isStringFinite()]);
var finiteToString = /* @__PURE__ */ new Link(finiteString, numberFromString);
var numberToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([finiteString, nonFiniteLiterals]), numberFromString);
var BIGINT_PATTERN = "-?\\d+";
var isStringBigIntRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${BIGINT_PATTERN}$`);
function isStringBigInt(annotations) {
  return isPattern(isStringBigIntRegExp, {
    expected: "a string representing a bigint",
    representation: {
      id: "effect/schema/isStringBigInt",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: isStringBigIntRegExp.source
    }),
    ...annotations
  });
}
var bigIntString = /* @__PURE__ */ appendChecks(string2, [/* @__PURE__ */ isStringBigInt({
  expected: "a string representing a bigint"
})]);
var bigIntToString = /* @__PURE__ */ new Link(bigIntString, bigintFromString);
var REGEXP_PATTERN = "Symbol\\(([\\s\\S]*)\\)";
var isStringSymbolRegExp = /* @__PURE__ */ new globalThis.RegExp(`^${REGEXP_PATTERN}$`);
var symbolString = /* @__PURE__ */ appendChecks(string2, [/* @__PURE__ */ isStringSymbol()]);
var symbolToString = /* @__PURE__ */ new Link(symbolString, /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform2((description) => globalThis.Symbol.for(isStringSymbolRegExp.exec(description)[1])), /* @__PURE__ */ transformEffect((sym, options3) => {
  const key = globalThis.Symbol.keyFor(sym);
  if (key !== void 0) {
    return succeed6(globalThis.String(sym));
  }
  return fail6(new Forbidden({
    message: "cannot serialize to string, Symbol is not registered"
  }, sym, options3));
})));
function isStringSymbol(annotations) {
  return isPattern(isStringSymbolRegExp, {
    expected: "a string representing a symbol",
    representation: {
      id: "effect/schema/isStringSymbol",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: isStringSymbolRegExp.source
    }),
    ...annotations
  });
}
function collectIssues(checks, value3, issues, ast, options3) {
  for (let i = 0; i < checks.length; i++) {
    const check2 = checks[i];
    if (check2._tag === "FilterGroup") {
      issues = collectIssues(check2.checks, value3, issues, ast, options3);
      if (issues && (options3.errors !== "all" || issues[issues.length - 1].filter.aborted)) {
        return issues;
      }
    } else {
      const issue = check2.run(value3, ast, options3);
      if (issue) {
        const filter9 = new Filter(check2, issue, value3, options3);
        if (issues) issues.push(filter9);
        else issues = [filter9];
        if (options3.errors !== "all" || check2.aborted) {
          return issues;
        }
      }
    }
  }
  return issues;
}
function runChecks(checks, s) {
  const issues = collectIssues(checks, s, void 0, unknown, {
    errors: "all"
  });
  if (issues) {
    const issue = new Composite(unknown, issues);
    return fail2(issue);
  }
  return succeed2(s);
}
function getConstructorDescriptor(ast) {
  if (!isDeclaration(ast)) return void 0;
  const getDescriptor = ast.annotations?.[CONSTRUCTOR_ANNOTATION_KEY];
  return isFunction(getDescriptor) ? getDescriptor(ast.typeParameters) : void 0;
}
function isJsonLeaf(u) {
  return u === null || typeof u === "string" || typeof u === "boolean" || typeof u === "number" && globalThis.Number.isFinite(u);
}
function isStringTreeLeaf(u) {
  return u === void 0 || typeof u === "string";
}
function isTree(u, isLeaf) {
  const cache2 = /* @__PURE__ */ new WeakMap();
  const stack = [];
  outer: while (true) {
    if (typeof u !== "object" || u === null) {
      if (!isLeaf(u)) {
        return false;
      }
    } else {
      const value3 = u;
      const cached3 = cache2.get(value3);
      if (cached3 === false) {
        return false;
      }
      if (cached3 === void 0) {
        const isArray2 = Array.isArray(value3);
        if (!isArray2) {
          const prototype = Object.getPrototypeOf(value3);
          if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
            return false;
          }
        }
        cache2.set(value3, false);
        stack.push({
          value: value3,
          keys: isArray2 ? value3.length : Object.keys(value3),
          index: 0
        });
      }
    }
    while (stack.length > 0) {
      const frame = stack[stack.length - 1];
      const keys3 = frame.keys;
      if (typeof keys3 === "number") {
        if (frame.index < keys3) {
          u = frame.value[frame.index++];
          continue outer;
        }
      } else if (frame.index < keys3.length) {
        u = frame.value[keys3[frame.index++]];
        continue outer;
      }
      cache2.set(frame.value, true);
      stack.pop();
    }
    return true;
  }
}
function isJson(u) {
  return isTree(u, isJsonLeaf);
}
var Json = /* @__PURE__ */ new Declaration([], () => (input, ast, options3) => isJson(input) ? sameExit : fail6(new InvalidType(ast, input, options3)), {
  representation: {
    id: "effect/schema/Json",
    payload: null
  },
  expected: "JSON value",
  toCodecJson: () => void 0,
  toCodecStringTree: () => unknownToStringTree
});
var MutableJson = /* @__PURE__ */ annotate(Json, {
  representation: {
    id: "effect/schema/MutableJson",
    payload: null
  }
});
var unknownToJson = /* @__PURE__ */ new Link(Json, /* @__PURE__ */ passthrough3());
var objectKeywordToJson = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([/* @__PURE__ */ new Arrays(false, [], [Json]), /* @__PURE__ */ new Objects([], [/* @__PURE__ */ new IndexSignature(string2, Json)])]), /* @__PURE__ */ passthrough3());
function isStringTree(u) {
  return isTree(u, isStringTreeLeaf);
}
var StringTree = /* @__PURE__ */ new Declaration([], () => (input, ast, options3) => isStringTree(input) ? sameExit : fail6(new InvalidType(ast, input, options3)), {
  expected: "StringTree",
  toCodecStringTree: () => void 0
});
var unknownToStringTree = /* @__PURE__ */ new Link(StringTree, /* @__PURE__ */ passthrough3());

// ../../node_modules/effect/dist/internal/schema/interpreter.js
var flatMapTransformation = (result3, current, f) => result3 === sameExit ? f(current) : flatMapEager2(result3, f);
function compileTransformation(transformation) {
  if (transformation._tag === "Middleware") {
    return (result3, current, options3) => {
      const transformed = result3 === sameExit ? transformation.decode(succeed7(toOption(current)), options3) : transformation.decode(mapEager2(result3, toOption), options3);
      return fromOptionalEffect(transformed);
    };
  }
  const getter = transformation.decode;
  switch (getter._tag) {
    case "Passthrough":
      return (result3, current) => result3 === sameExit ? succeed7(current) : result3;
    case "Transform": {
      const transform5 = (value3) => value3 === missing ? missingExit : succeed7(getter.transform(value3));
      return (result3, current) => flatMapTransformation(result3, current, transform5);
    }
    case "TransformOptional": {
      const transform5 = (value3) => fromOptionExit(getter.transform(toOption(value3)));
      return (result3, current) => flatMapTransformation(result3, current, transform5);
    }
    case "TransformEffect":
      return (result3, current, options3) => flatMapTransformation(result3, current, (value3) => value3 === missing ? missingExit : getter.transform(value3, options3));
    case "TransformOptionalEffect":
      return (result3, current, options3) => flatMapTransformation(result3, current, (value3) => fromOptionalEffect(getter.transform(toOption(value3), options3)));
  }
}
var fromOptionalEffect = (effect2) => flatMapEager2(effect2, fromOptionExit);
var wrapEncoding = (ast, input, options3, effect2) => catchCause3(effect2, (cause) => failCauseSync2(() => map6(cause, (issue) => new Encoding(ast, issue, input, options3))));
function makeConstructorParser(descriptor, compile2) {
  const transform5 = compileTransformation(descriptor.link.transformation);
  let sourceParser;
  return (input, options3) => {
    if (input === missing) return missingExit;
    if (descriptor.isConstructed(input)) return sameExit;
    const result3 = (sourceParser ??= compile2(descriptor.link.to))(input, options3);
    return transform5(result3, input, options3);
  };
}
function withDefault2(ast, parser) {
  const defaultValue = ast.context.constructorDefault;
  return (input, options3) => {
    if (input !== missing && input !== void 0) return parser(input, options3);
    const result3 = defaultValue;
    if (effectIsExit(result3) && result3._tag === "Success") {
      const local = parser(result3[args], options3);
      return local === sameExit ? result3 : local;
    }
    return flatMapEager2(wrapEncoding(ast, input, options3, result3), (value3) => {
      const local = parser(value3, options3);
      return local === sameExit ? succeed7(value3) : local;
    });
  };
}
function compileField(ast, compile2) {
  const parser = compile2(ast);
  return ast.context?.constructorDefault === void 0 ? parser : withDefault2(ast, parser);
}
function compile(ast, compile2, compileField2, base, specialize) {
  if (ast._tag === "Declaration") {
    for (const parameter of ast.typeParameters) compile2(parameter);
  }
  const descriptor = compileField2 ? getConstructorDescriptor(ast) : void 0;
  const parser = descriptor ? makeConstructorParser(descriptor, compile2) : base ?? ast.getParser(compile2, compileField2);
  const checks = ast.checks;
  const links = ast.encoding;
  const transformations = links?.map((link4) => compileTransformation(link4.transformation));
  const encodingChecks = ast.encodingChecks;
  if (!links && !checks && !encodingChecks) {
    return parser;
  }
  let encodingParsers;
  const parseChecks = (input, options3) => {
    let result3 = parser(input, options3);
    if (encodingChecks && !options3.disableChecks) {
      if (effectIsExit(result3)) {
        if (result3._tag === "Success") {
          const output = result3 === sameExit ? input : result3[args];
          if (input !== missing && output !== missing) {
            const issues = collectIssues(encodingChecks, input, void 0, ast, options3);
            if (issues) {
              result3 = fail6(new Composite(ast, issues, input, options3));
            }
          }
        }
      } else {
        result3 = flatMap5(result3, (value3) => {
          if (input !== missing && value3 !== missing) {
            const issues = collectIssues(encodingChecks, input, void 0, ast, options3);
            if (issues) {
              return fail6(new Composite(ast, issues, input, options3));
            }
          }
          return succeed6(value3);
        });
      }
    }
    if (checks && !options3.disableChecks) {
      if (effectIsExit(result3)) {
        if (result3._tag === "Success") {
          const value3 = result3 === sameExit ? input : result3[args];
          if (value3 === missing) return result3;
          const issues = collectIssues(checks, value3, void 0, ast, options3);
          if (issues) {
            result3 = fail6(new Composite(ast, issues, value3, options3));
          }
        }
      } else {
        result3 = flatMap5(result3, (value3) => {
          if (value3 !== missing) {
            const issues = collectIssues(checks, value3, void 0, ast, options3);
            if (issues) {
              return fail6(new Composite(ast, issues, value3, options3));
            }
          }
          return succeed6(value3);
        });
      }
    }
    return result3;
  };
  const parseLocal = specialize === void 0 ? parseChecks : specialize(parseChecks);
  if (!links) {
    return parseLocal;
  }
  return (input, options3) => {
    const parsers = encodingParsers ??= links.map((link4) => compile2(link4.to));
    let current = input;
    let result3 = parsers[parsers.length - 1](input, options3);
    for (let i = links.length - 1; i >= 0; i--) {
      result3 = transformations[i](result3, current, options3);
      if (i !== 0) {
        const next = parsers[i - 1];
        if (result3._tag === "Success") {
          current = result3[args];
          result3 = next(current, options3);
        } else {
          result3 = flatMapEager2(result3, (value3) => {
            const nextResult = next(value3, options3);
            return nextResult === sameExit ? succeed7(value3) : nextResult;
          });
        }
      }
    }
    if (result3._tag === "Success") {
      const value3 = result3[args];
      const local = parseLocal(value3, options3);
      return local === sameExit ? result3 : local;
    }
    result3 = wrapEncoding(ast, input, options3, result3);
    return flatMapEager2(result3, (value3) => {
      const local = parseLocal(value3, options3);
      return local === sameExit ? succeed7(value3) : local;
    });
  };
}

// ../../node_modules/effect/dist/internal/schema/compilerRegistry.js
var invalid3 = /* @__PURE__ */ Symbol();
var cache = /* @__PURE__ */ new WeakMap();
var compiler;
var compilerAdaptersEnabled = false;
var decodeChild = (ast) => compilerAdaptersEnabled ? lazyParser(resolve2, ast, "parser") : resolve2(ast).parser;
var makeChild = (ast) => compilerAdaptersEnabled ? lazyParser(resolve2, ast, "makeEffect") : resolve2(ast).makeEffect;
var makeField = (ast) => compileField(ast, makeChild);
var InterpretedEntry = class {
  ast;
  constructor(ast) {
    this.ast = ast;
  }
  get decodeEffect() {
    return this.cachedDecodeEffect ??= compile(this.ast, decodeChild);
  }
  get parser() {
    return this.decodeEffect;
  }
  get makeEffect() {
    return this.cachedMakeEffect ??= compile(this.ast, makeChild, makeField);
  }
};
var CompilerEntry = class extends InterpretedEntry {
  compiled;
  resolve;
  constructor(ast, compiled, resolve6) {
    super(ast);
    this.compiled = compiled;
    this.resolve = resolve6;
  }
  save(key, value3) {
    Object.defineProperty(this, key, {
      value: value3
    });
    return value3;
  }
  operation(key) {
    const compiled = this.compiled;
    return typeof compiled === "function" ? compiled(this.ast, this.resolve, key) : compiled?.[key];
  }
  get is() {
    return this.save("is", this.operation("is"));
  }
  get decode() {
    return this.save("decode", this.operation("decode"));
  }
  get make() {
    return this.save("make", this.operation("make"));
  }
  get decodeEffect() {
    return this.save("decodeEffect", this.operation("decodeEffect") ?? compile(this.ast, (ast) => lazyParser(this.resolve, ast, "parser")));
  }
  get parser() {
    const decode5 = this.decode;
    return decode5 === void 0 ? this.decodeEffect : this.save("parser", withDecode(decode5, () => this.decodeEffect));
  }
  get makeEffect() {
    const makeEffect2 = this.operation("makeEffect");
    if (makeEffect2 !== void 0) return this.save("makeEffect", makeEffect2);
    const child = (ast) => lazyParser(this.resolve, ast, "makeEffect");
    return this.save("makeEffect", compile(this.ast, child, (ast) => compileField(ast, child)));
  }
};
function withDecode(fastDecode, decodeEffect3) {
  let detailed;
  return (input, options3) => {
    if (input !== missing) {
      try {
        const value3 = fastDecode(input, options3);
        if (value3 !== invalid3) return value3 === input ? sameExit : succeed7(value3);
      } catch (error) {
        return die3(error);
      }
    }
    return (detailed ??= decodeEffect3())(input, options3);
  };
}
function lazyParser(resolve6, ast, operation2) {
  const entry = resolve6(ast);
  if (entry.compiled === void 0 || Object.hasOwn(entry, operation2)) {
    return entry[operation2];
  }
  let parser;
  return (input, options3) => (parser ??= entry[operation2])(input, options3);
}
function resolve2(ast) {
  const cached3 = cache.get(ast);
  if (cached3 !== void 0) return cached3;
  const entry = compiler === void 0 ? new InterpretedEntry(ast) : new CompilerEntry(ast, compiler(ast, resolve2), resolve2);
  cache.set(ast, entry);
  return entry;
}

// ../../node_modules/effect/dist/SchemaParser.js
function makeEffect(schema2) {
  const ast = schema2.ast;
  let parser;
  return (input, options3) => {
    return (parser ??= runWithCompiler(constructorCompiler, toType(ast)))(input, options3?.disableChecks ? options3?.parseOptions ? {
      ...options3.parseOptions,
      disableChecks: true
    } : {
      disableChecks: true
    } : options3?.parseOptions);
  };
}
function makeOption(schema2) {
  const parser = makeEffect(schema2);
  return (input, options3) => {
    const exit3 = runSyncExit2(parser(input, options3));
    if (isSuccess4(exit3)) {
      return some2(exit3.value);
    }
    getSchemaIssueOrThrow(exit3.cause, "Option adapter can only return none for schema issues");
    return none2();
  };
}
function make18(schema2) {
  return makeConstructorSync(toType(schema2.ast));
}
function is(schema2) {
  return _is(schema2.ast);
}
function makeIs(ast) {
  if (!compilerAdaptersEnabled) {
    const parser2 = asExit(run(ast));
    return (input) => {
      const exit3 = parser2(input, defaultParseOptions);
      if (isSuccess4(exit3)) return true;
      getSchemaIssueOrThrow(exit3.cause, "Type guard adapter can only return false for schema issues");
      return false;
    };
  }
  const entry = resolve2(ast);
  const guard = entry.is;
  if (guard !== void 0) {
    return (input) => {
      try {
        return guard(input, defaultParseOptions);
      } catch (error) {
        getSchemaIssueOrThrow(die2(error), "Type guard adapter can only return false for schema issues");
        return false;
      }
    };
  }
  const parser = entry.parser;
  return (input) => {
    const exit3 = runSyncExit2(parserResult(parser(input, defaultParseOptions), input));
    if (isSuccess4(exit3)) return true;
    getSchemaIssueOrThrow(exit3.cause, "Type guard adapter can only return false for schema issues");
    return false;
  };
}
function _is(ast) {
  const typeAST = toType(ast);
  let guard = (input) => {
    guard = makeIs(typeAST);
    return guard(input);
  };
  return (input) => {
    return guard(input);
  };
}
function _issue(ast) {
  const parser = run(ast);
  return (input, options3) => {
    const exit3 = runSyncExit2(parser(input, options3));
    if (isSuccess4(exit3)) {
      return void 0;
    }
    return getSchemaIssueOrThrow(exit3.cause, "Issue adapter can only return schema issues");
  };
}
function asserts(schema2, input) {
  const ast = toType(schema2.ast);
  const result3 = resolve2(ast).parser(input, defaultParseOptions);
  const exit3 = runSyncExit2(parserResult(result3, input));
  if (isFailure4(exit3)) {
    const issue = getSchemaIssueOrThrow(exit3.cause, "Assertion adapter can only throw schema issues");
    throw new Error("Schema validation failed", {
      cause: issue
    });
  }
}
function decodeUnknownEffect(schema2, options3) {
  const parser = run(schema2.ast);
  return options3 === void 0 ? parser : (input, overrideOptions) => parser(input, mergeParseOptions(options3, overrideOptions));
}
var decodeEffect = decodeUnknownEffect;
function decodeUnknownExit(schema2, options3) {
  return asExit(decodeUnknownEffect(schema2, options3));
}
function decodeUnknownOption(schema2, options3) {
  return asOption(decodeUnknownEffect(schema2, options3));
}
var decodeOption = decodeUnknownOption;
function decodeUnknownResult(schema2, options3) {
  return asResult(decodeUnknownEffect(schema2, options3));
}
function decodeUnknownSync(schema2, options3) {
  return compilerAdaptersEnabled ? makeSync(schema2.ast, options3) : asSync(decodeUnknownEffect(schema2, options3));
}
var decodeSync = decodeUnknownSync;
function encodeUnknownEffect(schema2, options3) {
  const parser = run(flip3(schema2.ast));
  return options3 === void 0 ? parser : (input, overrideOptions) => parser(input, mergeParseOptions(options3, overrideOptions));
}
var encodeEffect = encodeUnknownEffect;
function encodeUnknownExit(schema2, options3) {
  return asExit(encodeUnknownEffect(schema2, options3));
}
function encodeUnknownOption(schema2, options3) {
  return asOption(encodeUnknownEffect(schema2, options3));
}
var encodeOption = encodeUnknownOption;
function encodeUnknownResult(schema2, options3) {
  return asResult(encodeUnknownEffect(schema2, options3));
}
function encodeUnknownSync(schema2, options3) {
  return compilerAdaptersEnabled ? makeSync(flip3(schema2.ast), options3) : asSync(encodeUnknownEffect(schema2, options3));
}
var encodeSync = encodeUnknownSync;
var mergeParseOptions = (options3, overrideOptions) => overrideOptions ? {
  ...options3,
  ...overrideOptions
} : options3;
var getValue = (value3) => {
  if (value3 === missing) {
    return fail6(new InvalidValue());
  }
  return succeed6(value3);
};
function run(ast) {
  return runWithCompiler(normalCompiler, ast);
}
function parserResult(result3, input) {
  if (result3 === sameExit) {
    return succeed6(input);
  }
  if (!effectIsExit(result3)) {
    return flatMapEager2(result3, getValue);
  }
  return result3[args] === missing ? getValue(missing) : result3;
}
function runWithCompiler(compiler2, ast) {
  let parser;
  return (input, options3) => {
    const result3 = (parser ??= compiler2(ast))(input, options3 ?? defaultParseOptions);
    if (result3 === sameExit) {
      return succeed6(input);
    }
    if (!effectIsExit(result3)) {
      return flatMapEager2(result3, getValue);
    }
    return result3[args] === missing ? getValue(missing) : result3;
  };
}
function asExit(parser) {
  return (input, options3) => runSyncExit2(parser(input, options3));
}
function asOption(parser) {
  const parserExit = asExit(parser);
  return (input, options3) => {
    const exit3 = parserExit(input, options3);
    if (isSuccess4(exit3)) {
      return some2(exit3.value);
    }
    getSchemaIssueOrThrow(exit3.cause, "Option adapter can only return none for schema issues");
    return none2();
  };
}
function asResult(parser) {
  const parserExit = asExit(parser);
  return (input, options3) => {
    const exit3 = parserExit(input, options3);
    if (isSuccess4(exit3)) {
      return succeed2(exit3.value);
    }
    return fail2(getSchemaIssueOrThrow(exit3.cause, "Result adapter can only return schema issues"));
  };
}
function makeSync(ast, options3) {
  let run3;
  return (input, overrideOptions) => (run3 ??= makeSyncEntry(resolve2(ast), options3))(input, overrideOptions);
}
function makeSyncEntry(entry, options3) {
  const decode5 = entry.decode;
  let detailed;
  const run3 = decode5 === void 0 ? (input, parseOptions = defaultParseOptions) => (detailed ??= makeDetailedSync(entry))(input, parseOptions) : (input, parseOptions = defaultParseOptions) => {
    if (input === missing) {
      return (detailed ??= makeDetailedSync(entry))(input, parseOptions);
    }
    let output;
    try {
      output = decode5(input, parseOptions);
    } catch (error) {
      getSchemaIssueOrThrow(die2(error), "Sync adapter can only throw schema issues");
      throw error;
    }
    if (output !== invalid3) return output;
    return (detailed ??= makeDetailedSync(entry))(input, parseOptions);
  };
  return options3 === void 0 ? run3 : (input, overrideOptions) => run3(input, mergeParseOptions(options3, overrideOptions));
}
function makeDetailedSync(entry) {
  return asSync(runWithCompiler(() => entry.decodeEffect, entry.ast));
}
function asSync(parser) {
  const parserExit = asExit(parser);
  return (input, options3) => {
    const exit3 = parserExit(input, options3);
    if (isSuccess4(exit3)) {
      return exit3.value;
    }
    const issue = getSchemaIssueOrThrow(exit3.cause, "Sync adapter can only throw schema issues");
    throw new Error("Schema validation failed", {
      cause: issue
    });
  };
}
function runSync3(effect2, message) {
  const exit3 = runSyncExit2(effect2);
  if (isSuccess4(exit3)) {
    return exit3.value;
  }
  const issue = getSchemaIssueOrThrow(exit3.cause, message);
  throw new Error("Schema validation failed", {
    cause: issue
  });
}
function makeConstructorSync(ast) {
  let entry;
  let parser;
  return (input, options3) => {
    entry ??= resolve2(ast);
    const parseOptions = options3?.disableChecks ? options3.parseOptions ? {
      ...options3.parseOptions,
      disableChecks: true
    } : {
      disableChecks: true
    } : options3?.parseOptions ?? defaultParseOptions;
    const make33 = entry.make;
    if (make33 !== void 0 && input !== missing) {
      let output;
      try {
        output = make33(input, parseOptions);
      } catch (error) {
        getSchemaIssueOrThrow(die2(error), "Constructor adapter can only throw schema issues");
        throw error;
      }
      if (output !== invalid3 && output !== missing) return output;
    }
    const result3 = (parser ??= entry.makeEffect)(input, parseOptions);
    return runSync3(parserResult(result3, input), "Constructor adapter can only throw schema issues");
  };
}
var normalCompiler = (ast) => resolve2(ast).parser;
var constructorCompiler = (ast) => resolve2(ast).makeEffect;

// ../../node_modules/effect/dist/internal/schema/make.js
var TypeId23 = "~effect/Schema/Schema";
var RebuildOptions = /* @__PURE__ */ Symbol();
var SchemaProto = {
  [TypeId23]: TypeId23,
  get make() {
    const value3 = make18(this);
    Object.defineProperty(this, "make", {
      value: value3,
      enumerable: true
    });
    return value3;
  },
  get makeEffect() {
    const value3 = makeEffect(this);
    Object.defineProperty(this, "makeEffect", {
      value: value3,
      enumerable: true
    });
    return value3;
  },
  get makeOption() {
    const value3 = makeOption(this);
    Object.defineProperty(this, "makeOption", {
      value: value3,
      enumerable: true
    });
    return value3;
  },
  pipe() {
    return pipeArguments(this, arguments);
  },
  annotate(annotations) {
    return this.rebuild(annotate(this.ast, annotations));
  },
  annotateKey(annotations) {
    return this.rebuild(annotateKey(this.ast, annotations));
  },
  check(...checks) {
    return this.rebuild(appendChecks(this.ast, checks));
  },
  rebuild(ast) {
    return make19(ast, this[RebuildOptions]);
  }
};
function make19(ast, options3) {
  function Schema() {
  }
  const self = Object.setPrototypeOf(Schema, SchemaProto);
  if (options3 && (Object.hasOwn(options3, "name") || Object.hasOwn(options3, "length") || Object.hasOwn(options3, "__proto__"))) {
    Object.defineProperties(self, Object.getOwnPropertyDescriptors({
      ...options3
    }));
  } else {
    Object.assign(self, options3);
  }
  self[RebuildOptions] = options3;
  self.ast = ast;
  return self;
}

// ../../node_modules/effect/dist/JsonPointer.js
function escapeToken(token) {
  return token.replace(/~/g, "~0").replace(/\//g, "~1");
}
function unescapeToken(token) {
  return token.replace(/~1/g, "/").replace(/~0/g, "~");
}
function formatUriFragmentToken(token) {
  return encodeURI(escapeToken(token)).replace(/#/g, "%23");
}
function decodeUriFragment(fragment) {
  if (fragment.length === 0 || fragment === "#") return "";
  if (!fragment.startsWith("#")) return void 0;
  const encoded = fragment.slice(1);
  try {
    if (encodeURI(encoded).replace(/%25/g, "%").replace(/#/g, "%23") !== encoded) return void 0;
    const pointer = decodeURIComponent(encoded);
    return pointer.startsWith("/") && !/~(?:[^01]|$)/.test(pointer) ? pointer : void 0;
  } catch {
    return void 0;
  }
}
function parseUriFragment(fragment) {
  const pointer = decodeUriFragment(fragment);
  return pointer === void 0 ? void 0 : pointer.length === 0 ? [] : pointer.slice(1).split("/").map(unescapeToken);
}
function formatUriFragment(path) {
  return path.reduce((fragment, token) => `${fragment}/${formatUriFragmentToken(token)}`, "#");
}

// ../../node_modules/effect/dist/JsonSchema.js
var META_SCHEMA_URI_DRAFT_07 = "http://json-schema.org/draft-07/schema#";
var META_SCHEMA_URI_DRAFT_2020_12 = "https://json-schema.org/draft/2020-12/schema";
function isMetaSchemaUri(value3, uri) {
  return value3 === uri || value3 === (uri.endsWith("#") ? uri.slice(0, -1) : `${uri}#`);
}
function toDocumentDraft07(document) {
  return {
    dialect: "draft-07",
    ...convertDocument(document, draft07Adapter)
  };
}
function transformSchema(node, transform5) {
  return walk(node, false, true);
  function walk(node2, inheritedResource, isRoot = false) {
    if (!isObject(node2)) return node2;
    const inEmbeddedResource = inheritedResource || !isRoot && createsResource(node2.$id);
    const out = {};
    for (const key of Object.keys(node2)) {
      const value3 = node2[key];
      let transformed = value3;
      switch (key) {
        case "$defs":
        case "properties":
        case "patternProperties":
        case "dependentSchemas":
          transformed = mapObject(value3, (value4) => walk(value4, inEmbeddedResource)) ?? value3;
          break;
        case "allOf":
        case "anyOf":
        case "oneOf":
        case "prefixItems":
          transformed = Array.isArray(value3) ? value3.map((value4) => walk(value4, inEmbeddedResource)) : value3;
          break;
        case "not":
        case "additionalProperties":
        case "propertyNames":
        case "unevaluatedProperties":
        case "items":
        case "contains":
        case "unevaluatedItems":
        case "if":
        case "then":
        case "else":
        case "contentSchema":
          transformed = walk(value3, inEmbeddedResource);
      }
      assignProperty(out, key, transformed);
    }
    transform5(out, inEmbeddedResource);
    return out;
  }
}
function rewriteRefs(schema2, rewrite) {
  return transformSchema(schema2, (schema3) => {
    rewriteSchemaRef(schema3, rewrite);
  });
}
function rewriteSchemaRef(schema2, rewrite) {
  if (typeof schema2.$ref === "string") {
    assignProperty(schema2, "$ref", rewrite(schema2.$ref, "$ref"));
  }
  if (typeof schema2.$dynamicRef === "string") {
    assignProperty(schema2, "$dynamicRef", rewrite(schema2.$dynamicRef, "$dynamicRef"));
  }
}
function mapObject(value3, f) {
  if (!isObject(value3)) return void 0;
  const out = {};
  for (const key of Object.keys(value3)) {
    assignProperty(out, key, f(value3[key], key));
  }
  return out;
}
function runConverter(adapter, options3, use) {
  const locations = /* @__PURE__ */ new Map();
  const references = [];
  let rootUri = ROOT_URI;
  function convert(root, sourcePath = [], targetPath = []) {
    if (sourcePath.length === 0 && options3?.trackIds) {
      const id2 = isObject(root) ? getResourceId(root) : void 0;
      rootUri = resolveResourceUri(id2, ROOT_URI) ?? ROOT_URI;
    }
    return loop(root, sourcePath, targetPath, {
      sourceRoot: [],
      targetRoot: [],
      uri: rootUri
    });
  }
  function finish() {
    for (const [out2, value3, sourceResource] of references) {
      let reference = value3;
      const resolved = resolveUrl(value3, sourceResource);
      if (resolved !== void 0) {
        const sourcePointer = parseUriFragment(resolved.hash);
        resolved.hash = "";
        if (sourcePointer !== void 0) {
          const targetPath = locations.get(locationKey(resolved.href, sourcePointer));
          if (targetPath !== void 0) reference = relocateReference(value3, targetPath);
        }
      }
      assignProperty(out2, "$ref", reference);
    }
  }
  const out = use(convert);
  finish();
  return out;
  function loop(node, sourcePath, targetPath, resourceScope) {
    if (typeof node === "boolean") {
      recordLocations(sourcePath, targetPath, resourceScope);
      return options3?.booleanAdapter?.(node) ?? node;
    }
    if (!isObject(node)) return node;
    let currentResourceScope = resourceScope;
    const id2 = getResourceId(node);
    if (sourcePath.length > 0 && options3?.trackIds && createsResource(id2)) {
      const uri = resolveResourceUri(id2, resourceScope.uri);
      if (uri !== void 0) {
        currentResourceScope = {
          parent: resourceScope,
          sourceRoot: sourcePath,
          targetRoot: targetPath,
          uri
        };
      }
    }
    recordLocations(sourcePath, targetPath, currentResourceScope);
    const currentResource = currentResourceScope.uri;
    const context3 = {
      isDocumentRoot: sourcePath.length === 0,
      schema(value3, sourceKey, targetKey = sourceKey) {
        return loop(value3, [...sourcePath, sourceKey], [...targetPath, targetKey], currentResourceScope);
      },
      schemaAt(value3, sourceSuffix, targetSuffix) {
        return loop(value3, [...sourcePath, ...sourceSuffix], [...targetPath, ...targetSuffix], currentResourceScope);
      },
      schemaArray(value3, sourceKey, targetKey = sourceKey) {
        return Array.isArray(value3) ? value3.map((item, index2) => loop(item, [...sourcePath, sourceKey, String(index2)], [...targetPath, targetKey, String(index2)], currentResourceScope)) : value3;
      },
      schemaMap(value3, sourceKey, targetKey = sourceKey) {
        if (!isObject(value3)) return value3;
        return mapObject(value3, (item, key) => loop(item, [...sourcePath, sourceKey, key], [...targetPath, targetKey, key], currentResourceScope));
      },
      reference(out2, value3) {
        if (typeof value3 === "string") {
          references.push([out2, value3, currentResource]);
        } else {
          assignProperty(out2, "$ref", value3);
        }
      }
    };
    return adapter(node, context3);
  }
  function getResourceId(schema2) {
    return options3?.ignoreRefSiblings === true && typeof schema2.$ref === "string" ? void 0 : schema2.$id;
  }
  function recordLocations(sourcePath, targetPath, scope3) {
    if (scope3.parent !== void 0) recordLocations(sourcePath, targetPath, scope3.parent);
    locations.set(locationKey(scope3.uri, sourcePath.slice(scope3.sourceRoot.length)), targetPath.slice(scope3.targetRoot.length));
  }
}
var ROOT_URI = "https://effect.invalid/.json-schema/";
function resolveUrl(value3, base) {
  return URL.canParse(value3, base) ? new URL(value3, base) : void 0;
}
function resolveResourceUri(value3, base) {
  if (typeof value3 !== "string") return void 0;
  const url = resolveUrl(value3, base);
  if (url === void 0) return void 0;
  url.hash = "";
  return url.href;
}
function relocateReference(reference, targetPath) {
  const index2 = reference.indexOf("#");
  if (index2 === -1 && targetPath.length === 0) return reference;
  const uri = index2 === -1 ? reference : reference.slice(0, index2);
  return `${uri}${formatUriFragment(targetPath)}`;
}
function locationKey(resource, pointer) {
  return `${resource}\0${JSON.stringify(pointer)}`;
}
function createsResource(id2) {
  return typeof id2 === "string" && id2.length > 0 && id2[0] !== "#";
}
function convertDocument(document, adapter, options3) {
  return runConverter(adapter, {
    ...options3,
    trackIds: true
  }, (convert) => ({
    schema: convert(document.schema),
    definitions: mapObject(document.definitions, (definition, key) => convert(definition, ["$defs", key], ["definitions", key]))
  }));
}
var SCHEMA_MAP_KEYWORDS = /* @__PURE__ */ new Set(["properties", "patternProperties"]);
var SCHEMA_ARRAY_KEYWORDS = /* @__PURE__ */ new Set(["allOf", "anyOf", "oneOf"]);
var JSON_SCHEMA_SINGLE_KEYWORDS = /* @__PURE__ */ new Set(["not", "additionalProperties", "propertyNames", "contains", "if", "then", "else", "contentSchema"]);
function convertSubschemaKeyword(out, key, value3, context3, singleKeywords, mapKeywords = SCHEMA_MAP_KEYWORDS) {
  let converted;
  if (mapKeywords.has(key)) converted = context3.schemaMap(value3, key);
  else if (SCHEMA_ARRAY_KEYWORDS.has(key)) converted = context3.schemaArray(value3, key);
  else if (singleKeywords.has(key)) converted = context3.schema(value3, key);
  else return false;
  assignProperty(out, key, converted);
  return true;
}
var PRE_2020_TO_2020_COLLISIONS = ["$anchor", "$defs", "$dynamicAnchor", "$dynamicRef", "$vocabulary", "contentSchema", "dependentRequired", "dependentSchemas", "maxContains", "minContains", "prefixItems", "unevaluatedItems", "unevaluatedProperties"];
var DRAFT_07_TO_2020_COLLISIONS = [...PRE_2020_TO_2020_COLLISIONS, "deprecated"];
var OPEN_API_30_TO_2020_COLLISIONS = [...PRE_2020_TO_2020_COLLISIONS, "$comment", "$id", "$schema", "const", "contains", "contentEncoding", "contentMediaType", "else", "examples", "if", "patternProperties", "propertyNames", "then"];
var ANCHOR_REGEXP = /^[A-Za-z_][-A-Za-z0-9._]*$/;
var LEGACY_ID_FRAGMENT_REGEXP = /^[A-Za-z][-A-Za-z0-9._:]*$/;
function unsupported(keyword, dialect, details) {
  throw new Error(`Cannot convert JSON Schema keyword "${keyword}" to ${dialect}: ${details}`);
}
function rejectKeywordCollisions(source, keywords, targetDialect, sourceDialect) {
  for (const keyword of keywords) {
    if (Object.hasOwn(source, keyword)) {
      unsupported(keyword, targetDialect, `it is not active in ${sourceDialect} but would become active in the target`);
    }
  }
}
var DRAFT_07_TARGET_COLLISIONS = ["additionalItems", "definitions", "dependencies"];
function convertMetaSchemaKeyword(out, value3, context3, targetUri, targetDialect) {
  if (context3.isDocumentRoot) {
    assignProperty(out, "$schema", isMetaSchemaUri(value3, META_SCHEMA_URI_DRAFT_2020_12) ? targetUri : value3);
  } else if (!isMetaSchemaUri(value3, META_SCHEMA_URI_DRAFT_2020_12)) {
    unsupported("$schema", targetDialect, "an embedded resource cannot declare a different dialect");
  }
}
function draft07Adapter(source, context3) {
  rejectKeywordCollisions(source, DRAFT_07_TARGET_COLLISIONS, "Draft-07", "Draft 2020-12");
  const out = {};
  let reference = void 0;
  let prefixItems = void 0;
  let items = void 0;
  for (const key of Object.keys(source)) {
    const value3 = source[key];
    if (convertSubschemaKeyword(out, key, value3, context3, JSON_SCHEMA_SINGLE_KEYWORDS)) continue;
    switch (key) {
      case "$ref":
        reference = value3;
        break;
      case "$schema":
        convertMetaSchemaKeyword(out, value3, context3, META_SCHEMA_URI_DRAFT_07, "Draft-07");
        break;
      case "$id":
      case "$anchor":
        break;
      case "$defs":
        assignProperty(out, "definitions", context3.schemaMap(value3, key, "definitions"));
        break;
      case "prefixItems":
        prefixItems = value3;
        break;
      case "items":
        items = value3;
        break;
      case "dependentRequired":
      case "dependentSchemas":
      case "minContains":
      case "maxContains":
        break;
      case "$dynamicRef":
      case "$dynamicAnchor":
      case "$vocabulary":
      case "unevaluatedProperties":
      case "unevaluatedItems":
        unsupported(key, "Draft-07", "the target dialect has no equivalent");
      case "required":
        if (Array.isArray(value3) && value3.length === 0) break;
        assignProperty(out, key, value3);
        break;
      default:
        assignProperty(out, key, value3);
    }
  }
  convertTuple(out, prefixItems, items, context3);
  if (Object.hasOwn(source, "contains")) {
    const minContains = source.minContains;
    const maxContains = source.maxContains;
    if (minContains !== void 0 && minContains !== 1 || maxContains !== void 0) {
      unsupported("minContains/maxContains", "Draft-07", "contains cardinality cannot be represented");
    }
    if (Object.hasOwn(source, "minContains")) assignProperty(out, "minContains", minContains);
  } else {
    if (Object.hasOwn(source, "minContains")) assignProperty(out, "minContains", source.minContains);
    if (Object.hasOwn(source, "maxContains")) assignProperty(out, "maxContains", source.maxContains);
  }
  convertDependencies(source, out, context3, "draft-07");
  convertLegacyId(source, out, "$id", "Draft-07");
  convertReference(out, reference, context3);
  return out;
}
function convertTuple(out, prefixItems, items, context3) {
  if (prefixItems === void 0) {
    if (items !== void 0) assignProperty(out, "items", context3.schema(items, "items"));
    return;
  }
  assignProperty(out, "items", context3.schemaArray(prefixItems, "prefixItems", "items"));
  if (items !== void 0) {
    assignProperty(out, "additionalItems", context3.schema(items, "items", "additionalItems"));
  }
}
function convertReference(out, reference, context3) {
  if (reference === void 0) return;
  if (typeof reference === "string" && Object.keys(out).length > 0) {
    const referenceSchema = {};
    context3.reference(referenceSchema, reference);
    appendAllOf(out, referenceSchema);
  } else {
    context3.reference(out, reference);
  }
}
function convertDependencies(source, out, context3, targetDialect) {
  const dependentRequired = isObject(source.dependentRequired) ? source.dependentRequired : void 0;
  const dependentSchemas = isObject(source.dependentSchemas) ? source.dependentSchemas : void 0;
  if (dependentRequired === void 0 && dependentSchemas === void 0) return;
  const dependencies = {};
  const keys3 = /* @__PURE__ */ new Set([...Object.keys(dependentRequired ?? {}), ...Object.keys(dependentSchemas ?? {})]);
  for (const key of keys3) {
    const required2 = dependentRequired?.[key];
    const dependency = dependentSchemas?.[key];
    const omitRequired = targetDialect === "draft-04" && Array.isArray(required2) && required2.length === 0;
    if (dependency === void 0) {
      if (!omitRequired) assignProperty(dependencies, key, required2);
    } else if (required2 === void 0 || omitRequired) {
      assignProperty(dependencies, key, context3.schemaAt(dependency, ["dependentSchemas", key], ["dependencies", key]));
    } else {
      assignProperty(dependencies, key, {
        allOf: [context3.schemaAt(dependency, ["dependentSchemas", key], ["dependencies", key, "allOf", "0"]), {
          required: required2
        }]
      });
    }
  }
  if (Object.keys(dependencies).length > 0) assignProperty(out, "dependencies", dependencies);
}
function appendAllOf(out, schema2) {
  if (Array.isArray(out.allOf)) out.allOf.push(schema2);
  else assignProperty(out, "allOf", [schema2]);
}
function convertLegacyId(source, out, targetKey, dialect) {
  const id2 = source.$id;
  const anchor = source.$anchor;
  if (anchor === void 0) {
    if (id2 !== void 0) assignProperty(out, targetKey, id2);
    return;
  }
  if (typeof anchor !== "string" || !ANCHOR_REGEXP.test(anchor)) {
    unsupported("$anchor", dialect, "the anchor is not valid");
  }
  if (!LEGACY_ID_FRAGMENT_REGEXP.test(anchor)) {
    unsupported("$anchor", dialect, "the anchor cannot be represented as a plain-name fragment identifier");
  }
  if (id2 === void 0) {
    assignProperty(out, targetKey, `#${anchor}`);
  } else {
    unsupported("$anchor", dialect, "it cannot be combined with the schema $id");
  }
}

// ../../node_modules/effect/dist/internal/schema/toCodec.js
function toCodecJson(schema2) {
  return make19(toCodecJsonAST(schema2.ast), {
    schema: schema2
  });
}
var toCodecJsonAST = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  const out = toCodecJsonASTStep(ast, toCodecJsonAST);
  const context3 = ast.context;
  if (out === ast || context3 === void 0) return out;
  return replaceContextLastLink(out, withoutConstructorDefault(context3));
});
function withoutConstructorDefault(context3) {
  return context3.constructorDefault === void 0 ? context3 : new Context(context3.isOptional, context3.isMutable, void 0, context3.annotations);
}
function validateCanonicalObjectPropertyNames(ast) {
  if (ast.propertySignatures.some((ps) => typeof ps.name !== "string")) {
    throw new globalThis.Error("Objects property names must be strings", {
      cause: ast
    });
  }
}
function makeReorder(getPriority) {
  return (types) => {
    const sortedTypes = [...types].sort((a, b) => getPriority(toEncoded(a)) - getPriority(toEncoded(b)));
    const orderChanged = sortedTypes.some((ast, index2) => ast !== types[index2]);
    if (!orderChanged) return types;
    return sortedTypes;
  };
}
var toCodecJsonReorder = /* @__PURE__ */ makeReorder((ast) => {
  switch (ast._tag) {
    case "BigInt":
    case "Symbol":
    case "UniqueSymbol":
      return 0;
    default:
      return 1;
  }
});
function toCodecJsonASTStep(ast, recur2) {
  switch (ast._tag) {
    case "Declaration": {
      const getLink = ast.annotations?.toCodecJson ?? ast.annotations?.toCodec;
      if (!isFunction(getLink)) {
        return replaceEncoding(ast, [unknownToJson]);
      }
      const typeParameters = ast.typeParameters.map((tp) => make19(toEncoded(tp)));
      const link4 = getLink(typeParameters);
      return link4 === void 0 ? ast : replaceEncoding(ast, [mapLink(link4, recur2)]);
    }
    case "Unknown":
      return replaceEncoding(ast, [unknownToJson]);
    case "ObjectKeyword":
      return replaceEncoding(ast, [objectKeywordToJson]);
    case "Undefined":
    case "Void":
    case "Literal":
    case "Number":
      return ast.toCodecJson();
    case "UniqueSymbol":
    case "Symbol":
    case "BigInt":
      return ast.toCodecStringTree();
    case "Objects": {
      validateCanonicalObjectPropertyNames(ast);
      return ast.recur(recur2, parameterFromString);
    }
    case "Union": {
      const sortedTypes = toCodecJsonReorder(ast.types);
      if (sortedTypes !== ast.types) {
        return new Union(sortedTypes, ast.options, ast.annotations, ast.checks, ast.encoding, ast.context, ast.encodingChecks).recur(recur2);
      }
      return ast.recur(recur2);
    }
    case "Arrays":
    case "Suspend":
      return ast.recur(recur2);
  }
  return ast;
}
function toCodecIso(schema2) {
  return make19(toCodecIsoAST(toType(schema2.ast)));
}
var toCodecIsoAST = /* @__PURE__ */ memoize((ast) => {
  const out = toCodecIsoASTStep(ast, toCodecIsoAST);
  return out !== ast && ast.context !== void 0 ? replaceContextLastLink(out, withoutConstructorDefault(ast.context)) : out;
});
function toCodecIsoASTStep(ast, recur2) {
  switch (ast._tag) {
    case "Declaration": {
      const getLink = ast.annotations?.toCodecIso ?? ast.annotations?.toCodec;
      if (isFunction(getLink)) {
        const link4 = getLink(ast.typeParameters.map((tp) => make19(tp)));
        return replaceEncoding(ast, [mapLink(link4, recur2)]);
      }
      return ast;
    }
    case "Arrays":
    case "Objects":
    case "Union":
    case "Suspend":
      return ast.recur(recur2);
  }
  return ast;
}
function toCodecStringTree(schema2) {
  return make19(toCodecStringTreeAST(schema2.ast), {
    schema: schema2
  });
}
function toCodecArrayFromSingle(schema2) {
  return make19(toCodecArrayFromSingleAST(schema2.ast));
}
var toStringTreeReorder = /* @__PURE__ */ makeReorder((ast) => {
  switch (ast._tag) {
    case "Null":
    case "Boolean":
    case "Number":
    case "BigInt":
    case "Symbol":
    case "UniqueSymbol":
      return 0;
    default:
      return 1;
  }
});
function toCodecStringTreeASTStep(ast, recur2, onMissingAnnotation) {
  switch (ast._tag) {
    case "Declaration": {
      const typeParameters = ast.typeParameters.map((tp) => make19(recur2(toEncoded(tp))));
      const getStringTreeLink = ast.annotations?.toCodecStringTree;
      if (isFunction(getStringTreeLink)) {
        const link5 = getStringTreeLink(typeParameters);
        if (link5 === void 0) return ast;
        return replaceEncoding(ast, [mapLink(link5, recur2)]);
      }
      const getJsonLink = ast.annotations?.toCodecJson;
      const jsonLink = isFunction(getJsonLink) ? getJsonLink(typeParameters) : void 0;
      const getLink = jsonLink === void 0 ? ast.annotations?.toCodec : void 0;
      const link4 = jsonLink ?? (isFunction(getLink) ? getLink(typeParameters) : void 0);
      return link4 === void 0 ? onMissingAnnotation(ast) : replaceEncoding(ast, [mapLink(link4, recur2)]);
    }
    case "Null":
      return replaceEncoding(ast, [nullToString]);
    case "Boolean":
      return replaceEncoding(ast, [booleanToString]);
    case "Unknown":
    case "ObjectKeyword":
      return replaceEncoding(ast, [unknownToStringTree]);
    case "Enum":
    case "Number":
    case "Literal":
    case "UniqueSymbol":
    case "Symbol":
    case "BigInt":
      return ast.toCodecStringTree();
    case "Objects": {
      validateCanonicalObjectPropertyNames(ast);
      return ast.recur(recur2, parameterFromString);
    }
    case "Union": {
      const sortedTypes = toStringTreeReorder(ast.types);
      if (sortedTypes !== ast.types) {
        return new Union(sortedTypes, ast.options, ast.annotations, ast.checks, ast.encoding, ast.context, ast.encodingChecks).recur(recur2);
      }
      return ast.recur(recur2);
    }
    case "Arrays":
    case "Suspend":
      return ast.recur(recur2);
  }
  return ast;
}
var nullToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Literal("null"), /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform2(() => null), /* @__PURE__ */ transform2(() => "null")));
var booleanToString = /* @__PURE__ */ new Link(/* @__PURE__ */ new Union([/* @__PURE__ */ new Literal("true"), /* @__PURE__ */ new Literal("false")]), /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform2((s) => s === "true"), /* @__PURE__ */ String4()));
var arrayFromSingleTransformation = /* @__PURE__ */ new Transformation(/* @__PURE__ */ transform2((input) => typeof input === "string" ? [input] : input), /* @__PURE__ */ passthrough2());
var isCodecArrayFromSingleLink = (link4) => link4.transformation === arrayFromSingleTransformation;
var toCodecStringTreeAST = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  const out = toCodecStringTreeASTStep(ast, toCodecStringTreeAST, (ast2) => {
    throw new globalThis.Error("Missing structural codec for StringTree", {
      cause: ast2
    });
  });
  if (out !== ast && ast.context !== void 0) {
    return replaceContextLastLink(out, withoutConstructorDefault(ast.context));
  }
  return out;
}, {
  stopAt: isCodecArrayFromSingleLink
});
var toArrayFromSingleInputElement = (ast) => isOptional(ast) ? optionalKey(unknown) : unknown;
var toCodecArrayFromSingleAST = /* @__PURE__ */ applyToSelfOrLastLinkEncodingIdempotent((ast) => {
  const out = toCodecArrayFromSingleASTStep(ast);
  if (isArrays(out)) {
    const ensure = decodeTo(new Union([new Arrays(out.isMutable, out.elements.map(toArrayFromSingleInputElement), out.rest.map(toArrayFromSingleInputElement)), string2], {
      mode: "anyOf"
    }), out, arrayFromSingleTransformation);
    return isOptional(ast) ? optionalKey(ensure) : ensure;
  }
  return out;
}, {
  stopAt: isCodecArrayFromSingleLink
});
function toCodecArrayFromSingleASTStep(ast) {
  return ast._tag === "Declaration" || ast._tag === "Arrays" || ast._tag === "Objects" || ast._tag === "Union" || ast._tag === "Suspend" ? ast.recur(toCodecArrayFromSingleAST) : ast;
}

// ../../node_modules/effect/dist/RegExp.js
var RegExp2 = globalThis.RegExp;
var escape = (string3) => string3.replace(/[/\\^$*+?.()|[\]{}]/g, "\\$&");

// ../../node_modules/effect/dist/internal/errors.js
function errorWithPath(message, path) {
  if (path.length > 0) {
    message += `
  at ${formatPath(path)}`;
  }
  return new Error(message);
}

// ../../node_modules/effect/dist/internal/schema/toJsonSchemaDocument.js
function formatDefinitionReference(key) {
  return `#/$defs/${formatUriFragmentToken(key)}`;
}
var jsonSchemaAnnotationExcludedKeys = /* @__PURE__ */ new Set([...annotationExcludedKeys, IDENTIFIER_FALLBACK_KEY, ...jsonSchemaAnnotationKeys]);
function collectJsonSchemaAnnotations(annotations, options3) {
  if (annotations === void 0) return void 0;
  const out = {};
  const title = annotations.title;
  if (typeof title === "string") out.title = title;
  const description = annotations.description;
  const expected = annotations.expected;
  if (typeof description === "string") out.description = description;
  else if (options3?.generateDescriptions === true && typeof expected === "string") out.description = expected;
  const defaultValue = annotations.default;
  if (isJson(defaultValue)) out.default = defaultValue;
  const examples = annotations.examples;
  if (Array.isArray(examples) && isJson(examples)) out.examples = examples;
  const readOnly = annotations.readOnly;
  if (typeof readOnly === "boolean") out.readOnly = readOnly;
  const writeOnly = annotations.writeOnly;
  if (typeof writeOnly === "boolean") out.writeOnly = writeOnly;
  const format9 = annotations.format;
  if (typeof format9 === "string") out.format = format9;
  const contentEncoding = annotations.contentEncoding;
  if (typeof contentEncoding === "string") out.contentEncoding = contentEncoding;
  const contentMediaType = annotations.contentMediaType;
  if (typeof contentMediaType === "string") out.contentMediaType = contentMediaType;
  const contentSchema = annotations.contentSchema;
  if (isJson(contentSchema)) out.contentSchema = contentSchema;
  if (options3?.includeAnnotationKey !== void 0) {
    for (const [key, value3] of Object.entries(annotations)) {
      if (jsonSchemaAnnotationExcludedKeys.has(key) || !options3.includeAnnotationKey(key)) {
        continue;
      }
      if (isJson(value3)) assignProperty(out, key, value3);
    }
  }
  return Object.keys(out).length === 0 ? void 0 : out;
}
function extractJsonSchemaNumberType(schema2) {
  let type = schema2.type === "number" || schema2.type === "integer" ? schema2.type : void 0;
  let out = schema2;
  if (type !== void 0) {
    out = {
      ...schema2
    };
    delete out.type;
  }
  if (Array.isArray(out.allOf)) {
    const members = [];
    let changed = false;
    for (const member of out.allOf) {
      const extracted = extractJsonSchemaNumberType(member);
      if (extracted.type !== void 0) {
        changed = true;
        if (type === void 0 || extracted.type === "integer") type = extracted.type;
      }
      if (Object.keys(extracted.schema).length > 0) members.push(extracted.schema);
    }
    if (changed) {
      const {
        allOf: _,
        ...rest
      } = out;
      out = members.length === 0 ? rest : {
        ...rest,
        allOf: members
      };
    }
  }
  return {
    type,
    schema: out
  };
}
function isJsonSchemaNumberEncoding(schema2) {
  if (!Array.isArray(schema2.anyOf) || schema2.anyOf.length !== 2 || schema2.anyOf[0]?.type !== "number") return false;
  const special = schema2.anyOf[1];
  return special?.type === "string" && Array.isArray(special.enum) && special.enum.length === 3 && special.enum.includes("NaN") && special.enum.includes("Infinity") && special.enum.includes("-Infinity");
}
var inlineableCheckKeywords = "|type|format|pattern|multipleOf|minimum|maximum|exclusiveMinimum|exclusiveMaximum|minLength|maxLength|minItems|maxItems|uniqueItems|minProperties|maxProperties|propertyNames|";
function hasOnlyKeywords(schema2, allowed) {
  return Object.keys(schema2).every((key) => allowed.includes(`|${key}|`));
}
function hasNoCollisions(left, rightKeys) {
  return typeof left.$ref !== "string" && rightKeys.every((key) => !Object.hasOwn(left, key));
}
var promotableAnnotationKeywords = "|title|description|default|examples|readOnly|writeOnly|";
var inlineableAnnotatedCheckKeywords = inlineableCheckKeywords + promotableAnnotationKeywords;
function appendJsonSchema(left, right, inlineCheck) {
  if (Object.keys(left).length === 0) return right;
  const rightKeys = Object.keys(right);
  if (rightKeys.length === 0) return left;
  const leftType = left.type === "number" || left.type === "integer" ? left.type : void 0;
  const isNumberEncoding = isJsonSchemaNumberEncoding(left);
  if (leftType !== void 0 || isNumberEncoding) {
    const extracted = extractJsonSchemaNumberType(right);
    if (extracted.type !== void 0) {
      const type = leftType === "integer" || extracted.type === "integer" ? "integer" : "number";
      const base = {
        ...left,
        type
      };
      if (isNumberEncoding) delete base.anyOf;
      const extractedKeys = Object.keys(extracted.schema);
      if (extractedKeys.length === 0) return base;
      return hasOnlyKeywords(extracted.schema, promotableAnnotationKeywords) && hasNoCollisions(base, extractedKeys) ? {
        ...base,
        ...extracted.schema
      } : appendJsonSchema(base, extracted.schema, inlineCheck);
    }
  }
  if (inlineCheck && hasNoCollisions(left, rightKeys)) {
    return {
      ...left,
      ...right
    };
  }
  const members = Array.isArray(right.allOf) && rightKeys.length === 1 ? right.allOf : [right];
  if (Array.isArray(left.allOf)) {
    return {
      ...left,
      allOf: [...left.allOf, ...members]
    };
  }
  if (typeof left.$ref === "string") {
    return {
      allOf: [left, ...members]
    };
  }
  return {
    ...left,
    allOf: members
  };
}
function isExact(exactness, seen = /* @__PURE__ */ new Set()) {
  if (typeof exactness === "boolean") return exactness;
  if (seen.has(exactness)) return true;
  seen.add(exactness);
  return exactness.every((dependency) => isExact(dependency, seen));
}
function isApproximateCheckOutput(output) {
  return Array.isArray(output);
}
function compileJsonSchema(representations, rootPaths, references, options3) {
  const compiledDefinitions = /* @__PURE__ */ new Map();
  const definitionAliases = /* @__PURE__ */ new Map();
  const compiledRepresentations = /* @__PURE__ */ new WeakMap();
  const pendingOneOf = /* @__PURE__ */ new Map();
  const fallbackDefinitions = /* @__PURE__ */ new Map();
  const referenceKeys = Object.keys(references);
  for (const key of referenceKeys) {
    compileDefinition(key, ["references", key]);
  }
  const compiledSchemas = map4(representations, (representation, index2) => recur2(representation, rootPaths[index2], []));
  for (const [branches, schemas2] of pendingOneOf.values()) {
    if (!isExact(branches)) {
      for (const schema2 of schemas2) {
        if (Array.isArray(schema2.oneOf)) {
          schema2.anyOf = schema2.oneOf;
          delete schema2.oneOf;
        }
      }
    }
  }
  for (const key of referenceKeys) {
    const representation = references[key];
    const fallback = getIdentifierFallback(representation);
    if (fallback === void 0) continue;
    const schema2 = compiledDefinitions.get(key)[0];
    const candidates = fallbackDefinitions.get(fallback);
    const match7 = candidates?.find((candidate) => equals(compiledDefinitions.get(candidate)[0], schema2));
    if (match7 === void 0) {
      if (candidates === void 0) fallbackDefinitions.set(fallback, [key]);
      else candidates.push(key);
    } else {
      definitionAliases.set(key, match7);
    }
  }
  const schemas = map4(compiledSchemas, finalizeJsonSchema);
  const definitions = {};
  for (const key of referenceKeys) {
    if (!definitionAliases.has(key)) {
      assignProperty(definitions, key, finalizeJsonSchema(compiledDefinitions.get(key)[0]));
    }
  }
  return {
    dialect: "draft-2020-12",
    schemas,
    definitions
  };
  function registerPendingOneOf(schema2) {
    if (Array.isArray(schema2.oneOf)) pendingOneOf.get(schema2.oneOf)?.[1].push(schema2);
    return schema2;
  }
  function compileDefinition(key, path) {
    if (!Object.hasOwn(references, key)) {
      throw errorWithPath(`Invalid reference ${key}`, [...path, "$ref"]);
    }
    const cached3 = compiledDefinitions.get(key);
    if (cached3 !== void 0) return cached3;
    const result3 = [{}, []];
    compiledDefinitions.set(key, result3);
    result3[0] = recur2(references[key], ["references", key], result3[1]);
    return result3;
  }
  function finalizeJsonSchema(schema2) {
    return rewriteRefs(schema2, ($ref) => {
      const pointer = decodeUriFragment($ref);
      if (pointer === void 0) {
        if (/^#(?:\/|%2f)/i.test($ref)) {
          throw new Error(`Invalid JSON Pointer URI fragment ${JSON.stringify($ref)}`);
        }
        return $ref;
      }
      if (!pointer.startsWith("/$defs/")) return $ref;
      const separator = pointer.indexOf("/", 7);
      const canonical = definitionAliases.get(unescapeToken(pointer.slice(7, separator < 0 ? void 0 : separator)));
      if (canonical === void 0) return $ref;
      return $ref.replace(/^#(?:\/|%2f).*?(?:\/|%2f).*?(?=\/|%2f|$)/i, formatDefinitionReference(canonical));
    });
  }
  function getIdentifierFallback(representation) {
    if (representation._tag === "Reference") return void 0;
    const annotations = representation.checks.length === 0 ? representation.annotations : representation.checks[representation.checks.length - 1].annotations;
    return typeof annotations?.identifier !== "string" && typeof annotations?.[IDENTIFIER_FALLBACK_KEY] === "string" ? annotations[IDENTIFIER_FALLBACK_KEY] : void 0;
  }
  function compileCheck(check2, type, path, dependencies) {
    const annotations = check2.annotations;
    const callback4 = annotations?.toJsonSchema;
    if (callback4 !== void 0) {
      const schemas3 = check2.representation?.schemas?.map((schema4, index2) => recur2(schema4, [...path, "representation", "schemas", index2], dependencies)) ?? [];
      const result3 = callback4({
        type,
        schemas: schemas3
      });
      const approximate = isApproximateCheckOutput(result3);
      if (approximate) {
        dependencies.push(false);
      }
      const fragment = approximate ? result3[0] : result3;
      const ordinary2 = collectJsonSchemaAnnotations(annotations, options3);
      const schema3 = ordinary2 === void 0 ? fragment : {
        ...fragment,
        ...ordinary2
      };
      const allowed = ordinary2 === void 0 ? inlineableCheckKeywords : inlineableAnnotatedCheckKeywords;
      return [schema3, check2._tag === "Filter" && hasOnlyKeywords(schema3, allowed) && (ordinary2 === void 0 || hasOnlyKeywords(ordinary2, promotableAnnotationKeywords)) ? true : void 0];
    }
    if (check2._tag === "Filter") {
      dependencies.push(false);
      return void 0;
    }
    const schemas2 = check2.checks.flatMap((child, index2) => {
      const result3 = compileCheck(child, type, [...path, "checks", index2], dependencies);
      return result3 === void 0 ? [] : [result3[0]];
    });
    if (schemas2.length === 0) return void 0;
    const ordinary = collectJsonSchemaAnnotations(annotations, options3);
    const schema2 = {
      allOf: schemas2
    };
    return [ordinary === void 0 ? schema2 : {
      ...schema2,
      ...ordinary
    }];
  }
  function recur2(representation, path, dependencies) {
    if (representation._tag === "Reference") {
      dependencies.push(compileDefinition(representation.$ref, path)[1]);
      return {
        $ref: formatDefinitionReference(representation.$ref)
      };
    }
    const cached3 = compiledRepresentations.get(representation);
    if (cached3 !== void 0) {
      dependencies.push(cached3[1]);
      return cached3[0];
    }
    const local = [];
    dependencies.push(local);
    let output = on(representation, path, local);
    const ordinary = collectJsonSchemaAnnotations(representation.annotations, options3);
    if (ordinary !== void 0) {
      output = {
        ...output,
        ...ordinary
      };
    }
    for (let index2 = 0; index2 < representation.checks.length; index2++) {
      const type = typeof output.type === "string" && isJsonSchemaType(output.type) ? output.type : void 0;
      const check2 = compileCheck(representation.checks[index2], type, [...path, "checks", index2], local);
      if (check2 !== void 0) output = appendJsonSchema(output, ...check2);
    }
    compiledRepresentations.set(representation, [output, local]);
    return registerPendingOneOf(output);
  }
  function on(representation, path, dependencies) {
    switch (representation._tag) {
      case "Any":
      case "Unknown":
        return {};
      case "ObjectKeyword":
        return {
          anyOf: [{
            type: "object"
          }, {
            type: "array"
          }]
        };
      case "Void":
      case "Undefined":
      case "Null":
        return {
          type: "null"
        };
      case "BigInt":
        return {
          type: "string",
          allOf: [{
            pattern: "^-?\\d+$"
          }]
        };
      case "Symbol":
        return {
          type: "string",
          allOf: [{
            pattern: "^Symbol\\(([\\s\\S]*)\\)$"
          }]
        };
      case "UniqueSymbol":
        return globalThis.Symbol.keyFor(representation.symbol) === void 0 ? {
          not: {}
        } : {
          type: "string",
          enum: [globalThis.String(representation.symbol)]
        };
      case "Declaration":
        dependencies.push(false);
        return {};
      case "Suspend":
        return recur2(representation.thunk, [...path, "thunk"], dependencies);
      case "Never":
        return {
          not: {}
        };
      case "String":
        return {
          type: "string"
        };
      case "Number":
        return {
          anyOf: [{
            type: "number"
          }, {
            type: "string",
            enum: ["NaN", "Infinity", "-Infinity"]
          }]
        };
      case "Boolean":
        return {
          type: "boolean"
        };
      case "Literal": {
        const literal = representation.literal;
        return typeof literal === "bigint" ? {
          type: "string",
          enum: [globalThis.String(literal)]
        } : {
          type: typeof literal,
          enum: [literal]
        };
      }
      case "Enum": {
        const types = representation.enums.map(([title, literal], index2) => {
          if (typeof literal === "number" && !globalThis.Number.isFinite(literal)) {
            throw errorWithPath(`Invalid numeric enum value ${globalThis.String(literal)}`, [...path, "enums", index2, 1]);
          }
          return {
            type: typeof literal,
            enum: [literal],
            title
          };
        });
        return types.length === 0 ? {
          not: {}
        } : {
          anyOf: types
        };
      }
      case "TemplateLiteral":
        return {
          type: "string",
          pattern: `^${representation.parts.map(getPartPattern).join("")}$`
        };
      case "Arrays": {
        if (representation.rest.length > 1) {
          throw errorWithPath("Invalid schema representation document", [...path, "rest"]);
        }
        const out = {
          type: "array"
        };
        let minItems = representation.elements.length;
        const prefixItems = representation.elements.map((element, index2) => {
          if (element.isOptional) minItems--;
          const schema2 = recur2(element.type, [...path, "elements", index2, "type"], dependencies);
          const annotations = collectJsonSchemaAnnotations(element.annotations, options3);
          return annotations === void 0 ? schema2 : registerPendingOneOf(appendJsonSchema(schema2, annotations));
        });
        if (prefixItems.length > 0) {
          out.prefixItems = prefixItems;
          out.maxItems = representation.elements.length;
          if (minItems > 0) out.minItems = minItems;
        } else {
          out.items = false;
        }
        if (representation.rest.length === 1) {
          delete out.maxItems;
          const rest = recur2(representation.rest[0], [...path, "rest", 0], dependencies);
          if (Object.keys(rest).length > 0) out.items = rest;
          else delete out.items;
        }
        return out;
      }
      case "Objects": {
        if (representation.propertySignatures.length === 0 && representation.indexSignatures.length === 0) {
          return {
            not: {
              type: "null"
            }
          };
        }
        const out = {
          type: "object"
        };
        const properties = {};
        const required2 = [];
        for (let index2 = 0; index2 < representation.propertySignatures.length; index2++) {
          const property = representation.propertySignatures[index2];
          if (typeof property.name !== "string") {
            throw errorWithPath("Invalid schema representation document", [...path, "propertySignatures", index2, "name"]);
          }
          const name = property.name;
          const schema2 = recur2(property.type, [...path, "propertySignatures", index2, "type"], dependencies);
          const annotations = collectJsonSchemaAnnotations(property.annotations, options3);
          assignProperty(properties, name, annotations === void 0 ? schema2 : registerPendingOneOf(appendJsonSchema(schema2, annotations)));
          if (!property.isOptional) required2.push(name);
        }
        if (representation.propertySignatures.length > 0) out.properties = properties;
        if (required2.length > 0) out.required = required2;
        const patternProperties = {};
        const additionalPropertySchemas = [];
        const indexValueSchemas = [];
        let hasUnrepresentableIndexPattern = false;
        for (let index2 = 0; index2 < representation.indexSignatures.length; index2++) {
          const signature = representation.indexSignatures[index2];
          let type = recur2(signature.type, [...path, "indexSignatures", index2, "type"], dependencies);
          if (equals(type, {
            not: {}
          })) type = false;
          indexValueSchemas.push(type);
          const patterns = getParameterPatterns(signature.parameter, [...path, "indexSignatures", index2, "parameter"], /* @__PURE__ */ new Set());
          if (patterns === void 0) {
            hasUnrepresentableIndexPattern = true;
            dependencies.push(false);
            continue;
          }
          if (patterns.length === 0) {
            additionalPropertySchemas.push(type);
          } else {
            for (const pattern of patterns) {
              const previous = patternProperties[pattern];
              assignProperty(patternProperties, pattern, previous === void 0 ? type : previous === false || type === false ? false : registerPendingOneOf(appendJsonSchema(previous, type)));
            }
          }
        }
        const hasPatternProperties = Object.keys(patternProperties).length > 0;
        if (hasPatternProperties) {
          out.patternProperties = patternProperties;
        }
        if (hasUnrepresentableIndexPattern && options3?.onExcessProperty === "error") {
          const propertyNames = [];
          if (representation.propertySignatures.length > 0) {
            propertyNames.push({
              enum: Object.keys(properties)
            });
          }
          for (let index2 = 0; index2 < representation.indexSignatures.length; index2++) {
            propertyNames.push(recur2(representation.indexSignatures[index2].parameter, [...path, "indexSignatures", index2, "parameter"], dependencies));
          }
          out.propertyNames = propertyNames.length === 1 ? propertyNames[0] : {
            anyOf: propertyNames
          };
          out.additionalProperties = indexValueSchemas.length === 1 ? indexValueSchemas[0] : {
            anyOf: indexValueSchemas
          };
          if (additionalPropertySchemas.length > 0) {
            out.allOf = additionalPropertySchemas.map((type) => ({
              type: "object",
              additionalProperties: type
            }));
          }
        } else if (additionalPropertySchemas.length === 0) {
          out.additionalProperties = hasUnrepresentableIndexPattern || options3?.onExcessProperty !== "error";
        } else if (additionalPropertySchemas.length === 1 && representation.propertySignatures.length === 0 && !hasPatternProperties) {
          out.additionalProperties = additionalPropertySchemas[0];
        } else if (additionalPropertySchemas.length > 0) {
          out.allOf = additionalPropertySchemas.map((type) => ({
            type: "object",
            additionalProperties: type
          }));
        }
        if (typeof out.additionalProperties === "object" && out.additionalProperties !== null && Object.keys(out.additionalProperties).length === 0) {
          delete out.additionalProperties;
        }
        return out;
      }
      case "Union": {
        const branches = [];
        const types = representation.types.map((type, index2) => recur2(type, [...path, "types", index2], branches));
        dependencies.push(branches);
        if (types.length === 0) return {
          not: {}
        };
        const mode = representation.options?.mode ?? "anyOf";
        if (mode === "anyOf" && types.length > 1) {
          const compacted = compactEnums(types);
          if (compacted !== void 0) return compacted;
        }
        if (mode === "oneOf") pendingOneOf.set(types, [branches, []]);
        return {
          [mode]: types
        };
      }
    }
  }
  function getParameterPatterns(parameter, path, seenReferences) {
    switch (parameter._tag) {
      case "Reference": {
        if (!Object.hasOwn(references, parameter.$ref)) {
          throw errorWithPath(`Invalid reference ${parameter.$ref}`, [...path, "$ref"]);
        }
        compileDefinition(parameter.$ref, path);
        if (seenReferences.has(parameter.$ref)) return void 0;
        const next = new Set(seenReferences).add(parameter.$ref);
        return getParameterPatterns(references[parameter.$ref], ["references", parameter.$ref], next);
      }
      case "String": {
        if (parameter.checks.length === 0) return [];
        if (parameter.checks.length !== 1 || parameter.checks[0]._tag !== "Filter" || parameter.checks[0].annotations?.toJsonSchema === void 0) {
          return void 0;
        }
        const dependencies = [];
        const schema2 = recur2(parameter, path, dependencies);
        if (!isExact(dependencies)) return void 0;
        return schema2.type === "string" && typeof schema2.pattern === "string" && hasOnlyKeywords(schema2, "|type|pattern|title|description|default|examples|readOnly|writeOnly|") ? [schema2.pattern] : void 0;
      }
      case "TemplateLiteral":
        return parameter.checks.length === 0 ? [`^${parameter.parts.map(getPartPattern).join("")}$`] : void 0;
      case "Union": {
        if (parameter.types.length === 0 || parameter.checks.length > 0 || parameter.options?.mode === "oneOf") {
          return void 0;
        }
        const patterns = [];
        for (let index2 = 0; index2 < parameter.types.length; index2++) {
          const memberPatterns = getParameterPatterns(parameter.types[index2], [...path, "types", index2], seenReferences);
          if (memberPatterns === void 0) return void 0;
          if (memberPatterns.length === 0) return [];
          patterns.push(...memberPatterns);
        }
        return patterns;
      }
      default:
        throw errorWithPath("Invalid schema representation document", path);
    }
  }
}
function isJsonSchemaType(input) {
  return input === "string" || input === "number" || input === "boolean" || input === "array" || input === "object" || input === "null" || input === "integer";
}
function compactEnums(schemas) {
  let sharedType = void 0;
  const values2 = [];
  for (const schema2 of schemas) {
    const keys3 = Object.keys(schema2);
    if (keys3.length !== 2 || schema2.type === void 0 || !Array.isArray(schema2.enum) || schema2.enum.length === 0) {
      return void 0;
    }
    if (sharedType === void 0) sharedType = schema2.type;
    else if (schema2.type !== sharedType) return void 0;
    for (const value3 of schema2.enum) {
      if (values2.includes(value3)) return void 0;
      values2.push(value3);
    }
  }
  return {
    type: sharedType,
    enum: values2
  };
}
function getPartPattern(part) {
  switch (part._tag) {
    case "Literal":
      return escape(globalThis.String(part.literal));
    case "String":
      return STRING_PATTERN;
    case "Number":
      return FINITE_PATTERN;
    case "TemplateLiteral":
      return part.parts.map(getPartPattern).join("");
    case "Union":
      return `(?:${part.types.map(getPartPattern).join("|")})`;
    default:
      throw errorWithPath("Invalid schema representation document", []);
  }
}
function toJsonSchemaDocument(document, options3) {
  const output = compileJsonSchema([document.representation], [["representation"]], document.references, options3);
  return {
    dialect: output.dialect,
    schema: output.schemas[0],
    definitions: output.definitions
  };
}

// ../../node_modules/effect/dist/internal/schema/toRepresentation.js
var defaultReferencePolicy = ({
  identifier: identifier2
}) => identifier2;
function annotationsField(annotations) {
  return annotations === void 0 ? void 0 : {
    annotations
  };
}
function toRepresentation(ast, options3) {
  const {
    references,
    representations
  } = toRepresentations([ast], options3);
  return {
    representation: representations[0],
    references
  };
}
function toRepresentations(asts, options3) {
  const references = {};
  const referenceOwners = /* @__PURE__ */ new Map();
  const buildingReferences = /* @__PURE__ */ new Set();
  const candidates = /* @__PURE__ */ new Map();
  const visitingCandidates = /* @__PURE__ */ new Set();
  for (const ast of asts) visit2(ast);
  const referencePolicy = options3?.referencePolicy ?? defaultReferencePolicy;
  for (const candidatesByIdentifier of candidates.values()) {
    for (const candidate of candidatesByIdentifier.values()) {
      const requestedReference = referencePolicy({
        ast: candidate.ast,
        occurrences: candidate.occurrences,
        identifier: candidate.identifier
      });
      if (requestedReference !== void 0) {
        const separator = requestedReference === candidate.identifier || !requestedReference.endsWith("_") ? "_" : "";
        candidate.reference = getReference(requestedReference, candidate, separator);
      } else if (candidate.isRecursive) {
        candidate.reference = getReference(`${candidate.ast._tag}_`, candidate, "");
      }
    }
  }
  const representations = map4(asts, (ast) => recur2(ast));
  return {
    representations,
    references
  };
  function getReference(prefix, owner, separator = "_") {
    let candidate = prefix;
    let suffix = 0;
    while (referenceOwners.has(candidate)) {
      if (referenceOwners.get(candidate) === owner) return candidate;
      candidate = `${prefix}${separator}${++suffix}`;
    }
    referenceOwners.set(candidate, owner);
    return candidate;
  }
  function annotateReference(ast, candidate, reference) {
    const fallback = candidate.fallback;
    if (fallback !== void 0) {
      return resolveIdentifierFallback(ast) === fallback ? ast : annotate(ast, {
        [IDENTIFIER_FALLBACK_KEY]: fallback
      });
    }
    return reference === candidate.identifier ? ast : annotate(ast, {
      identifier: reference
    });
  }
  function makeReference(reference, ast) {
    if (!Object.hasOwn(references, reference) && !buildingReferences.has(reference)) {
      buildingReferences.add(reference);
      const representation = on(ast);
      buildingReferences.delete(reference);
      assignProperty(references, reference, representation);
    }
    return {
      _tag: "Reference",
      $ref: reference
    };
  }
  function getCandidate(input) {
    const ast = getLastEncoding(input);
    const owner = getContextOwner(ast);
    let identifier2 = resolveIdentifier(ast);
    const fallback = identifier2 === void 0 ? (ast !== input ? resolveIdentifier(input) : void 0) ?? resolveIdentifierFallback(ast) : void 0;
    if (fallback !== void 0) identifier2 = `${fallback}Encoded`;
    let candidatesByIdentifier = candidates.get(owner);
    if (candidatesByIdentifier === void 0) {
      candidatesByIdentifier = /* @__PURE__ */ new Map();
      candidates.set(owner, candidatesByIdentifier);
    }
    let candidate = candidatesByIdentifier.get(identifier2);
    if (candidate === void 0) {
      candidate = {
        ast: owner,
        identifier: identifier2,
        fallback,
        occurrences: 0,
        isRecursive: false,
        reference: void 0
      };
      candidatesByIdentifier.set(identifier2, candidate);
    }
    return candidate;
  }
  function visit2(input) {
    const candidate = getCandidate(input);
    const ast = candidate.ast;
    candidate.occurrences++;
    if (visitingCandidates.has(candidate)) {
      candidate.isRecursive = true;
      return;
    }
    if (candidate.occurrences > 1) return;
    visitingCandidates.add(candidate);
    visitChecks(ast.checks);
    switch (ast._tag) {
      case "Declaration":
      case "Arrays":
      case "Objects":
      case "Union":
        ast.recur((child) => {
          visit2(child);
          return child;
        });
        break;
      case "TemplateLiteral":
        ast.parts.forEach(visit2);
        break;
      case "Suspend":
        visit2(ast.thunk());
        break;
    }
    visitingCandidates.delete(candidate);
  }
  function visitChecks(checks) {
    checks?.forEach((check2) => {
      check2.annotations?.representation?.schemas?.forEach((schema2) => visit2(toType(schema2)));
      if (check2._tag === "FilterGroup") visitChecks(check2.checks);
    });
  }
  function recur2(input) {
    const candidate = getCandidate(input);
    const ast = candidate.ast;
    const reference = candidate.reference;
    if (reference !== void 0) {
      const annotated = candidate.identifier === void 0 ? ast : annotateReference(ast, candidate, reference);
      return makeReference(reference, annotated);
    }
    return on(ast);
  }
  function on(ast) {
    const checks = fromChecks(ast.checks);
    switch (ast._tag) {
      case "Declaration":
        return {
          _tag: "Declaration",
          typeParameters: ast.typeParameters.map((ast2) => recur2(ast2)),
          checks,
          ...fromDeclarationAnnotations(ast.annotations)
        };
      case "Null":
      case "Undefined":
      case "Void":
      case "Never":
      case "Unknown":
      case "Any":
      case "String":
      case "Boolean":
      case "Number":
      case "BigInt":
      case "Symbol":
      case "ObjectKeyword":
        return {
          _tag: ast._tag,
          checks,
          ...annotationsField(ast.annotations)
        };
      case "Literal":
        return {
          _tag: "Literal",
          literal: ast.literal,
          checks,
          ...annotationsField(ast.annotations)
        };
      case "UniqueSymbol":
        return {
          _tag: "UniqueSymbol",
          symbol: ast.symbol,
          checks,
          ...annotationsField(ast.annotations)
        };
      case "Enum":
        return {
          _tag: "Enum",
          enums: ast.enums,
          checks,
          ...annotationsField(ast.annotations)
        };
      case "TemplateLiteral":
        return {
          _tag: "TemplateLiteral",
          parts: ast.parts.map((ast2) => recur2(ast2)),
          checks,
          ...annotationsField(ast.annotations)
        };
      case "Arrays":
        return {
          _tag: "Arrays",
          elements: ast.elements.map((element) => {
            const projected = getLastEncoding(element);
            const annotations = projected.context?.annotations;
            return {
              isOptional: isOptional(projected),
              type: recur2(element),
              ...annotationsField(annotations)
            };
          }),
          rest: ast.rest.map((ast2) => recur2(ast2)),
          checks,
          ...annotationsField(ast.annotations)
        };
      case "Objects":
        return {
          _tag: "Objects",
          propertySignatures: ast.propertySignatures.map((property) => {
            const projected = getLastEncoding(property.type);
            const annotations = projected.context?.annotations;
            return {
              name: property.name,
              type: recur2(property.type),
              isOptional: isOptional(projected),
              isMutable: isMutable(projected),
              ...annotationsField(annotations)
            };
          }),
          indexSignatures: ast.indexSignatures.map((index2) => ({
            parameter: recur2(index2.parameter),
            type: recur2(index2.type)
          })),
          checks,
          ...annotationsField(ast.annotations)
        };
      case "Union":
        return {
          _tag: "Union",
          types: ast.types.map((ast2) => recur2(ast2)),
          ...ast.options === void 0 ? {} : {
            options: ast.options
          },
          checks,
          ...annotationsField(ast.annotations)
        };
      case "Suspend":
        return {
          _tag: "Suspend",
          checks: [],
          thunk: recur2(ast.thunk()),
          ...annotationsField(ast.annotations)
        };
    }
  }
  function fromChecks(checks) {
    return checks?.map(fromCheck) ?? [];
  }
  function fromCheck(check2) {
    switch (check2._tag) {
      case "Filter":
        return {
          _tag: "Filter",
          aborted: check2.aborted,
          ...fromCheckAnnotations(check2.annotations)
        };
      case "FilterGroup":
        return {
          _tag: "FilterGroup",
          checks: map4(check2.checks, fromCheck),
          ...fromCheckAnnotations(check2.annotations)
        };
    }
  }
  function fromDeclarationAnnotations(annotations) {
    if (annotations === void 0) return void 0;
    const {
      representation,
      ...ordinary
    } = annotations;
    return {
      ...representation === void 0 ? void 0 : {
        representation
      },
      ...Object.keys(ordinary).length === 0 ? void 0 : {
        annotations: ordinary
      }
    };
  }
  function fromCheckAnnotations(annotations) {
    if (annotations === void 0) return void 0;
    const {
      representation,
      ...ordinary
    } = annotations;
    const projected = representation === void 0 ? void 0 : representation.schemas === void 0 ? representation : {
      ...representation,
      schemas: representation.schemas.map((schema2) => recur2(toType(schema2)))
    };
    return {
      ...projected === void 0 ? void 0 : {
        representation: projected
      },
      ...Object.keys(ordinary).length === 0 ? void 0 : {
        annotations: ordinary
      }
    };
  }
}

// ../../node_modules/effect/dist/internal/schema/standardSchema.js
function makeStandardResult(exit3) {
  return isSuccess4(exit3) ? exit3.value : {
    issues: [{
      message: pretty(exit3.cause)
    }]
  };
}
function toStandardSchemaV1(self, options3) {
  const decodeUnknownEffect3 = decodeUnknownEffect(self);
  const parseOptions = {
    errors: "all",
    ...options3?.parseOptions
  };
  const formatter = makeFormatterStandardSchemaV1(options3);
  const validate3 = (value3) => {
    const scheduler = new MixedScheduler("sync");
    const fiber3 = runFork2(match5(decodeUnknownEffect3(value3, parseOptions), {
      onFailure: formatter,
      onSuccess: (value4) => ({
        value: value4
      })
    }), {
      scheduler
    });
    fiber3.currentDispatcher?.flush();
    const exit3 = fiber3.pollUnsafe();
    if (exit3) {
      return makeStandardResult(exit3);
    }
    return new Promise((resolve6) => {
      fiber3.addObserver((exit4) => {
        resolve6(makeStandardResult(exit4));
      });
    });
  };
  if ("~standard" in self) {
    const out = self;
    if ("validate" in out["~standard"]) return out;
    Object.assign(out["~standard"], {
      validate: validate3
    });
    return out;
  }
  return Object.assign(self, {
    "~standard": {
      version: 1,
      vendor: "effect",
      validate: validate3
    }
  });
}
function toJsonSchemaDocument2(ast) {
  const document = toRepresentation(toCodecJsonAST(ast));
  return toJsonSchemaDocument(document);
}
function toBaseStandardJSONSchemaV1(ast, target) {
  const doc2020_12 = toJsonSchemaDocument2(ast);
  if (target === "draft-2020-12") {
    const schema2 = doc2020_12.schema;
    if (Object.keys(doc2020_12.definitions).length > 0) {
      schema2.$defs = doc2020_12.definitions;
    }
    return schema2;
  } else if (target === "draft-07") {
    const doc07 = toDocumentDraft07(doc2020_12);
    const schema2 = doc07.schema;
    if (Object.keys(doc07.definitions).length > 0) {
      schema2.definitions = doc07.definitions;
    }
    return schema2;
  }
  throw new globalThis.Error(`Unsupported target: ${target}`);
}
function toStandardJSONSchemaV1(self) {
  const jsonSchema2 = {
    input(options3) {
      return toBaseStandardJSONSchemaV1(self.ast, options3.target);
    },
    output(options3) {
      return toBaseStandardJSONSchemaV1(toType(self.ast), options3.target);
    }
  };
  if ("~standard" in self) {
    const out = self;
    if ("jsonSchema" in out["~standard"]) return out;
    Object.assign(out["~standard"], {
      jsonSchema: jsonSchema2
    });
    return out;
  }
  return Object.assign(self, {
    "~standard": {
      version: 1,
      vendor: "effect",
      jsonSchema: jsonSchema2
    }
  });
}

// ../../node_modules/effect/dist/JsonPatch.js
function get4(oldValue, newValue) {
  const patches = [];
  getLoop(oldValue, newValue, "", patches);
  return patches;
}
function getLoop(oldValue, newValue, path, patches) {
  if (Object.is(oldValue, newValue)) return;
  if (Array.isArray(oldValue) && Array.isArray(newValue)) {
    const len1 = oldValue.length;
    const len2 = newValue.length;
    const shared = Math.min(len1, len2);
    for (let i = 0; i < shared; i++) {
      getLoop(oldValue[i], newValue[i], `${path}/${i}`, patches);
    }
    for (let i = len1 - 1; i >= len2; i--) {
      patches.push({
        op: "remove",
        path: `${path}/${i}`
      });
    }
    for (let i = len1; i < len2; i++) {
      patches.push({
        op: "add",
        path: `${path}/${i}`,
        value: newValue[i]
      });
    }
    return;
  }
  if (isJsonObject(oldValue) && isJsonObject(newValue)) {
    const keys1 = Object.keys(oldValue);
    const keys22 = Object.keys(newValue);
    const allKeys = Array.from(/* @__PURE__ */ new Set([...keys1, ...keys22])).sort();
    for (const key of allKeys) {
      const keyPath = `${path}/${escapeToken(key)}`;
      const hasKey1 = Object.hasOwn(oldValue, key);
      const hasKey2 = Object.hasOwn(newValue, key);
      if (hasKey1 && hasKey2) {
        getLoop(oldValue[key], newValue[key], keyPath, patches);
      } else if (!hasKey1 && hasKey2) {
        patches.push({
          op: "add",
          path: keyPath,
          value: newValue[key]
        });
      } else {
        patches.push({
          op: "remove",
          path: keyPath
        });
      }
    }
    return;
  }
  patches.push({
    op: "replace",
    path,
    value: newValue
  });
}
function apply(patch3, oldValue) {
  let doc = oldValue;
  for (const op of patch3) {
    doc = applyOperation(doc, op);
  }
  return doc;
}
function isJsonObject(value3) {
  return typeof value3 === "object" && value3 !== null && !Array.isArray(value3);
}
function tokenize(pointer) {
  if (pointer === "") return [];
  if (pointer.charCodeAt(0) !== 47) {
    throw new Error(`Invalid JSON Pointer, it must start with "/": ${JSON.stringify(pointer)}`);
  }
  return pointer.split("/").slice(1).map(unescapeToken);
}
function toJsonPointerArrayIndex(token) {
  if (!/^(0|[1-9]\d*)$/.test(token)) {
    throw new Error(`Invalid array index: "${token}"`);
  }
  return Number(token);
}
function applyOperation(doc, op) {
  if (op.path === "") {
    if (op.op === "remove") throw new Error("Unsupported operation at the root");
    return op.value;
  }
  const resolved = resolveParent(doc, op.path);
  if (resolved === null) {
    throw new Error(`Cannot ${op.op} at "${op.path}" (parent not found or not a container).`);
  }
  const {
    lastToken,
    parent,
    stack
  } = resolved;
  if (Array.isArray(parent)) {
    if (lastToken === "-" && op.op !== "add") {
      throw new Error(`"-" is not valid for ${op.op} at "${op.path}".`);
    }
    const index2 = lastToken === "-" ? parent.length : toJsonPointerArrayIndex(lastToken);
    const maxIndex = op.op === "add" ? parent.length : parent.length - 1;
    if (index2 > maxIndex) throw new Error(`Array index out of bounds at "${op.path}".`);
    const updated = parent.slice();
    if (op.op === "add") updated.splice(index2, 0, op.value);
    else if (op.op === "remove") updated.splice(index2, 1);
    else updated[index2] = op.value;
    return rebuildFromStack(stack, updated);
  }
  if (isJsonObject(parent)) {
    if (op.op !== "add" && !Object.hasOwn(parent, lastToken)) {
      throw new Error(`Property "${lastToken}" does not exist at "${op.path}".`);
    }
    const updated = {
      ...parent
    };
    if (op.op === "remove") delete updated[lastToken];
    else assignProperty(updated, lastToken, op.value);
    return rebuildFromStack(stack, updated);
  }
  throw new Error(`Cannot ${op.op} at "${op.path}" (parent not found or not a container).`);
}
function resolveParent(doc, pointer) {
  const tokens = tokenize(pointer);
  if (tokens.length === 0) return null;
  const lastToken = tokens[tokens.length - 1];
  const stack = [];
  let cur = doc;
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    if (Array.isArray(cur)) {
      const idx = toJsonPointerArrayIndex(token);
      if (idx >= cur.length) return null;
      stack.push({
        container: cur,
        token: idx
      });
      cur = cur[idx];
      continue;
    }
    if (isJsonObject(cur)) {
      if (!Object.hasOwn(cur, token)) return null;
      stack.push({
        container: cur,
        token
      });
      cur = cur[token];
      continue;
    }
    return null;
  }
  return {
    stack,
    parent: cur,
    lastToken
  };
}
function rebuildFromStack(stack, newParent) {
  let acc = newParent;
  for (let i = stack.length - 1; i >= 0; i--) {
    const {
      container,
      token
    } = stack[i];
    if (Array.isArray(container)) {
      const copy4 = container.slice();
      copy4[token] = acc;
      acc = copy4;
    } else {
      const copy4 = {
        ...container
      };
      assignProperty(copy4, token, acc);
      acc = copy4;
    }
  }
  return acc;
}

// ../../node_modules/effect/dist/internal/schema/toDifferJsonPatch.js
function toDifferJsonPatch(schema2) {
  const serializer = toCodecJson(schema2);
  const get8 = encodeSync(serializer);
  const set5 = decodeSync(serializer);
  return {
    empty: [],
    diff: (oldValue, newValue) => get4(get8(oldValue), get8(newValue)),
    combine: (first, second) => [...first, ...second],
    patch: (oldValue, patch3) => {
      const value3 = get8(oldValue);
      const patched = apply(patch3, value3);
      return Object.is(patched, value3) ? oldValue : set5(patched);
    }
  };
}

// ../../node_modules/effect/dist/internal/schema/toEncoderXml.js
function toEncoderXml(codec, options3) {
  const rootName = resolveIdentifier(codec.ast) ?? resolveTitle(codec.ast);
  const serialize = encodeEffect(toCodecStringTree(codec));
  return (value3) => serialize(value3).pipe(map7((stringTree) => stringTreeToXml(stringTree, {
    rootName,
    ...options3
  })));
}
function stringTreeToXml(value3, options3) {
  const rootName = options3.rootName ?? "root";
  const arrayItemName = options3.arrayItemName ?? "item";
  const pretty2 = options3.pretty ?? true;
  const indent = options3.indent ?? "  ";
  const sortKeys = options3.sortKeys ?? true;
  const seen = /* @__PURE__ */ new Set();
  const lines = [];
  recur2(rootName, value3, 0);
  return lines.join(pretty2 ? "\n" : "");
  function push(depth, text2) {
    lines.push(pretty2 ? indent.repeat(depth) + text2 : text2);
  }
  function recur2(tagName, node, depth, originalNameForMeta) {
    const {
      attrs,
      safe
    } = xml.tagInfo(tagName, originalNameForMeta);
    if (node === void 0) {
      push(depth, `<${safe}${attrs}/>`);
    } else if (typeof node === "string") {
      push(depth, `<${safe}${attrs}>${xml.escapeText(node)}</${safe}>`);
    } else if (typeof node !== "object" || node === null) {
      push(depth, `<${safe}${attrs}>${xml.escapeText(format(node))}</${safe}>`);
    } else {
      if (seen.has(node)) throw new globalThis.Error("Cycle detected while serializing to XML.", {
        cause: node
      });
      seen.add(node);
      try {
        if (globalThis.Array.isArray(node)) {
          if (node.length === 0) {
            push(depth, `<${safe}${attrs}/>`);
            return;
          }
          push(depth, `<${safe}${attrs}>`);
          for (const item of node) recur2(arrayItemName, item, depth + 1);
          push(depth, `</${safe}>`);
          return;
        }
        const object = node;
        const keys3 = Object.keys(object);
        if (sortKeys) keys3.sort();
        if (keys3.length === 0) {
          push(depth, `<${safe}${attrs}/>`);
          return;
        }
        push(depth, `<${safe}${attrs}>`);
        for (const key of keys3) {
          recur2(xml.parseTagName(key).safe, object[key], depth + 1, key);
        }
        push(depth, `</${safe}>`);
      } finally {
        seen.delete(node);
      }
    }
  }
}
var xml = {
  escapeText(value3) {
    return value3.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },
  escapeAttribute(value3) {
    return value3.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },
  parseTagName(name) {
    const original = name;
    let safe = name;
    if (!/^[A-Za-z_]/.test(safe)) safe = "_" + safe;
    safe = safe.replace(/[^A-Za-z0-9._-]/g, "_");
    if (/^xml/i.test(safe)) safe = "_" + safe;
    return {
      safe,
      changed: safe !== original
    };
  },
  tagInfo(name, original) {
    const {
      changed,
      safe
    } = xml.parseTagName(name);
    const needsMeta = changed || original && original !== name;
    const attrs = needsMeta ? ` data-name="${xml.escapeAttribute(original ?? name)}"` : "";
    return {
      safe,
      attrs
    };
  }
};

// ../../node_modules/effect/dist/internal/schema/toEquivalence.js
var toEquivalence = /* @__PURE__ */ memoize((ast) => {
  return recur(ast);
});
function recur(ast) {
  const annotation = resolve(ast)?.["toEquivalence"];
  if (annotation) {
    return annotation(isDeclaration(ast) ? ast.typeParameters.map(recur) : []);
  }
  switch (ast._tag) {
    case "Never":
      return strictEqual();
    case "Declaration":
      return declarationEquivalence(ast);
    case "Null":
    case "Undefined":
    case "Void":
    case "Unknown":
    case "Any":
    case "String":
    case "Number":
    case "Boolean":
    case "BigInt":
    case "Symbol":
    case "Literal":
    case "UniqueSymbol":
    case "ObjectKeyword":
    case "Enum":
    case "TemplateLiteral":
      return equals;
    case "Arrays": {
      const elements = ast.elements.map(recur);
      const rest = ast.rest.map(recur);
      const [head5, ...tail] = rest;
      const tailLength = tail.length;
      return make3((a, b) => {
        if (!Array.isArray(a) || !Array.isArray(b)) {
          return false;
        }
        const len = a.length;
        if (len !== b.length) {
          return false;
        }
        let i = 0;
        for (; i < Math.min(len, ast.elements.length); i++) {
          if (!elements[i](a[i], b[i])) {
            return false;
          }
        }
        if (rest.length > 0) {
          for (; i < len - tailLength; i++) {
            if (!head5(a[i], b[i])) {
              return false;
            }
          }
          for (let j = 0; j < tailLength; j++) {
            if (!tail[j](a[i + j], b[i + j])) {
              return false;
            }
          }
        }
        return true;
      });
    }
    case "Objects": {
      if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) {
        return equals;
      }
      const propertySignatures = ast.propertySignatures.map((ps) => recur(ps.type));
      const indexSignatures = ast.indexSignatures.map((is3) => recur(is3.type));
      return make3((a, b) => {
        if (!isObject(a) || !isObject(b)) {
          return false;
        }
        for (let i = 0; i < propertySignatures.length; i++) {
          const ps = ast.propertySignatures[i];
          const name = ps.name;
          const aHas = Object.hasOwn(a, name);
          const bHas = Object.hasOwn(b, name);
          if (isOptional(ps.type)) {
            if (aHas !== bHas) {
              return false;
            }
          }
          if (aHas && bHas && !propertySignatures[i](a[name], b[name])) {
            return false;
          }
        }
        for (let i = 0; i < indexSignatures.length; i++) {
          const is3 = ast.indexSignatures[i];
          const aKeys = getIndexSignatureKeys(a, is3.parameter);
          const bKeys = getIndexSignatureKeys(b, is3.parameter);
          if (aKeys.length !== bKeys.length) return false;
          for (let j = 0; j < aKeys.length; j++) {
            const key = aKeys[j];
            if (!Object.hasOwn(b, key) || !indexSignatures[i](a[key], b[key])) {
              return false;
            }
          }
        }
        return true;
      });
    }
    case "Union": {
      const types = toType(ast).types;
      const index2 = getCandidateIndex(types);
      const compiled = types.map((candidate, i) => [_is(candidate), recur(ast.types[i])]);
      return make3((a, b) => {
        const candidates = index2(a, false);
        for (let i = 0; i < candidates.length; i++) {
          const [is3, equivalence] = compiled[candidates[i]];
          if (is3(a) && is3(b)) {
            return equivalence(a, b);
          }
        }
        return false;
      });
    }
    case "Suspend": {
      let equivalence;
      return make3((a, b) => (equivalence ??= toEquivalence(ast.thunk()))(a, b));
    }
  }
}
function declarationEquivalence(ast) {
  const representation = ast.annotations?.representation;
  if (representation === void 0) return equals;
  switch (representation.id) {
    case "effect/schema/Option": {
      const [value3] = declarationTypeParameters(ast);
      return (a, b) => a._tag === b._tag && (a._tag === "None" || value3(a.value, b.value));
    }
    case "effect/schema/Result": {
      const [success, failure] = declarationTypeParameters(ast);
      return (a, b) => a._tag === b._tag && (a._tag === "Success" ? success(a.success, b.success) : failure(a.failure, b.failure));
    }
    case "effect/schema/CauseReason": {
      const [error, defect] = declarationTypeParameters(ast);
      return causeReasonEquivalence(error, defect);
    }
    case "effect/schema/Cause": {
      const [error, defect] = declarationTypeParameters(ast);
      return causeEquivalence(error, defect);
    }
    case "effect/schema/Exit": {
      const [value3, error, defect] = declarationTypeParameters(ast);
      const cause = causeEquivalence(error, defect);
      return (a, b) => a._tag === b._tag && (a._tag === "Success" ? value3(a.value, b.value) : cause(a.cause, b.cause));
    }
    case "effect/schema/ReadonlyMap": {
      const [key, value3] = declarationTypeParameters(ast);
      return makeCompareMap(key, value3);
    }
    case "effect/schema/ReadonlySet":
      return makeCompareSet(declarationTypeParameters(ast)[0]);
    case "effect/schema/RegExp":
      return (a, b) => a.source === b.source && a.flags === b.flags;
    case "effect/schema/URL":
      return (a, b) => a.toString() === b.toString();
    default:
      return equals;
  }
}
function declarationTypeParameters(ast) {
  return ast.typeParameters.map(recur);
}
function causeReasonEquivalence(error, defect) {
  return (a, b) => {
    if (a._tag !== b._tag) return false;
    switch (a._tag) {
      case "Fail":
        return error(a.error, b.error);
      case "Die":
        return defect(a.defect, b.defect);
      case "Interrupt":
        return a.fiberId === b.fiberId;
    }
  };
}
function causeEquivalence(error, defect) {
  const reasons = Array_(causeReasonEquivalence(error, defect));
  return (a, b) => reasons(a.reasons, b.reasons);
}

// ../../node_modules/effect/dist/internal/schema/toFormatter.js
function causeReasonToFormatter(error, defect) {
  return (reason) => {
    switch (reason._tag) {
      case "Fail":
        return `Fail(${error(reason.error)})`;
      case "Die":
        return `Die(${defect(reason.defect)})`;
      case "Interrupt":
        return "Interrupt";
    }
  };
}
function causeToFormatter(error, defect) {
  const causeReason = causeReasonToFormatter(error, defect);
  return (cause) => `Cause([${cause.reasons.map(causeReason).join(", ")}])`;
}
function toFormatter(ast, options3) {
  const compiled = /* @__PURE__ */ new Map();
  return recur2(ast);
  function recur2(ast2) {
    let formatter = compiled.get(ast2);
    if (formatter === void 0) {
      formatter = compile2(ast2);
      compiled.set(ast2, formatter);
    }
    return formatter;
  }
  function compile2(ast2) {
    const annotation = resolve(ast2)?.["toFormatter"];
    if (typeof annotation === "function") {
      return annotation(isDeclaration(ast2) ? ast2.typeParameters.map(recur2) : []);
    }
    if (options3?.onBefore) {
      const onBefore = options3.onBefore(ast2, recur2);
      if (onBefore !== void 0) {
        return onBefore;
      }
    }
    return on(ast2);
  }
  function on(ast2) {
    switch (ast2._tag) {
      default:
        return format;
      case "Never":
        return () => "never";
      case "Void":
        return () => "void";
      case "Declaration": {
        const representation = ast2.annotations?.representation;
        if (representation === void 0) return format;
        const typeParameters = ast2.typeParameters.map(recur2);
        switch (representation.id) {
          case "effect/schema/Option": {
            const [value3] = typeParameters;
            return match({
              onNone: () => "none()",
              onSome: (value_) => `some(${value3(value_)})`
            });
          }
          case "effect/schema/Result": {
            const [success, failure] = typeParameters;
            return match2({
              onSuccess: (value3) => `success(${success(value3)})`,
              onFailure: (error) => `failure(${failure(error)})`
            });
          }
          case "effect/schema/CauseReason":
            return causeReasonToFormatter(typeParameters[0], typeParameters[1]);
          case "effect/schema/Cause":
            return causeToFormatter(typeParameters[0], typeParameters[1]);
          case "effect/schema/Exit": {
            const [value3, error, defect] = typeParameters;
            const cause = causeToFormatter(error, defect);
            return (exit3) => {
              switch (exit3._tag) {
                case "Success":
                  return `Exit.Success(${value3(exit3.value)})`;
                case "Failure":
                  return `Exit.Failure(${cause(exit3.cause)})`;
              }
            };
          }
          case "effect/schema/ReadonlyMap": {
            const [key, value3] = typeParameters;
            return (map12) => {
              const size6 = map12.size;
              if (size6 === 0) return "ReadonlyMap(0) {}";
              const entries3 = globalThis.Array.from(map12.entries()).sort().map(([key_, value_]) => `${key(key_)} => ${value3(value_)}`);
              return `ReadonlyMap(${size6}) { ${entries3.join(", ")} }`;
            };
          }
          case "effect/schema/HashMap": {
            const [key, value3] = typeParameters;
            return (map12) => {
              const size6 = size3(map12);
              if (size6 === 0) return "HashMap(0) {}";
              const entries3 = toEntries(map12).sort().map(([key_, value_]) => `${key(key_)} => ${value3(value_)}`);
              return `HashMap(${size6}) { ${entries3.join(", ")} }`;
            };
          }
          case "effect/schema/ReadonlySet": {
            const [value3] = typeParameters;
            return (set5) => {
              const size6 = set5.size;
              if (size6 === 0) return "ReadonlySet(0) {}";
              const values2 = globalThis.Array.from(set5.values()).sort().map((item) => `${value3(item)}`);
              return `ReadonlySet(${size6}) { ${values2.join(", ")} }`;
            };
          }
          case "effect/schema/HashSet": {
            const [value3] = typeParameters;
            return (set5) => {
              const size6 = size5(set5);
              if (size6 === 0) return "HashSet(0) {}";
              const values2 = globalThis.Array.from(set5).sort().map((item) => `${value3(item)}`);
              return `HashSet(${size6}) { ${values2.join(", ")} }`;
            };
          }
          case "effect/schema/Chunk": {
            const [value3] = typeParameters;
            return (chunk) => {
              const size6 = size(chunk);
              if (size6 === 0) return "Chunk(0) {}";
              const values2 = globalThis.Array.from(chunk).sort().map((item) => `${value3(item)}`);
              return `Chunk(${size6}) { ${values2.join(", ")} }`;
            };
          }
          default:
            return format;
        }
      }
      case "Arrays": {
        const elements = ast2.elements.map((element) => recur2(element));
        const rest = ast2.rest.map(recur2);
        const [head5, ...tail] = rest;
        const tailLength = tail.length;
        return (value3) => {
          const out = [];
          let i = 0;
          for (; i < elements.length; i++) {
            if (value3.length < i + 1) {
              if (isOptional(ast2.elements[i])) {
                continue;
              }
            } else {
              out.push(elements[i](value3[i]));
            }
          }
          if (rest.length > 0) {
            for (; i < value3.length - tailLength; i++) {
              out.push(head5(value3[i]));
            }
            for (let j = 0; j < tailLength; j++) {
              out.push(tail[j](value3[i + j]));
            }
          }
          return "[" + out.join(", ") + "]";
        };
      }
      case "Objects": {
        const propertySignatures = ast2.propertySignatures.map((signature) => recur2(signature.type));
        const indexSignatures = ast2.indexSignatures.map((signature) => recur2(signature.type));
        if (ast2.propertySignatures.length === 0 && ast2.indexSignatures.length === 0) {
          return format;
        }
        return (value3) => {
          const out = [];
          const visited = /* @__PURE__ */ new Set();
          for (let i = 0; i < propertySignatures.length; i++) {
            const signature = ast2.propertySignatures[i];
            const name = signature.name;
            visited.add(name);
            if (isOptional(signature.type) && !Object.hasOwn(value3, name)) {
              continue;
            }
            out.push(`${formatPropertyKey(name)}: ${propertySignatures[i](value3[name])}`);
          }
          for (let i = 0; i < indexSignatures.length; i++) {
            const keys3 = getIndexSignatureKeys(value3, ast2.indexSignatures[i].parameter);
            for (const key of keys3) {
              if (visited.has(key)) {
                continue;
              }
              visited.add(key);
              out.push(`${formatPropertyKey(key)}: ${indexSignatures[i](value3[key])}`);
            }
          }
          return out.length > 0 ? "{ " + out.join(", ") + " }" : "{}";
        };
      }
      case "Union": {
        const types = toType(ast2).types;
        const index2 = getCandidateIndex(types);
        const compiled2 = types.map((candidate, i) => [_is(candidate), recur2(ast2.types[i])]);
        return (value3) => {
          const candidates = index2(value3, false);
          for (let i = 0; i < candidates.length; i++) {
            const [is3, formatter] = compiled2[candidates[i]];
            if (is3(value3)) {
              return formatter(value3);
            }
          }
          return format(value3);
        };
      }
      case "Suspend": {
        let formatter;
        return (value3) => (formatter ??= recur2(ast2.thunk()))(value3);
      }
    }
  }
}

// ../../node_modules/effect/dist/Struct.js
var pick = /* @__PURE__ */ dual(2, (self, keys3) => {
  return buildStruct(self, (k, v) => hasPropertyKey(keys3, k) ? [k, v] : void 0);
});
var omit2 = /* @__PURE__ */ dual(2, (self, keys3) => {
  return buildStruct(self, (k, v) => !hasPropertyKey(keys3, k) ? [k, v] : void 0);
});
var assign = /* @__PURE__ */ dual(2, (self, that) => {
  return {
    ...self,
    ...that
  };
});
var renameKeys = /* @__PURE__ */ dual(2, (self, mapping) => {
  return buildStruct(self, (k, v) => [Object.hasOwn(mapping, k) ? mapping[k] : k, v]);
});
var lambda = (f) => f;
function hasPropertyKey(keys3, key) {
  return keys3.some((candidate) => candidate === key || typeof candidate === "number" && String(candidate) === key);
}
function buildStruct(source, f) {
  const out = {};
  for (const k of Reflect.ownKeys(source)) {
    if (!Object.prototype.propertyIsEnumerable.call(source, k)) continue;
    const res = f(k, source[k]);
    if (res) {
      const [nk, nv] = res;
      assignProperty(out, nk, nv);
    }
  }
  return out;
}

// ../../node_modules/effect/dist/Optic.js
function makeIso(get8, set5) {
  return make20(primitiveNode("Iso", get8, set5));
}
function makeLens(get8, replace) {
  return make20(primitiveNode("Lens", get8, replace));
}
function primitiveNode(kind, get8, set5) {
  return [{
    _tag: "PrimitiveNode",
    kind,
    get: get8,
    set: set5
  }];
}
var identityOperation = {
  kind: "Iso",
  get: identity,
  set: identity
};
var PathNode = class {
  _tag = "PathNode";
  kind = "Lens";
  path;
  get;
  set;
  constructor(path) {
    this.path = path;
    this.get = (s) => {
      let out = s;
      for (let i = 0; i < path.length; i++) {
        out = out[path[i]];
      }
      return out;
    };
    this.set = (a, s) => {
      const out = cloneShallow(s);
      let current = out;
      let i = 0;
      for (; i < path.length - 1; i++) {
        const key = path[i];
        assignProperty(current, key, cloneShallow(current[key]));
        current = current[key];
      }
      assignProperty(current, path[i], a);
      return out;
    };
  }
};
var CheckNode = class {
  _tag = "CheckNode";
  kind = "Prism";
  checks;
  get;
  set = identity;
  constructor(checks) {
    this.checks = checks;
    this.get = (s) => runChecks(checks, s);
  }
};
function compose2(a, b) {
  if (a.length === 0) return b;
  if (b.length === 0) return a;
  const nodes = a.slice();
  for (let i = 0; i < b.length; i++) {
    const node = b[i];
    const last = nodes[nodes.length - 1];
    if (last._tag === "PathNode" && node._tag === "PathNode") {
      nodes[nodes.length - 1] = new PathNode([...last.path, ...node.path]);
    } else if (last._tag === "CheckNode" && node._tag === "CheckNode") {
      nodes[nodes.length - 1] = new CheckNode([...last.checks, ...node.checks]);
    } else {
      nodes.push(node);
    }
  }
  return nodes;
}
function makeOptional(getResult, set5) {
  return make20(primitiveNode("Optional", getResult, set5));
}
var OptionalImpl = class {
  /** @internal */
  node;
  getResult;
  replaceResult;
  constructor(node, getResult, replaceResult) {
    this.node = node;
    this.getResult = getResult;
    this.replaceResult = replaceResult;
  }
  replace(a, s) {
    return getOrElse2(this.replaceResult(a, s), () => s);
  }
  modify(f) {
    return (s) => getOrElse2(flatMap2(this.getResult(s), (a) => this.replaceResult(f(a), s)), () => s);
  }
  compose(that) {
    return make20(compose2(this.node, that.node));
  }
  key(key) {
    return make20(compose2(this.node, [new PathNode([key])]));
  }
  optionalKey(key) {
    return make20(compose2(this.node, primitiveNode("Lens", (s) => s[key], (a, s) => {
      const copy4 = cloneShallow(s);
      if (a === void 0) {
        if (Array.isArray(copy4) && (typeof key === "number" || typeof key === "string" && isCanonicalArrayIndex(key))) {
          copy4.splice(Number(key), 1);
        } else {
          delete copy4[key];
        }
      } else {
        assignProperty(copy4, key, a);
      }
      return copy4;
    })));
  }
  check(...checks) {
    return make20(compose2(this.node, [new CheckNode(checks)]));
  }
  refine(refinement, annotations) {
    return make20(compose2(this.node, [new CheckNode([makeFilterByGuard(refinement, annotations)])]));
  }
  tag(tag2) {
    const err = fail2(new InvalidValue({
      expected: `${JSON.stringify(tag2)} tag`
    }));
    return make20(compose2(this.node, primitiveNode("Prism", (s) => s._tag === tag2 ? succeed2(s) : err, identity)));
  }
  at(key, ..._rest) {
    const err = fail2(new Pointer([key], new MissingKey(void 0)));
    return make20(compose2(this.node, primitiveNode("Optional", (s) => Object.hasOwn(s, key) ? succeed2(s[key]) : err, (a, s) => {
      if (Object.hasOwn(s, key)) {
        const copy4 = cloneShallow(s);
        assignProperty(copy4, key, a);
        return succeed2(copy4);
      } else {
        return err;
      }
    })));
  }
  pick(keys3) {
    return this.compose(makeLens(pick(keys3), (p, a) => ({
      ...omit2(a, keys3),
      ...p
    })));
  }
  omit(keys3) {
    return this.compose(makeLens(omit2(keys3), (o, a) => ({
      ...pick(a, keys3),
      ...o
    })));
  }
  notUndefined() {
    return this.refine(isNotUndefined, {
      expected: "a value other than `undefined`"
    });
  }
  forEach(f) {
    const inner = f(id());
    return makeOptional(
      // GET: collect focused Bs
      (s) => map2(this.getResult(s), (as4) => {
        const bs = [];
        for (let i = 0; i < as4.length; i++) {
          const r = inner.getResult(as4[i]);
          if (isSuccess2(r)) bs.push(r.success);
        }
        return bs;
      }),
      // SET: bs must match the number of focusable elements
      (bs, s) => flatMap2(this.getResult(s), (as4) => {
        const idxs = [];
        for (let i = 0; i < as4.length; i++) {
          if (isSuccess2(inner.getResult(as4[i]))) idxs.push(i);
        }
        if (bs.length !== idxs.length) {
          return fail2(new InvalidValue({
            message: `each: replacement length mismatch: ${bs.length} !== ${idxs.length}`
          }));
        }
        const out = as4.slice();
        for (let k = 0; k < idxs.length; k++) {
          const i = idxs[k];
          const r = inner.replaceResult(bs[k], as4[i]);
          if (isFailure2(r)) {
            return fail2(new Pointer([i], r.failure));
          }
          out[i] = r.success;
        }
        return this.replaceResult(out, s);
      })
    );
  }
  modifyAll(f) {
    return (s) => getOrElse2(flatMap2(this.getResult(s), (as4) => this.replaceResult(as4.map(f), s)), () => s);
  }
};
var IsoImpl = class extends OptionalImpl {
  get;
  set;
  constructor(node, get8, set5) {
    super(node, (s) => succeed2(get8(s)), (a) => succeed2(set5(a)));
    this.get = get8;
    this.set = set5;
  }
  replace(a, _) {
    return this.set(a);
  }
  modify(f) {
    return (s) => this.set(f(this.get(s)));
  }
};
var LensImpl = class extends OptionalImpl {
  get;
  constructor(node, get8, replace) {
    super(node, (s) => succeed2(get8(s)), (a, s) => succeed2(replace(a, s)));
    this.get = get8;
    this.replace = replace;
  }
  modify(f) {
    return (s) => this.replace(f(this.get(s)), s);
  }
};
var PrismImpl = class extends OptionalImpl {
  set;
  constructor(node, getResult, set5) {
    super(node, getResult, (a, _) => succeed2(set5(a)));
    this.set = set5;
  }
  replace(a, _) {
    return this.set(a);
  }
  modify(f) {
    return (s) => getOrElse2(map2(this.getResult(s), (a) => this.set(f(a))), () => s);
  }
};
function make20(node) {
  let op = node[0] ?? identityOperation;
  if (node.length > 1) {
    const kind = node.reduce((kind2, step) => composeKind(kind2, step.kind), "Iso");
    op = {
      kind,
      get: compileGet(node, kind),
      set: compileSet(node, kind)
    };
  }
  switch (op.kind) {
    case "Iso":
      return new IsoImpl(node, op.get, op.set);
    case "Lens":
      return new LensImpl(node, op.get, op.set);
    case "Prism":
      return new PrismImpl(node, op.get, op.set);
    case "Optional":
      return new OptionalImpl(node, op.get, op.set);
  }
}
function cloneShallow(pojo) {
  if (Array.isArray(pojo)) return pojo.slice();
  if (typeof pojo === "object" && pojo !== null) {
    const proto = Object.getPrototypeOf(pojo);
    if (proto !== Object.prototype && proto !== null) {
      throw new Error("Cannot clone object with non-Object constructor or null prototype");
    }
    return {
      ...pojo
    };
  }
  return pojo;
}
function compileGet(nodes, kind) {
  return (s) => {
    for (let i = 0; i < nodes.length; i++) {
      const op = nodes[i];
      const result3 = op.get(s);
      if (hasFailingGet(op.kind)) {
        if (isFailure2(result3)) {
          return result3;
        }
        s = result3.success;
      } else {
        s = result3;
      }
    }
    return hasFailingGet(kind) ? succeed2(s) : s;
  };
}
function compileSet(nodes, kind) {
  if (hasSourceFreeSet(kind)) {
    return (a) => {
      for (let i = nodes.length - 1; i >= 0; i--) {
        a = nodes[i].set(a);
      }
      return a;
    };
  }
  return (a, s) => {
    const len = nodes.length;
    const sources = new Array(len);
    for (let i = 0; i < len; i++) {
      sources[i] = s;
      const op = nodes[i];
      if (hasFailingGet(op.kind)) {
        const result3 = op.get(s);
        if (isFailure2(result3)) {
          return result3;
        }
        s = result3.success;
      } else {
        s = op.get(s);
      }
    }
    for (let i = len - 1; i >= 0; i--) {
      const op = nodes[i];
      if (hasSourceFreeSet(op.kind)) {
        a = op.set(a);
      } else if (op.kind === "Lens") {
        a = op.set(a, sources[i]);
      } else {
        const result3 = op.set(a, sources[i]);
        if (isFailure2(result3)) {
          return result3;
        }
        a = result3.success;
      }
    }
    return kind === "Optional" ? succeed2(a) : a;
  };
}
function hasFailingGet(kind) {
  return kind === "Prism" || kind === "Optional";
}
function hasSourceFreeSet(kind) {
  return kind === "Iso" || kind === "Prism";
}
function composeKind(a, b) {
  if (a === "Iso") return b;
  if (b === "Iso" || a === b) return a;
  return "Optional";
}
var identityIso = /* @__PURE__ */ make20([]);
function id() {
  return identityIso;
}

// ../../node_modules/effect/dist/internal/schema/toIso.js
function toIso(schema2) {
  const serializer = toCodecIso(schema2);
  return makeIso(encodeSync(serializer), decodeSync(serializer));
}
function toIsoSource(_) {
  return id();
}
function toIsoFocus(_) {
  return id();
}

// ../../node_modules/effect/dist/internal/schemaError.js
var SchemaErrorTypeId = "~effect/Schema/SchemaError";
function isSchemaError(u) {
  return hasProperty(u, SchemaErrorTypeId) && u[SchemaErrorTypeId] === SchemaErrorTypeId;
}

// ../../node_modules/effect/dist/net/NetAddress.js
var TypeId24 = "~effect/net/NetAddress";
var ipv4Value = (self) => self.value;
var ipv6Words = (self) => self;
var getMacBytes = (self) => self.bytes;
var NetAddressError = class extends (/* @__PURE__ */ TaggedError2("NetAddressError")) {
};
var isAddress = (u) => hasProperty(u, TypeId24);
var isIpv4Address = (u) => isAddress(u) && u._tag === "Ipv4Address";
var isIpv6Address = (u) => isAddress(u) && u._tag === "Ipv6Address";
var isIpAddress = (u) => isIpv4Address(u) || isIpv6Address(u);
var width = (address) => isIpv4Address(address) ? 32 : 128;
var isMacAddress = (u) => isAddress(u) && u._tag === "MacAddress";
var isInetAddressV4 = (u) => isAddress(u) && u._tag === "InetAddressV4";
var isInetAddressV6 = (u) => isAddress(u) && u._tag === "InetAddressV6";
var isInetAddress = (u) => isInetAddressV4(u) || isInetAddressV6(u);
var isUnixPathAddress = (u) => isAddress(u) && u._tag === "UnixPathAddress";
var isSocketAddress = (u) => isInetAddress(u) || isUnixPathAddress(u);
var Ipv4Proto = {
  _tag: "Ipv4Address",
  [TypeId24]: TypeId24,
  [symbol2](that) {
    return isIpv4Address(that) && ipv4Value(this) === ipv4Value(that);
  },
  [symbol]() {
    return optimize(combine(ipv4HashSeed, ipv4Value(this) | 0));
  },
  toString() {
    return formatIp(this);
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var Ipv6Proto = {
  _tag: "Ipv6Address",
  [TypeId24]: TypeId24,
  [symbol2](that) {
    if (!isIpv6Address(that)) return false;
    const self = ipv6Words(this);
    const other = ipv6Words(that);
    return self.w0 === other.w0 && self.w1 === other.w1 && self.w2 === other.w2 && self.w3 === other.w3;
  },
  [symbol]() {
    const self = ipv6Words(this);
    let h = combine(ipv6HashSeed, self.w0 | 0);
    h = combine(h, self.w1 | 0);
    h = combine(h, self.w2 | 0);
    return optimize(combine(h, self.w3 | 0));
  },
  toString() {
    return formatIp(this);
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var MacProto = {
  _tag: "MacAddress",
  [TypeId24]: TypeId24,
  [symbol2](that) {
    return isMacAddress(that) && bytesEqual(getMacBytes(this), getMacBytes(that));
  },
  [symbol]() {
    return combine(macHashSeed, array(getMacBytes(this)));
  },
  toString() {
    return formatMacAddress(this);
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var bytesEqual = (self, that) => {
  if (self.length !== that.length) return false;
  for (let index2 = 0; index2 < self.length; index2++) {
    if (self[index2] !== that[index2]) return false;
  }
  return true;
};
var ipv4HashSeed = /* @__PURE__ */ string("Ipv4Address");
var ipv6HashSeed = /* @__PURE__ */ string("Ipv6Address");
var macHashSeed = /* @__PURE__ */ string("MacAddress");
var makeIpv4 = (value3) => {
  const self = Object.create(Ipv4Proto);
  self.value = value3 >>> 0;
  return Object.freeze(self);
};
var makeIpv6 = (w0, w1, w2, w3) => {
  const self = Object.create(Ipv6Proto);
  self.w0 = w0 >>> 0;
  self.w1 = w1 >>> 0;
  self.w2 = w2 >>> 0;
  self.w3 = w3 >>> 0;
  return Object.freeze(self);
};
var packOctets = (a, b, c, d) => (a << 24 | b << 16 | c << 8 | d) >>> 0;
var wordToOctets = (word) => [word >>> 24, word >>> 16 & 255, word >>> 8 & 255, word & 255];
var makeMac = (bytes2) => {
  const self = Object.assign(Object.create(MacProto), {
    bytes: new Uint8Array(bytes2)
  });
  return Object.freeze(self);
};
var addressError = (input, message) => fail2(new NetAddressError({
  input,
  message
}));
var ipv4FromOctets = (octets) => {
  if (!octets.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)) {
    return addressError(octets, "octets must be integers from 0 through 255");
  }
  return succeed2(makeIpv4(packOctets(octets[0], octets[1], octets[2], octets[3])));
};
var ipv6FromSegments = (segments) => {
  if (!segments.every((n) => Number.isInteger(n) && n >= 0 && n <= 65535)) {
    return addressError(segments, "segments must be integers from 0 through 65535");
  }
  return succeed2(makeIpv6(segments[0] * 65536 + segments[1], segments[2] * 65536 + segments[3], segments[4] * 65536 + segments[5], segments[6] * 65536 + segments[7]));
};
var macAddressFromString = (input) => {
  if (!/^(?:[0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/.test(input)) {
    return addressError(input, "expected six two-digit hexadecimal octets separated by colons");
  }
  return succeed2(makeMac(new Uint8Array(input.split(":").map((part) => Number.parseInt(part, 16)))));
};
var ipv4FromString = (input) => {
  const parts2 = input.split(".");
  if (parts2.length !== 4 || parts2.some((part) => !/^\d{1,3}$/.test(part))) {
    return addressError(input, "expected exactly four decimal octets");
  }
  if (parts2.some((part) => part.length > 1 && part[0] === "0")) {
    return addressError(input, "leading zeroes are not allowed");
  }
  const octets = parts2.map(Number);
  if (octets.some((part) => part > 255)) {
    return addressError(input, "octets must be at most 255");
  }
  return ipv4FromOctets([octets[0], octets[1], octets[2], octets[3]]);
};
var parseIpv6Segments = (input) => {
  if (input.includes("[") || input.includes("]") || input.includes("%")) {
    return addressError(input, "brackets and zone identifiers are not valid in a bare IPv6 address");
  }
  const halves = input.split("::");
  if (halves.length > 2) return addressError(input, "only one compression marker is allowed");
  const head5 = halves[0] === "" ? [] : halves[0].split(":");
  const tail = halves.length === 2 && halves[1] !== "" ? halves[1].split(":") : [];
  if (head5.some((part) => part === "") || tail.some((part) => part === "")) {
    return addressError(input, "empty segments are only valid in the compression marker");
  }
  const trailing = tail.length > 0 ? tail[tail.length - 1] : head5.length > 0 ? head5[head5.length - 1] : "";
  let embedded;
  if (trailing.includes(".")) {
    if (halves.length === 2 && tail.length === 0) {
      return addressError(input, "embedded IPv4 syntax must be trailing");
    }
    const parsed = map2(ipv4FromString(trailing), (address) => {
      const value3 = ipv4Value(address);
      return [value3 >>> 16, value3 & 65535];
    });
    if (isFailure2(parsed)) return parsed;
    embedded = parsed.success;
    if (tail.length > 0) tail.pop();
    else head5.pop();
  }
  const explicit = head5.length + tail.length + (embedded ? 2 : 0);
  if (halves.length === 1 ? explicit !== 8 : explicit >= 8) {
    return addressError(input, halves.length === 1 ? "expected eight segments" : "compression must replace at least one segment");
  }
  const parse3 = (part) => /^[0-9a-fA-F]{1,4}$/.test(part) ? Number.parseInt(part, 16) : void 0;
  const parsedHead = head5.map(parse3);
  const parsedTail = tail.map(parse3);
  if (parsedHead.some((part) => part === void 0) || parsedTail.some((part) => part === void 0)) {
    return addressError(input, "segments must contain one through four hexadecimal digits");
  }
  return succeed2([...parsedHead, ...Array(8 - explicit).fill(0), ...parsedTail, ...embedded ?? []]);
};
var ipv6FromString = (input) => {
  return flatMap2(parseIpv6Segments(input), (segments) => ipv6FromSegments(segments));
};
var ipFromString = (input) => {
  const result3 = input.includes(":") ? ipv6FromString(input) : ipv4FromString(input);
  return result3;
};
var ipv4ToOctets = (self) => wordToOctets(ipv4Value(self));
var ipv6ToSegments = (self) => {
  const {
    w0,
    w1,
    w2,
    w3
  } = ipv6Words(self);
  return [w0 >>> 16, w0 & 65535, w1 >>> 16, w1 & 65535, w2 >>> 16, w2 & 65535, w3 >>> 16, w3 & 65535];
};
var ipv6ToOctets = (self) => {
  const {
    w0,
    w1,
    w2,
    w3
  } = ipv6Words(self);
  return [...wordToOctets(w0), ...wordToOctets(w1), ...wordToOctets(w2), ...wordToOctets(w3)];
};
var formatMacAddress = (self) => Array.from(getMacBytes(self), (byte) => byte.toString(16).padStart(2, "0")).join(":");
var isMacBroadcast = (self) => getMacBytes(self).every((byte) => byte === 255);
var isMacMulticast = (self) => (getMacBytes(self)[0] & 1) !== 0;
var isMacUnicast = (self) => (getMacBytes(self)[0] & 1) === 0;
var isMacLocallyAdministered = (self) => (getMacBytes(self)[0] & 2) !== 0;
var isMacUniversallyAdministered = (self) => (getMacBytes(self)[0] & 2) === 0;
var formatIp = (self) => {
  if (isIpv4Address(self)) return ipv4ToOctets(self).join(".");
  const segments = ipv6ToSegments(self);
  if (isIpv4Mapped(self)) {
    return `::ffff:${segments[6] >> 8}.${segments[6] & 255}.${segments[7] >> 8}.${segments[7] & 255}`;
  }
  let bestStart = -1;
  let bestLength = 0;
  let start = -1;
  for (let index2 = 0; index2 <= 8; index2++) {
    if (index2 < 8 && segments[index2] === 0) {
      if (start === -1) start = index2;
    } else if (start !== -1) {
      if (index2 - start > bestLength) {
        bestStart = start;
        bestLength = index2 - start;
      }
      start = -1;
    }
  }
  if (bestLength < 2) return segments.map((segment) => segment.toString(16)).join(":");
  const head5 = segments.slice(0, bestStart).map((segment) => segment.toString(16)).join(":");
  const tail = segments.slice(bestStart + bestLength).map((segment) => segment.toString(16)).join(":");
  return `${head5}::${tail}`;
};
var isUnspecified = (self) => {
  if (isIpv4Address(self)) return ipv4Value(self) === 0;
  const {
    w0,
    w1,
    w2,
    w3
  } = ipv6Words(self);
  return w0 === 0 && w1 === 0 && w2 === 0 && w3 === 0;
};
var isLoopback = (self) => {
  if (isIpv4Address(self)) return ipv4Value(self) >>> 24 === 127;
  const {
    w0,
    w1,
    w2,
    w3
  } = ipv6Words(self);
  return w0 === 0 && w1 === 0 && w2 === 0 && w3 === 1;
};
var isMulticast = (self) => {
  if (isMacAddress(self)) return isMacMulticast(self);
  if (isIpv4Address(self)) return ipv4Value(self) >>> 28 === 14;
  return ipv6Words(self).w0 >>> 24 === 255;
};
var isBroadcast = (self) => isMacAddress(self) ? isMacBroadcast(self) : ipv4Value(self) === 4294967295;
var isUnicast = (self) => {
  if (isMacAddress(self)) return isMacUnicast(self);
  return !isMulticast(self) && !isUnspecified(self) && (!isIpv4Address(self) || !isBroadcast(self));
};
var isLinkLocal = (self) => {
  if (isIpv4Address(self)) return ipv4Value(self) >>> 16 === 43518;
  return (ipv6Words(self).w0 >>> 16 & 65472) === 65152;
};
var isPrivate = (self) => {
  const value3 = ipv4Value(self);
  return value3 >>> 24 === 10 || (value3 >>> 16 & 65520) === 44048 || value3 >>> 16 === 49320;
};
var isUniqueLocal = (self) => (ipv6Words(self).w0 >>> 24 & 254) === 252;
var isIpv4Mapped = (self) => {
  const {
    w0,
    w1,
    w2
  } = ipv6Words(self);
  return w0 === 0 && w1 === 0 && w2 === 65535;
};
var InetV4Proto = {
  _tag: "InetAddressV4",
  [TypeId24]: TypeId24,
  [symbol2](that) {
    return isInetAddressV4(that) && this.port === that.port && equals(this.address, that.address);
  },
  [symbol]() {
    return combine(hash(this.address), number(this.port));
  },
  toString() {
    return formatInet(this);
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var InetV6Proto = {
  _tag: "InetAddressV6",
  [TypeId24]: TypeId24,
  [symbol2](that) {
    return isInetAddressV6(that) && this.port === that.port && this.scopeId === that.scopeId && equals(this.address, that.address);
  },
  [symbol]() {
    return combine(combine(hash(this.address), number(this.port)), number(this.scopeId));
  },
  toString() {
    return formatInet(this);
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var checkPort = (port) => Number.isInteger(port) && port >= 0 && port <= 65535;
var inetAddressV4 = (address, port) => {
  if (!checkPort(port)) {
    return addressError(address, "port must be an integer from 0 through 65535");
  }
  const self = Object.create(InetV4Proto);
  self.address = address;
  self.port = port;
  return succeed2(Object.freeze(self));
};
var inetAddressV6 = (address, port, options3) => {
  if (!checkPort(port)) {
    return addressError(address, "port must be an integer from 0 through 65535");
  }
  const scopeId = options3?.scopeId ?? 0;
  if (!Number.isInteger(scopeId) || scopeId < 0 || scopeId > 4294967295) {
    return addressError(address, "scopeId must be an unsigned 32-bit integer");
  }
  const self = Object.create(InetV6Proto);
  self.address = address;
  self.port = port;
  self.scopeId = scopeId;
  return succeed2(Object.freeze(self));
};
var inetAddressFromString = (input) => {
  let host;
  let portText;
  let scopeId = 0;
  const bracketed = input.startsWith("[");
  if (bracketed) {
    const end = input.indexOf("]");
    if (end < 0 || input[end + 1] !== ":" || input.indexOf("]", end + 1) !== -1) {
      return addressError(input, "expected [IPv6]:port");
    }
    host = input.slice(1, end);
    portText = input.slice(end + 2);
    const scopeSeparator = host.indexOf("%");
    if (scopeSeparator !== -1) {
      const scopeText = host.slice(scopeSeparator + 1);
      if (host.indexOf("%", scopeSeparator + 1) !== -1 || !/^\d+$/.test(scopeText)) {
        return addressError(input, "scope identifier must be decimal");
      }
      scopeId = Number(scopeText);
      if (!Number.isInteger(scopeId) || scopeId > 4294967295) {
        return addressError(input, "scope identifier must be an unsigned 32-bit integer");
      }
      host = host.slice(0, scopeSeparator);
    }
  } else {
    const separator = input.lastIndexOf(":");
    if (separator < 0) {
      return addressError(input, "expected host:port or [IPv6]:port");
    }
    if (input.indexOf(":") !== separator) {
      return addressError(input, "IPv6 addresses must be bracketed");
    }
    host = input.slice(0, separator);
    portText = input.slice(separator + 1);
  }
  if (!/^(0|[1-9]\d*)$/.test(portText)) {
    return addressError(input, "port must be an unpadded decimal integer");
  }
  return flatMap2(ipFromString(host), (address) => {
    if (bracketed !== isIpv6Address(address)) {
      return addressError(input, "only IPv6 addresses use brackets");
    }
    return isIpv6Address(address) ? inetAddressV6(address, Number(portText), {
      scopeId
    }) : inetAddressV4(address, Number(portText));
  });
};
var formatHost = (self) => formatIp(self.address) + (isInetAddressV6(self) && self.scopeId !== 0 ? `%${self.scopeId}` : "");
var formatInet = (self) => {
  const host = formatHost(self);
  return isInetAddressV4(self) ? `${host}:${self.port}` : `[${host}]:${self.port}`;
};
var UnixPathProto = {
  _tag: "UnixPathAddress",
  [TypeId24]: TypeId24,
  [symbol2](that) {
    return isUnixPathAddress(that) && this.path === that.path;
  },
  [symbol]() {
    return combine(string("UnixPathAddress"), string(this.path));
  },
  toString() {
    return this.path;
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var unixPathAddress = (path) => {
  const self = Object.create(UnixPathProto);
  self.path = path;
  return Object.freeze(self);
};

// ../../node_modules/effect/dist/net/IpInterface.js
var TypeId25 = "~effect/net/IpInterface";
var isIpv4Interface = (u) => isIpInterface(u) && isIpv4Address(u.address);
var isIpv6Interface = (u) => isIpInterface(u) && isIpv6Address(u.address);
var isIpInterface = (u) => hasProperty(u, TypeId25);
var IpInterfaceProto = {
  _tag: "IpInterface",
  [TypeId25]: TypeId25,
  [symbol2](that) {
    return isIpInterface(that) && this.prefixLength === that.prefixLength && equals(this.address, that.address);
  },
  [symbol]() {
    return combine(hash(this.address), number(this.prefixLength));
  },
  toString() {
    return format5(this);
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var interfaceError = (input, message) => fail2(new NetAddressError({
  input,
  message
}));
var make21 = (address, prefixLength) => {
  const max5 = width(address);
  if (!Number.isInteger(prefixLength) || prefixLength < 0 || prefixLength > max5) {
    return interfaceError(address, `prefix length must be an integer from 0 through ${max5}`);
  }
  const self = Object.assign(Object.create(IpInterfaceProto), {
    address,
    prefixLength
  });
  return succeed2(Object.freeze(self));
};
var parseAddressWithPrefix = (input, options3) => {
  const slash = input.indexOf("/");
  if (slash === -1 && options3?.prefix !== "required") {
    return succeed2({
      address: input,
      prefixLength: void 0
    });
  }
  if (slash <= 0 || slash !== input.lastIndexOf("/") || slash === input.length - 1) {
    return interfaceError(input, "expected an address and prefix length separated by one slash");
  }
  const prefix = input.slice(slash + 1);
  if (!/^(0|[1-9][0-9]*)$/.test(prefix)) {
    return interfaceError(input, "prefix length must be an unpadded ASCII decimal integer");
  }
  return succeed2({
    address: input.slice(0, slash),
    prefixLength: Number(prefix)
  });
};
var ipv4FromString2 = (input, options3) => flatMap2(parseAddressWithPrefix(input, options3), (parts2) => flatMap2(ipv4FromString(parts2.address), (address) => make21(address, parts2.prefixLength ?? width(address))));
var ipv6FromString2 = (input, options3) => flatMap2(parseAddressWithPrefix(input, options3), (parts2) => flatMap2(ipv6FromString(parts2.address), (address) => make21(address, parts2.prefixLength ?? width(address))));
var fromString3 = (input, options3) => flatMap2(parseAddressWithPrefix(input, options3), (parts2) => flatMap2(ipFromString(parts2.address), (address) => make21(address, parts2.prefixLength ?? width(address))));
var format5 = (self) => `${formatIp(self.address)}/${self.prefixLength}`;

// ../../node_modules/effect/dist/net/IpNetwork.js
var TypeId26 = "~effect/net/IpNetwork";
var isIpv4Network = (u) => isIpNetwork(u) && isIpv4Address(u.address);
var isIpv6Network = (u) => isIpNetwork(u) && isIpv6Address(u.address);
var isIpNetwork = (u) => hasProperty(u, TypeId26);
var IpNetworkProto = {
  _tag: "IpNetwork",
  [TypeId26]: TypeId26,
  [symbol2](that) {
    return isIpNetwork(that) && this.prefixLength === that.prefixLength && equals(this.address, that.address);
  },
  [symbol]() {
    return combine(hash(this.address), number(this.prefixLength));
  },
  toString() {
    return format6(this);
  },
  toJSON() {
    return this.toString();
  },
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
};
var fromInterfaceValue = (value3) => {
  const self = Object.assign(Object.create(IpNetworkProto), {
    address: value3.address,
    prefixLength: value3.prefixLength
  });
  return Object.freeze(self);
};
var toBytes = (address) => isIpv4Address(address) ? ipv4ToOctets(address) : ipv6ToOctets(address);
var maskBytes = (bytes2, prefixLength) => {
  const wholeBytes = Math.floor(prefixLength / 8);
  const partialBits = prefixLength % 8;
  return bytes2.map((byte, index2) => {
    if (index2 < wholeBytes) return byte;
    if (index2 === wholeBytes && partialBits !== 0) return byte & (255 << 8 - partialBits & 255);
    return 0;
  });
};
var make22 = (address, prefixLength) => {
  return flatMap2(make21(address, prefixLength), (value3) => {
    const bytes2 = toBytes(address);
    const masked = maskBytes(bytes2, prefixLength);
    if (bytes2.some((byte, index2) => byte !== masked[index2])) {
      return fail2(new NetAddressError({
        input: address,
        message: "address has non-zero host bits"
      }));
    }
    return succeed2(fromInterfaceValue(value3));
  });
};
var ipv4FromString3 = (input) => {
  return flatMap2(ipv4FromString2(input, {
    prefix: "required"
  }), (value3) => make22(value3.address, value3.prefixLength));
};
var ipv6FromString3 = (input) => {
  return flatMap2(ipv6FromString2(input, {
    prefix: "required"
  }), (value3) => make22(value3.address, value3.prefixLength));
};
var fromString4 = (input) => {
  return flatMap2(fromString3(input, {
    prefix: "required"
  }), (value3) => make22(value3.address, value3.prefixLength));
};
var format6 = (self) => `${formatIp(self.address)}/${self.prefixLength}`;

// ../../node_modules/effect/dist/Schema.js
var TypeId27 = TypeId23;
function declareConstructor() {
  return (typeParameters, run3, annotations) => {
    return make23(new Declaration(typeParameters.map(getAST), (typeParameters2) => run3(typeParameters2.map((ast) => make23(ast))), annotations));
  };
}
function declare(is3, annotations) {
  return declareConstructor()([], () => (input, ast, options3) => is3(input) ? succeed6(input) : fail6(new InvalidType(ast, input, options3)), annotations);
}
function revealBottom(bottom) {
  return bottom;
}
function annotate2(annotations) {
  return (self) => self.annotate(annotations);
}
function annotateEncoded(annotations) {
  return (self) => flip4(flip4(self).annotate(annotations));
}
function annotateKey2(annotations) {
  return (self) => {
    return self.rebuild(annotateKey(self.ast, annotations));
  };
}
function revealCodec(codec) {
  return codec;
}
var SchemaError = class extends (/* @__PURE__ */ TaggedError2("SchemaError")) {
  [SchemaErrorTypeId] = SchemaErrorTypeId;
  constructor(issue) {
    const stackTraceLimit = getStackTraceLimit();
    setStackTraceLimit(0);
    try {
      super({
        issue
      });
    } finally {
      setStackTraceLimit(stackTraceLimit);
    }
  }
  get message() {
    return defaultFormatter(this.issue);
  }
  toString() {
    return `SchemaError(${this.message})`;
  }
};
function isSchemaError2(u) {
  return isSchemaError(u);
}
function fromIssueEffect(self) {
  if (effectIsExit(self)) {
    return fromIssueExit(self);
  }
  return catchCause3(self, (cause) => failCauseSync2(() => map6(cause, (issue) => new SchemaError(issue))));
}
function fromIssueExit(exit3) {
  return isSuccess4(exit3) ? exit3 : failCause2(map6(exit3.cause, (issue) => new SchemaError(issue)));
}
function getSchemaErrorOrThrow(cause, message) {
  let schemaError;
  for (const reason of cause.reasons) {
    if (!isFailReason2(reason) || !isSchemaError2(reason.error)) {
      throw new globalThis.Error(message, {
        cause
      });
    }
    schemaError ??= reason.error;
  }
  if (schemaError === void 0) {
    throw new globalThis.Error(message, {
      cause
    });
  }
  return schemaError;
}
function runSchemaErrorPromise(self) {
  return runPromiseExit2(self).then((exit3) => {
    if (isSuccess4(exit3)) {
      return exit3.value;
    }
    throw getSchemaErrorOrThrow(exit3.cause, "Promise adapter can only reject schema errors");
  });
}
function runSchemaErrorSync(self) {
  const exit3 = runSyncExit2(self);
  if (isSuccess4(exit3)) {
    return exit3.value;
  }
  throw getSchemaErrorOrThrow(exit3.cause, "Sync adapter can only throw schema errors");
}
function toStandardSchemaV12(self, options3) {
  return toStandardSchemaV1(self, options3);
}
function toStandardJSONSchemaV12(self) {
  return toStandardJSONSchemaV1(self);
}
var is2 = is;
var asserts2 = asserts;
function decodeUnknownEffect2(schema2, options3) {
  const parser = decodeUnknownEffect(schema2, options3);
  return (input, options4) => {
    return fromIssueEffect(parser(input, options4));
  };
}
var decodeEffect2 = decodeUnknownEffect2;
function decodeUnknownExit2(schema2, options3) {
  const parser = decodeUnknownExit(schema2, options3);
  return (input, options4) => {
    return fromIssueExit(parser(input, options4));
  };
}
var decodeExit = decodeUnknownExit2;
var decodeUnknownOption2 = decodeUnknownOption;
var decodeOption2 = decodeOption;
function decodeUnknownResult2(schema2, options3) {
  const parser = decodeUnknownResult(schema2, options3);
  return (input, options4) => {
    return mapError(parser(input, options4), (issue) => new SchemaError(issue));
  };
}
var decodeResult = decodeUnknownResult2;
function decodeUnknownPromise(schema2, options3) {
  const parser = decodeUnknownEffect2(schema2, options3);
  return (input, options4) => {
    return runSchemaErrorPromise(parser(input, options4));
  };
}
var decodePromise = decodeUnknownPromise;
function decodeUnknownSync2(schema2, options3) {
  const parser = decodeUnknownEffect2(schema2, options3);
  return (input, options4) => {
    return runSchemaErrorSync(parser(input, options4));
  };
}
var decodeSync2 = decodeUnknownSync2;
function encodeUnknownEffect2(schema2, options3) {
  const parser = encodeUnknownEffect(schema2, options3);
  return (input, options4) => {
    return fromIssueEffect(parser(input, options4));
  };
}
var encodeEffect2 = encodeUnknownEffect2;
function encodeUnknownExit2(schema2, options3) {
  const parser = encodeUnknownExit(schema2, options3);
  return (input, options4) => {
    return fromIssueExit(parser(input, options4));
  };
}
var encodeExit = encodeUnknownExit2;
var encodeUnknownOption2 = encodeUnknownOption;
var encodeOption2 = encodeOption;
function encodeUnknownResult2(schema2, options3) {
  const parser = encodeUnknownResult(schema2, options3);
  return (input, options4) => {
    return mapError(parser(input, options4), (issue) => new SchemaError(issue));
  };
}
var encodeResult = encodeUnknownResult2;
function encodeUnknownPromise(schema2, options3) {
  const parser = encodeUnknownEffect2(schema2, options3);
  return (input, options4) => {
    return runSchemaErrorPromise(parser(input, options4));
  };
}
var encodePromise = encodeUnknownPromise;
function encodeUnknownSync2(schema2, options3) {
  const parser = encodeUnknownEffect2(schema2, options3);
  return (input, options4) => {
    return runSchemaErrorSync(parser(input, options4));
  };
}
var encodeSync2 = encodeUnknownSync2;
var make23 = make19;
function isSchema(u) {
  return hasProperty(u, TypeId27) && u[TypeId27] === TypeId27;
}
var optionalKey2 = /* @__PURE__ */ lambda((schema2) => make23(optionalKey(schema2.ast), {
  schema: schema2
}));
var requiredKey = /* @__PURE__ */ lambda((self) => self.schema);
var optional2 = /* @__PURE__ */ lambda((self) => {
  const schema2 = UndefinedOr(self);
  return make23(optional(self.ast), {
    schema: schema2
  });
});
var required = /* @__PURE__ */ lambda((self) => self.schema.members[0]);
var mutableKey2 = /* @__PURE__ */ lambda((schema2) => make23(mutableKey(schema2.ast), {
  schema: schema2
}));
var readonlyKey = /* @__PURE__ */ lambda((self) => self.schema);
var toType2 = /* @__PURE__ */ lambda((schema2) => make23(toType(schema2.ast), {
  schema: schema2
}));
var toEncoded2 = /* @__PURE__ */ lambda((schema2) => make23(toEncoded(schema2.ast), {
  schema: schema2
}));
var FlipTypeId = "~effect/Schema/flip";
function isFlip$(schema2) {
  return hasProperty(schema2, FlipTypeId) && schema2[FlipTypeId] === FlipTypeId;
}
function flip4(schema2) {
  if (isFlip$(schema2)) {
    return schema2.schema.rebuild(flip3(schema2.ast));
  }
  return make23(flip3(schema2.ast), {
    [FlipTypeId]: FlipTypeId,
    schema: schema2
  });
}
function Literal2(literal) {
  const out = make23(new Literal(literal), {
    literal,
    transform(to) {
      return out.pipe(decodeTo2(Literal2(to), {
        decode: transform2(() => to),
        encode: transform2(() => literal)
      }));
    }
  });
  return out;
}
function templateLiteralParts(parts2) {
  return parts2.map((part) => isSchema(part) ? part.ast : new Literal(part));
}
function TemplateLiteral2(parts2) {
  return make23(new TemplateLiteral(templateLiteralParts(parts2)), {
    parts: parts2
  });
}
function TemplateLiteralParser(parts2) {
  return make23(templateLiteralParser(templateLiteralParts(parts2)), {
    parts: parts2
  });
}
function Enum2(enums) {
  return make23(new Enum(Object.keys(enums).filter((key) => typeof enums[enums[key]] !== "number").map((key) => [key, enums[key]])), {
    enums
  });
}
var Never2 = /* @__PURE__ */ make23(never3);
var Any2 = /* @__PURE__ */ make23(any);
var Unknown2 = /* @__PURE__ */ make23(unknown);
var Null2 = /* @__PURE__ */ make23(null_);
var Undefined2 = /* @__PURE__ */ make23(undefined_3);
var String6 = /* @__PURE__ */ make23(string2);
var StringForLiteralAutocomplete = String6;
var Number6 = /* @__PURE__ */ make23(number2);
var Boolean2 = /* @__PURE__ */ make23(boolean);
var Symbol3 = /* @__PURE__ */ make23(symbol3);
var BigInt6 = /* @__PURE__ */ make23(bigInt);
var Void2 = /* @__PURE__ */ make23(void_5);
var ObjectKeyword2 = /* @__PURE__ */ make23(objectKeyword);
function UniqueSymbol2(symbol4) {
  return make23(new UniqueSymbol(symbol4));
}
function makeStruct(ast, fields) {
  return make23(ast, {
    fields,
    mapFields(f, options3) {
      const fields2 = f(this.fields);
      return makeStruct(struct(fields2, options3?.unsafePreserveChecks ? this.ast.checks : void 0), fields2);
    }
  });
}
function Struct(fields) {
  return makeStruct(struct(fields, void 0), fields);
}
function fieldsAssign(fields) {
  return lambda((struct2) => struct2.mapFields(assign(fields)));
}
var canonicalPropertyKey = (key) => typeof key === "symbol" ? key : globalThis.String(key);
function encodeKeys(mapping) {
  return function(self) {
    const fields = {};
    const appliedMapping = /* @__PURE__ */ Object.create(null);
    const reverseMapping = /* @__PURE__ */ Object.create(null);
    const seenEncodedKeys = /* @__PURE__ */ new Set();
    for (const k of Reflect.ownKeys(self.fields)) {
      const encoded = toEncoded2(self.fields[k]);
      const hasMapping = Object.hasOwn(mapping, k);
      const encodedKey = hasMapping ? mapping[k] : k;
      const canonical = canonicalPropertyKey(encodedKey);
      if (seenEncodedKeys.has(canonical)) {
        throw new globalThis.Error(`Duplicate encoded keys: ${formatPropertyKey(encodedKey)}`);
      }
      seenEncodedKeys.add(canonical);
      assignProperty(fields, encodedKey, encoded);
      if (hasMapping) {
        appliedMapping[k] = encodedKey;
        reverseMapping[encodedKey] = k;
      }
    }
    return Struct(fields).pipe(decodeTo2(self, transform3({
      decode: renameKeys(reverseMapping),
      encode: renameKeys(appliedMapping)
    })));
  };
}
function extendTo(fields, derive) {
  return (self) => {
    const f = map3(self.fields, toType2);
    const to = Struct({
      ...f,
      ...fields
    });
    return self.pipe(decodeTo2(to, transform3({
      decode: (input) => {
        const out = {
          ...input
        };
        for (const k in fields) {
          const f2 = derive[k];
          const o = f2(input);
          if (isSome2(o)) {
            assignProperty(out, k, o.value);
          }
        }
        return out;
      },
      encode: (input) => {
        const out = {
          ...input
        };
        for (const k in fields) {
          delete out[k];
        }
        return out;
      }
    })));
  };
}
function Record(key, value3) {
  return make23(record(key.ast, value3.ast), {
    key,
    value: value3
  });
}
function StructWithRest(schema2, records) {
  return make23(structWithRest(schema2.ast, records.map(getAST)), {
    schema: schema2,
    records
  });
}
function makeTuple(ast, elements) {
  return make23(ast, {
    elements,
    mapElements(f, options3) {
      const elements2 = f(this.elements);
      return makeTuple(tuple(elements2, options3?.unsafePreserveChecks ? this.ast.checks : void 0), elements2);
    }
  });
}
function Tuple2(elements) {
  return makeTuple(tuple(elements), elements);
}
function TupleWithRest(schema2, rest) {
  return make23(tupleWithRest(schema2.ast, rest.map(getAST)), {
    schema: schema2,
    rest
  });
}
var ArraySchema = /* @__PURE__ */ lambda((schema2) => make23(new Arrays(false, [], [schema2.ast]), {
  value: schema2
}));
function withArrayLengthConstraints(self, minimum, maximum) {
  if (minimum !== void 0 && maximum !== void 0) {
    return self.check(isBetweenLength(minimum, maximum));
  }
  if (minimum !== void 0) return self.check(isMinLength(minimum));
  if (maximum !== void 0) return self.check(isMaxLength(maximum));
  return self;
}
var NonEmptyArray = /* @__PURE__ */ lambda((schema2) => make23(new Arrays(false, [schema2.ast], [schema2.ast]), {
  value: schema2
}));
function ArrayEnsure(schema2) {
  const many = ArraySchema(schema2);
  const to = ArraySchema(toType2(schema2));
  const one = decodeTo2(Tuple2([Unknown2]), transform3({
    decode: (value3) => [value3],
    encode: ([value3]) => value3
  }))(schema2);
  return make23(Union2([one, many]).pipe(decodeTo2(to)).ast, {
    from: Union2([schema2, many]),
    to
  });
}
function UniqueArray(item) {
  return ArraySchema(item).check(isUnique());
}
var mutable2 = /* @__PURE__ */ lambda((schema2) => make23(mutable(schema2.ast), {
  schema: schema2
}));
function makeUnion(ast, members) {
  return make23(ast, {
    members,
    mapMembers(f, options3) {
      const members2 = f(this.members);
      return makeUnion(union4(members2, this.ast.options, options3?.unsafePreserveChecks ? this.ast.checks : void 0), members2);
    }
  });
}
function Union2(members, options3) {
  return makeUnion(union4(members, options3, void 0), members);
}
function Literals(literals) {
  const members = literals.map(Literal2);
  return make23(union4(members, void 0, void 0), {
    literals,
    members,
    mapMembers(f) {
      return Union2(f(this.members));
    },
    pick(literals2) {
      return Literals(literals2);
    },
    transform(to) {
      return Union2(members.map((member, index2) => member.transform(to[index2])));
    }
  });
}
var NullOr = /* @__PURE__ */ lambda((self) => Union2([self, Null2]));
var UndefinedOr = /* @__PURE__ */ lambda((self) => Union2([self, Undefined2]));
var NullishOr = /* @__PURE__ */ lambda((self) => Union2([self, Null2, Undefined2]));
function suspend4(f) {
  return make23(new Suspend(() => f().ast));
}
function check(...checks) {
  return (self) => self.check(...checks);
}
function refine(refinement, annotations) {
  return (schema2) => make23(appendChecks(schema2.ast, [makeFilterByGuard(refinement, annotations)]), {
    schema: schema2
  });
}
function brand(identifier2) {
  return (schema2) => make23(schema2.ast, {
    schema: schema2,
    identifier: identifier2
  });
}
function fromBrand(identifier2, ctor) {
  return (self) => (
    // The constructor already guarantees a single concrete brand key.
    (ctor.checks ? self.check(...ctor.checks) : self).pipe(brand(identifier2))
  );
}
function middlewareDecoding2(decode5) {
  return (schema2) => make23(middlewareDecoding(schema2.ast, new Middleware(decode5, identity)), {
    schema: schema2
  });
}
function middlewareEncoding2(encode5) {
  return (schema2) => make23(middlewareEncoding(schema2.ast, new Middleware(identity, encode5)), {
    schema: schema2
  });
}
function catchDecoding(f) {
  return catchDecodingWithContext(f);
}
function catchDecodingWithContext(f) {
  return (self) => middlewareDecoding2(catchEager2(f))(self);
}
function catchEncoding(f) {
  return catchEncodingWithContext(f);
}
function catchEncodingWithContext(f) {
  return (self) => middlewareEncoding2(catchEager2(f))(self);
}
function decodeTo2(to, transformation) {
  return (from) => {
    return make23(decodeTo(from.ast, to.ast, transformation ? makeTransformation(transformation) : passthrough3()), {
      from,
      to
    });
  };
}
function linkDecoding() {
  return (to, decode5) => link()(to, {
    decode: decode5,
    encode: forbiddenEncoding
  });
}
var TrueLiterals = /* @__PURE__ */ Literals(["true", "yes", "on", "1", "y"]);
var FalseLiterals = /* @__PURE__ */ Literals(["false", "no", "off", "0", "n"]);
var BooleanLiterals = /* @__PURE__ */ Literals([...TrueLiterals.literals, ...FalseLiterals.literals]).pipe(/* @__PURE__ */ decodeTo2(Boolean2, /* @__PURE__ */ transform3({
  decode: (value3) => value3 === "true" || value3 === "yes" || value3 === "on" || value3 === "1" || value3 === "y",
  encode: (value3) => value3 ? "true" : "false"
})));
function decode4(transformation) {
  return (self) => {
    return decodeTo2(toType2(self), transformation)(self);
  };
}
function encodeTo(to, transformation) {
  return (from) => {
    return transformation ? decodeTo2(from, transformation)(to) : decodeTo2(from)(to);
  };
}
function encode4(transformation) {
  return (self) => {
    return decodeTo2(self, transformation)(toEncoded2(self));
  };
}
function withConstructorDefault2(defaultValue) {
  return (schema2) => make23(withConstructorDefault(schema2.ast, defaultValue), {
    schema: schema2
  });
}
function toIssueEffect(self) {
  return catchCause3(self, (cause) => failCauseSync2(() => map6(cause, (error) => error.issue)));
}
function withDecodingDefaultKey(defaultValue, options3) {
  const encode5 = options3?.encodingStrategy === "omit" ? omit() : passthrough2();
  return (self) => {
    return optionalKey2(toEncoded2(self)).pipe(decodeTo2(self, {
      decode: withDefault(toIssueEffect(defaultValue)),
      encode: encode5
    }));
  };
}
function withDecodingDefaultTypeKey(defaultValue, options3) {
  return (self) => {
    return toType2(self).pipe(withDecodingDefaultKey(defaultValue, options3), encodeTo(optionalKey2(self)));
  };
}
function withDecodingDefault(defaultValue, options3) {
  const encode5 = options3?.encodingStrategy === "omit" ? omit() : passthrough2();
  return (self) => {
    return optional2(toEncoded2(self)).pipe(decodeTo2(self, {
      decode: withDefault(toIssueEffect(defaultValue)),
      encode: encode5
    }));
  };
}
function withDecodingDefaultType(defaultValue, options3) {
  return (self) => {
    return toType2(self).pipe(withDecodingDefault(defaultValue, options3), encodeTo(optional2(self)));
  };
}
function tag(literal) {
  return Literal2(literal).pipe(withConstructorDefault2(succeed6(literal)));
}
function tagDefaultOmit(literal) {
  return tag(literal).pipe(withDecodingDefaultKey(succeed6(literal), {
    encodingStrategy: "omit"
  }));
}
function TaggedStruct(value3, fields) {
  return Struct({
    _tag: tag(value3),
    ...fields
  });
}
function toTaggedUnion(tag2) {
  return (self) => {
    const cases = {};
    const discriminants = [];
    const discriminantKeys = /* @__PURE__ */ new Set();
    const guards = {};
    const isAnyOf = (keys3) => (value3) => keys3.includes(value3[tag2]);
    walk(self);
    return Object.assign(self, {
      cases,
      discriminants,
      isAnyOf,
      guards,
      match: match7,
      matchOrElse
    });
    function walk(schema2) {
      const ast = schema2.ast;
      if (isUnion(ast) && "members" in schema2 && globalThis.Array.isArray(schema2.members) && schema2.members.every(isSchema)) {
        return schema2.members.forEach(walk);
      }
      const sentinels = collectSentinels(ast);
      if (sentinels.length > 0) {
        const literal = sentinels.find((s) => s.key === tag2)?.literal;
        if (isPropertyKey(literal)) {
          const key = typeof literal === "number" ? globalThis.String(literal) : literal;
          if (discriminantKeys.has(key)) {
            throw new globalThis.Error(`Duplicate discriminant: ${globalThis.String(literal)}`);
          }
          discriminantKeys.add(key);
          discriminants.push(literal);
          assignProperty(cases, literal, schema2);
          assignProperty(guards, literal, is(toType2(schema2)));
          return;
        }
      }
      throw new globalThis.Error("No literal or unique symbol found");
    }
    function match7() {
      if (arguments.length === 1) {
        const cases3 = arguments[0];
        return function(value4) {
          const key2 = value4[tag2];
          const handler2 = Object.hasOwn(cases3, key2) ? cases3[key2] : void 0;
          return handler2(value4);
        };
      }
      const value3 = arguments[0];
      const cases2 = arguments[1];
      const key = value3[tag2];
      const handler = Object.hasOwn(cases2, key) ? cases2[key] : void 0;
      return handler(value3);
    }
    function matchOrElse() {
      if (arguments.length === 2) {
        const cases3 = arguments[0];
        const orElse3 = arguments[1];
        return function(value4) {
          const key2 = value4[tag2];
          const handler2 = Object.hasOwn(cases3, key2) ? cases3[key2] ?? orElse3 : orElse3;
          return handler2(value4);
        };
      }
      const value3 = arguments[0];
      const cases2 = arguments[1];
      const orElse2 = arguments[2];
      const key = value3[tag2];
      const handler = Object.hasOwn(cases2, key) ? cases2[key] ?? orElse2 : orElse2;
      return handler(value3);
    }
  };
}
function TaggedUnion(casesByTag) {
  const cases = {};
  const members = [];
  for (const key of Object.keys(casesByTag)) {
    const member = TaggedStruct(key, casesByTag[key]);
    assignProperty(cases, key, member);
    members.push(member);
  }
  const union5 = Union2(members);
  const {
    guards,
    isAnyOf,
    match: match7,
    matchOrElse
  } = toTaggedUnion("_tag")(union5);
  return make23(union5.ast, {
    cases,
    isAnyOf,
    guards,
    match: match7,
    matchOrElse
  });
}
function Opaque() {
  return (schema2) => schema2;
}
function instanceOf(constructor, annotations) {
  return declare((u) => u instanceof constructor, annotations);
}
function link() {
  return (encodeTo2, transformation) => {
    return new Link(encodeTo2.ast, makeTransformation(transformation));
  };
}
var makeFilter2 = makeFilter;
function makeFilterGroup(checks, annotations = void 0) {
  return new FilterGroup(checks, annotations);
}
var TRIMMED_PATTERN = "^\\S[\\s\\S]*\\S$|^\\S$|^$";
function isTrimmed(annotations) {
  const regExp = new globalThis.RegExp(TRIMMED_PATTERN);
  return makeFilter2((s) => s.trim() === s, {
    expected: "a string with no leading or trailing whitespace",
    representation: {
      id: "effect/schema/isTrimmed",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: regExp.source
    }),
    toCode: () => ({
      runtime: "Schema.isTrimmed()"
    }),
    arbitraryConstraint: {
      patterns: [{
        source: TRIMMED_PATTERN,
        flags: ""
      }]
    },
    ...annotations
  });
}
function isPattern2(regExp, annotations) {
  const source = regExp.source;
  const flags = regExp.flags;
  const canExport = /^[dg]*uy?$/.test(flags);
  const runtimeRegExp = flags === "" ? `new RegExp(${format(source)})` : `new RegExp(${format(source)}, ${format(flags)})`;
  return isPattern(regExp, {
    toJsonSchema: () => canExport ? {
      pattern: flags.endsWith("y") ? `^(?:${source})` : source
    } : [{}, true],
    toCode: () => ({
      runtime: `Schema.isPattern(${runtimeRegExp})`
    }),
    ...annotations
  });
}
function isStringFinite2(annotations) {
  return isStringFinite({
    toCode: () => ({
      runtime: "Schema.isStringFinite()"
    }),
    ...annotations
  });
}
function isStringBigInt2(annotations) {
  return isStringBigInt({
    toCode: () => ({
      runtime: "Schema.isStringBigInt()"
    }),
    ...annotations
  });
}
function isStringSymbol2(annotations) {
  return isStringSymbol({
    toCode: () => ({
      runtime: "Schema.isStringSymbol()"
    }),
    ...annotations
  });
}
var getUUIDRegExp = (version) => {
  if (version) {
    return new globalThis.RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
  }
  return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|[fF]{8}-[fF]{4}-[fF]{4}-[fF]{4}-[fF]{12})$/;
};
function isUUID(version, annotations) {
  const regExp = getUUIDRegExp(version);
  return isPattern2(regExp, {
    expected: version ? `a UUID v${version}` : "a UUID",
    representation: {
      id: "effect/schema/isUUID",
      payload: {
        version: version ?? null
      }
    },
    toJsonSchema: () => ({
      pattern: regExp.source,
      format: "uuid"
    }),
    toCode: () => ({
      runtime: version === void 0 ? "Schema.isUUID()" : `Schema.isUUID(${version})`
    }),
    ...annotations
  });
}
var GUID_REGEXP = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
function isGUID(annotations) {
  return isPattern2(GUID_REGEXP, {
    expected: "a GUID",
    representation: {
      id: "effect/schema/isGUID",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: GUID_REGEXP.source
    }),
    toCode: () => ({
      runtime: "Schema.isGUID()"
    }),
    ...annotations
  });
}
function isULID(annotations) {
  const regExp = /^[0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{26}$/;
  return isPattern2(regExp, {
    representation: {
      id: "effect/schema/isULID",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: regExp.source
    }),
    toCode: () => ({
      runtime: "Schema.isULID()"
    }),
    ...annotations
  });
}
function isBase64(annotations) {
  const regExp = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return isPattern2(regExp, {
    expected: "a base64 encoded string",
    representation: {
      id: "effect/schema/isBase64",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: regExp.source
    }),
    toCode: () => ({
      runtime: "Schema.isBase64()"
    }),
    ...annotations
  });
}
function isBase64Url(annotations) {
  const regExp = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
  return isPattern2(regExp, {
    expected: "a base64url encoded string",
    representation: {
      id: "effect/schema/isBase64Url",
      payload: null
    },
    toJsonSchema: () => ({
      pattern: regExp.source
    }),
    toCode: () => ({
      runtime: "Schema.isBase64Url()"
    }),
    ...annotations
  });
}
function literalToJsonSchema(literal, original, pattern) {
  if (literal.length === 0) return original.length === 0 ? {} : [{}, true];
  const constraint = {
    pattern: new globalThis.RegExp(pattern).source
  };
  return literal === original ? constraint : [constraint, true];
}
function isStartingWith(startsWith, annotations) {
  const formatted = JSON.stringify(startsWith);
  const regExp = new globalThis.RegExp(`^${escape(startsWith)}`);
  const jsonSchemaLiteral = startsWith.replace(/[\uD800-\uDBFF]$/, "");
  return makeFilter2((s) => s.startsWith(startsWith), {
    expected: `a string starting with ${formatted}`,
    representation: {
      id: "effect/schema/isStartingWith",
      payload: {
        startsWith
      }
    },
    toJsonSchema: () => literalToJsonSchema(jsonSchemaLiteral, startsWith, `^${escape(jsonSchemaLiteral)}`),
    toCode: () => ({
      runtime: `Schema.isStartingWith(${format(startsWith)})`
    }),
    arbitraryConstraint: {
      patterns: [{
        source: regExp.source,
        flags: regExp.flags
      }]
    },
    ...annotations
  });
}
function isEndingWith(endsWith, annotations) {
  const formatted = JSON.stringify(endsWith);
  const regExp = new globalThis.RegExp(`${escape(endsWith)}$`);
  const jsonSchemaLiteral = endsWith.replace(/^[\uDC00-\uDFFF]/, "");
  return makeFilter2((s) => s.endsWith(endsWith), {
    expected: `a string ending with ${formatted}`,
    representation: {
      id: "effect/schema/isEndingWith",
      payload: {
        endsWith
      }
    },
    toJsonSchema: () => literalToJsonSchema(jsonSchemaLiteral, endsWith, `${escape(jsonSchemaLiteral)}$`),
    toCode: () => ({
      runtime: `Schema.isEndingWith(${format(endsWith)})`
    }),
    arbitraryConstraint: {
      patterns: [{
        source: regExp.source,
        flags: regExp.flags
      }]
    },
    ...annotations
  });
}
function isIncluding(includes, annotations) {
  const formatted = JSON.stringify(includes);
  const regExp = new globalThis.RegExp(escape(includes));
  const jsonSchemaLiteral = includes.replace(/^[\uDC00-\uDFFF]|[\uD800-\uDBFF]$/g, "");
  return makeFilter2((s) => s.includes(includes), {
    expected: `a string including ${formatted}`,
    representation: {
      id: "effect/schema/isIncluding",
      payload: {
        includes
      }
    },
    toJsonSchema: () => literalToJsonSchema(jsonSchemaLiteral, includes, escape(jsonSchemaLiteral)),
    toCode: () => ({
      runtime: `Schema.isIncluding(${format(includes)})`
    }),
    arbitraryConstraint: {
      patterns: [{
        source: regExp.source,
        flags: regExp.flags
      }]
    },
    ...annotations
  });
}
var UPPERCASED_PATTERN = "^[^a-z]*$";
function isUppercased(annotations) {
  const regExp = new globalThis.RegExp(UPPERCASED_PATTERN);
  return makeFilter2((s) => s.toUpperCase() === s, {
    expected: "a string with all characters in uppercase",
    representation: {
      id: "effect/schema/isUppercased",
      payload: null
    },
    toJsonSchema: () => [{
      pattern: regExp.source
    }, true],
    toCode: () => ({
      runtime: "Schema.isUppercased()"
    }),
    arbitraryConstraint: {
      patterns: [{
        source: UPPERCASED_PATTERN,
        flags: ""
      }]
    },
    ...annotations
  });
}
var LOWERCASED_PATTERN = "^[^A-Z]*$";
function isLowercased(annotations) {
  const regExp = new globalThis.RegExp(LOWERCASED_PATTERN);
  return makeFilter2((s) => s.toLowerCase() === s, {
    expected: "a string with all characters in lowercase",
    representation: {
      id: "effect/schema/isLowercased",
      payload: null
    },
    toJsonSchema: () => [{
      pattern: regExp.source
    }, true],
    toCode: () => ({
      runtime: "Schema.isLowercased()"
    }),
    arbitraryConstraint: {
      patterns: [{
        source: LOWERCASED_PATTERN,
        flags: ""
      }]
    },
    ...annotations
  });
}
var CAPITALIZED_PATTERN = "^(?:[^a-z][\\s\\S]*)?$";
function isCapitalized(annotations) {
  const regExp = new globalThis.RegExp(CAPITALIZED_PATTERN);
  return makeFilter2((s) => s.charAt(0).toUpperCase() === s.charAt(0), {
    expected: "a string with the first character in uppercase",
    representation: {
      id: "effect/schema/isCapitalized",
      payload: null
    },
    toJsonSchema: () => [{
      pattern: regExp.source
    }, true],
    toCode: () => ({
      runtime: "Schema.isCapitalized()"
    }),
    arbitraryConstraint: {
      patterns: [{
        source: CAPITALIZED_PATTERN,
        flags: ""
      }]
    },
    ...annotations
  });
}
var UNCAPITALIZED_PATTERN = "^(?:[^A-Z][\\s\\S]*)?$";
function isUncapitalized(annotations) {
  const regExp = new globalThis.RegExp(UNCAPITALIZED_PATTERN);
  return makeFilter2((s) => s.charAt(0).toLowerCase() === s.charAt(0), {
    expected: "a string with the first character in lowercase",
    representation: {
      id: "effect/schema/isUncapitalized",
      payload: null
    },
    toJsonSchema: () => [{
      pattern: regExp.source
    }, true],
    toCode: () => ({
      runtime: "Schema.isUncapitalized()"
    }),
    arbitraryConstraint: {
      patterns: [{
        source: UNCAPITALIZED_PATTERN,
        flags: ""
      }]
    },
    ...annotations
  });
}
var Finite = /* @__PURE__ */ make23(finite);
var isFinite3 = isFinite2;
function makeIsGreaterThan(options3) {
  const gt = isGreaterThan(options3.order);
  const formatter = options3.formatter ?? format;
  return (exclusiveMinimum, annotations) => {
    return makeFilter2((input) => gt(input, exclusiveMinimum), {
      expected: `a value greater than ${formatter(exclusiveMinimum)}`,
      arbitraryConstraint: {
        order: options3.order,
        minimum: exclusiveMinimum,
        exclusiveMinimum: true
      },
      ...options3.annotate?.(exclusiveMinimum),
      ...annotations
    });
  };
}
function makeIsGreaterThanOrEqualTo(options3) {
  const gte = isGreaterThanOrEqualTo(options3.order);
  const formatter = options3.formatter ?? format;
  return (minimum, annotations) => {
    return makeFilter2((input) => gte(input, minimum), {
      expected: `a value greater than or equal to ${formatter(minimum)}`,
      arbitraryConstraint: {
        order: options3.order,
        minimum
      },
      ...options3.annotate?.(minimum),
      ...annotations
    });
  };
}
function makeIsLessThan(options3) {
  const lt = isLessThan(options3.order);
  const formatter = options3.formatter ?? format;
  return (exclusiveMaximum, annotations) => {
    return makeFilter2((input) => lt(input, exclusiveMaximum), {
      expected: `a value less than ${formatter(exclusiveMaximum)}`,
      arbitraryConstraint: {
        order: options3.order,
        maximum: exclusiveMaximum,
        exclusiveMaximum: true
      },
      ...options3.annotate?.(exclusiveMaximum),
      ...annotations
    });
  };
}
function makeIsLessThanOrEqualTo(options3) {
  const lte = isLessThanOrEqualTo(options3.order);
  const formatter = options3.formatter ?? format;
  return (maximum, annotations) => {
    return makeFilter2((input) => lte(input, maximum), {
      expected: `a value less than or equal to ${formatter(maximum)}`,
      arbitraryConstraint: {
        order: options3.order,
        maximum
      },
      ...options3.annotate?.(maximum),
      ...annotations
    });
  };
}
function makeIsBetween(deriveOptions) {
  const greaterThanOrEqualTo = isGreaterThanOrEqualTo(deriveOptions.order);
  const greaterThan = isGreaterThan(deriveOptions.order);
  const lessThanOrEqualTo = isLessThanOrEqualTo(deriveOptions.order);
  const lessThan = isLessThan(deriveOptions.order);
  const formatter = deriveOptions.formatter ?? format;
  return (options3, annotations) => {
    const gte = options3.exclusiveMinimum ? greaterThan : greaterThanOrEqualTo;
    const lte = options3.exclusiveMaximum ? lessThan : lessThanOrEqualTo;
    return makeFilter2((input) => gte(input, options3.minimum) && lte(input, options3.maximum), {
      expected: `a value between ${formatter(options3.minimum)}${options3.exclusiveMinimum ? " (excluded)" : ""} and ${formatter(options3.maximum)}${options3.exclusiveMaximum ? " (excluded)" : ""}`,
      arbitraryConstraint: {
        order: deriveOptions.order,
        minimum: options3.minimum,
        maximum: options3.maximum,
        ...options3.exclusiveMinimum && {
          exclusiveMinimum: true
        },
        ...options3.exclusiveMaximum && {
          exclusiveMaximum: true
        }
      },
      ...deriveOptions.annotate?.(options3),
      ...annotations
    });
  };
}
function makeIsMultipleOf(options3) {
  return (divisor, annotations) => {
    const formatter = options3.formatter ?? format;
    return makeFilter2((input) => options3.remainder(input, divisor) === options3.zero, {
      expected: `a value that is a multiple of ${formatter(divisor)}`,
      ...options3.annotate?.(divisor),
      ...annotations
    });
  };
}
function encodeNumberPayload(number3) {
  if (!globalThis.Number.isFinite(number3)) {
    throw new globalThis.RangeError(`Expected a finite number, got ${format(number3)}`);
  }
  return number3;
}
var isGreaterThan4 = /* @__PURE__ */ makeIsGreaterThan({
  order: Number2,
  annotate: (exclusiveMinimum) => ({
    representation: {
      id: "effect/schema/isGreaterThan",
      payload: {
        exclusiveMinimum: encodeNumberPayload(exclusiveMinimum)
      }
    },
    toJsonSchema: () => ({
      exclusiveMinimum
    }),
    toCode: () => ({
      runtime: `Schema.isGreaterThan(${format(exclusiveMinimum)})`
    })
  })
});
var isGreaterThanOrEqualTo4 = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
  order: Number2,
  annotate: (minimum) => ({
    representation: {
      id: "effect/schema/isGreaterThanOrEqualTo",
      payload: {
        minimum: encodeNumberPayload(minimum)
      }
    },
    toJsonSchema: () => ({
      minimum
    }),
    toCode: () => ({
      runtime: `Schema.isGreaterThanOrEqualTo(${format(minimum)})`
    })
  })
});
var isLessThan4 = /* @__PURE__ */ makeIsLessThan({
  order: Number2,
  annotate: (exclusiveMaximum) => ({
    representation: {
      id: "effect/schema/isLessThan",
      payload: {
        exclusiveMaximum: encodeNumberPayload(exclusiveMaximum)
      }
    },
    toJsonSchema: () => ({
      exclusiveMaximum
    }),
    toCode: () => ({
      runtime: `Schema.isLessThan(${format(exclusiveMaximum)})`
    })
  })
});
var isLessThanOrEqualTo5 = /* @__PURE__ */ makeIsLessThanOrEqualTo({
  order: Number2,
  annotate: (maximum) => ({
    representation: {
      id: "effect/schema/isLessThanOrEqualTo",
      payload: {
        maximum: encodeNumberPayload(maximum)
      }
    },
    toJsonSchema: () => ({
      maximum
    }),
    toCode: () => ({
      runtime: `Schema.isLessThanOrEqualTo(${format(maximum)})`
    })
  })
});
var isBetween2 = /* @__PURE__ */ makeIsBetween({
  order: Number2,
  annotate: (options3) => {
    const exclusiveMinimum = options3.exclusiveMinimum ? true : void 0;
    const exclusiveMaximum = options3.exclusiveMaximum ? true : void 0;
    const payload = {
      minimum: encodeNumberPayload(options3.minimum),
      maximum: encodeNumberPayload(options3.maximum),
      ...exclusiveMinimum && {
        exclusiveMinimum
      },
      ...exclusiveMaximum && {
        exclusiveMaximum
      }
    };
    return {
      representation: {
        id: "effect/schema/isBetween",
        payload
      },
      toJsonSchema: () => ({
        [exclusiveMinimum ? "exclusiveMinimum" : "minimum"]: options3.minimum,
        [exclusiveMaximum ? "exclusiveMaximum" : "maximum"]: options3.maximum
      }),
      toCode: () => ({
        runtime: `Schema.isBetween({ minimum: ${format(options3.minimum)}, maximum: ${format(options3.maximum)}, exclusiveMinimum: ${format(exclusiveMinimum)}, exclusiveMaximum: ${format(exclusiveMaximum)} })`
      })
    };
  }
});
function isMultipleOf(divisor, annotations) {
  if (!globalThis.Number.isFinite(divisor) || divisor === 0) {
    throw new globalThis.RangeError(`Expected a finite non-zero number, got ${globalThis.String(divisor)}`);
  }
  divisor = globalThis.Math.abs(divisor);
  return makeFilter2((input) => remainder(input, divisor) === 0, {
    expected: `a value that is a multiple of ${divisor}`,
    representation: {
      id: "effect/schema/isMultipleOf",
      payload: {
        divisor
      }
    },
    toJsonSchema: () => ({
      multipleOf: divisor
    }),
    toCode: () => ({
      runtime: `Schema.isMultipleOf(${format(divisor)})`
    }),
    ...annotations
  });
}
function isInt(annotations) {
  return makeFilter2((n) => globalThis.Number.isSafeInteger(n), {
    expected: "an integer",
    representation: {
      id: "effect/schema/isInt",
      payload: null
    },
    toJsonSchema: () => [{
      type: "integer"
    }, true],
    toCode: () => ({
      runtime: "Schema.isInt()"
    }),
    arbitraryConstraint: {
      number: "integer"
    },
    ...annotations
  });
}
var Int = /* @__PURE__ */ Number6.check(/* @__PURE__ */ isInt());
var Natural = /* @__PURE__ */ Int.check(/* @__PURE__ */ isGreaterThanOrEqualTo4(0));
function isInt32(annotations) {
  return new FilterGroup([isInt(), isBetween2({
    minimum: -2147483648,
    maximum: 2147483647
  })], {
    expected: "a 32-bit integer",
    ...annotations
  });
}
function isUint32(annotations) {
  return new FilterGroup([isInt(), isBetween2({
    minimum: 0,
    maximum: 4294967295
  })], {
    expected: "a 32-bit unsigned integer",
    ...annotations
  });
}
function encodeDatePayload(date) {
  if (globalThis.Number.isNaN(date.getTime())) {
    throw new globalThis.RangeError(`Expected a valid Date, got ${format(date)}`);
  }
  return date.toISOString();
}
function formatDateRuntime(date) {
  return `new Date(${format(date.getTime())})`;
}
var isGreaterThanDate = /* @__PURE__ */ makeIsGreaterThan({
  order: Date2,
  annotate: (exclusiveMinimum) => {
    const encoded = encodeDatePayload(exclusiveMinimum);
    return {
      representation: {
        id: "effect/schema/isGreaterThanDate",
        payload: {
          exclusiveMinimum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isGreaterThanDate(${formatDateRuntime(exclusiveMinimum)})`
      })
    };
  }
});
var isGreaterThanOrEqualToDate = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
  order: Date2,
  annotate: (minimum) => {
    const encoded = encodeDatePayload(minimum);
    return {
      representation: {
        id: "effect/schema/isGreaterThanOrEqualToDate",
        payload: {
          minimum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isGreaterThanOrEqualToDate(${formatDateRuntime(minimum)})`
      })
    };
  }
});
var isLessThanDate = /* @__PURE__ */ makeIsLessThan({
  order: Date2,
  annotate: (exclusiveMaximum) => {
    const encoded = encodeDatePayload(exclusiveMaximum);
    return {
      representation: {
        id: "effect/schema/isLessThanDate",
        payload: {
          exclusiveMaximum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isLessThanDate(${formatDateRuntime(exclusiveMaximum)})`
      })
    };
  }
});
var isLessThanOrEqualToDate = /* @__PURE__ */ makeIsLessThanOrEqualTo({
  order: Date2,
  annotate: (maximum) => {
    const encoded = encodeDatePayload(maximum);
    return {
      representation: {
        id: "effect/schema/isLessThanOrEqualToDate",
        payload: {
          maximum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isLessThanOrEqualToDate(${formatDateRuntime(maximum)})`
      })
    };
  }
});
var isBetweenDate = /* @__PURE__ */ makeIsBetween({
  order: Date2,
  annotate: (options3) => {
    const exclusiveMinimum = options3.exclusiveMinimum ? true : void 0;
    const exclusiveMaximum = options3.exclusiveMaximum ? true : void 0;
    const payload = {
      minimum: encodeDatePayload(options3.minimum),
      maximum: encodeDatePayload(options3.maximum),
      ...exclusiveMinimum && {
        exclusiveMinimum
      },
      ...exclusiveMaximum && {
        exclusiveMaximum
      }
    };
    return {
      representation: {
        id: "effect/schema/isBetweenDate",
        payload
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isBetweenDate({ minimum: ${formatDateRuntime(options3.minimum)}, maximum: ${formatDateRuntime(options3.maximum)}, exclusiveMinimum: ${format(exclusiveMinimum)}, exclusiveMaximum: ${format(exclusiveMaximum)} })`
      })
    };
  }
});
var isGreaterThanBigInt = /* @__PURE__ */ makeIsGreaterThan({
  order: BigInt2,
  annotate: (exclusiveMinimum) => {
    const encoded = exclusiveMinimum.toString(10);
    return {
      representation: {
        id: "effect/schema/isGreaterThanBigInt",
        payload: {
          exclusiveMinimum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isGreaterThanBigInt(${format(exclusiveMinimum)})`
      })
    };
  }
});
var isGreaterThanOrEqualToBigInt = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
  order: BigInt2,
  annotate: (minimum) => {
    const encoded = minimum.toString(10);
    return {
      representation: {
        id: "effect/schema/isGreaterThanOrEqualToBigInt",
        payload: {
          minimum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isGreaterThanOrEqualToBigInt(${format(minimum)})`
      })
    };
  }
});
var isLessThanBigInt = /* @__PURE__ */ makeIsLessThan({
  order: BigInt2,
  annotate: (exclusiveMaximum) => {
    const encoded = exclusiveMaximum.toString(10);
    return {
      representation: {
        id: "effect/schema/isLessThanBigInt",
        payload: {
          exclusiveMaximum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isLessThanBigInt(${format(exclusiveMaximum)})`
      })
    };
  }
});
var isLessThanOrEqualToBigInt = /* @__PURE__ */ makeIsLessThanOrEqualTo({
  order: BigInt2,
  annotate: (maximum) => {
    const encoded = maximum.toString(10);
    return {
      representation: {
        id: "effect/schema/isLessThanOrEqualToBigInt",
        payload: {
          maximum: encoded
        }
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isLessThanOrEqualToBigInt(${format(maximum)})`
      })
    };
  }
});
var isBetweenBigInt = /* @__PURE__ */ makeIsBetween({
  order: BigInt2,
  annotate: (options3) => {
    const exclusiveMinimum = options3.exclusiveMinimum ? true : void 0;
    const exclusiveMaximum = options3.exclusiveMaximum ? true : void 0;
    const payload = {
      minimum: options3.minimum.toString(10),
      maximum: options3.maximum.toString(10),
      ...exclusiveMinimum && {
        exclusiveMinimum
      },
      ...exclusiveMaximum && {
        exclusiveMaximum
      }
    };
    return {
      representation: {
        id: "effect/schema/isBetweenBigInt",
        payload
      },
      toJsonSchema: () => [{}, true],
      toCode: () => ({
        runtime: `Schema.isBetweenBigInt({ minimum: ${format(options3.minimum)}, maximum: ${format(options3.maximum)}, exclusiveMinimum: ${format(exclusiveMinimum)}, exclusiveMaximum: ${format(exclusiveMaximum)} })`
      })
    };
  }
});
function isMinLength(minLength, annotations) {
  minLength = normalizeCardinality(minLength);
  return makeIsMinLength(minLength, Math.ceil(minLength / 2), annotations);
}
function makeIsMinLength(minLength, minCodePoints, annotations) {
  return makeFilter2((input) => input.length >= minLength, {
    expected: `a value with a length of at least ${minLength}`,
    representation: {
      id: "effect/schema/isMinLength",
      payload: {
        minLength
      }
    },
    toJsonSchema: ({
      type
    }) => type === "string" ? minLength <= 1 ? {
      minLength: minCodePoints
    } : [{
      minLength: minCodePoints
    }, true] : type === "array" ? {
      minItems: minLength
    } : type === void 0 ? [{
      minLength: minCodePoints,
      minItems: minLength
    }, true] : [{}, true],
    toCode: () => ({
      runtime: `Schema.isMinLength(${minLength})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      minLength
    },
    ...annotations
  });
}
function isNonEmpty(annotations) {
  return makeIsMinLength(1, 1, annotations);
}
function isMaxLength(maxLength, annotations) {
  maxLength = normalizeCardinality(maxLength);
  return makeFilter2((input) => input.length <= maxLength, {
    expected: `a value with a length of at most ${maxLength}`,
    representation: {
      id: "effect/schema/isMaxLength",
      payload: {
        maxLength
      }
    },
    toJsonSchema: ({
      type
    }) => type === "string" ? maxLength === 0 ? {
      maxLength
    } : [{
      maxLength
    }, true] : type === "array" ? {
      maxItems: maxLength
    } : type === void 0 ? [{
      maxLength,
      maxItems: maxLength
    }, true] : [{}, true],
    toCode: () => ({
      runtime: `Schema.isMaxLength(${maxLength})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      maxLength
    },
    ...annotations
  });
}
function isBetweenLength(minimum, maximum, annotations) {
  minimum = normalizeCardinality(minimum);
  maximum = normalizeCardinality(maximum);
  return makeFilter2((input) => input.length >= minimum && input.length <= maximum, {
    expected: minimum === maximum ? `a value with a length of ${minimum}` : `a value with a length between ${minimum} and ${maximum}`,
    representation: {
      id: "effect/schema/isBetweenLength",
      payload: {
        minimum,
        maximum
      }
    },
    toJsonSchema: ({
      type
    }) => type === "string" ? maximum === 0 || Math.ceil(minimum / 2) > maximum ? {
      minLength: Math.ceil(minimum / 2),
      maxLength: maximum
    } : [{
      minLength: Math.ceil(minimum / 2),
      maxLength: maximum
    }, true] : type === "array" ? {
      minItems: minimum,
      maxItems: maximum
    } : type === void 0 ? [{
      minLength: Math.ceil(minimum / 2),
      maxLength: maximum,
      minItems: minimum,
      maxItems: maximum
    }, true] : [{}, true],
    toCode: () => ({
      runtime: `Schema.isBetweenLength(${minimum}, ${maximum})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      minLength: minimum,
      maxLength: maximum
    },
    ...annotations
  });
}
function isMinCodePoints(minCodePoints, annotations) {
  minCodePoints = normalizeCardinality(minCodePoints);
  return makeFilter2((input) => countCodePointsUpTo(input, minCodePoints) >= minCodePoints, {
    expected: `a string with at least ${minCodePoints} code points`,
    representation: {
      id: "effect/schema/isMinCodePoints",
      payload: {
        minCodePoints
      }
    },
    toJsonSchema: () => ({
      minLength: minCodePoints
    }),
    toCode: () => ({
      runtime: `Schema.isMinCodePoints(${minCodePoints})`
    }),
    arbitraryConstraint: {
      minCodePoints
    },
    ...annotations
  });
}
function isMaxCodePoints(maxCodePoints, annotations) {
  maxCodePoints = normalizeCardinality(maxCodePoints);
  return makeFilter2((input) => countCodePointsUpTo(input, maxCodePoints + 1) <= maxCodePoints, {
    expected: `a string with at most ${maxCodePoints} code points`,
    representation: {
      id: "effect/schema/isMaxCodePoints",
      payload: {
        maxCodePoints
      }
    },
    toJsonSchema: () => ({
      maxLength: maxCodePoints
    }),
    toCode: () => ({
      runtime: `Schema.isMaxCodePoints(${maxCodePoints})`
    }),
    arbitraryConstraint: {
      maxCodePoints
    },
    ...annotations
  });
}
function isBetweenCodePoints(minimum, maximum, annotations) {
  minimum = normalizeCardinality(minimum);
  maximum = normalizeCardinality(maximum);
  return makeFilter2((input) => {
    const count = countCodePointsUpTo(input, maximum + 1);
    return count >= minimum && count <= maximum;
  }, {
    expected: minimum === maximum ? `a string with ${minimum} code points` : `a string with between ${minimum} and ${maximum} code points`,
    representation: {
      id: "effect/schema/isBetweenCodePoints",
      payload: {
        minimum,
        maximum
      }
    },
    toJsonSchema: () => ({
      allOf: [{
        minLength: minimum
      }, {
        maxLength: maximum
      }]
    }),
    toCode: () => ({
      runtime: `Schema.isBetweenCodePoints(${minimum}, ${maximum})`
    }),
    arbitraryConstraint: {
      minCodePoints: minimum,
      maxCodePoints: maximum
    },
    ...annotations
  });
}
function countCodePointsUpTo(input, limit) {
  if (limit === 0) return 0;
  let count = 0;
  for (const _ of input) {
    if (++count >= limit) break;
  }
  return count;
}
function normalizeCardinality(value3) {
  if (!globalThis.Number.isFinite(value3)) {
    throw new globalThis.RangeError(`Expected a finite number, got ${value3}`);
  }
  return Math.max(0, Math.floor(value3));
}
function isMinSize(minSize, annotations) {
  minSize = normalizeCardinality(minSize);
  return makeFilter2((input) => input.size >= minSize, {
    expected: `a value with a size of at least ${minSize}`,
    representation: {
      id: "effect/schema/isMinSize",
      payload: {
        minSize
      }
    },
    toJsonSchema: () => [{}, true],
    toCode: () => ({
      runtime: `Schema.isMinSize(${minSize})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      minSize
    },
    ...annotations
  });
}
function isMaxSize(maxSize, annotations) {
  maxSize = normalizeCardinality(maxSize);
  return makeFilter2((input) => input.size <= maxSize, {
    expected: `a value with a size of at most ${maxSize}`,
    representation: {
      id: "effect/schema/isMaxSize",
      payload: {
        maxSize
      }
    },
    toJsonSchema: () => [{}, true],
    toCode: () => ({
      runtime: `Schema.isMaxSize(${maxSize})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      maxSize
    },
    ...annotations
  });
}
function isBetweenSize(minimum, maximum, annotations) {
  minimum = normalizeCardinality(minimum);
  maximum = normalizeCardinality(maximum);
  return makeFilter2((input) => input.size >= minimum && input.size <= maximum, {
    expected: minimum === maximum ? `a value with a size of ${minimum}` : `a value with a size between ${minimum} and ${maximum}`,
    representation: {
      id: "effect/schema/isBetweenSize",
      payload: {
        minimum,
        maximum
      }
    },
    toJsonSchema: () => [{}, true],
    toCode: () => ({
      runtime: `Schema.isBetweenSize(${minimum}, ${maximum})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      minSize: minimum,
      maxSize: maximum
    },
    ...annotations
  });
}
function isMinProperties(minProperties, annotations) {
  minProperties = normalizeCardinality(minProperties);
  return makeFilter2((input) => Reflect.ownKeys(input).length >= minProperties, {
    expected: `a value with at least ${minProperties === 1 ? "1 entry" : `${minProperties} entries`}`,
    representation: {
      id: "effect/schema/isMinProperties",
      payload: {
        minProperties
      }
    },
    toJsonSchema: ({
      type
    }) => type === "object" ? {
      minProperties
    } : [{
      minProperties
    }, true],
    toCode: () => ({
      runtime: `Schema.isMinProperties(${minProperties})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      minProperties
    },
    ...annotations
  });
}
function isMaxProperties(maxProperties, annotations) {
  maxProperties = normalizeCardinality(maxProperties);
  return makeFilter2((input) => Reflect.ownKeys(input).length <= maxProperties, {
    expected: `a value with at most ${maxProperties === 1 ? "1 entry" : `${maxProperties} entries`}`,
    representation: {
      id: "effect/schema/isMaxProperties",
      payload: {
        maxProperties
      }
    },
    toJsonSchema: ({
      type
    }) => type === "object" ? {
      maxProperties
    } : [{
      maxProperties
    }, true],
    toCode: () => ({
      runtime: `Schema.isMaxProperties(${maxProperties})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      maxProperties
    },
    ...annotations
  });
}
function isBetweenProperties(minimum, maximum, annotations) {
  minimum = normalizeCardinality(minimum);
  maximum = normalizeCardinality(maximum);
  return makeFilter2((input) => Reflect.ownKeys(input).length >= minimum && Reflect.ownKeys(input).length <= maximum, {
    expected: minimum === maximum ? `a value with exactly ${minimum === 1 ? "1 entry" : `${minimum} entries`}` : `a value with between ${minimum} and ${maximum} entries`,
    representation: {
      id: "effect/schema/isBetweenProperties",
      payload: {
        minimum,
        maximum
      }
    },
    toJsonSchema: ({
      type
    }) => type === "object" ? {
      minProperties: minimum,
      maxProperties: maximum
    } : [{
      minProperties: minimum,
      maxProperties: maximum
    }, true],
    toCode: () => ({
      runtime: `Schema.isBetweenProperties(${minimum}, ${maximum})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    arbitraryConstraint: {
      minProperties: minimum,
      maxProperties: maximum
    },
    ...annotations
  });
}
function isPropertyNames(keySchema, annotations) {
  const propertyNames = toEncoded2(keySchema);
  const parser = _issue(propertyNames.ast);
  return makeFilter2((input, ast, options3) => {
    const keys3 = Reflect.ownKeys(input);
    const issues = [];
    for (const key of keys3) {
      const issue = parser(key, options3);
      if (issue !== void 0) {
        issues.push(new Pointer([key], issue));
        if (options3.errors === "first") break;
      }
    }
    if (isArrayNonEmpty2(issues)) {
      return new Composite(ast, issues, input, options3);
    }
    return true;
  }, {
    expected: "an object with property names matching the schema",
    representation: {
      id: "effect/schema/isPropertyNames",
      payload: null,
      schemas: [propertyNames.ast]
    },
    toJsonSchema: ({
      schemas,
      type
    }) => type === "object" ? {
      propertyNames: schemas[0]
    } : [{
      propertyNames: schemas[0]
    }, true],
    toCode: ({
      schemas
    }) => ({
      runtime: `Schema.isPropertyNames(${schemas[0].runtime})`
    }),
    [STRUCTURAL_ANNOTATION_KEY]: true,
    ...annotations
  });
}
function isUnique(annotations) {
  return makeFilter2((input) => dedupe(input).length === input.length, {
    expected: "an array with unique items",
    representation: {
      id: "effect/schema/isUnique",
      payload: null
    },
    toJsonSchema: () => ({
      uniqueItems: true
    }),
    toCode: () => ({
      runtime: "Schema.isUnique()"
    }),
    arbitraryConstraint: {
      uniqueBy: identity
    },
    ...annotations
  });
}
function isUniqueKey(annotations) {
  return makeFilter2((input) => dedupe(input.map(([key]) => key)).length === input.length, {
    expected: "an array with unique keys",
    representation: {
      id: "effect/schema/isUniqueKey",
      payload: null
    },
    toCode: () => ({
      runtime: "Schema.isUniqueKey()"
    }),
    arbitraryConstraint: {
      uniqueBy: (entry) => entry[0]
    },
    ...annotations
  });
}
var NonEmptyString = /* @__PURE__ */ String6.check(/* @__PURE__ */ isNonEmpty());
var Char = /* @__PURE__ */ String6.check(/* @__PURE__ */ isBetweenLength(1, 1));
var getErrorOptionsKey = (options3) => (options3?.includeStack === true ? 1 : 0) | (options3?.excludeCause === true ? 2 : 0);
var getErrorOptions = (key) => {
  switch (key) {
    case 0:
      return void 0;
    case 1:
      return {
        includeStack: true
      };
    case 2:
      return {
        excludeCause: true
      };
    case 3:
      return {
        includeStack: true,
        excludeCause: true
      };
  }
};
var errorSchemaCache = [];
function ErrorInstance(options3) {
  const key = getErrorOptionsKey(options3);
  const cached3 = errorSchemaCache[key];
  if (cached3 !== void 0) {
    return cached3;
  }
  const normalizedOptions = getErrorOptions(key);
  const schema2 = instanceOf(globalThis.Error, {
    representation: {
      id: "effect/schema/Error",
      payload: normalizedOptions ?? null
    },
    toCode: () => ({
      runtime: normalizedOptions !== void 0 ? `Schema.ErrorInstance(${format(normalizedOptions)})` : `Schema.ErrorInstance()`,
      Type: `globalThis.Error`
    }),
    expected: "Error",
    toCodecJson: () => link()(JsonError, errorFromJsonError(normalizedOptions))
  });
  errorSchemaCache[key] = schema2;
  return schema2;
}
var defectSchemaCache = [];
function Defect(options3) {
  const key = getErrorOptionsKey(options3);
  const cached3 = defectSchemaCache[key];
  if (cached3 !== void 0) {
    return cached3;
  }
  const schema2 = Json2.pipe(decodeTo2(Unknown2, defectFromJson(getErrorOptions(key))));
  defectSchemaCache[key] = schema2;
  return schema2;
}
function ReadonlyMap(key, value3) {
  const schema2 = declareConstructor()([key, value3], ([key2, value4]) => {
    const array2 = ArraySchema(Tuple2([key2, value4]));
    return (input, ast, options3) => {
      if (input instanceof globalThis.Map) {
        return mapBothEager2(decodeUnknownEffect(array2)([...input], options3), {
          onSuccess: (array3) => new globalThis.Map(array3),
          onFailure: (issue) => makeCompositeAtKey(ast, "entries", issue, input, options3)
        });
      }
      return fail6(new InvalidType(ast, input, options3));
    };
  }, {
    representation: {
      id: "effect/schema/ReadonlyMap",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.ReadonlyMap(${typeParameters[0].runtime}, ${typeParameters[1].runtime})`,
      Type: `globalThis.ReadonlyMap<${typeParameters[0].Type}, ${typeParameters[1].Type}>`
    }),
    expected: "ReadonlyMap",
    toCodec: ([key2, value4]) => link()(ArraySchema(Tuple2([key2, value4])), transform3({
      decode: (entries3) => new globalThis.Map(entries3),
      encode: (map12) => [...map12.entries()]
    }))
  });
  return make23(schema2.ast, {
    key,
    value: value3
  });
}
function ReadonlySet(value3) {
  const schema2 = declareConstructor()([value3], ([value4]) => {
    const array2 = ArraySchema(value4);
    return (input, ast, options3) => {
      if (input instanceof globalThis.Set) {
        return mapBothEager2(decodeUnknownEffect(array2)([...input], options3), {
          onSuccess: (array3) => new globalThis.Set(array3),
          onFailure: (issue) => makeCompositeAtKey(ast, "values", issue, input, options3)
        });
      }
      return fail6(new InvalidType(ast, input, options3));
    };
  }, {
    representation: {
      id: "effect/schema/ReadonlySet",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.ReadonlySet(${typeParameters[0].runtime})`,
      Type: `globalThis.ReadonlySet<${typeParameters[0].Type}>`
    }),
    expected: "ReadonlySet",
    toCodec: ([value4]) => link()(ArraySchema(value4), transform3({
      decode: (values2) => new globalThis.Set(values2),
      encode: (set5) => [...set5.values()]
    }))
  });
  return make23(schema2.ast, {
    value: value3
  });
}
var RegExp3 = /* @__PURE__ */ instanceOf(globalThis.RegExp, {
  representation: {
    id: "effect/schema/RegExp",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.RegExp`,
    Type: `globalThis.RegExp`
  }),
  expected: "RegExp",
  toCodecJson: () => link()(Struct({
    source: String6,
    flags: String6
  }), transformEffect2({
    decode: (e, options3) => try_3({
      try: () => new globalThis.RegExp(e.source, e.flags),
      catch: () => new InvalidValue({
        expected: "valid RegExp source and flags"
      }, e, options3)
    }),
    encode: (regExp) => succeed6({
      source: regExp.source,
      flags: regExp.flags
    })
  }))
});
var URLString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a URL"
});
var URL2 = /* @__PURE__ */ instanceOf(globalThis.URL, {
  representation: {
    id: "effect/schema/URL",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.URL`,
    Type: `globalThis.URL`
  }),
  expected: "URL",
  toCodecJson: () => link()(URLString, urlFromString)
});
var URLFromString = /* @__PURE__ */ URLString.pipe(/* @__PURE__ */ decodeTo2(URL2, urlFromString));
var DateString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a Date"
});
var Date4 = /* @__PURE__ */ declare((input) => input instanceof globalThis.Date && !globalThis.Number.isNaN(input.getTime()), {
  representation: {
    id: "effect/schema/Date",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.Date`,
    Type: `globalThis.Date`
  }),
  expected: "a valid Date",
  toCodecJson: () => link()(DateString, dateFromString)
});
var DateFromString = /* @__PURE__ */ DateString.pipe(/* @__PURE__ */ decodeTo2(Date4, dateFromString));
var DateFromMillis = /* @__PURE__ */ Int.pipe(/* @__PURE__ */ decodeTo2(Date4, dateFromMillis));
var JsonString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as JSON",
  contentMediaType: "application/json"
});
function fromJsonString2(schema2, options3) {
  return JsonString.pipe(decodeTo2(schema2, fromJsonString(options3)));
}
var UnknownFromJsonString = /* @__PURE__ */ fromJsonString2(Unknown2);
var File = /* @__PURE__ */ instanceOf(globalThis.File, {
  representation: {
    id: "effect/schema/File",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.File`,
    Type: `globalThis.File`
  }),
  expected: "File",
  toCodecJson: () => link()(Struct({
    data: String6.check(isBase64()),
    type: String6,
    name: String6,
    lastModified: Int
  }), transformEffect2({
    decode: (e, options3) => match2(decode2(e.data), {
      onFailure: () => fail6(new InvalidValue({
        expected: "a valid Base64 string"
      }, e.data, options3)),
      onSuccess: (bytes2) => {
        const buffer3 = new globalThis.Uint8Array(bytes2);
        return succeed6(new globalThis.File([buffer3], e.name, {
          type: e.type,
          lastModified: e.lastModified
        }));
      }
    }),
    encode: (file2, options3) => tryPromise2({
      try: async () => {
        const bytes2 = new globalThis.Uint8Array(await file2.arrayBuffer());
        return {
          data: encode2(bytes2),
          type: file2.type,
          name: file2.name,
          lastModified: file2.lastModified
        };
      },
      catch: () => new InvalidValue({
        expected: "a readable File"
      }, file2, options3)
    })
  }))
});
var FormData2 = /* @__PURE__ */ instanceOf(globalThis.FormData, {
  representation: {
    id: "effect/schema/FormData",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.FormData`,
    Type: `globalThis.FormData`
  }),
  expected: "FormData",
  toCodecJson: () => link()(ArraySchema(Tuple2([String6, Union2([Struct({
    _tag: tag("String"),
    value: String6
  }), Struct({
    _tag: tag("File"),
    value: File
  })])])), transformEffect2({
    decode: (e) => {
      const out = new globalThis.FormData();
      for (const [key, entry] of e) {
        out.append(key, entry.value);
      }
      return succeed6(out);
    },
    encode: (formData2) => {
      return succeed6(globalThis.Array.from(formData2.entries()).map(([key, value3]) => {
        if (typeof value3 === "string") {
          return [key, {
            _tag: "String",
            value: value3
          }];
        } else {
          return [key, {
            _tag: "File",
            value: value3
          }];
        }
      }));
    }
  }))
});
function fromFormData2(schema2) {
  return FormData2.pipe(decodeTo2(schema2, fromFormData));
}
var URLSearchParams2 = /* @__PURE__ */ instanceOf(globalThis.URLSearchParams, {
  representation: {
    id: "effect/schema/URLSearchParams",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.URLSearchParams`,
    Type: `globalThis.URLSearchParams`
  }),
  expected: "URLSearchParams",
  toCodecJson: () => link()(String6.annotate({
    expected: "a query string that will be decoded as URLSearchParams"
  }), transform3({
    decode: (e) => new globalThis.URLSearchParams(e),
    encode: (params) => params.toString()
  }))
});
function fromURLSearchParams2(schema2) {
  return URLSearchParams2.pipe(decodeTo2(schema2, fromURLSearchParams));
}
var NumberFromString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a number"
}).pipe(/* @__PURE__ */ decodeTo2(Number6, numberFromString));
var FiniteFromString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a finite number"
}).pipe(/* @__PURE__ */ decodeTo2(Finite, numberFromString));
var BigIntFromString = /* @__PURE__ */ make23(bigIntString).pipe(/* @__PURE__ */ decodeTo2(BigInt6, bigintFromString));
var Trimmed = /* @__PURE__ */ String6.check(/* @__PURE__ */ isTrimmed());
var Trim = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a trimmed string"
}).pipe(/* @__PURE__ */ decodeTo2(Trimmed, /* @__PURE__ */ trim3()));
var StringFromBase64 = /* @__PURE__ */ String6.annotate({
  expected: "a base64 encoded string that will be decoded as a UTF-8 string"
}).pipe(/* @__PURE__ */ decodeTo2(String6, stringFromBase64String));
var StringFromBase64Url = /* @__PURE__ */ String6.annotate({
  expected: "a base64 (URL) encoded string that will be decoded as a UTF-8 string"
}).pipe(/* @__PURE__ */ decodeTo2(String6, stringFromBase64UrlString));
var StringFromHex = /* @__PURE__ */ String6.annotate({
  expected: "a hex encoded string that will be decoded as a UTF-8 string"
}).pipe(/* @__PURE__ */ decodeTo2(String6, stringFromHexString));
var StringFromUriComponent = /* @__PURE__ */ String6.annotate({
  expected: "a URI component encoded string that will be decoded as a UTF-8 string"
}).pipe(/* @__PURE__ */ decodeTo2(String6, stringFromUriComponent));
var PropertyKey = /* @__PURE__ */ Union2([Finite, Symbol3, String6]);
var StandardSchemaV1FailureResult = /* @__PURE__ */ Struct({
  issues: /* @__PURE__ */ ArraySchema(/* @__PURE__ */ Struct({
    message: String6,
    path: /* @__PURE__ */ optional2(/* @__PURE__ */ ArraySchema(/* @__PURE__ */ Union2([PropertyKey, /* @__PURE__ */ Struct({
      key: PropertyKey
    })])))
  }))
});
var BooleanFromBit = /* @__PURE__ */ Literals([0, 1]).pipe(/* @__PURE__ */ decodeTo2(Boolean2, /* @__PURE__ */ transform3({
  decode: (bit) => bit === 1,
  encode: (bool) => bool ? 1 : 0
})));
var Base64String = /* @__PURE__ */ String6.annotate({
  expected: "a base64 encoded string that will be decoded as Uint8Array",
  format: "byte",
  contentEncoding: "base64"
});
var Uint8Array2 = /* @__PURE__ */ instanceOf(globalThis.Uint8Array, {
  representation: {
    id: "effect/schema/Uint8Array",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.Uint8Array`,
    Type: `globalThis.Uint8Array`
  }),
  expected: "Uint8Array",
  toCodecJson: () => link()(Base64String, uint8ArrayFromBase64String)
});
var Uint8ArrayFromBase64 = /* @__PURE__ */ Base64String.pipe(/* @__PURE__ */ decodeTo2(Uint8Array2, uint8ArrayFromBase64String));
var Uint8ArrayFromBase64Url = /* @__PURE__ */ String6.annotate({
  expected: "a base64 (URL) encoded string that will be decoded as a Uint8Array"
}).pipe(/* @__PURE__ */ decodeTo2(Uint8Array2, {
  decode: /* @__PURE__ */ decodeBase64Url(),
  encode: /* @__PURE__ */ encodeBase64Url()
}));
var Uint8ArrayFromHex = /* @__PURE__ */ String6.annotate({
  expected: "a hex encoded string that will be decoded as a Uint8Array"
}).pipe(/* @__PURE__ */ decodeTo2(Uint8Array2, {
  decode: /* @__PURE__ */ decodeHex(),
  encode: /* @__PURE__ */ encodeHex()
}));
var bigDecimalFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options3) => {
    const result3 = fromString(s);
    return isNone2(result3) ? fail6(new InvalidValue({
      expected: "a valid BigDecimal string"
    }, s, options3)) : succeed6(result3.value);
  },
  encode: (bd) => succeed6(format3(bd))
});
var isGreaterThanBigDecimal = /* @__PURE__ */ makeIsGreaterThan({
  order: Order2,
  formatter: (bd) => format3(bd)
});
var isGreaterThanOrEqualToBigDecimal = /* @__PURE__ */ makeIsGreaterThanOrEqualTo({
  order: Order2,
  formatter: (bd) => format3(bd)
});
var isLessThanBigDecimal = /* @__PURE__ */ makeIsLessThan({
  order: Order2,
  formatter: (bd) => format3(bd)
});
var isLessThanOrEqualToBigDecimal = /* @__PURE__ */ makeIsLessThanOrEqualTo({
  order: Order2,
  formatter: (bd) => format3(bd)
});
var isBetweenBigDecimal = /* @__PURE__ */ makeIsBetween({
  order: Order2,
  formatter: (bd) => format3(bd)
});
var BigDecimalString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a BigDecimal"
});
var BigDecimal = /* @__PURE__ */ declare(isBigDecimal, {
  representation: {
    id: "effect/schema/BigDecimal",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.BigDecimal`,
    Type: `BigDecimal.BigDecimal`,
    importDeclarations: [`import * as BigDecimal from "effect/BigDecimal"`]
  }),
  expected: "BigDecimal",
  toCodecJson: () => link()(BigDecimalString, bigDecimalFromString),
  toFormatter: () => (bd) => format3(bd)
});
var BigDecimalFromString = /* @__PURE__ */ BigDecimalString.pipe(/* @__PURE__ */ decodeTo2(BigDecimal, bigDecimalFromString));
var ByteSize = /* @__PURE__ */ declare(isByteSize, {
  representation: {
    id: "effect/schema/ByteSize",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.ByteSize`,
    Type: `ByteSize.ByteSize`,
    importDeclarations: [`import * as ByteSize from "effect/ByteSize"`]
  }),
  expected: "ByteSize",
  toCodecJson: () => link()(BigInt6.check(isGreaterThanOrEqualToBigInt(globalThis.BigInt(0))), transform3({
    decode: bytes,
    encode: toBigInt
  })),
  toCodecStringTree: () => link()(ByteSizeString, byteSizeFromString)
});
var ByteSizeString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a ByteSize"
});
var ByteSizeFromString = /* @__PURE__ */ ByteSizeString.pipe(/* @__PURE__ */ decodeTo2(ByteSize, byteSizeFromString));
var ByteSizeFromBigInt = /* @__PURE__ */ BigInt6.pipe(/* @__PURE__ */ decodeTo2(ByteSize, byteSizeFromBigInt));
var ByteSizeFromNumber = /* @__PURE__ */ Number6.pipe(/* @__PURE__ */ decodeTo2(ByteSize, byteSizeFromNumber));
function CauseReason(error, defect) {
  const schema2 = declareConstructor()([error, defect], ([error2, defect2]) => (input, ast, options3) => {
    if (!isReason(input)) {
      return fail6(new InvalidType(ast, input, options3));
    }
    switch (input._tag) {
      case "Fail":
        return mapBothEager2(decodeUnknownEffect(error2)(input.error, options3), {
          onSuccess: makeFailReason,
          onFailure: (issue) => makeCompositeAtKey(ast, "error", issue, input, options3)
        });
      case "Die":
        return mapBothEager2(decodeUnknownEffect(defect2)(input.defect, options3), {
          onSuccess: makeDieReason,
          onFailure: (issue) => makeCompositeAtKey(ast, "defect", issue, input, options3)
        });
      case "Interrupt":
        return succeed6(input);
    }
  }, {
    representation: {
      id: "effect/schema/CauseReason",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.CauseReason(${typeParameters[0].runtime}, ${typeParameters[1].runtime})`,
      Type: `Cause.Failure<${typeParameters[0].Type}, ${typeParameters[1].Type}>`,
      importDeclarations: [`import * as Cause from "effect/Cause"`]
    }),
    expected: "Cause.Failure",
    toCodec: ([error2, defect2]) => link()(Union2([Struct({
      _tag: Literal2("Fail"),
      error: error2
    }), Struct({
      _tag: Literal2("Die"),
      defect: defect2
    }), Struct({
      _tag: Literal2("Interrupt"),
      fiberId: UndefinedOr(Finite)
    })]), transform3({
      decode: (e) => {
        switch (e._tag) {
          case "Fail":
            return makeFailReason(e.error);
          case "Die":
            return makeDieReason(e.defect);
          case "Interrupt":
            return makeInterruptReason2(e.fiberId);
        }
      },
      encode: (reason) => {
        switch (reason._tag) {
          case "Fail":
            return {
              _tag: "Fail",
              error: reason.error
            };
          case "Die":
            return {
              _tag: "Die",
              defect: reason.defect
            };
          case "Interrupt":
            return {
              _tag: "Interrupt",
              fiberId: reason.fiberId
            };
        }
      }
    }))
  });
  return make23(schema2.ast, {
    error,
    defect
  });
}
function Cause(error, defect) {
  const schema2 = declareConstructor()([error, defect], ([error2, defect2]) => {
    const failures = ArraySchema(CauseReason(error2, defect2));
    return (input, ast, options3) => {
      if (!isCause2(input)) {
        return fail6(new InvalidType(ast, input, options3));
      }
      return mapBothEager2(decodeUnknownEffect(failures)(input.reasons, options3), {
        onSuccess: fromReasons,
        onFailure: (issue) => makeCompositeAtKey(ast, "failures", issue, input, options3)
      });
    };
  }, {
    representation: {
      id: "effect/schema/Cause",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.Cause(${typeParameters[0].runtime}, ${typeParameters[1].runtime})`,
      Type: `Cause.Cause<${typeParameters[0].Type}, ${typeParameters[1].Type}>`,
      importDeclarations: [`import * as Cause from "effect/Cause"`]
    }),
    expected: "Cause",
    toCodec: ([error2, defect2]) => link()(ArraySchema(CauseReason(error2, defect2)), transform3({
      decode: fromReasons,
      encode: ({
        reasons: failures
      }) => failures
    }))
  });
  return make23(schema2.ast, {
    error,
    defect
  });
}
function chunkLink(values2) {
  return link()(values2, transform3({
    decode: fromIterable3,
    encode: fromIterable2
  }));
}
function Chunk(value3) {
  const schema2 = declareConstructor()([value3], ([value4]) => {
    const values2 = ArraySchema(value4);
    return (input, ast, options3) => {
      if (isChunk(input)) {
        return mapBothEager2(decodeUnknownEffect(values2)(fromIterable2(input), options3), {
          onSuccess: fromIterable3,
          onFailure: (issue) => makeCompositeAtKey(ast, "values", issue, input, options3)
        });
      }
      return fail6(new InvalidType(ast, input, options3));
    };
  }, {
    representation: {
      id: "effect/schema/Chunk",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.Chunk(${typeParameters[0].runtime})`,
      Type: `Chunk.Chunk<${typeParameters[0].Type}>`
    }),
    expected: "Chunk",
    toCodec: ([value4]) => chunkLink(ArraySchema(value4)),
    toCodecArbitrary: ({
      constraint,
      typeParameters: [value4]
    }) => chunkLink(withArrayLengthConstraints(ArraySchema(value4), constraint?.minLength, constraint?.maxLength)),
    toEquivalence: ([value4]) => makeEquivalence5(value4)
  });
  return make23(schema2.ast, {
    value: value3
  });
}
function dateTimeUtcFromInput() {
  return transformEffect((input, options3) => {
    return match(make11(input), {
      onNone: () => fail6(new InvalidValue({
        message: "Invalid DateTime input"
      }, input, options3)),
      onSome: (dt) => succeed6(toUtc2(dt))
    });
  });
}
var timeZoneOffsetFromNumber = /* @__PURE__ */ transform3({
  decode: (n) => zoneMakeOffset2(n),
  encode: (tz) => tz.offset
});
var timeZoneNamedFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options3) => {
    return match(zoneMakeNamed2(s), {
      onNone: () => fail6(new InvalidValue({
        expected: "a valid IANA time zone"
      }, s, options3)),
      onSome: succeed6
    });
  },
  encode: (tz) => succeed6(tz.id)
});
var timeZoneFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options3) => {
    return match(zoneFromString2(s), {
      onNone: () => fail6(new InvalidValue({
        expected: "a valid time zone"
      }, s, options3)),
      onSome: succeed6
    });
  },
  encode: (tz) => succeed6(zoneToString2(tz))
});
var dateTimeUtcFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options3) => {
    return match(make11(s), {
      onNone: () => fail6(new InvalidValue({
        expected: "a valid UTC DateTime string"
      }, s, options3)),
      onSome: (result3) => succeed6(toUtc2(result3))
    });
  },
  encode: (utc) => succeed6(formatIso2(utc))
});
var dateTimeZonedFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options3) => {
    return match(makeZonedFromString2(s), {
      onNone: () => fail6(new InvalidValue({
        expected: "a valid Zoned DateTime string"
      }, s, options3)),
      onSome: succeed6
    });
  },
  encode: (zoned) => succeed6(formatIsoZoned2(zoned))
});
var arbitraryMinimumDateTimestamp = -864e13;
var arbitraryMaximumDateTimestamp = 864e13;
var arbitraryMinimumZonedDateTimeTimestamp = arbitraryMinimumDateTimestamp + 14 * 60 * 60 * 1e3;
var arbitraryMaximumZonedDateTimeTimestamp = arbitraryMaximumDateTimestamp - 14 * 60 * 60 * 1e3;
var arbitraryMinimumTimeZoneOffset = -12 * 60 * 60 * 1e3;
var arbitraryMaximumTimeZoneOffset = 14 * 60 * 60 * 1e3;
var arbitraryNamedTimeZones = ["UTC", "Europe/London", "America/New_York", "Asia/Tokyo", "Australia/Sydney"];
function dateTimeArbitraryBounds(constraint, domainMinimum, domainMaximum) {
  const minimum = Math.max(domainMinimum, constraint?.minimum === void 0 ? domainMinimum : constraint.minimum.epochMilliseconds + (constraint.exclusiveMinimum === true ? 1 : 0));
  const maximum = Math.min(domainMaximum, constraint?.maximum === void 0 ? domainMaximum : constraint.maximum.epochMilliseconds - (constraint.exclusiveMaximum === true ? 1 : 0));
  return minimum <= maximum ? [minimum, maximum] : [domainMinimum, domainMaximum];
}
function dateTimeArbitraryInteger(minimum, maximum) {
  return Int.check(isBetween2({
    minimum,
    maximum
  }));
}
function timeZoneArbitrarySchema() {
  return Union2([dateTimeArbitraryInteger(arbitraryMinimumTimeZoneOffset, arbitraryMaximumTimeZoneOffset), Literals(arbitraryNamedTimeZones)]);
}
var DateTimeUtc = /* @__PURE__ */ declare((u) => isDateTime2(u) && isUtc2(u), {
  representation: {
    id: "effect/schema/DateTimeUtc",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.DateTimeUtc`,
    Type: `DateTime.Utc`,
    importDeclarations: [`import * as DateTime from "effect/DateTime"`]
  }),
  expected: "DateTime.Utc",
  toCodecArbitrary: ({
    constraint
  }) => {
    const [minimum, maximum] = dateTimeArbitraryBounds(constraint, arbitraryMinimumDateTimestamp, arbitraryMaximumDateTimestamp);
    return linkDecoding()(dateTimeArbitraryInteger(minimum, maximum), transform2(makeUnsafe5));
  },
  toCodecJson: () => link()(String6, dateTimeUtcFromString),
  toFormatter: () => (utc) => utc.toString()
});
var DateTimeUtcFromDate = /* @__PURE__ */ Date4.pipe(/* @__PURE__ */ decodeTo2(DateTimeUtc, {
  decode: /* @__PURE__ */ dateTimeUtcFromInput(),
  encode: /* @__PURE__ */ transform2(toDateUtc2)
}));
var DateTimeUtcFromString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a DateTime.Utc"
}).pipe(/* @__PURE__ */ decodeTo2(DateTimeUtc, dateTimeUtcFromString));
var DateTimeUtcFromMillis = /* @__PURE__ */ Int.pipe(/* @__PURE__ */ decodeTo2(DateTimeUtc, {
  decode: /* @__PURE__ */ dateTimeUtcFromInput(),
  encode: /* @__PURE__ */ transform2(toEpochMillis2)
}));
var TimeZoneOffset = /* @__PURE__ */ declare(isTimeZoneOffset2, {
  representation: {
    id: "effect/schema/TimeZoneOffset",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.TimeZoneOffset`,
    Type: `DateTime.TimeZone.Offset`,
    importDeclarations: [`import * as DateTime from "effect/DateTime"`]
  }),
  expected: "DateTime.TimeZone.Offset",
  toCodecJson: () => link()(Int, timeZoneOffsetFromNumber),
  toFormatter: () => (tz) => zoneToString2(tz)
});
var TimeZoneNamedString = /* @__PURE__ */ String6.annotate({
  expected: "an IANA time zone identifier"
});
var TimeZoneNamed = /* @__PURE__ */ declare(isTimeZoneNamed2, {
  representation: {
    id: "effect/schema/TimeZoneNamed",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.TimeZoneNamed`,
    Type: `DateTime.TimeZone.Named`,
    importDeclarations: [`import * as DateTime from "effect/DateTime"`]
  }),
  expected: "DateTime.TimeZone.Named",
  toCodecArbitrary: () => linkDecoding()(Literals(arbitraryNamedTimeZones), transform2(zoneMakeNamedUnsafe2)),
  toCodecJson: () => link()(TimeZoneNamedString, timeZoneNamedFromString),
  toFormatter: () => (tz) => zoneToString2(tz)
});
var TimeZoneNamedFromString = /* @__PURE__ */ TimeZoneNamedString.pipe(/* @__PURE__ */ decodeTo2(TimeZoneNamed, timeZoneNamedFromString));
var TimeZoneString = /* @__PURE__ */ String6.annotate({
  expected: "a time zone string (IANA identifier or offset like +03:00)"
});
var TimeZone = /* @__PURE__ */ declare(isTimeZone2, {
  representation: {
    id: "effect/schema/TimeZone",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.TimeZone`,
    Type: `DateTime.TimeZone`,
    importDeclarations: [`import * as DateTime from "effect/DateTime"`]
  }),
  expected: "DateTime.TimeZone",
  toCodecArbitrary: () => linkDecoding()(timeZoneArbitrarySchema(), transform2((value3) => typeof value3 === "number" ? zoneMakeOffset2(value3) : zoneMakeNamedUnsafe2(value3))),
  toCodecJson: () => link()(TimeZoneString, timeZoneFromString),
  toFormatter: () => (tz) => zoneToString2(tz)
});
var TimeZoneFromString = /* @__PURE__ */ TimeZoneString.pipe(/* @__PURE__ */ decodeTo2(TimeZone, timeZoneFromString));
var DateTimeZonedString = /* @__PURE__ */ String6.annotate({
  expected: "a zoned DateTime string (e.g. 2024-01-01T00:00:00.000+00:00[Europe/London])"
});
var DateTimeZoned = /* @__PURE__ */ declare((u) => isDateTime2(u) && isZoned2(u), {
  representation: {
    id: "effect/schema/DateTimeZoned",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.DateTimeZoned`,
    Type: `DateTime.Zoned`,
    importDeclarations: [`import * as DateTime from "effect/DateTime"`]
  }),
  expected: "DateTime.Zoned",
  toCodecArbitrary: ({
    constraint
  }) => {
    const [minimum, maximum] = dateTimeArbitraryBounds(constraint, arbitraryMinimumZonedDateTimeTimestamp, arbitraryMaximumZonedDateTimeTimestamp);
    return linkDecoding()(Struct({
      epochMilliseconds: dateTimeArbitraryInteger(minimum, maximum),
      timeZone: timeZoneArbitrarySchema()
    }), transform2(({
      epochMilliseconds,
      timeZone
    }) => makeZonedUnsafe2(epochMilliseconds, {
      timeZone
    })));
  },
  toCodecJson: () => link()(DateTimeZonedString, dateTimeZonedFromString),
  toFormatter: () => (zoned) => formatIsoZoned2(zoned),
  toEquivalence: () => Equivalence4
});
var DateTimeZonedFromString = /* @__PURE__ */ DateTimeZonedString.pipe(/* @__PURE__ */ decodeTo2(DateTimeZoned, dateTimeZonedFromString));
var netAddressFromString = (declaration, parse3, encode5, identifier2) => String6.pipe(decodeTo2(declaration, transformEffect2({
  decode: (input, options3) => {
    const result3 = parse3(input);
    return isSuccess2(result3) ? succeed6(result3.success) : fail6(new InvalidValue({
      message: result3.failure.message
    }, input, options3));
  },
  encode: (value3) => succeed6(encode5(value3))
}))).annotate({
  identifier: identifier2
});
var MacAddress = /* @__PURE__ */ declare(isMacAddress, {
  identifier: "MacAddress"
});
var MacAddressFromString = /* @__PURE__ */ netAddressFromString(MacAddress, macAddressFromString, formatMacAddress, "MacAddressFromString");
var Ipv4Address = /* @__PURE__ */ declare(isIpv4Address, {
  identifier: "Ipv4Address"
});
var Ipv4AddressFromString = /* @__PURE__ */ netAddressFromString(Ipv4Address, ipv4FromString, formatIp, "Ipv4AddressFromString");
var Ipv6Address = /* @__PURE__ */ declare(isIpv6Address, {
  identifier: "Ipv6Address"
});
var Ipv6AddressFromString = /* @__PURE__ */ netAddressFromString(Ipv6Address, ipv6FromString, formatIp, "Ipv6AddressFromString");
var IpAddress = /* @__PURE__ */ declare(isIpAddress, {
  identifier: "IpAddress"
});
var IpAddressFromString = /* @__PURE__ */ netAddressFromString(IpAddress, ipFromString, formatIp, "IpAddressFromString");
var netAddressRefinement = (schema2, guard, expected, identifier2) => refine(guard, {
  expected
})(schema2).annotate({
  identifier: identifier2
});
var IpMulticastAddress = /* @__PURE__ */ netAddressRefinement(IpAddress, isMulticast, "a multicast address", "IpMulticastAddress");
var IpMulticastAddressFromString = /* @__PURE__ */ netAddressRefinement(IpAddressFromString, isMulticast, "a multicast address", "IpMulticastAddressFromString");
var MacMulticastAddress = /* @__PURE__ */ netAddressRefinement(MacAddress, isMulticast, "a multicast address", "MacMulticastAddress");
var MacMulticastAddressFromString = /* @__PURE__ */ netAddressRefinement(MacAddressFromString, isMulticast, "a multicast address", "MacMulticastAddressFromString");
var IpUnicastAddress = /* @__PURE__ */ netAddressRefinement(IpAddress, isUnicast, "a unicast address", "IpUnicastAddress");
var IpUnicastAddressFromString = /* @__PURE__ */ netAddressRefinement(IpAddressFromString, isUnicast, "a unicast address", "IpUnicastAddressFromString");
var MacUnicastAddress = /* @__PURE__ */ netAddressRefinement(MacAddress, isMacUnicast, "a unicast address", "MacUnicastAddress");
var MacUnicastAddressFromString = /* @__PURE__ */ netAddressRefinement(MacAddressFromString, isMacUnicast, "a unicast address", "MacUnicastAddressFromString");
var Ipv4BroadcastAddress = /* @__PURE__ */ netAddressRefinement(Ipv4Address, isBroadcast, "a broadcast address", "Ipv4BroadcastAddress");
var Ipv4BroadcastAddressFromString = /* @__PURE__ */ netAddressRefinement(Ipv4AddressFromString, isBroadcast, "a broadcast address", "Ipv4BroadcastAddressFromString");
var MacBroadcastAddress = /* @__PURE__ */ netAddressRefinement(MacAddress, isMacBroadcast, "a broadcast address", "MacBroadcastAddress");
var MacBroadcastAddressFromString = /* @__PURE__ */ netAddressRefinement(MacAddressFromString, isMacBroadcast, "a broadcast address", "MacBroadcastAddressFromString");
var IpLoopbackAddress = /* @__PURE__ */ netAddressRefinement(IpAddress, isLoopback, "a loopback address", "IpLoopbackAddress");
var IpLoopbackAddressFromString = /* @__PURE__ */ netAddressRefinement(IpAddressFromString, isLoopback, "a loopback address", "IpLoopbackAddressFromString");
var IpLinkLocalAddress = /* @__PURE__ */ netAddressRefinement(IpAddress, isLinkLocal, "a link-local address", "IpLinkLocalAddress");
var IpLinkLocalAddressFromString = /* @__PURE__ */ netAddressRefinement(IpAddressFromString, isLinkLocal, "a link-local address", "IpLinkLocalAddressFromString");
var IpUnspecifiedAddress = /* @__PURE__ */ netAddressRefinement(IpAddress, isUnspecified, "an unspecified address", "IpUnspecifiedAddress");
var IpUnspecifiedAddressFromString = /* @__PURE__ */ netAddressRefinement(IpAddressFromString, isUnspecified, "an unspecified address", "IpUnspecifiedAddressFromString");
var Ipv4PrivateAddress = /* @__PURE__ */ netAddressRefinement(Ipv4Address, isPrivate, "a private address", "Ipv4PrivateAddress");
var Ipv4PrivateAddressFromString = /* @__PURE__ */ netAddressRefinement(Ipv4AddressFromString, isPrivate, "a private address", "Ipv4PrivateAddressFromString");
var Ipv6UniqueLocalAddress = /* @__PURE__ */ netAddressRefinement(Ipv6Address, isUniqueLocal, "a unique-local address", "Ipv6UniqueLocalAddress");
var Ipv6UniqueLocalAddressFromString = /* @__PURE__ */ netAddressRefinement(Ipv6AddressFromString, isUniqueLocal, "a unique-local address", "Ipv6UniqueLocalAddressFromString");
var MacLocallyAdministeredAddress = /* @__PURE__ */ netAddressRefinement(MacAddress, isMacLocallyAdministered, "a locally administered address", "MacLocallyAdministeredAddress");
var MacLocallyAdministeredAddressFromString = /* @__PURE__ */ netAddressRefinement(MacAddressFromString, isMacLocallyAdministered, "a locally administered address", "MacLocallyAdministeredAddressFromString");
var MacUniversallyAdministeredAddress = /* @__PURE__ */ netAddressRefinement(MacAddress, isMacUniversallyAdministered, "a universally administered address", "MacUniversallyAdministeredAddress");
var MacUniversallyAdministeredAddressFromString = /* @__PURE__ */ netAddressRefinement(MacAddressFromString, isMacUniversallyAdministered, "a universally administered address", "MacUniversallyAdministeredAddressFromString");
var Ipv4Interface = /* @__PURE__ */ declare(isIpv4Interface, {
  identifier: "Ipv4Interface"
});
var Ipv4InterfaceFromString = /* @__PURE__ */ netAddressFromString(Ipv4Interface, ipv4FromString2, format5, "Ipv4InterfaceFromString");
var Ipv6Interface = /* @__PURE__ */ declare(isIpv6Interface, {
  identifier: "Ipv6Interface"
});
var Ipv6InterfaceFromString = /* @__PURE__ */ netAddressFromString(Ipv6Interface, ipv6FromString2, format5, "Ipv6InterfaceFromString");
var IpInterface = /* @__PURE__ */ declare(isIpInterface, {
  identifier: "IpInterface"
});
var IpInterfaceFromString = /* @__PURE__ */ netAddressFromString(IpInterface, fromString3, format5, "IpInterfaceFromString");
var Ipv4Network = /* @__PURE__ */ declare(isIpv4Network, {
  identifier: "Ipv4Network"
});
var Ipv4NetworkFromString = /* @__PURE__ */ netAddressFromString(Ipv4Network, ipv4FromString3, format6, "Ipv4NetworkFromString");
var Ipv6Network = /* @__PURE__ */ declare(isIpv6Network, {
  identifier: "Ipv6Network"
});
var Ipv6NetworkFromString = /* @__PURE__ */ netAddressFromString(Ipv6Network, ipv6FromString3, format6, "Ipv6NetworkFromString");
var IpNetwork = /* @__PURE__ */ declare(isIpNetwork, {
  identifier: "IpNetwork"
});
var IpNetworkFromString = /* @__PURE__ */ netAddressFromString(IpNetwork, fromString4, format6, "IpNetworkFromString");
var InetAddressV4 = /* @__PURE__ */ declare(isInetAddressV4, {
  identifier: "InetAddressV4"
});
var InetAddressV6 = /* @__PURE__ */ declare(isInetAddressV6, {
  identifier: "InetAddressV6"
});
var InetAddress = /* @__PURE__ */ declare(isInetAddress, {
  identifier: "InetAddress"
});
var InetAddressFromString = /* @__PURE__ */ netAddressFromString(InetAddress, inetAddressFromString, formatInet, "InetAddressFromString");
var UnixPathAddress = /* @__PURE__ */ declare(isUnixPathAddress, {
  identifier: "UnixPathAddress"
});
var UnixPathAddressFromString = /* @__PURE__ */ String6.pipe(decodeTo2(UnixPathAddress, transform3({
  decode: unixPathAddress,
  encode: (address) => address.path
}))).annotate({
  identifier: "UnixPathAddressFromString"
});
var SocketAddress = /* @__PURE__ */ declare(isSocketAddress, {
  identifier: "SocketAddress"
});
var durationFromString = /* @__PURE__ */ transformEffect2({
  decode: (s, options3) => match(fromInput(s), {
    onNone: () => fail6(new InvalidValue({
      expected: "a valid Duration string"
    }, s, options3)),
    onSome: succeed6
  }),
  encode: (duration) => succeed6(globalThis.String(duration))
});
var durationFromNanos = /* @__PURE__ */ transformEffect2({
  decode: (i) => succeed6(nanos(i)),
  encode: (a, options3) => match(toNanos(a), {
    onNone: () => fail6(new InvalidValue({
      expected: "a Duration representable as a bigint"
    }, a, options3)),
    onSome: (nanos2) => succeed6(nanos2)
  })
});
var durationFromMillis = /* @__PURE__ */ transform3({
  decode: (i) => millis(i),
  encode: (a) => toMillis(a)
});
var Duration = /* @__PURE__ */ declare(isDuration, {
  representation: {
    id: "effect/schema/Duration",
    payload: null
  },
  toCode: () => ({
    runtime: `Schema.Duration`,
    Type: `Duration.Duration`,
    importDeclarations: [`import * as Duration from "effect/Duration"`]
  }),
  expected: "Duration",
  toCodecJson: () => link()(Union2([Struct({
    _tag: Literal2("Infinity")
  }), Struct({
    _tag: Literal2("NegativeInfinity")
  }), Struct({
    _tag: Literal2("Nanos"),
    value: BigInt6
  }), Struct({
    _tag: Literal2("Millis"),
    value: Int
  })]), transform3({
    decode: (e) => {
      switch (e._tag) {
        case "Infinity":
          return infinity;
        case "NegativeInfinity":
          return negativeInfinity;
        case "Nanos":
          return nanos(e.value);
        case "Millis":
          return millis(e.value);
      }
    },
    encode: (duration) => {
      switch (duration.value._tag) {
        case "Infinity":
          return {
            _tag: "Infinity"
          };
        case "NegativeInfinity":
          return {
            _tag: "NegativeInfinity"
          };
        case "Nanos":
          return {
            _tag: "Nanos",
            value: duration.value.nanos
          };
        case "Millis":
          return {
            _tag: "Millis",
            value: duration.value.millis
          };
      }
    }
  }))
});
var DurationString = /* @__PURE__ */ String6.annotate({
  expected: "a string that will be decoded as a Duration"
});
var DurationFromString = /* @__PURE__ */ DurationString.pipe(/* @__PURE__ */ decodeTo2(Duration, durationFromString));
var DurationFromNanos = /* @__PURE__ */ BigInt6.pipe(/* @__PURE__ */ decodeTo2(Duration, durationFromNanos));
var DurationFromMillis = /* @__PURE__ */ Number6.pipe(/* @__PURE__ */ decodeTo2(Duration, durationFromMillis));
function Exit(value3, error, defect) {
  const schema2 = declareConstructor()([value3, error, defect], ([value4, error2, defect2]) => {
    const cause = Cause(error2, defect2);
    return (input, ast, options3) => {
      if (!isExit2(input)) {
        return fail6(new InvalidType(ast, input, options3));
      }
      switch (input._tag) {
        case "Success":
          return mapBothEager2(decodeUnknownEffect(value4)(input.value, options3), {
            onSuccess: succeed4,
            onFailure: (issue) => makeCompositeAtKey(ast, "value", issue, input, options3)
          });
        case "Failure":
          return mapBothEager2(decodeUnknownEffect(cause)(input.cause, options3), {
            onSuccess: failCause2,
            onFailure: (issue) => makeCompositeAtKey(ast, "cause", issue, input, options3)
          });
      }
    };
  }, {
    representation: {
      id: "effect/schema/Exit",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.Exit(${typeParameters[0].runtime}, ${typeParameters[1].runtime}, ${typeParameters[2].runtime})`,
      Type: `Exit.Exit<${typeParameters[0].Type}, ${typeParameters[1].Type}, ${typeParameters[2].Type}>`,
      importDeclarations: [`import * as Exit from "effect/Exit"`]
    }),
    expected: "Exit",
    toCodec: ([value4, error2, defect2]) => link()(Union2([Struct({
      _tag: Literal2("Success"),
      value: value4
    }), Struct({
      _tag: Literal2("Failure"),
      cause: Cause(error2, defect2)
    })]), transform3({
      decode: (e) => e._tag === "Success" ? succeed4(e.value) : failCause2(e.cause),
      encode: (exit3) => isSuccess4(exit3) ? {
        _tag: "Success",
        value: exit3.value
      } : {
        _tag: "Failure",
        cause: exit3.cause
      }
    }))
  });
  return make23(schema2.ast, {
    value: value3,
    error,
    defect
  });
}
function graphEncodedSchema(type, node, edge) {
  return Struct({
    type: Literal2(type),
    nodes: ArraySchema(Struct({
      index: Natural,
      data: node
    })),
    edges: ArraySchema(Struct({
      index: Natural,
      source: Natural,
      target: Natural,
      data: edge
    }))
  });
}
function graphDecode(input, options3) {
  let previous = -1;
  const indexes = /* @__PURE__ */ new Set();
  for (let i = 0; i < input.nodes.length; i++) {
    const index2 = input.nodes[i].index;
    if (index2 <= previous) {
      return fail6(new Pointer(["nodes", i, "index"], new InvalidValue({
        expected: "a strictly increasing node index"
      }, index2, options3)));
    }
    previous = index2;
    indexes.add(index2);
  }
  previous = -1;
  for (let i = 0; i < input.edges.length; i++) {
    const edge = input.edges[i];
    if (edge.index <= previous) {
      return fail6(new Pointer(["edges", i, "index"], new InvalidValue({
        expected: "a strictly increasing edge index"
      }, edge.index, options3)));
    }
    previous = edge.index;
    if (!indexes.has(edge.source)) {
      return fail6(new Pointer(["edges", i, "source"], new InvalidValue({
        expected: "an encoded node index"
      }, edge.source, options3)));
    }
    if (!indexes.has(edge.target)) {
      return fail6(new Pointer(["edges", i, "target"], new InvalidValue({
        expected: "an encoded node index"
      }, edge.target, options3)));
    }
  }
  return succeed6(hydrate(input));
}
function graphEncode(input, type, options3) {
  if (!isGraph(input) || input.mutable || input.type !== type) {
    return fail6(new InvalidValue({
      expected: `an immutable ${type} Graph`
    }, input, options3));
  }
  return succeed6(snapshot(input));
}
function graphToEquivalence(node, edge) {
  return (self, that) => {
    const a = snapshot(self);
    const b = snapshot(that);
    if (a.type !== b.type || a.nodes.length !== b.nodes.length || a.edges.length !== b.edges.length) return false;
    for (let i = 0; i < a.nodes.length; i++) {
      if (a.nodes[i].index !== b.nodes[i].index || !node(a.nodes[i].data, b.nodes[i].data)) return false;
    }
    for (let i = 0; i < a.edges.length; i++) {
      const ae = a.edges[i];
      const be = b.edges[i];
      const sameEndpoints = a.type === "directed" ? ae.source === be.source && ae.target === be.target : ae.source === be.source && ae.target === be.target || ae.source === be.target && ae.target === be.source;
      if (ae.index !== be.index || !sameEndpoints || !edge(ae.data, be.data)) return false;
    }
    return true;
  };
}
function graphToArbitrary(type, node, edge) {
  return linkDecoding()(Union2([Null2, Struct({
    nodes: NonEmptyArray(node),
    edges: ArraySchema(Tuple2([Natural, Natural, edge]))
  })]), transform2((input) => {
    if (input === null) return hydrate({
      type,
      nodes: [],
      edges: []
    });
    const nodes = input.nodes.map((data, index2) => ({
      index: index2,
      data
    }));
    return hydrate({
      type,
      nodes,
      edges: input.edges.map(([source, target, data], index2) => ({
        index: index2,
        source: source % nodes.length,
        target: target % nodes.length,
        data
      }))
    });
  }));
}
function Graph(type, node, edge) {
  const schema2 = declareConstructor()([node, edge], ([node2, edge2]) => {
    const encoded = graphEncodedSchema(type, node2, edge2);
    return (input, ast, options3) => {
      if (!isGraph(input) || input.mutable || input.type !== type) {
        return fail6(new InvalidType(ast, input, options3));
      }
      return flatMap5(decodeUnknownEffect(encoded)(snapshot(input), options3), (snapshot2) => graphDecode(snapshot2, options3));
    };
  }, {
    representation: {
      id: "effect/schema/Graph",
      payload: type
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.Graph(${format(type)}, ${typeParameters[0].runtime}, ${typeParameters[1].runtime})`,
      Type: `Graph.Graph<${typeParameters[0].Type}, ${typeParameters[1].Type}, ${format(type)}>`,
      importDeclarations: [`import * as Graph from "effect/Graph"`]
    }),
    expected: `an immutable ${type} Graph`,
    toCodec: ([node2, edge2]) => link()(graphEncodedSchema(type, node2, edge2), transformEffect2({
      decode: graphDecode,
      encode: (graph, options3) => graphEncode(graph, type, options3)
    })),
    toCodecArbitrary: ({
      typeParameters: [node2, edge2]
    }) => graphToArbitrary(type, node2, edge2),
    toEquivalence: ([node2, edge2]) => graphToEquivalence(node2, edge2)
  });
  return make23(schema2.ast, {
    type,
    node,
    edge
  });
}
function hashMapLink(entries3) {
  return link()(entries3, transform3({
    decode: fromIterable5,
    encode: toEntries
  }));
}
function HashMap(key, value3) {
  const schema2 = declareConstructor()([key, value3], ([key2, value4]) => {
    const entries3 = ArraySchema(Tuple2([key2, value4]));
    return (input, ast, options3) => {
      if (isHashMap2(input)) {
        return mapBothEager2(decodeUnknownEffect(entries3)(toEntries(input), options3), {
          onSuccess: fromIterable5,
          onFailure: (issue) => makeCompositeAtKey(ast, "entries", issue, input, options3)
        });
      }
      return fail6(new InvalidType(ast, input, options3));
    };
  }, {
    representation: {
      id: "effect/schema/HashMap",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.HashMap(${typeParameters[0].runtime}, ${typeParameters[1].runtime})`,
      Type: `HashMap.HashMap<${typeParameters[0].Type}, ${typeParameters[1].Type}>`,
      importDeclarations: [`import * as HashMap from "effect/HashMap"`]
    }),
    expected: "HashMap",
    toCodec: ([key2, value4]) => hashMapLink(ArraySchema(Tuple2([key2, value4]))),
    toCodecArbitrary: ({
      constraint,
      typeParameters: [key2, value4]
    }) => hashMapLink(withArrayLengthConstraints(ArraySchema(Tuple2([key2, value4])).check(isUniqueKey()), constraint?.minSize, constraint?.maxSize)),
    toEquivalence: ([key2, value4]) => makeCompareMap(key2, value4)
  });
  return make23(schema2.ast, {
    key,
    value: value3
  });
}
function hashSetLink(values2) {
  return link()(values2, transform3({
    decode: fromIterable7,
    encode: fromIterable2
  }));
}
function HashSet(value3) {
  const schema2 = declareConstructor()([value3], ([value4]) => {
    const values2 = ArraySchema(value4);
    return (input, ast, options3) => {
      if (isHashSet2(input)) {
        return mapBothEager2(decodeUnknownEffect(values2)(fromIterable2(input), options3), {
          onSuccess: fromIterable7,
          onFailure: (issue) => makeCompositeAtKey(ast, "values", issue, input, options3)
        });
      }
      return fail6(new InvalidType(ast, input, options3));
    };
  }, {
    representation: {
      id: "effect/schema/HashSet",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.HashSet(${typeParameters[0].runtime})`,
      Type: `HashSet.HashSet<${typeParameters[0].Type}>`
    }),
    expected: "HashSet",
    toCodec: ([value4]) => hashSetLink(ArraySchema(value4)),
    toCodecArbitrary: ({
      constraint,
      typeParameters: [value4]
    }) => hashSetLink(withArrayLengthConstraints(ArraySchema(value4).check(isUnique()), constraint?.minSize, constraint?.maxSize)),
    toEquivalence: ([value4]) => makeCompareSet(value4)
  });
  return make23(schema2.ast, {
    value: value3
  });
}
function Option(value3) {
  const schema2 = declareConstructor()([value3], ([value4]) => (input, ast, options3) => {
    if (isOption2(input)) {
      if (isNone2(input)) {
        return succeedNone2;
      }
      return mapBothEager2(decodeUnknownEffect(value4)(input.value, options3), {
        onSuccess: some2,
        onFailure: (issue) => makeCompositeAtKey(ast, "value", issue, input, options3)
      });
    }
    return fail6(new InvalidType(ast, input, options3));
  }, {
    representation: {
      id: "effect/schema/Option",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.Option(${typeParameters[0].runtime})`,
      Type: `Option.Option<${typeParameters[0].Type}>`,
      importDeclarations: [`import * as Option from "effect/Option"`]
    }),
    expected: "Option",
    toCodec: ([value4]) => link()(Union2([Struct({
      _tag: Literal2("Some"),
      value: value4
    }), Struct({
      _tag: Literal2("None")
    })]), transform3({
      decode: (e) => e._tag === "None" ? none2() : some2(e.value),
      encode: (o) => isSome2(o) ? {
        _tag: "Some",
        value: o.value
      } : {
        _tag: "None"
      }
    }))
  });
  return make23(schema2.ast, {
    value: value3
  });
}
function OptionFromNullOr(schema2) {
  return NullOr(schema2).pipe(decodeTo2(Option(toType2(schema2)), optionFromNullOr()));
}
function OptionFromUndefinedOr(schema2) {
  return UndefinedOr(schema2).pipe(decodeTo2(Option(toType2(schema2)), optionFromUndefinedOr()));
}
function OptionFromNullishOr(schema2, options3) {
  return NullishOr(schema2).pipe(decodeTo2(Option(toType2(schema2)), optionFromNullishOr(options3)));
}
var Cookie = /* @__PURE__ */ declare(isCookie, {
  representation: {
    id: "effect/http/Cookie",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.Cookie",
    Type: "Cookies.Cookie",
    importDeclarations: [`import * as Cookies from "effect/http/Cookies"`]
  }),
  expected: "Cookie"
});
var Cookies = /* @__PURE__ */ declare(isCookies, {
  representation: {
    id: "effect/http/Cookies",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.Cookies",
    Type: "Cookies.Cookies",
    importDeclarations: [`import * as Cookies from "effect/http/Cookies"`]
  }),
  expected: "Cookies",
  toCodecJson: () => link()(ArraySchema(String6), transform3({
    decode: fromSetCookie,
    encode: toSetCookieHeaders
  })),
  toCodecIso: () => link()(Record(String6, Cookie), transform3({
    decode: fromReadonlyRecord,
    encode: (cookies) => cookies.cookies
  }))
});
var RecordFromCookies = /* @__PURE__ */ Cookies.pipe(/* @__PURE__ */ decodeTo2(/* @__PURE__ */ Record(String6, String6), /* @__PURE__ */ transform3({
  decode: toRecord,
  encode: (self) => fromIterable8(globalThis.Object.entries(self).map(([name, value3]) => makeCookieUnsafe(name, value3)))
})));
var Headers = /* @__PURE__ */ declare(isHeaders, {
  representation: {
    id: "effect/http/Headers",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.Headers",
    Type: "Headers.Headers",
    importDeclarations: [`import * as Headers from "effect/http/Headers"`]
  }),
  expected: "Headers",
  toEquivalence: () => Equivalence5,
  toCodec: () => link()(Record(String6, String6), transform3({
    decode: fromInput3,
    encode: (headers) => ({
      ...headers
    })
  }))
});
var UrlParams = /* @__PURE__ */ declare(isUrlParams, {
  representation: {
    id: "effect/http/UrlParams",
    payload: null
  },
  toCode: () => ({
    runtime: "Schema.UrlParams",
    Type: "UrlParams.UrlParams",
    importDeclarations: [`import * as UrlParams from "effect/http/UrlParams"`]
  }),
  expected: "UrlParams",
  toEquivalence: () => Equivalence6,
  toCodec: () => link()(ArraySchema(Tuple2([String6, String6])), transform3({
    decode: make16,
    encode: (self) => self.params
  }))
});
var JsonFromUrlParamsField = (field, options3) => UrlParams.pipe(decodeTo2(fromJsonString2(Unknown2, options3), transformEffect2({
  decode: (params) => match(getFirst(params, field), {
    onNone: () => fail6(new Pointer([field], new MissingKey(void 0))),
    onSome: succeed6
  }),
  encode: (value3) => succeed6(make16([[field, value3]]))
})));
var RecordFromUrlParams = /* @__PURE__ */ UrlParams.pipe(/* @__PURE__ */ decodeTo2(/* @__PURE__ */ Record(String6, /* @__PURE__ */ Union2([String6, /* @__PURE__ */ NonEmptyArray(String6)])), /* @__PURE__ */ transform3({
  decode: toReadonlyRecord,
  encode: fromInput4
})));
function OptionFromOptionalKey(schema2) {
  return optionalKey2(schema2).pipe(decodeTo2(Option(toType2(schema2)), optionFromOptionalKey()));
}
function OptionFromOptional(schema2) {
  return optional2(schema2).pipe(decodeTo2(Option(toType2(schema2)), optionFromOptional()));
}
function OptionFromOptionalNullOr(schema2, options3) {
  const onNoneEncoding = options3 === void 0 ? "omit" : options3.onNoneEncoding;
  const noneValue = onNoneEncoding === null ? null : void 0;
  return optional2(NullOr(schema2)).pipe(decodeTo2(Option(toType2(schema2)), transformOptional2({
    decode: (oe) => oe.pipe(filter(isNotNullish), some2),
    encode: onNoneEncoding === "omit" ? flatten : (ot) => some2(getOrElse(flatten(ot), () => noneValue))
  })));
}
function Redacted(value3, options3) {
  const label = typeof options3?.label === "string" ? options3.label : void 0;
  const disallowJsonEncode = options3?.disallowJsonEncode === true;
  const normalizedOptions = label !== void 0 ? disallowJsonEncode ? {
    label,
    disallowJsonEncode: true
  } : {
    label
  } : disallowJsonEncode ? {
    disallowJsonEncode: true
  } : void 0;
  const decodeLabel = label !== void 0 ? decodeUnknownEffect(Literal2(label)) : void 0;
  const schema2 = declareConstructor()([value3], ([value4]) => (input, ast, poptions) => {
    if (isRedacted(input)) {
      const label2 = decodeLabel !== void 0 ? mapErrorEager2(decodeLabel(input.label, poptions), (issue) => new Pointer(["label"], issue)) : void_4;
      return flatMapEager2(label2, () => mapBothEager2(decodeUnknownEffect(value4)(value2(input), poptions), {
        onSuccess: (value5) => make14(value5, {
          label: input.label
        }),
        onFailure: () => {
          return new Composite(ast, [new Pointer(["value"], new InvalidValue(void 0, input, poptions))], input, poptions);
        }
      }));
    }
    return fail6(new InvalidType(ast, input, poptions));
  }, {
    representation: {
      id: "effect/schema/Redacted",
      payload: normalizedOptions ?? null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: normalizedOptions !== void 0 ? `Schema.Redacted(${typeParameters[0].runtime}, ${format(normalizedOptions)})` : `Schema.Redacted(${typeParameters[0].runtime})`,
      Type: `Redacted.Redacted<${typeParameters[0].Type}>`,
      importDeclarations: [`import * as Redacted from "effect/Redacted"`]
    }),
    expected: "Redacted",
    toCodecJson: ([value4]) => link()(value4, {
      decode: transform2((e) => make14(e, {
        label
      })),
      encode: disallowJsonEncode ? forbidden((oe) => "Cannot serialize Redacted" + (isSome2(oe) && typeof oe.value.label === "string" ? ` with label: "${oe.value.label}"` : "")) : transform2(value2)
    }),
    toEquivalence: ([value4]) => makeEquivalence6(value4)
  });
  return make23(schema2.ast, {
    value: value3
  });
}
function RedactedFromValue(value3, options3) {
  return decodeTo2(Redacted(toType2(value3), {
    label: options3?.label,
    disallowJsonEncode: options3?.disallowEncode
  }), {
    decode: transform2((t) => make14(t, {
      label: options3?.label
    })),
    encode: options3?.disallowEncode ? forbidden((oe) => "Cannot encode Redacted" + (isSome2(oe) && typeof oe.value.label === "string" ? ` with label: "${oe.value.label}"` : "")) : transform2(value2)
  })(value3);
}
function Result(success, failure) {
  const schema2 = declareConstructor()([success, failure], ([success2, failure2]) => (input, ast, options3) => {
    if (!isResult2(input)) {
      return fail6(new InvalidType(ast, input, options3));
    }
    switch (input._tag) {
      case "Success":
        return mapBothEager2(decodeEffect(success2)(input.success, options3), {
          onSuccess: succeed2,
          onFailure: (issue) => makeCompositeAtKey(ast, "success", issue, input, options3)
        });
      case "Failure":
        return mapBothEager2(decodeEffect(failure2)(input.failure, options3), {
          onSuccess: fail2,
          onFailure: (issue) => makeCompositeAtKey(ast, "failure", issue, input, options3)
        });
    }
  }, {
    representation: {
      id: "effect/schema/Result",
      payload: null
    },
    toCode: ({
      typeParameters
    }) => ({
      runtime: `Schema.Result(${typeParameters[0].runtime}, ${typeParameters[1].runtime})`,
      Type: `Result.Result<${typeParameters[0].Type}, ${typeParameters[1].Type}>`,
      importDeclarations: [`import * as Result from "effect/Result"`]
    }),
    expected: "Result",
    toCodec: ([success2, failure2]) => link()(Union2([Struct({
      _tag: Literal2("Success"),
      success: success2
    }), Struct({
      _tag: Literal2("Failure"),
      failure: failure2
    })]), transform3({
      decode: (e) => e._tag === "Success" ? succeed2(e.success) : fail2(e.failure),
      encode: (r) => isSuccess2(r) ? {
        _tag: "Success",
        success: r.success
      } : {
        _tag: "Failure",
        failure: r.failure
      }
    }))
  });
  return make23(schema2.ast, {
    success,
    failure
  });
}
var immerable = /* @__PURE__ */ globalThis.Symbol.for("immer-draftable");
var payloadToken = {};
function makeClass(Inherited, identifier2, struct2, annotations, proto) {
  const getClassSchema = getClassSchemaFactory(struct2, identifier2, annotations);
  const ClassTypeId = getClassTypeId(identifier2);
  const out = class extends Inherited {
    constructor(...[input, options3]) {
      const internalOptions = options3;
      const payload = internalOptions?.["~payload"];
      const value3 = payload?.token === payloadToken ? payload.value : struct2.make(input ?? {}, options3);
      super(value3, {
        ...options3,
        disableChecks: true,
        "~payload": {
          token: payloadToken,
          value: value3
        }
      });
    }
    static [TypeId27] = TypeId27;
    get [ClassTypeId]() {
      return ClassTypeId;
    }
    static [immerable] = true;
    static identifier = identifier2;
    static fields = struct2.fields;
    static get ast() {
      return getClassSchema(this).ast;
    }
    static pipe() {
      return pipeArguments(this, arguments);
    }
    static rebuild(ast) {
      return getClassSchema(this).rebuild(ast);
    }
    static make(input, options3) {
      return make18(getClassSchema(this))(input ?? {}, options3);
    }
    static makeOption(input, options3) {
      return makeOption(getClassSchema(this))(input ?? {}, options3);
    }
    static makeEffect(input, options3) {
      return getClassSchema(this).makeEffect(input ?? {}, options3);
    }
    static annotate(annotations2) {
      return this.rebuild(annotate(this.ast, annotations2));
    }
    static annotateKey(annotations2) {
      return this.rebuild(annotateKey(this.ast, annotations2));
    }
    static check(...checks) {
      return this.rebuild(appendChecks(this.ast, checks));
    }
    static extend(identifier3) {
      return (schema2, annotations2) => {
        const extension = isStruct(schema2) ? schema2 : Struct(schema2);
        const fields = {
          ...struct2.fields,
          ...extension.fields
        };
        const ast = struct(fields, struct2.ast.checks, {
          identifier: identifier3
        });
        return makeClass(this, identifier3, makeStruct(appendChecks(ast, extension.ast.checks), fields), annotations2, proto);
      };
    }
    static mapFields(f, options3) {
      return struct2.mapFields(f, options3);
    }
  };
  if (proto !== void 0) {
    Object.assign(out.prototype, proto(identifier2));
  }
  return out;
}
function getClassTransformation(self) {
  return new Transformation(transform2((input) => new self(input, {
    "~payload": {
      token: payloadToken,
      value: input
    }
  })), passthrough2());
}
function getClassTypeId(identifier2) {
  return `~effect/Schema/Class/${identifier2}`;
}
function getClassSchemaFactory(from, identifier2, annotations) {
  let memo;
  return (self) => {
    if (memo !== void 0) {
      return memo;
    }
    const ClassTypeId = getClassTypeId(identifier2);
    const isClassValue = (input) => input instanceof self || hasProperty(input, ClassTypeId);
    const transformation = getClassTransformation(self);
    const to = make23(new Declaration([from.ast], () => (input, ast, options3) => {
      return isClassValue(input) ? succeed6(input) : fail6(new InvalidType(ast, input, options3));
    }, {
      identifier: identifier2,
      [CONSTRUCTOR_ANNOTATION_KEY]: ([from2]) => ({
        isConstructed: isClassValue,
        link: new Link(from2, transformation)
      }),
      toCodec: ([from2]) => new Link(from2.ast, transformation),
      toEquivalence: ([from2]) => from2,
      toFormatter: ([from2]) => (t) => `${self.identifier}(${from2(t)})`,
      [SENTINELS_ANNOTATION_KEY]: collectSentinels(from.ast),
      ...annotations
    }));
    return memo = decodeTo2(to, transformation)(from);
  };
}
function isStruct(schema2) {
  return isSchema(schema2);
}
var Class4 = (identifier2) => (schema2, annotations) => {
  const struct2 = isStruct(schema2) ? schema2 : Struct(schema2);
  return makeClass(Class3, identifier2, struct2, annotations, (identifier3) => ({
    toString() {
      return `${identifier3}(${format({
        ...this
      })})`;
    }
  }));
};
var TaggedClass = (identifier2) => {
  return (tagValue, schema2, annotations) => {
    const struct2 = isStruct(schema2) ? schema2.mapFields((fields) => ({
      _tag: tag(tagValue),
      ...fields
    }), {
      unsafePreserveChecks: true
    }) : TaggedStruct(tagValue, schema2);
    return Class4(identifier2 ?? tagValue)(struct2, annotations);
  };
};
var Error4 = (identifier2) => (schema2, annotations) => {
  const struct2 = isStruct(schema2) ? schema2 : Struct(schema2);
  const self = makeClass(Error2, identifier2, struct2, annotations, (identifier3) => ({
    name: identifier3
  }));
  return self;
};
var TaggedError3 = (identifier2) => {
  return (tagValue, schema2, annotations) => {
    const struct2 = isStruct(schema2) ? schema2.mapFields((fields) => ({
      _tag: tag(tagValue),
      ...fields
    }), {
      unsafePreserveChecks: true
    }) : TaggedStruct(tagValue, schema2);
    return Error4(identifier2 ?? tagValue)(struct2, annotations);
  };
};
function overrideToFormatter(toFormatter3) {
  return (self) => self.annotate({
    toFormatter: toFormatter3
  });
}
function toFormatter2(schema2, options3) {
  return toFormatter(schema2.ast, options3);
}
function overrideToEquivalence(toEquivalence3) {
  return (self) => self.annotate({
    toEquivalence: toEquivalence3
  });
}
function toEquivalence2(schema2) {
  return toEquivalence(schema2.ast);
}
function toRepresentation2(schema2, options3) {
  return toRepresentation(schema2.ast, options3);
}
function toJsonSchemaDocument3(schema2, options3) {
  const document = toRepresentation(toCodecJsonAST(schema2.ast), options3);
  return toJsonSchemaDocument(document, options3);
}
var toCodecJson2 = toCodecJson;
var toCodecIso2 = toCodecIso;
var toCodecStringTree2 = toCodecStringTree;
var toCodecArrayFromSingle2 = toCodecArrayFromSingle;
function toEncoderXml2(codec, options3) {
  return toEncoderXml(codec, options3);
}
function toIso2(schema2) {
  return toIso(schema2);
}
function toIsoSource2(schema2) {
  return toIsoSource(schema2);
}
function toIsoFocus2(schema2) {
  return toIsoFocus(schema2);
}
function overrideToCodecIso(to, transformation) {
  return (schema2) => {
    return make23(annotate(schema2.ast, {
      toCodecIso: () => new Link(to.ast, makeTransformation(transformation))
    }), {
      schema: schema2
    });
  };
}
function toDifferJsonPatch2(schema2) {
  return toDifferJsonPatch(schema2);
}
function Tree(node) {
  const Tree$ref = suspend4(() => Tree2);
  const Tree2 = Union2([node, ArraySchema(Tree$ref), Record(String6, Tree$ref)]);
  return Tree2;
}
var Json2 = /* @__PURE__ */ make23(/* @__PURE__ */ annotate(Json, {
  toCode: () => ({
    runtime: "Schema.Json",
    Type: "Schema.Json"
  })
}));
var JsonObject = /* @__PURE__ */ Record(String6, Json2);
var JsonError = /* @__PURE__ */ Struct({
  message: String6,
  name: /* @__PURE__ */ optionalKey2(String6),
  stack: /* @__PURE__ */ optionalKey2(String6),
  cause: /* @__PURE__ */ optionalKey2(Json2)
});
var MutableJson2 = /* @__PURE__ */ make23(/* @__PURE__ */ annotate(MutableJson, {
  toCode: () => ({
    runtime: "Schema.MutableJson",
    Type: "Schema.MutableJson"
  })
}));
function resolveAnnotations(schema2) {
  return resolve(schema2.ast);
}
function resolveAnnotationsKey(schema2) {
  return schema2.ast.context?.annotations;
}

// ../../node_modules/effect/dist/Fiber.js
var interrupt3 = fiberInterrupt;
var getCurrent = getCurrentFiber;

// ../../node_modules/effect/dist/Latch.js
var makeUnsafe7 = makeLatchUnsafe;

// ../../node_modules/effect/dist/MutableRef.js
var TypeId28 = "~effect/MutableRef";
var MutableRefProto = {
  [TypeId28]: TypeId28,
  ...PipeInspectableProto,
  toJSON() {
    return {
      _id: "MutableRef",
      current: toJson(this.current)
    };
  }
};
var make24 = (value3) => {
  const ref = Object.create(MutableRefProto);
  ref.current = value3;
  return ref;
};

// ../../node_modules/effect/dist/MutableList.js
var Empty = /* @__PURE__ */ Symbol.for("effect/MutableList/Empty");
var make25 = () => ({
  head: void 0,
  tail: void 0,
  length: 0
});
var compactHead = (self) => {
  const head5 = self.head;
  if (head5.offset >= 1024 && head5 === self.tail && head5.mutable && (head5.array.length - head5.offset) * 8 <= head5.offset) {
    self.head = self.tail = {
      array: head5.array.slice(head5.offset),
      mutable: true,
      offset: 0,
      next: void 0
    };
  }
};
var emptyBucket = () => ({
  array: [],
  mutable: true,
  offset: 0,
  next: void 0
});
var append3 = (self, message) => {
  if (!self.tail) {
    self.head = self.tail = emptyBucket();
  } else if (!self.tail.mutable) {
    self.tail.next = emptyBucket();
    self.tail = self.tail.next;
  }
  self.tail.array.push(message);
  self.length++;
};
var clear = (self) => {
  self.head = self.tail = void 0;
  self.length = 0;
};
var takeN = (self, n) => {
  n = normalize(n);
  if (n <= 0 || !self.head) return [];
  n = Math.min(n, self.length);
  if (n === self.length && self.head?.offset === 0 && !self.head.next) {
    const array3 = self.head.array;
    clear(self);
    return array3;
  }
  const array2 = new Array(n);
  let index2 = 0;
  let chunk = self.head;
  while (chunk) {
    while (chunk.offset < chunk.array.length) {
      array2[index2++] = chunk.array[chunk.offset];
      if (chunk.mutable) chunk.array[chunk.offset] = void 0;
      chunk.offset++;
      if (index2 === n) {
        self.head = chunk.offset === chunk.array.length && chunk.next ? chunk.next : chunk;
        self.length -= n;
        if (self.length === 0) clear(self);
        else compactHead(self);
        return array2;
      }
    }
    chunk = chunk.next;
  }
  clear(self);
  return array2;
};
var take = (self) => {
  if (!self.head) return Empty;
  const message = self.head.array[self.head.offset];
  if (self.head.mutable) self.head.array[self.head.offset] = void 0;
  self.head.offset++;
  self.length--;
  if (self.head.offset === self.head.array.length) {
    if (self.head.next) {
      self.head = self.head.next;
    } else {
      clear(self);
    }
  } else {
    compactHead(self);
  }
  return message;
};

// ../../node_modules/effect/dist/Queue.js
var TypeId29 = "~effect/Queue";
var EnqueueTypeId = "~effect/Queue/Enqueue";
var DequeueTypeId = "~effect/Queue/Dequeue";
var variance = {
  _A: identity,
  _E: identity
};
var QueueProto = {
  [TypeId29]: variance,
  [EnqueueTypeId]: variance,
  [DequeueTypeId]: variance,
  ...PipeInspectableProto,
  toJSON() {
    return {
      _id: "effect/Queue",
      state: this.state._tag,
      size: sizeUnsafe(this)
    };
  }
};
var make26 = (options3) => withFiber((fiber3) => {
  const self = Object.create(QueueProto);
  self.dispatcher = fiber3.currentDispatcher;
  self.capacity = options3?.capacity ?? Number.POSITIVE_INFINITY;
  self.strategy = options3?.strategy ?? "suspend";
  self.messages = make25();
  self.scheduleRunning = false;
  self.state = {
    _tag: "Open",
    takers: /* @__PURE__ */ new Set(),
    offers: /* @__PURE__ */ new Set(),
    awaiters: /* @__PURE__ */ new Set()
  };
  return succeed3(self);
});
var offer = /* @__PURE__ */ dual(2, (self, message) => suspend(() => offerUnsafe(self, message) ? exitTrue : self.state._tag === "Open" && self.strategy === "suspend" ? offerOrWait(self, message) : exitFalse));
var offerUnsafe = (self, message) => {
  if (self.state._tag !== "Open") {
    return false;
  } else if (self.messages.length >= self.capacity) {
    if (self.strategy === "sliding") {
      take(self.messages);
      append3(self.messages, message);
      return true;
    } else if (self.capacity <= 0 && self.state.takers.size > 0) {
      append3(self.messages, message);
      releaseTakers(self);
      return true;
    }
    return false;
  }
  append3(self.messages, message);
  scheduleReleaseTaker(self);
  return true;
};
var failCauseUnsafe = (self, cause) => {
  if (self.state._tag !== "Open") {
    return false;
  }
  const exit3 = exitFailCause(cause);
  const fail11 = exitZipRight(exit3, exitFailDone);
  if (self.state.offers.size === 0 && self.messages.length === 0) {
    finalize(self, fail11);
    return true;
  }
  self.state = {
    ...self.state,
    _tag: "Closing",
    exit: fail11
  };
  scheduleReleaseTaker(self);
  return true;
};
var endUnsafe = (self) => failCauseUnsafe(self, causeFail(Done()));
var shutdown = (self) => sync(() => shutdownUnsafe(self));
var shutdownUnsafe = (self) => {
  if (self.state._tag === "Done") {
    return false;
  }
  clear(self.messages);
  const offers = self.state.offers;
  finalize(self, self.state._tag === "Open" ? exitInterrupt2 : self.state.exit);
  for (const entry of offers) {
    resumeUnoffered(entry);
  }
  return true;
};
var takeAll2 = (self) => takeBetween(self, 1, Number.POSITIVE_INFINITY);
var takeBetween = /* @__PURE__ */ dual(3, (self, min5, max5) => {
  min5 = normalize(min5);
  max5 = normalize(max5);
  return suspend(() => takeBetweenUnsafe(self, min5, max5) ?? andThen2(awaitTake(self, () => canTake(self, min5)), takeBetween(self, min5, max5)));
});
var sizeUnsafe = (self) => self.state._tag === "Done" ? 0 : self.messages.length;
var exitFalse = /* @__PURE__ */ exitSucceed(false);
var exitTrue = /* @__PURE__ */ exitSucceed(true);
var exitFailDone = /* @__PURE__ */ exitFail(/* @__PURE__ */ Done());
var exitInterrupt2 = /* @__PURE__ */ exitInterrupt();
var releaseTakers = (self) => {
  if (self.state._tag === "Done" || self.state.takers.size === 0) {
    return;
  }
  for (const taker of self.state.takers) {
    if (!taker.ready()) continue;
    self.state.takers.delete(taker);
    taker.resume(exitVoid);
    if (self.messages.length === 0) {
      break;
    }
  }
};
var scheduleReleaseTaker = (self) => {
  if (self.scheduleRunning || self.state._tag === "Done" || self.state.takers.size === 0) {
    return;
  }
  self.scheduleRunning = true;
  self.dispatcher.scheduleTask(() => {
    self.scheduleRunning = false;
    releaseTakers(self);
  }, 0);
};
var takeBetweenUnsafe = (self, min5, max5) => {
  if (self.state._tag === "Done") {
    return self.state.exit;
  } else if (max5 <= 0 || min5 <= 0) {
    return exitSucceed([]);
  } else if (!canTake(self, min5)) {
    return void 0;
  }
  const messages = self.messages.length > 0 ? takeN(self.messages, max5) : [takeOfferUnsafe(self.state.offers)];
  releaseCapacity(self);
  return exitSucceed(messages);
};
var canTake = (self, min5) => self.messages.length >= (self.state._tag === "Closing" ? 1 : Math.min(min5, self.capacity || 1)) || self.capacity <= 0 && self.state._tag !== "Done" && self.state.offers.size > 0;
var awaitTake = (self, ready) => callback((resume) => {
  if (self.state._tag === "Done") return resume(self.state.exit);
  if (ready()) return resume(exitVoid);
  const taker = {
    ready,
    resume
  };
  self.state.takers.add(taker);
  return sync(() => {
    if (self.state._tag !== "Done") self.state.takers.delete(taker);
  });
});
var offerOrWait = (self, message) => callback((resume) => offerUnsafe(self, message) ? resume(exitTrue) : waitToOffer(self, {
  _tag: "Single",
  message,
  resume
}));
var waitToOffer = (self, entry) => {
  if (self.state._tag !== "Open") return resumeUnoffered(entry);
  const offers = self.state.offers;
  offers.add(entry);
  return sync(() => {
    if (self.state._tag === "Done") return;
    offers.delete(entry);
    if (self.state._tag === "Closing" && offers.size === 0 && self.messages.length === 0) {
      finalize(self, self.state.exit);
    }
  });
};
var resumeUnoffered = (entry) => entry._tag === "Single" ? entry.resume(exitFalse) : entry.resume(exitSucceed(entry.remaining.slice(entry.offset)));
var takeOfferUnsafe = (offers) => {
  const entry = offers.values().next().value;
  if (entry._tag === "Single") {
    offers.delete(entry);
    entry.resume(exitTrue);
    return entry.message;
  }
  const message = entry.remaining[entry.offset++];
  if (entry.offset === entry.remaining.length) {
    offers.delete(entry);
    entry.resume(exitSucceed([]));
  }
  return message;
};
var releaseCapacity = (self) => {
  if (self.state._tag === "Done") {
    return isDoneCause(self.state.exit.cause);
  } else if (self.state.offers.size === 0) {
    if (self.state._tag === "Closing" && self.messages.length === 0) {
      finalize(self, self.state.exit);
      return isDoneCause(self.state.exit.cause);
    }
    return false;
  }
  for (const entry of self.state.offers) {
    let n = self.capacity - self.messages.length;
    if (n <= 0) break;
    else if (entry._tag === "Single") {
      append3(self.messages, entry.message);
      self.state.offers.delete(entry);
      entry.resume(exitTrue);
    } else {
      for (; entry.offset < entry.remaining.length; entry.offset++) {
        if (n === 0) return false;
        append3(self.messages, entry.remaining[entry.offset]);
        n--;
      }
      self.state.offers.delete(entry);
      entry.resume(exitSucceed([]));
    }
  }
  return false;
};
var finalize = (self, exit3) => {
  if (self.state._tag === "Done") {
    return;
  }
  const openState = self.state;
  self.state = {
    _tag: "Done",
    exit: exit3
  };
  for (const taker of openState.takers) {
    taker.resume(exit3);
  }
  openState.takers.clear();
  for (const awaiter of openState.awaiters) {
    awaiter(exit3);
  }
  openState.awaiters.clear();
};

// ../../node_modules/effect/dist/Channel.js
var TypeId30 = "~effect/Channel";
var ChannelProto = {
  [TypeId30]: {
    _Env: identity,
    _InErr: identity,
    _InElem: identity,
    _OutErr: identity,
    _OutElem: identity
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromTransform = (transform5) => {
  const self = Object.create(ChannelProto);
  self.transform = (upstream, scope3) => catchCause3(transform5(upstream, scope3), (cause) => succeed6(failCause3(cause)));
  return self;
};
var fromPull = (effect2) => fromTransform((_, __) => effect2);
var fromTransformBracket = (f) => fromTransform(fnUntraced2(function* (upstream, scope3) {
  const closableScope = forkUnsafe2(scope3);
  const onCause = (cause) => close(closableScope, doneExitFromCause(cause));
  const pull = yield* onError2(f(upstream, scope3, closableScope), onCause);
  return onError2(pull, onCause);
}));
var toTransform = (channel) => channel.transform;
var asyncQueue = (scope3, f, options3) => make26({
  capacity: options3?.bufferSize,
  strategy: options3?.strategy
}).pipe(tap4((queue) => addFinalizer2(scope3, shutdown(queue))), tap4((queue) => forkIn2(provide(f(queue), scope3), scope3)));
var callbackArray = (f, options3) => fromTransform((_, scope3) => map7(asyncQueue(scope3, f, options3), takeAll2));
var suspend5 = (evaluate2) => fromTransform((upstream, scope3) => suspend3(() => toTransform(evaluate2())(upstream, scope3)));
var fail8 = (error) => fromPull(succeed6(fail6(error)));
var fromReadableStream = (options3) => fromTransform((_, scope3) => readableStreamToPullUnsafe({
  scope: scope3,
  readable: options3.evaluate(),
  onError: options3.onError,
  releaseLockOnEnd: options3.releaseLockOnEnd
}));
var readableStreamToPullUnsafe = (options3) => {
  const reader = options3.readable.getReader();
  const exit3 = options3.exit ?? make24(void 0);
  const pull = suspend3(() => {
    if (exit3.current) return exit3.current;
    return matchCauseEffect2(tryPromise2({
      try: () => reader.read(),
      catch: options3.onError
    }), {
      onFailure: (cause) => exit3.current ?? failCause3(cause),
      onSuccess: ({
        done: done3,
        value: value3
      }) => {
        if (exit3.current) return exit3.current;
        return done3 ? done2() : succeed6(of(value3));
      }
    });
  });
  return as3(addFinalizer2(options3.scope, options3.releaseLockOnEnd ? sync3(() => reader.releaseLock()) : promise2(() => reader.cancel().catch(constVoid))), pull);
};
var unwrap2 = (channel) => fromTransform((upstream, scope3) => {
  let pull;
  return succeed6(suspend3(() => {
    if (pull) return pull;
    return channel.pipe(provide(scope3), flatMap5((channel2) => toTransform(channel2)(upstream, scope3)), flatMap5((pull_) => pull = pull_));
  }));
});
var onExit3 = /* @__PURE__ */ dual(2, (self, finalizer) => fromTransformBracket((upstream, scope3, forkedScope) => addFinalizerExit(forkedScope, finalizer).pipe(andThen3(toTransform(self)(upstream, scope3)))));
var ensuring3 = /* @__PURE__ */ dual(2, (self, finalizer) => onExit3(self, (_) => finalizer));
var runWith = (self, f, onHalt) => suspend3(() => {
  const scope3 = makeUnsafe3();
  const makePull = toTransform(self)(done2(), scope3);
  return catchDone(flatMap5(makePull, f), onHalt ? onHalt : succeed6).pipe(onExit2((exit3) => close(scope3, exit3)));
});
var runForEach = /* @__PURE__ */ dual(2, (self, f) => runWith(self, (pull) => forever3(flatMap5(pull, f), {
  disableYield: true
})));

// ../../node_modules/effect/dist/FileSystem.js
var FileSystem_exports = {};
__export(FileSystem_exports, {
  FileSystem: () => FileSystem,
  FileTypeId: () => FileTypeId,
  WatchBackend: () => WatchBackend,
  isFile: () => isFile,
  layerNoop: () => layerNoop,
  make: () => make27,
  makeNoop: () => makeNoop
});

// ../../node_modules/effect/dist/PlatformError.js
var TypeId31 = "~effect/PlatformError";
var BadArgument = class extends (/* @__PURE__ */ TaggedError2("BadArgument")) {
  /**
   * Formats the module, method, and optional description that rejected the argument.
   *
   * **When to use**
   *
   * Use to read the formatted error message for a rejected platform argument.
   *
   * @since 4.0.0
   */
  get message() {
    return `${this.module}.${this.method}${this.description ? `: ${this.description}` : ""}`;
  }
};
var SystemError = class extends Error3 {
  /**
   * Formats the normalized system error tag with operation and path details.
   *
   * **When to use**
   *
   * Use to read the formatted error message for a normalized system failure.
   *
   * @since 4.0.0
   */
  get message() {
    return `${this._tag}: ${this.module}.${this.method}${this.pathOrDescriptor !== void 0 ? ` (${this.pathOrDescriptor})` : ""}${this.description ? `: ${this.description}` : ""}`;
  }
};
var PlatformError = class extends (/* @__PURE__ */ TaggedError2("PlatformError")) {
  constructor(reason) {
    if ("cause" in reason) {
      super({
        reason,
        cause: reason.cause
      });
    } else {
      super({
        reason
      });
    }
  }
  /**
   * Marks this value as a platform error wrapper for runtime guards.
   *
   * **When to use**
   *
   * Use to identify `PlatformError` values through their runtime type marker.
   *
   * @since 4.0.0
   */
  [TypeId31] = TypeId31;
  get message() {
    return this.reason.message;
  }
};
var systemError = (options3) => new PlatformError(new SystemError(options3));
var badArgument = (options3) => new PlatformError(new BadArgument(options3));

// ../../node_modules/effect/dist/internal/stream.js
var TypeId32 = "~effect/Stream";
var streamVariance = {
  _R: identity,
  _E: identity,
  _A: identity
};
var Stream = function(channel) {
  this.channel = channel;
};
Stream.prototype = {
  [TypeId32]: streamVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromChannel = (channel) => new Stream(channel);

// ../../node_modules/effect/dist/Sink.js
var TypeId33 = "~effect/Sink";
var endVoid = /* @__PURE__ */ succeed6([void 0]);
var sinkVariance = {
  _A: identity,
  _In: identity,
  _L: identity,
  _E: identity,
  _R: identity
};
var SinkProto = {
  [TypeId33]: sinkVariance,
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var fromChannel2 = (channel) => fromTransform2((upstream, scope3) => toTransform(channel)(upstream, scope3).pipe(flatMap5(forever3({
  disableYield: true
})), catchDone(succeed6)));
var fromTransform2 = (transform5) => {
  const self = Object.create(SinkProto);
  self.transform = transform5;
  return self;
};
var toChannel = (self) => fromTransform((upstream, scope3) => succeed6(flatMap5(self.transform(upstream, scope3), done2)));
var fromEffectEnd = (effect2) => fromTransform2(() => effect2);
var fail9 = (e) => fromEffectEnd(fail6(e));
var forEach4 = (f) => forEachArray(forEach2((_) => f(_), {
  discard: true
}));
var forEachArray = (f) => fromTransform2((upstream) => upstream.pipe(flatMap5(f), forever3({
  disableYield: true
}), catchDone(() => endVoid)));
var unwrap3 = (effect2) => fromChannel2(unwrap2(map7(effect2, toChannel)));

// ../../node_modules/effect/dist/Stream.js
var TypeId34 = "~effect/Stream";
var isStream = (u) => hasProperty(u, TypeId34);
var fromChannel3 = fromChannel;
var fromPull2 = (pull) => fromChannel3(fromPull(pull));
var toChannel2 = (stream3) => stream3.channel;
var callback3 = (f, options3) => fromChannel3(callbackArray(f, options3));
var suspend6 = (stream3) => fromChannel3(suspend5(() => stream3().channel));
var fail10 = (error) => fromChannel3(fail8(error));
var fromReadableStream2 = (options3) => fromChannel3(fromReadableStream(options3));
var unwrap4 = (effect2) => fromChannel3(unwrap2(map7(effect2, toChannel2)));
var ensuring4 = /* @__PURE__ */ dual(2, (self, finalizer) => fromChannel3(ensuring3(self.channel, finalizer)));
var runForEachArray = /* @__PURE__ */ dual(2, (self, f) => runForEach(self.channel, f));
var toReadableStreamWith = /* @__PURE__ */ dual((args2) => isStream(args2[0]), (self, context3, options3) => {
  let currentResolve = void 0;
  let fiber3 = void 0;
  const latch = makeUnsafe7(false);
  return new ReadableStream({
    start(controller) {
      fiber3 = runFork2(provideContext2(runForEachArray(self, (chunk) => latch.whenOpen(sync3(() => {
        latch.closeUnsafe();
        for (let i = 0; i < chunk.length; i++) {
          controller.enqueue(chunk[i]);
        }
        currentResolve();
        currentResolve = void 0;
      }))), context3));
      fiber3.addObserver((exit3) => {
        if (exit3._tag === "Failure") {
          controller.error(squash(exit3.cause));
        } else {
          controller.close();
        }
      });
    },
    pull() {
      return new Promise((resolve6) => {
        currentResolve = resolve6;
        latch.openUnsafe();
      });
    },
    cancel() {
      if (!fiber3) return;
      return runPromise2(asVoid3(interrupt3(fiber3)));
    }
  }, options3?.strategy);
});
var toReadableStreamEffect = /* @__PURE__ */ dual((args2) => isStream(args2[0]), (self, options3) => map7(context2(), (context3) => toReadableStreamWith(self, context3, options3)));

// ../../node_modules/effect/dist/FileSystem.js
var TypeId35 = "~effect/FileSystem";
var FileSystem = /* @__PURE__ */ Service("effect/FileSystem");
var make27 = (impl) => FileSystem.of({
  ...impl,
  [TypeId35]: TypeId35,
  exists: (path) => pipe(impl.access(path), as3(true), catchTag3("PlatformError", (e) => e.reason._tag === "NotFound" ? succeed6(false) : fail6(e))),
  readFileString: (path, encoding) => flatMap5(impl.readFile(path), (_) => try_3({
    try: () => new TextDecoder(encoding).decode(_),
    catch: (cause) => badArgument({
      module: "FileSystem",
      method: "readFileString",
      description: "invalid encoding",
      cause
    })
  })),
  stream: fnUntraced2(function* (path, options3) {
    const file2 = yield* impl.open(path, {
      flag: "r"
    });
    const offset = options3?.offset === void 0 ? void 0 : fromInputUnsafe2(options3.offset);
    if (offset) {
      yield* file2.seek(offset, "start");
    }
    const bytesToRead = options3?.bytesToRead === void 0 ? void 0 : fromInputUnsafe2(options3.bytesToRead);
    let totalBytesRead = BigInt(0);
    const chunkSize = Number(BigInt(options3?.chunkSize ?? 64 * 1024));
    const readChunk = file2.readAlloc(chunkSize);
    return fromPull2(succeed6(flatMap5(suspend3(() => {
      if (bytesToRead !== void 0 && bytesToRead <= totalBytesRead) {
        return done2();
      }
      return bytesToRead !== void 0 && bytesToRead - totalBytesRead < chunkSize ? file2.readAlloc(Number(bytesToRead - totalBytesRead)) : readChunk;
    }), match({
      onNone: () => done2(),
      onSome: (buf) => {
        totalBytesRead += BigInt(buf.length);
        return succeed6(of(buf));
      }
    }))));
  }, unwrap4),
  sink: (path, options3) => pipe(impl.open(path, {
    ...options3,
    flag: options3?.flag ?? "w"
  }), map7((file2) => forEach4((_) => file2.writeAll(_))), unwrap3),
  writeFileString: (path, data, options3) => flatMap5(try_3({
    try: () => new TextEncoder().encode(data),
    catch: (cause) => badArgument({
      module: "FileSystem",
      method: "writeFileString",
      description: "could not encode string",
      cause
    })
  }), (_) => impl.writeFile(path, _, options3))
});
var notFound2 = (method, path) => systemError({
  module: "FileSystem",
  method,
  _tag: "NotFound",
  description: "No such file or directory",
  pathOrDescriptor: path
});
var makeNoop = (fileSystem) => FileSystem.of({
  [TypeId35]: TypeId35,
  access(path) {
    return fail6(notFound2("access", path));
  },
  chmod(path) {
    return fail6(notFound2("chmod", path));
  },
  chown(path) {
    return fail6(notFound2("chown", path));
  },
  copy(path) {
    return fail6(notFound2("copy", path));
  },
  copyFile(path) {
    return fail6(notFound2("copyFile", path));
  },
  glob(pattern) {
    return fail6(notFound2("glob", pattern));
  },
  exists() {
    return succeed6(false);
  },
  link(path) {
    return fail6(notFound2("link", path));
  },
  makeDirectory() {
    return die3("not implemented");
  },
  makeTempDirectory() {
    return die3("not implemented");
  },
  makeTempDirectoryScoped() {
    return die3("not implemented");
  },
  makeTempFile() {
    return die3("not implemented");
  },
  makeTempFileScoped() {
    return die3("not implemented");
  },
  open(path) {
    return fail6(notFound2("open", path));
  },
  readDirectory(path) {
    return fail6(notFound2("readDirectory", path));
  },
  readFile(path) {
    return fail6(notFound2("readFile", path));
  },
  readFileString(path) {
    return fail6(notFound2("readFileString", path));
  },
  readLink(path) {
    return fail6(notFound2("readLink", path));
  },
  realPath(path) {
    return fail6(notFound2("realPath", path));
  },
  remove() {
    return void_4;
  },
  rename(oldPath) {
    return fail6(notFound2("rename", oldPath));
  },
  sink(path) {
    return fail9(notFound2("sink", path));
  },
  stat(path) {
    return fail6(notFound2("stat", path));
  },
  stream(path) {
    return fail10(notFound2("stream", path));
  },
  symlink(fromPath) {
    return fail6(notFound2("symlink", fromPath));
  },
  truncate(path) {
    return fail6(notFound2("truncate", path));
  },
  utimes(path) {
    return fail6(notFound2("utimes", path));
  },
  watch(path) {
    return fail10(notFound2("watch", path));
  },
  writeFile(path) {
    return fail6(notFound2("writeFile", path));
  },
  writeFileString(path) {
    return fail6(notFound2("writeFileString", path));
  },
  ...fileSystem
});
var layerNoop = (fileSystem) => succeed5(FileSystem)(makeNoop(fileSystem));
var FileTypeId = "~effect/FileSystem/File";
var isFile = (u) => hasProperty(u, FileTypeId);
var WatchBackend = class extends (/* @__PURE__ */ Service()("effect/FileSystem/WatchBackend")) {
};

// ../../node_modules/effect/dist/Path.js
var Path_exports = {};
__export(Path_exports, {
  Path: () => Path,
  TypeId: () => TypeId36,
  layer: () => layer
});
var TypeId36 = "~effect/Path";
var Path = /* @__PURE__ */ Service("effect/Path");
function normalizeStringPosix(path, allowAboveRoot) {
  let res = "";
  let lastSegmentLength = 0;
  let lastSlash = -1;
  let dots = 0;
  let code;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) {
      code = path.charCodeAt(i);
    } else if (code === 47) {
      break;
    } else {
      code = 47;
    }
    if (code === 47) {
      if (lastSlash === i - 1 || dots === 1) {
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
          if (res.length > 2) {
            const lastSlashIndex = res.lastIndexOf("/");
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = "";
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = "";
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) {
            res += "/..";
          } else {
            res = "..";
          }
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0) {
          res += "/" + path.slice(lastSlash + 1, i);
        } else {
          res = path.slice(lastSlash + 1, i);
        }
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
function _format(sep, pathObject) {
  const dir = pathObject.dir || pathObject.root;
  const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}
function fromFileUrl(url) {
  if (url.protocol !== "file:") {
    return fail6(new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      description: "URL must be of scheme file"
    }));
  } else if (url.hostname !== "") {
    return fail6(new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      description: "Invalid file URL host"
    }));
  }
  const pathname = url.pathname;
  for (let n = 0; n < pathname.length; n++) {
    if (pathname[n] === "%") {
      const third = pathname.codePointAt(n + 2) | 32;
      if (pathname[n + 1] === "2" && third === 102) {
        return fail6(new BadArgument({
          module: "Path",
          method: "fromFileUrl",
          description: "must not include encoded / characters"
        }));
      }
    }
  }
  return succeed6(decodeURIComponent(pathname));
}
var resolve3 = function resolve4() {
  let resolvedPath = "";
  let resolvedAbsolute = false;
  let cwd = void 0;
  for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0) {
      path = arguments[i];
    } else {
      const process2 = globalThis.process;
      if (cwd === void 0 && "process" in globalThis && typeof process2 === "object" && process2 !== null && typeof process2.cwd === "function") {
        cwd = process2.cwd();
      }
      path = cwd;
    }
    if (path.length === 0) {
      continue;
    }
    resolvedPath = path + "/" + resolvedPath;
    resolvedAbsolute = path.charCodeAt(0) === 47;
  }
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute) {
    if (resolvedPath.length > 0) {
      return "/" + resolvedPath;
    } else {
      return "/";
    }
  } else if (resolvedPath.length > 0) {
    return resolvedPath;
  } else {
    return ".";
  }
};
var CHAR_FORWARD_SLASH = 47;
function toFileUrl(filepath) {
  const outURL = new URL("file://");
  let resolved = resolve3(filepath);
  const filePathLast = filepath.charCodeAt(filepath.length - 1);
  if (filePathLast === CHAR_FORWARD_SLASH && resolved[resolved.length - 1] !== "/") {
    resolved += "/";
  }
  outURL.pathname = encodePathChars(resolved);
  return succeed6(outURL);
}
var percentRegExp = /%/g;
var backslashRegExp = /\\/g;
var newlineRegExp = /\n/g;
var carriageReturnRegExp = /\r/g;
var tabRegExp = /\t/g;
function encodePathChars(filepath) {
  if (filepath.includes("%")) {
    filepath = filepath.replace(percentRegExp, "%25");
  }
  if (filepath.includes("\\")) {
    filepath = filepath.replace(backslashRegExp, "%5C");
  }
  if (filepath.includes("\n")) {
    filepath = filepath.replace(newlineRegExp, "%0A");
  }
  if (filepath.includes("\r")) {
    filepath = filepath.replace(carriageReturnRegExp, "%0D");
  }
  if (filepath.includes("	")) {
    filepath = filepath.replace(tabRegExp, "%09");
  }
  return filepath;
}
var posixImpl = /* @__PURE__ */ Path.of({
  [TypeId36]: TypeId36,
  resolve: resolve3,
  normalize(path) {
    if (path.length === 0) return ".";
    const isAbsolute = path.charCodeAt(0) === 47;
    const trailingSeparator = path.charCodeAt(path.length - 1) === 47;
    path = normalizeStringPosix(path, !isAbsolute);
    if (path.length === 0 && !isAbsolute) path = ".";
    if (path.length > 0 && trailingSeparator) path += "/";
    if (isAbsolute) return "/" + path;
    return path;
  },
  isAbsolute(path) {
    return path.length > 0 && path.charCodeAt(0) === 47;
  },
  join() {
    if (arguments.length === 0) {
      return ".";
    }
    let joined;
    for (let i = 0; i < arguments.length; ++i) {
      const arg = arguments[i];
      if (arg.length > 0) {
        if (joined === void 0) {
          joined = arg;
        } else {
          joined += "/" + arg;
        }
      }
    }
    if (joined === void 0) {
      return ".";
    }
    return posixImpl.normalize(joined);
  },
  relative(from, to) {
    if (from === to) return "";
    from = posixImpl.resolve(from);
    to = posixImpl.resolve(to);
    if (from === to) return "";
    let fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47) {
        break;
      }
    }
    const fromEnd = from.length;
    const fromLen = fromEnd - fromStart;
    let toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47) {
        break;
      }
    }
    const toEnd = to.length;
    const toLen = toEnd - toStart;
    const length = fromLen < toLen ? fromLen : toLen;
    let lastCommonSep = -1;
    let i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47) {
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47) {
            lastCommonSep = i;
          } else if (i === 0) {
            lastCommonSep = 0;
          }
        }
        break;
      }
      const fromCode = from.charCodeAt(fromStart + i);
      const toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode) {
        break;
      } else if (fromCode === 47) {
        lastCommonSep = i;
      }
    }
    let out = "";
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47) {
        if (out.length === 0) {
          out += "..";
        } else {
          out += "/..";
        }
      }
    }
    if (out.length > 0) {
      return out + to.slice(toStart + lastCommonSep);
    } else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47) {
        ++toStart;
      }
      return to.slice(toStart);
    }
  },
  dirname(path) {
    if (path.length === 0) return ".";
    let code = path.charCodeAt(0);
    const hasRoot = code === 47;
    let end = -1;
    let matchedSlash = true;
    for (let i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          end = i;
          break;
        }
      } else {
        matchedSlash = false;
      }
    }
    if (end === -1) return hasRoot ? "/" : ".";
    if (hasRoot && end === 1) return "//";
    return path.slice(0, end);
  },
  basename(path, ext) {
    let start = 0;
    let end = -1;
    let matchedSlash = true;
    let i;
    if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return "";
      let extIdx = ext.length - 1;
      let firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else {
          if (firstNonSlashEnd === -1) {
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                end = i;
              }
            } else {
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }
      if (start === end) end = firstNonSlashEnd;
      else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47) {
          if (!matchedSlash) {
            start = i + 1;
            break;
          }
        } else if (end === -1) {
          matchedSlash = false;
          end = i + 1;
        }
      }
      if (end === -1) return "";
      return path.slice(start, end);
    }
  },
  extname(path) {
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let preDotState = 0;
    for (let i = path.length - 1; i >= 0; --i) {
      const code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1) {
          startDot = i;
        } else if (preDotState !== 1) {
          preDotState = 1;
        }
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return "";
    }
    return path.slice(startDot, end);
  },
  format: function format7(pathObject) {
    if (pathObject === null || typeof pathObject !== "object") {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format("/", pathObject);
  },
  parse(path) {
    const ret = {
      root: "",
      dir: "",
      base: "",
      ext: "",
      name: ""
    };
    if (path.length === 0) return ret;
    let code = path.charCodeAt(0);
    const isAbsolute = code === 47;
    let start;
    if (isAbsolute) {
      ret.root = "/";
      start = 1;
    } else {
      start = 0;
    }
    let startDot = -1;
    let startPart = 0;
    let end = -1;
    let matchedSlash = true;
    let i = path.length - 1;
    let preDotState = 0;
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47) {
        if (!matchedSlash) {
          startPart = i + 1;
          break;
        }
        continue;
      }
      if (end === -1) {
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46) {
        if (startDot === -1) startDot = i;
        else if (preDotState !== 1) preDotState = 1;
      } else if (startDot !== -1) {
        preDotState = -1;
      }
    }
    if (startDot === -1 || end === -1 || // We saw a non-dot character immediately before the dot
    preDotState === 0 || // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
        else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }
    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);
    else if (isAbsolute) ret.dir = "/";
    return ret;
  },
  sep: "/",
  fromFileUrl,
  toFileUrl,
  toNamespacedPath: identity
});
var layer = /* @__PURE__ */ succeed5(Path)(posixImpl);

// ../../node_modules/effect/dist/ConfigProvider.js
function makeValue(value3) {
  return {
    _tag: "Value",
    value: value3
  };
}
function makeRecord(keys3, value3) {
  return {
    _tag: "Record",
    keys: keys3,
    value: value3
  };
}
function makeArray(length, value3) {
  return {
    _tag: "Array",
    length,
    value: value3
  };
}
var ConfigProvider = /* @__PURE__ */ Reference("effect/ConfigProvider", {
  defaultValue: () => fromEnv()
});
var Proto8 = {
  ...PipeInspectableProto,
  toJSON() {
    return {
      _id: "ConfigProvider"
    };
  }
};
var identityPath = (path) => path;
function makeProvider(load2, mapInput2) {
  const self = Object.create(Proto8);
  self.load = load2;
  self.mapInput = mapInput2;
  return self;
}
function makeSource(get8, transform5) {
  return makeProvider((path) => get8(transform5(path)), (f) => makeSource(get8, (path) => f(transform5(path))));
}
function make28(get8) {
  return makeSource(get8, identityPath);
}
function emptyStringAsMissing(value3, preserveEmptyStrings) {
  return value3 === "" && !preserveEmptyStrings ? void 0 : value3;
}
function fromEnvRecord(env, options3) {
  const preserveEmptyStrings = options3?.preserveEmptyStrings === true;
  const trie = buildEnvTrie(env);
  return make28((path) => succeed6(nodeAtEnv(trie, env, path, preserveEmptyStrings)));
}
function fromEnv(options3) {
  const env = options3?.env ?? {
    ...globalThis.process?.env,
    ...import.meta?.env
  };
  return fromEnvRecord(env, {
    preserveEmptyStrings: options3?.preserveEmptyStrings
  });
}
function buildEnvTrie(env) {
  const trie = {};
  for (const [name, value3] of Object.entries(env)) {
    if (value3 === void 0) continue;
    const segments = name.split("_");
    let node = trie;
    for (const seg of segments) {
      const children = node.children ??= /* @__PURE__ */ Object.create(null);
      node = children[seg] ??= {};
    }
  }
  return trie;
}
function nodeAtEnv(trie, env, path, preserveEmptyStrings) {
  const key = path.map(String).join("_");
  const leafValue = emptyStringAsMissing(Object.hasOwn(env, key) ? env[key] : void 0, preserveEmptyStrings);
  const trieNode = trieNodeAt(trie, path);
  const children = trieNode?.children ? Object.keys(trieNode.children) : [];
  if (children.length === 0) {
    return leafValue === void 0 ? void 0 : makeValue(leafValue);
  }
  const allNumeric = children.every(isCanonicalArrayIndex);
  if (allNumeric) {
    const length = Math.max(...children.map((k) => parseInt(k, 10))) + 1;
    return makeArray(length, leafValue);
  }
  return makeRecord(new Set(children), leafValue);
}
function trieNodeAt(root, path) {
  if (path.length === 0) return root;
  let node = root;
  for (const seg of path) {
    node = node?.children?.[String(seg)];
    if (!node) return void 0;
  }
  return node;
}

// ../../node_modules/effect/dist/Config.js
var TypeId37 = "~effect/Config";
var ConfigError = class {
  _tag = "ConfigError";
  name = "ConfigError";
  cause;
  constructor(cause) {
    this.cause = cause;
  }
  get message() {
    return this.cause.toString();
  }
  toString() {
    return `ConfigError(${this.message})`;
  }
};
var Proto9 = {
  .../* @__PURE__ */ Prototype2({
    label: "Config",
    evaluate(fiber3) {
      return this.parse(fiber3.getRef(ConfigProvider));
    }
  }),
  [TypeId37]: TypeId37,
  toJSON() {
    return {
      _id: "Config"
    };
  }
};
function make29(evaluator) {
  const self = Object.create(Proto9);
  self.evaluator = evaluator;
  self.parse = (provider) => flatMapEager2(evaluator(provider, []), fromResult2);
  return self;
}
var evaluateAt = (self, provider, pathPrefix) => self.evaluator(provider, pathPrefix);
var map11 = /* @__PURE__ */ dual(2, (self, f) => {
  return make29((provider, pathPrefix) => map7(evaluateAt(self, provider, pathPrefix), map2(f)));
});
function all5(arg) {
  const configs = globalThis.Array.isArray(arg) ? arg : Symbol.iterator in arg ? [...arg] : arg;
  return make29((provider, pathPrefix) => globalThis.Array.isArray(configs) ? mapEager2(all4(configs.map((config) => evaluateAt(config, provider, pathPrefix))), all2) : mapEager2(all4(map3(configs, (config) => evaluateAt(config, provider, pathPrefix))), all2));
}
var withDefault3 = /* @__PURE__ */ dual(2, (self, defaultValue) => {
  return make29((provider, pathPrefix) => mapEager2(evaluateAt(self, provider, pathPrefix), (resolution) => isFailure2(resolution) ? succeed2(defaultValue) : resolution));
});
var option3 = (self) => self.pipe(map11(some2), withDefault3(none2()));
var isSourceError = (u) => isTagged(u, "SourceError");
var cursorToString = () => "<configuration>";
var loadCursor = (provider, path) => provider.load(path).pipe(orDie3, mapEager2((node) => ({
  provider,
  path,
  node,
  toString: cursorToString
})));
var loadChildCursor = (cursor, segment) => loadCursor(cursor.provider, [...cursor.path, segment]);
var decodeFromCursor = (ast, decode5) => decodeTo(unknown, ast, new Transformation(transformEffect((input) => decode5(input)), passthrough2()));
var isScalarInput = (ast) => {
  switch (ast._tag) {
    case "Union":
      return ast.types.every(isScalarInput);
    case "Objects":
    case "Arrays":
    case "Suspend":
      return false;
    default:
      return true;
  }
};
var hasProviderInput = (ast, node) => {
  switch (ast._tag) {
    case "Objects":
      return node?._tag === "Record";
    case "Arrays":
      return node?._tag === "Array";
    case "Union":
      return ast.types.some((ast2) => hasProviderInput(ast2, node));
    case "Suspend":
      return hasProviderInput(ast.thunk(), node);
    default:
      return node?.value !== void 0;
  }
};
var toConfigCursorAST = /* @__PURE__ */ memoize((root) => {
  const seen = /* @__PURE__ */ new WeakSet();
  const recur2 = applyToSelfOrLastLinkEncoding((ast) => {
    seen.add(ast);
    switch (ast._tag) {
      case "Objects": {
        const matchesIndex = ast.indexSignatures.map((is3) => _is(is3.parameter));
        const materialize = fnUntraced2(function* (cursor) {
          if (cursor.node?._tag !== "Record") {
            return void 0;
          }
          const node = cursor.node;
          const keys3 = /* @__PURE__ */ new Set();
          for (const property of ast.propertySignatures) {
            if (typeof property.name === "string") keys3.add(property.name);
          }
          if (matchesIndex.length > 0) {
            for (const key of node.keys) {
              if (matchesIndex.some((matches) => matches(key))) keys3.add(key);
            }
          }
          const out = {};
          for (const key of keys3) {
            const child = yield* loadChildCursor(cursor, key);
            if (child.node !== void 0) assignProperty(out, key, child);
          }
          return out;
        });
        return decodeFromCursor(ast.recur(recur2, (ast2) => ast2), materialize);
      }
      case "Arrays": {
        const materialize = fnUntraced2(function* (cursor) {
          if (cursor.node?._tag !== "Array") {
            return void 0;
          }
          const out = [];
          for (let i = 0; i < cursor.node.length; i++) {
            out.push(yield* loadChildCursor(cursor, i));
          }
          return out;
        });
        return decodeFromCursor(ast.recur(recur2), materialize);
      }
      case "Union":
        for (const member of ast.types) {
          recur2(member);
        }
        if (!isScalarInput(ast)) return ast.recur(recur2);
        break;
      case "Suspend": {
        const target = ast.thunk();
        if (!seen.has(target)) recur2(target);
        return ast.recur(recur2);
      }
      case "Declaration":
      case "Any":
        throw new globalThis.Error("Config.schema does not support opaque StringTree encodings", {
          cause: ast
        });
    }
    return decodeFromCursor(ast, (cursor) => succeed6(cursor.node?.value));
  });
  return recur2(root);
});
function schema(codec, path) {
  const codecStringTree = toCodecStringTree2(codec);
  const encodedAst = toEncoded(codecStringTree.ast);
  const decodeCursor = decodeUnknownEffect(make23(toConfigCursorAST(codecStringTree.ast)));
  const localPath = typeof path === "string" ? [path] : path ?? [];
  return make29((provider, pathPrefix) => {
    const fullPath = [...pathPrefix, ...localPath];
    return loadCursor(provider, fullPath).pipe(flatMapEager2((cursor) => decodeCursor(cursor).pipe(mapEager2(succeed2), catchEager2((issue) => {
      const error = new ConfigError(new SchemaError(fullPath.length > 0 ? new Pointer(fullPath, issue) : issue));
      return hasProviderInput(encodedAst, cursor.node) ? fail6(error) : succeed6(fail2(error));
    }))), catchDefect2((defect) => isSourceError(defect) ? fail6(new ConfigError(defect)) : die3(defect)));
  });
}
function Redacted2(name) {
  return schema(Redacted(String6), name);
}

// ../../node_modules/effect/dist/Ref.js
var TypeId38 = "~effect/Ref";
var RefProto = {
  [TypeId38]: {
    _A: identity
  },
  ...PipeInspectableProto,
  toJSON() {
    return {
      _id: "Ref",
      ref: this.ref
    };
  }
};
var get5 = (self) => sync3(() => self.ref.current);
var update2 = /* @__PURE__ */ dual(2, (self, f) => sync3(() => {
  self.ref.current = f(self.ref.current);
}));

// ../../node_modules/@effect/platform-node-shared/dist/NodeFileSystem.js
import * as Crypto from "node:crypto";
import * as NFS from "node:fs";
import * as OS from "node:os";
import * as Path2 from "node:path";

// ../../node_modules/@effect/platform-node-shared/dist/internal/utils.js
var handleErrnoException = (module, method) => (err, [path]) => {
  let reason = "Unknown";
  switch (err.code) {
    case "ENOENT":
      reason = "NotFound";
      break;
    case "EACCES":
      reason = "PermissionDenied";
      break;
    case "EEXIST":
      reason = "AlreadyExists";
      break;
    case "EISDIR":
      reason = "BadResource";
      break;
    case "ENOTDIR":
      reason = "BadResource";
      break;
    case "EBUSY":
      reason = "Busy";
      break;
    case "ELOOP":
      reason = "BadResource";
      break;
  }
  return systemError({
    _tag: reason,
    module,
    method,
    pathOrDescriptor: path,
    syscall: err.syscall,
    cause: err
  });
};

// ../../node_modules/@effect/platform-node-shared/dist/NodeFileSystem.js
var handleBadArgument = (method) => (err) => badArgument({
  module: "FileSystem",
  method,
  description: err.message ?? String(err)
});
var bigintToNumber = (value3, field) => {
  const number3 = Number(value3);
  if (!Number.isSafeInteger(number3)) {
    throw new RangeError(`${field} exceeds the safe integer range: ${value3}`);
  }
  return number3;
};
var bigintToNumberOption = (value3) => flatMap(fromNullishOr(value3), toNumber);
var positionToNumber = (position, method) => try_3({
  try: () => bigintToNumber(position, "position"),
  catch: handleBadArgument(method)
});
var access2 = /* @__PURE__ */ (() => {
  const nodeAccess = /* @__PURE__ */ effectify(NFS.access, /* @__PURE__ */ handleErrnoException("FileSystem", "access"), /* @__PURE__ */ handleBadArgument("access"));
  return (path, options3) => {
    let mode = NFS.constants.F_OK;
    if (options3?.readable) {
      mode |= NFS.constants.R_OK;
    }
    if (options3?.writable) {
      mode |= NFS.constants.W_OK;
    }
    return nodeAccess(path, mode);
  };
})();
var copy3 = /* @__PURE__ */ (() => {
  const nodeCp = /* @__PURE__ */ effectify(NFS.cp, /* @__PURE__ */ handleErrnoException("FileSystem", "copy"), /* @__PURE__ */ handleBadArgument("copy"));
  return (fromPath, toPath, options3) => nodeCp(fromPath, toPath, {
    force: options3?.overwrite ?? false,
    preserveTimestamps: options3?.preserveTimestamps ?? false,
    recursive: true
  });
})();
var copyFile2 = /* @__PURE__ */ (() => {
  const nodeCopyFile = /* @__PURE__ */ effectify(NFS.copyFile, /* @__PURE__ */ handleErrnoException("FileSystem", "copyFile"), /* @__PURE__ */ handleBadArgument("copyFile"));
  return (fromPath, toPath) => nodeCopyFile(fromPath, toPath);
})();
var chmod2 = /* @__PURE__ */ (() => {
  const nodeChmod = /* @__PURE__ */ effectify(NFS.chmod, /* @__PURE__ */ handleErrnoException("FileSystem", "chmod"), /* @__PURE__ */ handleBadArgument("chmod"));
  return (path, mode) => nodeChmod(path, mode);
})();
var chown2 = /* @__PURE__ */ (() => {
  const nodeChown = /* @__PURE__ */ effectify(NFS.chown, /* @__PURE__ */ handleErrnoException("FileSystem", "chown"), /* @__PURE__ */ handleBadArgument("chown"));
  return (path, uid, gid) => nodeChown(path, uid, gid);
})();
var glob2 = /* @__PURE__ */ (() => {
  const nodeGlob = /* @__PURE__ */ effectify(NFS.glob, /* @__PURE__ */ handleErrnoException("FileSystem", "glob"), /* @__PURE__ */ handleBadArgument("glob"));
  return (pattern, options3) => nodeGlob(pattern, {
    cwd: options3?.root,
    exclude: options3?.exclude
  });
})();
var link3 = /* @__PURE__ */ (() => {
  const nodeLink = /* @__PURE__ */ effectify(NFS.link, /* @__PURE__ */ handleErrnoException("FileSystem", "link"), /* @__PURE__ */ handleBadArgument("link"));
  return (existingPath, newPath) => nodeLink(existingPath, newPath);
})();
var makeDirectory = /* @__PURE__ */ (() => {
  const nodeMkdir = /* @__PURE__ */ effectify(NFS.mkdir, /* @__PURE__ */ handleErrnoException("FileSystem", "makeDirectory"), /* @__PURE__ */ handleBadArgument("makeDirectory"));
  return (path, options3) => nodeMkdir(path, {
    recursive: options3?.recursive ?? false,
    mode: options3?.mode
  });
})();
var makeTempDirectoryFactory = (method) => {
  const nodeMkdtemp = effectify(NFS.mkdtemp, handleErrnoException("FileSystem", method), handleBadArgument(method));
  return (options3) => suspend3(() => {
    const prefix = options3?.prefix ?? "";
    const directory = typeof options3?.directory === "string" ? Path2.join(options3.directory, ".") : OS.tmpdir();
    return nodeMkdtemp(prefix ? Path2.join(directory, prefix) : directory + "/");
  });
};
var makeTempDirectory = /* @__PURE__ */ makeTempDirectoryFactory("makeTempDirectory");
var removeFactory = (method) => {
  const nodeRm = effectify(NFS.rm, handleErrnoException("FileSystem", method), handleBadArgument(method));
  return (path, options3) => nodeRm(path, {
    recursive: options3?.recursive ?? false,
    force: options3?.force ?? false
  });
};
var remove6 = /* @__PURE__ */ removeFactory("remove");
var makeTempDirectoryScoped = /* @__PURE__ */ (() => {
  const makeDirectory2 = /* @__PURE__ */ makeTempDirectoryFactory("makeTempDirectoryScoped");
  const removeDirectory = /* @__PURE__ */ removeFactory("makeTempDirectoryScoped");
  return (options3) => acquireRelease2(makeDirectory2(options3), (directory) => orDie3(removeDirectory(directory, {
    recursive: true
  })));
})();
var openFactory = (method) => {
  const nodeOpen = effectify(NFS.open, handleErrnoException("FileSystem", method), handleBadArgument(method));
  const nodeClose = effectify(NFS.close, handleErrnoException("FileSystem", method), handleBadArgument(method));
  return (path, options3) => pipe(acquireRelease2(nodeOpen(path, options3?.flag ?? "r", options3?.mode), (fd) => orDie3(nodeClose(fd))), map7((fd) => makeFile(fd, options3?.flag?.startsWith("a") ?? false)));
};
var open2 = /* @__PURE__ */ openFactory("open");
var makeFile = /* @__PURE__ */ (() => {
  const nodeReadFactory = (method) => effectify(NFS.read, handleErrnoException("FileSystem", method), handleBadArgument(method));
  const nodeRead = /* @__PURE__ */ nodeReadFactory("read");
  const nodeReadAlloc = /* @__PURE__ */ nodeReadFactory("readAlloc");
  const nodeStat = /* @__PURE__ */ effectify(NFS.fstat, /* @__PURE__ */ handleErrnoException("FileSystem", "stat"), /* @__PURE__ */ handleBadArgument("stat"));
  const nodeTruncate = /* @__PURE__ */ effectify(NFS.ftruncate, /* @__PURE__ */ handleErrnoException("FileSystem", "truncate"), /* @__PURE__ */ handleBadArgument("truncate"));
  const nodeSync = /* @__PURE__ */ effectify(NFS.fsync, /* @__PURE__ */ handleErrnoException("FileSystem", "sync"), /* @__PURE__ */ handleBadArgument("sync"));
  const nodeWriteFactory = (method) => effectify(NFS.write, handleErrnoException("FileSystem", method), handleBadArgument(method));
  const nodeWrite = /* @__PURE__ */ nodeWriteFactory("write");
  const nodeWriteAll = /* @__PURE__ */ nodeWriteFactory("writeAll");
  class FileImpl {
    [FileTypeId];
    fd;
    append;
    position = /* @__PURE__ */ BigInt(0);
    constructor(fd, append4) {
      this[FileTypeId] = FileTypeId;
      this.fd = fd;
      this.append = append4;
    }
    get stat() {
      return flatMap5(nodeStat(this.fd, {
        bigint: true
      }), makeFileInfo);
    }
    get sync() {
      return nodeSync(this.fd);
    }
    seek(offset, from) {
      return suspend3(() => {
        const position = from === "start" ? offset : this.position + offset;
        if (position < BigInt(0)) {
          return fail6(badArgument({
            module: "FileSystem",
            method: "seek",
            description: "Cannot seek before the start of the file"
          }));
        }
        this.position = position;
        return succeed6(position);
      });
    }
    read(buffer3) {
      return suspend3(() => {
        const position = this.position;
        return map7(nodeRead(this.fd, {
          buffer: buffer3,
          position
        }), (bytesRead) => {
          this.position = position + BigInt(bytesRead);
          return bytesRead;
        });
      });
    }
    readAlloc(size6) {
      return suspend3(() => {
        try {
          if (!Number.isInteger(size6) || size6 < 0) {
            throw new RangeError("size must be a non-negative integer");
          }
          const buffer3 = Buffer.allocUnsafeSlow(size6);
          const position = this.position;
          return map7(nodeReadAlloc(this.fd, {
            buffer: buffer3,
            position
          }), (bytesRead) => {
            if (bytesRead === 0) {
              return none2();
            }
            this.position = position + BigInt(bytesRead);
            if (bytesRead === size6) {
              return some2(buffer3);
            }
            const dst = Buffer.allocUnsafeSlow(bytesRead);
            buffer3.copy(dst, 0, 0, bytesRead);
            return some2(dst);
          });
        } catch (cause) {
          return fail6(handleBadArgument("readAlloc")(cause));
        }
      });
    }
    truncate(length) {
      return map7(nodeTruncate(this.fd, length || void 0), () => {
        if (!this.append) {
          const len = BigInt(length ?? 0);
          if (this.position > len) {
            this.position = len;
          }
        }
      });
    }
    write(buffer3) {
      return suspend3(() => {
        const position = this.position;
        return flatMap5(this.append ? succeed6(void 0) : positionToNumber(position, "write"), (nodePosition) => map7(nodeWrite(this.fd, buffer3, void 0, void 0, nodePosition), (bytesWritten) => {
          if (!this.append) {
            this.position = position + BigInt(bytesWritten);
          }
          return bytesWritten;
        }));
      });
    }
    writeAllChunk(buffer3) {
      return suspend3(() => {
        const position = this.position;
        return flatMap5(this.append ? succeed6(void 0) : positionToNumber(position, "writeAll"), (nodePosition) => flatMap5(nodeWriteAll(this.fd, buffer3, void 0, void 0, nodePosition), (bytesWritten) => {
          if (bytesWritten === 0) {
            return fail6(systemError({
              module: "FileSystem",
              method: "writeAll",
              _tag: "WriteZero",
              pathOrDescriptor: this.fd,
              description: "write returned 0 bytes written"
            }));
          }
          if (!this.append) {
            this.position = position + BigInt(bytesWritten);
          }
          return bytesWritten < buffer3.length ? this.writeAllChunk(buffer3.subarray(bytesWritten)) : void_4;
        }));
      });
    }
    writeAll(buffer3) {
      return buffer3.length === 0 ? void_4 : this.writeAllChunk(buffer3);
    }
  }
  return (fd, append4) => new FileImpl(fd, append4);
})();
var makeTempFileFactory = (method) => {
  const makeDirectory2 = makeTempDirectoryFactory(method);
  return fnUntraced2(function* (options3) {
    const directory = yield* makeDirectory2(options3);
    const random3 = Crypto.randomBytes(6).toString("hex");
    const name = Path2.join(directory, options3?.suffix ? `${random3}${options3.suffix}` : random3);
    yield* writeFile2(name, new Uint8Array(0));
    return name;
  });
};
var makeTempFile = /* @__PURE__ */ makeTempFileFactory("makeTempFile");
var makeTempFileScoped = /* @__PURE__ */ (() => {
  const makeFile2 = /* @__PURE__ */ makeTempFileFactory("makeTempFileScoped");
  const removeDirectory = /* @__PURE__ */ removeFactory("makeTempFileScoped");
  return (options3) => acquireRelease2(makeFile2(options3), (file2) => orDie3(removeDirectory(Path2.dirname(file2), {
    recursive: true
  })));
})();
var readDirectory = (path, options3) => tryPromise2({
  try: () => NFS.promises.readdir(path, options3),
  catch: (err) => handleErrnoException("FileSystem", "readDirectory")(err, [path])
});
var readFile2 = (path) => callback2((resume, signal) => {
  try {
    NFS.readFile(path, {
      signal
    }, (err, data) => {
      if (err) {
        resume(fail6(handleErrnoException("FileSystem", "readFile")(err, [path])));
      } else {
        resume(succeed6(data));
      }
    });
  } catch (err) {
    resume(fail6(handleBadArgument("readFile")(err)));
  }
});
var readLink = /* @__PURE__ */ (() => {
  const nodeReadLink = /* @__PURE__ */ effectify(NFS.readlink, /* @__PURE__ */ handleErrnoException("FileSystem", "readLink"), /* @__PURE__ */ handleBadArgument("readLink"));
  return (path) => nodeReadLink(path);
})();
var realPath = /* @__PURE__ */ (() => {
  const nodeRealPath = /* @__PURE__ */ effectify(NFS.realpath, /* @__PURE__ */ handleErrnoException("FileSystem", "realPath"), /* @__PURE__ */ handleBadArgument("realPath"));
  return (path) => nodeRealPath(path);
})();
var rename2 = /* @__PURE__ */ (() => {
  const nodeRename = /* @__PURE__ */ effectify(NFS.rename, /* @__PURE__ */ handleErrnoException("FileSystem", "rename"), /* @__PURE__ */ handleBadArgument("rename"));
  return (oldPath, newPath) => nodeRename(oldPath, newPath);
})();
var makeFileInfo = (stat3) => try_3({
  try: () => ({
    type: stat3.isFile() ? "File" : stat3.isDirectory() ? "Directory" : stat3.isSymbolicLink() ? "SymbolicLink" : stat3.isBlockDevice() ? "BlockDevice" : stat3.isCharacterDevice() ? "CharacterDevice" : stat3.isFIFO() ? "FIFO" : stat3.isSocket() ? "Socket" : "Unknown",
    mtime: fromNullishOr(stat3.mtime),
    atime: fromNullishOr(stat3.atime),
    birthtime: fromNullishOr(stat3.birthtime),
    dev: bigintToNumber(stat3.dev, "dev"),
    rdev: bigintToNumberOption(stat3.rdev),
    ino: bigintToNumberOption(stat3.ino),
    mode: bigintToNumber(stat3.mode, "mode"),
    nlink: bigintToNumberOption(stat3.nlink),
    uid: bigintToNumberOption(stat3.uid),
    gid: bigintToNumberOption(stat3.gid),
    size: bytes(stat3.size),
    blksize: stat3.blksize !== void 0 ? some2(bytes(stat3.blksize)) : none2(),
    blocks: bigintToNumberOption(stat3.blocks)
  }),
  catch: handleBadArgument("stat")
});
var stat2 = /* @__PURE__ */ (() => {
  const nodeStat = /* @__PURE__ */ effectify(NFS.stat, /* @__PURE__ */ handleErrnoException("FileSystem", "stat"), /* @__PURE__ */ handleBadArgument("stat"));
  return (path) => flatMap5(nodeStat(path, {
    bigint: true
  }), makeFileInfo);
})();
var symlink2 = /* @__PURE__ */ (() => {
  const nodeSymlink = /* @__PURE__ */ effectify(NFS.symlink, /* @__PURE__ */ handleErrnoException("FileSystem", "symlink"), /* @__PURE__ */ handleBadArgument("symlink"));
  return (target, path) => nodeSymlink(target, path);
})();
var truncate2 = /* @__PURE__ */ (() => {
  const nodeTruncate = /* @__PURE__ */ effectify(NFS.truncate, /* @__PURE__ */ handleErrnoException("FileSystem", "truncate"), /* @__PURE__ */ handleBadArgument("truncate"));
  return (path, length) => nodeTruncate(path, length);
})();
var utimes2 = /* @__PURE__ */ (() => {
  const nodeUtimes = /* @__PURE__ */ effectify(NFS.utimes, /* @__PURE__ */ handleErrnoException("FileSystem", "utime"), /* @__PURE__ */ handleBadArgument("utime"));
  return (path, atime, mtime) => nodeUtimes(path, atime, mtime);
})();
var watchNode = (path, info, options3) => callback3((queue) => acquireRelease2(sync3(() => {
  const directory = info.type === "Directory" ? path : Path2.dirname(path);
  const watcher = NFS.watch(path, {
    recursive: options3?.recursive ?? false
  }, (event, path2) => {
    if (!path2) return;
    switch (event) {
      case "rename": {
        runFork2(matchEffect3(stat2(Path2.resolve(directory, path2)), {
          onSuccess: (_) => offer(queue, {
            _tag: "Create",
            path: path2
          }),
          onFailure: (_) => offer(queue, {
            _tag: "Remove",
            path: path2
          })
        }));
        return;
      }
      case "change": {
        offerUnsafe(queue, {
          _tag: "Update",
          path: path2
        });
        return;
      }
    }
  });
  watcher.on("error", (error) => {
    failCauseUnsafe(queue, fail4(systemError({
      module: "FileSystem",
      _tag: "Unknown",
      method: "watch",
      pathOrDescriptor: path,
      cause: error
    })));
  });
  watcher.on("close", () => {
    endUnsafe(queue);
  });
  return watcher;
}), (watcher) => sync3(() => watcher.close())));
var watch2 = (backend, path, options3) => stat2(path).pipe(map7((stat3) => backend.pipe(flatMap((_) => _.register(path, stat3, options3)), getOrElse(() => watchNode(path, stat3, options3)))), unwrap4);
var writeFile2 = (path, data, options3) => callback2((resume, signal) => {
  try {
    NFS.writeFile(path, data, {
      signal,
      flag: options3?.flag,
      mode: options3?.mode
    }, (err) => {
      if (err) {
        resume(fail6(handleErrnoException("FileSystem", "writeFile")(err, [path])));
      } else {
        resume(void_4);
      }
    });
  } catch (err) {
    resume(fail6(handleBadArgument("writeFile")(err)));
  }
});
var makeFileSystem = /* @__PURE__ */ map7(/* @__PURE__ */ serviceOption2(WatchBackend), (backend) => make27({
  access: access2,
  chmod: chmod2,
  chown: chown2,
  copy: copy3,
  copyFile: copyFile2,
  glob: glob2,
  link: link3,
  makeDirectory,
  makeTempDirectory,
  makeTempDirectoryScoped,
  makeTempFile,
  makeTempFileScoped,
  open: open2,
  readDirectory,
  readFile: readFile2,
  readLink,
  realPath,
  remove: remove6,
  rename: rename2,
  stat: stat2,
  symlink: symlink2,
  truncate: truncate2,
  utimes: utimes2,
  watch(path, options3) {
    return watch2(backend, path, options3);
  },
  writeFile: writeFile2
}));
var layer2 = /* @__PURE__ */ effect(FileSystem)(makeFileSystem);

// ../../node_modules/@effect/platform-node/dist/NodeFileSystem.js
var layer3 = layer2;

// ../../node_modules/@effect/platform-node-shared/dist/NodePath.js
import * as NodePath from "node:path";
import * as NodeUrl from "node:url";
var fileUrlOps = (windows) => ({
  fromFileUrl: (url) => try_3({
    try: () => NodeUrl.fileURLToPath(url, {
      windows
    }),
    catch: (cause) => new BadArgument({
      module: "Path",
      method: "fromFileUrl",
      cause
    })
  }),
  toFileUrl: (path) => try_3({
    try: () => NodeUrl.pathToFileURL(path, {
      windows
    }),
    catch: (cause) => new BadArgument({
      module: "Path",
      method: "toFileUrl",
      cause
    })
  })
});
var layerPosix = /* @__PURE__ */ succeed5(Path)({
  [TypeId36]: TypeId36,
  ...NodePath.posix,
  .../* @__PURE__ */ fileUrlOps(false)
});
var layerWin32 = /* @__PURE__ */ succeed5(Path)({
  [TypeId36]: TypeId36,
  ...NodePath.win32,
  .../* @__PURE__ */ fileUrlOps(true)
});
var layer4 = /* @__PURE__ */ succeed5(Path)({
  [TypeId36]: TypeId36,
  ...NodePath,
  .../* @__PURE__ */ fileUrlOps(void 0)
});

// ../../node_modules/@effect/platform-node/dist/NodePath.js
var layer5 = layer4;

// ../../node_modules/jsonc-parser/lib/esm/impl/scanner.js
function createScanner(text2, ignoreTrivia = false) {
  const len = text2.length;
  let pos = 0, value3 = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
  function scanHexDigits(count, exact) {
    let digits = 0;
    let value4 = 0;
    while (digits < count || !exact) {
      let ch = text2.charCodeAt(pos);
      if (ch >= 48 && ch <= 57) {
        value4 = value4 * 16 + ch - 48;
      } else if (ch >= 65 && ch <= 70) {
        value4 = value4 * 16 + ch - 65 + 10;
      } else if (ch >= 97 && ch <= 102) {
        value4 = value4 * 16 + ch - 97 + 10;
      } else {
        break;
      }
      pos++;
      digits++;
    }
    if (digits < count) {
      value4 = -1;
    }
    return value4;
  }
  function setPosition(newPosition) {
    pos = newPosition;
    value3 = "";
    tokenOffset = 0;
    token = 16;
    scanError = 0;
  }
  function scanNumber() {
    let start = pos;
    if (text2.charCodeAt(pos) === 48) {
      pos++;
    } else {
      pos++;
      while (pos < text2.length && isDigit(text2.charCodeAt(pos))) {
        pos++;
      }
    }
    if (pos < text2.length && text2.charCodeAt(pos) === 46) {
      pos++;
      if (pos < text2.length && isDigit(text2.charCodeAt(pos))) {
        pos++;
        while (pos < text2.length && isDigit(text2.charCodeAt(pos))) {
          pos++;
        }
      } else {
        scanError = 3;
        return text2.substring(start, pos);
      }
    }
    let end = pos;
    if (pos < text2.length && (text2.charCodeAt(pos) === 69 || text2.charCodeAt(pos) === 101)) {
      pos++;
      if (pos < text2.length && text2.charCodeAt(pos) === 43 || text2.charCodeAt(pos) === 45) {
        pos++;
      }
      if (pos < text2.length && isDigit(text2.charCodeAt(pos))) {
        pos++;
        while (pos < text2.length && isDigit(text2.charCodeAt(pos))) {
          pos++;
        }
        end = pos;
      } else {
        scanError = 3;
      }
    }
    return text2.substring(start, end);
  }
  function scanString() {
    let result3 = "", start = pos;
    while (true) {
      if (pos >= len) {
        result3 += text2.substring(start, pos);
        scanError = 2;
        break;
      }
      const ch = text2.charCodeAt(pos);
      if (ch === 34) {
        result3 += text2.substring(start, pos);
        pos++;
        break;
      }
      if (ch === 92) {
        result3 += text2.substring(start, pos);
        pos++;
        if (pos >= len) {
          scanError = 2;
          break;
        }
        const ch2 = text2.charCodeAt(pos++);
        switch (ch2) {
          case 34:
            result3 += '"';
            break;
          case 92:
            result3 += "\\";
            break;
          case 47:
            result3 += "/";
            break;
          case 98:
            result3 += "\b";
            break;
          case 102:
            result3 += "\f";
            break;
          case 110:
            result3 += "\n";
            break;
          case 114:
            result3 += "\r";
            break;
          case 116:
            result3 += "	";
            break;
          case 117:
            const ch3 = scanHexDigits(4, true);
            if (ch3 >= 0) {
              result3 += String.fromCharCode(ch3);
            } else {
              scanError = 4;
            }
            break;
          default:
            scanError = 5;
        }
        start = pos;
        continue;
      }
      if (ch >= 0 && ch <= 31) {
        if (isLineBreak(ch)) {
          result3 += text2.substring(start, pos);
          scanError = 2;
          break;
        } else {
          scanError = 6;
        }
      }
      pos++;
    }
    return result3;
  }
  function scanNext() {
    value3 = "";
    scanError = 0;
    tokenOffset = pos;
    lineStartOffset = lineNumber;
    prevTokenLineStartOffset = tokenLineStartOffset;
    if (pos >= len) {
      tokenOffset = len;
      return token = 17;
    }
    let code = text2.charCodeAt(pos);
    if (isWhiteSpace(code)) {
      do {
        pos++;
        value3 += String.fromCharCode(code);
        code = text2.charCodeAt(pos);
      } while (isWhiteSpace(code));
      return token = 15;
    }
    if (isLineBreak(code)) {
      pos++;
      value3 += String.fromCharCode(code);
      if (code === 13 && text2.charCodeAt(pos) === 10) {
        pos++;
        value3 += "\n";
      }
      lineNumber++;
      tokenLineStartOffset = pos;
      return token = 14;
    }
    switch (code) {
      // tokens: []{}:,
      case 123:
        pos++;
        return token = 1;
      case 125:
        pos++;
        return token = 2;
      case 91:
        pos++;
        return token = 3;
      case 93:
        pos++;
        return token = 4;
      case 58:
        pos++;
        return token = 6;
      case 44:
        pos++;
        return token = 5;
      // strings
      case 34:
        pos++;
        value3 = scanString();
        return token = 10;
      // comments
      case 47:
        const start = pos - 1;
        if (text2.charCodeAt(pos + 1) === 47) {
          pos += 2;
          while (pos < len) {
            if (isLineBreak(text2.charCodeAt(pos))) {
              break;
            }
            pos++;
          }
          value3 = text2.substring(start, pos);
          return token = 12;
        }
        if (text2.charCodeAt(pos + 1) === 42) {
          pos += 2;
          const safeLength = len - 1;
          let commentClosed = false;
          while (pos < safeLength) {
            const ch = text2.charCodeAt(pos);
            if (ch === 42 && text2.charCodeAt(pos + 1) === 47) {
              pos += 2;
              commentClosed = true;
              break;
            }
            pos++;
            if (isLineBreak(ch)) {
              if (ch === 13 && text2.charCodeAt(pos) === 10) {
                pos++;
              }
              lineNumber++;
              tokenLineStartOffset = pos;
            }
          }
          if (!commentClosed) {
            pos++;
            scanError = 1;
          }
          value3 = text2.substring(start, pos);
          return token = 13;
        }
        value3 += String.fromCharCode(code);
        pos++;
        return token = 16;
      // numbers
      case 45:
        value3 += String.fromCharCode(code);
        pos++;
        if (pos === len || !isDigit(text2.charCodeAt(pos))) {
          return token = 16;
        }
      // found a minus, followed by a number so
      // we fall through to proceed with scanning
      // numbers
      case 48:
      case 49:
      case 50:
      case 51:
      case 52:
      case 53:
      case 54:
      case 55:
      case 56:
      case 57:
        value3 += scanNumber();
        return token = 11;
      // literals and unknown symbols
      default:
        while (pos < len && isUnknownContentCharacter(code)) {
          pos++;
          code = text2.charCodeAt(pos);
        }
        if (tokenOffset !== pos) {
          value3 = text2.substring(tokenOffset, pos);
          switch (value3) {
            case "true":
              return token = 8;
            case "false":
              return token = 9;
            case "null":
              return token = 7;
          }
          return token = 16;
        }
        value3 += String.fromCharCode(code);
        pos++;
        return token = 16;
    }
  }
  function isUnknownContentCharacter(code) {
    if (isWhiteSpace(code) || isLineBreak(code)) {
      return false;
    }
    switch (code) {
      case 125:
      case 93:
      case 123:
      case 91:
      case 34:
      case 58:
      case 44:
      case 47:
        return false;
    }
    return true;
  }
  function scanNextNonTrivia() {
    let result3;
    do {
      result3 = scanNext();
    } while (result3 >= 12 && result3 <= 15);
    return result3;
  }
  return {
    setPosition,
    getPosition: () => pos,
    scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
    getToken: () => token,
    getTokenValue: () => value3,
    getTokenOffset: () => tokenOffset,
    getTokenLength: () => pos - tokenOffset,
    getTokenStartLine: () => lineStartOffset,
    getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
    getTokenError: () => scanError
  };
}
function isWhiteSpace(ch) {
  return ch === 32 || ch === 9;
}
function isLineBreak(ch) {
  return ch === 10 || ch === 13;
}
function isDigit(ch) {
  return ch >= 48 && ch <= 57;
}
var CharacterCodes;
(function(CharacterCodes2) {
  CharacterCodes2[CharacterCodes2["lineFeed"] = 10] = "lineFeed";
  CharacterCodes2[CharacterCodes2["carriageReturn"] = 13] = "carriageReturn";
  CharacterCodes2[CharacterCodes2["space"] = 32] = "space";
  CharacterCodes2[CharacterCodes2["_0"] = 48] = "_0";
  CharacterCodes2[CharacterCodes2["_1"] = 49] = "_1";
  CharacterCodes2[CharacterCodes2["_2"] = 50] = "_2";
  CharacterCodes2[CharacterCodes2["_3"] = 51] = "_3";
  CharacterCodes2[CharacterCodes2["_4"] = 52] = "_4";
  CharacterCodes2[CharacterCodes2["_5"] = 53] = "_5";
  CharacterCodes2[CharacterCodes2["_6"] = 54] = "_6";
  CharacterCodes2[CharacterCodes2["_7"] = 55] = "_7";
  CharacterCodes2[CharacterCodes2["_8"] = 56] = "_8";
  CharacterCodes2[CharacterCodes2["_9"] = 57] = "_9";
  CharacterCodes2[CharacterCodes2["a"] = 97] = "a";
  CharacterCodes2[CharacterCodes2["b"] = 98] = "b";
  CharacterCodes2[CharacterCodes2["c"] = 99] = "c";
  CharacterCodes2[CharacterCodes2["d"] = 100] = "d";
  CharacterCodes2[CharacterCodes2["e"] = 101] = "e";
  CharacterCodes2[CharacterCodes2["f"] = 102] = "f";
  CharacterCodes2[CharacterCodes2["g"] = 103] = "g";
  CharacterCodes2[CharacterCodes2["h"] = 104] = "h";
  CharacterCodes2[CharacterCodes2["i"] = 105] = "i";
  CharacterCodes2[CharacterCodes2["j"] = 106] = "j";
  CharacterCodes2[CharacterCodes2["k"] = 107] = "k";
  CharacterCodes2[CharacterCodes2["l"] = 108] = "l";
  CharacterCodes2[CharacterCodes2["m"] = 109] = "m";
  CharacterCodes2[CharacterCodes2["n"] = 110] = "n";
  CharacterCodes2[CharacterCodes2["o"] = 111] = "o";
  CharacterCodes2[CharacterCodes2["p"] = 112] = "p";
  CharacterCodes2[CharacterCodes2["q"] = 113] = "q";
  CharacterCodes2[CharacterCodes2["r"] = 114] = "r";
  CharacterCodes2[CharacterCodes2["s"] = 115] = "s";
  CharacterCodes2[CharacterCodes2["t"] = 116] = "t";
  CharacterCodes2[CharacterCodes2["u"] = 117] = "u";
  CharacterCodes2[CharacterCodes2["v"] = 118] = "v";
  CharacterCodes2[CharacterCodes2["w"] = 119] = "w";
  CharacterCodes2[CharacterCodes2["x"] = 120] = "x";
  CharacterCodes2[CharacterCodes2["y"] = 121] = "y";
  CharacterCodes2[CharacterCodes2["z"] = 122] = "z";
  CharacterCodes2[CharacterCodes2["A"] = 65] = "A";
  CharacterCodes2[CharacterCodes2["B"] = 66] = "B";
  CharacterCodes2[CharacterCodes2["C"] = 67] = "C";
  CharacterCodes2[CharacterCodes2["D"] = 68] = "D";
  CharacterCodes2[CharacterCodes2["E"] = 69] = "E";
  CharacterCodes2[CharacterCodes2["F"] = 70] = "F";
  CharacterCodes2[CharacterCodes2["G"] = 71] = "G";
  CharacterCodes2[CharacterCodes2["H"] = 72] = "H";
  CharacterCodes2[CharacterCodes2["I"] = 73] = "I";
  CharacterCodes2[CharacterCodes2["J"] = 74] = "J";
  CharacterCodes2[CharacterCodes2["K"] = 75] = "K";
  CharacterCodes2[CharacterCodes2["L"] = 76] = "L";
  CharacterCodes2[CharacterCodes2["M"] = 77] = "M";
  CharacterCodes2[CharacterCodes2["N"] = 78] = "N";
  CharacterCodes2[CharacterCodes2["O"] = 79] = "O";
  CharacterCodes2[CharacterCodes2["P"] = 80] = "P";
  CharacterCodes2[CharacterCodes2["Q"] = 81] = "Q";
  CharacterCodes2[CharacterCodes2["R"] = 82] = "R";
  CharacterCodes2[CharacterCodes2["S"] = 83] = "S";
  CharacterCodes2[CharacterCodes2["T"] = 84] = "T";
  CharacterCodes2[CharacterCodes2["U"] = 85] = "U";
  CharacterCodes2[CharacterCodes2["V"] = 86] = "V";
  CharacterCodes2[CharacterCodes2["W"] = 87] = "W";
  CharacterCodes2[CharacterCodes2["X"] = 88] = "X";
  CharacterCodes2[CharacterCodes2["Y"] = 89] = "Y";
  CharacterCodes2[CharacterCodes2["Z"] = 90] = "Z";
  CharacterCodes2[CharacterCodes2["asterisk"] = 42] = "asterisk";
  CharacterCodes2[CharacterCodes2["backslash"] = 92] = "backslash";
  CharacterCodes2[CharacterCodes2["closeBrace"] = 125] = "closeBrace";
  CharacterCodes2[CharacterCodes2["closeBracket"] = 93] = "closeBracket";
  CharacterCodes2[CharacterCodes2["colon"] = 58] = "colon";
  CharacterCodes2[CharacterCodes2["comma"] = 44] = "comma";
  CharacterCodes2[CharacterCodes2["dot"] = 46] = "dot";
  CharacterCodes2[CharacterCodes2["doubleQuote"] = 34] = "doubleQuote";
  CharacterCodes2[CharacterCodes2["minus"] = 45] = "minus";
  CharacterCodes2[CharacterCodes2["openBrace"] = 123] = "openBrace";
  CharacterCodes2[CharacterCodes2["openBracket"] = 91] = "openBracket";
  CharacterCodes2[CharacterCodes2["plus"] = 43] = "plus";
  CharacterCodes2[CharacterCodes2["slash"] = 47] = "slash";
  CharacterCodes2[CharacterCodes2["formFeed"] = 12] = "formFeed";
  CharacterCodes2[CharacterCodes2["tab"] = 9] = "tab";
})(CharacterCodes || (CharacterCodes = {}));

// ../../node_modules/jsonc-parser/lib/esm/impl/string-intern.js
var cachedSpaces = new Array(20).fill(0).map((_, index2) => {
  return " ".repeat(index2);
});
var maxCachedValues = 200;
var cachedBreakLinesWithSpaces = {
  " ": {
    "\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
      return "\n" + " ".repeat(index2);
    }),
    "\r": new Array(maxCachedValues).fill(0).map((_, index2) => {
      return "\r" + " ".repeat(index2);
    }),
    "\r\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
      return "\r\n" + " ".repeat(index2);
    })
  },
  "	": {
    "\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
      return "\n" + "	".repeat(index2);
    }),
    "\r": new Array(maxCachedValues).fill(0).map((_, index2) => {
      return "\r" + "	".repeat(index2);
    }),
    "\r\n": new Array(maxCachedValues).fill(0).map((_, index2) => {
      return "\r\n" + "	".repeat(index2);
    })
  }
};
var supportedEols = ["\n", "\r", "\r\n"];

// ../../node_modules/jsonc-parser/lib/esm/impl/format.js
function format8(documentText, range, options3) {
  let initialIndentLevel;
  let formatText;
  let formatTextStart;
  let rangeStart;
  let rangeEnd;
  if (range) {
    rangeStart = range.offset;
    rangeEnd = rangeStart + range.length;
    formatTextStart = rangeStart;
    while (formatTextStart > 0 && !isEOL(documentText, formatTextStart - 1)) {
      formatTextStart--;
    }
    let endOffset = rangeEnd;
    while (endOffset < documentText.length && !isEOL(documentText, endOffset)) {
      endOffset++;
    }
    formatText = documentText.substring(formatTextStart, endOffset);
    initialIndentLevel = computeIndentLevel(formatText, options3);
  } else {
    formatText = documentText;
    initialIndentLevel = 0;
    formatTextStart = 0;
    rangeStart = 0;
    rangeEnd = documentText.length;
  }
  const eol = getEOL(options3, documentText);
  const eolFastPathSupported = supportedEols.includes(eol);
  let numberLineBreaks = 0;
  let indentLevel = 0;
  let indentValue;
  if (options3.insertSpaces) {
    indentValue = cachedSpaces[options3.tabSize || 4] ?? repeat4(cachedSpaces[1], options3.tabSize || 4);
  } else {
    indentValue = "	";
  }
  const indentType = indentValue === "	" ? "	" : " ";
  let scanner = createScanner(formatText, false);
  let hasError = false;
  function newLinesAndIndent() {
    if (numberLineBreaks > 1) {
      return repeat4(eol, numberLineBreaks) + repeat4(indentValue, initialIndentLevel + indentLevel);
    }
    const amountOfSpaces = indentValue.length * (initialIndentLevel + indentLevel);
    if (!eolFastPathSupported || amountOfSpaces > cachedBreakLinesWithSpaces[indentType][eol].length) {
      return eol + repeat4(indentValue, initialIndentLevel + indentLevel);
    }
    if (amountOfSpaces <= 0) {
      return eol;
    }
    return cachedBreakLinesWithSpaces[indentType][eol][amountOfSpaces];
  }
  function scanNext() {
    let token = scanner.scan();
    numberLineBreaks = 0;
    while (token === 15 || token === 14) {
      if (token === 14 && options3.keepLines) {
        numberLineBreaks += 1;
      } else if (token === 14) {
        numberLineBreaks = 1;
      }
      token = scanner.scan();
    }
    hasError = token === 16 || scanner.getTokenError() !== 0;
    return token;
  }
  const editOperations = [];
  function addEdit(text2, startOffset, endOffset) {
    if (!hasError && (!range || startOffset < rangeEnd && endOffset > rangeStart) && documentText.substring(startOffset, endOffset) !== text2) {
      editOperations.push({ offset: startOffset, length: endOffset - startOffset, content: text2 });
    }
  }
  let firstToken = scanNext();
  if (options3.keepLines && numberLineBreaks > 0) {
    addEdit(repeat4(eol, numberLineBreaks), 0, 0);
  }
  if (firstToken !== 17) {
    let firstTokenStart = scanner.getTokenOffset() + formatTextStart;
    let initialIndent = indentValue.length * initialIndentLevel < 20 && options3.insertSpaces ? cachedSpaces[indentValue.length * initialIndentLevel] : repeat4(indentValue, initialIndentLevel);
    addEdit(initialIndent, formatTextStart, firstTokenStart);
  }
  while (firstToken !== 17) {
    let firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
    let secondToken = scanNext();
    let replaceContent = "";
    let needsLineBreak = false;
    while (numberLineBreaks === 0 && (secondToken === 12 || secondToken === 13)) {
      let commentTokenStart = scanner.getTokenOffset() + formatTextStart;
      addEdit(cachedSpaces[1], firstTokenEnd, commentTokenStart);
      firstTokenEnd = scanner.getTokenOffset() + scanner.getTokenLength() + formatTextStart;
      needsLineBreak = secondToken === 12;
      replaceContent = needsLineBreak ? newLinesAndIndent() : "";
      secondToken = scanNext();
    }
    if (secondToken === 2) {
      if (firstToken !== 1) {
        indentLevel--;
      }
      ;
      if (options3.keepLines && numberLineBreaks > 0 || !options3.keepLines && firstToken !== 1) {
        replaceContent = newLinesAndIndent();
      } else if (options3.keepLines) {
        replaceContent = cachedSpaces[1];
      }
    } else if (secondToken === 4) {
      if (firstToken !== 3) {
        indentLevel--;
      }
      ;
      if (options3.keepLines && numberLineBreaks > 0 || !options3.keepLines && firstToken !== 3) {
        replaceContent = newLinesAndIndent();
      } else if (options3.keepLines) {
        replaceContent = cachedSpaces[1];
      }
    } else {
      switch (firstToken) {
        case 3:
        case 1:
          indentLevel++;
          if (options3.keepLines && numberLineBreaks > 0 || !options3.keepLines) {
            replaceContent = newLinesAndIndent();
          } else {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 5:
          if (options3.keepLines && numberLineBreaks > 0 || !options3.keepLines) {
            replaceContent = newLinesAndIndent();
          } else {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 12:
          replaceContent = newLinesAndIndent();
          break;
        case 13:
          if (numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (!needsLineBreak) {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 6:
          if (options3.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (!needsLineBreak) {
            replaceContent = cachedSpaces[1];
          }
          break;
        case 10:
          if (options3.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else if (secondToken === 6 && !needsLineBreak) {
            replaceContent = "";
          }
          break;
        case 7:
        case 8:
        case 9:
        case 11:
        case 2:
        case 4:
          if (options3.keepLines && numberLineBreaks > 0) {
            replaceContent = newLinesAndIndent();
          } else {
            if ((secondToken === 12 || secondToken === 13) && !needsLineBreak) {
              replaceContent = cachedSpaces[1];
            } else if (secondToken !== 5 && secondToken !== 17) {
              hasError = true;
            }
          }
          break;
        case 16:
          hasError = true;
          break;
      }
      if (numberLineBreaks > 0 && (secondToken === 12 || secondToken === 13)) {
        replaceContent = newLinesAndIndent();
      }
    }
    if (secondToken === 17) {
      if (options3.keepLines && numberLineBreaks > 0) {
        replaceContent = newLinesAndIndent();
      } else {
        replaceContent = options3.insertFinalNewline ? eol : "";
      }
    }
    const secondTokenStart = scanner.getTokenOffset() + formatTextStart;
    addEdit(replaceContent, firstTokenEnd, secondTokenStart);
    firstToken = secondToken;
  }
  return editOperations;
}
function repeat4(s, count) {
  let result3 = "";
  for (let i = 0; i < count; i++) {
    result3 += s;
  }
  return result3;
}
function computeIndentLevel(content, options3) {
  let i = 0;
  let nChars = 0;
  const tabSize = options3.tabSize || 4;
  while (i < content.length) {
    let ch = content.charAt(i);
    if (ch === cachedSpaces[1]) {
      nChars++;
    } else if (ch === "	") {
      nChars += tabSize;
    } else {
      break;
    }
    i++;
  }
  return Math.floor(nChars / tabSize);
}
function getEOL(options3, text2) {
  for (let i = 0; i < text2.length; i++) {
    const ch = text2.charAt(i);
    if (ch === "\r") {
      if (i + 1 < text2.length && text2.charAt(i + 1) === "\n") {
        return "\r\n";
      }
      return "\r";
    } else if (ch === "\n") {
      return "\n";
    }
  }
  return options3 && options3.eol || "\n";
}
function isEOL(text2, offset) {
  return "\r\n".indexOf(text2.charAt(offset)) !== -1;
}

// ../../node_modules/jsonc-parser/lib/esm/impl/parser.js
var ParseOptions;
(function(ParseOptions2) {
  ParseOptions2.DEFAULT = {
    allowTrailingComma: false
  };
})(ParseOptions || (ParseOptions = {}));
function parse(text2, errors = [], options3 = ParseOptions.DEFAULT) {
  let currentProperty = null;
  let currentParent = [];
  const previousParents = [];
  function onValue(value3) {
    if (Array.isArray(currentParent)) {
      currentParent.push(value3);
    } else if (currentProperty !== null) {
      currentParent[currentProperty] = value3;
    }
  }
  const visitor = {
    onObjectBegin: () => {
      const object = {};
      onValue(object);
      previousParents.push(currentParent);
      currentParent = object;
      currentProperty = null;
    },
    onObjectProperty: (name) => {
      currentProperty = name;
    },
    onObjectEnd: () => {
      currentParent = previousParents.pop();
    },
    onArrayBegin: () => {
      const array2 = [];
      onValue(array2);
      previousParents.push(currentParent);
      currentParent = array2;
      currentProperty = null;
    },
    onArrayEnd: () => {
      currentParent = previousParents.pop();
    },
    onLiteralValue: onValue,
    onError: (error, offset, length) => {
      errors.push({ error, offset, length });
    }
  };
  visit(text2, visitor, options3);
  return currentParent[0];
}
function parseTree(text2, errors = [], options3 = ParseOptions.DEFAULT) {
  let currentParent = { type: "array", offset: -1, length: -1, children: [], parent: void 0 };
  function ensurePropertyComplete(endOffset) {
    if (currentParent.type === "property") {
      currentParent.length = endOffset - currentParent.offset;
      currentParent = currentParent.parent;
    }
  }
  function onValue(valueNode) {
    currentParent.children.push(valueNode);
    return valueNode;
  }
  const visitor = {
    onObjectBegin: (offset) => {
      currentParent = onValue({ type: "object", offset, length: -1, parent: currentParent, children: [] });
    },
    onObjectProperty: (name, offset, length) => {
      currentParent = onValue({ type: "property", offset, length: -1, parent: currentParent, children: [] });
      currentParent.children.push({ type: "string", value: name, offset, length, parent: currentParent });
    },
    onObjectEnd: (offset, length) => {
      ensurePropertyComplete(offset + length);
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onArrayBegin: (offset, length) => {
      currentParent = onValue({ type: "array", offset, length: -1, parent: currentParent, children: [] });
    },
    onArrayEnd: (offset, length) => {
      currentParent.length = offset + length - currentParent.offset;
      currentParent = currentParent.parent;
      ensurePropertyComplete(offset + length);
    },
    onLiteralValue: (value3, offset, length) => {
      onValue({ type: getNodeType(value3), offset, length, parent: currentParent, value: value3 });
      ensurePropertyComplete(offset + length);
    },
    onSeparator: (sep, offset, length) => {
      if (currentParent.type === "property") {
        if (sep === ":") {
          currentParent.colonOffset = offset;
        } else if (sep === ",") {
          ensurePropertyComplete(offset);
        }
      }
    },
    onError: (error, offset, length) => {
      errors.push({ error, offset, length });
    }
  };
  visit(text2, visitor, options3);
  const result3 = currentParent.children[0];
  if (result3) {
    delete result3.parent;
  }
  return result3;
}
function findNodeAtLocation(root, path) {
  if (!root) {
    return void 0;
  }
  let node = root;
  for (let segment of path) {
    if (typeof segment === "string") {
      if (node.type !== "object" || !Array.isArray(node.children)) {
        return void 0;
      }
      let found = false;
      for (const propertyNode of node.children) {
        if (Array.isArray(propertyNode.children) && propertyNode.children[0].value === segment && propertyNode.children.length === 2) {
          node = propertyNode.children[1];
          found = true;
          break;
        }
      }
      if (!found) {
        return void 0;
      }
    } else {
      const index2 = segment;
      if (node.type !== "array" || index2 < 0 || !Array.isArray(node.children) || index2 >= node.children.length) {
        return void 0;
      }
      node = node.children[index2];
    }
  }
  return node;
}
function visit(text2, visitor, options3 = ParseOptions.DEFAULT) {
  const _scanner = createScanner(text2, false);
  const _jsonPath = [];
  let suppressedCallbacks = 0;
  function toNoArgVisit(visitFunction) {
    return visitFunction ? () => suppressedCallbacks === 0 && visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisit(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
  }
  function toOneArgVisitWithPath(visitFunction) {
    return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
  }
  function toBeginVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks++;
      } else {
        let cbReturn = visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice());
        if (cbReturn === false) {
          suppressedCallbacks = 1;
        }
      }
    } : () => true;
  }
  function toEndVisit(visitFunction) {
    return visitFunction ? () => {
      if (suppressedCallbacks > 0) {
        suppressedCallbacks--;
      }
      if (suppressedCallbacks === 0) {
        visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
      }
    } : () => true;
  }
  const onObjectBegin = toBeginVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toEndVisit(visitor.onObjectEnd), onArrayBegin = toBeginVisit(visitor.onArrayBegin), onArrayEnd = toEndVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError4 = toOneArgVisit(visitor.onError);
  const disallowComments = options3 && options3.disallowComments;
  const allowTrailingComma = options3 && options3.allowTrailingComma;
  function scanNext() {
    while (true) {
      const token = _scanner.scan();
      switch (_scanner.getTokenError()) {
        case 4:
          handleError(
            14
            /* ParseErrorCode.InvalidUnicode */
          );
          break;
        case 5:
          handleError(
            15
            /* ParseErrorCode.InvalidEscapeCharacter */
          );
          break;
        case 3:
          handleError(
            13
            /* ParseErrorCode.UnexpectedEndOfNumber */
          );
          break;
        case 1:
          if (!disallowComments) {
            handleError(
              11
              /* ParseErrorCode.UnexpectedEndOfComment */
            );
          }
          break;
        case 2:
          handleError(
            12
            /* ParseErrorCode.UnexpectedEndOfString */
          );
          break;
        case 6:
          handleError(
            16
            /* ParseErrorCode.InvalidCharacter */
          );
          break;
      }
      switch (token) {
        case 12:
        case 13:
          if (disallowComments) {
            handleError(
              10
              /* ParseErrorCode.InvalidCommentToken */
            );
          } else {
            onComment();
          }
          break;
        case 16:
          handleError(
            1
            /* ParseErrorCode.InvalidSymbol */
          );
          break;
        case 15:
        case 14:
          break;
        default:
          return token;
      }
    }
  }
  function handleError(error, skipUntilAfter = [], skipUntil = []) {
    onError4(error);
    if (skipUntilAfter.length + skipUntil.length > 0) {
      let token = _scanner.getToken();
      while (token !== 17) {
        if (skipUntilAfter.indexOf(token) !== -1) {
          scanNext();
          break;
        } else if (skipUntil.indexOf(token) !== -1) {
          break;
        }
        token = scanNext();
      }
    }
  }
  function parseString(isValue) {
    const value3 = _scanner.getTokenValue();
    if (isValue) {
      onLiteralValue(value3);
    } else {
      onObjectProperty(value3);
      _jsonPath.push(value3);
    }
    scanNext();
    return true;
  }
  function parseLiteral() {
    switch (_scanner.getToken()) {
      case 11:
        const tokenValue = _scanner.getTokenValue();
        let value3 = Number(tokenValue);
        if (isNaN(value3)) {
          handleError(
            2
            /* ParseErrorCode.InvalidNumberFormat */
          );
          value3 = 0;
        }
        onLiteralValue(value3);
        break;
      case 7:
        onLiteralValue(null);
        break;
      case 8:
        onLiteralValue(true);
        break;
      case 9:
        onLiteralValue(false);
        break;
      default:
        return false;
    }
    scanNext();
    return true;
  }
  function parseProperty() {
    if (_scanner.getToken() !== 10) {
      handleError(3, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
      return false;
    }
    parseString(false);
    if (_scanner.getToken() === 6) {
      onSeparator(":");
      scanNext();
      if (!parseValue()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
    } else {
      handleError(5, [], [
        2,
        5
        /* SyntaxKind.CommaToken */
      ]);
    }
    _jsonPath.pop();
    return true;
  }
  function parseObject() {
    onObjectBegin();
    scanNext();
    let needsComma = false;
    while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 2 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (!parseProperty()) {
        handleError(4, [], [
          2,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onObjectEnd();
    if (_scanner.getToken() !== 2) {
      handleError(7, [
        2
        /* SyntaxKind.CloseBraceToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseArray2() {
    onArrayBegin();
    scanNext();
    let isFirstElement = true;
    let needsComma = false;
    while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
      if (_scanner.getToken() === 5) {
        if (!needsComma) {
          handleError(4, [], []);
        }
        onSeparator(",");
        scanNext();
        if (_scanner.getToken() === 4 && allowTrailingComma) {
          break;
        }
      } else if (needsComma) {
        handleError(6, [], []);
      }
      if (isFirstElement) {
        _jsonPath.push(0);
        isFirstElement = false;
      } else {
        _jsonPath[_jsonPath.length - 1]++;
      }
      if (!parseValue()) {
        handleError(4, [], [
          4,
          5
          /* SyntaxKind.CommaToken */
        ]);
      }
      needsComma = true;
    }
    onArrayEnd();
    if (!isFirstElement) {
      _jsonPath.pop();
    }
    if (_scanner.getToken() !== 4) {
      handleError(8, [
        4
        /* SyntaxKind.CloseBracketToken */
      ], []);
    } else {
      scanNext();
    }
    return true;
  }
  function parseValue() {
    switch (_scanner.getToken()) {
      case 3:
        return parseArray2();
      case 1:
        return parseObject();
      case 10:
        return parseString(true);
      default:
        return parseLiteral();
    }
  }
  scanNext();
  if (_scanner.getToken() === 17) {
    if (options3.allowEmptyContent) {
      return true;
    }
    handleError(4, [], []);
    return false;
  }
  if (!parseValue()) {
    handleError(4, [], []);
    return false;
  }
  if (_scanner.getToken() !== 17) {
    handleError(9, [], []);
  }
  return true;
}
function getNodeType(value3) {
  switch (typeof value3) {
    case "boolean":
      return "boolean";
    case "number":
      return "number";
    case "string":
      return "string";
    case "object": {
      if (!value3) {
        return "null";
      } else if (Array.isArray(value3)) {
        return "array";
      }
      return "object";
    }
    default:
      return "null";
  }
}

// ../../node_modules/jsonc-parser/lib/esm/impl/edit.js
function setProperty(text2, originalPath, value3, options3) {
  const path = originalPath.slice();
  const errors = [];
  const root = parseTree(text2, errors);
  let parent = void 0;
  let lastSegment = void 0;
  while (path.length > 0) {
    lastSegment = path.pop();
    parent = findNodeAtLocation(root, path);
    if (parent === void 0 && value3 !== void 0) {
      if (typeof lastSegment === "string") {
        value3 = { [lastSegment]: value3 };
      } else {
        value3 = [value3];
      }
    } else {
      break;
    }
  }
  if (!parent) {
    if (value3 === void 0) {
      throw new Error("Can not delete in empty document");
    }
    return withFormatting(text2, { offset: root ? root.offset : 0, length: root ? root.length : 0, content: JSON.stringify(value3) }, options3);
  } else if (parent.type === "object" && typeof lastSegment === "string" && Array.isArray(parent.children)) {
    const existing = findNodeAtLocation(parent, [lastSegment]);
    if (existing !== void 0) {
      if (value3 === void 0) {
        if (!existing.parent) {
          throw new Error("Malformed AST");
        }
        const propertyIndex = parent.children.indexOf(existing.parent);
        let removeBegin;
        let removeEnd = existing.parent.offset + existing.parent.length;
        if (propertyIndex > 0) {
          let previous = parent.children[propertyIndex - 1];
          removeBegin = previous.offset + previous.length;
        } else {
          removeBegin = parent.offset + 1;
          if (parent.children.length > 1) {
            let next = parent.children[1];
            removeEnd = next.offset;
          }
        }
        return withFormatting(text2, { offset: removeBegin, length: removeEnd - removeBegin, content: "" }, options3);
      } else {
        return withFormatting(text2, { offset: existing.offset, length: existing.length, content: JSON.stringify(value3) }, options3);
      }
    } else {
      if (value3 === void 0) {
        return [];
      }
      const newProperty = `${JSON.stringify(lastSegment)}: ${JSON.stringify(value3)}`;
      const index2 = options3.getInsertionIndex ? options3.getInsertionIndex(parent.children.map((p) => p.children[0].value)) : parent.children.length;
      let edit;
      if (index2 > 0) {
        let previous = parent.children[index2 - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      } else if (parent.children.length === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      } else {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty + "," };
      }
      return withFormatting(text2, edit, options3);
    }
  } else if (parent.type === "array" && typeof lastSegment === "number" && Array.isArray(parent.children)) {
    const insertIndex = lastSegment;
    if (insertIndex === -1) {
      const newProperty = `${JSON.stringify(value3)}`;
      let edit;
      if (parent.children.length === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: newProperty };
      } else {
        const previous = parent.children[parent.children.length - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text2, edit, options3);
    } else if (value3 === void 0 && parent.children.length >= 0) {
      const removalIndex = lastSegment;
      const toRemove = parent.children[removalIndex];
      let edit;
      if (parent.children.length === 1) {
        edit = { offset: parent.offset + 1, length: parent.length - 2, content: "" };
      } else if (parent.children.length - 1 === removalIndex) {
        let previous = parent.children[removalIndex - 1];
        let offset = previous.offset + previous.length;
        let parentEndOffset = parent.offset + parent.length;
        edit = { offset, length: parentEndOffset - 2 - offset, content: "" };
      } else {
        edit = { offset: toRemove.offset, length: parent.children[removalIndex + 1].offset - toRemove.offset, content: "" };
      }
      return withFormatting(text2, edit, options3);
    } else if (value3 !== void 0) {
      let edit;
      const newProperty = `${JSON.stringify(value3)}`;
      if (!options3.isArrayInsertion && parent.children.length > lastSegment) {
        const toModify = parent.children[lastSegment];
        edit = { offset: toModify.offset, length: toModify.length, content: newProperty };
      } else if (parent.children.length === 0 || lastSegment === 0) {
        edit = { offset: parent.offset + 1, length: 0, content: parent.children.length === 0 ? newProperty : newProperty + "," };
      } else {
        const index2 = lastSegment > parent.children.length ? parent.children.length : lastSegment;
        const previous = parent.children[index2 - 1];
        edit = { offset: previous.offset + previous.length, length: 0, content: "," + newProperty };
      }
      return withFormatting(text2, edit, options3);
    } else {
      throw new Error(`Can not ${value3 === void 0 ? "remove" : options3.isArrayInsertion ? "insert" : "modify"} Array index ${insertIndex} as length is not sufficient`);
    }
  } else {
    throw new Error(`Can not add ${typeof lastSegment !== "number" ? "index" : "property"} to parent of type ${parent.type}`);
  }
}
function withFormatting(text2, edit, options3) {
  if (!options3.formattingOptions) {
    return [edit];
  }
  let newText = applyEdit(text2, edit);
  let begin = edit.offset;
  let end = edit.offset + edit.content.length;
  if (edit.length === 0 || edit.content.length === 0) {
    while (begin > 0 && !isEOL(newText, begin - 1)) {
      begin--;
    }
    while (end < newText.length && !isEOL(newText, end)) {
      end++;
    }
  }
  const edits = format8(newText, { offset: begin, length: end - begin }, { ...options3.formattingOptions, keepLines: false });
  for (let i = edits.length - 1; i >= 0; i--) {
    const edit2 = edits[i];
    newText = applyEdit(newText, edit2);
    begin = Math.min(begin, edit2.offset);
    end = Math.max(end, edit2.offset + edit2.length);
    end += edit2.content.length - edit2.length;
  }
  const editLength = text2.length - (newText.length - end) - begin;
  return [{ offset: begin, length: editLength, content: newText.substring(begin, end) }];
}
function applyEdit(text2, edit) {
  return text2.substring(0, edit.offset) + edit.content + text2.substring(edit.offset + edit.length);
}

// ../../node_modules/jsonc-parser/lib/esm/main.js
var ScanError;
(function(ScanError2) {
  ScanError2[ScanError2["None"] = 0] = "None";
  ScanError2[ScanError2["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
  ScanError2[ScanError2["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
  ScanError2[ScanError2["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
  ScanError2[ScanError2["InvalidUnicode"] = 4] = "InvalidUnicode";
  ScanError2[ScanError2["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
  ScanError2[ScanError2["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
var SyntaxKind;
(function(SyntaxKind2) {
  SyntaxKind2[SyntaxKind2["OpenBraceToken"] = 1] = "OpenBraceToken";
  SyntaxKind2[SyntaxKind2["CloseBraceToken"] = 2] = "CloseBraceToken";
  SyntaxKind2[SyntaxKind2["OpenBracketToken"] = 3] = "OpenBracketToken";
  SyntaxKind2[SyntaxKind2["CloseBracketToken"] = 4] = "CloseBracketToken";
  SyntaxKind2[SyntaxKind2["CommaToken"] = 5] = "CommaToken";
  SyntaxKind2[SyntaxKind2["ColonToken"] = 6] = "ColonToken";
  SyntaxKind2[SyntaxKind2["NullKeyword"] = 7] = "NullKeyword";
  SyntaxKind2[SyntaxKind2["TrueKeyword"] = 8] = "TrueKeyword";
  SyntaxKind2[SyntaxKind2["FalseKeyword"] = 9] = "FalseKeyword";
  SyntaxKind2[SyntaxKind2["StringLiteral"] = 10] = "StringLiteral";
  SyntaxKind2[SyntaxKind2["NumericLiteral"] = 11] = "NumericLiteral";
  SyntaxKind2[SyntaxKind2["LineCommentTrivia"] = 12] = "LineCommentTrivia";
  SyntaxKind2[SyntaxKind2["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
  SyntaxKind2[SyntaxKind2["LineBreakTrivia"] = 14] = "LineBreakTrivia";
  SyntaxKind2[SyntaxKind2["Trivia"] = 15] = "Trivia";
  SyntaxKind2[SyntaxKind2["Unknown"] = 16] = "Unknown";
  SyntaxKind2[SyntaxKind2["EOF"] = 17] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
var parse2 = parse;
var ParseErrorCode;
(function(ParseErrorCode2) {
  ParseErrorCode2[ParseErrorCode2["InvalidSymbol"] = 1] = "InvalidSymbol";
  ParseErrorCode2[ParseErrorCode2["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
  ParseErrorCode2[ParseErrorCode2["PropertyNameExpected"] = 3] = "PropertyNameExpected";
  ParseErrorCode2[ParseErrorCode2["ValueExpected"] = 4] = "ValueExpected";
  ParseErrorCode2[ParseErrorCode2["ColonExpected"] = 5] = "ColonExpected";
  ParseErrorCode2[ParseErrorCode2["CommaExpected"] = 6] = "CommaExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBraceExpected"] = 7] = "CloseBraceExpected";
  ParseErrorCode2[ParseErrorCode2["CloseBracketExpected"] = 8] = "CloseBracketExpected";
  ParseErrorCode2[ParseErrorCode2["EndOfFileExpected"] = 9] = "EndOfFileExpected";
  ParseErrorCode2[ParseErrorCode2["InvalidCommentToken"] = 10] = "InvalidCommentToken";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
  ParseErrorCode2[ParseErrorCode2["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
  ParseErrorCode2[ParseErrorCode2["InvalidUnicode"] = 14] = "InvalidUnicode";
  ParseErrorCode2[ParseErrorCode2["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
  ParseErrorCode2[ParseErrorCode2["InvalidCharacter"] = 16] = "InvalidCharacter";
})(ParseErrorCode || (ParseErrorCode = {}));
function modify3(text2, path, value3, options3) {
  return setProperty(text2, path, value3, options3);
}
function applyEdits(text2, edits) {
  let sortedEdits = edits.slice(0).sort((a, b) => {
    const diff = a.offset - b.offset;
    if (diff === 0) {
      return a.length - b.length;
    }
    return diff;
  });
  let lastModifiedOffset = text2.length;
  for (let i = sortedEdits.length - 1; i >= 0; i--) {
    let e = sortedEdits[i];
    if (e.offset + e.length <= lastModifiedOffset) {
      text2 = applyEdit(text2, e);
    } else {
      throw new Error("Overlapping edit");
    }
    lastModifiedOffset = e.offset;
  }
  return text2;
}

// ../core/dist/types.js
var Json3 = Schema_exports.Json;
var NoulQuestion = Schema_exports.Struct({
  type: Schema_exports.Literal("noul"),
  instructions: Schema_exports.String,
  criteria: Schema_exports.optionalKey(Schema_exports.Struct({
    false: Schema_exports.String,
    true: Schema_exports.String
  }))
});
var NoulAnswer = Schema_exports.Struct({
  type: Schema_exports.Literal("noul"),
  noul: Schema_exports.Finite.check(Schema_exports.isBetween({ minimum: 0, maximum: 1 }))
});
var JevRequest = Schema_exports.Struct({
  state: Json3,
  questions: Schema_exports.Record(Schema_exports.String, NoulQuestion)
});
var JevResult = Schema_exports.Struct({
  model: Schema_exports.NonEmptyString,
  answers: Schema_exports.Record(Schema_exports.String, NoulAnswer),
  reportedModel: Schema_exports.optionalKey(Schema_exports.NonEmptyString)
});

// ../../node_modules/effect/dist/http/FetchHttpClient.js
var FetchHttpClient_exports = {};
__export(FetchHttpClient_exports, {
  Fetch: () => Fetch,
  RequestInit: () => RequestInit,
  layer: () => layer6
});

// ../../node_modules/effect/dist/http/HttpClient.js
var HttpClient_exports = {};
__export(HttpClient_exports, {
  HttpClient: () => HttpClient,
  SpanNameGenerator: () => SpanNameGenerator,
  TracerDisabledWhen: () => TracerDisabledWhen,
  TracerHeaderFilter: () => TracerHeaderFilter,
  TracerPropagationEnabled: () => TracerPropagationEnabled,
  catch: () => catch_5,
  catchTag: () => catchTag4,
  catchTags: () => catchTags3,
  del: () => del2,
  execute: () => execute,
  filterOrElse: () => filterOrElse3,
  filterOrFail: () => filterOrFail3,
  filterStatus: () => filterStatus2,
  filterStatusOk: () => filterStatusOk2,
  followRedirects: () => followRedirects,
  get: () => get7,
  head: () => head4,
  isHttpClient: () => isHttpClient,
  layerMergedContext: () => layerMergedContext,
  make: () => make32,
  makeWith: () => makeWith2,
  mapRequest: () => mapRequest,
  mapRequestEffect: () => mapRequestEffect,
  mapRequestInput: () => mapRequestInput,
  mapRequestInputEffect: () => mapRequestInputEffect,
  options: () => options2,
  patch: () => patch2,
  post: () => post2,
  put: () => put2,
  query: () => query2,
  retry: () => retry4,
  retryTransient: () => retryTransient,
  tap: () => tap5,
  tapError: () => tapError5,
  tapRequest: () => tapRequest,
  transform: () => transform4,
  transformResponse: () => transformResponse,
  withCookiesRef: () => withCookiesRef,
  withRateLimiter: () => withRateLimiter,
  withScope: () => withScope
});

// ../../node_modules/effect/dist/http/HttpBody.js
var TypeId39 = "~effect/http/HttpBody";
var HttpBodyErrorTypeId = "~effect/http/HttpBody/HttpBodyError";
var HttpBodyError = class extends (/* @__PURE__ */ TaggedError2("HttpBodyError")) {
  /**
   * Marks this value as an HTTP body error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [HttpBodyErrorTypeId] = HttpBodyErrorTypeId;
};
var Proto10 = class {
  [TypeId39];
  constructor() {
    this[TypeId39] = TypeId39;
  }
  [NodeInspectSymbol]() {
    return this.toJSON();
  }
  toString() {
    return format(this, {
      ignoreToString: true
    });
  }
};
var Empty2 = class extends Proto10 {
  _tag = "Empty";
  toJSON() {
    return {
      _id: "effect/HttpBody",
      _tag: "Empty"
    };
  }
};
var empty10 = /* @__PURE__ */ new Empty2();
var Raw = class extends Proto10 {
  _tag = "Raw";
  body;
  contentType;
  contentLength;
  constructor(body, contentType, contentLength) {
    super();
    this.body = body;
    this.contentType = contentType;
    this.contentLength = contentLength;
  }
  toJSON() {
    return {
      _id: "effect/HttpBody",
      _tag: "Raw",
      body: this.body,
      contentType: this.contentType,
      contentLength: this.contentLength
    };
  }
};
var raw = (body, options3) => new Raw(body, options3?.contentType, options3?.contentLength);
var Uint8Array3 = class extends Proto10 {
  _tag = "Uint8Array";
  contentType;
  contentLength;
  /** Original text retained for adapters that can skip encoding. */
  text;
  _body;
  constructor(body, contentType, contentLength, text2) {
    super();
    this._body = body;
    this.text = text2;
    this.contentType = contentType;
    this.contentLength = contentLength;
  }
  get body() {
    return this._body ??= encodeText(this.text);
  }
  toJSON() {
    const toString2 = this.contentType.startsWith("text/") || this.contentType.endsWith("json");
    return {
      _id: "effect/HttpBody",
      _tag: "Uint8Array",
      body: toString2 ? new TextDecoder().decode(this.body) : `Uint8Array(${this.body.length})`,
      contentType: this.contentType,
      contentLength: this.contentLength
    };
  }
};
var uint8Array = (body, contentType) => new Uint8Array3(body, contentType ?? "application/octet-stream", body.length);
var encoder3 = /* @__PURE__ */ new TextEncoder();
var buffer2 = globalThis.Buffer;
var encodeText = buffer2 !== void 0 ? (body) => buffer2.from(body, "utf8") : (body) => encoder3.encode(body);
var text = (body, contentType) => {
  if (typeof body !== "string") {
    body = body === void 0 ? "" : String(body);
  }
  if (buffer2 !== void 0) {
    return new Uint8Array3(void 0, contentType ?? "text/plain", buffer2.byteLength(body, "utf8"), body);
  }
  const bytes2 = encoder3.encode(body);
  return new Uint8Array3(bytes2, contentType ?? "text/plain", bytes2.length, body);
};
var jsonUnsafe = (body, contentType) => text(JSON.stringify(body), contentType ?? "application/json");
var json = (body, contentType) => try_3({
  try: () => text(JSON.stringify(body), contentType ?? "application/json"),
  catch: (cause) => new HttpBodyError({
    reason: {
      _tag: "JsonError"
    },
    cause
  })
});
var jsonSchema = (schema2, options3) => {
  const encode5 = encodeUnknownEffect(toCodecJson2(schema2));
  return (body, contentType) => encode5(body, options3).pipe(mapError3((issue) => new HttpBodyError({
    reason: {
      _tag: "SchemaError",
      issue
    },
    cause: issue
  })), flatMap5((body2) => json(body2, contentType)));
};
var urlParams = (urlParams2, contentType) => text(toString(fromInput4(urlParams2)), contentType ?? "application/x-www-form-urlencoded");
var FormData3 = class extends Proto10 {
  _tag = "FormData";
  contentType = void 0;
  contentLength = void 0;
  formData;
  constructor(formData2) {
    super();
    this.formData = formData2;
  }
  toJSON() {
    return {
      _id: "effect/HttpBody",
      _tag: "FormData",
      formData: this.formData
    };
  }
};
var formData = (body) => new FormData3(body);
var appendFormDataValue = (formData2, key, value3) => {
  if (value3 == null) {
    return;
  }
  if (typeof value3 === "object") {
    formData2.append(key, value3);
    return;
  }
  formData2.append(key, String(value3));
};
var formDataRecord = (entries3) => {
  const data = new globalThis.FormData();
  for (const [key, value3] of Object.entries(entries3)) {
    if (Array.isArray(value3)) {
      for (const item of value3) {
        appendFormDataValue(data, key, item);
      }
    } else {
      appendFormDataValue(data, key, value3);
    }
  }
  return formData(data);
};
var Stream2 = class extends Proto10 {
  _tag = "Stream";
  stream;
  contentType;
  contentLength;
  constructor(stream3, contentType, contentLength) {
    super();
    this.stream = stream3;
    this.contentType = contentType;
    this.contentLength = contentLength;
  }
  toJSON() {
    return {
      _id: "effect/HttpBody",
      _tag: "Stream",
      contentType: this.contentType,
      contentLength: this.contentLength
    };
  }
};
var stream = (body, contentType, contentLength) => new Stream2(body, contentType ?? "application/octet-stream", contentLength);
var fileRangeSize = (input, field, method) => {
  const size6 = fromInput2(input);
  return isSome2(size6) ? succeed6(size6.value) : fail6(badArgument({
    module: "HttpBody",
    method,
    description: `Invalid ${field}: ${input}`
  }));
};
var fileContentLength = /* @__PURE__ */ fnUntraced2(function* (size6, method, options3) {
  const offset = options3?.offset === void 0 ? zero3 : yield* fileRangeSize(options3.offset, "offset", method);
  const bytesToRead = options3?.bytesToRead === void 0 ? void 0 : yield* fileRangeSize(options3.bytesToRead, "bytesToRead", method);
  const available = offset >= size6 ? BigInt("0") : size6 - offset;
  const length = bytesToRead === void 0 || bytesToRead > available ? available : bytesToRead;
  if (length > BigInt(Number.MAX_SAFE_INTEGER)) {
    return yield* fail6(badArgument({
      module: "HttpBody",
      method,
      description: `Content length exceeds Number.MAX_SAFE_INTEGER: ${length}`
    }));
  }
  return Number(length);
});
var file = (path, options3) => flatMap5(FileSystem, (fs2) => flatMap5(fs2.stat(path), (info) => map7(fileContentLength(info.size, "file", options3), (contentLength) => stream(fs2.stream(path, options3), options3?.contentType, contentLength))));

// ../../node_modules/effect/dist/http/HttpClientError.js
var TypeId40 = "~effect/http/HttpClientError";
var isHttpClientError = (u) => hasProperty(u, TypeId40);
var HttpClientError = class extends (/* @__PURE__ */ TaggedError2("HttpClientError")) {
  constructor(props) {
    if ("cause" in props.reason) {
      super({
        ...props,
        cause: props.reason.cause
      });
    } else {
      super(props);
    }
  }
  /**
   * Marks this value as an HTTP client error for runtime guards.
   *
   * @stability unstable
   * @since 4.0.0
   */
  [TypeId40] = TypeId40;
  /**
   * HTTP request associated with the client failure.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get request() {
    return this.reason.request;
  }
  /**
   * HTTP response associated with the client failure, when one was received.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get response() {
    return "response" in this.reason ? this.reason.response : void 0;
  }
  get message() {
    return this.reason.message;
  }
};
var formatReason = (tag2) => tag2.endsWith("Error") ? tag2.slice(0, -5) : tag2;
var formatMessage = (reason, description, info) => description ? `${reason}: ${description} (${info})` : `${reason} error (${info})`;
var TransportError = class extends (/* @__PURE__ */ TaggedError2("TransportError")) {
  /**
   * Formats the request method and URL for transport error messages.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  /**
   * Builds the transport error message from the optional description and request details.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    return formatMessage(formatReason(this._tag), this.description, this.methodAndUrl);
  }
};
var InvalidUrlError = class extends (/* @__PURE__ */ TaggedError2("InvalidUrlError")) {
  /**
   * Formats the request method and URL for invalid URL error messages.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  /**
   * Builds the invalid URL error message from the optional description and request details.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    return formatMessage(formatReason(this._tag), this.description, this.methodAndUrl);
  }
};
var StatusCodeError = class extends (/* @__PURE__ */ TaggedError2("StatusCodeError")) {
  /**
   * Formats the request method and URL for status code error messages.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  /**
   * Builds the status code error message from the response status, optional description, and request details.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    const info = `${this.response.status} ${this.methodAndUrl}`;
    return formatMessage(formatReason(this._tag), this.description, info);
  }
};
var DecodeError = class extends (/* @__PURE__ */ TaggedError2("DecodeError")) {
  /**
   * Formats the request method and URL for response decoding error messages.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  /**
   * Builds the response decoding error message from the response status, optional description, and request details.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    const info = `${this.response.status} ${this.methodAndUrl}`;
    return formatMessage(formatReason(this._tag), this.description, info);
  }
};
var EmptyBodyError = class extends (/* @__PURE__ */ TaggedError2("EmptyBodyError")) {
  /**
   * Formats the request method and URL for empty response body error messages.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get methodAndUrl() {
    return `${this.request.method} ${this.request.url}`;
  }
  /**
   * Builds the empty body error message from the response status, optional description, and request details.
   *
   * @stability unstable
   * @since 4.0.0
   */
  get message() {
    const info = `${this.response.status} ${this.methodAndUrl}`;
    return formatMessage(formatReason(this._tag), this.description, info);
  }
};

// ../../node_modules/effect/dist/http/HttpClientRequest.js
var HttpClientRequest_exports = {};
__export(HttpClientRequest_exports, {
  accept: () => accept,
  acceptJson: () => acceptJson,
  appendUrl: () => appendUrl,
  appendUrlParam: () => appendUrlParam,
  appendUrlParams: () => appendUrlParams,
  basicAuth: () => basicAuth,
  bearerToken: () => bearerToken,
  bodyFile: () => bodyFile,
  bodyFormData: () => bodyFormData,
  bodyFormDataRecord: () => bodyFormDataRecord,
  bodyJson: () => bodyJson,
  bodyJsonUnsafe: () => bodyJsonUnsafe,
  bodyStream: () => bodyStream,
  bodyText: () => bodyText,
  bodyUint8Array: () => bodyUint8Array,
  bodyUrlParams: () => bodyUrlParams,
  delete: () => del,
  empty: () => empty11,
  fromWeb: () => fromWeb,
  get: () => get6,
  head: () => head3,
  isHttpClientRequest: () => isHttpClientRequest,
  make: () => make31,
  makeWith: () => makeWith,
  modify: () => modify4,
  options: () => options,
  patch: () => patch,
  post: () => post,
  prependUrl: () => prependUrl,
  put: () => put,
  query: () => query,
  removeHash: () => removeHash,
  removeHeader: () => removeHeader,
  schemaBodyJson: () => schemaBodyJson,
  setBody: () => setBody,
  setHash: () => setHash2,
  setHeader: () => setHeader,
  setHeaders: () => setHeaders,
  setMethod: () => setMethod,
  setUrl: () => setUrl,
  setUrlParam: () => setUrlParam,
  setUrlParams: () => setUrlParams,
  toUrl: () => toUrl,
  toWeb: () => toWeb,
  toWebResult: () => toWebResult,
  trace: () => trace,
  updateHeaders: () => updateHeaders2,
  updateUrl: () => updateUrl
});

// ../../node_modules/effect/dist/http/HttpMethod.js
var hasBody = (method) => method !== "GET" && method !== "HEAD" && method !== "OPTIONS" && method !== "TRACE";
var allShort = [["GET", "get"], ["POST", "post"], ["PUT", "put"], ["DELETE", "del"], ["PATCH", "patch"], ["HEAD", "head"], ["OPTIONS", "options"], ["TRACE", "trace"], ["QUERY", "query"]];

// ../../node_modules/effect/dist/http/internal/httpBody.js
var updateHeaders = (headers, body) => {
  if (body._tag === "Empty" || body._tag === "FormData") {
    return remove5(remove5(headers, "content-type"), "content-length");
  }
  headers = body.contentType === void 0 ? remove5(headers, "content-type") : set3(headers, "content-type", body.contentType);
  return body.contentLength === void 0 ? remove5(headers, "content-length") : set3(headers, "content-length", body.contentLength.toString());
};
var parseContentLength = (contentLength) => {
  if (contentLength === null || contentLength === void 0 || !/^\d+$/.test(contentLength)) {
    return void 0;
  }
  const parsed = Number(contentLength);
  return Number.isSafeInteger(parsed) ? parsed : void 0;
};

// ../../node_modules/effect/dist/http/Url.js
var UrlError = class extends (/* @__PURE__ */ TaggedError2("UrlError")) {
};
var make30 = (url, params, hash2) => try_({
  try: () => {
    const urlInstance = new URL(url, baseUrl());
    for (let i = 0; i < params.params.length; i++) {
      const [key, value3] = params.params[i];
      if (value3 !== void 0) {
        urlInstance.searchParams.append(key, value3);
      }
    }
    if (hash2 !== void 0) {
      urlInstance.hash = hash2;
    }
    return urlInstance;
  },
  catch: (cause) => new UrlError({
    cause
  })
});
var baseUrl = () => {
  if ("location" in globalThis && globalThis.location !== void 0 && globalThis.location.origin !== void 0 && globalThis.location.pathname !== void 0) {
    return location.origin + location.pathname;
  }
  return void 0;
};

// ../../node_modules/effect/dist/http/HttpClientRequest.js
var TypeId41 = "~effect/http/HttpClientRequest";
var isHttpClientRequest = (u) => hasProperty(u, TypeId41);
var Proto11 = {
  [TypeId41]: TypeId41,
  ...BaseProto,
  toJSON() {
    return {
      _id: "HttpClientRequest",
      method: this.method,
      url: this.url,
      urlParams: this.urlParams,
      hash: this.hash,
      headers: redact(this.headers),
      body: this.body.toJSON()
    };
  },
  pipe() {
    return pipeArguments(this, arguments);
  }
};
function makeWith(method, url, urlParams2, hash2, headers, body) {
  const self = Object.create(Proto11);
  self.method = method;
  self.url = url;
  self.urlParams = urlParams2;
  self.hash = hash2;
  self.headers = headers;
  self.body = body;
  return self;
}
var empty11 = /* @__PURE__ */ makeWith("GET", "", empty8, /* @__PURE__ */ none2(), empty7, empty10);
var make31 = (method) => (url, options3) => modify4(empty11, {
  method,
  url,
  ...options3 ?? void 0
});
var get6 = /* @__PURE__ */ make31("GET");
var query = /* @__PURE__ */ make31("QUERY");
var post = /* @__PURE__ */ make31("POST");
var patch = /* @__PURE__ */ make31("PATCH");
var put = /* @__PURE__ */ make31("PUT");
var del = /* @__PURE__ */ make31("DELETE");
var head3 = /* @__PURE__ */ make31("HEAD");
var options = /* @__PURE__ */ make31("OPTIONS");
var trace = /* @__PURE__ */ make31("TRACE");
var modify4 = /* @__PURE__ */ dual(2, (self, options3) => {
  let result3 = self;
  if (options3.method) {
    result3 = setMethod(result3, options3.method);
  }
  if (options3.url) {
    result3 = setUrl(result3, options3.url);
  }
  if (options3.headers) {
    result3 = setHeaders(result3, options3.headers);
  }
  if (options3.urlParams) {
    result3 = setUrlParams(result3, options3.urlParams);
  }
  if (options3.hash) {
    result3 = setHash2(result3, options3.hash);
  }
  if (options3.body) {
    result3 = setBody(result3, options3.body);
  }
  if (options3.accept) {
    result3 = accept(result3, options3.accept);
  }
  if (options3.acceptJson) {
    result3 = acceptJson(result3);
  }
  return result3;
});
var setMethod = /* @__PURE__ */ dual(2, (self, method) => makeWith(method, self.url, self.urlParams, self.hash, self.headers, self.body));
var setHeader = /* @__PURE__ */ dual(3, (self, key, value3) => makeWith(self.method, self.url, self.urlParams, self.hash, set3(self.headers, key, value3), self.body));
var setHeaders = /* @__PURE__ */ dual(2, (self, input) => makeWith(self.method, self.url, self.urlParams, self.hash, setAll(self.headers, input), self.body));
var updateHeaders2 = /* @__PURE__ */ dual(2, (self, f) => makeWith(self.method, self.url, self.urlParams, self.hash, f(self.headers), self.body));
var removeHeader = /* @__PURE__ */ dual(2, (self, key) => updateHeaders2(self, remove5(key)));
var basicAuth = /* @__PURE__ */ dual(3, (self, username, password) => setHeader(self, "Authorization", `Basic ${btoa(`${stringOrRedacted(username)}:${stringOrRedacted(password)}`)}`));
var bearerToken = /* @__PURE__ */ dual(2, (self, token) => setHeader(self, "Authorization", `Bearer ${stringOrRedacted(token)}`));
var accept = /* @__PURE__ */ dual(2, (self, mediaType) => setHeader(self, "Accept", mediaType));
var acceptJson = /* @__PURE__ */ accept("application/json");
var setUrl = /* @__PURE__ */ dual(2, (self, url) => {
  if (typeof url === "string") {
    return makeWith(self.method, url, self.urlParams, self.hash, self.headers, self.body);
  }
  const clone = new URL(url.toString());
  const urlParams2 = fromInput4(clone.searchParams);
  const hash2 = fromNullishOr(clone.hash === "" ? void 0 : clone.hash.slice(1));
  clone.search = "";
  clone.hash = "";
  return makeWith(self.method, clone.toString(), urlParams2, hash2, self.headers, self.body);
});
var prependUrl = /* @__PURE__ */ dual(2, (self, path) => {
  if (path === "") return self;
  return makeWith(self.method, joinSegments(path, self.url), self.urlParams, self.hash, self.headers, self.body);
});
var appendUrl = /* @__PURE__ */ dual(2, (self, path) => {
  if (path === "") return self;
  return makeWith(self.method, joinSegments(self.url, path), self.urlParams, self.hash, self.headers, self.body);
});
var joinSegments = (first, second) => {
  const endsWithSlash = first.endsWith("/");
  const startsWithSlash = second.startsWith("/");
  const needsTrim = endsWithSlash && startsWithSlash;
  const needsSlash = !endsWithSlash && !startsWithSlash;
  return needsTrim ? first + second.slice(1) : needsSlash ? first + "/" + second : first + second;
};
var updateUrl = /* @__PURE__ */ dual(2, (self, f) => makeWith(self.method, f(self.url), self.urlParams, self.hash, self.headers, self.body));
var setUrlParam = /* @__PURE__ */ dual(3, (self, key, value3) => makeWith(self.method, self.url, set4(self.urlParams, key, value3), self.hash, self.headers, self.body));
var setUrlParams = /* @__PURE__ */ dual(2, (self, input) => makeWith(self.method, self.url, setAll2(self.urlParams, input), self.hash, self.headers, self.body));
var appendUrlParam = /* @__PURE__ */ dual(3, (self, key, value3) => makeWith(self.method, self.url, append2(self.urlParams, key, value3), self.hash, self.headers, self.body));
var appendUrlParams = /* @__PURE__ */ dual(2, (self, input) => makeWith(self.method, self.url, appendAll2(self.urlParams, input), self.hash, self.headers, self.body));
var setHash2 = /* @__PURE__ */ dual(2, (self, hash2) => makeWith(self.method, self.url, self.urlParams, some2(hash2), self.headers, self.body));
var removeHash = (self) => makeWith(self.method, self.url, self.urlParams, none2(), self.headers, self.body);
var setBody = /* @__PURE__ */ dual(2, (self, body) => {
  return makeWith(self.method, self.url, self.urlParams, self.hash, updateHeaders(self.headers, body), body);
});
var bodyUint8Array = /* @__PURE__ */ dual((args2) => isHttpClientRequest(args2[0]), (self, body, contentType) => setBody(self, uint8Array(body, contentType)));
var bodyText = /* @__PURE__ */ dual((args2) => isHttpClientRequest(args2[0]), (self, body, contentType) => setBody(self, text(body, contentType)));
var bodyJson = /* @__PURE__ */ dual(2, (self, body) => map7(json(body), (body2) => setBody(self, body2)));
var bodyJsonUnsafe = /* @__PURE__ */ dual(2, (self, body) => setBody(self, jsonUnsafe(body)));
var schemaBodyJson = (schema2, options3) => {
  const encode5 = jsonSchema(schema2, options3);
  return dual(2, (self, body) => map7(encode5(body), (body2) => setBody(self, body2)));
};
var bodyUrlParams = /* @__PURE__ */ dual(2, (self, input) => setBody(self, urlParams(fromInput4(input))));
var bodyFormData = /* @__PURE__ */ dual(2, (self, body) => setBody(self, formData(body)));
var bodyFormDataRecord = /* @__PURE__ */ dual(2, (self, entries3) => setBody(self, formDataRecord(entries3)));
var bodyStream = /* @__PURE__ */ dual((args2) => isHttpClientRequest(args2[0]), (self, body, options3) => setBody(self, stream(body, options3?.contentType, options3?.contentLength)));
var bodyFile = /* @__PURE__ */ dual((args2) => isHttpClientRequest(args2[0]), (self, path, options3) => map7(file(path, options3), (body) => setBody(self, body)));
function toUrl(self) {
  const r = make30(self.url, self.urlParams, getOrUndefined(self.hash));
  if (isSuccess2(r)) {
    return some2(r.success);
  }
  return none2();
}
var fromWeb = (request3) => {
  const method = request3.method.toUpperCase();
  return modify4(empty11, {
    method,
    url: new URL(request3.url),
    headers: request3.headers,
    body: fromWebBody(request3, method)
  });
};
var fromWebBody = (request3, method) => {
  if (!hasBody(method) || request3.body === null) {
    return empty10;
  }
  return raw(request3.body, {
    contentType: request3.headers.get("content-type") ?? void 0,
    contentLength: parseContentLength(request3.headers.get("content-length"))
  });
};
var toWebResult = (self, options3) => {
  const url = make30(self.url, self.urlParams, getOrUndefined(self.hash));
  if (isFailure2(url)) {
    return fail2(url.failure);
  }
  const requestInit = {
    method: self.method,
    headers: self.headers
  };
  if (options3?.signal) {
    requestInit.signal = options3.signal;
  }
  if (hasBody(self.method)) {
    switch (self.body._tag) {
      case "Empty": {
        break;
      }
      case "Raw": {
        requestInit.body = self.body.body;
        if (isReadableStream(self.body.body)) {
          ;
          requestInit.duplex = "half";
        }
        break;
      }
      case "Uint8Array": {
        requestInit.body = self.body.body;
        break;
      }
      case "FormData": {
        requestInit.body = self.body.formData;
        break;
      }
      case "Stream": {
        requestInit.body = toReadableStreamWith(self.body.stream, options3?.context ?? empty());
        requestInit.duplex = "half";
        break;
      }
    }
  }
  return try_({
    try: () => new Request(url.success, requestInit),
    catch: (cause) => new UrlError({
      cause
    })
  });
};
var isReadableStream = (u) => typeof ReadableStream !== "undefined" && u instanceof ReadableStream;
var toWeb = (self, options3) => contextWith2((context3) => fromResult2(toWebResult(self, {
  context: context3,
  signal: options3?.signal
})));

// ../../node_modules/effect/dist/http/HttpClientResponse.js
var HttpClientResponse_exports = {};
__export(HttpClientResponse_exports, {
  TypeId: () => TypeId43,
  filterStatus: () => filterStatus,
  filterStatusOk: () => filterStatusOk,
  fromWeb: () => fromWeb2,
  matchStatus: () => matchStatus,
  schemaBodyJson: () => schemaBodyJson2,
  schemaBodyUrlParams: () => schemaBodyUrlParams,
  schemaHeaders: () => schemaHeaders,
  schemaJson: () => schemaJson,
  schemaNoBody: () => schemaNoBody,
  stream: () => stream2
});

// ../../node_modules/effect/dist/http/HttpIncomingMessage.js
var TypeId42 = "~effect/http/HttpIncomingMessage";
var schemaBodyJson2 = (schema2, options3) => {
  const decode5 = decodeEffect2(toCodecJson2(schema2));
  const decodeJson = options3?.reviver === void 0 ? void 0 : decodeEffect2(fromJsonString2(toCodecJson2(schema2), options3));
  return (self) => decodeJson === void 0 ? flatMap5(self.json, (u) => decode5(u, options3)) : flatMap5(self.text, (body) => body === "" ? flatMap5(self.json, (u) => decode5(u, options3)) : decodeJson(body, options3));
};
var schemaBodyUrlParams = (schema2, options3) => {
  const decode5 = RecordFromUrlParams.pipe(decodeTo2(schema2), decodeEffect2);
  return (self) => flatMap5(self.urlParamsBody, (u) => decode5(u, options3));
};
var schemaHeaders = (schema2, options3) => {
  const decode5 = decodeUnknownEffect2(schema2);
  return (self) => decode5(self.headers, options3);
};
var inspect = (self, that) => {
  const contentType = self.headers["content-type"] ?? "";
  let body;
  if (contentType.includes("application/json")) {
    try {
      body = runSync2(self.json);
    } catch (_) {
    }
  } else if (contentType.includes("text/") || contentType.includes("urlencoded")) {
    try {
      body = runSync2(self.text);
    } catch (_) {
    }
  }
  const obj = {
    ...that,
    headers: redact(self.headers),
    remoteAddress: self.remoteAddress
  };
  if (body !== void 0) {
    obj.body = body;
  }
  return obj;
};

// ../../node_modules/effect/dist/http/HttpClientResponse.js
var TypeId43 = "~effect/http/HttpClientResponse";
var fromWeb2 = (request3, source) => new WebHttpClientResponse(request3, source);
var schemaJson = (schema2, options3) => {
  const decode5 = decodeEffect2(toCodecJson2(schema2), options3);
  const decodeBody = schemaBodyJson2(Unknown2, options3);
  return (self) => flatMap5(decodeBody(self), (body) => decode5({
    status: self.status,
    headers: self.headers,
    body
  }));
};
var schemaNoBody = (schema2, options3) => {
  const decode5 = decodeEffect2(schema2, options3);
  return (self) => decode5({
    status: self.status,
    headers: self.headers
  });
};
var stream2 = (effect2) => unwrap4(map7(effect2, (self) => self.stream));
var matchStatus = /* @__PURE__ */ dual(2, (self, cases) => {
  const status = self.status;
  if (cases[status]) {
    return cases[status](self);
  } else if (status >= 200 && status < 300 && cases["2xx"]) {
    return cases["2xx"](self);
  } else if (status >= 300 && status < 400 && cases["3xx"]) {
    return cases["3xx"](self);
  } else if (status >= 400 && status < 500 && cases["4xx"]) {
    return cases["4xx"](self);
  } else if (status >= 500 && status < 600 && cases["5xx"]) {
    return cases["5xx"](self);
  }
  return cases.orElse(self);
});
var filterStatus = /* @__PURE__ */ dual(2, (self, f) => suspend3(() => f(self.status) ? succeed6(self) : fail6(new HttpClientError({
  reason: new StatusCodeError({
    response: self,
    request: self.request,
    description: "invalid status code"
  })
}))));
var filterStatusOk = (self) => self.status >= 200 && self.status < 300 ? succeed6(self) : fail6(new HttpClientError({
  reason: new StatusCodeError({
    response: self,
    request: self.request,
    description: "non 2xx status code"
  })
}));
var WebHttpClientResponse = class extends Class2 {
  [TypeId42];
  [TypeId43];
  request;
  source;
  constructor(request3, source) {
    super();
    this.request = request3;
    this.source = source;
    this[TypeId42] = TypeId42;
    this[TypeId43] = TypeId43;
  }
  toJSON() {
    return inspect(this, {
      _id: "HttpClientResponse",
      request: this.request.toJSON(),
      status: this.status
    });
  }
  get status() {
    return this.source.status;
  }
  get url() {
    if (this.source.url) return this.source.url.split("#")[0];
    const url = toUrl(this.request);
    if (isNone2(url)) return "";
    url.value.hash = "";
    return url.value.href;
  }
  get headers() {
    return fromInput3(this.source.headers);
  }
  cachedCookies;
  get cookies() {
    if (this.cachedCookies) {
      return this.cachedCookies;
    }
    return this.cachedCookies = fromSetCookie(this.source.headers.getSetCookie());
  }
  get remoteAddress() {
    return none2();
  }
  get stream() {
    return this.source.body ? fromReadableStream2({
      evaluate: () => this.source.body,
      onError: (cause) => new HttpClientError({
        reason: new DecodeError({
          request: this.request,
          response: this,
          cause
        })
      })
    }) : fail10(new HttpClientError({
      reason: new EmptyBodyError({
        request: this.request,
        response: this,
        description: "can not create stream from empty body"
      })
    }));
  }
  get json() {
    return flatMap5(this.text, (text2) => try_3({
      try: () => text2 === "" ? null : JSON.parse(text2),
      catch: (cause) => new HttpClientError({
        reason: new DecodeError({
          request: this.request,
          response: this,
          cause
        })
      })
    }));
  }
  textBody;
  get text() {
    return this.textBody ??= map7(this.arrayBuffer, (_) => new TextDecoder().decode(_));
  }
  get urlParamsBody() {
    return flatMap5(this.text, (_) => try_3({
      try: () => fromInput4(new URLSearchParams(_)),
      catch: (cause) => new HttpClientError({
        reason: new DecodeError({
          request: this.request,
          response: this,
          cause
        })
      })
    }));
  }
  formDataBody;
  get formData() {
    return this.formDataBody ??= tryPromise2({
      try: () => this.source.formData(),
      catch: (cause) => new HttpClientError({
        reason: new DecodeError({
          request: this.request,
          response: this,
          cause
        })
      })
    }).pipe(cached2, runSync2);
  }
  arrayBufferBody;
  get arrayBuffer() {
    if (this.arrayBufferBody) {
      return this.arrayBufferBody;
    }
    this.arrayBufferBody = tryPromise2({
      try: () => this.source.arrayBuffer(),
      catch: (cause) => new HttpClientError({
        reason: new DecodeError({
          request: this.request,
          response: this,
          cause
        })
      })
    }).pipe(cached2, runSync2);
    return this.arrayBufferBody;
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};

// ../../node_modules/effect/dist/http/HttpTraceContext.js
var toHeaders = (span2) => fromRecordUnsafe({
  b3: `${span2.traceId}-${span2.spanId}-${span2.sampled ? "1" : "0"}${match(span2.parent, {
    onNone: () => "",
    onSome: (parent) => `-${parent.spanId}`
  })}`,
  traceparent: `00-${span2.traceId}-${span2.spanId}-${span2.sampled ? "01" : "00"}`
});

// ../../node_modules/effect/dist/http/HttpClient.js
var TypeId44 = "~effect/http/HttpClient";
var isHttpClient = (u) => hasProperty(u, TypeId44);
var HttpClient = /* @__PURE__ */ Service("effect/HttpClient");
var accessor = (method) => (...args2) => flatMap5(HttpClient, (client) => client[method](...args2));
var execute = /* @__PURE__ */ accessor("execute");
var get7 = /* @__PURE__ */ accessor("get");
var query2 = /* @__PURE__ */ accessor("query");
var head4 = /* @__PURE__ */ accessor("head");
var post2 = /* @__PURE__ */ accessor("post");
var patch2 = /* @__PURE__ */ accessor("patch");
var put2 = /* @__PURE__ */ accessor("put");
var del2 = /* @__PURE__ */ accessor("del");
var options2 = /* @__PURE__ */ accessor("options");
var transform4 = /* @__PURE__ */ dual(2, (self, f) => makeWith2(flatMap5((request3) => f(self.postprocess(succeed6(request3)), request3)), self.preprocess));
var transformResponse = /* @__PURE__ */ dual(2, (self, f) => makeWith2((request3) => f(self.postprocess(request3)), self.preprocess));
var catch_5 = /* @__PURE__ */ dual(2, (self, f) => transformResponse(self, catch_3(f)));
var catchTag4 = /* @__PURE__ */ dual(3, (self, tag2, f) => transformResponse(self, (effect2) => catchTag3(effect2, tag2, f)));
var catchTags3 = /* @__PURE__ */ dual(2, (self, cases) => transformResponse(self, catchTags2(cases)));
var filterOrElse3 = /* @__PURE__ */ dual(3, (self, f, orElse2) => transformResponse(self, filterOrElse2(f, orElse2)));
var filterOrFail3 = /* @__PURE__ */ dual(3, (self, f, orFailWith) => transformResponse(self, filterOrFail2(f, orFailWith)));
var filterStatus2 = /* @__PURE__ */ dual(2, (self, f) => transformResponse(self, flatMap5(filterStatus(f))));
var filterStatusOk2 = /* @__PURE__ */ transformResponse(/* @__PURE__ */ flatMap5(filterStatusOk));
var makeWith2 = (postprocess, preprocess) => {
  const self = Object.create(Proto12);
  self.preprocess = preprocess;
  self.postprocess = postprocess;
  self.execute = function(request3) {
    return postprocess(preprocess(request3));
  };
  return self;
};
var Proto12 = {
  [TypeId44]: TypeId44,
  pipe() {
    return pipeArguments(this, arguments);
  },
  ...BaseProto,
  toJSON() {
    return {
      _id: "effect/HttpClient"
    };
  },
  .../* @__PURE__ */ Object.fromEntries(/* @__PURE__ */ allShort.map(([fullMethod, method]) => [method, function(url, options3) {
    return this.execute(make31(fullMethod)(url, options3));
  }]))
};
var make32 = (f) => makeWith2((effect2) => flatMap5(effect2, (request3) => withFiber2((fiber3) => {
  const scopedController = scopedRequests.get(request3);
  const controller = scopedController ?? new AbortController();
  const urlResult = make30(request3.url, request3.urlParams, getOrUndefined(request3.hash));
  if (isFailure2(urlResult)) {
    return fail6(new HttpClientError({
      reason: new InvalidUrlError({
        request: request3,
        cause: urlResult.failure
      })
    }));
  }
  const url = urlResult.success;
  const tracerDisabled = fiber3.getRef(DisablePropagation) || fiber3.getRef(TracerDisabledWhen)(request3);
  if (tracerDisabled) {
    const effect3 = f(request3, url, controller.signal, fiber3);
    if (scopedController) return effect3;
    return uninterruptibleMask2((restore) => matchCauseEffect2(restore(effect3), {
      onSuccess(response) {
        responseRegistry.register(response, controller);
        return succeed6(new InterruptibleResponse(response, controller));
      },
      onFailure(cause) {
        if (hasInterrupts2(cause)) {
          controller.abort();
        }
        return failCause3(cause);
      }
    }));
  }
  return useSpan2(fiber3.getRef(SpanNameGenerator)(request3), {
    kind: "client"
  }, (span2) => {
    span2.attribute("http.request.method", request3.method);
    span2.attribute("server.address", url.origin);
    if (url.port !== "") {
      span2.attribute("server.port", +url.port);
    }
    span2.attribute("url.full", url.toString());
    span2.attribute("url.path", url.pathname);
    span2.attribute("url.scheme", url.protocol.slice(0, -1));
    const query3 = url.search.slice(1);
    if (query3 !== "") {
      span2.attribute("url.query", query3);
    }
    const redactedHeaderNames = fiber3.getRef(CurrentRedactedNames);
    const headerFilter = fiber3.getRef(TracerHeaderFilter);
    for (const name in request3.headers) {
      if (!headerFilter(name, "request")) continue;
      span2.attribute(`http.request.header.${name}`, isRedactedName(name, redactedHeaderNames) ? "<redacted>" : request3.headers[name]);
    }
    request3 = fiber3.getRef(TracerPropagationEnabled) ? setHeaders(request3, toHeaders(span2)) : request3;
    return uninterruptibleMask2((restore) => restore(f(request3, url, controller.signal, fiber3)).pipe(withParentSpan3(span2, {
      captureStackTrace: false
    }), matchCauseEffect2({
      onSuccess: (response) => {
        span2.attribute("http.response.status_code", response.status);
        for (const name in response.headers) {
          if (!headerFilter(name, "response")) continue;
          span2.attribute(`http.response.header.${name}`, isRedactedName(name, redactedHeaderNames) ? "<redacted>" : response.headers[name]);
        }
        if (scopedController) return succeed6(response);
        responseRegistry.register(response, controller);
        return succeed6(new InterruptibleResponse(response, controller));
      },
      onFailure(cause) {
        if (!scopedController && hasInterrupts2(cause)) {
          controller.abort();
        }
        return failCause3(cause);
      }
    })));
  });
})), succeed6);
var mapRequest = /* @__PURE__ */ dual(2, (self, f) => makeWith2(self.postprocess, (request3) => map7(self.preprocess(request3), f)));
var mapRequestEffect = /* @__PURE__ */ dual(2, (self, f) => makeWith2(self.postprocess, (request3) => flatMap5(self.preprocess(request3), f)));
var mapRequestInput = /* @__PURE__ */ dual(2, (self, f) => makeWith2(self.postprocess, (request3) => self.preprocess(f(request3))));
var mapRequestInputEffect = /* @__PURE__ */ dual(2, (self, f) => makeWith2(self.postprocess, (request3) => flatMap5(f(request3), self.preprocess)));
var retry4 = /* @__PURE__ */ dual(2, (self, policy) => transformResponse(self, retry2(policy)));
var retryTransient = /* @__PURE__ */ dual(2, (self, options3) => {
  const isOnlySchedule = isSchedule(options3);
  const retryOn = isOnlySchedule ? "errors-and-responses" : options3.retryOn ?? "errors-and-responses";
  const schedule3 = isOnlySchedule ? options3 : options3.schedule;
  const passthroughSchedule = schedule3 && passthrough(schedule3);
  const times = isOnlySchedule ? void 0 : options3.times;
  return transformResponse(self, flow(retryOn === "errors-only" ? identity : repeat2({
    schedule: passthroughSchedule,
    times,
    while: isTransientResponse
  }), retryOn === "response-only" ? identity : retry2({
    while: isOnlySchedule || options3.while === void 0 ? isTransientError : or(isTransientError, options3.while),
    schedule: schedule3,
    times
  })));
});
var withRateLimiter = /* @__PURE__ */ dual(2, (self, options3) => {
  const initialState = {
    initial: true,
    limit: options3.limit,
    window: max2(fromInputUnsafe(options3.window), millis(1))
  };
  const states = /* @__PURE__ */ new Map();
  const keyOption = options3.key;
  const resolveKey = typeof keyOption === "function" ? keyOption : constant(keyOption);
  const tokensOption = options3.tokens;
  const resolveTokens = typeof tokensOption === "function" ? tokensOption : constant(tokensOption ?? 1);
  const adaptiveLearningEnabled = !options3.disableAdaptiveLearning;
  const headerNames = resolveRateLimiterHeaderNames(options3.responseHeaders);
  const getState = (key) => {
    const current = states.get(key);
    if (current !== void 0) {
      return current;
    }
    states.set(key, initialState);
    return initialState;
  };
  const onResponse = options3.disableResponseInspection ? void 0 : (clock, key, headers, tokens) => {
    const current = getState(key);
    const next = parseRateLimiterState(current, clock, headers, tokens, headerNames);
    if (next.limit !== current.limit || !equals2(next.window, current.window)) {
      states.set(key, next);
    }
  };
  return transform4(self, function loop(effect2, request3, retries = 0) {
    const fiber3 = getCurrent();
    const clock = fiber3.getRef(Clock);
    const key = resolveKey(request3);
    const tokens = Math.max(resolveTokens(request3), 1);
    const current = getState(key);
    const canRetry = options3.times === void 0 || retries < options3.times;
    function retry5(retryAfter2) {
      return retryAfter2 ? flatMap5(sleep2(retryAfter2), () => loop(effect2, request3, retries + 1)) : loop(effect2, request3, retries + 1);
    }
    const inspectResponse = (response, adaptive) => {
      onResponse?.(clock, key, response.headers, tokens);
      if (options3.disableResponseInspection || response.status !== 429) {
        return succeed6(void 0);
      }
      const retryAfter2 = parseRetryAfter(clock, getHeader(response.headers, ...headerNames.retryAfter));
      if (retryAfter2 === void 0) {
        return succeed6(void 0);
      }
      const delay3 = parseRateLimitWindow(clock, response.headers, headerNames) ?? retryAfter2;
      if (adaptive === void 0) {
        return succeed6(delay3);
      }
      return as3(options3.limiter.adaptiveFeedback({
        key,
        epoch: adaptive.epoch,
        tokens,
        status: response.status,
        retryAfter: delay3
      }), delay3);
    };
    return flatMap5(options3.limiter.consume({
      algorithm: options3.algorithm,
      onExceeded: "delay",
      key,
      limit: current.limit,
      window: current.window,
      tokens
    }), ({
      delay: delay3
    }) => {
      const runAdaptive = () => {
        const runRequest = (adaptive) => {
          const request4 = matchEffect3(effect2, {
            onSuccess(response) {
              return flatMap5(inspectResponse(response, adaptive), (retryAfter2) => {
                if (response.status !== 429 || !canRetry) return succeed6(response);
                return retry5(retryAfter2);
              });
            },
            onFailure(error) {
              if (isTooManyRequestsHttpClientError(error)) {
                return flatMap5(inspectResponse(error.reason.response, adaptive), (retryAfter2) => canRetry ? retry5(retryAfter2) : fail6(error));
              }
              return fail6(error);
            }
          });
          return adaptive === void 0 || isZero(adaptive.delay) ? request4 : delay2(request4, adaptive.delay);
        };
        if (!adaptiveLearningEnabled) {
          return runRequest(void 0);
        }
        return flatMap5(options3.limiter.adaptiveConsume({
          key,
          tokens,
          fallbackLimit: current.limit,
          fallbackWindow: current.window
        }), (adaptive) => {
          if (!isZero(adaptive.delay) && adaptive.phase === "cooldown") {
            return flatMap5(sleep2(adaptive.delay), runAdaptive);
          }
          return runRequest(adaptive);
        });
      };
      return isZero(delay3) ? runAdaptive() : flatMap5(sleep2(delay3), runAdaptive);
    });
  });
});
var resolveRateLimiterHeaderNames = (responseHeaders) => ({
  limit: responseHeaders?.limit === void 0 ? ["ratelimit-limit", "x-ratelimit-limit"] : [responseHeaders.limit.toLowerCase()],
  remaining: responseHeaders?.remaining === void 0 ? ["ratelimit-remaining", "x-ratelimit-remaining"] : [responseHeaders.remaining.toLowerCase()],
  reset: responseHeaders?.reset === void 0 ? ["ratelimit-reset", "x-ratelimit-reset"] : [responseHeaders.reset.toLowerCase()],
  resetAfter: responseHeaders?.resetAfter === void 0 ? ["ratelimit-reset-after", "x-ratelimit-reset-after"] : [responseHeaders.resetAfter.toLowerCase()],
  retryAfter: responseHeaders?.retryAfter === void 0 ? ["retry-after"] : [responseHeaders.retryAfter.toLowerCase()]
});
var parseRateLimiterState = (state, clock, headers, tokens, headerNames) => {
  const limit = parseRateLimitLimit(state, headers, tokens, headerNames) ?? state.limit;
  const window = parseRateLimitWindow(clock, headers, headerNames) ?? state.window;
  if (limit === state.limit && equals2(window, state.window)) {
    return state;
  }
  return {
    limit,
    window,
    initial: false
  };
};
var parseRateLimitLimit = (state, headers, tokens, headerNames) => {
  const raw2 = getHeader(headers, ...headerNames.limit);
  const value3 = parseNumberHeader(raw2);
  if (value3 !== void 0 && value3 > 0) {
    return value3;
  }
  const remaining = parseRateLimitRemaining(headers, headerNames);
  if (remaining === void 0) {
    return void 0;
  }
  return state.initial ? remaining + tokens : Math.max(remaining + tokens, state.limit);
};
var parseRateLimitRemaining = (headers, headerNames) => {
  const raw2 = getHeader(headers, ...headerNames.remaining);
  const value3 = parseNumberHeader(raw2);
  return value3 !== void 0 && value3 >= 0 ? value3 : void 0;
};
var parseRateLimitWindow = (clock, headers, headerNames) => {
  const resetAfter = parseResetAfter(getHeader(headers, ...headerNames.resetAfter));
  if (resetAfter !== void 0) {
    return resetAfter;
  }
  return parseResetHeader(clock, getHeader(headers, ...headerNames.reset));
};
var parseRetryAfter = (clock, value3) => {
  if (value3 === void 0) {
    return void 0;
  }
  const numeric = parseNumberHeader(value3);
  if (numeric !== void 0) {
    return max2(seconds(numeric), millis(1));
  }
  const parsedDate = Date.parse(value3);
  if (Number.isNaN(parsedDate)) {
    return void 0;
  }
  const millis2 = parsedDate - clock.currentTimeMillisUnsafe();
  if (millis2 <= 0) {
    return millis(1);
  }
  return millis(millis2);
};
var parseResetAfter = (value3) => {
  const numeric = parseNumberHeader(value3);
  if (numeric === void 0 || numeric <= 0) {
    return void 0;
  }
  return max2(seconds(numeric), millis(1));
};
var parseResetHeader = (clock, value3) => {
  const numeric = parseNumberHeader(value3);
  if (numeric === void 0 || numeric <= 0) {
    return void 0;
  }
  const nowMillis = clock.currentTimeMillisUnsafe();
  if (numeric > 1e12) {
    return millis(Math.max(numeric - nowMillis, 1));
  }
  if (numeric > 1e9) {
    return millis(Math.max(numeric * 1e3 - nowMillis, 1));
  }
  return max2(seconds(numeric), millis(1));
};
var parseNumberHeader = (value3) => {
  if (value3 === void 0) {
    return void 0;
  }
  const match7 = /-?\d+(?:\.\d+)?/.exec(value3);
  if (match7 === null) {
    return void 0;
  }
  const parsed = Number(match7[0]);
  return Number.isFinite(parsed) ? parsed : void 0;
};
var getHeader = (headers, ...keys3) => {
  for (let i = 0; i < keys3.length; i++) {
    const value3 = headers[keys3[i]];
    if (value3 !== void 0) {
      return value3;
    }
  }
  return void 0;
};
var tap5 = /* @__PURE__ */ dual(2, (self, f) => transformResponse(self, tap4(f)));
var tapError5 = /* @__PURE__ */ dual(2, (self, f) => transformResponse(self, tapError3(f)));
var tapRequest = /* @__PURE__ */ dual(2, (self, f) => makeWith2(self.postprocess, (request3) => tap4(self.preprocess(request3), f)));
var withCookiesRef = /* @__PURE__ */ dual(2, (self, ref) => makeWith2((request3) => tap4(self.postprocess(request3), (response) => update2(ref, (cookies) => merge3(cookies, response.cookies))), (request3) => flatMap5(self.preprocess(request3), (request4) => map7(get5(ref), (cookies) => isEmpty3(cookies) ? request4 : setHeader(request4, "cookie", toCookieHeader(cookies))))));
var withScope = (self) => transform4(self, (effect2, request3) => {
  const controller = new AbortController();
  scopedRequests.set(request3, controller);
  return andThen3(addFinalizer3(() => sync3(() => controller.abort())), effect2);
});
var followRedirects = /* @__PURE__ */ dual((args2) => isHttpClient(args2[0]), (self, maxRedirects) => makeWith2((request3) => {
  const loop = (request4, redirects) => suspend3(() => {
    let currentRequest;
    return flatMap5(self.postprocess(map7(request4, (request5) => {
      currentRequest = request5;
      return request5;
    })), (response) => {
      if (response.status < 300 || response.status >= 400 || !response.headers.location || redirects >= (maxRedirects ?? 10)) {
        return succeed6(response);
      }
      const url = new URL(response.headers.location, response.request.url);
      const request5 = currentRequest ?? response.request;
      let nextRequest = request5;
      if ((response.status === 301 || response.status === 302) && request5.method === "POST" || response.status === 303 && request5.method !== "GET" && request5.method !== "HEAD") {
        nextRequest = setMethod(nextRequest, "GET");
        nextRequest = setBody(nextRequest, empty10);
      }
      if (url.origin !== new URL(response.request.url).origin) {
        nextRequest = removeHeader(nextRequest, "authorization");
        nextRequest = removeHeader(nextRequest, "proxy-authorization");
        nextRequest = removeHeader(nextRequest, "cookie");
      }
      return loop(succeed6(setUrl(nextRequest, url)), redirects + 1);
    });
  });
  return loop(request3, 0);
}, self.preprocess));
var TracerDisabledWhen = /* @__PURE__ */ Reference("effect/http/HttpClient/TracerDisabledWhen", {
  defaultValue: () => constFalse
});
var TracerHeaderFilter = /* @__PURE__ */ Reference("effect/http/HttpClient/TracerHeaderFilter", {
  defaultValue: () => constTrue
});
var TracerPropagationEnabled = /* @__PURE__ */ Reference("effect/http/HttpClient/TracerPropagationEnabled", {
  defaultValue: constTrue
});
var SpanNameGenerator = /* @__PURE__ */ Reference("effect/http/HttpClient/SpanNameGenerator", {
  defaultValue: () => (request3) => `http.client ${request3.method}`
});
var layerMergedContext = (effect2) => effect(HttpClient)(contextWith2((context3) => map7(effect2, (client) => transformResponse(client, updateContext2((input) => merge(context3, input))))));
var responseRegistry = /* @__PURE__ */ (() => {
  if ("FinalizationRegistry" in globalThis && globalThis.FinalizationRegistry) {
    const registry = /* @__PURE__ */ new FinalizationRegistry((controller) => {
      controller.abort();
    });
    return {
      register(response, controller) {
        registry.register(response, controller, response);
      },
      unregister(response) {
        registry.unregister(response);
      }
    };
  }
  const timers = /* @__PURE__ */ new Map();
  return {
    register(response, controller) {
      timers.set(response, setTimeout(() => controller.abort(), 5e3));
    },
    unregister(response) {
      const timer = timers.get(response);
      if (timer === void 0) return;
      clearTimeout(timer);
      timers.delete(response);
    }
  };
})();
var scopedRequests = /* @__PURE__ */ new WeakMap();
var InterruptibleResponse = class {
  original;
  controller;
  constructor(original, controller) {
    this.original = original;
    this.controller = controller;
  }
  [TypeId43] = TypeId43;
  [TypeId42] = TypeId42;
  applyInterrupt(effect2) {
    return suspend3(() => {
      responseRegistry.unregister(this.original);
      return onInterrupt2(effect2, () => sync3(() => {
        this.controller.abort();
      }));
    });
  }
  get request() {
    return this.original.request;
  }
  get url() {
    return this.original.url;
  }
  get status() {
    return this.original.status;
  }
  get headers() {
    return this.original.headers;
  }
  get cookies() {
    return this.original.cookies;
  }
  get remoteAddress() {
    return this.original.remoteAddress;
  }
  get formData() {
    return this.applyInterrupt(this.original.formData);
  }
  get text() {
    return this.applyInterrupt(this.original.text);
  }
  get json() {
    return this.applyInterrupt(this.original.json);
  }
  get urlParamsBody() {
    return this.applyInterrupt(this.original.urlParamsBody);
  }
  get arrayBuffer() {
    return this.applyInterrupt(this.original.arrayBuffer);
  }
  get stream() {
    return suspend6(() => {
      responseRegistry.unregister(this.original);
      return ensuring4(this.original.stream, sync3(() => {
        this.controller.abort();
      }));
    });
  }
  toJSON() {
    return this.original.toJSON();
  }
  [NodeInspectSymbol]() {
    return this.original[NodeInspectSymbol]();
  }
  pipe() {
    return pipeArguments(this, arguments);
  }
};
var isTransientError = (error) => isTimeoutError2(error) || isTransientHttpError(error);
var isTransientHttpError = (error) => isHttpClientError(error) && (error.reason._tag === "TransportError" || error.reason._tag === "StatusCodeError" && isTransientResponse(error.reason.response));
var isTooManyRequestsHttpClientError = (error) => isHttpClientError(error) && error.reason._tag === "StatusCodeError" && error.reason.response.status === 429;
var isTransientResponse = (response) => response.status === 408 || response.status === 429 || response.status === 500 || response.status === 502 || response.status === 503 || response.status === 504;

// ../../node_modules/effect/dist/http/FetchHttpClient.js
var Fetch = /* @__PURE__ */ Reference("effect/http/FetchHttpClient/Fetch", {
  defaultValue: () => globalThis.fetch
});
var RequestInit = class extends (/* @__PURE__ */ Service()("effect/http/FetchHttpClient/RequestInit")) {
};
var fetch = /* @__PURE__ */ make32((request3, url, signal, fiber3) => {
  const fetch2 = fiber3.getRef(Fetch);
  const options3 = getOrUndefined2(fiber3.context, RequestInit) ?? {};
  let headers = options3.headers ? merge4(fromInput3(options3.headers), request3.headers) : request3.headers;
  if (headers["content-length"]) {
    headers = remove5(headers, "content-length");
  }
  const send = (body) => map7(tryPromise2({
    try: () => fetch2(url, {
      ...options3,
      method: request3.method,
      headers,
      body,
      duplex: typeof ReadableStream !== "undefined" && body instanceof ReadableStream ? "half" : void 0,
      signal
    }),
    catch: (cause) => new HttpClientError({
      reason: new TransportError({
        request: request3,
        cause
      })
    })
  }), (response) => fromWeb2(request3, response));
  switch (request3.body._tag) {
    case "Raw":
    case "Uint8Array":
      return send(request3.body.body);
    case "FormData":
      return send(request3.body.formData);
    case "Stream":
      return flatMap5(toReadableStreamEffect(request3.body.stream), send);
  }
  return send(void 0);
});
var layer6 = /* @__PURE__ */ layerMergedContext(/* @__PURE__ */ succeed6(fetch));

// ../core/dist/provider-error.js
var JevProvider = Schema_exports.Literals(["zen", "typesafe", "openrouter", "vercel", "laya", "custom"]);
var JevProviderErrorKind = Schema_exports.Literals([
  "authentication",
  "credits-exhausted",
  "quota-exhausted",
  "rate-limited",
  "invalid-request",
  "invalid-response",
  "unavailable"
]);
var ProviderFailureFields = {
  provider: JevProvider,
  kind: JevProviderErrorKind,
  message: Schema_exports.String,
  status: Schema_exports.optional(Schema_exports.Int),
  code: Schema_exports.optional(Schema_exports.String),
  retryAfterMs: Schema_exports.optional(Schema_exports.Number)
};
var JevProviderFailure = Schema_exports.Struct(ProviderFailureFields);
var JevProviderError = class extends Schema_exports.TaggedError()("JevProviderError", {
  ...ProviderFailureFields,
  cause: Schema_exports.optional(Schema_exports.Defect())
}) {
};
var isJevProviderError = Schema_exports.is(JevProviderError);

// ../core/dist/system-one.js
var SystemOneRequest = Schema_exports.Struct({
  model: Schema_exports.NonEmptyString,
  ...JevRequest.fields
});
var SystemOneResponse = Schema_exports.Struct({
  model: JevResult.fields.model,
  answers: JevResult.fields.answers
});
var RoutedSystemOneResponse = Schema_exports.Struct({
  ...SystemOneResponse.fields,
  routing: Schema_exports.Struct({ model: Schema_exports.NonEmptyString })
});
var ProviderErrorDetails = Schema_exports.Struct({
  message: Schema_exports.optional(Schema_exports.String),
  type: Schema_exports.optional(Schema_exports.String),
  code: Schema_exports.optional(Schema_exports.Union([Schema_exports.String, Schema_exports.Number]))
});
var ProviderErrorBody = Schema_exports.Union([
  Schema_exports.Struct({ error: ProviderErrorDetails }),
  ProviderErrorDetails
]);
var decodeProviderErrorBody = Schema_exports.decodeUnknownOption(Schema_exports.fromJsonString(ProviderErrorBody));
var errorDetails = (text2) => {
  const decoded = Option_exports.getOrUndefined(decodeProviderErrorBody(text2));
  if (decoded === void 0)
    return {};
  const details = "error" in decoded ? decoded.error : decoded;
  return {
    code: details.code === void 0 ? details.type : String(details.code),
    message: details.message
  };
};
var creditCodes = /* @__PURE__ */ new Set([
  "CreditsError",
  "billing_required",
  "credit_balance_exhausted",
  "customer_verification_required",
  "insufficient_credits",
  "insufficient_quota"
]);
var quotaCodes = /* @__PURE__ */ new Set([
  "BlackUsageLimitError",
  "FreeUsageLimitError",
  "GoUsageLimitError",
  "MonthlyLimitError",
  "UserLimitError"
]);
var classifyError = (status, code) => {
  if (code !== void 0 && creditCodes.has(code))
    return "credits-exhausted";
  if (code !== void 0 && quotaCodes.has(code))
    return "quota-exhausted";
  if (code === "AuthError")
    return "authentication";
  if (code === "RateLimitError" || code === "rate_limit_error")
    return "rate-limited";
  if (status === 401 || status === 403)
    return "authentication";
  if (status === 402)
    return "credits-exhausted";
  if (status === 429)
    return "rate-limited";
  if (status === 400 || status === 404 || status === 422)
    return "invalid-request";
  return "unavailable";
};
var retryAfter = Effect_exports.fnUntraced(function* (response) {
  const milliseconds = Option_exports.getOrUndefined(Headers_exports.get(response.headers, "retry-after-ms"));
  if (milliseconds !== void 0 && milliseconds.trim().length > 0) {
    const parsed = Number(milliseconds);
    if (Number.isFinite(parsed) && parsed >= 0)
      return parsed;
  }
  const raw2 = Option_exports.getOrUndefined(Headers_exports.get(response.headers, "retry-after"));
  if (raw2 === void 0 || raw2.trim().length === 0)
    return void 0;
  const seconds2 = Number(raw2);
  if (Number.isFinite(seconds2) && seconds2 >= 0)
    return seconds2 * 1e3;
  const date = Date.parse(raw2);
  if (Number.isNaN(date))
    return void 0;
  const now2 = yield* Clock_exports.currentTimeMillis;
  return Math.max(0, date - now2);
});
var validateRequestedAnswers = (provider, result3, questions) => {
  for (const key of Object.keys(questions)) {
    if (result3.answers[key] === void 0) {
      return new JevProviderError({
        provider,
        kind: "invalid-response",
        message: `System One returned no valid noul answer for ${key}`
      });
    }
  }
  return Effect_exports.succeed(result3);
};
var createSystemOneClient = (options3) => ({
  evaluate: Effect_exports.fn(`${options3.provider}.evaluate`)(function* (request3) {
    if (Object.keys(request3.questions).length === 0) {
      return yield* new JevProviderError({
        provider: options3.provider,
        kind: "invalid-request",
        message: "System One requires at least one question"
      });
    }
    const httpRequest = yield* HttpClientRequest_exports.post(options3.url).pipe(HttpClientRequest_exports.acceptJson, HttpClientRequest_exports.setHeaders(options3.headers), HttpClientRequest_exports.schemaBodyJson(SystemOneRequest)({
      model: options3.model,
      state: request3.state,
      questions: request3.questions
    }), Effect_exports.mapError((cause) => new JevProviderError({
      provider: options3.provider,
      kind: "invalid-request",
      message: `${options3.provider} System One request could not be encoded`,
      cause
    })));
    const response = yield* HttpClient_exports.execute(httpRequest).pipe(Effect_exports.provide(FetchHttpClient_exports.layer), Effect_exports.mapError((cause) => new JevProviderError({
      provider: options3.provider,
      kind: "unavailable",
      message: `${options3.provider} System One is unavailable`,
      cause
    })));
    if (response.status < 200 || response.status >= 300) {
      const text2 = yield* response.text.pipe(Effect_exports.orElseSucceed(() => ""), Effect_exports.map((body) => body.slice(0, 2e3)));
      const details = errorDetails(text2);
      return yield* new JevProviderError({
        provider: options3.provider,
        kind: classifyError(response.status, details.code),
        message: details.message ?? `${options3.provider} System One returned HTTP ${response.status}`,
        status: response.status,
        code: details.code,
        retryAfterMs: yield* retryAfter(response)
      });
    }
    const decoded = yield* (options3.modelIdentity === "routing.model" ? HttpClientResponse_exports.schemaBodyJson(RoutedSystemOneResponse)(response).pipe(Effect_exports.map(({ model, answers, routing }) => ({
      model: routing.model,
      answers,
      reportedModel: model
    }))) : HttpClientResponse_exports.schemaBodyJson(SystemOneResponse)(response)).pipe(Effect_exports.mapError((cause) => new JevProviderError({
      provider: options3.provider,
      kind: "invalid-response",
      message: `${options3.provider} System One returned an unrecognized body`,
      status: response.status,
      cause
    })));
    if (options3.modelIdentity === "routing.model" && decoded.model !== options3.model) {
      return yield* new JevProviderError({
        provider: options3.provider,
        kind: "invalid-response",
        message: `${options3.provider} System One served ${decoded.model} instead of ${options3.model}`,
        status: response.status
      });
    }
    return yield* validateRequestedAnswers(options3.provider, decoded, request3.questions);
  })
});

// ../core/dist/laya.js
var DEFAULT_LAYA_ENDPOINT = "http://127.0.0.1:8000/v1/systemone";
var DEFAULT_LAYA_MODEL = "english";
var createLayaClient = (options3 = {}) => createSystemOneClient({
  provider: "laya",
  url: options3.endpoint ?? DEFAULT_LAYA_ENDPOINT,
  model: options3.model ?? DEFAULT_LAYA_MODEL,
  headers: options3.apiKey === void 0 ? {} : { authorization: `Bearer ${options3.apiKey}` },
  modelIdentity: "routing.model"
});

// ../core/dist/openrouter.js
var DEFAULT_OPENROUTER_MODEL = "typesafe/jev-1.13";
var OPENROUTER_SYSTEMONE_URL = "https://openrouter.ai/api/v1/systemone";
var createOpenRouterClient = (apiKey, model = DEFAULT_OPENROUTER_MODEL) => createSystemOneClient({
  provider: "openrouter",
  url: OPENROUTER_SYSTEMONE_URL,
  model,
  headers: { authorization: `Bearer ${apiKey}` }
});

// ../core/dist/typesafe.js
var DEFAULT_TYPESAFE_MODEL = "jev-1.13.0";
var TYPESAFE_SYSTEMONE_URL = "https://api.typesafe.ai/v1/systemone";
var createTypeSafeClient = (apiKey, model = DEFAULT_TYPESAFE_MODEL) => createSystemOneClient({
  provider: "typesafe",
  url: TYPESAFE_SYSTEMONE_URL,
  model,
  headers: { authorization: `Bearer ${apiKey}` }
});

// ../core/dist/vercel.js
var DEFAULT_VERCEL_MODEL = "typesafe-ai/jev";
var VERCEL_SYSTEMONE_URL = "https://ai-gateway.vercel.sh/typesafe/v1/systemone";
var createVercelClient = (apiKey, model = DEFAULT_VERCEL_MODEL) => createSystemOneClient({
  provider: "vercel",
  url: VERCEL_SYSTEMONE_URL,
  model,
  headers: { authorization: `Bearer ${apiKey}` }
});

// ../core/dist/zen.js
var ZEN_SYSTEMONE_URL = "https://opencode.ai/zen/v1/systemone";
var DEFAULT_ZEN_MODEL = "jev-1.13";
var isZenBody = Schema_exports.is(Schema_exports.Struct({
  model: Schema_exports.optional(Schema_exports.Unknown),
  answers: Schema_exports.optional(Schema_exports.Unknown)
}));
var createZenClient = (apiKey, model = DEFAULT_ZEN_MODEL) => createSystemOneClient({
  provider: "zen",
  url: ZEN_SYSTEMONE_URL,
  model,
  headers: { Authorization: `Bearer ${apiKey}` }
});

// src/questions.ts
var ApprovalQuestion = Schema_exports.Struct({
  ...NoulQuestion.fields,
  instructions: Schema_exports.NonEmptyString,
  criteria: Schema_exports.optionalKey(Schema_exports.Struct({
    false: Schema_exports.NonEmptyString,
    true: Schema_exports.NonEmptyString
  })),
  threshold: NoulAnswer.fields.noul
});
var ApprovalQuestions = Schema_exports.Record(Schema_exports.NonEmptyString, ApprovalQuestion).check(
  Schema_exports.isMinProperties(1),
  Schema_exports.isPropertyNames(Schema_exports.NonEmptyString)
);

// src/config-lease.ts
import * as fs from "node:fs";
var import_proper_lockfile = __toESM(require_proper_lockfile(), 1);
var ConfigLeaseError = class extends Schema_exports.TaggedError()("ConfigLeaseError", {
  operation: Schema_exports.Literals(["busy", "write"])
}) {
};
var sameOwner = (owner, current) => owner.dev === current.dev && owner.ino === current.ino && owner.birthtimeNs === current.birthtimeNs;
var acquireConfigLease = Effect_exports.fn("ConfigLease.acquire")(function* (path) {
  const clock = yield* Clock_exports.Clock;
  const lockPath = `${path}.review-lock`;
  let compromised = false;
  let owner;
  const releaseDirectory = (target) => {
    if (owner !== void 0 && !sameOwner(owner, fs.statSync(target, { bigint: true }))) {
      throw new ConfigLeaseError({ operation: "write" });
    }
    fs.rmdirSync(target);
  };
  const leaseFileSystem = {
    ...fs,
    rmdirSync: releaseDirectory,
    rmdir: (target, callback4) => {
      try {
        releaseDirectory(target);
        callback4(null);
      } catch {
        callback4(new ConfigLeaseError({ operation: "write" }));
      }
    }
  };
  yield* Effect_exports.acquireRelease(
    Effect_exports.tryPromise({
      try: () => import_proper_lockfile.default.lock(path, {
        realpath: false,
        lockfilePath: lockPath,
        stale: 1e4,
        update: 2e3,
        retries: { retries: 20, minTimeout: 50, maxTimeout: 100, factor: 1.2 },
        onCompromised: () => {
          compromised = true;
        },
        fs: leaseFileSystem
      }),
      catch: () => new ConfigLeaseError({ operation: "busy" })
    }),
    (release) => Effect_exports.tryPromise({
      try: () => release(),
      catch: () => new ConfigLeaseError({ operation: "write" })
    }).pipe(Effect_exports.ignore)
  );
  owner = yield* Effect_exports.try({
    try: () => fs.statSync(lockPath, { bigint: true }),
    catch: () => new ConfigLeaseError({ operation: "write" })
  });
  const replace = Effect_exports.fn("ConfigLease.replace")(function* (temporary) {
    yield* Effect_exports.try({
      try: () => {
        const current = fs.statSync(lockPath, { bigint: true });
        if (compromised || owner === void 0 || !sameOwner(owner, current) || Number(current.mtimeNs / 1000000n) < clock.currentTimeMillisUnsafe() - 1e4) {
          throw new ConfigLeaseError({ operation: "write" });
        }
        fs.renameSync(temporary, path);
      },
      catch: () => new ConfigLeaseError({ operation: "write" })
    });
  });
  return { replace };
});

// src/config-file.ts
var ConfigFileError = class extends Schema_exports.TaggedError()("ConfigFileError", {
  operation: Schema_exports.Literals(["read", "busy", "write"])
}) {
};
var createConfigFile = Effect_exports.fn("ConfigFile.create")(function* (path, prepare) {
  const fs2 = yield* FileSystem_exports.FileSystem;
  const paths = yield* Path_exports.Path;
  const directory = paths.dirname(path);
  const read2 = Effect_exports.fn("ConfigFile.read")(function* () {
    return yield* fs2.readFileString(path).pipe(
      Effect_exports.catchReason("PlatformError", "NotFound", () => Effect_exports.succeed(void 0)),
      Effect_exports.mapError(() => new ConfigFileError({ operation: "read" }))
    );
  });
  const update3 = Effect_exports.fn("ConfigFile.update")(function* (edit) {
    return yield* Effect_exports.scoped(Effect_exports.gen(function* () {
      yield* fs2.makeDirectory(directory, { recursive: true, mode: 448 }).pipe(
        Effect_exports.mapError(() => new ConfigFileError({ operation: "write" }))
      );
      const lease = yield* acquireConfigLease(path).pipe(
        Effect_exports.mapError((error) => new ConfigFileError({ operation: error.operation }))
      );
      const edited = yield* edit(yield* read2());
      const temporary = yield* fs2.makeTempFileScoped({ directory, prefix: ".jevvy-write-" }).pipe(
        Effect_exports.mapError(() => new ConfigFileError({ operation: "write" }))
      );
      yield* fs2.chmod(temporary, 384).pipe(Effect_exports.mapError(() => new ConfigFileError({ operation: "write" })));
      yield* prepare === void 0 ? fs2.writeFileString(temporary, edited.content).pipe(Effect_exports.mapError(() => new ConfigFileError({ operation: "write" }))) : prepare(temporary, edited.content);
      yield* lease.replace(temporary).pipe(
        Effect_exports.mapError((error) => new ConfigFileError({ operation: error.operation }))
      );
      return edited.value;
    }));
  }, Effect_exports.uninterruptible);
  return { read: read2, update: update3 };
});

// src/review-state.ts
var ReviewSnapshot = Schema_exports.Struct({ enabled: Schema_exports.Boolean });

// src/review-control.ts
var ReviewHarness = Schema_exports.Literals(["opencode", "claude"]);
var HarnessReviewConfig = Schema_exports.Struct({
  enabled: Schema_exports.optionalKey(Schema_exports.Boolean)
});
var decodeHarnessControl = Schema_exports.decodeUnknownEffect(Schema_exports.UndefinedOr(HarnessReviewConfig), {
  onExcessProperty: "error"
});
var ControlDocument = Schema_exports.Struct({
  permissions: Schema_exports.optionalKey(Schema_exports.Struct({
    opencode: Schema_exports.optionalKey(Schema_exports.Unknown),
    claude: Schema_exports.optionalKey(Schema_exports.Unknown)
  }))
});
var ReviewControlError = class extends Schema_exports.TaggedError()("ReviewControlError", {
  operation: Schema_exports.Literals(["read", "parse", "busy", "write"])
}) {
};
var decodeControls = Effect_exports.fn("ReviewControl.decode")(function* (raw2) {
  const errors = [];
  const value3 = parse2(raw2, errors, { allowTrailingComma: true });
  if (errors.length > 0) return yield* new ReviewControlError({ operation: "parse" });
  return yield* Effect_exports.gen(function* () {
    const document = yield* Schema_exports.decodeUnknownEffect(ControlDocument)(value3);
    return { permissions: {
      opencode: yield* decodeHarnessControl(document.permissions?.opencode),
      claude: yield* decodeHarnessControl(document.permissions?.claude)
    } };
  }).pipe(
    Effect_exports.mapError(() => new ReviewControlError({ operation: "parse" }))
  );
});
var createReviewControl = Effect_exports.fn("ReviewControl.create")(function* (path, providedFile) {
  const file2 = providedFile ?? (yield* createConfigFile(path));
  const readDocument2 = Effect_exports.fn("ReviewControl.readDocument")(function* () {
    const raw2 = yield* file2.read().pipe(Effect_exports.mapError(() => new ReviewControlError({ operation: "read" })));
    if (raw2 === void 0) return yield* new ReviewControlError({ operation: "read" });
    const document = yield* decodeControls(raw2);
    return { raw: raw2, document };
  });
  const read2 = Effect_exports.fn("ReviewControl.read")(function* (harness) {
    const { document } = yield* readDocument2();
    const state = document.permissions?.[harness];
    return { enabled: state?.enabled ?? true };
  });
  const change = Effect_exports.fn("ReviewControl.change")(function* (harness, enabled) {
    return yield* file2.update((raw2) => Effect_exports.gen(function* () {
      if (raw2 === void 0) return yield* new ReviewControlError({ operation: "read" });
      const document = yield* decodeControls(raw2);
      const current = document.permissions?.[harness]?.enabled ?? true;
      const state = { enabled: enabled ?? !current };
      const formattingOptions = { insertSpaces: true, tabSize: 2, eol: "\n" };
      const formatted = applyEdits(raw2, modify3(raw2, ["permissions", harness, "enabled"], state.enabled, {
        formattingOptions
      }));
      return { content: formatted, value: state };
    })).pipe(Effect_exports.mapError((error) => new ReviewControlError({ operation: error.operation })));
  });
  return { read: read2, change };
});
var withReviewEnabled = Effect_exports.fn("ReviewControl.withReviewEnabled")(function* (control, harness, review) {
  const state = yield* control.read(harness).pipe(Effect_exports.orElseSucceed(() => void 0));
  if (state?.enabled !== true) return void 0;
  return yield* review;
});

// src/providers.ts
var BuiltInProvider = Literals(["zen", "typesafe", "openrouter", "vercel", "laya"]);
var providerDefinitions = {
  zen: {
    displayName: "OpenCode Zen",
    apiKeyEnvironment: "OPENCODE_API_KEY",
    model: DEFAULT_ZEN_MODEL,
    calibratedModel: "jev-1.13-free",
    createClient: createZenClient
  },
  typesafe: {
    displayName: "TypeSafe AI",
    apiKeyEnvironment: "TYPESAFE_API_KEY",
    model: DEFAULT_TYPESAFE_MODEL,
    calibratedModel: DEFAULT_TYPESAFE_MODEL,
    createClient: createTypeSafeClient
  },
  openrouter: {
    displayName: "OpenRouter",
    apiKeyEnvironment: "OPENROUTER_API_KEY",
    model: DEFAULT_OPENROUTER_MODEL,
    calibratedModel: DEFAULT_OPENROUTER_MODEL,
    createClient: createOpenRouterClient
  },
  vercel: {
    displayName: "Vercel AI Gateway",
    apiKeyEnvironment: "AI_GATEWAY_API_KEY",
    model: DEFAULT_VERCEL_MODEL,
    calibratedModel: DEFAULT_VERCEL_MODEL,
    createClient: createVercelClient
  },
  laya: {
    displayName: "Laya",
    apiKeyEnvironment: "LAYA_API_KEY",
    model: DEFAULT_LAYA_MODEL,
    createClient: (apiKey) => createLayaClient({ apiKey })
  }
};
var providerApiKeyEnvironment = (provider) => providerDefinitions[provider].apiKeyEnvironment;

// src/config-path.ts
import { homedir } from "node:os";
import { join as join3 } from "node:path";
var globalJevvyConfigPath = () => {
  const override = process.env.JEVVY_CONFIG?.trim();
  if (override !== void 0 && override.length > 0) return override;
  const xdg = process.env.XDG_CONFIG_HOME?.trim();
  const root = xdg !== void 0 && xdg.length > 0 ? xdg : join3(homedir(), ".config");
  return join3(root, "jevvy", "jevvy.jsonc");
};

// src/config.ts
var SystemOnePresetSettings = Struct({
  apiKey: optionalKey2(NonEmptyString),
  model: optionalKey2(NonEmptyString),
  opencodeCredential: optionalKey2(NonEmptyString)
});
var CustomProviderSchema = Struct({
  endpoint: URLFromString,
  model: NonEmptyString,
  apiKey: optionalKey2(NonEmptyString)
});
var LayaPolicy = Struct({
  checkpoint: Literals(["english", "multilingual", "typed-decisions"]),
  questions: ApprovalQuestions
});
var LayaProviderSchema = Struct({
  endpoint: optionalKey2(URLFromString),
  model: optionalKey2(Literals(["english", "multilingual", "typed-decisions"])),
  apiKey: optionalKey2(NonEmptyString),
  policy: optionalKey2(LayaPolicy)
});
var JevvyConfigSchema = Struct({
  $schema: optionalKey2(String6),
  provider: JevProvider,
  providers: optionalKey2(Struct({
    zen: optionalKey2(SystemOnePresetSettings),
    typesafe: optionalKey2(SystemOnePresetSettings),
    openrouter: optionalKey2(SystemOnePresetSettings),
    vercel: optionalKey2(SystemOnePresetSettings),
    laya: optionalKey2(LayaProviderSchema),
    custom: optionalKey2(CustomProviderSchema)
  })),
  permissions: optionalKey2(Struct({
    timeoutMs: optionalKey2(Number6.check(isFinite3(), isGreaterThan4(0))),
    questions: optionalKey2(ApprovalQuestions),
    opencode: optionalKey2(HarnessReviewConfig),
    claude: optionalKey2(HarnessReviewConfig)
  }))
});
var ConfigMissing = class extends TaggedError3()("ConfigMissing", {}) {
};
var ConfigFileError2 = class extends TaggedError3()("ConfigFileError", {
  reason: Literals(["read", "schema", "permissions", "policy"])
}) {
};
var EnvironmentApiKeys = all5({
  zen: option3(Redacted2(providerApiKeyEnvironment("zen"))),
  typesafe: option3(Redacted2(providerApiKeyEnvironment("typesafe"))),
  openrouter: option3(Redacted2(providerApiKeyEnvironment("openrouter"))),
  vercel: option3(Redacted2(providerApiKeyEnvironment("vercel"))),
  laya: option3(Redacted2(providerApiKeyEnvironment("laya")))
});
var hasCredentials = (document) => document.providers?.zen?.apiKey !== void 0 || document.providers?.typesafe?.apiKey !== void 0 || document.providers?.openrouter?.apiKey !== void 0 || document.providers?.vercel?.apiKey !== void 0 || document.providers?.laya?.apiKey !== void 0 || document.providers?.custom?.apiKey !== void 0;
var readDocument = fn2("JevvyConfig.readDocument")(function* (path) {
  const fs2 = yield* FileSystem;
  const raw2 = yield* fs2.readFileString(path).pipe(
    catchReason2("PlatformError", "NotFound", () => new ConfigMissing()),
    mapError3((error) => error instanceof ConfigMissing ? error : new ConfigFileError2({ reason: "read" }))
  );
  const parseErrors = [];
  const decoded = parse2(raw2, parseErrors, { allowTrailingComma: true, disallowComments: false });
  if (parseErrors.length > 0) return yield* new ConfigFileError2({ reason: "schema" });
  const document = yield* decodeUnknownEffect2(JevvyConfigSchema, {
    onExcessProperty: "error"
  })(decoded).pipe(
    mapError3(() => new ConfigFileError2({ reason: "schema" }))
  );
  if (process.platform !== "win32" && hasCredentials(document)) {
    const info = yield* fs2.stat(path).pipe(mapError3(() => new ConfigFileError2({ reason: "read" })));
    if ((info.mode & 511) !== 384) {
      yield* fs2.chmod(path, 384).pipe(mapError3(() => new ConfigFileError2({ reason: "permissions" })));
    }
  }
  return document;
});
var invalidMessage = (reason) => {
  if (reason === "policy") {
    return "Laya requires providers.laya.policy with matching checkpoint and questions; calibrate it before enabling auto-approval (top-level permissions.questions cannot configure Laya)";
  }
  if (reason === "permissions") return "credential-bearing jevvy.jsonc could not be secured";
  if (reason === "read") return "jevvy.jsonc could not be read";
  return "jevvy.jsonc does not match the configuration schema";
};
var environmentApiKey = (provider, keys3) => getOrUndefined(keys3[provider]);
var providerSelection = (document, environment) => {
  if (document.provider === "custom") {
    const custom = document.providers?.custom;
    if (custom === void 0 || custom.endpoint.protocol !== "http:" && custom.endpoint.protocol !== "https:") {
      return new ConfigFileError2({ reason: "schema" });
    }
    const apiKey2 = custom.apiKey === void 0 ? void 0 : make14(custom.apiKey);
    return succeed6({
      provider: "custom",
      endpoint: custom.endpoint.href,
      model: custom.model,
      apiKey: apiKey2
    });
  }
  if (document.provider === "laya") {
    const laya = document.providers?.laya;
    if (laya?.endpoint !== void 0 && laya.endpoint.protocol !== "http:" && laya.endpoint.protocol !== "https:") {
      return new ConfigFileError2({ reason: "schema" });
    }
    const fileApiKey2 = laya?.apiKey;
    const apiKey2 = fileApiKey2 === void 0 ? environmentApiKey("laya", environment) : make14(fileApiKey2);
    return succeed6({
      provider: "laya",
      endpoint: laya?.endpoint?.href,
      model: laya?.model,
      apiKey: apiKey2
    });
  }
  const fileApiKey = document.providers?.[document.provider]?.apiKey;
  const apiKey = fileApiKey === void 0 ? environmentApiKey(document.provider, environment) : make14(fileApiKey);
  return succeed6({
    provider: document.provider,
    apiKey,
    model: document.providers?.[document.provider]?.model,
    opencodeCredential: document.providers?.[document.provider]?.opencodeCredential
  });
};
var load = fn2("JevvyConfig.load")(function* (path, environment) {
  const document = yield* readDocument(path).pipe(
    asSome2,
    catchTag3("ConfigMissing", () => succeed6(none2()))
  );
  if (isNone2(document)) return { kind: "unconfigured" };
  const environmentKeys = yield* EnvironmentApiKeys.parse(environment).pipe(
    mapError3(() => new ConfigFileError2({ reason: "schema" }))
  );
  const selection = yield* providerSelection(document.value, environmentKeys);
  const timeoutMs = document.value.permissions?.timeoutMs ?? 5e3;
  if (selection.provider === "laya") {
    const policy = document.value.providers?.laya?.policy;
    if (document.value.permissions?.questions !== void 0 || policy === void 0 || policy.checkpoint !== (selection.model ?? DEFAULT_LAYA_MODEL)) {
      return yield* new ConfigFileError2({ reason: "policy" });
    }
    return { kind: "custom-policy", selection, questions: policy.questions, timeoutMs };
  }
  const questions = document.value.permissions?.questions;
  if (questions === void 0) return { kind: "shipped-policy", selection, timeoutMs };
  return { kind: "custom-policy", selection, questions, timeoutMs };
}, catchTag3("ConfigFileError", (error) => succeed6({ kind: "invalid", message: invalidMessage(error.reason) })));

// src/claude/control.ts
var operation = process.argv[2];
var run2 = Effect_exports.gen(function* () {
  const control = yield* createReviewControl(globalJevvyConfigPath());
  return yield* operation === "toggle" ? control.change("claude") : control.read("claude");
}).pipe(Effect_exports.provide(Layer_exports.merge(layer3, layer5)));
try {
  process.stdout.write(JSON.stringify(await Effect_exports.runPromise(run2)));
} catch {
  process.stderr.write("Jevvy could not read or update its global configuration. Check that it is writable and try again.");
  process.exitCode = 1;
}
