import { concat, from, Observable, of, timer } from "rxjs";
import { filter, map, mergeMap, switchMap, takeWhile } from "rxjs/operators";

const fromAdEl = (el, index) => {
  const text = el.innerText;

  return new Observable((observer) => {
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;

        observer.next({
          index,
          isInersecting: entry.isIntersecting,
          isViewed: false,
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
        switchMap((watchedAd) => {
          return concat(
            of(watchedAd),
            of(watchedAd).pipe(
              filter((watchedAd) => watchedAd.isInersecting),
              mergeMap(() => {
                // watchedAd is viewed if is intersecting for > 1 continuous second
                return timer(1010).pipe(
                  map(() => ({
                    ...watchedAd,
                    isViewed: true,
                  }))
                );
              })
            )
          );
        }),
        takeWhile((watchedAd) => !watchedAd.isViewed, true)
      )
    )
  )
  .subscribe((watchedAd) => {
    const el = adEls[watchedAd.index];

    el.classList.toggle("in-view", watchedAd.isInersecting);

    if (watchedAd.isViewed) {
      console.log(`track ${watchedAd.text}`);
      el.classList.add("tracked");
    }
  });
