/* Hexo-Auto-FriendLink By Ariasaka v0.1.0
    **这个蒟蒻太菜了快来欺负
    **私活很多自己看（
    **前后端分离了好像有没有分离
    **垃圾py水平的FastAPI后端
    **原生，启动！
    **码风是不是很奇怪呢？
    **QwQ
*/
if(document.cookie.indexOf("token=")==-1){
    location.href="/";
}
else{
    var token=document.cookie.split("token=")[1].split(";")[0];
    var xhr=new XMLHttpRequest();
    xhr.open("GET",`/api/verifyToken?token=${token}`);
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4&&xhr.status==403){
            document.cookie="token=;path=/;max-age=0;expires=0;";
            Snackbar.show({
                text:"登录失效，请重新登录",
                showAction: false,
                pos: "top-center"
            });
            setTimeout(function(){
                location.href="/";
            },1000);
        }
    }
    xhr.send();
}
function closeDialog(){
    document.querySelector("#dialog").className="dialog-mask";
    document.querySelector(".dialog-main").className="dialog-main hide";
}
function showDialog(title,content,callback){
    document.querySelector("#dialogSureBtn").onclick=callback;
    document.querySelector(".dialog-title").innerHTML=title;
    document.querySelector(".dialog-container").innerHTML=content
    document.querySelector("#dialog").className="dialog-mask enable";
    document.querySelector(".dialog-main").className="dialog-main show";
}
function logout(){
    var xhr=new XMLHttpRequest();
    xhr.open("GET",`/api/destroyToken?token=${token}`);
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4&&xhr.status==200){
            Snackbar.show({
                text:"已登出",
                showAction: false,
                pos: "top-center"
            });
            setTimeout(function(){
                document.cookie="token=;path=/;max-age=0;expires=0;";
                location.href="/";
            },1000);
        }
    };
    xhr.send();
}
function copyToClip(content){
    var aux=document.createElement("input"); 
    aux.setAttribute("value", content); 
    document.body.appendChild(aux); 
    aux.select();
    document.execCommand("copy"); 
    document.body.removeChild(aux);
    Snackbar.show({
        text:"复制成功",
        showAction: false,
        pos: "top-center"
    });
}
function copyLink(cpl){
    copyToClip(cpl.parentNode.parentNode.children[1].innerText);
}
function directBuild(){
    var xhr=new XMLHttpRequest();
    xhr.open("GET", `/api/rebuildAction?token=${token}`);
    xhr.onreadystatechange=()=>{
        if(xhr.readyState==4&&xhr.status==200){
            Snackbar.show({
                text:"Action触发成功，请稍等更新",
                showAction: false,
                pos: "top-center"
            });
            return
        }
        else if(xhr.readyState==4){
            Snackbar.show({
                text:"远程部署请求失败",
                showAction: false,
                pos: "top-center"
            });
            return;
        }
    }
    xhr.send();
}
function addGroup(){
    showDialog("新增分组",`<div class="dialog-form">
        <span class="dialog-form-title">名称</span>
        <input type="text" class="dialog-form-input" id="newGroupName" placeholder="请输入分组名称"/>
    </div>
    <div class="dialog-form">
        <span class="dialog-form-title" title="数字小则靠前">序号</span>
        <input type="number" class="dialog-form-input" value=0 id="newGroupIndex"/>
    </div>
    <div class="dialog-form">
        <span class="dialog-form-title">描述</span>
        <textarea class="dialog-form-input" id="newGroupDescr" placeholder="..."></textarea>
    </div>`,()=>{
        if(document.getElementById("newGroupName").value==''){
            Snackbar.show({
                text:"名称不能为空",
                showAction: false,
                pos: "top-center"
            });
            return;
        }
        else if(document.getElementById("newGroupIndex").value==''){
            Snackbar.show({
                text:"序号不能为空",
                showAction: false,
                pos: "top-center"
            });
            return;
        }
        for(var i=0;i<window.groups.length;i++){
            if(window.groups[i].pos==document.getElementById("newGroupIndex").value){
                Snackbar.show({
                    text:"序号不能与当前已有组重复",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
        }
        for(var i=0;i<window.groups.length;i++){
            if(window.groups[i].name==document.getElementById("newGroupName").value){
                Snackbar.show({
                    text:"名称不能与当前已有组重复",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
        }
        var xhr=new XMLHttpRequest();
        xhr.open("POST","/api/addGroup");
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.onreadystatechange=()=>{
            if(xhr.readyState==4&&xhr.status==200){
                closeDialog();
                reloadLinks();
                Snackbar.show({
                    text:"添加成功",
                    showAction: false,
                    pos: "top-center"
                });
            }
            else if(xhr.readyState==4){
                Snackbar.show({
                    text:"添加失败",
                    showAction: false,
                    pos: "top-center"
                });
            }
        }
        xhr.send(JSON.stringify({
            name:document.getElementById("newGroupName").value,
            pos:document.getElementById("newGroupIndex").value,
            descr:document.getElementById("newGroupDescr").value,
            token:token
        }));
    });
}
function editGroup(edg){
    showDialog("编辑分组",`<div class="dialog-form">
            <span class="dialog-form-title">名称</span>
            <input type="text" class="dialog-form-input" id="newGroupName" value="${edg.parentNode.children[0].innerHTML}" placeholder="请输入分组名称"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title" title="数字小则靠前">序号</span>
            <input type="number" class="dialog-form-input" value=${edg.parentNode.parentNode.getAttribute("pos")} id="newGroupIndex"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">描述</span>
            <textarea class="dialog-form-input" id="newGroupDescr" placeholder="...">${edg.parentNode.parentNode.children[1].innerHTML}</textarea>
        </div>`,()=>{
        if(document.getElementById("newGroupName").value==''){
            Snackbar.show({
                text:"名称不能为空",
                showAction: false,
                pos: "top-center"
            });
            return;
        }
        else if(document.getElementById("newGroupIndex").value==''){
            Snackbar.show({
                text:"序号不能为空",
                showAction: false,
                pos: "top-center"
            });
            return;
        }
        for(var i=0;i<window.groups.length;i++){
            if(window.groups[i].pos==document.getElementById("newGroupIndex").value
                &&window.groups[i].oid!=edg.parentNode.parentNode.getAttribute("oid")){
                Snackbar.show({
                    text:"序号不能与当前已有组重复",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
        }
        var xhr=new XMLHttpRequest();
        xhr.open("POST","/api/modifyGroup");
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.onreadystatechange=()=>{
            if(xhr.readyState==4&&xhr.status==200){
                closeDialog();
                reloadLinks();
                Snackbar.show({
                    text:"修改成功",
                    showAction: false,
                    pos: "top-center"
                });
            }
            else if(xhr.readyState==4){
                Snackbar.show({
                    text:"修改失败",
                    showAction: false,
                    pos: "top-center"
                });
            }
        }
        xhr.send(JSON.stringify({
            name:document.getElementById("newGroupName").value,
            pos:document.getElementById("newGroupIndex").value,
            descr:document.getElementById("newGroupDescr").value,
            oid:edg.parentNode.parentNode.getAttribute("oid"),
            token:token
        }));
    });
}
function removeGroup(rmg){
    showDialog("确认",`确实要删除这个分组吗，分组下的所有友链也将被删除！!（真的很久！）`,async ()=>{
        var oid=rmg.parentNode.parentNode.getAttribute("oid");
        Snackbar.show({
            text:"删除中...可能需要花费几分钟的时间，请坐和放宽",
            showAction: false,
            pos: "top-center",
            duration: "1200000"
        });
        for(var i=1;i<=20;i++){
            try{
                var suc=await new Promise((resolve,reject)=>{
                    var xhr=new XMLHttpRequest();
                    xhr.open("GET",`/api/removeGroup?token=${token}&oid=${oid}`);
                    xhr.setRequestHeader("Content-Type","application/json");
                    xhr.onreadystatechange=()=>{
                        if(xhr.readyState==4&&xhr.status==200)
                            resolve(true);
                        else if(xhr.readyState==4&&xhr.status==504)
                            resolve(false);
                        else if(xhr.readyState==4)
                            reject();
                    }
                    xhr.send();
                });
                if(suc){
                    closeDialog();
                    reloadLinks();
                    Snackbar.show({
                        text:"删除成功",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
            }
            catch(e){
                Snackbar.show({
                    text:"删除失败",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
        }
    });
}
function removeLink(rml){
    showDialog("确认",`确实要删除这个友链吗？（真的很久！）`,()=>{
        var oid=rml.parentNode.parentNode.getAttribute("oid");
        var xhr=new XMLHttpRequest();
        xhr.open("GET",`/api/removeLink?token=${token}&oid=${oid}`);
        xhr.setRequestHeader("Content-Type","application/json");
        xhr.onreadystatechange=()=>{
            if(xhr.readyState==4&&xhr.status==200){
                closeDialog();
                reloadLinks();
                Snackbar.show({
                    text:"删除成功",
                    showAction: false,
                    pos: "top-center"
                });
            }
            else if(xhr.readyState==4){
                Snackbar.show({
                    text:"删除失败",
                    showAction: false,
                    pos: "top-center"
                });
            }
        }
        xhr.send();
    });
}
function addLink(adl){
    showDialog("添加友链",`
        <div class="dialog-form">
            <span class="dialog-form-title">分组</span>
            ${adl.parentNode.children[0].innerHTML}
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">名称</span>
            <input type="text" class="dialog-form-input" id="newLinkName" placeholder="请输入友链名称"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">网址</span>
            <input type="text" class="dialog-form-input" id="newLink" placeholder="请输入友链网址【http(s)】"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">头像</span>
            <input type="text" class="dialog-form-input" id="newLinkAvatar" placeholder="请输入友链头像【http(s)】"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">颜色</span>
            <input type="text" class="dialog-form-input" id="newLinkColor" placeholder="请输入友链显示颜色"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">描述</span>
            <textarea class="dialog-form-input" id="newLinkDescr" placeholder="..."></textarea>
        </div>`,()=>{
            if(document.getElementById("newLinkName").value==''){
                Snackbar.show({
                    text:"名称不能为空",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            else if(document.getElementById("newLink").value==''){
                Snackbar.show({
                    text:"网址不能为空",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            else if(document.getElementById("newLinkAvatar").value==''){
                Snackbar.show({
                    text:"头像不能为空",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            try{
                if(document.getElementById("newLink").value.indexOf("https://")==-1&&document.getElementById("newLink").value.indexOf("http://")==-1)
                    throw error;
                new URL(document.getElementById("newLink").value);
            }
            catch(err){
                Snackbar.show({
                    text:"网址格式不正确",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            try{
                if(document.getElementById("newLinkAvatar").value.indexOf("https://")==-1&&document.getElementById("newLinkAvatar").value.indexOf("http://")==-1)
                    throw error;
                new URL(document.getElementById("newLinkAvatar").value);
            }
            catch(err){
                Snackbar.show({
                    text:"头像格式不正确",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            var xhr=new XMLHttpRequest();
            xhr.open("POST",`/api/addLink`);
            xhr.setRequestHeader("Content-Type","application/json");
            xhr.onreadystatechange=()=>{
                if(xhr.readyState==4&&xhr.status==200){
                    closeDialog();
                    reloadLinks();
                    Snackbar.show({
                        text:"添加成功",
                        showAction: false,
                        pos: "top-center"
                    });
                }
                else if(xhr.readyState==4){
                    Snackbar.show({
                        text:"添加失败",
                        showAction: false,
                        pos: "top-center"
                    });
                }
            };
            xhr.send(JSON.stringify({
                name:document.getElementById("newLinkName").value,
                link:document.getElementById("newLink").value,
                avatar:document.getElementById("newLinkAvatar").value,
                color:document.getElementById("newLinkColor").value,
                descr:document.getElementById("newLinkDescr").value,
                group:adl.parentNode.parentNode.getAttribute("uid"),
                token:token
            }))
        }
    )
}
function editLink(edl){
    showDialog("编辑友链",`
        <div class="dialog-form">
            <span class="dialog-form-title">分组</span>
            <select id="newLinkGroup" class="dialog-form-input"></select>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">名称</span>
            <input type="text" class="dialog-form-input" id="newLinkName" value="${edl.parentNode.parentNode.children[1].innerHTML}" placeholder="请输入友链名称"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">网址</span>
            <input type="text" class="dialog-form-input" id="newLink" value="${edl.parentNode.parentNode.children[1].href}" placeholder="请输入友链网址【http(s)】"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">头像</span>
            <input type="text" class="dialog-form-input" id="newLinkAvatar" value="${edl.parentNode.parentNode.children[0].src}" placeholder="请输入友链头像【http(s)】"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">颜色</span>
            <input type="text" class="dialog-form-input" id="newLinkColor" value="${edl.parentNode.parentNode.children[2].innerText}" placeholder="请输入友链显示颜色"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">描述</span>
            <textarea class="dialog-form-input" id="newLinkDescr" placeholder="...">${edl.parentNode.parentNode.children[4].innerText}</textarea>
        </div>`,()=>{
            if(document.getElementById("newLinkName").value==''){
                Snackbar.show({
                    text:"名称不能为空",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            else if(document.getElementById("newLink").value==''){
                Snackbar.show({
                    text:"网址不能为空",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            else if(document.getElementById("newLinkAvatar").value==''){
                Snackbar.show({
                    text:"头像不能为空",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            try{
                if(document.getElementById("newLink").value.indexOf("https://")==-1&&document.getElementById("newLink").value.indexOf("http://")==-1)
                    throw error;
                new URL(document.getElementById("newLink").value);
            }
            catch(err){
                Snackbar.show({
                    text:"网址格式不正确",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            try{
                if(document.getElementById("newLinkAvatar").value.indexOf("https://")==-1&&document.getElementById("newLinkAvatar").value.indexOf("http://")==-1)
                    throw error;
                new URL(document.getElementById("newLinkAvatar").value);
            }
            catch(err){
                Snackbar.show({
                    text:"头像格式不正确",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
            var xhr=new XMLHttpRequest();
            xhr.open("POST",`/api/modifyLink`);
            xhr.setRequestHeader("Content-Type","application/json");
            xhr.onreadystatechange=()=>{
                if(xhr.readyState==4&&xhr.status==200){
                    closeDialog();
                    reloadLinks();
                    Snackbar.show({
                        text:"修改成功",
                        showAction: false,
                        pos: "top-center"
                    });
                }
                else if(xhr.readyState==4){
                    Snackbar.show({
                        text:"修改失败",
                        showAction: false,
                        pos: "top-center"
                    });
                }
            };
            var sld=document.getElementById("newLinkGroup");
            var idx=sld.selectedIndex;
            var group=sld.options[idx].value;
            xhr.send(JSON.stringify({
                name:document.getElementById("newLinkName").value,
                link:document.getElementById("newLink").value,
                avatar:document.getElementById("newLinkAvatar").value,
                color:document.getElementById("newLinkColor").value,
                descr:document.getElementById("newLinkDescr").value,
                group:group,
                oid:edl.parentNode.parentNode.getAttribute("oid"),
                token:token
            }))
        }
    );
    var gs=document.querySelector("#newLinkGroup");
    for(var i=0;i<window.groups.length;i++){
        var gr=document.createElement("option");
        gr.text=window.groups[i].name;
        gr.value=window.groups[i].id;
        if(edl.parentNode.parentNode.parentNode.parentNode.getAttribute("uid")==gr.value)
            gr.selected=true;
        gs.appendChild(gr);
    }
}
function addLinkByYAML(adg){
    showDialog("从Butterfly YAML添加单个友链",`
        <div class="dialog-form">
            <span class="dialog-form-title">分组</span>
            ${adg.parentNode.children[0].innerHTML}
        </div>
        <pre id="dialog-yamleditor-container"></pre>`,()=>{
            try{
                var yaml=jsyaml.load(editor.getValue());
                if(yaml.length>1){
                    Snackbar.show({
                        text:"YAML格式不正确",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
                if(yaml[0].constructor!=Object){
                    Snackbar.show({
                        text:"YAML格式不正确",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
                if(yaml[0].name==undefined||yaml[0].name==''){
                    Snackbar.show({
                        text:"请填写名称",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
                if(yaml[0].link==undefined||yaml[0].link==''){
                    Snackbar.show({
                        text:"请填写链接",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
                if(yaml[0].avatar==undefined||yaml[0].avatar==''){
                    Snackbar.show({
                        text:"请填写头像",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
                try{
                    if(yaml[0].link.indexOf("https://")==-1&&yaml[0].link.indexOf("http://")==-1)
                        throw error;
                    new URL(yaml[0].link);
                }
                catch(err){
                    Snackbar.show({
                        text:"网址格式不正确",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
                try{
                    if(yaml[0].avatar.indexOf("https://")==-1&&yaml[0].avatar.indexOf("http://")==-1)
                        throw error;
                    new URL(yaml[0].avatar);
                }
                catch(err){
                    Snackbar.show({
                        text:"头像格式不正确",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
                var xhr=new XMLHttpRequest();
                xhr.open("POST",`/api/addLink`);
                xhr.setRequestHeader("Content-Type","application/json");
                xhr.onreadystatechange=()=>{
                    if(xhr.readyState==4&&xhr.status==200){
                        closeDialog();
                        reloadLinks();
                        Snackbar.show({
                            text:"添加成功",
                            showAction: false,
                            pos: "top-center"
                        });
                    }
                    else if(xhr.readyState==4){
                        Snackbar.show({
                            text:"添加失败",
                            showAction: false,
                            pos: "top-center"
                        });
                    }
                };
                xhr.send(JSON.stringify({
                    name:yaml[0].name,
                    link:yaml[0].link,
                    avatar:yaml[0].avatar,
                    color:yaml[0].theme_color,
                    descr:yaml[0].descr,
                    group:adg.parentNode.parentNode.getAttribute("uid"),
                    token:token
                }))
            }
            catch(e){
                Snackbar.show({
                    text:"YAML格式不正确",
                    showAction: false,
                    pos: "top-center"
                });
                return;
            }
        }
    );
    var editor=ace.edit("dialog-yamleditor-container");
    editor.setReadOnly(false);
    editor.setFontSize(15);
    editor.setOption("wrap", "free");
    editor.session.setMode("ace/mode/yaml");      
}
function importLinks(){
    showDialog("从Butterfly YAML批量导入友链",`
        若有分组名称重合将合并原组与新组并保留原组描述，不会覆盖重合的友链信息，防止出现问题。
        <div class="dialog-form">
            <input type="checkbox" id="dialog-yamleditor-import-override">清空已存在的友链及分组（建议）
        </div>
        <pre id="dialog-yamleditor-container"></pre>`,async ()=>{
            try{
                var yaml=jsyaml.load(editor.getValue());
                for(var i=0;i<yaml.length;i++){
                    if(yaml[i].constructor!=Object){
                        Snackbar.show({
                            text:"YAML格式不正确",
                            showAction: false,
                            pos: "top-center"
                        });
                        return;
                    }
                    if(yaml[i].class_name==''||yaml[i].class_name==undefined){
                        Snackbar.show({
                            text:"有一个分组缺少名称",
                            showAction: false,
                            pos: "top-center"
                        });
                        return;
                    }
                    if(yaml[i].link_list==undefined)
                        yaml[i].link_list=[];
                    for(var j=0;j<yaml[i].link_list.length;j++){
                        if(yaml[i].link_list[j].constructor!=Object){
                            Snackbar.show({
                                text:"YAML格式不正确",
                                showAction: false,
                                pos: "top-center"
                            });
                            return;
                        }
                        if(yaml[i].link_list[j].name==undefined||yaml[i].link_list[j].name==''){
                            if(yaml[i].link_list[j].link!=undefined&&yaml[i].link_list[j].link!=''){
                                Snackbar.show({
                                    text:`${yaml[i].link_list[j].link}缺少名称`,
                                    showAction: false,
                                    pos: "top-center"
                                });
                                return;
                            }
                            Snackbar.show({
                                text:"有一个友链缺少名称",
                                showAction: false,
                                pos: "top-center"
                            });
                            return;
                        }
                        if(yaml[i].link_list[j].link==undefined||yaml[i].link_list[j].link==''){
                            Snackbar.show({
                                text:`${yaml[i].link_list[j].name}缺少网址`,
                                showAction: false,
                                pos: "top-center"
                            });
                            return;
                        }
                        if(yaml[i].link_list[j].avatar==undefined||yaml[i].link_list[j].avatar==''){
                            Snackbar.show({
                                text:`${yaml[i].link_list[j].name}缺少头像`,
                                showAction: false,
                                pos: "top-center"
                            });
                            return;
                        }
                        try{
                            if(yaml[i].link_list[j].link.indexOf("https://")==-1&&yaml[i].link_list[j].link.indexOf("http://")==-1)
                                throw error;
                            new URL(yaml[i].link_list[j].link);
                        }
                        catch(err){
                            Snackbar.show({
                                text:`${yaml[i].link_list[j].name}网址格式不正确`,
                                showAction: false,
                                pos: "top-center"
                            });
                            return;
                        }
                        try{
                            if(yaml[i].link_list[j].avatar.indexOf("https://")==-1&&yaml[i].link_list[j].avatar.indexOf("http://")==-1)
                                throw error;
                            new URL(yaml[i].link_list[j].avatar);
                        }
                        catch(err){
                            Snackbar.show({
                                text:`${yaml[i].link_list[j].name}头像格式不正确`,
                                showAction: false,
                                pos: "top-center"
                            });
                            return;
                        }
                    }
                }
                Snackbar.show({
                    text:`导入中... 这可能需要几分钟，坐和放宽`,
                    showAction: false,
                    pos: "top-center",
                    duration: '12000000',
                });
                document.querySelector("#dialogSureBtn").disabled=true;
                if(document.getElementById("dialog-yamleditor-import-override").checked){
                    for(var i=0;i<window.groups.length;i++){
                        try{
                            document.querySelector(".snackbar-container").innerHTML=`
                            <p style="margin: 0px; padding: 0px; color: rgb(255, 255, 255); font-size: 14px; font-weight: 300; line-height: 1em;">
                            导入中... 这可能需要几分钟，坐和放宽
                            <br/>
                            <span class="snackbar-2ndline">删除分组：${window.groups[i].name}</span>
                            </p>`
                        }
                        catch(e){}
                        for(var j=1;j<=20;j++){
                            var st=await new Promise((resolve,reject)=>{
                                var xhr=new XMLHttpRequest();
                                xhr.open("GET",`/api/removeGroup?token=${token}&oid=${window.groups[i].oid}`);
                                xhr.onload=()=>{
                                    if(xhr.status==200)
                                        resolve("ok");
                                    else if(xhr.status==504)
                                        resolve("timeout");
                                    else reject();
                                }
                                xhr.onerror=()=>{
                                    if(xhr.status==504)
                                        resolve("timeout");
                                    else reject();
                                }
                                xhr.send();
                            });
                            if(st!="timeout") break;
                        }
                    }
                    window.groups=[];
                }
                var maxpos=-0x7fffffff;
                for(var i=0;i<yaml.length;i++){
                    var ngid=undefined;
                    for(var j=0;j<window.groups.length;j++){
                        if(yaml[i].class_name==window.groups[j].name){
                            var ngid=window.groups[j].id;
                            maxpos=Math.max(window.groups[j].pos,maxpos);
                        }
                    }
                    if(maxpos==-0x7fffffff) maxpos=0;
                    else maxpos++;
                    if(yaml[i].class_desc==undefined)
                        yaml[i].class_desc='';
                    if(ngid==undefined){
                        try{
                            document.querySelector(".snackbar-container").innerHTML=`
                            <p style="margin: 0px; padding: 0px; color: rgb(255, 255, 255); font-size: 14px; font-weight: 300; line-height: 1em;">
                            导入中... 这可能需要几分钟，坐和放宽
                            <br/>
                            <span class="snackbar-2ndline">新增分组：${yaml[i].class_name}</span>
                            </p>`
                        }
                        catch(e){}
                        var ngid=await new Promise((resolve,reject)=>{
                            var xhr=new XMLHttpRequest();
                            xhr.open("POST",`/api/addGroup`);
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.onload=()=>{
                                if(xhr.status==200)
                                    resolve(JSON.parse(xhr.responseText).groupinfo.id);
                                else reject();
                            }
                            xhr.onerror=()=>{
                                reject();
                            }
                            xhr.send(JSON.stringify({
                                token: token,
                                pos: maxpos,
                                name: yaml[i].class_name,
                                descr: yaml[i].class_desc
                            }));
                        });
                    }
                    for(var j=0;j<yaml[i].link_list.length;j++){
                        try{
                            document.querySelector(".snackbar-container").innerHTML=`
                            <p style="margin: 0px; padding: 0px; color: rgb(255, 255, 255); font-size: 14px; font-weight: 300; line-height: 1em;">
                            导入中... 这可能需要几分钟，坐和放宽
                            <br/>
                            <span class="snackbar-2ndline">导入友链：${yaml[i].link_list[j].name}（${j+1}/${yaml[i].link_list.length}）</span>
                            </p>`
                        }
                        catch(e){}
                        await new Promise((resolve,reject)=>{
                            var xhr=new XMLHttpRequest();
                            xhr.open("POST",`/api/addLink`);
                            xhr.setRequestHeader('Content-Type', 'application/json');
                            xhr.onload=()=>{
                                if(xhr.status==200) resolve();
                                else reject();
                            }
                            xhr.onerror=()=>{
                                reject();
                            }
                            if(yaml[i].link_list[j].theme_color==''||yaml[i].link_list[j].theme_color==undefined)
                                xhr.send(JSON.stringify({
                                    token: token,
                                    name: yaml[i].link_list[j].name,
                                    descr: yaml[i].link_list[j].descr,
                                    link: yaml[i].link_list[j].link,
                                    avatar: yaml[i].link_list[j].avatar,
                                    group: ngid
                                }));
                            else xhr.send(JSON.stringify({
                                token: token,
                                name: yaml[i].link_list[j].name,
                                descr: yaml[i].link_list[j].descr,
                                color: yaml[i].link_list[j].theme_color,
                                link: yaml[i].link_list[j].link,
                                avatar: yaml[i].link_list[j].avatar,
                                group: ngid
                            }));
                        });
                    }
                }
                document.querySelector("#dialogSureBtn").disabled=false;
                closeDialog();
                reloadLinks();
                Snackbar.show({
                    text:"导入成功",
                    showAction: false,
                    pos: "top-center"
                });
            }
            catch(e){
                try{
                    if(e.name=="YAMLException"){
                        document.querySelector("#dialogSureBtn").disabled=false;
                        Snackbar.show({
                            text:"YAML格式不正确",
                            showAction: false,
                            pos: "top-center"
                        });
                        return;
                    }
                    else{
                        document.querySelector("#dialogSureBtn").disabled=false;
                        closeDialog();
                        reloadLinks();
                        Snackbar.show({
                            text:"导入出错，请检查",
                            showAction: false,
                            pos: "top-center"
                        });
                        return;
                    }
                }
                catch(e){
                    document.querySelector("#dialogSureBtn").disabled=false;
                    closeDialog();
                    reloadLinks();
                    Snackbar.show({
                        text:"导入出错，请检查",
                        showAction: false,
                        pos: "top-center"
                    });
                    return;
                }
            }
        }
    );
    var editor=ace.edit("dialog-yamleditor-container");
    editor.setReadOnly(false);
    editor.setFontSize(15);
    editor.session.setMode("ace/mode/yaml");      
}

(reloadLinks=()=>{
    document.getElementsByClassName("reloadLinks")[0].disabled=true;
    var rl=document.getElementsByClassName("group");
    var xi=rl.length;
    for(var i=0;i<xi;i++){
        document.getElementById("main").removeChild(rl[0]);
    }
    ldb=document.createElement("div");
    ldb.id="preload";
    ldb.innerHTML="<br>加载中...";
    document.getElementById("main").appendChild(ldb);
    var xhr=new XMLHttpRequest();
    xhr.open("GET",`/api/getGroups`)
    xhr.onreadystatechange=async ()=>{
        if(xhr.readyState==4&&xhr.status==200){
            window.groups=JSON.parse(xhr.responseText).groups;
            var gps=[]
            for(var i=0;i<window.groups.length;i++){
                var group=document.createElement("div");
                group.className="group";
                group.setAttribute("oid",window.groups[i].oid);
                group.setAttribute("pos",window.groups[i].pos);
                group.setAttribute("uid",window.groups[i].id);
                group.innerHTML=`<div class="group-firstline">
                    <h2 class="group-title">${window.groups[i].name}</h2>
                    <button class="mini-btn editGroup" onclick="editGroup(this);" title="编辑该分组">
                        <i class="fa fa-edit"></i>
                    </button>
                    <button class="mini-btn removeGroup" onclick="removeGroup(this);" title="删除该分组">
                        <i class="fa fa-trash-alt"></i>
                    </button>
                    <button class="mini-btn addGroup" onclick="addLink(this);" title="添加友链">
                        <i class="fa fa-plus"></i>
                    </button>
                    <button class="mini-btn addGroup" onclick="addLinkByYAML(this);" title="从Butterfly YAML添加单个友链">
                        <i class="fa fa-file-alt"></i>
                    </button>
                </div>
                <div class="group-descr">${window.groups[i].descr}</div>`
                var lc=document.createElement("div");
                lc.className="links-container";
                group.appendChild(lc);
                var links=JSON.parse(await new Promise((resolve)=>{
                    var lxhr=new XMLHttpRequest();
                    lxhr.open("GET",`/api/getLinks?group=${window.groups[i].id}`)
                    lxhr.onload=function(){
                        if(lxhr.status==200)
                            resolve(lxhr.responseText);
                    }
                    lxhr.send();
                })).links;
                for(var j=0;j<links.length;j++){
                    var link=document.createElement("div");
                    link.className="link-info";
                    link.setAttribute("oid",links[j].oid);
                    link.innerHTML=`
                        <img class="link-avatar" src="${links[j].avatar}" onerror="this.onerror=null,this.src='https://bu.dusays.com/2024/07/07/668a8ffdacde3.png'"></img>
                        <a target="_blank" href="${links[j].link}" class="link-name">${links[j].name}</a>
                        <div class="link-color"><div class="color-block" style="background-color:${links[j].color==undefined?"#888888bb":links[j].color}"></div>${links[j].color==undefined||links[j].color==''?"暂无颜色":links[j].color}</div>
                        <div class="link-buttons">
                            <button class="mini-btn editLink" onclick="editLink(this);" title="编辑该友链">
                                <i class="fa fa-edit"></i>
                            </button>
                            <button class="mini-btn copyLink" onclick="copyLink(this);" title="复制链接">
                                <i class="fa fa-link"></i>
                            </button>
                            <button class="mini-btn removeLink" onclick="removeLink(this);" title="删除该友链">
                                <i class="fa fa-trash-alt"></i>
                            </button>
                        </div>
                        <div class="link-descr">${links[j].descr}</div>`
                    lc.appendChild(link);
                }
                gps.push(group);
            }
            for(var i=0;i<gps.length;i++)
                document.getElementById("main").appendChild(gps[i]);
            document.getElementById("main").removeChild(document.getElementById("preload"));
            document.getElementsByClassName("reloadLinks")[0].disabled=false;
        }
    }
    xhr.send();
    var xhr2=new XMLHttpRequest();
    xhr2.open("GET","https://blog.yaria.top/updateTime")
    xhr2.onreadystatechange=function(){
        if(xhr2.readyState==4&&xhr2.status==200)
            document.querySelector(".blog-updated").innerText=xhr2.responseText;
    }
    xhr2.send();
})();