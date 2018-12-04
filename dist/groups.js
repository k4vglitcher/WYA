$(document).ready(function(){

  $("button.plus").on("click",function(){
    $("#groups").append("<div class=item><p>Group</p></div>");
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
