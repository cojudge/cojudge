You start from a blank row of `'?'` characters with the same length as `target`. Stamping with `stamp` at position `i` overwrites that segment with the stamp text. Repeating stamps in some order must produce `target`.

Return any stamp index sequence (at most `10 * target.length` moves) that builds `target`, or an empty array when impossible. The checker replays your moves rather than demanding one exact order.

**Constraints:**
- `1 <= stamp.length, target.length <= 100`
- Both strings use lowercase English letters.

Adaptation: the result uses `int_array`; an empty array signals impossibility, and any valid build is accepted.
