export function normalise_data(arr: Array<number>) {

    var total = 0;
    for (var i = 0; i < arr.length; i++) {
      total += arr[i];
    }
    var avg = total / arr.length;
  
    const norm = arr.map((e) => {
      return avg - e
    })
    return norm
  }
  