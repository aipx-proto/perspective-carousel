import { definePespectiveCarousel, PerspectiveCarousel, RotateStartEventDetail } from "./lib/depth-carousel/perspective-carousel";
import "./style.css";

definePespectiveCarousel();

const carousels = [...document.querySelectorAll<PerspectiveCarousel>("perspective-carousel")];

const lastCarousel = carousels.at(-1)!;

// Demo: rotate forward, then rotate backward
carousels.forEach((carousel, index) => {
  setTimeout(() => {
    carousel.rotate(5);
  }, 1000);
  setTimeout(() => {
    carousel.rotate(-5);
  }, 4000);
});

// emit before animation starts
lastCarousel.addEventListener("rotatestart", (event) => {
  // In "rotatestart", focusedItem is the old focus
  console.log(`Old focus is: ${getLastCarouselItemLabel(lastCarousel.focusedItem)}`);

  const { oldFocus, newFocus } = (event as CustomEvent<RotateStartEventDetail>).detail;
  console.log(`focus will move: ${getLastCarouselItemLabel(oldFocus)} -> ${getLastCarouselItemLabel(newFocus)}.`);
});

lastCarousel.addEventListener("rotateend", (event) => {
  const { oldFocus, newFocus } = (event as CustomEvent<RotateStartEventDetail>).detail;
  console.log(`focus did move: ${getLastCarouselItemLabel(oldFocus)} -> ${getLastCarouselItemLabel(newFocus)}`);

  // In "rotateend", focusedItem is the new focus
  console.log(`New focus is: ${getLastCarouselItemLabel(lastCarousel.focusedItem)}`);
});

function getLastCarouselItemLabel(e: HTMLElement) {
  return e.querySelector("p")!.textContent;
}
