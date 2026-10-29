You are given a row of boxes, each coloured with a positive integer. In one move you may pick any maximal run of consecutive boxes sharing one colour: if the run has length `k` you score `k*k` points and the run disappears, letting the left and right remainders join together.

Repeat until no box remains. Plan the removal order to earn the largest total score and return that maximum.

**Constraints:**
- `1 <= boxes.length <= 100`
- `1 <= boxes[i] <= 100`
