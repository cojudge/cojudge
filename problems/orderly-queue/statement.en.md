You hold a string `s` and a number `k`. One step lets you pick any of the first `k` characters and relocate it to the very end, preserving the order of everything else. Repeating steps can shuffle the string in restricted ways.

Describe the smallest string (in dictionary order) that can be reached.

When `k` equals one, only rotations are possible, so examine each rotation. When `k` exceeds one, any rearrangement becomes reachable, so the sorted characters form the optimum.

**Constraints:**
- `1 <= k <= s.length <= 1000`
- `s` holds only lowercase English letters.
