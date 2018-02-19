$(() => {
  $('#compareButton').click((e) => {
    e.preventDefault();
    var data = {
      oldUrl: $('#urlold').val(),
      newUrl: $('#urlnew').val()
    };
    $.ajax({
      type: "POST",
      url: '/compare',
      data: data
    }).done((data) => {
      alert(data);
    });
  });
})