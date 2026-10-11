A vehicle with `capacity` vacant seats travels exclusively eastward (reversing toward the west is impossible).

A manifest `trips` describes the itinerary, where `trips[i] = [numPassengers[i], from[i], to[i]]` means booking `i` boards `numPassengers[i]` riders at kilometre `from[i]` east of the start and alights them at kilometre `to[i]` east of the start.

Whenever boarding and alighting coincide at one kilometre, alighting completes first.
Along the entire journey the headcount aboard must never surpass `capacity`.

Decide whether every booking can be honoured: return `true` when feasible, `false` otherwise.

**Constraints:**

- `1 <= trips.length <= 1000`
- `trips[i].length == 3`
- `1 <= numPassengers[i] <= 100`
- `0 <= from[i] < to[i] <= 1000`
- `1 <= capacity <= 10^5`
