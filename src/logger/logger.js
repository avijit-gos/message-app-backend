/**
 * eslint-disable no-undef
 *
 * @format
 */

/** @format */

const { Writable } = require("node:stream");
const fs = require("node:fs");

class Logger extends Writable {
  constructor() {
    super();
    this.highWaterMark = 1600;
    this.filename = "error-logger.txt";
    this.fd = null;
    this.chunks = [];
    this.chunkSize = 0;
  }
  _construct(callback) {
    fs.open(this.filename, "a", (err, fd) => {
      if (err) callback(err);
      this.fd = fd;
      callback();
    });
  }
  _write(chunk, encoding, callback) {
    this.chunks.push(chunk);
    this.chunkSize += chunk.length;
    if (this.chunkSize > this.highWaterMark) {
      // eslint-disable-next-line no-undef
      fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
        if (err) callback(err);
        this.chunks = [];
        this.chunkSize = [];
      });
    } else {
      callback();
    }
  }

  _final(callback) {
    console.log(this.fd);
    // eslint-disable-next-line no-undef
    fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
      if (err) callback(err);
      this.chunks = [];
      this.chunkSize = [];
    });
  }

  _destroy(error, callback) {
    if (error) callback(error);
    fs.close(this.fd, (err) => {
      callback(err);
    });
  }
}

module.exports = Logger;
