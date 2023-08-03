import getData from "./Fetch";

const boxSkeleton = document.querySelectorAll(".box-skeleton");
const container = document.querySelector(".container") as HTMLDivElement;
const message = document.querySelector(".message") as HTMLDivElement;
const backDray = document.querySelector(".back-dray") as HTMLDivElement;

class LoadingAndMessageView {
  constructor() {
    backDray.addEventListener("click", () => this.hideMessage());
  }

  displaySkeletonLoading(): void {
    boxSkeleton.forEach((box) => {
      if (!box.classList.contains("skeleton")) {
        box.classList.add("skeleton");
      }
      container.classList.add("no-scroll");
    });
  }
  hideSkeletonLoading(): void {
    boxSkeleton.forEach((box) => {
      box.classList.remove("skeleton");
      container.classList.remove("no-scroll");
    });
  }

  displayMessage(errorMessage: string): void {
    message.classList.add("display");
    backDray.classList.add("display");
    message.innerText = errorMessage;
  }
  hideMessage(): void {
    getData();
    message.classList.remove("display");
    backDray.classList.remove("display");
  }

  displayLocationMessage(errorText: string): void {
    message.classList.add("display");
    backDray.classList.add("display");
    container.classList.add("no-scroll");
    message.innerText = errorText;
  }
}

export default new LoadingAndMessageView();
