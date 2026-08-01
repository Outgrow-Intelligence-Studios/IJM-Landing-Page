#!/usr/bin/env node
/**
 * Image Optimization Script for IJM Landing Page
 * Converts JPG/PNG → WebP (80-90% quality), compresses in place.
 * Keeps originals as fallbacks where needed.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Resolve public folder from project root (one level up from scripts/)
const PUBLIC = path.join(__dirname, '..', 'public');

// ─── CONFIG ────────────────────────────────────────────────────────────────────
const QUALITY_MAP = {
  hero:      { webp: 85, jpg: 80 },
  gallery:   { webp: 82, jpg: 78 },
  amenities: { webp: 82, jpg: 78 },
  renders:   { webp: 80, jpg: 75 },
  interiors: { webp: 82, jpg: 78 },
  corporate: { webp: 80, jpg: 75 },
  logos:     { webp: 90, png: 9  },
  floorplan: { webp: 85, png: 9  },
  testimonials: { webp: 88, jpg: 83 },
  map:       { webp: 80, png: 9  },
};

// Images to process: [inputPath, outputWebP, quality, maxWidth?]
const TASKS = [
  // ── HERO ──────────────────────────────────────────────────────────────────
  ['images/hero_sec_bg.png',    'images/hero_sec_bg.webp',    QUALITY_MAP.hero.webp,     1920],
  ['images/hero-img-d.png',     'images/hero-img-d.webp',     QUALITY_MAP.hero.webp,     1920],
  ['images/hero-img-m.png',     'images/hero-img-m.webp',     QUALITY_MAP.hero.webp,     828 ],

  // ── GALLERY ───────────────────────────────────────────────────────────────
  ['images/gallery/gallery1.jpg', 'images/gallery/gallery1.webp', QUALITY_MAP.gallery.webp, 1200],
  ['images/gallery/gallery2.jpg', 'images/gallery/gallery2.webp', QUALITY_MAP.gallery.webp, 1200],
  ['images/gallery/gallery3.jpg', 'images/gallery/gallery3.webp', QUALITY_MAP.gallery.webp, 1200],
  ['images/gallery/gallery4.jpg', 'images/gallery/gallery4.webp', QUALITY_MAP.gallery.webp, 1200],
  ['images/gallery/gallery5.jpg', 'images/gallery/gallery5.webp', QUALITY_MAP.gallery.webp, 1200],
  ['images/gallery/gallery6.jpg', 'images/gallery/gallery6.webp', QUALITY_MAP.gallery.webp, 1200],

  // ── AMENITIES ─────────────────────────────────────────────────────────────
  ['images/amenities/swimming_pool.jpg', 'images/amenities/swimming_pool.webp', QUALITY_MAP.amenities.webp, 1200],
  ['images/amenities/gymnasium.jpg',     'images/amenities/gymnasium.webp',     QUALITY_MAP.amenities.webp, 900 ],
  ['images/amenities/sauna.png',         'images/amenities/sauna.webp',         QUALITY_MAP.amenities.webp, 900 ],
  ['images/amenities/steam_room.png',    'images/amenities/steam_room.webp',    QUALITY_MAP.amenities.webp, 900 ],
  ['images/amenities/spa.png',           'images/amenities/spa.webp',           QUALITY_MAP.amenities.webp, 900 ],
  ['images/amenities/jacuzzi.jpg',       'images/amenities/jacuzzi.webp',       QUALITY_MAP.amenities.webp, 900 ],
  ['images/amenities/squash.png',        'images/amenities/squash.webp',        QUALITY_MAP.amenities.webp, 900 ],
  ['images/amenities/multisport.jpg',    'images/amenities/multisport.webp',    QUALITY_MAP.amenities.webp, 900 ],
  ['images/amenities/cricket.jpg',       'images/amenities/cricket.webp',       QUALITY_MAP.amenities.webp, 900 ],

  // ── 3000px RENDERS ────────────────────────────────────────────────────────
  ['renders/3000/ijm-harmony-aerial-opt-3k.jpg',             'renders/3000/ijm-harmony-aerial-opt-3k.webp',             QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-aerial-shot-3k.jpg',            'renders/3000/ijm-harmony-aerial-shot-3k.webp',            QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-water-fountain-3k.jpg',         'renders/3000/ijm-harmony-water-fountain-3k.webp',         QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-peace-park.jpg',                'renders/3000/ijm-harmony-peace-park.webp',                QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-walking-park.jpg',              'renders/3000/ijm-harmony-walking-park.webp',              QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-elevation-block-1-3k.jpg',      'renders/3000/ijm-harmony-elevation-block-1-3k.webp',      QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-entrace-shot-3k.jpg',                   'renders/3000/ijm-entrace-shot-3k.webp',                   QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-elevation-shot-3k.jpg',         'renders/3000/ijm-harmony-elevation-shot-3k.webp',         QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-back-side-elevation3k.jpg',     'renders/3000/ijm-harmony-back-side-elevation3k.webp',     QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-ramp-to-two-elevation-3k.jpg',  'renders/3000/ijm-harmony-ramp-to-two-elevation-3k.webp',  QUALITY_MAP.renders.webp, 1600],
  ['renders/3000/ijm-harmony-evening-to-ni8.jpg',            'renders/3000/ijm-harmony-evening-to-ni8.webp',            QUALITY_MAP.renders.webp, 1600],

  // ── LANDSCAPE RENDERS ─────────────────────────────────────────────────────
  ['renders/landscape/ijm-harmony-child-playarea.jpg',     'renders/landscape/ijm-harmony-child-playarea.webp',     QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-cricket-pitch.jpg',      'renders/landscape/ijm-harmony-cricket-pitch.webp',      QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-miyawaki-mini-shot.jpg', 'renders/landscape/ijm-harmony-miyawaki-mini-shot.webp', QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-multi-sport-court.jpg',  'renders/landscape/ijm-harmony-multi-sport-court.webp',  QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-multi-sport-lawn.jpg',   'renders/landscape/ijm-harmony-multi-sport-lawn.webp',   QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-outdoor-gym.jpg',        'renders/landscape/ijm-harmony-outdoor-gym.webp',        QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-out-door-library.jpg',   'renders/landscape/ijm-harmony-out-door-library.webp',   QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-peace-park.jpg',         'renders/landscape/ijm-harmony-peace-park.webp',         QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-top-angle-shot.jpg',     'renders/landscape/ijm-harmony-top-angle-shot.webp',     QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/ijm-harmony-walking-park.jpg',       'renders/landscape/ijm-harmony-walking-park.webp',       QUALITY_MAP.renders.webp, 1200],
  ['renders/landscape/cijm-harmony-chit-chat-park.jpg',    'renders/landscape/cijm-harmony-chit-chat-park.webp',    QUALITY_MAP.renders.webp, 1200],

  // ── INTERIORS ─────────────────────────────────────────────────────────────
  ['renders/interiors/IJM_Balcony_3K.jpg',  'renders/interiors/IJM_Balcony_3K.webp',  QUALITY_MAP.interiors.webp, 1600],
  ['renders/interiors/IJM_Bedroom_3K.jpg',  'renders/interiors/IJM_Bedroom_3K.webp',  QUALITY_MAP.interiors.webp, 1600],
  ['renders/interiors/dining-area.jpg',     'renders/interiors/dining-area.webp',     QUALITY_MAP.interiors.webp, 1600],

  // ── FLOOR PLANS ───────────────────────────────────────────────────────────
  ['images/Typical-Floor-Plan-v2.png', 'images/Typical-Floor-Plan-v2.webp', QUALITY_MAP.floorplan.webp, 1200],
  ['images/Floor-Plan-v2.png',         'images/Floor-Plan-v2.webp',         QUALITY_MAP.floorplan.webp, 1200],
  ['images/3bhk-Floor-Plan-v2.png',    'images/3bhk-Floor-Plan-v2.webp',    QUALITY_MAP.floorplan.webp, 1200],

  // ── CORPORATE / AWARDS ────────────────────────────────────────────────────
  ['images/corporate/limca_records.jpg',       'images/corporate/limca_records.webp',       QUALITY_MAP.corporate.webp, 600],
  ['images/corporate/mission_img.jpg',         'images/corporate/mission_img.webp',         QUALITY_MAP.corporate.webp, 600],
  ['images/corporate/morth_appreciation.jpg',  'images/corporate/morth_appreciation.webp',  QUALITY_MAP.corporate.webp, 600],
  ['images/corporate/service_52.jpg',          'images/corporate/service_52.webp',          QUALITY_MAP.corporate.webp, 600],
  ['images/corporate/service_53.jpg',          'images/corporate/service_53.webp',          QUALITY_MAP.corporate.webp, 600],
  ['images/corporate/service_54.jpg',          'images/corporate/service_54.webp',          QUALITY_MAP.corporate.webp, 600],
  ['images/corporate/vision_img.jpg',          'images/corporate/vision_img.webp',          QUALITY_MAP.corporate.webp, 600],

  // ── TESTIMONIALS ──────────────────────────────────────────────────────────
  ['images/testimonials/nagdeve.png',  'images/testimonials/nagdeve.webp',  QUALITY_MAP.testimonials.webp, 400],
  ['images/testimonials/kaner.png',    'images/testimonials/kaner.webp',    QUALITY_MAP.testimonials.webp, 400],
  ['images/testimonials/gadkari.png',  'images/testimonials/gadkari.webp',  QUALITY_MAP.testimonials.webp, 400],
  ['images/testimonials/singh.png',    'images/testimonials/singh.webp',    QUALITY_MAP.testimonials.webp, 400],

  // ── MAP ───────────────────────────────────────────────────────────────────
  ['images/map.png', 'images/map.webp', QUALITY_MAP.map.webp, 1200],

  // ── LOGOS ─────────────────────────────────────────────────────────────────
  ['images/footer-logo.png',        'images/footer-logo.webp',        QUALITY_MAP.logos.webp, 200],
  ['images/corporate/logo.png',     'images/corporate/logo.webp',     QUALITY_MAP.logos.webp, 200],
  ['images/corporate/logo_nav.png', 'images/corporate/logo_nav.webp', QUALITY_MAP.logos.webp, 200],
];

async function processImage(inputRel, outputRel, quality, maxWidth) {
  const inputPath  = path.join(PUBLIC, inputRel);
  const outputPath = path.join(PUBLIC, outputRel);

  if (!fs.existsSync(inputPath)) {
    console.warn(`  ⚠  SKIP (missing): ${inputRel}`);
    return { skipped: true };
  }

  const before = fs.statSync(inputPath).size;

  let pipeline = sharp(inputPath, { failOnError: false });
  if (maxWidth) {
    const meta = await pipeline.metadata();
    if (meta.width > maxWidth) {
      pipeline = pipeline.resize({ width: maxWidth, withoutEnlargement: true });
    }
  }

  await pipeline.webp({ quality, effort: 6 }).toFile(outputPath);

  const after = fs.statSync(outputPath).size;
  const saving = (((before - after) / before) * 100).toFixed(1);
  console.log(`  ✓  ${outputRel.padEnd(65)} ${(before/1024).toFixed(0).padStart(6)}KB → ${(after/1024).toFixed(0).padStart(5)}KB  (-${saving}%)`);
  return { before, after };
}

(async () => {
  console.log('\n🔧  IJM Image Optimization — Converting to WebP\n');
  let totalBefore = 0, totalAfter = 0, done = 0, skipped = 0;

  for (const [inp, out, q, w] of TASKS) {
    try {
      const res = await processImage(inp, out, q, w);
      if (res.skipped) { skipped++; continue; }
      totalBefore += res.before;
      totalAfter  += res.after;
      done++;
    } catch (e) {
      console.error(`  ✗  ERROR ${inp}: ${e.message}`);
      skipped++;
    }
  }

  console.log(`\n✅  Done — ${done} converted, ${skipped} skipped`);
  console.log(`   Total saved: ${((totalBefore - totalAfter)/1024/1024).toFixed(2)} MB`);
  console.log(`   Before: ${(totalBefore/1024/1024).toFixed(2)} MB  →  After: ${(totalAfter/1024/1024).toFixed(2)} MB\n`);
})();
