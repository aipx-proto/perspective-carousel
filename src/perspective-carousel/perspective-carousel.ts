import { layouts } from "./layouts";
import "./perspective-carousel.css";

export interface RotateStartEventDetail {
  oldFocus: HTMLElement;
  newFocus: HTMLElement;
}

export interface RotateEndEventDetail {
  oldFocus: HTMLElement;
  newFocus: HTMLElement;
}

export class PerspectiveCarousel extends HTMLElement {
  private currentState = 0;
  private isReversing = false;
  private items: HTMLElement[] = [];
  private layout: {
    translate: number;
    scale: number;
    zIndex: number;
    reverseZIndex: number;
  }[] = [];

  connectedCallback() {
    this.items = [...this.querySelectorAll<HTMLElement>("carousel-item")!];

    const matchingLayout = layouts.find((layout) => layout.forLength === this.items.length);
    if (!matchingLayout) throw new Error(`No layout found for ${this.items.length} items. We only support 3, 4, or 5 items`);
    this.layout = matchingLayout.layout;

    // initial render
    this.#updatePositions();
    // avoid animating initial layout setup
    setTimeout(() => this.setAttribute("active", ""), 0);
  }

  get currentOffset() {
    return this.layout.length - this.currentState;
  }

  get focusedItemIndex() {
    // Internally, we count from left to right, and always make sure the 2nd item (index = 1) is the focused item
    return (this.currentOffset + 1) % this.layout.length;
  }

  get focusedItem() {
    return this.items[this.focusedItemIndex];
  }

  async rotate(offset: number) {
    const isReversing = offset < 0;
    let absOffset = Math.abs(offset);
    while (absOffset > 0) {
      const oldFocus = this.items[this.focusedItemIndex];
      const newIndex = (this.layout.length + this.focusedItemIndex + (isReversing ? -1 : 1)) % this.layout.length;
      const newFocus = this.items[newIndex];

      this.dispatchEvent(
        new CustomEvent<RotateStartEventDetail>("rotatestart", {
          detail: {
            oldFocus,
            newFocus,
          },
        })
      );

      await new Promise((resolve) => {
        absOffset--;
        this.addEventListener("transitionend", resolve, { once: true });
        this.#moveCarouselInternal(isReversing ? -1 : 1);
      });

      this.dispatchEvent(
        new CustomEvent<RotateEndEventDetail>("rotateend", {
          detail: {
            oldFocus,
            newFocus,
          },
        })
      );

      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  #moveCarouselInternal(direction: number) {
    this.isReversing = direction < 0;

    this.currentState = (this.currentState - direction) % this.layout.length;
    if (this.currentState < 0) this.currentState += this.layout.length;
    this.#updatePositions();
  }

  #updatePositions() {
    const items = this.querySelectorAll<HTMLElement>("carousel-item");
    items.forEach((item, index) => {
      let positionIndex = (index + this.currentState) % this.layout.length;
      if (positionIndex < 0) positionIndex += this.layout.length;
      const position = this.layout[positionIndex];
      item.style.transform = `translate(calc(50cqw + ${position.translate}cqw - 50%), -50%) scale(${position.scale})`;
      const zIndex = this.isReversing ? position.reverseZIndex : position.zIndex;
      item.style.zIndex = zIndex.toString();
      item.dataset.distance = (this.layout.length - zIndex).toString();
    });
  }
}

export function definePespectiveCarousel(tagName = "perspective-carousel") {
  customElements.define(tagName, PerspectiveCarousel);
}
