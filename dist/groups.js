$(document).ready(function(){

  $("button.plus").on("click",function(){
    $("#groups").append("<div class=item><p>Group</p></div>");
  })

  $("button.minus").on("click",function(){
    $("#groups").children("div:last").remove();
  })

  })
