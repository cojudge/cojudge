## Approach

Simulate the classic rejection sampler: a private `rand7` helper draws uniform values 1..7 from a fixed-seed generator, and each `rand10` draw combines two of them into a uniform 1..49 number. Values 1..40 map evenly onto 1..10 with `(r - 1) % 10 + 1`, while 41..49 are discarded and retried, which keeps every output uniform. Repeat once per requested call.

## Complexity Analysis

- **Time Complexity:** O(calls) expected time, since each draw succeeds with probability 40/49.
- **Space Complexity:** O(calls) for the output array.

## Implementation

```python
import random
from typing import List

class Solution:
    def runRand10(self, calls: int) -> List[int]:
        rng = random.Random(42)

        def rand7() -> int:
            return rng.randint(1, 7)

        out = []
        for _ in range(calls):
            while True:
                r = (rand7() - 1) * 7 + rand7()
                if r <= 40:
                    out.append((r - 1) % 10 + 1)
                    break
        return out
```
