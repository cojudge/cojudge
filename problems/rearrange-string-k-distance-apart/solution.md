## Approach

Repeatedly emit the most frequent remaining letter with a max-heap, parking
each used letter in a waiting queue of length k - 1 so copies resurface only
when the spacing rule allows. If the heap empties before every character is
placed, the task is impossible and the answer is empty.

## Complexity Analysis

- **Time Complexity:** O(n log a), where n is the string length and a the alphabet size.
- **Space Complexity:** O(a) for the heap and the waiting queue.

## Implementation

```python
import heapq
from collections import Counter, deque

class Solution:
    def rearrangeString(self, s: str, k: int) -> str:
        if not s or k <= 1:
            return s
        counts = Counter(s)
        heap = [(-c, ch) for ch, c in counts.items()]
        heapq.heapify(heap)
        wait: deque = deque()
        out = []
        while heap:
            c, ch = heapq.heappop(heap)
            out.append(ch)
            c += 1
            wait.append((c, ch))
            if len(wait) == k:
                rc, rch = wait.popleft()
                if rc < 0:
                    heapq.heappush(heap, (rc, rch))
        return "".join(out) if len(out) == len(s) else ""
```
