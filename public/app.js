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
})