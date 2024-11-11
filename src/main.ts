import { definePespectiveCarousel, PerspectiveCarousel } from "./lib/depth-carousel/perspective-carousel";
import "./style.css";

const carousel = document.querySelector<PerspectiveCarousel>("perspective-carousel")!;

definePespectiveCarousel();

setTimeout(() => {
  carousel.moveCarouselRelative(5);
}, 1000);

setTimeout(() => {
  carousel.moveCarouselRelative(-5);
}, 4000);
