import { definePespectiveCarousel, PerspectiveCarousel } from "./lib/depth-carousel/perspective-carousel";
import "./style.css";

definePespectiveCarousel();

const carousels = [...document.querySelectorAll<PerspectiveCarousel>("perspective-carousel")];

carousels.forEach((carousel, index) => {
  setTimeout(() => {
    carousel.rotate(5);
  }, 1000);
  setTimeout(() => {
    carousel.rotate(-5);
  }, 4000);
});
