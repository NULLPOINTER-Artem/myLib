var html = document.documentElement;
var body = document.body;

var scroller = {
  target: document.querySelector("#scroll-container"),
  ease: 0.03, // <= scroll speed
  endY: 0,
  y: 0,
  resizeRequest: 1,
  scrollRequest: 0,
};

var requestId = null;

TweenLite.set(scroller.target, {
  rotation: 0.01,
  force3D: true
});

window.addEventListener("load", onLoad);

function onLoad() {
  updateScroller();
  window.focus();
  window.addEventListener("resize", onResize);
  document.addEventListener("scroll", onScroll);
}

function updateScroller() {

  var resized = scroller.resizeRequest > 0;

  if (resized) {
    var height = scroller.target.clientHeight;
    body.style.height = height + "px";
    scroller.resizeRequest = 0;
  }

  var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

  scroller.endY = scrollY;
  scroller.y += (scrollY - scroller.y) * scroller.ease;

  if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
    scroller.y = scrollY;
    scroller.scrollRequest = 0;
  }

  TweenLite.set(scroller.target, {
    y: -scroller.y
  });

  requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
}

function onScroll() {
  scroller.scrollRequest++;
  if (!requestId) {
    requestId = requestAnimationFrame(updateScroller);
  }
}

function onResize() {
  scroller.resizeRequest++;
  if (!requestId) {
    requestId = requestAnimationFrame(updateScroller);
  }
}

// gsap luce
/*
    const html = document.documentElement;
    const body = document.body;
    gsap.config({
      force3D: true,
    });
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const scroller = {
      target: scrollerTarget,
      ease: 0.03, // <= scroll speed
      endY: 0,
      y: 0,
      resizeRequest: 1,
      scrollRequest: 0,
    };

    let requestId: any = null;

    gsap.set(scroller.target, { rotation: 0.01 });

    onNuxtReady(onLoad);

    function onLoad() {
      updateScroller();
      window.focus();
      window.addEventListener("resize", onResize);
      document.addEventListener("scroll", onScroll);
    }

    function updateScroller() {
      const resized = scroller.resizeRequest > 0;

      if (resized) {
          console.log('resized');
          var height = scroller.target.clientHeight;
          body.style.height = height + "px";
          scroller.resizeRequest = 0;
      }

      const scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

      scroller.endY = scrollY;
      scroller.y += (scrollY - scroller.y) * scroller.ease;

      if (Math.abs(scrollY - scroller.y) < scroller.ease || resized) {
          scroller.y = scrollY;
          scroller.scrollRequest = 0;
      }

      gsap.set(scroller.target, {
          y: -scroller.y
      });

      requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
    }

    function onScroll() {
      scroller.scrollRequest++;
      if (!requestId) {
          requestId = requestAnimationFrame(updateScroller);
      }
      ScrollTrigger.update();
    }

    function onResize() {
      scroller.resizeRequest++;
      if (!requestId) {
          requestId = requestAnimationFrame(updateScroller);
      }
    }

    ScrollTrigger.scrollerProxy(scroller.target, {

    })

    ScrollTrigger.defaults({
      scroller: scroller.target
    })
*/

