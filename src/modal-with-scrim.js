"use strict";

export { ModalWithScrim };

class ModalWithScrim {
  scrim;
  modal;

  constructor() {
    this.createScrimDivAndAddToDom();
  }

  createScrimDivAndAddToDom() {
    // If this were truly a stand-alone module, the styling would also happen
    // in the JS... but I feel lazy so it's in the CSS
    this.scrim = document.createElement("div");
    this.scrim.setAttribute("id", "full-screen-scrim");
    this.scrim.setAttribute("hidden", "");
    this.scrim.addEventListener("click", () => this.hideModal());
    document.querySelector("body").appendChild(this.scrim);
  }

  showModal(divToShow) {
    // In case this is called twice in a row and previous modal is shown.
    this.hideModal();

    divToShow.className = "modal-with-scrim-modal";
    this.scrim.replaceChildren(divToShow);
    this.modal = divToShow;
    this.modal.removeAttribute("hidden");
    this.scrim.removeAttribute("hidden");
  }

  hideModal() {
    console.log("hide modal called");
    if (this.modal !== undefined) {
      this.modal.setAttribute("hidden", "");
    }
    if (this.scrim !== undefined) {
      this.scrim.setAttribute("hidden", "");
    } else {
      console.error("The scrim should really never be undefined here.");
    }
  }
}
