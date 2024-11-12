# Quick start

![interim](https://github.com/user-attachments/assets/539c0231-599d-4035-9b40-97533c9dc4cc)

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

/** Query current focus element */
console.log(carousel.focusedItem);

/** Handle events */
carousel.addEventListener("rotatestart", (event) => {
  const { oldFocus, newFocus } = event.detail;
});

carousel.addEventListener("rotateend", (event) => {
  const { oldFocus, newFocus } = event.detail;
});
```

More examples are available in `/index.html`. You can run a local dev server to play with them live:

```bash
npm install
npm run dev

# Open browser and navigate to http://localhost:5173
```

## Usage note

- Use `fade-mode="lighten"` only on light background, `fade-mode="darken"` on dark background. The default is no fading effect.
- The container will center the items, but it's your responsibility to set the width and height of the container and items each respectively while avoiding overflow.
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

## React integration

To integrate into React, you can copy paste the source code under `/src/perspective-carouse/` into your project.
See reference implementation on StackBlitz: https://stackblitz.com/edit/perspective-carousel-react?file=src%2Fmain.tsx
