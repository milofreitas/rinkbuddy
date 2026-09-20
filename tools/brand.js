'use strict';

const HEX = /(?<![&\w])#[0-9a-fA-F]{3}(?:[0-9a-fA-F]{3})?\b/g;
const RGBA = /\brgba?\([^)]*\)/g;
const GRADIENT = /(?:linear|radial|conic)-gradient\((?:[^()]|\([^()]*\))*\)/g;

function srgbToLinear(channel) {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(hex) {
  const m = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(String(hex).trim());
  if (!m) throw new Error(`not a hex colour: ${hex}`);
  const full = m[1].length === 3 ? m[1].split('').map(c => c + c).join('') : m[1];
  const n = parseInt(full, 16);
  const r = srgbToLinear((n >> 16) & 255);
  const g = srgbToLinear((n >> 8) & 255);
  const b = srgbToLinear(n & 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(a, b) {
  const la = luminance(a);
  const lb = luminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function blockAfter(html, selector) {
  const regex = new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*\\{');
  const match = regex.exec(html);
  if (!match) return '';
  const open = match.index + match[0].length - 1;
  const close = html.indexOf('}', open);
  if (close === -1) return '';
  return html.slice(open + 1, close);
}

function parseTokens(block) {
  const out = {};
  for (const m of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    out[m[1].trim()] = m[2].trim();
  }
  return out;
}

function parseThemes(html) {
  return {
    light: parseTokens(blockAfter(html, ':root')),
    dark: parseTokens(blockAfter(html, ':root[data-theme="dark"]')),
  };
}

function stripTokenBlocks(html) {
  let out = html;
  for (const selector of [':root', ':root[data-theme="dark"]']) {
    const block = blockAfter(out, selector);
    if (block) out = out.replace(block, '');
  }
  return out;
}

function colourLiterals(html, allowlist = []) {
  const allowed = new Set(allowlist.map(a => a.toLowerCase()));
  const body = stripTokenBlocks(html);
  const found = [...(body.match(HEX) || []), ...(body.match(RGBA) || [])];
  return found.filter(v => !allowed.has(v.toLowerCase()));
}

function colourGradients(html) {
  return (html.match(GRADIENT) || []).filter(g => /var\(--|#[0-9a-fA-F]{3,6}\b/.test(g));
}

function pngInfo(buffer) {
  if (buffer.length < 26 || buffer.readUInt32BE(0) !== 0x89504e47) {
    throw new Error('not a PNG');
  }
  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
    bitDepth: buffer[24],
    colourType: buffer[25],
    hasAlpha: buffer[25] === 4 || buffer[25] === 6,
  };
}

module.exports = {
  luminance, contrastRatio, parseThemes, colourLiterals, colourGradients, pngInfo,
};
