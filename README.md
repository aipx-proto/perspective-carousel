# Quick start

```html
<script src="https://esm.sh/gh/chuanqisun/perspective-carousel@0.0.3/src/lib.ts" type="module"></script>

<style>
  @import url("https://esm.sh/gh/chuanqisun/perspective-carousel@0.0.3/src/lib.css");
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

More examples available in `/index.html`. You can run a local dev server to play with them live:

```bash
npm install
npm run dev

# Open browser and navigate to http://localhost:5173
```
