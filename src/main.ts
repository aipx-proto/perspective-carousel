import { definePespectiveCarousel, PerspectiveCarousel } from "./lib/depth-carousel/perspective-carousel";

const carousel = document.querySelector<PerspectiveCarousel>("perspective-carousel")!;

definePespectiveCarousel();

// move items into the proper position
carousel.init();

carousel.moveCarouselRelative(2);
