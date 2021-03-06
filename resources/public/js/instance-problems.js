
$(document).ready(function () {
    showLoader();

    $.get("/api/problems", function (instances) {
        $.get("/api/maintenance", function (maintenanceList) {
			normalizeInstances(instances, maintenanceList);
	        displayProblemInstances(instances);
	    }, "json");
    }, "json");
    function displayProblemInstances(instances) {
        hideLoader();
        
        function SortByProblemOrder(instance0, instance1){
        	var orderDiff = instance0.problemOrder - instance1.problemOrder;
        	if (orderDiff != 0) return orderDiff;
        	var orderDiff = instance1.SlaveLagSeconds.Int64 - instance0.SlaveLagSeconds.Int64;
        	if (orderDiff != 0) return orderDiff;
        	orderDiff = instance0.title.localeCompare(instance1.title);
        	if (orderDiff != 0) return orderDiff;
        	return 0;
        }
        instances.sort(SortByProblemOrder);

        var problemInstancesFound = false;
    	instances.forEach(function (instance) {
    		if (instance.hasProblem) {
	    		$("#instance_problems ul").append('<li><div xmlns="http://www.w3.org/1999/xhtml" class="popover instance" data-nodeid="'+instance.id+'"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div></li>');

	    		var popoverElement = $("#instance_problems [data-nodeid='" + instance.id + "'].popover");
	    		renderInstanceElement(popoverElement, instance, "problems");
	    	    popoverElement.click(function () {
	    	    	openNodeModal(instance);
	    	    	return false;
	    	    });	
	    		problemInstancesFound = true;
    		}
    	});        	
    	if (problemInstancesFound && (autoshowProblems() == "true")) {
    		$("#instance_problems .dropdown-toggle").dropdown('toggle');
    	}
    	if (!problemInstancesFound) {
    		$("#instance_problems").hide();
    	}
        
        $("div.popover").popover();
        $("div.popover").show();
    }
});	
