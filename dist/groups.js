$(document).ready(function(){

  $("#form1").toggle();
  $("button.plus").on("click",function(){
    $("#form1").toggle();
  })

  $("#submit").on("click",function(){
    $("#form1").toggle();

      var value = $("input:text[name=groupName]").val();
      var value2 = $("input:text[name=Description]").val();
      var txt = "<div class=item><p>"+value+"</p><p>"+value2+"</p></div>"
      $("#groups").append(txt);

  })

  $("button.minus").on("click",function(){
    $("#groups").children("div:last").remove();
  })




  })
