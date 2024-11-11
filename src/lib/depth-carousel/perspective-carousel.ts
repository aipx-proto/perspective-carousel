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
    this.items = [...this.querySelectorAll<HTMLElement>("carousel-items")!];

    this.items.forEach((item, index) => {
      item.classList.add("wrap");
      item.id = `wrap${index}`;
    });

    const container = document.createElement("div");
    container.id = "contain";

    container.append(...this.items);
  }

  init() {
    this.dispatchEvent(new CustomEvent("init"));
    this.setAttribute("data-initializing", "");
    this.updatePositions();
    setTimeout(() => {
      this.removeAttribute("data-initializing");
      this.setAttribute("data-active", "");
    }, 2000);
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
        this.moveCarousel(isReversing ? -1 : 1);
      });

      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  moveCarousel(direction: number) {
    isReversing = direction < 0;

    currentState = (currentState - direction) % count;
    if (currentState < 0) currentState += count;
    this.updatePositions();
  }

  private updatePositions() {
    const wraps = document.querySelectorAll<HTMLElement>(".wrap");
    const balls = document.querySelectorAll<HTMLElement>(".ball");
    wraps.forEach((wrap, index) => {
      let positionIndex = (index + currentState) % count;
      if (positionIndex < 0) positionIndex += count;
      const position = positions[positionIndex];
      wrap.style.transform = `translate(calc(50cqw + ${position.translate}cqw - 50%), -50%)`;
      wrap.style.zIndex = (isReversing ? position.reverseZIndex : position.zIndex).toString();
      balls[index].style.transform = `scale(${position.scale})`;
      balls[index].dataset.z = wrap.style.zIndex;
    });
  }
}

export function definePespectiveCarousel(tagName = "perspective-carousel") {
  customElements.define(tagName, PerspectiveCarousel);
}
