
//sample background.js functions for receiving keydown events that require the background script to execute

//-requires chrome-extension-port-communications
//https://github.com/DKCTC/chrome-extension-port-communications

//the incoming port connection
var backgroundConnection = new Port();

//set all of the background communication listeners using chrome-extension-port-communications
backgroundConnection.addBroadcastListener({
	//clone the tab using the keyboard shortcut, default Alt + w
	'clone-tab': function(msg, sender, sendResponse) {
		chrome.tabs.create({url: msg.url, index: ((msg.index || (sender.tab && sender.tab.index))+1),active:true},function(tab){
			sendResponse({tabID:tab.id});
			return true;
		});
	},
	//do something
	'do-something': function(msg, sender, sendResponse) {
		sendResponse({something:'done'});
		return true;
	}
});

