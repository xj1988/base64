$(function(){

    $("#transferTo").on('click',function(){
        var obj = document.getElementById("jsonFile");
        var files =  obj.files;
        if(!files||files.length==0) {
            layer.alert("请添加文件！");
            return false;
        }
        $("#wu-form-stuInfo").submit();
    })

})
