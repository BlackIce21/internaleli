<script>
$('empbtn').click(function () {
  $.post('/userslogin', {data: 'blah'}, function (data) {
    console.log(data);
  });
}, 'json');
</script>
