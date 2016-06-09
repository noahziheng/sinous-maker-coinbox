$(function () {
    $("#reg-showpass").click(function(){
        if($("#reg-password").attr('type') == 'text'){
            $("#reg-password").attr('type','password');
        }else{
            $("#reg-password").attr('type','text');
        };
    });
    $("#edit-showpass").click(function(){
        if($("#newpass").attr('type') == 'text'){
            $("#newpass").attr('type','password');
        }else{
            $("#newpass").attr('type','text');
        };
    });
});