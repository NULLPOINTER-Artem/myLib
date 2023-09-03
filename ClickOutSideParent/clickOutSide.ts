const clickOutSide = (event: any) => {
    // componentWrapperRef.current element of the component for unify start node
    if (componentWrapperRef.current) {
        const { target } = event;
        const parentElement = findParent(componentWrapperRef.current, 'form-group');

        if (target && parentElement) {
            if (
                parentElement.isEqualNode(target) ||
                parentElement.contains(target) ||
                target.classList.contains(DATEPICKER_YEAR_OPTION) // Exception selector (render dynamically)
            ) {
                return;
            } else {
                closePicker();
            }
        }
    }
};