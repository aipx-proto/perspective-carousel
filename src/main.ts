import { definePespectiveCarousel, PerspectiveCarouselElement, RotateStartEventDetail } from "./perspective-carousel/perspective-carousel";
import "./style.css";

definePespectiveCarousel();

const carousels = [...document.querySelectorAll<PerspectiveCarouselElement>("perspective-carousel")];
const lastCarousel = carousels.at(-1)!;

// Demo - Control the carousel
// rotate forward, rotate backward, rotate to index, rotate to first child element
carousels.forEach((carousel, index) => {
  setTimeout(() => {
    carousel.rotateByOffset(3);
  }, 1000);
  setTimeout(() => {
    carousel.rotateByOffset(-3);
  }, 4000);
  setTimeout(() => {
    carousel.rotateToIndex(2);
  }, 7000);
  setTimeout(() => {
    carousel.rotateToElement(carousel.querySelector("carousel-item")!);
  }, 8000);
});

// Demo - Handle the events
lastCarousel.addEventListener("rotatestart", (event) => {
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
