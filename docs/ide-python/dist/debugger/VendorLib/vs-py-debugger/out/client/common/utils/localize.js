// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

const fs = require("fs");

const path = require("path");

const constants_1 = require("../constants"); // External callers of localize use these tables to retrieve localized values.


var LanguageServiceSurveyBanner;

(function (LanguageServiceSurveyBanner) {
  LanguageServiceSurveyBanner.bannerMessage = localize('LanguageServiceSurveyBanner.bannerMessage', 'Can you please take 2 minutes to tell us how the Python Language Server is working for you?');
  LanguageServiceSurveyBanner.bannerLabelYes = localize('LanguageServiceSurveyBanner.bannerLabelYes', 'Yes, take survey now');
  LanguageServiceSurveyBanner.bannerLabelNo = localize('LanguageServiceSurveyBanner.bannerLabelNo', 'No, thanks');
})(LanguageServiceSurveyBanner = exports.LanguageServiceSurveyBanner || (exports.LanguageServiceSurveyBanner = {}));

var Interpreters;

(function (Interpreters) {
  Interpreters.loading = localize('Interpreters.LoadingInterpreters', 'Loading Python Interpreters');
  Interpreters.refreshing = localize('Interpreters.RefreshingInterpreters', 'Refreshing Python Interpreters');
})(Interpreters = exports.Interpreters || (exports.Interpreters = {}));

var DataScienceSurveyBanner;

(function (DataScienceSurveyBanner) {
  DataScienceSurveyBanner.bannerMessage = localize('DataScienceSurveyBanner.bannerMessage', 'Can you please take 2 minutes to tell us how the Python Data Science features are working for you?');
  DataScienceSurveyBanner.bannerLabelYes = localize('DataScienceSurveyBanner.bannerLabelYes', 'Yes, take survey now');
  DataScienceSurveyBanner.bannerLabelNo = localize('DataScienceSurveyBanner.bannerLabelNo', 'No, thanks');
})(DataScienceSurveyBanner = exports.DataScienceSurveyBanner || (exports.DataScienceSurveyBanner = {}));

var DataScience;

(function (DataScience) {
  DataScience.historyTitle = localize('DataScience.historyTitle', 'Python Interactive');
  DataScience.badWebPanelFormatString = localize('DataScience.badWebPanelFormatString', '<html><body><h1>{0} is not a valid file name</h1></body></html>');
  DataScience.sessionDisposed = localize('DataScience.sessionDisposed', 'Cannot execute code, session has been disposed.');
  DataScience.unknownMimeType = localize('DataScience.unknownMimeType', 'Unknown mime type for data');
  DataScience.exportDialogTitle = localize('DataScience.exportDialogTitle', 'Export to Jupyter Notebook');
  DataScience.exportDialogFilter = localize('DataScience.exportDialogFilter', 'Jupyter Notebooks');
  DataScience.exportDialogComplete = localize('DataScience.exportDialogComplete', 'Notebook written to {0}');
  DataScience.exportDialogFailed = localize('DataScience.exportDialogFailed', 'Failed to export notebook. {0}');
  DataScience.exportOpenQuestion = localize('DataScience.exportOpenQuestion', 'Open in browser');
  DataScience.runCellLensCommandTitle = localize('python.command.python.datascience.runcell.title', 'Run cell');
  DataScience.importDialogTitle = localize('DataScience.importDialogTitle', 'Import Jupyter Notebook');
  DataScience.importDialogFilter = localize('DataScience.importDialogFilter', 'Jupyter Notebooks');
  DataScience.notebookCheckForImportTitle = localize('DataScience.notebookCheckForImportTitle', 'Do you want to import the Jupyter Notebook into Python code?');
  DataScience.notebookCheckForImportYes = localize('DataScience.notebookCheckForImportYes', 'Import');
  DataScience.notebookCheckForImportNo = localize('DataScience.notebookCheckForImportNo', 'Later');
  DataScience.notebookCheckForImportDontAskAgain = localize('DataScience.notebookCheckForImportDontAskAgain', 'Don\'t Ask Again');
  DataScience.jupyterNotSupported = localize('DataScience.jupyterNotSupported', 'Jupyter is not installed');
  DataScience.jupyterNbConvertNotSupported = localize('DataScience.jupyterNbConvertNotSupported', 'Jupyter nbconvert is not installed');
  DataScience.pythonInteractiveHelpLink = localize('DataScience.pythonInteractiveHelpLink', 'See [https://aka.ms/pyaiinstall] for help on installing jupyter.');
  DataScience.importingFormat = localize('DataScience.importingFormat', 'Importing {0}');
  DataScience.startingJupyter = localize('DataScience.startingJupyter', 'Starting Jupyter Server');
  DataScience.runAllCellsLensCommandTitle = localize('python.command.python.datascience.runallcells.title', 'Run all cells');
  DataScience.restartKernelMessage = localize('DataScience.restartKernelMessage', 'Do you want to restart the Jupter kernel? All variables will be lost.');
  DataScience.restartKernelMessageYes = localize('DataScience.restartKernelMessageYes', 'Restart');
  DataScience.restartKernelMessageNo = localize('DataScience.restartKernelMessageNo', 'Cancel');
  DataScience.restartingKernelStatus = localize('DataScience.restartingKernelStatus', 'Restarting Jupyter Kernel');
  DataScience.executingCode = localize('DataScience.executingCode', 'Executing Cell');
  DataScience.collapseAll = localize('DataScience.collapseAll', 'Collapse all cell inputs');
  DataScience.expandAll = localize('DataScience.expandAll', 'Expand all cell inputs');
  DataScience.exportKey = localize('DataScience.export', 'Export as Jupyter Notebook');
  DataScience.restartServer = localize('DataScience.restartServer', 'Restart iPython Kernel');
  DataScience.undo = localize('DataScience.undo', 'Undo');
  DataScience.redo = localize('DataScience.redo', 'Redo');
  DataScience.clearAll = localize('DataScience.clearAll', 'Remove All Cells');
})(DataScience = exports.DataScience || (exports.DataScience = {})); // Skip using vscode-nls and instead just compute our strings based on key values. Key values
// can be loaded out of the nls.<locale>.json files


