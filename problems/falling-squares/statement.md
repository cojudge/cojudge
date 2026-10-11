Squares fall one by one onto a flat baseline. Each entry `positions[i] = [left, size]` describes a square whose side length equals `size` and whose left edge starts at coordinate `left`. A square drops straight down until it rests on the baseline or on top of a previously placed square. Touching only at a vertical edge does not count as support.

After every drop, record how tall the tallest stack has become. Return those maxima in order.

**Constraints:**
- `1 <= positions.length <= 1000`
- `0 <= left <= 10^8`
- `1 <= size <= 10^6`
