
function plot_pilots_lo(tasPk)
{
    microAjax("get_pilots_lo.php?tasPk="+tasPk,
	  function(data) {
          var pilots;
          var pos;
        
    
          // Got a good response, create the map objects
          pilots = RJSON.unpack(JSON.parse(data));
          //pbounds = new L.LatLngBounds();

          for (row in pilots)
          {
              var overlay;
              lat = pilots[row]["trlLatDecimal"];
              lon = pilots[row]["trlLongDecimal"];
              name = pilots[row]["name"];

              //alert("name="+name+" lat="+lat+" lon="+lon);
              pos = new L.LatLng(lat,lon);
              if (!pbounds)
              {
                pbounds = pos.toBounds();
              }
              else
              {
                pbounds.extend(pos);
              }
              overlay = add_label(map, pos, name, "pilot");
      
          }
        
          map.fitBounds(pbounds);
    });
}
function add_map_row(comPk,task, count)
{
    var colmd7 = document.createElement("div");
    colmd7.className="col-md-7";

    var colmd5 = document.createElement("div");
    colmd5.className="col-md-5";


    var canvas = 'map_canvas' + count;
    var canvasdiv = document.createElement("div");
    canvasdiv.setAttribute('id', canvas);
    canvasdiv.setAttribute('style', 'top: 10px; left: 10; width:100%; height:300px; float: left');

    //var createA = document.createElement('a');
    //createA.setAttribute('href', '#');
    //createA.appendChild(canvasdiv);
    colmd7.appendChild(canvasdiv);

    var body = document.createElement('div');
    body.innerHTML = '<br><h3 id=\"task_hd\">Task '+task.tasName+'</h3><h4>'+task.tasDate+'</h4>' +
                    task.tasComment + 
                    '<br><table class="taskinfo">' +
                    '<tr><td>Task Type:</td><td>' + task.tasTaskType.toUpperCase() + '</td></tr>' + 
                    '<tr><td>Task Distance:</td><td>' + task.tasShortest + ' km</td></tr>' + 
                    '<tr><td>Day Quality:</td><td>' + task.tasQuality + '</td></tr></table><br>';

    var createB = document.createElement('a');
    createB.setAttribute('href', 'task_result.html?comPk='+comPk+'&tasPk='+task.tasPk);
    createB.className="btn btn-primary";
    createB.appendChild(document.createTextNode('Task Scores'));

    body.appendChild(createB);
    colmd5.appendChild(body);

    var ele = document.getElementById('row'+count);
    ele.appendChild(colmd7);
    ele.appendChild(colmd5);

    ele.style.paddingBottom = "40px";
}
function plot_all_tasks(comPk)
{
    microAjax("get_all_tasks.php?comPk="+comPk, 
    function (data) 
    {
        var comp_tasks = JSON.parse(data);
        var count = 1;

        // setup comp info
        var ele = $('#comp_name');
        ele.html(comp_tasks.comp.comName + " - <small>" + comp_tasks.comp.comLocation + "</small>");
        ele.append($('<div class="row"><div class="col-md-6"><h5>'+comp_tasks.comp.comDateFrom + ' - ' + comp_tasks.comp.comDateTo + '</h5></div>'));
        if (comp_tasks.comp.regPk)
        {
            ele.append($('<div class="row"><div class="col-md-6"><a href="waypoint_map.html?regPk=' + comp_tasks.comp.regPk + '" class="btn btn-secondary">Waypoints</a></div></div>'));
        }
        //ele.append($('<div class="col-md-6"><h5>'+comp_tasks.comp.comMeetDirName + '</h5></div></div>>'));

        // plot tasks
        var all_tasks = comp_tasks.tasks;
        if (all_tasks.length == 0)
        {
           ele.append($('<hr><center><h4 class="display-4">No Tasks</h4></center>'));
        }
        for (taskid in all_tasks)
        {
            var taskinfo = all_tasks[taskid];
            if (taskinfo.waypoints.length > 0)
            {
                add_map_row(comp_tasks.comp.comPk, taskinfo.task, count);
                map = add_map_server('map_canvas'+count, count-1);
                plot_task_route(map, taskinfo.waypoints);
                count++;
            }
        }

        // add footer
        var foot = document.createElement("footer");
        foot.className="py-5 bg-dark";
        var footdiv = document.createElement("div");
        footdiv.className = "container";
        var para = document.createElement("p");
        para.className = "m-0 text-center text-white";
        para.appendChild(document.createTextNode('airScore'));
        footdiv.appendChild(para);
        foot.appendChild(footdiv);

        $('#main').append($('<hr>'));
    });

}

$(document).ready(function() {
    var comPk = url_parameter("comPk");

    comPk = url_parameter("comPk");
    plot_all_tasks(comPk);
});

