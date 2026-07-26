There are `n` cars traveling toward a destination at mile `target`. Car `i`
starts at `position[i]` and travels at the constant speed `speed[i]`.

A faster car may catch a slower car, but it cannot pass. Once cars meet, they
form one fleet and continue at the slowest speed in that fleet. A car that
catches a fleet exactly at the destination belongs to that fleet.

Return the number of car fleets that arrive at the destination.

**Constraints:**

- `1 <= position.length == speed.length <= 100000`
- `1 <= target <= 1000000`
- `0 <= position[i] < target`
- All positions are unique.
- `1 <= speed[i] <= 1000000`
