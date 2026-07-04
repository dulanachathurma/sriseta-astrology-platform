// Vercel Serverless Function: GET /api/weekly-horoscope
//
// Scrapes the latest weekly horoscope ("සතියේ ලග්න පලාපල") article from Divaina
// and returns clean, structured JSON per zodiac sign. No horoscope text is
// ever hardcoded here — everything is extracted live from the source page.

import axios from 'axios';
import * as cheerio from 'cheerio';

const SOURCE_URL = process.env.HOROSCOPE_SOURCE_URL || 'https://www.divaina.lk/nakatha/84589';
const CACHE_SECONDS = Number(process.env.HOROSCOPE_CACHE_SECONDS || 3600);

const RASHI_NAMES = [
  'මේෂ', 'වෘෂභ', 'මිථුන', 'කටක', 'සිංහ', 'කන්‍යා',
  'තුලා', 'වෘශ්චික', 'ධනු', 'මකර', 'කුම්භ', 'මීන',
];

// Simple in-memory cache that persists for the lifetime of a warm Lambda
// container. Combined with the Cache-Control header set in vercel.json this
// keeps re-scraping to a minimum without needing an external data store.
let cache = { data: null, fetchedAt: 0 };

function isNoise(text) {
  const t = text.trim();
  if (!t) return true;
  if (t.length < 4) return true;
  const noisePatterns = [
    /advertisement/i,
    /සම්බන්ධ ලිපි/,
    /අදාළ ලිපි/,
    /Copyright/i,
    /^Share/i,
    /^Tags?:/i,
  ];
  return noisePatterns.some((re) => re.test(t));
}

function extractArticleText($) {
  // Try a series of increasingly generic selectors — news CMS templates vary
  // and Divaina may change markup, so we degrade gracefully.
  const candidates = [
    'article .entry-content',
    'article .td-post-content',
    '.td-post-content',
    'article',
    '.entry-content',
    'main',
  ];

  for (const selector of candidates) {
    const node = $(selector).first();
    if (node.length) {
      const paragraphs = [];
      node.find('p, h2, h3, li').each((_, el) => {
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        if (text && !isNoise(text)) paragraphs.push(text);
      });
      if (paragraphs.length > 0) return paragraphs;
    }
  }
  return [];
}

// Matches a rashi name at (or very near) the start of a paragraph, tolerating
// a leading bullet/number/quote character and the common "රාශිය"/"ලග්නය"
// suffix some articles append to the heading itself (e.g. "මේෂ රාශිය :").
function matchLeadingRashi(text) {
  const cleaned = text.replace(/^["'“”\-–•▶►\d.)\s]+/, '');
  return RASHI_NAMES.find((name) => {
    if (!cleaned.startsWith(name)) return false;
    const after = cleaned.slice(name.length, name.length + 8);
    // Reject accidental substring matches inside an unrelated longer word.
    return after === '' || /^[\s:：\-–.,)＊*රාශිලග්නය]/.test(after);
  });
}

function groupByRashi(paragraphs) {
  const items = [];
  let current = null;

  for (const raw of paragraphs) {
    const para = raw.replace(/^["'“”\-–•▶►\d.)\s]+/, '');
    const matchedName = matchLeadingRashi(para);
    if (matchedName) {
      if (current) items.push(current);
      const rest = para
        .slice(para.indexOf(matchedName) + matchedName.length)
        .replace(/^[\s:：\-–.,)＊*රාශිලග්නය]+/, '')
        .trim();
      current = { sign: matchedName, text: rest };
    } else if (current) {
      current.text = current.text ? `${current.text} ${para}` : para;
    }
  }
  if (current) items.push(current);

  // Deduplicate by sign, keep the longest text for each.
  const bySign = new Map();
  for (const item of items) {
    if (!item.text) continue;
    const existing = bySign.get(item.sign);
    if (!existing || item.text.length > existing.text.length) bySign.set(item.sign, item);
  }

  return RASHI_NAMES.map((name) => bySign.get(name)).filter(Boolean);
}

function extractLastUpdated($) {
  const metaTime =
    $('meta[property="article:modified_time"]').attr('content') ||
    $('meta[property="article:published_time"]').attr('content');
  if (metaTime) return metaTime;

  const timeTag = $('time').first();
  if (timeTag.length) return timeTag.attr('datetime') || timeTag.text().trim();

  return null;
}

async function scrapeHoroscope() {
  const { data: html } = await axios.get(SOURCE_URL, {
    timeout: 10000,
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept-Language': 'si,en;q=0.8',
    },
  });

  const $ = cheerio.load(html);
  const paragraphs = extractArticleText($);
  const items = groupByRashi(paragraphs);
  const lastUpdated = extractLastUpdated($);
  const title = $('h1').first().text().trim() || $('title').text().trim();

  return {
    success: items.length > 0,
    title: title || null,
    sourceUrl: SOURCE_URL,
    lastUpdated,
    items,
    scrapedAt: new Date().toISOString(),
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  const now = Date.now();
  const isFresh = cache.data && now - cache.fetchedAt < CACHE_SECONDS * 1000;

  if (isFresh) {
    res.setHeader('X-Cache', 'HIT');
    res.status(200).json(cache.data);
    return;
  }

  try {
    const result = await scrapeHoroscope();

    if (!result.success) {
      // Scrape ran but nothing matched our rashi-grouping heuristic — surface
      // this clearly to the client instead of silently returning empty data.
      res.setHeader('X-Cache', 'MISS');
      res.status(200).json({
        ...result,
        error: 'Could not extract structured horoscope content from the source page.',
      });
      return;
    }

    cache = { data: result, fetchedAt: now };
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('Cache-Control', `s-maxage=${CACHE_SECONDS}, stale-while-revalidate=1800`);
    res.status(200).json(result);
  } catch (err) {
    // If we have stale cached data, prefer serving that over a hard failure.
    if (cache.data) {
      res.setHeader('X-Cache', 'STALE');
      res.status(200).json({ ...cache.data, stale: true });
      return;
    }
    res.status(502).json({
      success: false,
      error: 'Failed to fetch the weekly horoscope source.',
      detail: err.message,
    });
  }
}