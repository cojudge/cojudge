## Approach

Replay the game with a queue holding the body from head to tail and a hash set
of occupied cells. For each move, compute the new head, drop the tail unless
food is eaten there, then test walls and self-collision. Eating advances the
food pointer and raises the score; after a crash every later answer is -1.

## Complexity Analysis

- **Time Complexity:** O(m), where m is the number of moves.
- **Space Complexity:** O(f + m) for the body and the food list, with f eaten cells.

## Implementation

```python
from typing import List
from collections import deque

class Solution:
    def runSnakeGame(self, width: int, height: int, food: List[List[int]], moves: List[str]) -> List[int]:
        body = deque([(0, 0)])
        occ = {(0, 0)}
        fi = 0
        score = 0
        ans = []
        over = False
        for mv in moves:
            if over:
                ans.append(-1)
                continue
            r, c = body[0]
            if mv == "U":
                r -= 1
            elif mv == "D":
                r += 1
            elif mv == "L":
                c -= 1
            elif mv == "R":
                c += 1
            else:
                ans.append(-1)
                over = True
                continue
            if r < 0 or r >= height or c < 0 or c >= width:
                ans.append(-1)
                over = True
                continue
            eat = fi < len(food) and food[fi][0] == r and food[fi][1] == c
            if not eat:
                occ.remove(body.pop())
            if (r, c) in occ:
                ans.append(-1)
                over = True
                continue
            body.appendleft((r, c))
            occ.add((r, c))
            if eat:
                fi += 1
                score += 1
            ans.append(score)
        return ans
```
