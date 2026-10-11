## Approach

Glue the words with single spaces and one trailing space into a single cycle string. A cursor counts how many characters of that infinite repetition have been consumed. Each row jumps forward by cols: landing on a space means the next word starts cleanly, while landing inside a word rewinds to its start. After all rows, dividing the cursor by the cycle length counts complete sentences.

## Complexity Analysis

- **Time Complexity:** O(rows + total sentence characters).
- **Space Complexity:** O(total sentence characters).

## Implementation

```python
from typing import List

class Solution:
    def wordsTyping(self, sentence: List[str], rows: int, cols: int) -> int:
        s = " ".join(sentence) + " "
        L = len(s)
        pos = 0
        for _ in range(rows):
            pos += cols
            if s[pos % L] == " ":
                pos += 1
            else:
                while pos > 0 and s[(pos - 1) % L] != " ":
                    pos -= 1
        return pos // L
```
