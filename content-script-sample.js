

//contentscript/extension page functions for adding new shortcuts and updating the ext-keydown document data obj

//-requires jQuery and chrome-extension-port-communications
//https://github.com/dkline03/chrome-extension-port-communications


//add the keydown events to the document keydown data array
//-keyed by ev.which, contains modifiers, like alt, ctrl, shift, etc
//--firing conditions handled in callbacks

//need to wait until doc ready so that keys.js events get added first
$(document).ready(function(){
	//-sample events
	var csKeydown = {
		113: { //shift + F2
			modifiers: [ 'shiftKey' ],
			shortcut:'F2',
			title:'Do something with shift and F2',
			desc: 'Describe what happens here',
			callback: function(ev){
				//sample: send a message to the existing tab connection that was created in a different script
				existingTabConnection.postMessage({ method: 'f2-thing' });
			}
		},
		118: { //alt + F7
			modifiers: [ 'altKey' ],
			shortcut:'Alt + F7',
			title: 'Do something with alt and F7',
			desc: 'Allan please add details',
			callback: function(ev){
				//do something
				console.log('You pressed Alt + F7');
			}
		},
		27: { //esc
			modifiers: [],
			shortcut:'Esc',
			title: 'Do something with Esc',
			desc: 'Escape from something',
			callback: function(ev){
				//do something
				console.log('You pressed Esc');
			}
		},
		66: { //alt + b
			modifiers: [ 'ctrlKey' ],
			shortcut:'Ctrl + b',
			title: 'Do something with ctrl and B',
			desc: 'Control bees',
			callback: function(ev){
				//do something
				typeof(localBeeControlFunction) == 'function' && localBeeControlFunction();
			}
		},
		//blank obj for future additions
		/*1: { // alt + 
			modifiers: [ 'altKey' ],
			shortcut:'',
			title: '',
			desc: '',
			callback: function(){  }
		},*/
	};

	//add these keydown events to the existing keydown event data obj
	//-uses an array so that content scripts can add their own keydown events
	//-and so that the same key can be reused with different (or not) modifiers (like F7 for tab manager and incrementReload in production.js)
	$(document).data('ext-keydown',($(document).data('ext-keydown') || []).concat([csKeydown]));

}); //doc ready
