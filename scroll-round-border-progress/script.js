function getScrollPercent() {
    var docElem = document.documentElement,
        bodyElem = document.body,
        scrollTop = 'scrollTop',
        scrollHeight = 'scrollHeight';
    return Math.round((docElem[scrollTop] || bodyElem[scrollTop]) / ((docElem[scrollHeight] || bodyElem[scrollHeight]) - docElem.clientHeight) * 100);
}

const onLoad = () => {
    const progressBar = document.querySelector('.progress-desktop')
    const progressValue = document.querySelector('.progress-value')

    if (progressBar && progressValue) {
        const onScroll = () => {
            const percentOfScroll = getScrollPercent()

            progressBar.setAttribute('style', `background: conic-gradient(rgb(29, 202, 108) ${percentOfScroll}%, rgb(240, 240, 240) ${percentOfScroll}%);`)
            progressValue.textContent = percentOfScroll + '%'
        }

        window.addEventListener('scroll', onScroll)
    }
}

document.addEventListener('DOMContentLoaded', onLoad)