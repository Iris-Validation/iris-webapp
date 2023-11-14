export function generate_test_data(length, amplitude) {
    const arr = Array.from({ length: length }, () => Math.random() * amplitude);
    var total = 0;
    for (var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    var avg = total / arr.length;
    const norm = arr.map((e) => {
        return -e - avg;
    });
    return norm;
}
