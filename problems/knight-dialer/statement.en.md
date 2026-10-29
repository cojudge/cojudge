A chess knight moves on a phone pad laid out as `1 2 3 / 4 5 6 / 7 8 9 / * 0 #`. From a digit it jumps in the usual L shape; `*` and `#` are never used, and `5` has no outgoing jump.

Count how many distinct digit strings of length `n` the knight can trace, starting from any of the ten digits. Return the count modulo `1_000_000_007`.

**Constraints:**
- `1 <= n <= 5000`
