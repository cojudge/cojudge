You are given `m` arrays, each sorted in non-decreasing order. Choose two numbers coming from two different arrays and look at their absolute difference. Return the largest achievable difference.

Because every row is ordered, only row endpoints influence the optimum, but the two picks must never share a row.

**Constraints:**
- At least two arrays are present; total values are modest.
- Each array has at least one number; values fit in [-10000, 10000].

*Adaptation: the nested input maps to `int_array_2d` in this judge.*
