import java.util.*;

class Marker {
    public int[] asteroidCollision(int[] asteroids) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (int a : asteroids) {
            boolean alive = true;
            while (alive && a < 0 && !stack.isEmpty() && stack.peek() > 0) {
                int top = stack.peek();
                if (top < -a) {
                    stack.pop();
                } else if (top == -a) {
                    stack.pop();
                    alive = false;
                } else {
                    alive = false;
                }
            }
            if (alive) stack.push(a);
        }
        int[] res = new int[stack.size()];
        int i = res.length - 1;
        for (int v : stack) res[i--] = v;
        return res;
    }

    public boolean isCorrect(int[] asteroids, int[] output) {
        return output != null && Arrays.equals(asteroidCollision(asteroids), output);
    }
}
