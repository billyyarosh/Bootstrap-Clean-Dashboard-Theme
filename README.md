Clean Dashboard Responsive Bootstrap UI Theme
=================================

**[Click Here to View Demo][demo]**

![Screen Shot](https://lh3.googleusercontent.com/-knA4VZ4BOZc/UguTdKO18gI/AAAAAAAAAwk/eHmGSxPl7rE/w1075-h705-no/Screen+Shot+2013-08-14+at+9.49.11+AM.png "Demo Screen Shot")

Powerful Admin Theme
---------------------
This application is javascript/css/html5 package of additional features placed on top of the twitter bootstrap libraries. To use, either compile the less files or use the existing css file.

Theme Components
---------------------
Additional components like a shadow box, admin panels, login screen, fixed bottom footer and more are included.

Custom JS Libraries
---------------------
[The custom virtual tour library](https://github.com/keaplogik/bootstrap-help-guide). In the demo you can select a sample form under the 'Try ME' navigation. 
There are two buttons on the right hand side. One demos the virtual tour of setting up a new user account, and one demos a tour of the current page. Give it a try!

Built On Bootstrap
---------------------
Built on bootstrap 2.1.1 but supports up to 2.3.1. To upgrade you need to replace the bootstrap less folder with your desired bootstrap version. Find yourself a good less compiler and recompile the less into CSS. 


LESS Setup using Grunt (Modified by Porrapat)
----------------------------

You have to setup NPM by download Node.js that NPM will come with Node.js already.

Install grunt at global.

```bash
$ npm install -g grunt
```

Install Grunt Command Line.

```bash
$ npm install -g grunt-cli
```

Setup LESS and Watch using file package.json

```bash
npm install
```

In the Gruntfile.js file, you can make some configuration. There are two example tasks here.

First : Basic Complie LESS task.

```bash
grunt
```

Second : Task Watch for Compile LESS automatically when you edit some of your LESS files.

```bash
grunt test
```

Note : To exit watch, you have to press Ctrl+C 2 times.


Compiled with Less
---------------------
The source contains all the less files needed to compile a custom instance of the less template. Just point your less compiler to the file in bootstrap-clean-dashboard-theme/less/customize-template.less and recompile your CSS.

View Current Custom Theme
---------------------
There is a default theme which can be overridden with different styling. The theme has a demo in the repository under `clean-dashboard/demo`. To view the demo theme pull down the repo and start an http server in that directory. I like to use [SimpleHTTPServer](https://itunes.apple.com/us/app/simple-http-server/id441002840?mt=12)  app for Mac.

**Project contributions must come from the community. The author is no longer actively working on this project..**. Fork if you want to improve and contribute. It will be appreciated.

**[Click Here to View Demo][demo]**


[demo]: http://keaplogik.github.io/Bootstrap-Clean-Dashboard-Theme/demo/dashboard.html
