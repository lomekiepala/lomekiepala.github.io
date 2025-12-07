function isLoading(isLoading) {
  console.log("isLoading " + isLoading);
  if (isLoading) {
    loading.style.display = "block";
  } else {
    loading.style.display = "none";
  }
}
export { isLoading };
