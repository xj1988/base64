$(function(){
    $("#clearLog").on('click',function(){
        $("#toXml").val('');
        console.log('hello trigger event!')
    })


    $("#download").on('click',function(){
        exportExcel('all_input_data',"query/download")
    })

    $("#downloadinner").on('click',function(){
        exportExcel('all_input_data',"query/downloadinner")
    })

    $("#remove").on('click',function(){
        var number = document.getElementById("number").value;
        var code = document.getElementById("code").value;
        if(!number && !code) {
            layer.alert("票据代码或号码不能为空！");
            return false;
        }
        var data = {};
        data.code =code;
        data.number =number;
        removeHbase(data)
    })

    $("#uploadinner").on('click',function(){
        var obj = document.getElementById("uploadFile");
        var number = document.getElementById("number");
        var code = document.getElementById("code");
        var files =  obj.files;
        if(!files||files.length==0) {
            layer.alert("请添加文件！");
            return false;
        }
        console.log(files);
        uploadInner(files,number,code);
    })

    $("#transferTo").on('click',function(){
        data = getdata();
        requestTransfer(data);
    })

})

function uploadInner(files,number,code) {
    var formData = new FormData();
    for(var i = 0 ; i <files.length;i++) {
        formData.append(files[i].name,files[i]);
    }
    formData.append("number",number.value);
    formData.append("code",code.value);

    $.ajax({
        url:"upload/hbaseFile",
        async:false,
        type: 'POST',
        data:formData,
        processData: false,
        contentType: false,
        success:function(ret) {
            //console.log(ret);
            if(ret.retCode == 200) {
                layer.alert("上传成功");
            } else{
                layer.alert(ret.message);
            }
        },
        error:function(ret){
            console.log(ret);
        }
    })
}

function getdata() {
    var code = $("#code").val();
    var number = $("#cnumber").val();
    var checkCode = $("#checkCode").val();
    var url = $("#url").val();
    var appid = $("#appid").val();
    var appkey = $("#appkey").val();
    var version = $("#selectversion").val();
    // var code = document.getElementById("code");

    var data = {};
    data.code =code;
    data.number =number;
    data.checkCode =checkCode;
    data.url =url;
    data.appid =appid;
    data.appkey =appkey;
    data.version =version;
    console.log(data);
    return data;
}

function requestTransfer(data) {

    $.ajax({
        url:"query/downAndParse",
        async:false,
        type: 'POST',
        data: JSON.stringify(data),
        processData: false,
        contentType: false,
        success:function(ret) {
            console.log(ret);
            if(ret) {
                $("#toXml").val(render(ret))
            }
        },
        error:function(ret){
            console.log(ret);
            console.log(ret.responseText);
            layer.alert(JSON.parse(ret.responseText).message);
        }
    })
}


function removeHbase(data) {

    $.ajax({
        url:"invoice/removeFile",
        async:false,
        type: 'POST',
        data: JSON.stringify(data),
        processData: false,
        contentType: false,
        success:function(ret) {
            layer.alert(ret);
        },
        error:function(ret){
            console.log(ret);
            layer.alert(JSON.parse(ret.responseText).message);
        }
    })
}


function download(data) {

    $.ajax({
        url:"query/download",
        async:false,
        type: 'POST',
        data: JSON.stringify(data),
        processData: false,
        contentType: false,
        success:function(ret) {
            console.log(ret);
        },
        error:function(ret){
            console.log(ret);
            layer.alert(JSON.parse(ret.responseText).message);
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

function exportExcel(formId, url) {
    try {
        var queryForm = $("#" + formId);
        var exportForm = $("<form action='" + url + "' method='post'></form>")

        queryForm.find("input").each(function() {
            var name = $(this).attr("name");
            var value = $(this).val();
            exportForm.append("<input type='hidden' name='" + name + "' value='" + value + "'/>")
        });

        queryForm.find("select").each(function() {
            var name = $(this).attr("name");
            var value = $(this).val();
            exportForm.append("<input type='hidden' name='" + name + "' value='" + value + "'/>")
        });

        $(document.body).append(exportForm);
        exportForm.submit();
    } catch (e) {
        console.log(e);
    } finally {
        exportForm.remove();
    }
}