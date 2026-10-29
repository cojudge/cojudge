You are given two complex numbers written as strings in the form `real+imaginaryi`, where both parts are integers (either part may be negative, e.g. `1+-1i`). Multiply the two numbers and return the product in the same `a+bi` format.

Recall that `i` squared equals `-1`, so `(a+bi) * (c+di)` equals `(a*c - b*d) + (a*d + b*c)i`.

**Constraints:**
- Each input matches `-?\d+\+-?\d+i` (an integer, `+`, an integer, `i`).
- `-100 <= real part, imaginary part <= 100`
