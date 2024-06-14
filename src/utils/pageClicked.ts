let pageClicked = false;
const handlePageClick = () => {
  pageClicked = true
};
document.documentElement.addEventListener("click", handlePageClick);

export {pageClicked}