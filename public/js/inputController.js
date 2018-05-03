

  // Code using $ as usual goes here; the actual jQuery object is jq2
  for(var i=1; i < 4; i++){
  $("#AB"+i).on('input',function(e){
      $("#BA"+i+"").val("1/"+$(this).val());
      console.log ($("#BA"+i+"").val());
     console.log("1/"+$(this).val());
  });
  //LINE B
  $("#BA"+i).on('input',function(e){
      $("#AB"+i+"").val("1/"+$(this).val());
     console.log($(this).val());
  });

  //LINE C

  $("#CA"+i).on('input',function(e){
      $("#AC"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });
  $("#CB"+i).on('input',function(e){
      $("#BC"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });

  //LINE D
  $("#DA"+i).on('input',function(e){
      $("#AD"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });
  $("#DB"+i).on('input',function(e){
      $("#BD"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });
  $("#DC"+i).on('input',function(e){
      $("#CD"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });

  //LINE E

  $("#EA"+i).on('input',function(e){

     console.log($(this).val());
  }).blur(function() { $("#AB"+1).val("1/"+$(this).val());  });
  //console.log($(this).val());



  $("#EB"+i).on('input',function(e){
      $("#BE"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });
  $("#EC"+i).on('input',function(e){
      $("#CE"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });
  $("#ED"+i).on('input',function(e){
      $("#DE"+i).val("1/"+$(this).val());
     console.log($(this).val());
  });

//LINE F

$("#FA"+i).on('input',function(e){
    $("#AF"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#FB"+i).on('input',function(e){
    $("#BF"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#FC"+i).on('input',function(e){
    $("#CF"+i).val(parseInt(""+i)/parseInt($(this).val()));
   console.log($(this).val());
});
$("#FD"+i).on('input',function(e){
    $("#DF"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#FE"+i).on('input',function(e){
    $("#EF"+i).val("1/"+$(this).val());
   console.log($(this).val());
});

//LINE G
$("#GA"+i).on('input',function(e){
    $("#AG"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#GB"+i).on('input',function(e){
    $("#BG"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#GC"+i).on('input',function(e){
    $("#CG"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#GD"+i).on('input',function(e){
    $("#DG"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#GE"+i).on('input',function(e){
    $("#EG"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#GF"+i).on('input',function(e){
    $("#FG"+i).val("1/"+$(this).val());
   console.log($(this).val());
});

// LINE H
$("#HA"+i).on('input',function(e){
    $("#AH"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#HB"+i).on('input',function(e){
    $("#BH"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#HC"+i).on('input',function(e){
    $("#CH"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#HD"+i).on('input',function(e){
    $("#DH"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#HE"+i).on('input',function(e){
    $("#EH"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#HF"+i).on('input',function(e){
    $("#FH"+i).val("1/"+$(this).val());
   console.log($(this).val());
});
$("#HG"+i).on('input',function(e){
    $("#GH"+i).val("1/"+$(this).val());
   console.log($(this).val());
});

}


/*
  $("#AB2").on('input',function(e){
      $("#BA2").val("1/"+$(this).val());
     console.log($(this).val());
  });
  $("#BA2").on('input',function(e){
      $("#AB2").val("1/"+$(this).val());
     console.log($(this).val());
  });
*/
