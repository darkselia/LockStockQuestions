#!/usr/bin/env node
/* CSV-to-JSON converter for LockStockQuestions data.
*/

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function normalizeText(value) {
  if (value === undefined || value === null) return null;
  const stripped = String(value).trim();
  return stripped === '' ? null : stripped;
}

function parseIntSafe(value) {
  const normalized = normalizeText(value);
  if (normalized === null) return null;
  const n = Number.parseInt(normalized, 10);
  return Number.isNaN(n) ? null : n;
}

function parseAnswer(value) {
  const normalized = normalizeText(value);
  if (normalized === null) return null;
  const n = Number.parseInt(normalized, 10);
  return Number.isNaN(n) ? normalized : n;
}

// Генератор, который парсит CSV и отдаёт по одной записи (array of fields)
function* parseCSVGenerator(text, delimiter = ';') {
  if (!text) return;

  // Remove UTF-8 BOM if present
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  let field = '';
  let record = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === delimiter) {
        record.push(field);
        field = '';
      } else if (ch === '\r') {
        // ignore, handled on \n
      } else if (ch === '\n') {
        record.push(field);
        yield record;
        record = [];
        field = '';
      } else {
        field += ch;
      }
    }
  }

  // last record
  if (inQuotes) {
    // tolerant close
    inQuotes = false;
  }
  if (field !== '' || record.length > 0) {
    record.push(field);
    yield record;
  }
}

function buildQuestionObjectFromRow(header, rec) {
  const obj = {};
  for (let j = 0; j < header.length; j++) {
    const key = header[j] || ('col' + j);
    const val = rec[j] === undefined ? '' : rec[j];
    obj[key] = val;
  }
  return obj;
}

function usageAndExit() {
  console.error('Usage: node scripts/convert_questions.js [<csv_path> [<json_path> [<delimiter>]]]');
  process.exit(2);
}

async function main() {
  const argv = process.argv.slice(2);

  const csvArg = argv[0] || 'data/questions.csv';
  const jsonArg = argv[1] || 'data/questions.json';
  const delimiter = argv[2] || ';';

  const csvPath = path.resolve(process.cwd(), csvArg);
  const jsonPath = path.resolve(process.cwd(), jsonArg);

  let text;
  try {
    text = await fs.promises.readFile(csvPath, { encoding: 'utf8' });
  } catch (err) {
    console.error('Failed to read CSV:', err.message);
    process.exit(1);
  }

  const grouped = {};
  let header = null;
  let rowIndex = 0;

  try {
    for (const rec of parseCSVGenerator(text, delimiter)) {
      if (rowIndex === 0) {
        header = rec.map((h) => (h === undefined || h === null ? '' : String(h).trim()));
        // Validate minimal header presence
        if (!header.includes('video-id') || !header.includes('question-id')) {
          console.warn('Warning: header does not include video-id or question-id. Continuing but results may be invalid.');
        }
      } else {
        const row = buildQuestionObjectFromRow(header, rec);
        const values = Object.values(row);
        if (!values.some((v) => String(v || '').trim() !== '')) {
          rowIndex++;
          continue; // empty row
        }

        const videoId = parseIntSafe(row['video-id']);
        const questionId = parseIntSafe(row['question-id']);
        if (videoId === null || questionId === null) {
          throw new Error('Row ' + rowIndex + ' is missing required numeric identifiers: ' + JSON.stringify(row));
        }

        const questionRecord = {
          'question-id': questionId,
          question: (row['question'] || '').trim(),
          hint1: normalizeText(row['hint1']),
          hint2: normalizeText(row['hint2']),
          answer: parseAnswer(row['answer']),
          'answer-comm': normalizeText(row['answer-comm']),
        };

        if (!grouped[videoId]) grouped[videoId] = [];
        grouped[videoId].push(questionRecord);
      }
      rowIndex++;
    }
  } catch (err) {
    console.error('Failed to process CSV:', err.message);
    process.exit(1);
  }

  try {
    await fs.promises.mkdir(path.dirname(jsonPath), { recursive: true });
    await fs.promises.writeFile(jsonPath, JSON.stringify(grouped, null, 2), { encoding: 'utf8' });
    console.log('Written', jsonPath);
  } catch (err) {
    console.error('Failed to write JSON:', err.message);
    process.exit(1);
  }
}

// ESM-safe entrypoint detection
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  main();
}
