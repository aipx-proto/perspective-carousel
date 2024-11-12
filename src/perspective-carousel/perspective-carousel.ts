import "./perspective-carousel.css";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "perspective-carousel": any;
      "carousel-item": any;
    }
  }
}

export interface RotateStartEventDetail {
  oldFocus: HTMLElement;
  newFocus: HTMLElement;
}

export interface RotateEndEventDetail {
  oldFocus: HTMLElement;
  newFocus: HTMLElement;
}

export class PerspectiveCarouselElement extends HTMLElement {
  private currentState = 0;
  private isReversing = false;
  private absoluteItems: HTMLElement[] = [];
  private layout: {
    translate: number;
    scale: number;
    zIndex: number;
    reverseZIndex: number;
  }[] = [];

  connectedCallback() {
    this.absoluteItems = [...this.querySelectorAll<HTMLElement>("carousel-item")!];

    const matchingLayout = getLayouts().find((layout) => layout.forLength === this.absoluteItems.length);
    if (!matchingLayout) throw new Error(`No layout found for ${this.absoluteItems.length} items. We only support 3, 4, or 5 items`);
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
    return this.absoluteItems[this.focusedItemIndex];
  }

  get items() {
    const positionedItems = this.#getBarrelShiftedArray(this.absoluteItems, this.currentOffset);
    switch (this.layout.length) {
      case 3:
        return [
          {
            posiotion: "Left",
            element: positionedItems[0],
          },
          {
            posiotion: "Center",
            element: positionedItems[1],
          },
          {
            posiotion: "Right",
            element: positionedItems[2],
          },
        ];
      case 4:
        return [
          {
            posiotion: "Left",
            element: positionedItems[0],
          },
          {
            posiotion: "Center",
            element: positionedItems[1],
          },
          {
            posiotion: "Right",
            element: positionedItems[2],
          },
          {
            posiotion: "Back",
            element: positionedItems[3],
          },
        ];
      case 5:
        return [
          {
            posiotion: "Left",
            element: positionedItems[0],
          },
          {
            posiotion: "Front Center",
            element: positionedItems[1],
          },
          {
            posiotion: "Right",
            element: positionedItems[2],
          },
          {
            posiotion: "Back Right",
            element: positionedItems[3],
          },
          {
            posiotion: "Back Left",
            element: positionedItems[4],
          },
        ];

      default:
        throw new Error(`Unsupported layout length: ${this.layout.length}. We only support 3, 4, or 5 items`);
    }
  }

  /** Rotate to a specific <carousel-item> or its descendent, with the fewest number of stops */
  async rotateToElement(element: HTMLElement) {
    const index = this.absoluteItems.findIndex((carouselElement) => carouselElement.contains(element));
    if (index === -1) throw new Error("Element not found in carousel");
    this.rotateToIndex(index);
  }

  async rotateToIndex(index: number) {
    const positiveOffset = this.#smallestPositiveModulo(index - this.focusedItemIndex, this.layout.length);
    const negativeOffset = this.#largestNegativeModulo(index - this.focusedItemIndex, this.layout.length);
    if (Math.abs(negativeOffset) < positiveOffset) {
      await this.rotateByOffset(negativeOffset);
    } else {
      await this.rotateByOffset(positiveOffset);
    }
  }

  async rotateByOffset(offset: number) {
    const isReversing = offset < 0;
    let absOffset = Math.abs(offset);
    const startFocus = this.focusedItem;
    const endFocus = this.absoluteItems[this.#smallestPositiveModulo(this.focusedItemIndex + offset, this.layout.length)];

    if (absOffset > 0) {
      this.dispatchEvent(
        new CustomEvent<RotateStartEventDetail>("rotatestart", {
          detail: {
            oldFocus: startFocus,
            newFocus: endFocus,
          },
        })
      );

      while (absOffset > 0) {
        await new Promise((resolve) => {
          absOffset--;
          this.addEventListener("transitionend", resolve, { once: true });
          this.#moveCarouselInternal(isReversing ? -1 : 1);
        });

        if (absOffset === 0) {
          this.dispatchEvent(
            new CustomEvent<RotateStartEventDetail>("rotateend", {
              detail: {
                oldFocus: startFocus,
                newFocus: endFocus,
              },
            })
          );
        }

        await new Promise((resolve) => setTimeout(resolve, 10));
      }
    }
  }

  #smallestPositiveModulo(n: number, m: number) {
    return ((n % m) + m) % m;
  }
  #largestNegativeModulo(n: number, m: number) {
    return ((n % m) - m) % m;
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

  #getBarrelShiftedArray<T>(arr: T[], direction: number): T[] {
    const n = arr.length;
    const shift = ((direction % n) + n) % n;
    return [...arr.slice(shift), ...arr.slice(0, shift)];
  }
}

function getLayouts() {
  return [
    {
      forLength: 3,
      layout: [
        /** 3 inline */
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
    },
    {
      forLength: 4,
      layout: [
        /** 3 front, 1 back */
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
    },
    {
      forLength: 5,
      layout:
        /** 3 front, 2 back */
        [
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
    },
  ];
}

export function definePespectiveCarousel(tagName = "perspective-carousel") {
  customElements.define(tagName, PerspectiveCarouselElement);
}
