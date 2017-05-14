function resizeChatDiv(){
  var h = window.innerHeight;
  $('#chatBody').height(h-180);

}
function onreadycalls(){
  resizeChatDiv();
  $('#chatInput').focus();
}
$(document).ready(onreadycalls);
$(window).resize(resizeChatDiv);
