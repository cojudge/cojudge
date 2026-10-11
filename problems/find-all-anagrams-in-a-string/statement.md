You receive two lowercase strings `s` and `p`. Slide a window of length `p.length` across `s` and note every starting index where the window holds exactly the same multiset of letters as `p` (that is, some rearrangement of `p`). Return all such starts in any order.

**Constraints:**
- `1 <= s.length, p.length <= 3 * 10^4`
- Both strings use only lowercase English letters.

Adaptation: the source returns a list of integers; here it maps to `int_list`.
