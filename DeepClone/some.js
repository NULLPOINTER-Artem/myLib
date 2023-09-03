function deepClone(incomeValue, cloneDomElements = false, deepCloneDomElements = false) {
    if (incomeValue === null || typeof incomeValue !== 'object') {
        return incomeValue; // Return non-object values as is
    }

    // Create a new object
    const clone = Array.isArray(incomeValue) ? [] : {};

    // Clone each property
    for (let key in incomeValue) {
        if (incomeValue.hasOwnProperty(key)) {
            if (incomeValue[key] instanceof HTMLElement) {
                clone[key] = cloneDomElements
                    ? deepCloneDomElements
                        ? incomeValue[key].cloneNode(true)
                        : incomeValue[key].cloneNode()
                    : incomeValue[key];
            } else {
                clone[key] = deepClone(incomeValue[key]); // Recursively clone nested objects/arrays
            }
        }
    }

    return clone
}

const obj1 = {
    a: 1,
    b: {
        c: 2,
        d: 3,
        e: {
            s: 4,
            g: 5,
            h: [1, 2, 3],
            fn: (a) => { return a * 2 },
            fn2: function (a) {
                return 'origin' + a;
            },
            domElement: document.querySelector('#one'),
            domElements: document.querySelectorAll('.refer')
        }
    }
};

const obj2 = deepClone(obj1);

obj2.b.e.s = 101;
obj2.b.e.h[0] = 101;
obj2.b.e.fn = () => { return 'copied!!!!' };
obj2.b.e.fn2 = function () { return 'copied fn2 !!!!!!' }

console.log('obj1');
console.dir(obj1);

console.log('obj2');
console.dir(obj2);

console.log('// Arrow FNS');

console.log(`obj1 ${obj1.b.e.fn(2)}`);
console.log(`obj2 ${obj2.b.e.fn(2)}`);

console.log('// Not Arrow FNS');

console.log(`obj1 ${obj1.b.e.fn2(2)}`);
console.log(`obj2 ${obj2.b.e.fn2(2)}`);

// obj1.b.e.domElement.text = 'sdsdsd'
obj2.b.e.domElement.text = 'sdsdsd'