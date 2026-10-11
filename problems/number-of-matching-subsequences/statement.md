You are given a long host string `s` and a list of candidate words `words`.
A candidate counts when it appears as a subsequence of `s`: its characters
must occur in `s` in the same relative order, though not necessarily next
to each other, with some characters of `s` possibly skipped. Repeated words
count repeatedly.

Return how many entries of `words` satisfy that property.

**Example 1:**
```
Input: s = "abcde", words = ["a","bb","acd","ace"]
Output: 3
Explanation: Three candidates embed in order: "a" (first letter), "acd"
(a, c, d), and "ace" (a, c, e). The word "bb" fails because s holds only
one b.
```

**Example 2:**
```
Input: s = "dsahjpjauf", words = ["ahjpjau","ja","ahbwzgqnuk","tnmlanowax"]
Output: 2
Explanation: The first two candidates can be traced through s, while the
last two need letters in an order s never provides.
```

**Example 3:**
```
Input: s = "abcd", words = ["abc","abd","acd","bcd","abcde"]
Output: 4
Explanation: Every three-letter deletion of abcd works; the five-letter
word is too long.
```

**Constraints:**
- `1 <= s.length <= 5 * 10^4`
- `1 <= words.length <= 5000`
- `1 <= words[i].length <= 50`
- `s` and each word hold only lower-case English letters.
