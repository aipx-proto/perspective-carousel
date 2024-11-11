import "./perspective-carousel.css";

const layouts = {
  /** 3 inline */
  three: [
    {
      translate: -30,
      scale: 0.6,
      zIndex: 2,
      reverseZIndex: 1,
    },
    {
      translate: 0,
      scale: 1,
      zIndex: 3,
      reverseZIndex: 3,
    },
    {
      translate: 30,
      scale: 0.6,
      zIndex: 1,
      reverseZIndex: 2,
    },
  ],
  /** 3 front, 1 back */
  four: [
    {
      translate: -30,
      scale: 0.6,
      zIndex: 4,
      reverseZIndex: 4,
    },
    {
      translate: 0,
      scale: 1,
      zIndex: 3,
      reverseZIndex: 3,
    },
    {
      translate: 30,
      scale: 0.6,
      zIndex: 2,
      reverseZIndex: 2,
    },
    {
      translate: 0,
      scale: 0.35,
      zIndex: 1,
      reverseZIndex: 1,
    },
  ],
  /** 3 front, 2 back */
  five: [
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
      zIndex: 3,
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
  ],
};

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

    this.items.forEach((item, index) => {
      item.classList.add("wrap");
      item.id = `wrap${index}`;
    });

    switch (this.items.length) {
      case 3: {
        this.layout = layouts.three;
        break;
      }
      case 4: {
        this.layout = layouts.four;
        break;
      }
      case 5: {
        this.layout = layouts.five;
        break;
      }
      default:
        throw new Error(`The component only supports 3, 4, or 5 items. You provided ${this.items.length}`);
    }

    const container = this;
    container.id = "contain";

    container.append(...this.items);

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
