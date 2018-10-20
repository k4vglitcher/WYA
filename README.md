# WYA
Application for group event coordination created for the course 4156 - Advanced Software Engineering.

# Setting up and Running
We are going to need to install `npm` as a dependency manager for our
application. To do this on Mac, make sure Homebrew is installed (or any other
preferred package manager) and run `brew install npm`.

Go into the directory where you want to download the code to and clone
this repository into it. Then go into the WYA directory.
`git clone https://github.com/juanam/WYA.git`
`cd WYA`

Then, to run our application and install our dependencies we need to run
three `npm` commands so that our dependencies work on Electron. They are:
`npm install`
`npm rebuild --runtime=electron --target=2.0.10 --disturl=https://atom.io/download/electron`
`npm start`

After this, the application should be running and you are set to develop.
