import { BenchMarker } from "./bench";
let bench;
function isLoading(isLoading) {
  if (!isLoading && bench !== undefined) {
    bench.finish("finishLoading");
  } else {
    bench = new BenchMarker("isLoading");
  }
  console.log("isLoading " + isLoading);
  if (isLoading) {
    loading.style.display = "block";
  } else {
    loading.style.display = "none";
  }
}
export { isLoading };
