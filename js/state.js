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
popup.style.display = "none";
window.showPopup = function () {
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 5000);
};

export { isLoading };
