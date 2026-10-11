You start from a blank row of `'?'` characters with the same length as `target`. Stamping with `stamp` at position `i` overwrites that segment with the stamp text. Repeating stamps in some order must produce `target`.

Return any stamp index sequence (at most `10 * target.length` moves) that builds `target`, or an empty array when impossible. The checker replays your moves rather than demanding one exact order.

**Example 1:**
```
Input: stamp = "abc", target = "ababc"
Output: [0,2]
Explanation: Stamp at 2 ("??abc"), then at 0 ("ababc").
```

**Example 2:**
```
Input: stamp = "abca", target = "aabcaca"
Output: [3,0,1]
Explanation: One valid build order.
```

**Example 3:**
```
Input: stamp = "abc", target = "acabc"
Output: []
Explanation: No order of stamps can create that middle 'c'.
```

**Constraints:**
- `1 <= stamp.length, target.length <= 100`
- Both strings use lowercase English letters.

Adaptation: the result uses `int_array`; an empty array signals impossibility, and any valid build is accepted.
