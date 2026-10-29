You are given a list of distinct words. A word is called buildable when every strict prefix of it (dropping one or more trailing letters) also appears in the list; single-letter words are buildable by default.

Among all buildable words, pick the longest. When several share that length, pick the alphabetically smallest. Return an empty string when nothing is buildable.

**Constraints:**
- `1 <= words.length <= 1000`
- `1 <= words[i].length <= 30`
- All words are distinct lowercase English strings.
