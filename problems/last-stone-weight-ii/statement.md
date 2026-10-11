An integer array `stones` lists the weight of every rock, with `stones[i]` belonging to the `i`-th rock.

The rocks take part in the following game. On every move, pick any two rocks and crash them together: call their weights `x` and `y` with `x <= y`. The crash has this outcome:

- When `x == y`, both rocks vanish, and
- When `x != y`, the rock of weight `x` vanishes, while the rock of weight `y` survives with the reduced weight `y - x`.

Play continues until no more than one rock is left.

Report the lightest weight that this final rock can possibly have. When every rock can be eliminated, report `0`.

**Constraints:**
- 1 ≤ stones.length ≤ 30
- 1 ≤ stones[i] ≤ 100
