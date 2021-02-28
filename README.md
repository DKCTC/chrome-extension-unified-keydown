# chrome-extension-unified-keydown
Script for Chrome extensions to define keyboard shortcuts in content scripts, including modifiers, that can be listed and executed with the browser action menu

Tested through **Chrome 72**

Requires **chrome-extension-port-communications** [GitHub](https://github.com/DKCTC/chrome-extension-port-communications)

Requires **jQuery** - tested on 3.3.1, but should work on older versions


## Usage 

Full documentation coming soon! For now, there are js files with some samples in them. There are also notes in the code itself.

The **unified-keydown.js** file must be included in the manifest entry for the content scripts, or as a regular script on extension pages.

**Suggested usage** - include this script on <all_urls> so that the global shortcuts will work as expected

The code from **content-script-sample.js** must be placed inside the content script/extension page script to which you wish to add the keyboard shortcuts and events.

The code from **browseractionmenu-sample.js** must be included in the browseractionmenu script to be able to list the shortcuts and make the list clickable, and have the events fire on the active tab. **browseractionmenu-sample.css** contains sample styling for the shortcut list.

The code from **background-sample.js** is optional, but allows for functions that can only be run in the background script to be mapped to a keyboard shortcut.


### Included sample shortcuts:

**Alt + w** - clones the current tab, requires the code from the background sample js file

**Alt + u** - Toggles text case of selected text in input fields or textareas between _Sentence case_, _Title Case_, _lower_, _UPPER_, and _oRiGinAl_

*NOTE:* The text case toggle function requires the included string prototypes. If you don't feel comfortable using prototypes, then they and the shortcut entry can be removed, or can be rewritten to not use prototypes.

## Support

Please submit an issue.


## License

Copyright (c) 2021 DKCTC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