// native GSAP Smooth Vertical Scroller
/**
 * import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

function smoothScroll(content: Element, viewport: Element, smoothness: number) {
  content = gsap.utils.toArray(content)[0];
  smoothness = smoothness || 1;

  gsap.set(viewport || content.parentNode, { overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0 });
  gsap.set(content, { overflow: "visible", width: "100%", transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' });

  const getProp = gsap.getProperty(content);
  const setProp = gsap.quickSetter(content, "y", "px");
  const setScroll = ScrollTrigger.getScrollFunc(window);
  const removeScroll = () => content.style.overflow = "visible";
  const killScrub = (trigger: any) => {
    let scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
    scrub && scrub.pause();
    trigger.animation.progress(trigger.progress);
  };
  let height: any = null;
  let isProxyScrolling: any = null;

  function refreshHeight() {
    height = content.clientHeight;
    content.style.overflow = "visible"
    document.body.style.height = height + "px";
    return height - document.documentElement.clientHeight;
  }

  ScrollTrigger.addEventListener("refresh", () => {
    removeScroll();
    requestAnimationFrame(removeScroll);
  })
  ScrollTrigger.defaults({ scroller: content });

  ScrollTrigger.scrollerProxy(content, {
    scrollTop(value) {
      if (value) {
        isProxyScrolling = true;
        setProp(-value);
        setScroll(value);
        return;
      }

      return -getProp("y");
    },
    scrollHeight: () => document.body.scrollHeight,
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    }
  });

  return ScrollTrigger.create({
    animation: gsap.fromTo(content, { y: 0 }, {
      y: () => document.documentElement.clientHeight - height,
      ease: "none",
      onUpdate: ScrollTrigger.update
    }),
    scroller: window,
    invalidateOnRefresh: true,
    start: 0,
    end: refreshHeight,
    refreshPriority: -999,
    scrub: smoothness,
    onUpdate: self => {
      if (isProxyScrolling) {
        killScrub(self);
        isProxyScrolling = false;
      }
    },
    onRefresh: killScrub
  });
}

export default defineNuxtPlugin(() => {
  if (process.client) {
    gsap.config({
      force3D: true,
    });
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    const scrollerTarget = document.querySelector("#scroll-container");
    const viewport = document.querySelector(".viewport");

    if (scrollerTarget && viewport) {
      const smoothScroller = smoothScroll(scrollerTarget, viewport, 3);
    }
  }
});

 */

