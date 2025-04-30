
$("#text").keypress(function(e){
    if((e.ctrlKey != (hotkey == "e")) && (e.keyCode == 10 || e.keyCode == 13)){
        $("#" + ((hotkey_for == "decode") ? hotkey_for : "encode")).click();
        return false
    }else if(e.ctrlKey && (e.keyCode == 10 || e.keyCode == 13)){
        $("#text").insertContent("\n");
        return false
    }
    return e
});

config = getCookie("config") || "off";
encoding = getCookie("encoding") || "utf8";
out_en = getCookie("out_en") || "text";
out_de = getCookie("out_de") || "text";
in_en = getCookie("in_en") || "text";
out_de_blank = getCookie("out_de_blank") != "false";
auto = getCookie("auto") || "off";
as = getCookie("as") == "true";
hotkey_for = getCookie("hotkey_for") || "encode";
hotkey = getCookie("hotkey") || "ce";
sym_rep = (getCookie("sym_rep") || "false,false,false,true").split(',');

if(config == "on"){ $("#config_checkbox").parent('label').addClass('active'); $("#config").show(); }
$("#encoding_" + encoding).parent('label').addClass('active');
$("#out_en_" + out_en).parent('label').addClass('active');
$("#out_de_" + out_de).parent('label').addClass('active');
$("#in_en_" + in_en).parent('label').addClass('active');
$("#auto_" + auto).parent('label').addClass('active');
$("#hotkey_" + hotkey).parent('label').addClass('active');
$("#hotkey_for_" + hotkey_for).parent('label').addClass('active');
$("#sym_rep_plus")[0].checked = (sym_rep[0] == 'true');
$("#sym_rep_slash")[0].checked = (sym_rep[1] == 'true');
$("#sym_rep_equal")[0].checked = (sym_rep[2] == 'true');
$("#sym_rep_both")[0].checked = (sym_rep[3] == 'true');
$("#out_de_blank")[0].checked = out_de_blank;
$("#as")[0].checked = as;
$("#sym_rep_plus_text").val(getCookie('sym_rep_plus_text') || "-");
$("#sym_rep_slash_text").val(getCookie('sym_rep_slash_text') || "_");
$("#sym_rep_equal_text").val(getCookie('sym_rep_equal_text') || "");

$("#config_checkbox").change(function(e){
    $("#config_checkbox")[0].checked ? $("#config").show() : $("#config").hide();
    config = $("#config_checkbox")[0].checked ? "on" : "off";
    setCookie('config', config);
});

$(".encoding").change(function(e){
    encoding = $(".encoding:checked").val();
    setCookie('encoding', encoding);
});

$(".out_en").change(function(e){
    out_en = $(".out_en:checked").val();
    setCookie('out_en', out_en);
});

$(".out_de").change(function(e){
    out_de = $(".out_de:checked").val();
    setCookie('out_de', out_de);
});

$(".in_en").change(function(e){
    in_en = $(".in_en:checked").val();
    setCookie('in_en', in_en);
});

$(".auto").change(function(e){
    auto = $(".auto:checked").val();
    setCookie('auto', auto);
});

$(".hotkey").change(function(e){
    hotkey = $(".hotkey:checked").val();
    setCookie('hotkey', hotkey);
    if(hotkey == "ce"){ $("#kbd").html('<kbd>Ctrl</kbd> + <kbd>Enter</kbd>'); }
    if(hotkey == "e"){ $("#kbd").html('<kbd>Enter</kbd>'); }
});
if(hotkey == "ce"){ $("#kbd").html('<kbd>Ctrl</kbd> + <kbd>Enter</kbd>'); }
if(hotkey == "e"){ $("#kbd").html('<kbd>Enter</kbd>'); }

$(".hotkey_for").change(function(e){
    hotkey_for = $(".hotkey_for:checked").val();
    setCookie('hotkey_for', hotkey_for);
    if(hotkey_for == "encode"){ $("#hkf").html('编码'); }
    if(hotkey_for == "decode"){ $("#hkf").html('解码'); }
});
if(hotkey_for == "encode"){ $("#hkf").html('编码'); }
if(hotkey_for == "decode"){ $("#hkf").html('解码'); }

$(".sym_rep").change(function(e){
    setCookie('sym_rep', $("#sym_rep_plus")[0].checked + ',' + $("#sym_rep_slash")[0].checked + ',' + $("#sym_rep_equal")[0].checked + ',' + $("#sym_rep_both")[0].checked);
});

$(".out_de_blank").change(function(e){
    out_de_blank = $("#out_de_blank")[0].checked;
    setCookie('out_de_blank', out_de_blank);
});

$("#as").change(function(e){
    as = $("#as")[0].checked;
    setCookie('as', as);
});

$(".sym_rep_text").change(function(e){
    setCookie(e.target.id, e.target.value);
});

function makeFragment(e, code){
    $(e).prop('outerHTML', '<input id="select" type="text" onfocus="$(this).select();" value="' + 'https://base64.us/#' + code + '">');
    $("#select").focus();
    return false;
}

