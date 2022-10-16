const startWithHash = (value: string): boolean => {
    return value.split('')[0] === '#';
}

const checkEmpty = (values: string[]): boolean => {
    values.forEach(value => {
        if (value == null) {
            return true;
        }
        if (value.toString() === '') {
            return true;
        }
    });

    return false;
}

export {
    checkEmpty,
    startWithHash,
}