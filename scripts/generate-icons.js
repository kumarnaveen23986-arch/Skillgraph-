import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = data.length;
  const chunk = Buffer.alloc(12 + len);
  chunk.writeUInt32BE(len, 0);
  typeBuf.copy(chunk, 4);
  data.copy(chunk, 8);
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcInput);
  chunk.writeUInt32BE(crcVal, 8 + len);
  return chunk;
}

function generatePNG(width, height, isMaskable = false) {
  // 8-byte PNG signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // 8 bits per channel
  ihdrData[9] = 6; // Color type 6: RGBA
  ihdrData[10] = 0; // Compression deflate
  ihdrData[11] = 0; // Filter
  ihdrData[12] = 0; // Non-interlaced
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw image data with 1 filter byte per scanline
  const bytesPerRow = 1 + width * 4;
  const rawData = Buffer.alloc(height * bytesPerRow);

  const cx = width / 2;
  const cy = height / 2;
  const radius = isMaskable ? width * 0.36 : width * 0.44;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * bytesPerRow;
    rawData[rowOffset] = 0; // Filter 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient: dark indigo-slate #090d16 to #030712
      const gradT = (x + y) / (width + height);
      let r = Math.round(9 + (15 - 9) * gradT);
      let g = Math.round(13 + (23 - 13) * gradT);
      let b = Math.round(22 + (42 - 22) * gradT);
      let a = 255;

      // Draw rounded emblem badge or circle
      if (dist < radius) {
        // Deep Indigo/Cyan core badge
        const badgeGrad = (y - (cy - radius)) / (2 * radius);
        r = Math.round(79 + (6 - 79) * badgeGrad);
        g = Math.round(70 + (182 - 70) * badgeGrad);
        b = Math.round(229 + (212 - 229) * badgeGrad);

        // Inner graph / code diamond shape
        const manhattan = Math.abs(dx) + Math.abs(dy);
        const diamondSize = radius * 0.65;
        if (manhattan < diamondSize) {
          // Glow center
          r = Math.min(255, r + 70);
          g = Math.min(255, g + 80);
          b = Math.min(255, b + 60);

          // Central node dots (Skill nodes)
          const isNode1 = Math.sqrt((dx + radius * 0.22)**2 + dy**2) < radius * 0.14;
          const isNode2 = Math.sqrt((dx - radius * 0.22)**2 + dy**2) < radius * 0.14;
          const isNode3 = Math.sqrt(dx**2 + (dy - radius * 0.22)**2) < radius * 0.14;
          const isNode4 = Math.sqrt(dx**2 + (dy + radius * 0.22)**2) < radius * 0.14;

          if (isNode1 || isNode2 || isNode3 || isNode4) {
            r = 255;
            g = 255;
            b = 255;
          }
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate Icons
console.log('Generating PWA icons...');
const icon192 = generatePNG(192, 192, false);
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), icon192);

const icon512 = generatePNG(512, 512, false);
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), icon512);

const iconMaskable = generatePNG(512, 512, true);
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), iconMaskable);

const appleTouch = generatePNG(180, 180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouch);

console.log('All icons generated successfully!');
