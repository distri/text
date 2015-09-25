(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "text\n====\n\nEdit text documents within a value widget.\n",
      "mode": "100644",
      "type": "blob"
    },
    "lib/drop.coffee": {
      "path": "lib/drop.coffee",
      "content": "module.exports = (element, handler) ->\n  cancel = (e) ->\n    e.preventDefault()\n    return false\n\n  element.addEventListener \"dragover\", cancel\n  element.addEventListener \"dragenter\", cancel\n  element.addEventListener \"drop\", (e) ->\n    e.preventDefault()\n    handler(e)\n    return false\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee": {
      "path": "main.coffee",
      "content": "{extend, applyStylesheet} = require \"./util\"\n\nglobal.Ajax = require \"./lib/ajax\"\n\napplyStylesheet(require \"./style\")\n\ntextarea = document.createElement(\"textarea\")\ndocument.body.appendChild(textarea)\ntextarea.focus()\n\nfilePath = \"New File.txt\"\n\nmsgId = 0\nPostmaster = require(\"postmaster\")\nself =\n  loadFile: (file) ->\n    readFile(file)\n    .then (text) ->\n      document.title = filePath = file.name\n      textarea.value = text\n\n  focus: ->\n    textarea.focus()\n\nPostmaster({}, self)\nself.invokeRemote \"childLoaded\"\n\n# Handle File Drops\ndropReader = require \"./lib/drop\"\n\ndropReader document, (e) ->\n  jsonText = e.dataTransfer.getData(\"application/whimsy-file+json\")\n  if jsonText\n    fileData = JSON.parse(jsonText)\n\n    {content, url, path, type} = fileData\n\n    if content\n      file = new File [content], path, type: type\n    else if url\n      Ajax.getBlob(url)\n      .then (blob) ->\n        blob.name = path\n\n        self.loadFile(blob)\n  else\n    file = e.dataTransfer.files[0]\n\n  if file\n    self.loadFile(file)\n\n# TODO: Track dirty for beforeUnload event\n# TODO: Clear dirty on parent save resolution\n# TODO: Full undo history?\n\nreadFile = (file, method=\"readAsText\") ->\n  return new Promise (resolve, reject) ->\n    reader = new FileReader()\n\n    reader.onloadend = ->\n      resolve(reader.result)\n    reader.onerror = reject\n    reader[method](file)\n\ndocument.addEventListener \"keydown\", (e) ->\n  if e.ctrlKey\n    if e.keyCode is 83 # s\n      e.preventDefault()\n\n      file = new File [textarea.value], filePath, type: \"text/plain\"\n      self.invokeRemote \"saveFile\", file\n",
      "mode": "100644",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "content": "version: \"0.2.0-pre.1\"\ndependencies:\n  postmaster: \"distri/postmaster:v0.3.1-pre.0\"\n",
      "mode": "100644",
      "type": "blob"
    },
    "style.styl": {
      "path": "style.styl",
      "content": "html\n  height: 100%\n\nbody\n  height: 100%\n  margin: 0\n  overflow: hidden\n\ntextarea\n  background-color: white\n  border: none\n  width: 100%\n  height: 100%\n  margin: 0\n  padding: 1em\n  resize: none\n  box-sizing: border-box\n  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace\n  font-size: 14px\n",
      "mode": "100644",
      "type": "blob"
    },
    "util.coffee.md": {
      "path": "util.coffee.md",
      "content": "Util\n====\n\n    module.exports =\n      applyStylesheet: (style, id=\"primary\") ->\n        styleNode = document.createElement(\"style\")\n        styleNode.innerHTML = style\n        styleNode.id = id\n\n        if previousStyleNode = document.head.querySelector(\"style##{id}\")\n          previousStyleNode.parentNode.removeChild(prevousStyleNode)\n\n        document.head.appendChild(styleNode)\n\n      extend: (target, sources...) ->\n        for source in sources\n          for name of source\n            target[name] = source[name]\n\n        return target\n\n      defaults: (target, objects...) ->\n        for object in objects\n          for name of object\n            unless target.hasOwnProperty(name)\n              target[name] = object[name]\n\n        return target\n",
      "mode": "100644",
      "type": "blob"
    },
    "lib/ajax.coffee": {
      "path": "lib/ajax.coffee",
      "content": "module.exports = Ajax =\n  getJSON: (path, options={}) ->\n    Ajax.getBlob(path, options)\n    .then (blob) ->\n      new Promise (resolve, reject) ->\n        reader = new FileReader()\n    \n        reader.onloadend = ->\n          resolve(reader.result)\n        reader.onerror = reject\n        reader.readAsText(blob)\n    .then JSON.parse\n\n  getBlob: (path, options={}) ->\n    new Promise (resolve, reject) ->\n\n      xhr = new XMLHttpRequest()\n      xhr.open('GET', path, true)\n      xhr.responseType = \"blob\"\n\n      headers = options.headers\n      if headers\n        Object.keys(headers).forEach (header) ->\n          value = headers[header]\n          xhr.setRequestHeader header, value\n\n      xhr.onload = (e) ->\n        if (200 <= this.status < 300) or this.status is 304\n          try\n            resolve this.response\n          catch error\n            reject error\n        else\n          reject e\n\n      xhr.onerror = reject\n      xhr.send()\n",
      "mode": "100644"
    }
  },
  "distribution": {
    "lib/drop": {
      "path": "lib/drop",
      "content": "(function() {\n  module.exports = function(element, handler) {\n    var cancel;\n    cancel = function(e) {\n      e.preventDefault();\n      return false;\n    };\n    element.addEventListener(\"dragover\", cancel);\n    element.addEventListener(\"dragenter\", cancel);\n    return element.addEventListener(\"drop\", function(e) {\n      e.preventDefault();\n      handler(e);\n      return false;\n    });\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var Postmaster, applyStylesheet, dropReader, extend, filePath, msgId, readFile, self, textarea, _ref;\n\n  _ref = require(\"./util\"), extend = _ref.extend, applyStylesheet = _ref.applyStylesheet;\n\n  global.Ajax = require(\"./lib/ajax\");\n\n  applyStylesheet(require(\"./style\"));\n\n  textarea = document.createElement(\"textarea\");\n\n  document.body.appendChild(textarea);\n\n  textarea.focus();\n\n  filePath = \"New File.txt\";\n\n  msgId = 0;\n\n  Postmaster = require(\"postmaster\");\n\n  self = {\n    loadFile: function(file) {\n      return readFile(file).then(function(text) {\n        document.title = filePath = file.name;\n        return textarea.value = text;\n      });\n    },\n    focus: function() {\n      return textarea.focus();\n    }\n  };\n\n  Postmaster({}, self);\n\n  self.invokeRemote(\"childLoaded\");\n\n  dropReader = require(\"./lib/drop\");\n\n  dropReader(document, function(e) {\n    var content, file, fileData, jsonText, path, type, url;\n    jsonText = e.dataTransfer.getData(\"application/whimsy-file+json\");\n    if (jsonText) {\n      fileData = JSON.parse(jsonText);\n      content = fileData.content, url = fileData.url, path = fileData.path, type = fileData.type;\n      if (content) {\n        file = new File([content], path, {\n          type: type\n        });\n      } else if (url) {\n        Ajax.getBlob(url).then(function(blob) {\n          blob.name = path;\n          return self.loadFile(blob);\n        });\n      }\n    } else {\n      file = e.dataTransfer.files[0];\n    }\n    if (file) {\n      return self.loadFile(file);\n    }\n  });\n\n  readFile = function(file, method) {\n    if (method == null) {\n      method = \"readAsText\";\n    }\n    return new Promise(function(resolve, reject) {\n      var reader;\n      reader = new FileReader();\n      reader.onloadend = function() {\n        return resolve(reader.result);\n      };\n      reader.onerror = reject;\n      return reader[method](file);\n    });\n  };\n\n  document.addEventListener(\"keydown\", function(e) {\n    var file;\n    if (e.ctrlKey) {\n      if (e.keyCode === 83) {\n        e.preventDefault();\n        file = new File([textarea.value], filePath, {\n          type: \"text/plain\"\n        });\n        return self.invokeRemote(\"saveFile\", file);\n      }\n    }\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"version\":\"0.2.0-pre.1\",\"dependencies\":{\"postmaster\":\"distri/postmaster:v0.3.1-pre.0\"}};",
      "type": "blob"
    },
    "style": {
      "path": "style",
      "content": "module.exports = \"html {\\n  height: 100%;\\n}\\n\\nbody {\\n  height: 100%;\\n  margin: 0;\\n  overflow: hidden;\\n}\\n\\ntextarea {\\n  background-color: white;\\n  border: none;\\n  width: 100%;\\n  height: 100%;\\n  margin: 0;\\n  padding: 1em;\\n  resize: none;\\n  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace;\\n  font-size: 14px;\\n  -ms-box-sizing: border-box;\\n  -moz-box-sizing: border-box;\\n  -webkit-box-sizing: border-box;\\n  box-sizing: border-box;\\n}\";",
      "type": "blob"
    },
    "util": {
      "path": "util",
      "content": "(function() {\n  var __slice = [].slice;\n\n  module.exports = {\n    applyStylesheet: function(style, id) {\n      var previousStyleNode, styleNode;\n      if (id == null) {\n        id = \"primary\";\n      }\n      styleNode = document.createElement(\"style\");\n      styleNode.innerHTML = style;\n      styleNode.id = id;\n      if (previousStyleNode = document.head.querySelector(\"style#\" + id)) {\n        previousStyleNode.parentNode.removeChild(prevousStyleNode);\n      }\n      return document.head.appendChild(styleNode);\n    },\n    extend: function() {\n      var name, source, sources, target, _i, _len;\n      target = arguments[0], sources = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = sources.length; _i < _len; _i++) {\n        source = sources[_i];\n        for (name in source) {\n          target[name] = source[name];\n        }\n      }\n      return target;\n    },\n    defaults: function() {\n      var name, object, objects, target, _i, _len;\n      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      for (_i = 0, _len = objects.length; _i < _len; _i++) {\n        object = objects[_i];\n        for (name in object) {\n          if (!target.hasOwnProperty(name)) {\n            target[name] = object[name];\n          }\n        }\n      }\n      return target;\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "lib/ajax": {
      "path": "lib/ajax",
      "content": "(function() {\n  var Ajax;\n\n  module.exports = Ajax = {\n    getJSON: function(path, options) {\n      if (options == null) {\n        options = {};\n      }\n      return Ajax.getBlob(path, options).then(function(blob) {\n        return new Promise(function(resolve, reject) {\n          var reader;\n          reader = new FileReader();\n          reader.onloadend = function() {\n            return resolve(reader.result);\n          };\n          reader.onerror = reject;\n          return reader.readAsText(blob);\n        });\n      }).then(JSON.parse);\n    },\n    getBlob: function(path, options) {\n      if (options == null) {\n        options = {};\n      }\n      return new Promise(function(resolve, reject) {\n        var headers, xhr;\n        xhr = new XMLHttpRequest();\n        xhr.open('GET', path, true);\n        xhr.responseType = \"blob\";\n        headers = options.headers;\n        if (headers) {\n          Object.keys(headers).forEach(function(header) {\n            var value;\n            value = headers[header];\n            return xhr.setRequestHeader(header, value);\n          });\n        }\n        xhr.onload = function(e) {\n          var error, _ref;\n          if (((200 <= (_ref = this.status) && _ref < 300)) || this.status === 304) {\n            try {\n              return resolve(this.response);\n            } catch (_error) {\n              error = _error;\n              return reject(error);\n            }\n          } else {\n            return reject(e);\n          }\n        };\n        xhr.onerror = reject;\n        return xhr.send();\n      });\n    }\n  };\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "version": "0.2.0-pre.1",
  "entryPoint": "main",
  "repository": {
    "branch": "whimsy2",
    "default_branch": "master",
    "full_name": "distri/text",
    "homepage": null,
    "description": "Edit text documents within a value widget.",
    "html_url": "https://github.com/distri/text",
    "url": "https://api.github.com/repos/distri/text",
    "publishBranch": "gh-pages"
  },
  "dependencies": {
    "postmaster": {
      "source": {
        "LICENSE": {
          "path": "LICENSE",
          "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
          "mode": "100644",
          "type": "blob"
        },
        "README.md": {
          "path": "README.md",
          "content": "postmaster\n==========\n\nSend and receive `postMessage` commands using promises to handle the results.\n",
          "mode": "100644",
          "type": "blob"
        },
        "main.coffee": {
          "path": "main.coffee",
          "content": "###\n\nPostmaster wraps the `postMessage` API with promises.\n\n###\n\ndefaultReceiver = self\n\nmodule.exports = Postmaster = (I={}, self={}) ->\n  send = (data) ->\n    target = self.remoteTarget()\n    if !Worker? or target instanceof Worker\n      target.postMessage data\n    else\n      target.postMessage data, \"*\"\n\n  dominant = Postmaster.dominant()\n  self.remoteTarget ?= -> dominant\n  self.receiver ?= -> defaultReceiver\n\n  self.receiver().addEventListener \"message\", (event) ->\n    # Only listening to messages from `opener`\n    if event.source is self.remoteTarget() or !event.source\n      data = event.data\n      {type, method, params, id} = data\n\n      switch type\n        when \"response\"\n          pendingResponses[id].resolve data.result\n        when \"error\"\n          pendingResponses[id].reject data.error\n        when \"message\"\n          Promise.resolve()\n          .then ->\n            self[method](params...)\n          .then (result) ->\n            send\n              type: \"response\"\n              id: id\n              result: result\n          .catch (error) ->\n            if typeof error is \"string\"\n              message = error\n            else\n              message = error.message\n\n            send\n              type: \"error\"\n              id: id\n              error:\n                message: message\n                stack: error.stack\n\n  pendingResponses = {}\n  remoteId = 0\n\n  self.invokeRemote = (method, params...) ->\n    id = remoteId++\n\n    send\n      type: \"message\"\n      method: method\n      params: params\n      id: id\n\n    new Promise (resolve, reject) ->\n      clear = ->\n        delete pendingResponses[id]\n\n      pendingResponses[id] =\n        resolve: (result) ->\n          clear()\n          resolve(result)\n        reject: (error) ->\n          clear()\n          reject(error)\n\n  return self\n\nPostmaster.dominant = ->\n  if window? # iframe or child window context\n    opener or ((parent != window) and parent) or undefined\n  else # Web Worker Context\n    self\n\nreturn Postmaster\n",
          "mode": "100644",
          "type": "blob"
        },
        "pixie.cson": {
          "path": "pixie.cson",
          "content": "version: \"0.3.1-pre.0\"\n",
          "mode": "100644",
          "type": "blob"
        },
        "test/postmaster.coffee": {
          "path": "test/postmaster.coffee",
          "content": "Postmaster = require \"../main\"\n\nscriptContent = ->\n  fn = ->\n    pm = Postmaster()\n    pm.echo = (value) ->\n      return value\n    pm.throws = ->\n      throw new Error(\"This always throws\")\n    pm.promiseFail = ->\n      Promise.reject new Error \"This is a failed promise\"\n\n  \"\"\"\n    var module = {};\n    Postmaster = #{PACKAGE.distribution.main.content};\n    (#{fn.toString()})();\n  \"\"\"\n\ninitWindow = (targetWindow) ->\n  targetWindow.document.write \"<script>#{scriptContent()}<\\/script>\"\n\ndescribe \"Postmaster\", ->\n  it \"should work with openened windows\", (done) ->\n    childWindow = open(\"\", null, \"width=200,height=200\")\n\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"echo\", 5\n    .then (result) ->\n      assert.equal result, 5\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      childWindow.close()\n\n  it \"should work with iframes\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"echo\", 17\n    .then (result) ->\n      assert.equal result, 17\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      iframe.remove()\n\n  it \"should handle the remote call throwing errors\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"throws\"\n    .catch (error) ->\n      done()\n    .then ->\n      iframe.remove()\n\n  it \"should handle the remote call returning failed promises\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.invokeRemote \"promiseFail\"\n    .catch (error) ->\n      done()\n    .then ->\n      iframe.remove()\n\n  it \"should be able to go around the world\", (done) ->\n    iframe = document.createElement('iframe')\n    document.body.appendChild(iframe)\n\n    childWindow = iframe.contentWindow\n    initWindow(childWindow)\n\n    postmaster = Postmaster()\n    postmaster.remoteTarget = -> childWindow\n    postmaster.yolo = (txt) ->\n      \"heyy #{txt}\"\n    postmaster.invokeRemote \"invokeRemote\", \"yolo\", \"cool\"\n    .then (result) ->\n      assert.equal result, \"heyy cool\"\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      iframe.remove()\n\n  it \"should work with web workers\", (done) ->\n    blob = new Blob [scriptContent()]\n    jsUrl = URL.createObjectURL(blob)\n\n    worker = new Worker(jsUrl)\n\n    base =\n      remoteTarget: -> worker\n      receiver: -> worker\n\n    postmaster = Postmaster({}, base)\n    postmaster.invokeRemote \"echo\", 17\n    .then (result) ->\n      assert.equal result, 17\n    .then ->\n      done()\n    , (error) ->\n      done(error)\n    .then ->\n      worker.terminate()\n",
          "mode": "100644",
          "type": "blob"
        }
      },
      "distribution": {
        "main": {
          "path": "main",
          "content": "\n/*\n\nPostmaster wraps the `postMessage` API with promises.\n */\n\n(function() {\n  var Postmaster, defaultReceiver,\n    __slice = [].slice;\n\n  defaultReceiver = self;\n\n  module.exports = Postmaster = function(I, self) {\n    var dominant, pendingResponses, remoteId, send;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = {};\n    }\n    send = function(data) {\n      var target;\n      target = self.remoteTarget();\n      if ((typeof Worker === \"undefined\" || Worker === null) || target instanceof Worker) {\n        return target.postMessage(data);\n      } else {\n        return target.postMessage(data, \"*\");\n      }\n    };\n    dominant = Postmaster.dominant();\n    if (self.remoteTarget == null) {\n      self.remoteTarget = function() {\n        return dominant;\n      };\n    }\n    if (self.receiver == null) {\n      self.receiver = function() {\n        return defaultReceiver;\n      };\n    }\n    self.receiver().addEventListener(\"message\", function(event) {\n      var data, id, method, params, type;\n      if (event.source === self.remoteTarget() || !event.source) {\n        data = event.data;\n        type = data.type, method = data.method, params = data.params, id = data.id;\n        switch (type) {\n          case \"response\":\n            return pendingResponses[id].resolve(data.result);\n          case \"error\":\n            return pendingResponses[id].reject(data.error);\n          case \"message\":\n            return Promise.resolve().then(function() {\n              return self[method].apply(self, params);\n            }).then(function(result) {\n              return send({\n                type: \"response\",\n                id: id,\n                result: result\n              });\n            })[\"catch\"](function(error) {\n              var message;\n              if (typeof error === \"string\") {\n                message = error;\n              } else {\n                message = error.message;\n              }\n              return send({\n                type: \"error\",\n                id: id,\n                error: {\n                  message: message,\n                  stack: error.stack\n                }\n              });\n            });\n        }\n      }\n    });\n    pendingResponses = {};\n    remoteId = 0;\n    self.invokeRemote = function() {\n      var id, method, params;\n      method = arguments[0], params = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n      id = remoteId++;\n      send({\n        type: \"message\",\n        method: method,\n        params: params,\n        id: id\n      });\n      return new Promise(function(resolve, reject) {\n        var clear;\n        clear = function() {\n          return delete pendingResponses[id];\n        };\n        return pendingResponses[id] = {\n          resolve: function(result) {\n            clear();\n            return resolve(result);\n          },\n          reject: function(error) {\n            clear();\n            return reject(error);\n          }\n        };\n      });\n    };\n    return self;\n  };\n\n  Postmaster.dominant = function() {\n    if (typeof window !== \"undefined\" && window !== null) {\n      return opener || ((parent !== window) && parent) || void 0;\n    } else {\n      return self;\n    }\n  };\n\n  return Postmaster;\n\n}).call(this);\n",
          "type": "blob"
        },
        "pixie": {
          "path": "pixie",
          "content": "module.exports = {\"version\":\"0.3.1-pre.0\"};",
          "type": "blob"
        },
        "test/postmaster": {
          "path": "test/postmaster",
          "content": "(function() {\n  var Postmaster, initWindow, scriptContent;\n\n  Postmaster = require(\"../main\");\n\n  scriptContent = function() {\n    var fn;\n    fn = function() {\n      var pm;\n      pm = Postmaster();\n      pm.echo = function(value) {\n        return value;\n      };\n      pm.throws = function() {\n        throw new Error(\"This always throws\");\n      };\n      return pm.promiseFail = function() {\n        return Promise.reject(new Error(\"This is a failed promise\"));\n      };\n    };\n    return \"var module = {};\\nPostmaster = \" + PACKAGE.distribution.main.content + \";\\n(\" + (fn.toString()) + \")();\";\n  };\n\n  initWindow = function(targetWindow) {\n    return targetWindow.document.write(\"<script>\" + (scriptContent()) + \"<\\/script>\");\n  };\n\n  describe(\"Postmaster\", function() {\n    it(\"should work with openened windows\", function(done) {\n      var childWindow, postmaster;\n      childWindow = open(\"\", null, \"width=200,height=200\");\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"echo\", 5).then(function(result) {\n        return assert.equal(result, 5);\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return childWindow.close();\n      });\n    });\n    it(\"should work with iframes\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"echo\", 17).then(function(result) {\n        return assert.equal(result, 17);\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should handle the remote call throwing errors\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"throws\")[\"catch\"](function(error) {\n        return done();\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should handle the remote call returning failed promises\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      return postmaster.invokeRemote(\"promiseFail\")[\"catch\"](function(error) {\n        return done();\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    it(\"should be able to go around the world\", function(done) {\n      var childWindow, iframe, postmaster;\n      iframe = document.createElement('iframe');\n      document.body.appendChild(iframe);\n      childWindow = iframe.contentWindow;\n      initWindow(childWindow);\n      postmaster = Postmaster();\n      postmaster.remoteTarget = function() {\n        return childWindow;\n      };\n      postmaster.yolo = function(txt) {\n        return \"heyy \" + txt;\n      };\n      return postmaster.invokeRemote(\"invokeRemote\", \"yolo\", \"cool\").then(function(result) {\n        return assert.equal(result, \"heyy cool\");\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return iframe.remove();\n      });\n    });\n    return it(\"should work with web workers\", function(done) {\n      var base, blob, jsUrl, postmaster, worker;\n      blob = new Blob([scriptContent()]);\n      jsUrl = URL.createObjectURL(blob);\n      worker = new Worker(jsUrl);\n      base = {\n        remoteTarget: function() {\n          return worker;\n        },\n        receiver: function() {\n          return worker;\n        }\n      };\n      postmaster = Postmaster({}, base);\n      return postmaster.invokeRemote(\"echo\", 17).then(function(result) {\n        return assert.equal(result, 17);\n      }).then(function() {\n        return done();\n      }, function(error) {\n        return done(error);\n      }).then(function() {\n        return worker.terminate();\n      });\n    });\n  });\n\n}).call(this);\n",
          "type": "blob"
        }
      },
      "progenitor": {
        "url": "http://www.danielx.net/editor/"
      },
      "version": "0.3.1-pre.0",
      "entryPoint": "main",
      "repository": {
        "branch": "v0.3.1-pre.0",
        "default_branch": "master",
        "full_name": "distri/postmaster",
        "homepage": null,
        "description": "Send and receive postMessage commands.",
        "html_url": "https://github.com/distri/postmaster",
        "url": "https://api.github.com/repos/distri/postmaster",
        "publishBranch": "gh-pages"
      },
      "dependencies": {}
    }
  }
});