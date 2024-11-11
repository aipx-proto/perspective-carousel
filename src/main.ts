import { definePespectiveCarousel, PerspectiveCarousel } from "./lib/depth-carousel/perspective-carousel";
import "./style.css";

definePespectiveCarousel();

const carousels = [...document.querySelectorAll<PerspectiveCarousel>("perspective-carousel")];

carousels.forEach((carousel, index) => {
  setTimeout(() => {
    carousel.moveCarouselRelative(5);
  }, 1000);
  setTimeout(() => {
    carousel.moveCarouselRelative(-5);
  }, 4000);
});
