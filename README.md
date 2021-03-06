[easy-config](https://github.com/DeadAlready/node-easy-config) is a simple configuration loader for node projects.

# Installation

    $ npm install easy-config

# Usage

easy-config loads configuration from JSON files and the command line returning an object containing the sum of configurations.

## Default usage

Simply require the module and thats it

    var config = require('easy-config');

It will try to read JSON files from config subfolder.
Starting with an empty object extend the configuration object by adding or overwriting the values obtained in the following order

1. config.json
2. config.dev.json (this is because default environment is development)
3. command line input
4. all other files are added under ns key in the following format
  -> config.keys.json will be under ns.keys

### Command line

Input is expected in the --{name}={value} format.

You can also set nested properties by using dots to specify the nesting like so:

    $ node test.js --log.level.is==true  

## Options

The following options are available:

+ folder: *The configuration folder will default to process.cwd() + '/config'
+ cmd: *Whether to load configurations from the command line will default to true
+ envs: *Array of environment names. These files will not be loaded by default. Will default to ['dev','pro']
+ env: *Environment for which to load configuration will default to 'dev' (this will try to load config.dev.json)
+ type: *String -> file extension to load, defaults to JSON. Files are included with require, so js and json files are supported by default.
+ pre: *Object to start extending, defaults to {}
+ ns: *Boolean whether to append files under ns property

There are two ways of specifying the options:

### loadConfig

You can modify the loading options by using the method loadConfig(options) that is on the configuration object.

    var config = require('easy-config').loadConfig(options);

### Command line

You can also specify the loading options from the command line in the following format -{name}={value}.

Take note that the format differs between loading configuration options and configuration extending by one '-' sign.

Options specified on command line will take precedent over options specified in code.

    $ node test.js -env=pro

## Examples

config.json:

    {
      "log":{
        "name":"It's useful to log",
        "level":"info"
      }
    }
config.dev.json:

    {
      "log":{
        "level":"debug"
      },
      "correct":true
    }

index.js

    var config = require('easy-config');
    console.log(config);

Will create the following output:

    {
      log:{
        name:"It's useful to log",
        level:"debug"
      },
      correct:true
    }

### Namespaces

Namespaces option allows to load multiple configuration files into their own namespace

Having config.runner.json
    {
      "name":"runner"
    }

Will create the following

    {
      ...
      ns:{
        runner:{
          name:"runner"
        }
      }
    }

### Extend

The config object also comes with the convenience method of extend to allow overwriting 
or extending the configuration object.

Usage:

    var config = require('easy-config').extend({newProp:true});

Will result in:

    {
      ...
      newProp:true
    }

You can also extend arbitrary objects by calling extend with 2 objects. 
The second object will overwrite the first object.

Usage:

    var config = require('easy-config');
    config = config.extend({newProp:true,oldProp:'Old'},{newProp:false, newestProp:'Newest'});

Will result in:

    {
      newProp:false,
      oldProp:'Old',
      newestProp:'Newest'
    }

### Modify/unmodify

You can modify the config object so that the modification persist over 
the next requrie calls.

Usage:

    var config = require('easy-config');
    config.modify({newProp:true});
    console.log(require('easy-config'));

Will result in:

    {
      ...
      newProp:true
    }

You can undo the modifications by calling unmodify

Usage:

    var config = require('easy-config');
    config.modify({newProp:true});
    config.unmodify();
    console.log(require('easy-config'));

Will result in:

    {
      ...
    }

## File manipulation

easy-config also provides some file manipulation functions for easy configuration file modifying
if a need should arise for a persistent cross process on the fly dynamic configuration

### writeConfigFile(name, object)

writeConfigFile is a function for writing a new configuration file or overwriting an existing file.
The function takes two parameters:
+ name -> the name of the new file 'config.new.json' and 'new' are equivalent
+ object -> this object will be JSON.stringified before writing to file

The function will return the new configuration object or false if writing fails

### changeConfigFile(name, object)

changeConfigFile is a function for extending the json object in a file with new data.
The function takes two parameters:
+ name -> the name of the new file 'config.new.json' and 'new' are equivalent
+ object -> the previous contents will be extended with this object and the result written to file

The function will return the new configuration object or false if writing fails

### deleteConfigFile(name)

deleteConfigFile is a function for deleting a configuration file
+ name -> the name of the new file 'config.new.json' and 'new' are equivalent

Function returns new configuration object or false if no such file is mapped.

### getDefinedOptions()

getDefinedOptions is a function for getting the easy-configs inner options object

Function returns the current options object of the config.

### isProduction()

isProduction is a function for getting a boolean indication if production config is used

Function returns boolean true or false

## License

The MIT License (MIT)
Copyright (c) 2012 Karl Düüna

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.