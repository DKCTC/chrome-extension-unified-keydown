
//used for adding keyboard shortcuts in content scripts and extension pages that can be listed in and fired from the browseraction menu
//-include in manifest for content scripts and as a regular script for extension pages

//-requires jQuery and chrome-extension-port-communications
//https://github.com/DKCTC/chrome-extension-port-communications

//TODO: make a version that does not require jQuery

(function($){
	
	//------------- START TEXT CASE SAMPLE -------------	

	//SAMPLE prototypes to support the text toggle function:
	//string titlecase prototype
	//-capitalize the first letter of the given string, ignoring HTML tags
	String.prototype.toTitleCase = function(f){
		//if f, first letter capital (also capture dollar signs), the rest lowercase, else every word starts with a capital letter
		return (!!f &&
				this.replace(/(?=.*\b[\w$]\w*\b)(?!<*\/*[\w\s="'-]*>)(?=.*\b[\w$]\w*\b)\w+/g, function(txt){ return txt.toLowerCase();})
					.replace(/(?=.*\b[\w$]\w*\b)(?!<*\/*[\w\s="'-]*>)(?=.*\b[\w$]\w*\b)\w/, function(txt){ return txt.toUpperCase();}))
			//else capitalize every word
			|| this.replace(/(\w+)(?!<*\/*[\w\s="'-]*>)(\w*)/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	}//func

	//string uppercase / lowercase text prototypes
	//-make the string uppercase/lowercase, ignoring HTML tags
	String.prototype.toUpperCaseText = function(){
		return this.replace(/(\w+)(?!<*\/*[\w\s="'-]*>)(\w*)/g, function(txt){return txt.toUpperCase();});
	}//func
	String.prototype.toLowerCaseText = function(){
		return this.replace(/(\w+)(?!<*\/*[\w\s="'-]*>)(\w*)/g, function(txt){return txt.toLowerCase();});
	}//func

	//sample function: toggle case of selected text between original and both title cases
	var toggleTextCase = function(ev){
		var t, el = $(ev.target);
		if(!!el.is('textarea,input[type="text"]')){
			t = el.getSelection();
			//eventually extend the select to cover whole words on either end maybe
			//-add thing to ignore html tags, also add to codemirror eventually
			switch(true){
				//if the text has not yet been toggled, or this is different text
				case(!el.data('text-selection') || el.data('text-selection').start != t.start || el.data('text-selection').end != t.end):
					el.data('text-selection',{o:t.text,tc:t.text.toTitleCase(),start:t.start,end:t.end,len:t.length});
					el.replaceSelectedText(t.text.toTitleCase(),'select');
				break;
				//if it has been toggled but not to the title case variant, toggle to the title case variant
				case(!el.data('text-selection').tct):
					el.data('text-selection').tct = t.text.toTitleCase(true);
					el.replaceSelectedText(t.text.toTitleCase(true),'select');
				break;
				//if there are any lowercase letters at this point, make them all uppercase
				case(!el.data('text-selection').up):
					el.data('text-selection').up = t.text.toUpperCaseText();
					el.replaceSelectedText(t.text.toUpperCaseText(),'select');
				break;
				//if there are all uppercase letters at this point, make them all lowercase
				case(!el.data('text-selection').low):
					el.data('text-selection').low = t.text.toLowerCaseText();
					el.replaceSelectedText(t.text.toLowerCaseText(),'select');
				break;
				//else go back to the original
				default:
					el.replaceSelectedText(el.data('text-selection').o,'select');
					el.removeData('text-selection');
				break;
			}//switch
		}//if
	};//func

	//------------- END TEXT CASE SAMPLE -------------

	//set to true in the dev console to enable console logging of the keycode, key, and event, good for finding key codes
	window._keys = false;

	//open connection to background script
	var keysConnection = new Port({name: 'keydown'});

	//broadcast listeners used to retrieve the tab's keyboard shortcuts and to execute their functions from the browseractionmenu
	keysConnection.addBroadcastListener({
		'getKeydown': function(msg, sender, sendResponse) {
			sendResponse($(document).data('ext-keydown'));
		},
		'triggerKeydown': function(msg, sender, sendResponse) {
			msg.ev.type = 'keydown';
			//{ type : 'keydown', which : 82, altKey: true }
			$.event.trigger(msg.ev);
		}
	});
	
	//keyboard shortcut object that is used by browseractionmenu to list the keyboard shortcuts and provide a clickable list
	//-any default global shortcuts should be added here

	//-sample shortcuts
	//--keyed by the keycode
	//--modifiers - an array of key modifiers, like alt and ctrl, use blank array for no modifiers
	//--shortcut - the text to appear in the browseractionmenu list
	//--desc - a description of the shortcut to appear in the browseractionmenu list
	//--callback - the function to execute
	var _keydown = {
		87: { //alt + w
			modifiers: [ 'altKey' ],
			shortcut:'Alt + w',
			title: 'Duplicate tab',
			desc: 'Open a copy of this page in a new tab',
			callback: function(ev){
				keysConnection.postMessage({ method: 'clone-tab',clone:true }, function(resp){
					return true;
				});
			}
		},
		//------------- START TEXT CASE SAMPLE -------------
		85: { //alt + u
			modifiers: [ 'altKey' ],
			shortcut:'Alt + u',
			title: 'Toggle text case (upper, lower, title, etc)',
			desc: 'Toggle the case of the text selected in text input fields',
			callback: toggleTextCase
		},
		//------------- END TEXT CASE SAMPLE -------------
		118: { //F7
			modifiers: [],
			shortcut:'F7',
			title: 'Do something else',
			desc: 'Do something else that is maybe cool',
			callback: function(ev){
				//can check for modifiers to prevent the behavior
				!ev.altKey && keysConnection.postMessage({ method: 'do-something' });
			}
		}
		//blank obj for future additions
		/*1: { //
			modifiers: [ 'altKey' ],
			shortcut:'',
			title: '',
			desc: '',
			callback: function(ev){  }
		},*/
	};
	
	//add these keydown events to the existing keydown event data obj
	//-uses an array so that content scripts can add their own keydown events
	//-and so that the same key can be reused with different (or not) modifiers
	$(document).data('ext-keydown',($(document).data('ext-keydown') || []).concat([_keydown]));

	//global keydown events
	$(window).on('keydown',function(ev){
		//log the key information if _keys is true, which must be set manually in the dev console
		//-great for quickly finding keycodes
		if(!!window._keys){
			console.log('unified-keydown.js: '+ev.which+' | '+ev.key);
			console.debug(ev);
		}//if
		
		//loop through the ext-keydown array
		//if there is an event for this key and all of the correct modifiers are being pressed
		//-fire the callback
		($(document).data('ext-keydown') || []).forEach(function(_events,idx){
			//if there is an event and the number of modifiers left after the event obj filter matches the number of modifiers sent
			if(!!_events[ev.which]
				&& _events[ev.which].modifiers.filter((v,i) => (ev[v] || false)).length == _events[ev.which].modifiers.length){
				//fire the callback
				_events[ev.which].callback(ev);
			}//if
		});
	});
})(jQuery);