let loadedCollection;
let defaultCollection;
const askedForCollection = {};
let loadedLocale;

function localize(key, defValue) {
  // Return a pointer to function so that we refetch it on each call.
  return () => {
    return getString(key, defValue);
  };
}

exports.localize = localize;

function getCollection() {
  // Load the current collection
  if (!loadedCollection || parseLocale() !== loadedLocale) {
    load();
  } // Combine the default and loaded collections


  return Object.assign({}, defaultCollection, loadedCollection);
}

exports.getCollection = getCollection;

function getAskedForCollection() {
  return askedForCollection;
}

exports.getAskedForCollection = getAskedForCollection;

function parseLocale() {
  // Attempt to load from the vscode locale. If not there, use english
  const vscodeConfigString = process.env.VSCODE_NLS_CONFIG;
  return vscodeConfigString ? JSON.parse(vscodeConfigString).locale : 'en-us';
}

function getString(key, defValue) {
  // Load the current collection
  if (!loadedCollection || parseLocale() !== loadedLocale) {
    load();
  } // First lookup in the dictionary that matches the current locale


  if (loadedCollection && loadedCollection.hasOwnProperty(key)) {
    askedForCollection[key] = loadedCollection[key];
    return loadedCollection[key];
  } // Fallback to the default dictionary


  if (defaultCollection && defaultCollection.hasOwnProperty(key)) {
    askedForCollection[key] = defaultCollection[key];
    return defaultCollection[key];
  } // Not found, return the default


  askedForCollection[key] = defValue;
  return defValue;
}

function load() {
  // Figure out our current locale.
  loadedLocale = parseLocale(); // Find the nls file that matches (if there is one)

  const nlsFile = path.join(constants_1.EXTENSION_ROOT_DIR, `package.nls.${loadedLocale}.json`);

  if (fs.existsSync(nlsFile)) {
    const contents = fs.readFileSync(nlsFile, 'utf8');
    loadedCollection = JSON.parse(contents);
  } else {
    // If there isn't one, at least remember that we looked so we don't try to load a second time
    loadedCollection = {};
  } // Get the default collection if necessary. Strings may be in the default or the locale json


  if (!defaultCollection) {
    const defaultNlsFile = path.join(constants_1.EXTENSION_ROOT_DIR, 'package.nls.json');

    if (fs.existsSync(defaultNlsFile)) {
      const contents = fs.readFileSync(defaultNlsFile, 'utf8');
      defaultCollection = JSON.parse(contents);
    } else {
      defaultCollection = {};
    }
  }
} // Default to loading the current locale


