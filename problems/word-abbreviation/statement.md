You are given a list of distinct lowercase words. For each word, build its *abbreviation* as follows: keep a prefix of the word, then write the count of skipped middle characters, then keep the last character. For example, with a one-letter prefix, `word` becomes `w2d` (keep `w`, skip 2 letters, keep `d`).

Two rules apply:
- If the abbreviation is not strictly shorter than the original word, keep the original word instead.
- Abbreviations in the final answer must be pairwise unique, so no two words may share one. Resolve clashes with the *shared-prefix growth rule*: while any abbreviation is used by more than one word, extend the kept prefix by one character for every word in each clashing group and rebuild those abbreviations (keeping the original whenever it is not shorter).

Return the abbreviations in the same order as the input words.

**Example 1:**
```
Input: words = ["like","god","internal","me","internet","interval","intension","face","intrusion"]
Output: ["l2e","god","internal","me","i6t","interval","inte4n","f2e","intr4n"]
Explanation: "like" shortens to "l2e". "internal" and "interval" keep colliding until the full word is needed, so both stay unshortened. "intension" and "intrusion" separate once the prefix reaches 4 and 3 letters respectively.
```

**Example 2:**
```
Input: words = ["abcdef","abcdeg"]
Output: ["a4f","a4g"]
Explanation: One-letter prefixes already separate the two words.
```

**Example 3:**
```
Input: words = ["word","world","would"]
Output: ["w2d","world","would"]
Explanation: "world" and "would" both start as "w3d" and then "wo2d"; growing their prefixes once more would not shorten them, so both fall back to their full forms, which are already unique.
```

**Constraints:**
- `1 <= words.length <= 400`
- `1 <= words[i].length <= 400`
- All words are distinct and contain only lowercase English letters.
