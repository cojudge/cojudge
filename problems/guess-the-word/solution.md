## Approach

Interact with the judge instead of reading the secret. Score any pair of words by counting equal positions — this is exactly what `master.guess` returns for words in the list (`-1` otherwise). Keep a candidate pool starting as the full wordlist; each round pick the minimax candidate whose largest match-group is smallest, call `master.guess` on it, and stop when the score equals the word length. Otherwise discard every candidate whose score against the guess differs from the reported score and repeat. The pool shrinks fast enough to hit the secret within 10 guesses.

## Complexity Analysis

- **Time Complexity:** O(R * n^2 * L), where R <= 10 rounds, n the list size, and L the word length.
- **Space Complexity:** O(n) for the candidate pool plus the judge's guess history.

## Implementation

```python
from typing import List
class Solution:
    def findSecretWord(self, wordlist: List[str], master: 'Master') -> None:
        def matches(a, b):
            return sum(1 for x, y in zip(a, b) if x == y)
        cand = list(wordlist)
        for _ in range(10):
            if not cand:
                break
            best, best_max = cand[0], 10 ** 9
            for g in cand:
                groups = {}
                for w in cand:
                    m = matches(g, w)
                    groups[m] = groups.get(m, 0) + 1
                mx = max(groups.values())
                if mx < best_max:
                    best_max, best = mx, g
            m = master.guess(best)
            if m == len(best):
                return
            cand = [w for w in cand if matches(w, best) == m]
            if not cand:
                break
```
