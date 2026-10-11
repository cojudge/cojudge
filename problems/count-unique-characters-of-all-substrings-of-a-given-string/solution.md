## Approach

Each occurrence of a letter is the unique representative of its substrings whose start falls after its previous occurrence and whose end falls before its next occurrence, giving (i - prev) * (next - i) substrings per occurrence. Scanning left to right while remembering the last two positions of every letter lets us add each occurrence's share the moment its successor is known. A final flush treats the string end as every letter's next occurrence, with the running total kept modulo 1e9+7.

## Complexity Analysis

- **Time Complexity:** O(n) where n is the string length; each character is processed once.
- **Space Complexity:** O(1) besides the input, using two fixed arrays of size 26.

## Implementation

```python
class Solution:
    def uniqueLetterString(self, s: str) -> int:
        mod = 10 ** 9 + 7
        last2 = [-1] * 26
        last1 = [-1] * 26
        ans = 0
        for i, ch in enumerate(s):
            c = ord(ch) - ord("A")
            ans += (i - last1[c]) * (last1[c] - last2[c])
            last2[c] = last1[c]
            last1[c] = i
        n = len(s)
        for c in range(26):
            ans += (n - last1[c]) * (last1[c] - last2[c])
        return ans % mod
```