load();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxvY2FsaXplLmpzIl0sIm5hbWVzIjpbIk9iamVjdCIsImRlZmluZVByb3BlcnR5IiwiZXhwb3J0cyIsInZhbHVlIiwiZnMiLCJyZXF1aXJlIiwicGF0aCIsImNvbnN0YW50c18xIiwiTGFuZ3VhZ2VTZXJ2aWNlU3VydmV5QmFubmVyIiwiYmFubmVyTWVzc2FnZSIsImxvY2FsaXplIiwiYmFubmVyTGFiZWxZZXMiLCJiYW5uZXJMYWJlbE5vIiwiSW50ZXJwcmV0ZXJzIiwibG9hZGluZyIsInJlZnJlc2hpbmciLCJEYXRhU2NpZW5jZVN1cnZleUJhbm5lciIsIkRhdGFTY2llbmNlIiwiaGlzdG9yeVRpdGxlIiwiYmFkV2ViUGFuZWxGb3JtYXRTdHJpbmciLCJzZXNzaW9uRGlzcG9zZWQiLCJ1bmtub3duTWltZVR5cGUiLCJleHBvcnREaWFsb2dUaXRsZSIsImV4cG9ydERpYWxvZ0ZpbHRlciIsImV4cG9ydERpYWxvZ0NvbXBsZXRlIiwiZXhwb3J0RGlhbG9nRmFpbGVkIiwiZXhwb3J0T3BlblF1ZXN0aW9uIiwicnVuQ2VsbExlbnNDb21tYW5kVGl0bGUiLCJpbXBvcnREaWFsb2dUaXRsZSIsImltcG9ydERpYWxvZ0ZpbHRlciIsIm5vdGVib29rQ2hlY2tGb3JJbXBvcnRUaXRsZSIsIm5vdGVib29rQ2hlY2tGb3JJbXBvcnRZZXMiLCJub3RlYm9va0NoZWNrRm9ySW1wb3J0Tm8iLCJub3RlYm9va0NoZWNrRm9ySW1wb3J0RG9udEFza0FnYWluIiwianVweXRlck5vdFN1cHBvcnRlZCIsImp1cHl0ZXJOYkNvbnZlcnROb3RTdXBwb3J0ZWQiLCJweXRob25JbnRlcmFjdGl2ZUhlbHBMaW5rIiwiaW1wb3J0aW5nRm9ybWF0Iiwic3RhcnRpbmdKdXB5dGVyIiwicnVuQWxsQ2VsbHNMZW5zQ29tbWFuZFRpdGxlIiwicmVzdGFydEtlcm5lbE1lc3NhZ2UiLCJyZXN0YXJ0S2VybmVsTWVzc2FnZVllcyIsInJlc3RhcnRLZXJuZWxNZXNzYWdlTm8iLCJyZXN0YXJ0aW5nS2VybmVsU3RhdHVzIiwiZXhlY3V0aW5nQ29kZSIsImNvbGxhcHNlQWxsIiwiZXhwYW5kQWxsIiwiZXhwb3J0S2V5IiwicmVzdGFydFNlcnZlciIsInVuZG8iLCJyZWRvIiwiY2xlYXJBbGwiLCJsb2FkZWRDb2xsZWN0aW9uIiwiZGVmYXVsdENvbGxlY3Rpb24iLCJhc2tlZEZvckNvbGxlY3Rpb24iLCJsb2FkZWRMb2NhbGUiLCJrZXkiLCJkZWZWYWx1ZSIsImdldFN0cmluZyIsImdldENvbGxlY3Rpb24iLCJwYXJzZUxvY2FsZSIsImxvYWQiLCJhc3NpZ24iLCJnZXRBc2tlZEZvckNvbGxlY3Rpb24iLCJ2c2NvZGVDb25maWdTdHJpbmciLCJwcm9jZXNzIiwiZW52IiwiVlNDT0RFX05MU19DT05GSUciLCJKU09OIiwicGFyc2UiLCJsb2NhbGUiLCJoYXNPd25Qcm9wZXJ0eSIsIm5sc0ZpbGUiLCJqb2luIiwiRVhURU5TSU9OX1JPT1RfRElSIiwiZXhpc3RzU3luYyIsImNvbnRlbnRzIiwicmVhZEZpbGVTeW5jIiwiZGVmYXVsdE5sc0ZpbGUiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFDQUEsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFQyxFQUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxNQUFNQyxFQUFFLEdBQUdDLE9BQU8sQ0FBQyxJQUFELENBQWxCOztBQUNBLE1BQU1DLElBQUksR0FBR0QsT0FBTyxDQUFDLE1BQUQsQ0FBcEI7O0FBQ0EsTUFBTUUsV0FBVyxHQUFHRixPQUFPLENBQUMsY0FBRCxDQUEzQixDLENBQ0E7OztBQUNBLElBQUlHLDJCQUFKOztBQUNBLENBQUMsVUFBVUEsMkJBQVYsRUFBdUM7QUFDcENBLEVBQUFBLDJCQUEyQixDQUFDQyxhQUE1QixHQUE0Q0MsUUFBUSxDQUFDLDJDQUFELEVBQThDLDZGQUE5QyxDQUFwRDtBQUNBRixFQUFBQSwyQkFBMkIsQ0FBQ0csY0FBNUIsR0FBNkNELFFBQVEsQ0FBQyw0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QixHQUFHZSxJQUFJLENBQUNDLEtBQUwsQ0FBV08sUUFBWCxDQUFwQjtBQUNILEtBSEQsTUFJSztBQUNEdkIsTUFBQUEsaUJBQWlCLEdBQUcsRUFBcEI7QUFDSDtBQUNKO0FBQ0osQyxDQUNEOzs7QUFDQVEsSUFBSSIsInNvdXJjZXNDb250ZW50IjpbIi8vIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuLy8gTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuJ3VzZSBzdHJpY3QnO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnMgPSByZXF1aXJlKFwiZnNcIik7XG5jb25zdCBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XG5jb25zdCBjb25zdGFudHNfMSA9IHJlcXVpcmUoXCIuLi9jb25zdGFudHNcIik7XG4vLyBFeHRlcm5hbCBjYWxsZXJzIG9mIGxvY2FsaXplIHVzZSB0aGVzZSB0YWJsZXMgdG8gcmV0cmlldmUgbG9jYWxpemVkIHZhbHVlcy5cbnZhciBMYW5ndWFnZVNlcnZpY2VTdXJ2ZXlCYW5uZXI7XG4oZnVuY3Rpb24gKExhbmd1YWdlU2VydmljZVN1cnZleUJhbm5lcikge1xuICAgIExhbmd1YWdlU2VydmljZVN1cnZleUJhbm5lci5iYW5uZXJNZXNzYWdlID0gbG9jYWxpemUoJ0xhbmd1YWdlU2VydmljZVN1cnZleUJhbm5lci5iYW5uZXJNZXNzYWdlJywgJ0NhbiB5b3UgcGxlYXNlIHRha2UgMiBtaW51dGVzIHRvIHRlbGwgdXMgaG93IHRoZSBQeXRob24gTGFuZ3VhZ2UgU2VydmVyIGlzIHdvcmtpbmcgZm9yIHlvdT8nKTtcbiAgICBMYW5ndWFnZVNlcnZpY2VTdXJ2ZXlCYW5uZXIuYmFubmVyTGFiZWxZZXMgPSBsb2NhbGl6ZSgnTGFuZ3VhZ2VTZXJ2aWNlU3VydmV5QmFubmVyLmJhbm5lckxhYmVsWWVzJywgJ1llcywgdGFrZSBzdXJ2ZXkgbm93Jyk7XG4gICAgTGFuZ3VhZ2VTZXJ2aWNlU3VydmV5QmFubmVyLmJhbm5lckxhYmVsTm8gPSBsb2NhbGl6ZSgnTGFuZ3VhZ2VTZXJ2aWNlU3VydmV5QmFubmVyLmJhbm5lckxhYmVsTm8nLCAnTm8sIHRoYW5rcycpO1xufSkoTGFuZ3VhZ2VTZXJ2aWNlU3VydmV5QmFubmVyID0gZXhwb3J0cy5MYW5ndWFnZVNlcnZpY2VTdXJ2ZXlCYW5uZXIgfHwgKGV4cG9ydHMuTGFuZ3VhZ2VTZXJ2aWNlU3VydmV5QmFubmVyID0ge30pKTtcbnZhciBJbnRlcnByZXRlcnM7XG4oZnVuY3Rpb24gKEludGVycHJldGVycykge1xuICAgIEludGVycHJldGVycy5sb2FkaW5nID0gbG9jYWxpemUoJ0ludGVycHJldGVycy5Mb2FkaW5nSW50ZXJwcmV0ZXJzJywgJ0xvYWRpbmcgUHl0aG9uIEludGVycHJldGVycycpO1xuICAgIEludGVycHJldGVycy5yZWZyZXNoaW5nID0gbG9jYWxpemUoJ0ludGVycHJldGVycy5SZWZyZXNoaW5nSW50ZXJwcmV0ZXJzJywgJ1JlZnJlc2hpbmcgUHl0aG9uIEludGVycHJldGVycycpO1xufSkoSW50ZXJwcmV0ZXJzID0gZXhwb3J0cy5JbnRlcnByZXRlcnMgfHwgKGV4cG9ydHMuSW50ZXJwcmV0ZXJzID0ge30pKTtcbnZhciBEYXRhU2NpZW5jZVN1cnZleUJhbm5lcjtcbihmdW5jdGlvbiAoRGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXIpIHtcbiAgICBEYXRhU2NpZW5jZVN1cnZleUJhbm5lci5iYW5uZXJNZXNzYWdlID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlU3VydmV5QmFubmVyLmJhbm5lck1lc3NhZ2UnLCAnQ2FuIHlvdSBwbGVhc2UgdGFrZSAyIG1pbnV0ZXMgdG8gdGVsbCB1cyBob3cgdGhlIFB5dGhvbiBEYXRhIFNjaWVuY2UgZmVhdHVyZXMgYXJlIHdvcmtpbmcgZm9yIHlvdT8nKTtcbiAgICBEYXRhU2NpZW5jZVN1cnZleUJhbm5lci5iYW5uZXJMYWJlbFllcyA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZVN1cnZleUJhbm5lci5iYW5uZXJMYWJlbFllcycsICdZZXMsIHRha2Ugc3VydmV5IG5vdycpO1xuICAgIERhdGFTY2llbmNlU3VydmV5QmFubmVyLmJhbm5lckxhYmVsTm8gPSBsb2NhbGl6ZSgnRGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXIuYmFubmVyTGFiZWxObycsICdObywgdGhhbmtzJyk7XG59KShEYXRhU2NpZW5jZVN1cnZleUJhbm5lciA9IGV4cG9ydHMuRGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXIgfHwgKGV4cG9ydHMuRGF0YVNjaWVuY2VTdXJ2ZXlCYW5uZXIgPSB7fSkpO1xudmFyIERhdGFTY2llbmNlO1xuKGZ1bmN0aW9uIChEYXRhU2NpZW5jZSkge1xuICAgIERhdGFTY2llbmNlLmhpc3RvcnlUaXRsZSA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5oaXN0b3J5VGl0bGUnLCAnUHl0aG9uIEludGVyYWN0aXZlJyk7XG4gICAgRGF0YVNjaWVuY2UuYmFkV2ViUGFuZWxGb3JtYXRTdHJpbmcgPSBsb2NhbGl6ZSgnRGF0YVNjaWVuY2UuYmFkV2ViUGFuZWxGb3JtYXRTdHJpbmcnLCAnPGh0bWw+PGJvZHk+PGgxPnswfSBpcyBub3QgYSB2YWxpZCBmaWxlIG5hbWU8L2gxPjwvYm9keT48L2h0bWw+Jyk7XG4gICAgRGF0YVNjaWVuY2Uuc2Vzc2lvbkRpc3Bvc2VkID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLnNlc3Npb25EaXNwb3NlZCcsICdDYW5ub3QgZXhlY3V0ZSBjb2RlLCBzZXNzaW9uIGhhcyBiZWVuIGRpc3Bvc2VkLicpO1xuICAgIERhdGFTY2llbmNlLnVua25vd25NaW1lVHlwZSA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS51bmtub3duTWltZVR5cGUnLCAnVW5rbm93biBtaW1lIHR5cGUgZm9yIGRhdGEnKTtcbiAgICBEYXRhU2NpZW5jZS5leHBvcnREaWFsb2dUaXRsZSA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5leHBvcnREaWFsb2dUaXRsZScsICdFeHBvcnQgdG8gSnVweXRlciBOb3RlYm9vaycpO1xuICAgIERhdGFTY2llbmNlLmV4cG9ydERpYWxvZ0ZpbHRlciA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5leHBvcnREaWFsb2dGaWx0ZXInLCAnSnVweXRlciBOb3RlYm9va3MnKTtcbiAgICBEYXRhU2NpZW5jZS5leHBvcnREaWFsb2dDb21wbGV0ZSA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5leHBvcnREaWFsb2dDb21wbGV0ZScsICdOb3RlYm9vayB3cml0dGVuIHRvIHswfScpO1xuICAgIERhdGFTY2llbmNlLmV4cG9ydERpYWxvZ0ZhaWxlZCA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5leHBvcnREaWFsb2dGYWlsZWQnLCAnRmFpbGVkIHRvIGV4cG9ydCBub3RlYm9vay4gezB9Jyk7XG4gICAgRGF0YVNjaWVuY2UuZXhwb3J0T3BlblF1ZXN0aW9uID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLmV4cG9ydE9wZW5RdWVzdGlvbicsICdPcGVuIGluIGJyb3dzZXInKTtcbiAgICBEYXRhU2NpZW5jZS5ydW5DZWxsTGVuc0NvbW1hbmRUaXRsZSA9IGxvY2FsaXplKCdweXRob24uY29tbWFuZC5weXRob24uZGF0YXNjaWVuY2UucnVuY2VsbC50aXRsZScsICdSdW4gY2VsbCcpO1xuICAgIERhdGFTY2llbmNlLmltcG9ydERpYWxvZ1RpdGxlID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLmltcG9ydERpYWxvZ1RpdGxlJywgJ0ltcG9ydCBKdXB5dGVyIE5vdGVib29rJyk7XG4gICAgRGF0YVNjaWVuY2UuaW1wb3J0RGlhbG9nRmlsdGVyID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLmltcG9ydERpYWxvZ0ZpbHRlcicsICdKdXB5dGVyIE5vdGVib29rcycpO1xuICAgIERhdGFTY2llbmNlLm5vdGVib29rQ2hlY2tGb3JJbXBvcnRUaXRsZSA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5ub3RlYm9va0NoZWNrRm9ySW1wb3J0VGl0bGUnLCAnRG8geW91IHdhbnQgdG8gaW1wb3J0IHRoZSBKdXB5dGVyIE5vdGVib29rIGludG8gUHl0aG9uIGNvZGU/Jyk7XG4gICAgRGF0YVNjaWVuY2Uubm90ZWJvb2tDaGVja0ZvckltcG9ydFllcyA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5ub3RlYm9va0NoZWNrRm9ySW1wb3J0WWVzJywgJ0ltcG9ydCcpO1xuICAgIERhdGFTY2llbmNlLm5vdGVib29rQ2hlY2tGb3JJbXBvcnRObyA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5ub3RlYm9va0NoZWNrRm9ySW1wb3J0Tm8nLCAnTGF0ZXInKTtcbiAgICBEYXRhU2NpZW5jZS5ub3RlYm9va0NoZWNrRm9ySW1wb3J0RG9udEFza0FnYWluID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLm5vdGVib29rQ2hlY2tGb3JJbXBvcnREb250QXNrQWdhaW4nLCAnRG9uXFwndCBBc2sgQWdhaW4nKTtcbiAgICBEYXRhU2NpZW5jZS5qdXB5dGVyTm90U3VwcG9ydGVkID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLmp1cHl0ZXJOb3RTdXBwb3J0ZWQnLCAnSnVweXRlciBpcyBub3QgaW5zdGFsbGVkJyk7XG4gICAgRGF0YVNjaWVuY2UuanVweXRlck5iQ29udmVydE5vdFN1cHBvcnRlZCA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5qdXB5dGVyTmJDb252ZXJ0Tm90U3VwcG9ydGVkJywgJ0p1cHl0ZXIgbmJjb252ZXJ0IGlzIG5vdCBpbnN0YWxsZWQnKTtcbiAgICBEYXRhU2NpZW5jZS5weXRob25JbnRlcmFjdGl2ZUhlbHBMaW5rID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLnB5dGhvbkludGVyYWN0aXZlSGVscExpbmsnLCAnU2VlIFtodHRwczovL2FrYS5tcy9weWFpaW5zdGFsbF0gZm9yIGhlbHAgb24gaW5zdGFsbGluZyBqdXB5dGVyLicpO1xuICAgIERhdGFTY2llbmNlLmltcG9ydGluZ0Zvcm1hdCA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5pbXBvcnRpbmdGb3JtYXQnLCAnSW1wb3J0aW5nIHswfScpO1xuICAgIERhdGFTY2llbmNlLnN0YXJ0aW5nSnVweXRlciA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5zdGFydGluZ0p1cHl0ZXInLCAnU3RhcnRpbmcgSnVweXRlciBTZXJ2ZXInKTtcbiAgICBEYXRhU2NpZW5jZS5ydW5BbGxDZWxsc0xlbnNDb21tYW5kVGl0bGUgPSBsb2NhbGl6ZSgncHl0aG9uLmNvbW1hbmQucHl0aG9uLmRhdGFzY2llbmNlLnJ1bmFsbGNlbGxzLnRpdGxlJywgJ1J1biBhbGwgY2VsbHMnKTtcbiAgICBEYXRhU2NpZW5jZS5yZXN0YXJ0S2VybmVsTWVzc2FnZSA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5yZXN0YXJ0S2VybmVsTWVzc2FnZScsICdEbyB5b3Ugd2FudCB0byByZXN0YXJ0IHRoZSBKdXB0ZXIga2VybmVsPyBBbGwgdmFyaWFibGVzIHdpbGwgYmUgbG9zdC4nKTtcbiAgICBEYXRhU2NpZW5jZS5yZXN0YXJ0S2VybmVsTWVzc2FnZVllcyA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5yZXN0YXJ0S2VybmVsTWVzc2FnZVllcycsICdSZXN0YXJ0Jyk7XG4gICAgRGF0YVNjaWVuY2UucmVzdGFydEtlcm5lbE1lc3NhZ2VObyA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5yZXN0YXJ0S2VybmVsTWVzc2FnZU5vJywgJ0NhbmNlbCcpO1xuICAgIERhdGFTY2llbmNlLnJlc3RhcnRpbmdLZXJuZWxTdGF0dXMgPSBsb2NhbGl6ZSgnRGF0YVNjaWVuY2UucmVzdGFydGluZ0tlcm5lbFN0YXR1cycsICdSZXN0YXJ0aW5nIEp1cHl0ZXIgS2VybmVsJyk7XG4gICAgRGF0YVNjaWVuY2UuZXhlY3V0aW5nQ29kZSA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS5leGVjdXRpbmdDb2RlJywgJ0V4ZWN1dGluZyBDZWxsJyk7XG4gICAgRGF0YVNjaWVuY2UuY29sbGFwc2VBbGwgPSBsb2NhbGl6ZSgnRGF0YVNjaWVuY2UuY29sbGFwc2VBbGwnLCAnQ29sbGFwc2UgYWxsIGNlbGwgaW5wdXRzJyk7XG4gICAgRGF0YVNjaWVuY2UuZXhwYW5kQWxsID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLmV4cGFuZEFsbCcsICdFeHBhbmQgYWxsIGNlbGwgaW5wdXRzJyk7XG4gICAgRGF0YVNjaWVuY2UuZXhwb3J0S2V5ID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLmV4cG9ydCcsICdFeHBvcnQgYXMgSnVweXRlciBOb3RlYm9vaycpO1xuICAgIERhdGFTY2llbmNlLnJlc3RhcnRTZXJ2ZXIgPSBsb2NhbGl6ZSgnRGF0YVNjaWVuY2UucmVzdGFydFNlcnZlcicsICdSZXN0YXJ0IGlQeXRob24gS2VybmVsJyk7XG4gICAgRGF0YVNjaWVuY2UudW5kbyA9IGxvY2FsaXplKCdEYXRhU2NpZW5jZS51bmRvJywgJ1VuZG8nKTtcbiAgICBEYXRhU2NpZW5jZS5yZWRvID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLnJlZG8nLCAnUmVkbycpO1xuICAgIERhdGFTY2llbmNlLmNsZWFyQWxsID0gbG9jYWxpemUoJ0RhdGFTY2llbmNlLmNsZWFyQWxsJywgJ1JlbW92ZSBBbGwgQ2VsbHMnKTtcbn0pKERhdGFTY2llbmNlID0gZXhwb3J0cy5EYXRhU2NpZW5jZSB8fCAoZXhwb3J0cy5EYXRhU2NpZW5jZSA9IHt9KSk7XG4vLyBTa2lwIHVzaW5nIHZzY29kZS1ubHMgYW5kIGluc3RlYWQganVzdCBjb21wdXRlIG91ciBzdHJpbmdzIGJhc2VkIG9uIGtleSB2YWx1ZXMuIEtleSB2YWx1ZXNcbi8vIGNhbiBiZSBsb2FkZWQgb3V0IG9mIHRoZSBubHMuPGxvY2FsZT4uanNvbiBmaWxlc1xubGV0IGxvYWRlZENvbGxlY3Rpb247XG5sZXQgZGVmYXVsdENvbGxlY3Rpb247XG5jb25zdCBhc2tlZEZvckNvbGxlY3Rpb24gPSB7fTtcbmxldCBsb2FkZWRMb2NhbGU7XG5mdW5jdGlvbiBsb2NhbGl6ZShrZXksIGRlZlZhbHVlKSB7XG4gICAgLy8gUmV0dXJuIGEgcG9pbnRlciB0byBmdW5jdGlvbiBzbyB0aGF0IHdlIHJlZmV0Y2ggaXQgb24gZWFjaCBjYWxsLlxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgIHJldHVybiBnZXRTdHJpbmcoa2V5LCBkZWZWYWx1ZSk7XG4gICAgfTtcbn1cbmV4cG9ydHMubG9jYWxpemUgPSBsb2NhbGl6ZTtcbmZ1bmN0aW9uIGdldENvbGxlY3Rpb24oKSB7XG4gICAgLy8gTG9hZCB0aGUgY3VycmVudCBjb2xsZWN0aW9uXG4gICAgaWYgKCFsb2FkZWRDb2xsZWN0aW9uIHx8IHBhcnNlTG9jYWxlKCkgIT09IGxvYWRlZExvY2FsZSkge1xuICAgICAgICBsb2FkKCk7XG4gICAgfVxuICAgIC8vIENvbWJpbmUgdGhlIGRlZmF1bHQgYW5kIGxvYWRlZCBjb2xsZWN0aW9uc1xuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBkZWZhdWx0Q29sbGVjdGlvbiwgbG9hZGVkQ29sbGVjdGlvbik7XG59XG5leHBvcnRzLmdldENvbGxlY3Rpb24gPSBnZXRDb2xsZWN0aW9uO1xuZnVuY3Rpb24gZ2V0QXNrZWRGb3JDb2xsZWN0aW9uKCkge1xuICAgIHJldHVybiBhc2tlZEZvckNvbGxlY3Rpb247XG59XG5leHBvcnRzLmdldEFza2VkRm9yQ29sbGVjdGlvbiA9IGdldEFza2VkRm9yQ29sbGVjdGlvbjtcbmZ1bmN0aW9uIHBhcnNlTG9jYWxlKCkge1xuICAgIC8vIEF0dGVtcHQgdG8gbG9hZCBmcm9tIHRoZSB2c2NvZGUgbG9jYWxlLiBJZiBub3QgdGhlcmUsIHVzZSBlbmdsaXNoXG4gICAgY29uc3QgdnNjb2RlQ29uZmlnU3RyaW5nID0gcHJvY2Vzcy5lbnYuVlNDT0RFX05MU19DT05GSUc7XG4gICAgcmV0dXJuIHZzY29kZUNvbmZpZ1N0cmluZyA/IEpTT04ucGFyc2UodnNjb2RlQ29uZmlnU3RyaW5nKS5sb2NhbGUgOiAnZW4tdXMnO1xufVxuZnVuY3Rpb24gZ2V0U3RyaW5nKGtleSwgZGVmVmFsdWUpIHtcbiAgICAvLyBMb2FkIHRoZSBjdXJyZW50IGNvbGxlY3Rpb25cbiAgICBpZiAoIWxvYWRlZENvbGxlY3Rpb24gfHwgcGFyc2VMb2NhbGUoKSAhPT0gbG9hZGVkTG9jYWxlKSB7XG4gICAgICAgIGxvYWQoKTtcbiAgICB9XG4gICAgLy8gRmlyc3QgbG9va3VwIGluIHRoZSBkaWN0aW9uYXJ5IHRoYXQgbWF0Y2hlcyB0aGUgY3VycmVudCBsb2NhbGVcbiAgICBpZiAobG9hZGVkQ29sbGVjdGlvbiAmJiBsb2FkZWRDb2xsZWN0aW9uLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgYXNrZWRGb3JDb2xsZWN0aW9uW2tleV0gPSBsb2FkZWRDb2xsZWN0aW9uW2tleV07XG4gICAgICAgIHJldHVybiBsb2FkZWRDb2xsZWN0aW9uW2tleV07XG4gICAgfVxuICAgIC8vIEZhbGxiYWNrIHRvIHRoZSBkZWZhdWx0IGRpY3Rpb25hcnlcbiAgICBpZiAoZGVmYXVsdENvbGxlY3Rpb24gJiYgZGVmYXVsdENvbGxlY3Rpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBhc2tlZEZvckNvbGxlY3Rpb25ba2V5XSA9IGRlZmF1bHRDb2xsZWN0aW9uW2tleV07XG4gICAgICAgIHJldHVybiBkZWZhdWx0Q29sbGVjdGlvbltrZXldO1xuICAgIH1cbiAgICAvLyBOb3QgZm91bmQsIHJldHVybiB0aGUgZGVmYXVsdFxuICAgIGFza2VkRm9yQ29sbGVjdGlvbltrZXldID0gZGVmVmFsdWU7XG4gICAgcmV0dXJuIGRlZlZhbHVlO1xufVxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgICAvLyBGaWd1cmUgb3V0IG91ciBjdXJyZW50IGxvY2FsZS5cbiAgICBsb2FkZWRMb2NhbGUgPSBwYXJzZUxvY2FsZSgpO1xuICAgIC8vIEZpbmQgdGhlIG5scyBmaWxlIHRoYXQgbWF0Y2hlcyAoaWYgdGhlcmUgaXMgb25lKVxuICAgIGNvbnN0IG5sc0ZpbGUgPSBwYXRoLmpvaW4oY29uc3RhbnRzXzEuRVhURU5TSU9OX1JPT1RfRElSLCBgcGFja2FnZS5ubHMuJHtsb2FkZWRMb2NhbGV9Lmpzb25gKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhubHNGaWxlKSkge1xuICAgICAgICBjb25zdCBjb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyhubHNGaWxlLCAndXRmOCcpO1xuICAgICAgICBsb2FkZWRDb2xsZWN0aW9uID0gSlNPTi5wYXJzZShjb250ZW50cyk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICAvLyBJZiB0aGVyZSBpc24ndCBvbmUsIGF0IGxlYXN0IHJlbWVtYmVyIHRoYXQgd2UgbG9va2VkIHNvIHdlIGRvbid0IHRyeSB0byBsb2FkIGEgc2Vjb25kIHRpbWVcbiAgICAgICAgbG9hZGVkQ29sbGVjdGlvbiA9IHt9O1xuICAgIH1cbiAgICAvLyBHZXQgdGhlIGRlZmF1bHQgY29sbGVjdGlvbiBpZiBuZWNlc3NhcnkuIFN0cmluZ3MgbWF5IGJlIGluIHRoZSBkZWZhdWx0IG9yIHRoZSBsb2NhbGUganNvblxuICAgIGlmICghZGVmYXVsdENvbGxlY3Rpb24pIHtcbiAgICAgICAgY29uc3QgZGVmYXVsdE5sc0ZpbGUgPSBwYXRoLmpvaW4oY29uc3RhbnRzXzEuRVhURU5TSU9OX1JPT1RfRElSLCAncGFja2FnZS5ubHMuanNvbicpO1xuICAgICAgICBpZiAoZnMuZXhpc3RzU3luYyhkZWZhdWx0TmxzRmlsZSkpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKGRlZmF1bHRObHNGaWxlLCAndXRmOCcpO1xuICAgICAgICAgICAgZGVmYXVsdENvbGxlY3Rpb24gPSBKU09OLnBhcnNlKGNvbnRlbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRlZmF1bHRDb2xsZWN0aW9uID0ge307XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyBEZWZhdWx0IHRvIGxvYWRpbmcgdGhlIGN1cnJlbnQgbG9jYWxlXG5sb2FkKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2NhbGl6ZS5qcy5tYXAiXX0=