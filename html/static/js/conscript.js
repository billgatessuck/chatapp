
var connected = false;



var socket = io(addr);

socket.on('connect', function(){
  connected = true;
  $('#chatBody > h3').hide();
});

socket.on('disconnect', function(){
  connected = false;
});

socket.on('connect_error', function(){
  $('#chatBody > h3').text('Error Connecting');
  $('#chatBody > h3').show();
  $('#active_num').hide();
});

socket.on('reconnect', function(){
  $('#active_num').show();
  $('#chatBody > h3').hide();
});

socket.on('userconn', function(data){
  $('#active_num').text(data);
  $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
});
socket.on('cmessage', function(data){
  $('#chatBody').append('<div class="left">'+data.data+'<span>'+ adjDate(data.time) +'</span></div><br/>');
  $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
});
function chatSend(){
  if(connected){
    var text = $('#chatInput').val();
    if(text.trim() == ""){
      return false;
    }
    socket.emit('message', text);
    $('#chatBody').append('<div class="right">'+text+'<span>'+ adjDate(0) +'</span></div><br/>');
    $('#chatInput').val('');
    $('#chatBody').scrollTop($('#chatBody')[0].scrollHeight);
  }
  return false;
}

function adjDate(ts){
  if(ts==0){
    var date = new Date();
  }
  else {
    var date = new Date(ts);
  }
  var hh = date.getHours();
  var min = date.getMinutes();
  var ampm = hh>=12? 'PM' : 'AM';
  hh = hh%12==0 ? 12:hh%12;
  if(min < 10)
  return dformat = '&nbsp&nbsp&nbsp&nbsp&nbsp' + hh + ':0' + min + ' ' + ampm;
  else
  return dformat = '&nbsp&nbsp&nbsp&nbsp&nbsp' + hh + ':' + min + ' ' + ampm;
}
