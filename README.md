

## Requirements

- Git
- NodeJs

## Install

#Git

#install (Web Server)
npm install                     # install nodejs dependencies
bower install                   # install bower dependencies

#Gulp tasks
gulp serve                      # Web server on port 3000
gulp test                       # launch all unit tests
gulp build                      # packages the app for deployment 
                                 (concat + minify html/css/js and bower dependencies)


### Architecture

    bower_components/                   --> libraries managed by bower
    dist/                               --> all of the files to be used in production
    gulp/                               --> all gulp tasks
    node_modules/                       --> libraries managed by nodeJs
    src/                                --> files used for development
        app/                            
          components/                   --> angular components
            directives/                 --> angular directives
            services/                   --> angular services/factories
          shopping_cart/                --> shopping_cart module
          store/                        --> store module
        assets/                         
            images/                     --> images stored locally
        fonts/                          --> fonts files# comerce
