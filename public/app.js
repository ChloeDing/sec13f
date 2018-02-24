$(() => {

  var createTrElement = (eachRow) => {
    var $tr = $("<tr>");
    $("<td>").text(eachRow['Company Name']).appendTo($tr);
    $("<td>").text(eachRow['CUSIP']).appendTo($tr);
    $("<td>").text(eachRow['Old Shares']).appendTo($tr);
    $("<td>").text(eachRow['Old Value']).appendTo($tr);
    $("<td>").text(eachRow['New Shares']).appendTo($tr);
    $("<td>").text(eachRow['New Value']).appendTo($tr);
    $("<td>").text((eachRow['Share Change'] * 100).toFixed(2) + '%').appendTo($tr);
    $("<td>").text(eachRow['Note']).appendTo($tr);
    return $tr;
  };

  $('#compareButton').click((e) => {
    e.preventDefault();

    if (!((validator.isURL($('#oldurl').val()) && $('#oldurl').val().slice(-4) === '.xml') && (validator.isURL($('#newurl').val()) && $('#newurl').val().slice(-4) === '.xml'))) {
      alert('Please verify your inputs.');
      return;
    }
    
    var data = {
      oldUrl: $('#oldurl').val(),
      newUrl: $('#newurl').val()
    };
    $.ajax({
      type: "POST",
      url: '/compare',
      data: data
    }).done((data) => {
      $('#resultTable').DataTable().destroy();
      $('#resultTable tbody').empty();

      data.forEach((eachRow) => {
        var $tr = createTrElement(eachRow);
        $tr.appendTo($('#resultTable tbody'));
      });

      $('#resultTable').DataTable({
        "order": [[ 0, "asc" ]],
        "lengthMenu": [ [-1, 10, 25, 50], ["All", 10, 25, 50] ]
      });

      $('#resultTable').removeClass("invisible");
    });
  });

  $('#oldurl').change((e) => {
    if (validator.isURL($('#oldurl').val()) && $('#oldurl').val().slice(-4) === '.xml') {
      $("#okOld").addClass("text-success");
    } else {
      $("#okOld").removeClass("text-success");
    }
  });

  $('#newurl').change((e) => {
    if (validator.isURL($('#newurl').val()) && $('#newurl').val().slice(-4) === '.xml') {
      $("#okNew").addClass("text-success");
    } else {
      $("#okNew").removeClass("text-success");
    }
  });

  $('#clearOld').click((e) => {
    $('#oldurl').val("").change();
    $('#resultTable').addClass("invisible");
    $('#resultTable').DataTable().destroy();
    $('#resultTable tbody').empty();
  });

  $('#clearNew').click((e) => {
    $('#newurl').val("").change();
    $('#resultTable').addClass("invisible");
    $('#resultTable').DataTable().destroy();
    $('#resultTable tbody').empty();
  });

})