$(function(){
    $("#clearLog").on('click',function(){
        $("#toXml").val('');
        console.log('hello trigger event!')
    })

    $("#transferTo").on('click',function(){
        var obj = document.getElementById("uploadFile");
        var files =  obj.files;
        if(!files||files.length==0) {
            layer.alert("请添加文件！");
            return false;
        }
        console.log(files);
        requestTransfer(files);
    })

})

function requestTransfer(files) {
    var formData = new FormData();
    for(var i = 0 ; i <files.length;i++) {
        formData.append(files[i].name,files[i]);
    }

    $.ajax({
        url:"upload/model_file",
        async:false,
        type: 'POST',
        data:formData,
        processData: false,
        contentType: false,
        success:function(ret) {
            //console.log(ret);
            if(ret) {
                $("#toXml").val(render(ret))
            }
        },
        error:function(ret){
            console.log(ret);
        }
    })
}

function render(xmaps) {
    var text = '================================================================================\n'
    for(var k in xmaps) {
        text+=k+"\n"
        text+=xmaps[k];
        text+='\n===================================================================================\n'
    }

    return text;
}
