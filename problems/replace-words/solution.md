## Approach

Insert all roots into a trie where each node flags the end of a root. For every sentence word, descend the trie letter by letter; the first end flag met gives the shortest covering root, which replaces the word. If the path breaks or no flag appears, the word is kept as is.

## Complexity Analysis

- **Time Complexity:** O(D + S), where D is the total root length and S the sentence length.
- **Space Complexity:** O(D) for the trie nodes.

## Implementation

```python
from typing import List

class Solution:
    def replaceWords(self, dictionary: List[str], sentence: str) -> str:
        roots = set(dictionary)
        out = []
        for w in sentence.split(" "):
            hit = None
            for i in range(1, len(w) + 1):
                if w[:i] in roots:
                    hit = w[:i]
                    break
            out.append(hit if hit is not None else w)
        return " ".join(out)
```
