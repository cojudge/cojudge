## Approach

Count the 26 character frequencies and push every present character into a max-heap keyed by frequency. Repeatedly pop the most frequent remaining character, append it, and only then put the previously appended character back into the heap. Holding the previous character back for one step guarantees no two equal adjacent characters. If a leftover character cannot be placed after the heap empties, no valid rearrangement exists and we return `""`.

## Complexity Analysis

- **Time Complexity:** O(n log 26) = O(n), where `n` is `s.length`.
- **Space Complexity:** O(1), because the heap and count table hold at most 26 entries.

## Implementation

```python
from heapq import heappop, heappush, heapify

class Solution:
    def reorganizeString(self, s: str) -> str:
        count = [0] * 26
        for ch in s:
            count[ord(ch) - ord("a")] += 1
        heap = [(-freq, chr(ord("a") + i)) for i, freq in enumerate(count) if freq > 0]
        heapify(heap)

        result = []
        prev_char, prev_freq = "#", 0
        while heap:
            neg_freq, ch = heappop(heap)
            result.append(ch)
            if prev_freq > 0:
                heappush(heap, (-prev_freq, prev_char))
            prev_char = ch
            prev_freq = -neg_freq - 1
        if prev_freq > 0:
            return ""
        return "".join(result)
```