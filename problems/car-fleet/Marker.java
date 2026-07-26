import java.util.*;

class Marker {
    public int carFleet(int target, int[] position, int[] speed) {
        if (position == null || speed == null || position.length != speed.length) return 0;
        Integer[] order = new Integer[position.length];
        for (int i = 0; i < order.length; i++) order[i] = i;
        Arrays.sort(order, (a, b) -> Integer.compare(position[b], position[a]));

        int fleets = 0;
        long fleetDistance = 0;
        long fleetSpeed = 1;
        for (int index : order) {
            long distance = (long) target - position[index];
            if (fleets == 0 || distance * fleetSpeed > fleetDistance * speed[index]) {
                fleets++;
                fleetDistance = distance;
                fleetSpeed = speed[index];
            }
        }
        return fleets;
    }

    public boolean isCorrect(int target, int[] position, int[] speed, int output) {
        return output == carFleet(target, position, speed);
    }
}
