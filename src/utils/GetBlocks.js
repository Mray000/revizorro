export const GetBlocks = (arr, count) => {
    let slices_count = Math.ceil(arr.length / count);
    let blocks = [];
    let i = 0;
    while (slices_count) {
      blocks.push(arr.slice(i, i + count));
      i += count;
      slices_count--;
    }
    return blocks;
  };
  