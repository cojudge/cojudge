class Marker {
    private int findPeak(int[] arr) {
        int left = 0;
        int right = arr.length - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] < arr[mid + 1]) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }

    private int searchAscending(int[] arr, int target, int left, int right) {
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    private int searchDescending(int[] arr, int target, int left, int right) {
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            if (arr[mid] > target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }

    public int findInMountainArray(int[] mountainArr, int target) {
        int peak = findPeak(mountainArr);
        int leftHit = searchAscending(mountainArr, target, 0, peak);
        if (leftHit != -1) return leftHit;
        return searchDescending(mountainArr, target, peak + 1, mountainArr.length - 1);
    }

    public boolean isCorrect(int[] mountainArr, int target, int output) {
        return output == findInMountainArray(mountainArr, target);
    }
}
