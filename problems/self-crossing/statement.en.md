Starting at the origin of a grid, you walk in a repeating cycle of directions: first upward (north), then left (west), then downward (south), then right (east), then upward again, and so on. The array `distance` tells how far each leg reaches: leg 0 goes up by `distance[0]`, leg 1 goes left by `distance[1]`, leg 2 goes down by `distance[2]`, and the pattern continues counter-clockwise.

As the path grows it may touch or cross its own earlier trail. Return `true` when any such contact happens and `false` when the whole walk stays clear of itself.

**Constraints:**
- `1 <= distance.length <= 10^5`
- `1 <= distance[i] <= 10^5`
