import { checkEmpty, startWithHash } from "./checks";

describe('Employee Service', () => {
    it("should return true if string start with #", () => {
        const actual = startWithHash('#e1223');
        expect(actual).toBeTruthy();
    });

    it("should return false if string not start with #", () => {
        const actual = startWithHash('e1223');
        expect(actual).toBeFalsy();
    });

    it("should return false if array does not contain empty strings", () => {
        // empty array
        const actual1 = checkEmpty([]);
        expect(actual1).toBeFalsy();

        // only 1 string
        const actual2 = checkEmpty(['test']);
        expect(actual2).toBeFalsy();

        // multiple strings
        const actual3 = checkEmpty(['test', 'test2', '123', '131']);
        expect(actual3).toBeFalsy();

    });

    it("should return true if array contain empty string", () => {
        const actual1 = checkEmpty([null]);
        expect(actual1).toBeTruthy();

        const actual2 = checkEmpty([undefined]);
        expect(actual2).toBeTruthy();

        const actual3 = checkEmpty(['test', '']);
        expect(actual3).toBeTruthy();

        const actual4 = checkEmpty(['test', null]);
        expect(actual4).toBeTruthy();
    });
});