You receive a text string `s` together with a list `words` in which every word has the same length. A *concatenated block* is formed by gluing together every word from the list exactly once, in any order, with no gaps or extra characters.

Find every starting index `i` such that the slice of `s` beginning at `i` is a concatenated block, and return those indices in any order.

**Example 1:**
```
Input: s = "barfoothefoobarman", words = ["foo","bar"]
Output: [0,9]
Explanation: The slice from 0 is "barfoo" and the slice from 9 is "foobar", both using each word once.
```

**Example 2:**
```
Input: s = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]
Output: []
Explanation: No window of length 16 contains each required word the right number of times.
```

**Example 3:**
```
Input: s = "barfoofoobarthefoobarman", words = ["bar","foo","the"]
Output: [6,9,12]
Explanation: Windows starting at 6 ("foobarthe"), 9 ("barthefoo"), and 12 ("thefoobar") each use all three words once.
```

**Constraints:**
- `1 <= s.length <= 10^4`
- `1 <= words.length <= 5000`
- `1 <= words[i].length <= 30`
- `s` and each word consist of lowercase English letters, and all words share one length.
