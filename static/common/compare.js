$(function(){
    $("#checkxml").on('click',function(){
        var xml = $("#financexml").val();
        if(xml) {
            requestTransfer(xml);
        } else {
            layer.alert("请传入财政xml！");
        }
    })

})

function requestTransfer(xml) {
    var formData = new FormData();
    formData.append("xml",xml);
    $.ajax({
        url:"xml/comparestand",
        async:false,
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success:function(ret) {
            console.log(ret);
            if(ret) {
                $("#toXml").val(render2(ret))
            }
        },
        error:function(ret){
            console.log(ret);
            console.log(ret.responseText);
            layer.alert(JSON.parse(ret.responseText).message);
        }
    })
}

function render2(xmaps) {
    // var text = '================================================================================\n'
    var text = "";
    for(var k in xmaps) {
        // text+=k+"\n"
        text+=xmaps[k];
        text+='\n'
    }

    return text;
}