
var track_to_delete;
var rowind_to_delete;

function del_track(div, id)
{
    var options = { };
    //options.tasPk = tasPk;
    options.traPk = track_to_delete;
    options.comPk = url_parameter('comPk');
    console.log(options);

    $.post('delete_track.php', options, function (res) {
        console.log(res);

        var url;
        if (res.result == "ok")
        {
            var comPk = options.comPk;
            var jrow = $('#tracks tr:eq('+rowind_to_delete+')').remove();
            return;
        }
        else if (res.result == "unauthorised")
        {
            alert("Unauthorised to delete track");
        }
        else if (res.result != "ok")
        {
            alert(res.result + ": " + res.error);
            return;
        }
    });
      
    // delete from table ..  
}

function confirm_del_track(div, trackid)
{
    rowind_to_delete = div.parentNode.parentNode.parentNode.rowIndex;
    console.log('rowind='+rowind_to_delete);
    track_to_delete = trackid;

    $("#deltrack").modal();
}

$(document).ready(function() {
    $('#tracks').dataTable({
        ajax: 'get_admin_tracks.php' + window.location.search,
        paging: true,
        searching: true,
        info: false,
        order: [ 1, "desc" ],
        lengthMenu: [ 20, 50, 100, 1000 ],
        "dom": '<"#search"f>rt<"bottom"lip><"clear">',
        //"columnDefs": [ { "targets": [ 0 ], "visible": false } ],
        "createdRow": function( row, data, index, cells )
        {
            cells[6].innerHTML = '<b><a href="#/" onclick="confirm_del_track(this,'+data[0]+');">&cross;</a></b>';
        }
    });
});