$("#encode").click(function(e){
    var ori = $("#text").val();
    if(encoding == "gb2312"){
        var res = base64_encode_gb2312(ori);
        var olength = (res.length / 4 * 3 - 2 + (res.substr(-1,1)=="="?0:1) + (res.substr(-2,1)=="="?0:1));
    }else{
        if(in_en != "text"){
            var arr = [];
            if(in_en == "h"){
                ori = ori.replace(/ /, "");
                var len = 0; while(len < ori.length){ arr.push(parseInt(ori.substr(len,2),16)); len+=2; }
            }else if(in_en == "b"){
                ori = ori.replace(/ /, "").replace(/\{/, "").replace(/\}/, "");
                tarr = ori.split(','); var len = 0; while(len < tarr.length){ arr.push(parseInt(tarr[len])); len++; }
            }
            var res = base64_encode(arr, true);
            var olength = arr.length;
        }else{
            var res = base64_encode(ori, false);
            var olength = (res.length / 4 * 3 - 2 + (res.substr(-1,1)=="="?0:1) + (res.substr(-2,1)=="="?0:1));
        }
    }

    var trans = {}; var is_trans = false;
    if($("#sym_rep_plus")[0].checked){ trans['+'] = $("#sym_rep_plus_text").val(); is_trans = true; }
    if($("#sym_rep_slash")[0].checked){ trans['/'] = $("#sym_rep_slash_text").val(); is_trans = true; }
    if($("#sym_rep_equal")[0].checked){ trans['='] = $("#sym_rep_equal_text").val(); is_trans = true; }

    if(is_trans){ res = strtr(res, trans); }

    if(out_en == "urlencode"){ res = encodeURIComponent(res); }
    $("#result").val(res);
    if(as){ $("#result")[0].focus(); $("#result")[0].select(); }
    $("#alert").attr('class', 'alert alert-success').html('编码完毕，原文本字节数：' + olength + '，编码后字节数：' + res.length + '。');
    // if(ori.length < 1000){
    // 	$("#alert").append('<a href="#" onclick="return makeFragment(this, \'e=' + encodeURIComponent(ori) + '\');">生成固定链接</a>');
    // }
});

$("#transFile").click(function(e) {
    var ori = $("#text").val();
    try{
        $('<form action="upload/base64" method="post" style="display:none" ><input type="hidden"  name="base64"  value="'+ori+'"/></form>').appendTo('body').submit();
    } catch (e) {
        console.log(e);
        layer.alert("请传入合法的文件base64！");
    }
});

$("#decode").click(function(e){
    var ori = decodeURIComponent($("#text").val());
    var trans = {}; var is_trans = false;
    var delength = 0;
    if($("#sym_rep_both")[0].checked){
        if($("#sym_rep_plus")[0].checked && $("#sym_rep_plus_text").val()){ trans[$("#sym_rep_plus_text").val()] = "+"; is_trans = true; }
        if($("#sym_rep_slash")[0].checked && $("#sym_rep_slash_text").val()){ trans[$("#sym_rep_slash_text").val()] = "+"; is_trans = true; }
        if($("#sym_rep_equal")[0].checked && $("#sym_rep_equal_text").val()){ trans[$("#sym_rep_equal_text").val()] = "+"; is_trans = true; }
        if(is_trans){ ori = strtr(ori, trans); }
    }
    ori = ori.replace(/\\r\\n/g, "\\n");
    ori = ori.replace(/\\n/g, "\n");
    if(encoding == "gb2312"){
        var res = base64_decode_gb2312(ori);
    }else{
        if(out_de != "text"){
            var res = base64_decode(ori, true, out_de);
            var opt = "";
            delength = res.length;
            if(out_de == "h"){
                for(i in res){ opt+= pad(res[i].toString(16).toUpperCase(),2) + (out_de_blank?" ":""); } res = opt;
            }else if(out_de == "x"){
                for(i in res){ opt+= "\\x" + pad(res[i].toString(16).toUpperCase(),2) + (out_de_blank?" ":""); } res = opt;
            }else if(out_de == "u"){
                for(i in res){ opt+= "\\u" + pad(res[i].toString(16).toUpperCase(),4) + (out_de_blank?" ":""); } res = opt;
            }else if(out_de == "d"){
                for(i in res){ opt+= "&#" + res[i] + ";" + (out_de_blank?" ":""); } res = opt;
            }else if(out_de == "b"){
                res = "{" + res.join(',') + "}";
            }
        }else{
            var res = base64_decode(ori, false, 'text');
        }
    }
    $("#result").val(res);
    if(as){ $("#result")[0].focus(); $("#result")[0].select(); }
    $("#alert").attr('class', 'alert alert-success').html('解码完毕。');
    if(delength > 0){ $("#alert").append('解码后字符数：' + delength + ' 。'); }
    if(ori.length < 1000){
        $("#alert").append('<a href="#" onclick="return makeFragment(this, \'d=' + encodeURIComponent(ori) + '\');">生成固定链接</a>');
    }
});

$("#exchange").click(function(e){
    var t = $("#text").val();
    $("#text").val($("#result").val());
    $("#result").val(t);
});

$('#text').bind('input propertychange', function() {
    if(auto != "off"){ $("#" + auto).click(); }
});

$('#image_input').change(function(e){
    if(typeof(FileReader) === 'undefined'){
        alert('你的浏览器不支持 FileReader ，请更换。');
    }else{
        var FR = new FileReader();
        FR.readAsDataURL(e.target.files[0]);
        FR.onload = function(e){
            $("#result").val(this.result);
            if(as){ $("#result")[0].focus(); $("#result")[0].select(); }
            $("#alert").attr('class', 'alert alert-success').html('读取完毕。');
        }
    }
});

var ex = location.hash.replace(/#/,'').split("=");
if(ex.length >= 2){
    if(ex[0] == "e"){
        $("#text").val(decodeURIComponent(ex[1]));
        $("#encode").click();
    }else if(ex[0] == "d"){
        $("#text").val(decodeURIComponent(ex[1]));
        $("#decode").click();
    }
}

$(function(){ $('[data-toggle="tooltip"]').tooltip({html: true, container: 'body'}); });
$("#me").popover();
