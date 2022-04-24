import { from, Observable } from "rxjs";
import { mergeMap, takeWhile } from "rxjs/operators";

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

    console.log(`start watching ${text}`);
    intersectionObserver.observe(el);

    return () => {
      console.log(`stop watching ${text}`);
      intersectionObserver.unobserve(el);
    };
  });
};

const adEls = Array.from(document.querySelectorAll("#Ads li"));

from(adEls)
  .pipe(
    mergeMap((adEl, index) =>
      fromAdEl(adEl, index).pipe(
        takeWhile((watchedAd) => !watchedAd.isInersecting, true)
      )
    )
  )
  .subscribe((watchedAd) => {
    const el = adEls[watchedAd.index];

    el.classList.toggle("in-view", watchedAd.isInersecting);
  });
