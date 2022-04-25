jQuery(function($) {
	var panelList = $('#draggablePanelList');

	panelList.sortable({
		// Only make the .panel-heading child elements support dragging.
		// Omit this to make then entire <li>...</li> draggable.
		handle: '.panel-heading', 
		update: function() {
			$('.panel', panelList).each(function(index, elem) {
				 var $listItem = $(elem),
					 newIndex = $listItem.index();

				 // Persist the new indices.
			});
		}
	});
});

jQuery(function($) {
	var panelList2 = $('#draggablePanelList2');

	panelList2.sortable({
		// Only make the .panel-heading child elements support dragging.
		// Omit this to make then entire <li>...</li> draggable.
		handle: '.panel-heading', 
		update: function() {
			$('.panel', panelList2).each(function(index, elem) {
				 var $listItem = $(elem),
					 newIndex = $listItem.index();

				 // Persist the new indices.
			});
		}
	});
});