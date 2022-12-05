import setUp from "./setUpData.js";

const boxSkeleton = document.querySelectorAll(".box-skeleton");
const container = document.querySelector(".container");
const message = document.querySelector(".message");
const backDray = document.querySelector(".back-dray");

class LoadingAndMessageView {
  constructor() {
    backDray.addEventListener('click', () => this.hideMessage())
  }

  displaySkeletonLoading() {
    boxSkeleton.forEach((box) => {
      box.classList.add("skeleton");
      container.classList.add("no-scroll");
    });
  }
  hideSkeletonLoading() {
    boxSkeleton.forEach((box) => {
      box.classList.remove("skeleton");
      container.classList.remove("no-scroll");
    });
  }

  displayMessage(error) {
    message.classList.add("display");
    backDray.classList.add("display");

    if(!error.response){
    message.innerText = `${error.message}.
    Try again`;
    return
    }
    message.innerText = error.response.data.error.message;
  }
  hideMessage(){
    setUp()
    message.classList.remove("display");
    backDray.classList.remove("display");

  }
}

export default new LoadingAndMessageView();
