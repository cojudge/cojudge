## Approach

Count the required occurrences of each distinct word. Since every word shares one length, any valid window must align to word boundaries, so run one sliding-window pass per starting offset modulo the word length. Grow the window word by word, shrinking from the left whenever some word appears more often than allowed; each time the window holds exactly all words, record its left edge.

## Complexity Analysis

- **Time Complexity:** O(n * k) where n is the length of `s` and k the word length (one pass per offset, each step O(1) hash work).
- **Space Complexity:** O(m) for the frequency maps, where m is the number of distinct words.

## Implementation

```python
from typing import List
from collections import Counter
class Solution:
    def findSubstring(self, s: str, words: List[str]) -> List[int]:
        if not s or not words:
            return []
        k = len(words[0])
        total = k * len(words)
        if len(s) < total:
            return []
        need = Counter(words)
        ans = []
        for off in range(k):
            win = Counter()
            left, count = off, 0
            for j in range(off, len(s) - k + 1, k):
                w = s[j:j + k]
                if w not in need:
                    win.clear()
                    count = 0
                    left = j + k
                    continue
                win[w] += 1
                count += 1
                while win[w] > need[w]:
                    lw = s[left:left + k]
                    win[lw] -= 1
                    count -= 1
                    left += k
                if count == len(words):
                    ans.append(left)
                    lw = s[left:left + k]
                    win[lw] -= 1
                    count -= 1
                    left += k
        return ans
```
