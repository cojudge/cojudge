## Approach

Treat every listed pair as an undirected link between two words and merge them with a disjoint-set (union-find) structure. After all unions, each word belongs to exactly one group. Sentences of different lengths fail at once; otherwise each position passes when the words match or their group representatives agree.

## Complexity Analysis

- **Time Complexity:** O((w + p) * a), where w is the sentence length, p the pair count, and a the near-constant union-find cost.
- **Space Complexity:** O(v) for the distinct words v.

## Implementation

```python
from typing import List
class Solution:
    def areSentencesSimilarTwo(self, sentence1: List[str], sentence2: List[str], similarPairs: List[List[str]]) -> bool:
        if len(sentence1) != len(sentence2):
            return False
        par = {}
        def find(x):
            par.setdefault(x, x)
            while par[x] != x:
                par[x] = par[par[x]]
                x = par[x]
            return x
        def union(a, b):
            par[find(a)] = find(b)
        for a, b in similarPairs:
            union(a, b)
        for a, b in zip(sentence1, sentence2):
            if a != b and find(a) != find(b):
                return False
        return True
```
