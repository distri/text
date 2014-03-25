window["distri/text:master"]({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "mode": "100644",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2014 \n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "mode": "100644",
      "content": "text\n====\n\nEdit text documents within a value widget.\n",
      "type": "blob"
    },
    "text.coffee.md": {
      "path": "text.coffee.md",
      "mode": "100644",
      "content": "Text\n====\n\n`Text` is a model for editing a text file. Currently it uses the Ace\neditor, but we may switch in the future. All the editor specific things live in\nhere.\n\n    module.exports = (I) ->\n      defaults I,\n        mode: \"coffee\"\n        text: \"\"\n\n      self = Model(I)\n\nWe can't use ace on a div not in the DOM so we need to be sure to pass one in.\n\n      el = I.el\n\nWe can't serialize DOM elements so we need to be sure to delete it.\n\n      delete I.el\n\nHere we create and configure the Ace text editor.\n\nTODO: Load these options from a preferences somewhere.\n\n      editor = ace.edit(el)\n      editor.setFontSize(\"16px\")\n      editor.setTheme(\"ace/theme/chrome\")\n      editor.getSession().setUseWorker(false)\n      editor.getSession().setMode(\"ace/mode/#{I.mode}\")\n      editor.getSession().setUseSoftTabs(true)\n      editor.getSession().setTabSize(2)\n\n`reset` Sets the content of the editor to the given content and also resets any\ncursor position or selection.\n\n      reset = (content=\"\") ->\n        editor.setValue(content)\n        editor.moveCursorTo(0, 0)\n        editor.session.selection.clearSelection()\n\n      reset(I.text)\n\nOur text attribute is observable so clients can track changes.\n\n      self.attrObservable \"text\"\n\nWe modify our text by listening to change events from Ace.\n\nTODO: Remove these `updating` hacks.\n\n      updating = false\n      editor.getSession().on 'change', ->\n        updating = true\n        self.text(editor.getValue())\n        updating = false\n\nWe also observe any changes to `text` ourselves to stay up to date with outside\nmodifications. Its a bi-directional binding.\n\n      self.text.observe (newValue) ->\n        unless updating\n          reset(newValue)\n\nWe expose some properties and methods.\n\n      self.extend\n        el: el\n        editor: editor\n        reset: reset\n\n      return self\n\nHelpers\n-------\n\n    defaults = (target, objects...) ->\n      for object in objects\n        for name of object\n          unless target.hasOwnProperty(name)\n            target[name] = object[name]\n  \n      return target\n",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "mode": "100644",
      "content": "\n\nCreate an editor, send events back to parent.\n\n    TextEditor = require \"./text\"\n\n    template = require \"./editor\"\n\n    document.body.appendChild(template())\n\n    el = document.querySelector(\".editor\")\n    \n    console.log el\n    \n    TextEditor\n      text: \"Hellow\"\n      el: el\n",
      "type": "blob"
    },
    "pixie.cson": {
      "path": "pixie.cson",
      "mode": "100644",
      "content": "remoteDependencies: [\n  \"https://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js\"\n]\n",
      "type": "blob"
    },
    "editor.haml": {
      "path": "editor.haml",
      "mode": "100644",
      "content": ".editor-wrap\n  .editor\n",
      "type": "blob"
    }
  },
  "distribution": {
    "text": {
      "path": "text",
      "content": "(function() {\n  var defaults,\n    __slice = [].slice;\n\n  module.exports = function(I) {\n    var editor, el, reset, self, updating;\n    defaults(I, {\n      mode: \"coffee\",\n      text: \"\"\n    });\n    self = Model(I);\n    el = I.el;\n    delete I.el;\n    editor = ace.edit(el);\n    editor.setFontSize(\"16px\");\n    editor.setTheme(\"ace/theme/chrome\");\n    editor.getSession().setUseWorker(false);\n    editor.getSession().setMode(\"ace/mode/\" + I.mode);\n    editor.getSession().setUseSoftTabs(true);\n    editor.getSession().setTabSize(2);\n    reset = function(content) {\n      if (content == null) {\n        content = \"\";\n      }\n      editor.setValue(content);\n      editor.moveCursorTo(0, 0);\n      return editor.session.selection.clearSelection();\n    };\n    reset(I.text);\n    self.attrObservable(\"text\");\n    updating = false;\n    editor.getSession().on('change', function() {\n      updating = true;\n      self.text(editor.getValue());\n      return updating = false;\n    });\n    self.text.observe(function(newValue) {\n      if (!updating) {\n        return reset(newValue);\n      }\n    });\n    self.extend({\n      el: el,\n      editor: editor,\n      reset: reset\n    });\n    return self;\n  };\n\n  defaults = function() {\n    var name, object, objects, target, _i, _len;\n    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];\n    for (_i = 0, _len = objects.length; _i < _len; _i++) {\n      object = objects[_i];\n      for (name in object) {\n        if (!target.hasOwnProperty(name)) {\n          target[name] = object[name];\n        }\n      }\n    }\n    return target;\n  };\n\n}).call(this);\n",
      "type": "blob"
    },
    "main": {
      "path": "main",
      "content": "(function() {\n  var TextEditor, el, template;\n\n  TextEditor = require(\"./text\");\n\n  template = require(\"./editor\");\n\n  document.body.appendChild(template());\n\n  el = document.querySelector(\".editor\");\n\n  console.log(el);\n\n  TextEditor({\n    text: \"Hellow\",\n    el: el\n  });\n\n}).call(this);\n",
      "type": "blob"
    },
    "pixie": {
      "path": "pixie",
      "content": "module.exports = {\"remoteDependencies\":[\"https://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js\"]};",
      "type": "blob"
    },
    "editor": {
      "path": "editor",
      "content": "Runtime = require(\"/_lib/hamljr_runtime\");\n\nmodule.exports = (function(data) {\n  return (function() {\n    var __runtime;\n    __runtime = Runtime(this);\n    __runtime.push(document.createDocumentFragment());\n    __runtime.push(document.createElement(\"div\"));\n    __runtime.classes(\"editor-wrap\");\n    __runtime.push(document.createElement(\"div\"));\n    __runtime.classes(\"editor\");\n    __runtime.pop();\n    __runtime.pop();\n    return __runtime.pop();\n  }).call(data);\n});\n",
      "type": "blob"
    },
    "_lib/hamljr_runtime": {
      "path": "_lib/hamljr_runtime",
      "content": "(function() {\n  var Runtime, dataName, document,\n    __slice = [].slice;\n\n  dataName = \"__hamlJR_data\";\n\n  if (typeof window !== \"undefined\" && window !== null) {\n    document = window.document;\n  } else {\n    document = global.document;\n  }\n\n  Runtime = function(context) {\n    var append, bindObservable, classes, id, lastParent, observeAttribute, observeText, pop, push, render, stack, top;\n    stack = [];\n    lastParent = function() {\n      var element, i;\n      i = stack.length - 1;\n      while ((element = stack[i]) && element.nodeType === 11) {\n        i -= 1;\n      }\n      return element;\n    };\n    top = function() {\n      return stack[stack.length - 1];\n    };\n    append = function(child) {\n      var _ref;\n      if ((_ref = top()) != null) {\n        _ref.appendChild(child);\n      }\n      return child;\n    };\n    push = function(child) {\n      return stack.push(child);\n    };\n    pop = function() {\n      return append(stack.pop());\n    };\n    render = function(child) {\n      push(child);\n      return pop();\n    };\n    bindObservable = function(element, value, update) {\n      var observable, unobserve;\n      if (typeof Observable === \"undefined\" || Observable === null) {\n        update(value);\n        return;\n      }\n      observable = Observable(value);\n      observable.observe(update);\n      update(observable());\n      unobserve = function() {\n        return observable.stopObserving(update);\n      };\n      element.addEventListener(\"DOMNodeRemoved\", unobserve, true);\n      return element;\n    };\n    id = function() {\n      var element, sources, update, value;\n      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      element = top();\n      update = function(newValue) {\n        if (typeof newValue === \"function\") {\n          newValue = newValue();\n        }\n        return element.id = newValue;\n      };\n      value = function() {\n        var possibleValues;\n        possibleValues = sources.map(function(source) {\n          if (typeof source === \"function\") {\n            return source();\n          } else {\n            return source;\n          }\n        }).filter(function(idValue) {\n          return idValue != null;\n        });\n        return possibleValues[possibleValues.length - 1];\n      };\n      return bindObservable(element, value, update);\n    };\n    classes = function() {\n      var element, sources, update, value;\n      sources = 1 <= arguments.length ? __slice.call(arguments, 0) : [];\n      element = top();\n      update = function(newValue) {\n        if (typeof newValue === \"function\") {\n          newValue = newValue();\n        }\n        return element.className = newValue;\n      };\n      value = function() {\n        var possibleValues;\n        possibleValues = sources.map(function(source) {\n          if (typeof source === \"function\") {\n            return source();\n          } else {\n            return source;\n          }\n        }).filter(function(sourceValue) {\n          return sourceValue != null;\n        });\n        return possibleValues.join(\" \");\n      };\n      return bindObservable(element, value, update);\n    };\n    observeAttribute = function(name, value) {\n      var element, update;\n      element = top();\n      update = function(newValue) {\n        return element.setAttribute(name, newValue);\n      };\n      return bindObservable(element, value, update);\n    };\n    observeText = function(value) {\n      var element, update;\n      switch (value != null ? value.nodeType : void 0) {\n        case 1:\n        case 3:\n        case 11:\n          render(value);\n          return;\n      }\n      element = document.createTextNode('');\n      update = function(newValue) {\n        return element.nodeValue = newValue;\n      };\n      bindObservable(element, value, update);\n      return render(element);\n    };\n    return {\n      push: push,\n      pop: pop,\n      id: id,\n      classes: classes,\n      attribute: observeAttribute,\n      text: observeText,\n      filter: function(name, content) {},\n      each: function(items, fn) {\n        var elements, parent, replace;\n        items = Observable(items);\n        elements = [];\n        parent = lastParent();\n        items.observe(function(newItems) {\n          return replace(elements, newItems);\n        });\n        replace = function(oldElements, items) {\n          var firstElement;\n          if (oldElements) {\n            firstElement = oldElements[0];\n            parent = (firstElement != null ? firstElement.parentElement : void 0) || parent;\n            elements = items.map(function(item, index, array) {\n              var element;\n              element = fn.call(item, item, index, array);\n              element[dataName] = item;\n              parent.insertBefore(element, firstElement);\n              return element;\n            });\n            return oldElements.each(function(element) {\n              return element.remove();\n            });\n          } else {\n            return elements = items.map(function(item, index, array) {\n              var element;\n              element = fn.call(item, item, index, array);\n              element[dataName] = item;\n              return element;\n            });\n          }\n        };\n        return replace(null, items);\n      },\n      \"with\": function(item, fn) {\n        var element, replace, value;\n        element = null;\n        item = Observable(item);\n        item.observe(function(newValue) {\n          return replace(element, newValue);\n        });\n        value = item();\n        replace = function(oldElement, value) {\n          var parent;\n          element = fn.call(value);\n          element[dataName] = item;\n          if (oldElement) {\n            parent = oldElement.parentElement;\n            parent.insertBefore(element, oldElement);\n            return oldElement.remove();\n          } else {\n\n          }\n        };\n        return replace(element, value);\n      },\n      on: function(eventName, fn) {\n        var element;\n        element = lastParent();\n        if (eventName === \"change\") {\n          switch (element.nodeName) {\n            case \"SELECT\":\n              element[\"on\" + eventName] = function() {\n                var selectedOption;\n                selectedOption = this.options[this.selectedIndex];\n                return fn(selectedOption[dataName]);\n              };\n              if (fn.observe) {\n                return fn.observe(function(newValue) {\n                  return Array.prototype.forEach.call(element.options, function(option, index) {\n                    if (option[dataName] === newValue) {\n                      return element.selectedIndex = index;\n                    }\n                  });\n                });\n              }\n              break;\n            default:\n              element[\"on\" + eventName] = function() {\n                return fn(element.value);\n              };\n              if (fn.observe) {\n                return fn.observe(function(newValue) {\n                  return element.value = newValue;\n                });\n              }\n          }\n        } else {\n          return element[\"on\" + eventName] = function(event) {\n            return fn.call(context, event);\n          };\n        }\n      }\n    };\n  };\n\n  module.exports = Runtime;\n\n}).call(this);\n\n//# sourceURL=runtime.coffee",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://strd6.github.io/editor/"
  },
  "entryPoint": "main",
  "remoteDependencies": [
    "https://d1n0x3qji82z53.cloudfront.net/src-min-noconflict/ace.js"
  ],
  "repository": {
    "id": 18083979,
    "name": "text",
    "full_name": "distri/text",
    "owner": {
      "login": "distri",
      "id": 6005125,
      "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
      "gravatar_id": "192f3f168409e79c42107f081139d9f3",
      "url": "https://api.github.com/users/distri",
      "html_url": "https://github.com/distri",
      "followers_url": "https://api.github.com/users/distri/followers",
      "following_url": "https://api.github.com/users/distri/following{/other_user}",
      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
      "organizations_url": "https://api.github.com/users/distri/orgs",
      "repos_url": "https://api.github.com/users/distri/repos",
      "events_url": "https://api.github.com/users/distri/events{/privacy}",
      "received_events_url": "https://api.github.com/users/distri/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "private": false,
    "html_url": "https://github.com/distri/text",
    "description": "Edit text documents within a value widget.",
    "fork": false,
    "url": "https://api.github.com/repos/distri/text",
    "forks_url": "https://api.github.com/repos/distri/text/forks",
    "keys_url": "https://api.github.com/repos/distri/text/keys{/key_id}",
    "collaborators_url": "https://api.github.com/repos/distri/text/collaborators{/collaborator}",
    "teams_url": "https://api.github.com/repos/distri/text/teams",
    "hooks_url": "https://api.github.com/repos/distri/text/hooks",
    "issue_events_url": "https://api.github.com/repos/distri/text/issues/events{/number}",
    "events_url": "https://api.github.com/repos/distri/text/events",
    "assignees_url": "https://api.github.com/repos/distri/text/assignees{/user}",
    "branches_url": "https://api.github.com/repos/distri/text/branches{/branch}",
    "tags_url": "https://api.github.com/repos/distri/text/tags",
    "blobs_url": "https://api.github.com/repos/distri/text/git/blobs{/sha}",
    "git_tags_url": "https://api.github.com/repos/distri/text/git/tags{/sha}",
    "git_refs_url": "https://api.github.com/repos/distri/text/git/refs{/sha}",
    "trees_url": "https://api.github.com/repos/distri/text/git/trees{/sha}",
    "statuses_url": "https://api.github.com/repos/distri/text/statuses/{sha}",
    "languages_url": "https://api.github.com/repos/distri/text/languages",
    "stargazers_url": "https://api.github.com/repos/distri/text/stargazers",
    "contributors_url": "https://api.github.com/repos/distri/text/contributors",
    "subscribers_url": "https://api.github.com/repos/distri/text/subscribers",
    "subscription_url": "https://api.github.com/repos/distri/text/subscription",
    "commits_url": "https://api.github.com/repos/distri/text/commits{/sha}",
    "git_commits_url": "https://api.github.com/repos/distri/text/git/commits{/sha}",
    "comments_url": "https://api.github.com/repos/distri/text/comments{/number}",
    "issue_comment_url": "https://api.github.com/repos/distri/text/issues/comments/{number}",
    "contents_url": "https://api.github.com/repos/distri/text/contents/{+path}",
    "compare_url": "https://api.github.com/repos/distri/text/compare/{base}...{head}",
    "merges_url": "https://api.github.com/repos/distri/text/merges",
    "archive_url": "https://api.github.com/repos/distri/text/{archive_format}{/ref}",
    "downloads_url": "https://api.github.com/repos/distri/text/downloads",
    "issues_url": "https://api.github.com/repos/distri/text/issues{/number}",
    "pulls_url": "https://api.github.com/repos/distri/text/pulls{/number}",
    "milestones_url": "https://api.github.com/repos/distri/text/milestones{/number}",
    "notifications_url": "https://api.github.com/repos/distri/text/notifications{?since,all,participating}",
    "labels_url": "https://api.github.com/repos/distri/text/labels{/name}",
    "releases_url": "https://api.github.com/repos/distri/text/releases{/id}",
    "created_at": "2014-03-25T00:38:39Z",
    "updated_at": "2014-03-25T00:38:40Z",
    "pushed_at": "2014-03-25T00:38:40Z",
    "git_url": "git://github.com/distri/text.git",
    "ssh_url": "git@github.com:distri/text.git",
    "clone_url": "https://github.com/distri/text.git",
    "svn_url": "https://github.com/distri/text",
    "homepage": null,
    "size": 0,
    "stargazers_count": 0,
    "watchers_count": 0,
    "language": null,
    "has_issues": true,
    "has_downloads": true,
    "has_wiki": true,
    "forks_count": 0,
    "mirror_url": null,
    "open_issues_count": 0,
    "forks": 0,
    "open_issues": 0,
    "watchers": 0,
    "default_branch": "master",
    "master_branch": "master",
    "permissions": {
      "admin": true,
      "push": true,
      "pull": true
    },
    "organization": {
      "login": "distri",
      "id": 6005125,
      "avatar_url": "https://avatars.githubusercontent.com/u/6005125?",
      "gravatar_id": "192f3f168409e79c42107f081139d9f3",
      "url": "https://api.github.com/users/distri",
      "html_url": "https://github.com/distri",
      "followers_url": "https://api.github.com/users/distri/followers",
      "following_url": "https://api.github.com/users/distri/following{/other_user}",
      "gists_url": "https://api.github.com/users/distri/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/distri/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/distri/subscriptions",
      "organizations_url": "https://api.github.com/users/distri/orgs",
      "repos_url": "https://api.github.com/users/distri/repos",
      "events_url": "https://api.github.com/users/distri/events{/privacy}",
      "received_events_url": "https://api.github.com/users/distri/received_events",
      "type": "Organization",
      "site_admin": false
    },
    "network_count": 0,
    "subscribers_count": 2,
    "branch": "master",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});