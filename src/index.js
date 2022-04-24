import { from, Observable } from "rxjs";
import { mergeMap } from "rxjs/operators";

const fromAdEl = (el, index) => {
  const text = el.innerText;

  return new Observable((observer) => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        observer.next({
          index,
          isInersecting: entry.isIntersecting,
          text,
        });
      },
      { threshold: 0.5 }
    );

    intersectionObserver.observe(el);

    return () => {
      intersectionObserver.unobserve(el);
    };
  });
};

const adEls = Array.from(document.querySelectorAll("#Ads li"));

from(adEls)
  .pipe(mergeMap((adEl, index) => fromAdEl(adEl, index)))
  .subscribe((ad) => console.log(ad));
