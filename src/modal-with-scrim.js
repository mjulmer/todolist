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

  /** Show divToShow in the center of the screen with a scrim behind it.
   * Any clicks on the scrim will dismiss the scrim and modal.
   *
   * divToShow should be an element taken from the DOM, not created
   * anew in the javascript -- it's appended, hidden, to the end of the
   * body for future access, which could cause unintended behavior.
   */
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
      // Ensure the modal can be accessed again if a different view is used
      // as the next modal (since all children are removed from the scrim).
      document.querySelector("body").appendChild(this.modal);
    }
    if (this.scrim !== undefined) {
      this.scrim.setAttribute("hidden", "");
    } else {
      console.error("The scrim should really never be undefined here.");
    }
  }
}
