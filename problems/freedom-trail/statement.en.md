A circular dial carries the characters of `ring` around its rim, with position 0 initially pointing at 12 o'clock. One step rotates the dial a single place clockwise or counterclockwise, and pressing a button spells the character currently at the top (costing one extra move per character). The dial starts aligned so `ring[0]` is at the top.

Given the dial layout `ring` and a word `key` to spell in order, compute the smallest total number of moves (rotations plus one press per character) that spells the whole word. Every character of `key` appears somewhere in `ring`.

**Constraints:**
- `1 <= ring.length, key.length <= 100`
- `ring` and `key` contain only lowercase English letters
- Every character of `key` occurs in `ring`
