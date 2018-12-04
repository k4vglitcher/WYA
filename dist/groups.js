$(document).ready(function(){

  $("#form1").toggle();
  $("button.plus").on("click",function(){
    $("#form1").toggle();
  })

  $("#submit").on("click",function(){
    $("#form1").toggle();
  })

  $("button.minus").on("click",function(){
    $("#groups").children("div:last").remove();
  })

  $('#theform').submit(function(){
    $("input[type='submit']", this)
      .val("Please Wait...")
      .attr('disabled', 'disabled');
    return true;
  });



  })
