const startWithHash = (value: string): boolean => {
    return value.split('')[0] === '#';
}

const checkEmpty = (values: string[]): boolean => {
    let count = 0
    values.forEach(value => {
        if (value == null) {
            count++;
        }
        value = value ? value.trim() : value;
        if (value === '') {
            count++;
        }
    });
    return count !== 0;;
}

export {
    checkEmpty,
    startWithHash,
}