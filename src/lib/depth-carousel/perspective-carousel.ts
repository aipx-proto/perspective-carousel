import { layouts } from "./layouts";
import "./perspective-carousel.css";

let currentState = 0;
let isReversing = false;

export class PerspectiveCarousel extends HTMLElement {
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
    this.updatePositions();
  }

  get currentOffset() {
    return this.layout.length - currentState;
  }

  get focusedItemIndex() {
    return (this.currentOffset + 1) % this.layout.length;
  }

  get currentItem() {
    return this.items[this.focusedItemIndex];
  }

  async moveCarouselRelative(offset: number) {
    const isReversing = offset < 0;
    let absOffset = Math.abs(offset);
    while (absOffset > 0) {
      await new Promise((resolve) => {
        absOffset--;
        this.addEventListener("transitionend", resolve, { once: true });
        this.moveCarouselInternal(isReversing ? -1 : 1);
      });

      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  moveCarouselInternal(direction: number) {
    isReversing = direction < 0;

    currentState = (currentState - direction) % this.layout.length;
    if (currentState < 0) currentState += this.layout.length;
    this.updatePositions();
  }

  private updatePositions() {
    const items = this.querySelectorAll<HTMLElement>("carousel-item");
    items.forEach((wrap, index) => {
      let positionIndex = (index + currentState) % this.layout.length;
      if (positionIndex < 0) positionIndex += this.layout.length;
      const position = this.layout[positionIndex];
      wrap.style.transform = `translate(calc(50cqw + ${position.translate}cqw - 50%), -50%) scale(${position.scale})`;
      wrap.style.zIndex = (isReversing ? position.reverseZIndex : position.zIndex).toString();
    });
  }
}

export function definePespectiveCarousel(tagName = "perspective-carousel") {
  customElements.define(tagName, PerspectiveCarousel);
}
