# Quick start

```html
<script src="https://esm.sh/gh/chuanqisun/perspective-carousel@0.0.5/src/lib.ts" type="module"></script>

<style>
  @import url("https://esm.sh/gh/chuanqisun/perspective-carousel@0.0.5/src/lib.css");
</style>

<button id="prev">Prev</button>
<button id="next">Next</button>

<div class="container" style="width: 100vw; height: 50vh">
  <perspective-carousel fade-mode="lighten">
    <carousel-item>
      <img src="https://placehold.co/100x200?text=1" />
    </carousel-item>
    <carousel-item>
      <img src="https://placehold.co/100x200?text=2" />
    </carousel-item>
    <carousel-item>
      <img src="https://placehold.co/100x200?text=3" />
    </carousel-item>
    <carousel-item>
      <img src="https://placehold.co/100x200?text=4" />
    </carousel-item>
    <carousel-item>
      <img src="https://placehold.co/100x200?text=5" />
    </carousel-item>
  </perspective-carousel>
</div>

<script>
  document.getElementById("next").onclick = () => document.querySelector("perspective-carousel").rotate(1);
  document.getElementById("prev").onclick = () => document.querySelector("perspective-carousel").rotate(-1);
</script>
```

To integrate into React, you can copy paste the source code under `/src/perspective-carouse/` into your project.
See reference implementation on StackBlitz: https://stackblitz.com/edit/perspective-carousel-react?file=src%2Fmain.tsx

More examples are available in `/index.html`. You can run a local dev server to play with them live:

```bash
npm install
npm run dev

# Open browser and navigate to http://localhost:5173
```

## APIs

> [!IMPORTANT]
> The carousel can only support 3, 4, or 5 items. It looks the best with 3 or 5 items.

```html
<perspective-carousel>
  <carousel-item> Item 1 </carousel-item>
  <carousel-item> Item 2 </carousel-item>
  <carousel-item> Item 3 </carousel-item>
</perspective-carousel>
```

```typescript
const carousel = document.querySelector("perspective-carousel") as PerspectiveElement;

/** Rotate the carousel by a number of stops. */
carousel.rotateByOffset(relativeStops: number): void;

/** Rotate the carousel to a specific index. */
carousel.rotateToIndex(absoluteIndex: number): void;

/** Rotate the carousel to a specific element (or the <carousel-item> that contains the element. */
carousel.rotateToElement(targetElement: HTMLElement): void;

```

## Usage note

- Use `fade-mode="lighten"` only on light background, `fade-mode="darken"` on dark background. The default is no fading effect.
- The container will center the items, but it's your responsibility set the width and height of the container and items each respectively and avoid overflow.
- The carousel cannot merge rotation calls. So instead of this:
  ```js
  document.querySelector("perspective-carousel").rotateByOffset(1);
  document.querySelector("perspective-carousel").rotateByOffset(1);
  document.querySelector("perspective-carousel").rotateByOffset(1);
  ```
  You should do this
  ```js
  document.querySelector("perspective-carousel").rotateByOffset(3);
  ```
- The carousel will emit events before and after each step in the rotation. See `main.ts` for example.
