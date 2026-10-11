You are given a dictionary `words` where each entry is a lowercase word. For one query you also receive a prefix string `pref` and a suffix string `suff`.

Find the largest index `i` such that `words[i]` starts with `pref` and ends with `suff`. If no dictionary word satisfies both ends, return `-1`.

Adaptation for this judge: the original task defines a `WordFilter` class whose constructor stores the dictionary and whose method `f(pref, suff)` answers each query. Here the whole job is condensed into a single function call `wordFilter(words, pref, suff)` that builds the structure and answers one query at once.

**Constraints:**
- `1 <= words.length <= 10^4`
- `1 <= words[i].length <= 7`
- `1 <= pref.length, suff.length <= 7`
- `words[i]`, `pref` and `suff` hold lowercase English letters only.
