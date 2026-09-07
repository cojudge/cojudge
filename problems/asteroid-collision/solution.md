## Approach

Keep survivors in a stack. Only a right-moving stack top (`> 0`) and a
left-moving incoming asteroid (`< 0`) can collide. While such a collision is
possible, compare sizes: pop a smaller top, destroy both on equal sizes, or
discard the incoming asteroid when the top is larger. Otherwise push the
incoming asteroid.

## Complexity Analysis

- **Time Complexity:** `O(n)`, each asteroid is pushed and popped at most once.
- **Space Complexity:** `O(n)` for the stack of survivors.

## Implementation

```python
from typing import List


class Solution:
    def asteroidCollision(self, asteroids: List[int]) -> List[int]:
        stack: List[int] = []
        for a in asteroids:
            alive = True
            while alive and a < 0 and stack and stack[-1] > 0:
                top = stack[-1]
                if top < -a:
                    stack.pop()
                elif top == -a:
                    stack.pop()
                    alive = False
                else:
                    alive = False
            if alive:
                stack.append(a)
        return stack
```
