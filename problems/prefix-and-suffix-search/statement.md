You are given a dictionary `words` where each entry is a lowercase word. For one query you also receive a prefix string `pref` and a suffix string `suff`.

Find the largest index `i` such that `words[i]` starts with `pref` and ends with `suff`. If no dictionary word satisfies both ends, return `-1`.

Adaptation for this judge: the original task defines a `WordFilter` class whose constructor stores the dictionary and whose method `f(pref, suff)` answers each query. Here the whole job is condensed into a single function call `wordFilter(words, pref, suff)` that builds the structure and answers one query at once.

**Example 1:**
```
Input: words = ["apple"], pref = "a", suff = "e"
Output: 0
Explanation: Only index 0 exists, and "apple" starts with "a" and ends with "e".
```

**Example 2:**
```
Input: words = ["apple","apply","ape"], pref = "ap", suff = "e"
Output: 2
Explanation: "apple" at 0 and "ape" at 2 both fit; the larger index 2 wins.
```

**Example 3:**
```
Input: words = ["hello","world"], pref = "x", suff = "y"
Output: -1
Explanation: Neither word starts with "x" and ends with "y".
```

**Constraints:**
- `1 <= words.length <= 10^4`
- `1 <= words[i].length <= 7`
- `1 <= pref.length, suff.length <= 7`
- `words[i]`, `pref` and `suff` hold lowercase English letters only.
