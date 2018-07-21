/**
 * Created by ShaLi on 07/01/2016.
 */
'use strict';
//var should = require('should');
var path = require('path');
var fs = require('fs');
require('chai').should();
var lightMarkdown = require('../.build/light-markdown.js');


var casesDir = path.join(__dirname, 'cases');
var testCases = fs.readdirSync(casesDir)
    .map(function (file) {
        var fileExtIndex = file.indexOf('.lmd');
        var filePath = path.join(casesDir, file);
        if (fileExtIndex !== -1 && fs.statSync(filePath).isFile()) {
            var testName = file.substring(0, fileExtIndex);
            var matchingHtmlFile = path.join(casesDir, testName + '.html');
            if (fs.existsSync(matchingHtmlFile) && fs.statSync(matchingHtmlFile).isFile()) {
                return {
                    name: testName.replace(/-/g, ' '),
                    lmd: fs.readFileSync(filePath, 'utf-8'),
                    expectedHtml: fs.readFileSync(matchingHtmlFile, 'utf-8')
                };
            }
        }
    })
    .filter(function (file) {
        return file;
    });

describe('Light Markdown', function () {
    testCases.forEach(function (testCase) {
        it(testCase.name, function () {
            var actualHtml = lightMarkdown.toHtml(testCase.lmd);
            actualHtml.should.equal(testCase.expectedHtml);
        });
    });
});