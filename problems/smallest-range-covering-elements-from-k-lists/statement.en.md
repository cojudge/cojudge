You are given `k` sorted integer lists. Find the narrowest interval `[a, b]` that contains at least one number from every list.

Compare candidates by width `b - a` first; when widths tie, prefer the smaller start `a`. Return the winning pair.

**Constraints:**
- At least one list is present; each list is sorted increasingly.
- Values fit comfortably in 32-bit signed range.

*Adaptation: the nested input maps to `int_array_2d` and the two-element answer maps to `int_array` in this judge, even though the natural statement uses lists of lists.*
