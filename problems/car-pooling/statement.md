There is a car with `capacity` empty seats. The vehicle only drives east (i.e., it cannot turn around and drive west).

You are given the integer `capacity` and an array `trips` where `trips[i] = [numPassengers[i], from[i], to[i]]` indicates that the `i`-th trip has `numPassengers[i]` passengers and the locations to pick them up and drop them off are `from[i]` and `to[i]` respectively. The locations are given as the number of kilometers due east from the car's initial location.

Passengers are dropped off before new passengers are picked up at the same location. At every point along the route, the total number of passengers in the car must not exceed `capacity`.

Return `true` if it is possible to pick up and drop off all passengers for all the given trips, or `false` otherwise.

**Example 1:**

```
Input: trips = [[2,1,5],[3,3,7]], capacity = 4
Output: false
Explanation: At kilometer 1, 2 passengers are picked up, so the car holds 2.
```

**Example 2:**

```
Input: trips = [[2,1,5],[3,3,7]], capacity = 5
Output: true
Explanation: At kilometer 1, the car holds 2 passengers.
```

**Constraints:**

- `1 <= trips.length <= 1000`
- `trips[i].length == 3`
- `1 <= numPassengers[i] <= 100`
- `0 <= from[i] < to[i] <= 1000`
- `1 <= capacity <= 10^5`