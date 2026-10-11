An encoded message uses two symbol widths: `0` alone means a one-bit symbol, while `10` and `11` each mean a two-bit symbol. The given array `bits` is a valid encoding of at least one symbol.

Decide whether the very last symbol occupies a single bit. In other words, walk the encoding greedily from the start — a `1` always consumes its follower, a `0` consumes only itself — and check whether the final `0` is read alone.

Return `true` when the tail symbol is one bit long, else `false`.

**Example 1:**
```
Input: bits = [1,0,0]
Output: true
Explanation: Read 10 first, leaving a lone 0 at the end.
```

**Example 2:**
```
Input: bits = [1,1,1,0]
Output: false
Explanation: Read 11 first, leaving 10 as the final two-bit symbol.
```

**Example 3:**
```
Input: bits = [0]
Output: true
Explanation: The single zero must be a one-bit symbol.
```

**Constraints:**
- `1 <= bits.length <= 1000`
- Each entry is `0` or `1`, and the last entry is `0`.
