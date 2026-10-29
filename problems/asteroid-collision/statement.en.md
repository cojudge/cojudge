A single-file line of space rocks is described by the array `asteroids`: the magnitude of each entry gives that rock's size, while its sign gives its travel direction — a positive value drifts right and a negative value drifts left. Every rock advances at an identical pace.

Simulate the line until nothing else can crash and report the survivors in their original left-to-right order. Whenever two rocks travelling toward each other connect, the lighter one shatters; when both weigh the same, each shatters. Rocks already heading the same way never catch up to one another, so they never connect.

**Constraints:**

- `2 <= asteroids.length <= 10^4`
- `-1000 <= asteroids[i] <= 1000`
- `asteroids[i] != 0`
