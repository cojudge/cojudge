class Marker {
    public int[] twoSum(int[] numbers, int target) {
        if (numbers == null) return new int[0];
        int left = 0;
        int right = numbers.length - 1;
        while (left < right) {
            long sum = (long) numbers[left] + numbers[right];
            if (sum == target) return new int[]{left + 1, right + 1};
            if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return new int[0];
    }

    public boolean isCorrect(int[] numbers, int target, int[] output) {
        if (numbers == null || output == null || output.length != 2) return false;
        int left = output[0] - 1;
        int right = output[1] - 1;
        if (left < 0 || right >= numbers.length || left >= right) return false;
        return (long) numbers[left] + numbers[right] == target;
    }
}
