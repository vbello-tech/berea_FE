<script setup>
import { useAppStore } from '../stores/app';
import VerseAccordion from './VerseAccordion.vue';

const store = useAppStore();

// word_tags is the ONLY interlinear data source, and it's identical no
// matter which Bible translation the user has open -- the API
// (VerseSerializer.get_word_tags) always sources it from STEPBible's
// original-language tagging via the matching BSB verse, with no
// per-translation filtering. Switching translations in the reader does
// not change what shows here.
//
// A word tagged with a compound Strong's field (e.g. "H0853/H01254" --
// an untranslated object marker folded onto the nearest content word,
// see Gen.1.1#03) arrives from the API as one object with
// strongs_number as a list (see serializers.py's
// _group_tags_by_position), so no client-side merging/deduping is
// needed here.
//
// NOTE: word_tags always follows ORIGINAL Hebrew/Greek word order, never
// any translation's English reading order -- this is true for every
// translation now, including KJV.
function tagsForVerse(v) {
  return (v.word_tags || []).map((t) => ({
    uid: `w-${t.position}`,
    position: t.position,
    mainWord: t.original_word,
    transliteration: t.transliteration,
    gloss: t.gloss,
    strongsNumbers: t.strongs_number, // array, e.g. ["H0853", "H1254"]
    morphology: t.morphology,
  }));
}

// --- was ---
// function tagsForVerse(v) {
//   if (v.translation === 'KJV' && (v.kjv_strongs_tags || []).length > 0) {
//     return v.kjv_strongs_tags.map((t) => {
//       const hasOriginal = !!t.original_word;
//       return {
//         uid: `k-${t.position}`,
//         position: t.position,
//         mainWord: hasOriginal ? t.original_word : t.surface_word,
//         transliteration: t.transliteration,
//         gloss: hasOriginal ? t.surface_word : '',
//         strongsNumbers: t.strongs_number,
//         morphology: t.morphology,
//         isOriginal: hasOriginal,
//       };
//     });
//   }
//   return (v.word_tags || []).map((t) => ({
//     uid: `w-${t.position}`,
//     position: t.position,
//     mainWord: t.original_word,
//     transliteration: t.transliteration,
//     gloss: t.gloss,
//     strongsNumbers: t.strongs_number,
//     morphology: t.morphology,
//     isOriginal: true,
//   }));
// }

function isActiveRow(verseNumber, position) {
  if (!store.activeWord) return false;
  return (
    store.activeWord.verseNumber === String(verseNumber) &&
    store.activeWord.position === String(position)
  );
}

function onRowClick(event, verseNumber, tag) {
  store.setActiveWord(verseNumber, tag.position);
  store.openPopover(tag.strongsNumbers[0]);
}

function onBadgeClick(event, verseNumber, tag, strongsNumber) {
  event.stopPropagation();
  store.setActiveWord(verseNumber, tag.position);
  store.openPopover(strongsNumber);
}
</script>

<template>
  <div class="tab-content">
    <div v-if="store.interlinearCount === 0" class="interlinear-note">
      {{
        store.verses.length === 0
          ? 'Load a passage to see the real Greek/Hebrew word-by-word tagging.'
          : 'No word-by-word tagging available for this passage yet.'
      }}
    </div>
    <div v-else class="interlinear-note">
      Real word-by-word tagging of the original Greek/Hebrew, in original word order (not English word order).
      This stays the same no matter which translation you're reading.
      Click a verse to reveal its words, then click any word for its full lexicon entry.
    </div>

    <div class="interlinear-list">
      <template v-for="v in store.verses" :key="v.verse_number">
        <VerseAccordion v-if="tagsForVerse(v).length > 0" :verse-number="v.verse_number">
          <div
            v-for="t in tagsForVerse(v)"
            :key="t.uid"
            class="interlinear-row"
            :class="{ active: isActiveRow(v.verse_number, t.position) }"
            @click="onRowClick($event, v.verse_number, t)"
          >
            <span class="interlinear-pos">{{ t.position }}</span>
            <span class="interlinear-original">{{ t.mainWord }}</span>
            <span class="interlinear-translit">{{ t.transliteration }}</span>
            <span class="interlinear-gloss">{{ t.gloss }}</span>
            <span class="strongs-badges">
              <span
                v-for="s in t.strongsNumbers"
                :key="s"
                class="strongs-badge"
                @click="onBadgeClick($event, v.verse_number, t, s)"
              >{{ s }}</span>
            </span>
            <span class="interlinear-morph">{{ t.morphology }}</span>
          </div>
        </VerseAccordion>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
}

.interlinear-note {
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 8px 2px 12px;
  line-height: 1.4;
}

.interlinear-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.interlinear-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}

.interlinear-row:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.interlinear-row.active {
  background-color: rgba(201, 162, 77, 0.1);
  border-color: var(--accent-primary);
}

.interlinear-pos {
  font-size: 0.65rem;
  color: var(--text-muted);
  width: 18px;
  flex-shrink: 0;
}

.interlinear-original {
  font-family: 'Lora', serif;
  color: var(--accent-primary);
  font-size: 1rem;
  min-width: 70px;
}

/* --- was: KJV surface-word rows showed plain English, needing a
   non-serif style variant (.is-surface). mainWord is always the
   original-language script now, for every translation, so this variant
   is no longer used. Left in case a future surface-word display mode is
   reintroduced. ---
.interlinear-original.is-surface {
  font-family: var(--font-ui);
  font-weight: 600;
}
*/

.interlinear-translit {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
  min-width: 70px;
}

.interlinear-gloss {
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex: 1;
}

.interlinear-morph {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-family: monospace;
}

.strongs-badges {
  display: flex;
  gap: 4px;
}

.strongs-badge {
  font-family: monospace;
  background-color: rgba(201, 162, 77, 0.1);
  color: var(--accent-primary);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}
</style>


