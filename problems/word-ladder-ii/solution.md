## Approach

Run BFS from the start word, recording the shortest distance to every reachable dictionary word and all predecessors that achieve that distance. Words are discovered level by level so that each word's predecessor list contains exactly the neighbors one step closer to the start. Then DFS from the target back through predecessors enumerates every shortest ladder.

## Complexity Analysis

- **Time Complexity:** O(N * L * 26), where N is the dictionary size and L is the word length, plus output size for enumeration.
- **Space Complexity:** O(N * L) for distances, predecessors, and the queue.

## Implementation

```python
from typing import List
from collections import deque, defaultdict
class Solution:
    def findLadders(self, beginWord: str, endWord: str, wordList: List[str]) -> List[List[str]]:
        words = set(wordList)
        if endWord not in words:
            return []
        words.add(beginWord)
        dist = {beginWord: 0}
        pred = defaultdict(list)
        q = deque([beginWord])
        level = 0
        found = False
        while q and not found:
            level += 1
            for _ in range(len(q)):
                word = q.popleft()
                arr = list(word)
                for i in range(len(arr)):
                    orig = arr[i]
                    for c in "abcdefghijklmnopqrstuvwxyz":
                        if c == orig:
                            continue
                        arr[i] = c
                        nb = "".join(arr)
                        if nb not in words:
                            continue
                        if nb not in dist:
                            dist[nb] = level
                            pred[nb].append(word)
                            q.append(nb)
                            if nb == endWord:
                                found = True
                        elif dist[nb] == level:
                            pred[nb].append(word)
                    arr[i] = orig
        if endWord not in dist:
            return []
        ans = []
        path = [endWord]
        def dfs(cur):
            if cur == beginWord:
                ans.append(list(reversed(path)))
                return
            for p in pred[cur]:
                path.append(p)
                dfs(p)
                path.pop()
        dfs(endWord)
        return ans
```
