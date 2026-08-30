// Best-effort alignment: real word_tags <-> KJV English words.
//
// word_tags are in Greek/Hebrew word order with a modern (BSB-based) gloss,
// not KJV order or wording — so this is a heuristic match, not a guarantee.
// It's used only to make individual KJV words clickable; the Interlinear
// tab always shows the real, unaligned data as ground truth regardless of
// how well this matching works.

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'of', 'to', 'in', 'on', 'and', 'but', 'or', 'that', 'this',
  'is', 'are', 'was', 'were', 'be', 'he', 'she', 'it', 'they', 'them', 'him',
  'his', 'her', 'their', 'my', 'thy', 'thou', 'thee', 'unto', 'for', 'with',
  'not', 'i', 'you', 'we', 'which', 'who', 'whom', 'all', 'no', 'so', 'if',
  'as', 'by', 'at', 'from', 'into', 'upon', 'shall', 'will', 'have', 'hath',
]);

function wordForms(word) {
  word = word.toLowerCase().replace(/[^a-z']/g, '');
  const forms = new Set([word]);
  for (const suf of ['ing', 'edst', 'edest', 'eth', 'est', 'ed', 'es', 's']) {
    if (word.endsWith(suf) && word.length - suf.length >= 3) {
      forms.add(word.slice(0, word.length - suf.length));
    }
  }
  return forms;
}

function formsOverlap(a, b) {
  for (const x of a) if (b.has(x)) return true;
  return false;
}

function glossKeys(gloss) {
  const tokens = (gloss || '').toLowerCase().match(/[a-z']+/g) || [];
  return tokens.filter((t) => !STOP_WORDS.has(t) && t.length > 1);
}

export function alignWordTagsToWords(textWords, wordTags) {
  const alignment = {}; // wordIndex -> tag
  const used = new Set();
  let lastMatched = -1;

  for (const tag of wordTags) {
    const keys = glossKeys(tag.gloss);
    if (keys.length === 0) continue;
    let matchIdx = null;

    for (const key of keys) {
      const keyForms = wordForms(key);
      // Prefer the next unused match at or after the last one, to keep
      // rough left-to-right ordering.
      for (let i = lastMatched + 1; i < textWords.length; i++) {
        if (!used.has(i) && formsOverlap(wordForms(textWords[i]), keyForms)) {
          matchIdx = i;
          break;
        }
      }
      if (matchIdx !== null) break;
      // Fall back to any unused occurrence anywhere in the verse.
      for (let i = 0; i < textWords.length; i++) {
        if (!used.has(i) && formsOverlap(wordForms(textWords[i]), keyForms)) {
          matchIdx = i;
          break;
        }
      }
      if (matchIdx !== null) break;
    }

    if (matchIdx !== null) {
      alignment[matchIdx] = tag;
      used.add(matchIdx);
      lastMatched = matchIdx;
    }
  }
  return alignment;
}

/**
 * Tokenizes a verse's text into { text, isWord, tag? } tokens so a
 * component can render each word as a plain string or a clickable span.
 */
export function tokenizeVerse(verse) {
  const text = verse.text;
  const tokenRe = /[A-Za-z']+|[^A-Za-z']+/g;
  const wordTokens = text.match(/[A-Za-z']+/g) || [];
  const alignment = alignWordTagsToWords(wordTokens, verse.word_tags || []);

  let wordIndex = -1;
  const tokens = [];
  let m;
  while ((m = tokenRe.exec(text)) !== null) {
    const token = m[0];
    if (/^[A-Za-z']+$/.test(token)) {
      wordIndex++;
      const tag = alignment[wordIndex];
      tokens.push({ text: token, isWord: true, tag: tag || null });
    } else {
      tokens.push({ text: token, isWord: false, tag: null });
    }
  }
  return tokens;
}
