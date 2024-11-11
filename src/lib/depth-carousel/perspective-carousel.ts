import "./perspective-carousel.css";

const positions = [
  {
    translate: -30,
    scale: 0.6,
    zIndex: 4,
    reverseZIndex: 3,
  },
  {
    translate: 0,
    scale: 1,
    zIndex: 5,
    reverseZIndex: 5,
  },
  {
    translate: 30,
    scale: 0.6,
    zIndex: 4,
    reverseZIndex: 4,
  },
  {
    translate: 15,
    scale: 0.35,
    zIndex: 2,
    reverseZIndex: 2,
  },
  {
    translate: -15,
    scale: 0.35,
    zIndex: 1,
    reverseZIndex: 1,
  },
];

const count = positions.length;

let currentState = 0;
let isReversing = false;

export class PerspectiveCarousel extends HTMLElement {
  private items: HTMLElement[] = [];

  connectedCallback() {
    this.items = [...this.querySelectorAll<HTMLElement>("carousel-item")!];

    this.items.forEach((item, index) => {
      item.classList.add("wrap");
      item.id = `wrap${index}`;
    });

    const container = document.createElement("div");
    container.id = "contain";

    container.append(...this.items);
    this.append(container);
  }

  init() {
    this.updatePositions();
    this.setAttribute("data-active", "");
  }

  get currentOffset() {
    return positions.length - currentState;
  }

  get focusedItemIndex() {
    return (this.currentOffset + 1) % count;
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

    currentState = (currentState - direction) % count;
    if (currentState < 0) currentState += count;
    this.updatePositions();
  }

  private updatePositions() {
    const wraps = this.querySelectorAll<HTMLElement>("carousel-item");
    wraps.forEach((wrap, index) => {
      let positionIndex = (index + currentState) % count;
      if (positionIndex < 0) positionIndex += count;
      const position = positions[positionIndex];
      wrap.style.transform = `translate(calc(50cqw + ${position.translate}cqw - 50%), -50%) scale(${position.scale})`;
      wrap.style.zIndex = (isReversing ? position.reverseZIndex : position.zIndex).toString();
    });
  }
}

export function definePespectiveCarousel(tagName = "perspective-carousel") {
  customElements.define(tagName, PerspectiveCarousel);
}
