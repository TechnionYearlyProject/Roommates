const expect = require('expect');

const tag = require('../../../server/models/tag');

const supportedTags = tag.getSupportedTags();

describe('Tag Tests', () => {

    describe('#isSupportedTagId', () => {
        it('should return false - not supported tag id', (done) => {
        	expect(tag.isSupportedTagId(0)).toBe(false);
        	done();
        });

        it('should return true - first tag id', (done) => {
        	expect(tag.isSupportedTagId(supportedTags[0]._id)).toBe(true);
        	done();
        });

        it('should return true - last tag id', (done) => {
        	expect(tag.isSupportedTagId(supportedTags[supportedTags.length-1]._id)).toBe(true);
        	done();
        });
    });

    describe('#isSupportedTagName', () => {
        it('should return false - not supported tag name', (done) => {
            expect(tag.isSupportedTagName('test')).toBe(false);
            done();
        });

        it('should return true - first supported tag name', (done) => {
            expect(tag.isSupportedTagName(supportedTags[0].name)).toBe(true);
            done();
        });

        it('should return true - last supported tag name', (done) => {
            expect(tag.isSupportedTagName(supportedTags[supportedTags.length-1].name)).toBe(true);
            done();
        });

        it('should return true - case insensetive', (done) => {
            expect(tag.isSupportedTagName(supportedTags[supportedTags.length-1].name.toLowerCase())).toBe(true);
            done();
        });
    });
});