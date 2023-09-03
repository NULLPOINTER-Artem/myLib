/**
 * onNuxtReady(() => {
        const lazyVideos = [].slice.call(document.querySelectorAll('video.lazy'))
        const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'))

        if ('IntersectionObserver' in window) {
          const lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (video) {
              if (video.isIntersecting) {
                for (const source in video.target.children) {
                  const videoSource = video.target.children[source]
                  if (typeof videoSource.tagName === 'string' && videoSource.tagName === 'SOURCE') {
                    videoSource.src = videoSource.dataset.src
                  }
                }

                video.target.load()
                video.target.classList.remove('lazy')
                lazyVideoObserver.unobserve(video.target)
              }
            })
          })
          const lazyImageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                const lazyImage = entry.target
                lazyImage.src = lazyImage.dataset.src
                if (lazyImage.dataset.srcset) {
                  lazyImage.srcset = lazyImage.dataset.srcset
                }
                lazyImage.classList.remove('lazy')
                lazyImageObserver.unobserve(lazyImage)
              }
            })
          })

          lazyVideos.forEach(function (lazyVideo) {
            lazyVideoObserver.observe(lazyVideo)
          })
          lazyImages.forEach(function (lazyImage) {
            lazyImageObserver.observe(lazyImage)
          })
        }
      })

      @keyframes shine {
        0% {
            background-position: right;
        }
    }

    video {
        &.lazy {
            background:
            linear-gradient(90deg, #0000 33%, rgba(255, 255, 255, 0.3) 50%, #0000 66%) #979797;
            background-size: 300% 100%;
            animation: shine 2s infinite;
        }
    }

    img {
        transition: opacity 0.5s linear;
        opacity: 1;

        &.lazy {
            opacity: 0.3;
        }
    }

    <img class="lazy" src="~/assets/images/placeholder-img.jpg" data-src="/assets/images/main-inspire-left.jpg" alt="">

    <video
        class="lazy"
        autoplay
        muted
        loop
        playsinline
    >
        <source data-src="/assets/video-block-right.webm" type="video/webm">
        <source data-src="/assets/video-block-right.mp4" type="video/mp4">
    </video>
 */