import java.util.*;

class Marker {
    public int[] dailyTemperatures(int[] temperatures) {
        if (temperatures == null) return new int[0];
        int[] answer = new int[temperatures.length];
        Deque<Integer> stack = new ArrayDeque<>();
        for (int day = 0; day < temperatures.length; day++) {
            while (!stack.isEmpty()
                    && temperatures[day] > temperatures[stack.peek()]) {
                int previous = stack.pop();
                answer[previous] = day - previous;
            }
            stack.push(day);
        }
        return answer;
    }

    public boolean isCorrect(int[] temperatures, int[] output) {
        return output != null && Arrays.equals(dailyTemperatures(temperatures), output);
    }
}
