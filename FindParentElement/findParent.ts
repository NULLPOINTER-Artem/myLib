function findParent(el: HTMLElement, cls: string) {
    const parentEl = el.parentElement;

    // fail end
    if (parentEl && parentEl.isEqualNode(document.querySelector('body'))) {
        return null;
    }

    // success end
    if (parentEl && parentEl.classList.contains(cls)) {
        return parentEl;
    }

    // continue
    if (parentEl) {
        return findParent(parentEl, cls);
    } else {
        // full fail
        return null;
    }
}
