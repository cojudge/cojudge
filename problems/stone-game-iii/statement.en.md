Alice and Bob play a further row-removal contest. A row of stones carries integer scores listed in `stoneValue`.

Alice moves first, then the two alternate. Each move removes stones only from the front of the remaining row: the player picks up 1, 2, or 3 stones there.

Every stone a player picks up adds its value to that player's total. Both totals begin at 0.

Whoever holds the larger total once the row is gone wins; equal totals mean a drawn game. Play runs until every stone is gone.

Both sides act optimally.

Return `"Alice"` when optimal play puts Alice in front, `"Bob"` when it puts Bob in front, and `"Tie"` when optimal play ends level.

**Constraints:**
- 1 ≤ stoneValue.length ≤ 5 × 10<sup>4</sup>
- -1000 ≤ stoneValue[i] ≤ 1000
