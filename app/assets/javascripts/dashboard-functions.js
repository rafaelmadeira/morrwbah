  function selectNextEntry(direction) {
     var $selected_entry = $('#feed-entry-list .entry.selected');
     var $next_selected;
     if ($selected_entry.size() > 0) {
       if (direction === 'prev') {
         $next_selected = $selected_entry.prev();
       } else {
         $next_selected = $selected_entry.next();
       }
     } else {
       if (direction === 'prev') {
         $next_selected = $('#feed-entry-list .entry').last();
       } else {
         $next_selected = $('#feed-entry-list .entry').first();
       }
     }

     if ($next_selected.size() === 0) {
       return;
     }
     $('.title', $next_selected).trigger('click');
  }

  function populateEntryList(id, feed_view, type) {
    if (typeof feed_view === 'undefined') {
      feed_view = 'unread';
    }  
    $.ajax({
      url: type+'s/'+id, 
      data: {feed_view: feed_view},
      type: 'GET',
      beforeSend: function() {
        $('#loading-notice.notice').removeClass('hidden');
      }
    }).done(function(data) {
      $('#feed-entry-list').html(data);
      refreashFeedList(type, id);
      $('#loading-notice.notice').addClass('hidden');
      $(window).trigger('resize');
    });
  }

  function refreashFeedList(type, active_id) {
    $.get('feeds', function(data) {
      $('#feed-list').html(data);
      $('#feed-list .feed-title div').removeClass('selected');
      $('#feed-list .folder-title div').removeClass('selected');
      if (typeof active_id != 'undefined') {
        $("."+type+"-title[data-id='"+active_id+"']").children('div').addClass('selected');
      }
      setSortableOnFeedList();
    });
  }


  function setSortableOnFeedList() {
    $('.sortable', '#feed-list').nestedSortable({
      forcePlaceholderSize: true,
      handle: 'div',
      items: 'li',
      opacity: .6,
      placeholder: 'placeholder',
      tabSize: 0,
      toleranceElement: '> div',
      maxLevels: 2,
      isTree: true,
      protectRoot: true,
      axis: 'y',
      update: function(event, ui) {
        var folder_structure_data = $(this).nestedSortable('toHierarchy');
        $.ajax({
          type: "POST",
          url: "/folders/update_order.json",
          data: JSON.stringify({folder_structure: folder_structure_data}),
          contentType: "application/json; charset=utf-8",
          dataType: "json",
        }).done(function(data, textStatus, jqXHR) {
        }).fail(function(jqXHR, textStatus, errorThrown) {
        });
      }
    });
  }

  function updateUnreadCount(feed_id, direction) {
    var $feed_title = $('#feed-'+feed_id+'.feed-title');
    var $folder_title = $feed_title.closest('li.folder-title');
    var $all_items = $('#all-items.feed-title');
    adjustUnreadCountOnElement($feed_title, direction);
    adjustUnreadCountOnElement($folder_title, direction);
    adjustUnreadCountOnElement($all_items, direction);
  }

  function adjustUnreadCountOnElement($elm, direction) {
    var current_unread = $elm.data('unread-count');
    var $div_handle = $('div:first', $elm);
    var $unread_count_span = $('span.unread-count:first', $elm);
    var new_unread;
    if (direction === 'up') {
      new_unread = current_unread + 1;
    } else {
      new_unread = current_unread - 1;
    }

    $elm.data('unread-count', new_unread);
    if (new_unread > 0) {
      $div_handle.addClass('unread');
      $unread_count_span.html('('+new_unread+')');
    } else {
      $div_handle.removeClass('unread');
      $unread_count_span.html('');
    }
  }

  function updateEntry($entry, data) {
    var params = {'_method': 'put', 'entry': data};
    var feed_id = $entry.data('feed-id');
    var entry_id = $entry.data('id');
    $.ajax({
      url: '/feeds/'+feed_id+'/entries/'+entry_id, 
      type: 'POST', 
      data: params
    }).done(function() { });
  }