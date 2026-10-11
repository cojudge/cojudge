A DNA strand can be seen as a long string built only from the four letters `A`, `C`, `G` and `T`. Biologists care about short fragments that appear in more than one place, because repeats can point to something meaningful.

You are given such a string `s`. Gather every distinct substring of length exactly 10 that occurs two or more times in `s`. Each repeated fragment is listed once; the order of the answer does not matter.

**Example 1:**
```
Input: s = "AAAAACCCCCAAAAACCCCCCAAAAAGGGTTT"
Output: ["AAAAACCCCC","CCCCCAAAAA"]
Explanation: The block "AAAAACCCCC" begins at index 0 and again at index 10, and "CCCCCAAAAA" begins at index 5 and again at index 16. No other length-10 block shows up twice.
```

**Example 2:**
```
Input: s = "AAAAAAAAAAAAA"
Output: ["AAAAAAAAAA"]
Explanation: The only length-10 block is ten A's, and it repeats at every position.
```

**Example 3:**
```
Input: s = "ACGT"
Output: []
Explanation: The string is shorter than 10 characters, so no block qualifies.
```

**Constraints:**
- `0 <= s.length <= 10^5`
- `s` consists of the characters `'A'`, `'C'`, `'G'` and `'T'`.
