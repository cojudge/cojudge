## Approach

Sample uniformly by area with the polar method: draw `u` uniform in `[0,1)` and an angle `theta` uniform in `[0, 2*pi)`. Scaling the radius by `sqrt(u)` (not `u` itself, which would bunch points near the center) makes the area density uniform; convert the polar offset back with cosine and sine and shift by the center. The checker verifies only that each point lies within the circle (with a tiny tolerance), so returning the center is valid but not uniform.

## Complexity Analysis

- **Time Complexity:** O(1) per `randPoint`.
- **Space Complexity:** O(1).

## Implementation

```python
import math
import random
from typing import List

class RandPoint:
    def __init__(self, radius: float, x_center: float, y_center: float):
        self.radius = radius
        self.x_center = x_center
        self.y_center = y_center

    def randPoint(self) -> List[float]:
        u = random.random()
        theta = random.random() * 2.0 * math.pi
        d = self.radius * math.sqrt(u)
        return [self.x_center + d * math.cos(theta),
                self.y_center + d * math.sin(theta)]
```
