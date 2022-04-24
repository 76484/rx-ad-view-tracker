import { from } from "rxjs";
import { map } from "rxjs/operators";

const adEls = Array.from(document.querySelectorAll("#Ads li"));

from(adEls)
  .pipe(
    map((adEl, index) => ({
      index,
      text: adEl.innerText,
    }))
  )
  .subscribe((ad) => console.log(ad));
