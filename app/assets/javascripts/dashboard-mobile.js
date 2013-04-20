entry_ids = [];
$( document ).on( "pageinit", "[data-role='page']#entry-list", function() {
  entry_ids = $(this).data('entry-ids').split(",");
});

$( document ).on( "pageinit", "[data-role='page'].view-entry", function() {
  var current_id = $(this).data("id"); 
  var page = "#" + $( this ).attr("id");
  var current_pos = $.inArray(current_id.toString(), entry_ids);
  var next = 0;
  var prev = 0;
  if (current_pos !== -1) {
    if (current_pos > 0) {
      prev = parseInt(entry_ids[current_pos-1]);
    }
    if (current_pos < entry_ids.length-1) {
      next = parseInt(entry_ids[current_pos+1]);
    }
  }

  if (next > 0) {
    var next_url = "/entries/"+next;
    $( document ).on( "swipeleft", page, function() {
      $.mobile.changePage(next_url, { transition: "slide" });
    });
    $( ".control .next", page ).on( "click", function() {
      $.mobile.changePage(next_url, { transition: "slide" } );
    });
  } else {
    $(".control .next", page).addClass( "ui-disabled" );
  }

  if (prev > 0) {
    var prev_url = "/entries/"+prev;
    $( document ).on( "swiperight", page, function() {
      $.mobile.changePage(prev_url, { transition: "slide", reverse: true } );
    });
    $( ".control .prev", page ).on( "click", function() {
      $.mobile.changePage(prev_url, { transition: "slide", reverse: true } );
    });
  } else {
    $(".control .prev", page).addClass( "ui-disabled" );
  }

});
