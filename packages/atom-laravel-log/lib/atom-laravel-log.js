'use babel';

import LaravelLogReader from './LaravelLogReader';
import { CompositeDisposable } from 'atom';

export default {
  laravelLogReader: null,
  subscriptions: null,
  
  config: {
      enable: {
          title: "Enable Plugin",
          type: "boolean",
          description: 'To enable/disable plugin',
          default: true
      }
  },

  activate(state) {
	  var that = this;
      this.laravelLogReader = new LaravelLogReader();
    
    this.subscriptions = atom.project.onDidChangeFiles(events => {
        if(atom.config.get('atom-laravel-log.enable')){
            for (const event of events) {
                var path = event.path,
                action = event.action;
                if(that.isLogFile(path) && (action == 'created' || action == 'modified')){
                    that.laravelLogReader.showErrorFromLogFile(path);
                }
            }
        }
    });
    
    // Whenever plugin enabled then mark all projects's error files as read
    this.pluginConfigChanged = atom.config.observe('atom-laravel-log.enable', (newValue) => {
        if(newValue){
          atom.workspace.project.rootDirectories.forEach((project) => {
            that.markProjectExisitingLogsRead(project);
          });
        }
    })
      
    // Initially get last logs of all projects
    atom.workspace.project.rootDirectories.forEach((project) => {
      that.markProjectExisitingLogsRead(project);
    });
    
    // If Project is added then set last error log
    atom.project.onDidChangePaths(() => {
        atom.workspace.project.rootDirectories.forEach((project) => {
            that.markProjectExisitingLogsRead(project);
        });
    });
  },
  
  markProjectExisitingLogsRead(project){
      this.getLoggerFiles(project.path).forEach((logFile) => {
          if(this.isLogFile(logFile)){
            this.laravelLogReader.setLastErrorLog(logFile);
          }
      });
  },

  deactivate() {
    this.subscriptions.dispose();
    this.pluginConfigChanged.dispose()
  },

  serialize() {
    return {};
  },

  toggle() {
  },
  
  isLogFile(path){
      let filename = path.replace(/^.*[\\\/]/, '');
      
      return filename == 'laravel.log' || filename == "laravel-"+this.getCurrentDate()+".log";
  },
  
  getLoggerFiles(path) {
    return [
        path+"/storage/logs/laravel.log",
        path+"/storage/logs/laravel-"+this.getCurrentDate()+".log"
    ];
  },
  
  getCurrentDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
   },
};