// native GSAP Smooth Vertical Scroller
/**
 * function smoothScrollHorizontal(container: Element, endOffsetWidth: number, smoothness: number) {
  return gsap.to(container, {
    x: () => -(endOffsetWidth - window.innerWidth) + "px",
    ease: "none",
    scrollTrigger: {
      trigger: container,
      invalidateOnRefresh: true,
      start: 'top top',
      pin: true,
      scrub: smoothness,
      end: () => "+=" + endOffsetWidth + "px",
    }
  });
}

// set all horizontal scroll
          const scrollContainers = document.querySelectorAll(".horizontal-scroll-container");

          if (scrollContainers && scrollContainers.length) {
            let endOffsetWidth: number = 0;

            scrollContainers.forEach((container) => {
              const containerSections = gsap.utils.toArray(".horizontal-scroll-section");

              if (containerSections && containerSections.length) {
                endOffsetWidth = containerSections.reduce((acc: number, section: any) => {
                  acc += section.offsetWidth || section.clientWidth;
                  return acc;
                }, 0);

                const horizontalSmoothScroller = smoothScrollHorizontal(container, endOffsetWidth, 3);

                // ! OLD variant of the hornt. scroll
                // gsap.to(containerSections, {
                //   x: () => `-${endOffsetWidth - window.innerWidth}`,
                //   //TODO: Remove xPercent comment after horizontal scroll tests passed
                //   //xPercent: -100 * (containerSections.length - 1),
                //   scrollTrigger: {
                //     trigger: container,
                //     scrub: true,
                //     start: "top top",
                //     pin: true,
                //     end: () => "+=" + endOffsetWidth + "px",
                //   },
                // });
              }
            });
          }
 */

          // FINAL VERSION ON NUXT WITH GSAP
          /**
           * 
           * html {
              overscroll-behavior: none;
              scroll-behavior: smooth;
            }

            body {
              overscroll-behavior: none;
              scroll-behavior: auto;
              overflow-x: hidden;
              overflow-y: scroll;

              &.stop-scroll {
                overflow: hidden;
              }
            }

            .viewport {
              overflow: hidden;
              position: fixed;
              height: 100%;
              width: 100%;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
            }

            .scroll-container {
              backface-visibility: hidden;
              transform-style: preserve-3d;
            }

           * 
           * <template>
              <div id="luce-sposa">
                <canvas class="grain-bg"></canvas>

                <div class="viewport">
                  <div id="scroll-container" class="scroll-container">
                    <slot />
                  </div>
                </div>
              </div>
            </template>

            <script setup lang="ts"></script>

            <style lang="scss"></style>

           * import { gsap } from "gsap";
              import { ScrollTrigger } from "gsap/ScrollTrigger";
              import { ScrollToPlugin } from "gsap/ScrollToPlugin";

              function smoothScroll(content: Element, viewport: Element, smoothness: number) {
                content = gsap.utils.toArray(content)[0];
                smoothness = smoothness || 1;

                gsap.set(viewport || content.parentNode, {
                  overflow: "hidden",
                  position: "fixed",
                  height: "100%",
                  width: "100%",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                });
                gsap.set(content, {
                  overflow: "visible",
                  width: "100%",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                });

                const getProp = gsap.getProperty(content);
                const setProp = gsap.quickSetter(content, "y", "px");
                const setScroll = ScrollTrigger.getScrollFunc(window);
                const removeScroll = () => (content.style.overflow = "visible");
                const killScrub = (trigger: any) => {
                  let scrub = trigger.getTween();
                  scrub && scrub.pause();
                  trigger.animation.progress(trigger.progress);
                };
                let height: any = null;
                let isProxyScrolling: any = null;
                let pause: boolean = false;
                let propertyY: any = null;

                // set height on body
                function refreshHeight() {
                  height = content.clientHeight;
                  content.style.overflow = "visible";
                  document.body.style.height = height + "px";
                  return height - document.documentElement.clientHeight;
                }

                ScrollTrigger.addEventListener("refresh", () => {
                  removeScroll();
                  requestAnimationFrame(removeScroll);
                });
                ScrollTrigger.defaults({ scroller: content });

                ScrollTrigger.scrollerProxy(content, {
                  scrollTop(value) {
                    if (value) {
                      isProxyScrolling = true;
                      setProp(-value);
                      setScroll(value);
                      return;
                    }

                    return -getProp("y");
                  },
                  scrollHeight: () => {
                    return document.body.scrollHeight;
                  },
                  getBoundingClientRect() {
                    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
                  },
                });

                const paused = (val: boolean) => {
                  pause = val;
                  propertyY = -getProp("y");

                  if (val) {
                    document.body.classList.add('stop-scroll');
                  } else {
                    document.body.classList.remove('stop-scroll');
                  }
                };

                return {
                  scroller: ScrollTrigger.create({
                    animation: gsap.fromTo(
                      content,
                      { y: 0, },
                      {
                        y: () => {
                          return document.documentElement.clientHeight - height;
                        },
                        ease: "none",
                        onUpdate: () => {
                          if (pause) {
                            setProp(-propertyY);
                          } else {
                            ScrollTrigger.update();
                            refreshHeight();
                          }
                        },
                      }
                    ),
                    scroller: window,
                    invalidateOnRefresh: true,
                    start: 0,
                    end: refreshHeight,
                    refreshPriority: -999,
                    scrub: smoothness,
                    onUpdate: (self) => {
                      if (isProxyScrolling) {
                        killScrub(self);
                        isProxyScrolling = false;
                      }
                    },
                    onRefresh: killScrub,
                  }),
                  refreshHeight,
                  paused
                };
              }

              export default defineNuxtPlugin((nuxtApp) => {
                if (process.client) {
                  gsap.config({
                    force3D: true,
                  });
                  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
                  ScrollTrigger.normalizeScroll({
                    allowNestedScroll: true,
                    lockAxis: false,
                    momentum: (self: any) => Math.min(3, self.velocityY / 1000),
                    type: 'touch,wheel,pointer'
                  });

                  setTimeout(() => {
                    const scrollerTarget = document.querySelector("#scroll-container");
                    const viewport = document.querySelector(".viewport");

                    if (scrollerTarget && viewport) {
                      const { scroller, refreshHeight, paused } = smoothScroll(scrollerTarget, viewport, 3);
                      const resetScrolling = () => {
                        scroller.disable();
                        scroller.refresh();

                        setTimeout(() => {
                          scroller.enable();
                        }, 0);
                      };

                      // set scroll-position (x: 0, y: 0) on each routing
                      nuxtApp.hook('page:start', resetScrolling);
                      nuxtApp.hook('page:finish', resetScrolling);

                      // provide into components
                      // e.x. const nuxtApp = useNuxtApp(); && nuxtApp.$smoothScroller
                      nuxtApp.provide('smoothScroller', {
                        scrollTriggerInstance: scroller,
                        refreshHeight,
                        paused
                      });
                    }
                  }, 0);
                }
              });

           */