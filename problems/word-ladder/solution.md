## Approach

Store unused dictionary words in a set and run bidirectional breadth-first search from `beginWord` and `endWord`. Always expand the smaller frontier, generating neighbors by replacing one character with each lowercase letter. The first generated word in the opposite frontier completes a shortest transformation sequence.

## Complexity Analysis

- **Time Complexity:** O(N * L^2) for a fixed 26-letter alphabet, where N is the number of words and L is their length; constructing each generated Python string costs O(L).
- **Space Complexity:** O(N * L) for the dictionary and BFS frontiers.

## Implementation

```python
from typing import List


class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        unused = set(wordList)
        if endWord not in unused:
            return 0

        front = {beginWord}
        back = {endWord}
        unused.discard(beginWord)
        unused.discard(endWord)
        length = 1

        while front and back:
            if len(front) > len(back):
                front, back = back, front

            next_front = set()
            for word in front:
                chars = list(word)
                for i, original in enumerate(chars):
                    for code in range(ord("a"), ord("z") + 1):
                        replacement = chr(code)
                        if replacement == original:
                            continue
                        chars[i] = replacement
                        candidate = "".join(chars)
                        if candidate in back:
                            return length + 1
                        if candidate in unused:
                            unused.remove(candidate)
                            next_front.add(candidate)
                    chars[i] = original

            front = next_front
            length += 1

        return 0
```
