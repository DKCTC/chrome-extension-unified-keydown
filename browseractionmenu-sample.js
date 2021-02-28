
//browseractionmenu functions for listing and triggering the events on the active tab

//-requires jQuery and chrome-extension-port-communications
//https://github.com/DKCTC/chrome-extension-port-communications


//open connection
var menuConnection = new Port({name: 'browser-action-menu'});

//function to get the keydown list from the current tab in a browseraction menu
function getKeydown(tabID){
	//existing container for the keydown list
	var list = $('.menu-keydown-list');

	//if there is no list container, add one
	if(!list.length){
		list = $('<div class="menu-keydown-list" />').appendTo($('body'));
	}//if
	
	//get the ext-keydown obj from the active tab and update the shortcut list
	//-this does not include the callback functions
	//-need to add buttons and a listener to keydown that creates and executes the corresponding keydown event
	//TODO: group shortcuts with the same button together, and come up with a sort order
	menuConnection.tabMessage(tabID,{method:'getKeydown'},function(response){
		//go through response array
		if(!response || !response.length){
			//disable menu item
			$('.menu-keydown-item.labels.keydown').addClass('disabled');
		} else {
			var items = [];
			response.forEach((_events,idx) => {
				//go through event obj
				$.each(_events,function(i,v){
					items.push('<div data-which="'+i+'" data-modifiers="'+v.modifiers.join(',')+'" class="_row">'
						+'<div class="keydown-button">'
							+v.shortcut
						+'</div>'
						+'<span>'
							+'<span>'+v.title+'</span>'	
							+'<span>'+v.desc+'</span>'
						+'</span>'
					+'</div>');
				});
			});
			list.append(items.sort().join(''));
		}//if
	});

};//func

//get the list of keyboard shortcuts from the active tab and update the list
chrome.tabs.getSelected(function(tab){
	getKeydown(tab.id);
});

//keyboard shortcut list click events in a browser action menu
$('.menu-keydown-list').on('click','._row',function(ev){
	var $this = $(this),
		//create the event to be triggered
		ev = Object.assign(...$this.attr('data-modifiers').split(/\s*,\s*/).map(d => ({[d]: true})));

	//set the keycode
	ev.which = $this.attr('data-which');
	//delete the blank key entry
	delete ev[''];
	//send tab msg to fire selected event
	menuConnection.tabMessage(tabID,{method:'triggerKeydown', ev: ev});
	//close the menu
	window.close();
});
