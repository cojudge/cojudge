A circular dial carries the characters of `ring` around its rim, with position 0 initially pointing at 12 o'clock. One step rotates the dial a single place clockwise or counterclockwise, and pressing a button spells the character currently at the top (costing one extra move per character). The dial starts aligned so `ring[0]` is at the top.

Given the dial layout `ring` and a word `key` to spell in order, compute the smallest total number of moves (rotations plus one press per character) that spells the whole word. Every character of `key` appears somewhere in `ring`.

**Example 1:**
```
Input: ring = "godding", key = "gd"
Output: 4
Explanation: Keep the dial still and press 'g' (1), rotate two places to a 'd' (2), then press it (1), for 4 total.
```

**Example 2:**
```
Input: ring = "godding", key = "godding"
Output: 13
Explanation: Spelling the full word in order needs 6 rotations plus 7 presses.
```

**Example 3:**
```
Input: ring = "ab", key = "b"
Output: 2
Explanation: Rotate one step to 'b' (1) and press it (1).
```

**Constraints:**
- `1 <= ring.length, key.length <= 100`
- `ring` and `key` contain only lowercase English letters
- Every character of `key` occurs in `ring`
