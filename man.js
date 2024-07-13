if(document.cookie.indexOf("token=")==-1){
    location.href="/";
}
else{
    var token=document.cookie.split("token=")[1].split(";")[0];
    var xhr=new XMLHttpRequest();
    xhr.open("GET",`http://localhost:8080/api/verifyToken?token=${token}`);
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
        var xhr=new XMLHttpRequest();
        xhr.open("POST","http://localhost:8080/api/addGroup");
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
        xhr.open("POST","http://localhost:8080/api/modifyGroup");
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
    showDialog("确认",`确实要删除这个分组吗，分组下的所有友链也将被删除！!（真的很久！）`,()=>{
        var oid=rmg.parentNode.parentNode.getAttribute("oid");
        var xhr=new XMLHttpRequest();
        xhr.open("GET",`http://localhost:8080/api/removeGroup?token=${token}&oid=${oid}`);
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
function removeLink(rml){
    showDialog("确认",`确实要删除这个友链吗？（真的很久！）`,()=>{
        var oid=rml.parentNode.parentNode.getAttribute("oid");
        var xhr=new XMLHttpRequest();
        xhr.open("GET",`http://localhost:8080/api/removeLink?token=${token}&oid=${oid}`);
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
function addLink(adg){
    showDialog("添加友链",`
        <div class="dialog-form">
            <span class="dialog-form-title">分组</span>
            ${adg.parentNode.children[0].innerHTML}
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
            xhr.open("POST",`http://localhost:8080/api/addLink`);
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
                group:adg.parentNode.parentNode.getAttribute("uid"),
                token:token
            }))
        }
    )
}
function addLinkByYAML(adg){
    showDialog("添加友链",`
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
                xhr.open("POST",`http://localhost:8080/api/addLink`);
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
    xhr.open("GET",`http://localhost:8080/api/getGroups?token=${token}`)
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4&&xhr.status==200){
            window.groups=JSON.parse(xhr.responseText).groups;
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
                var lxhr=new XMLHttpRequest();
                lxhr.open("GET",`http://localhost:8080/api/getLinks?token=${token}&group=${window.groups[i].id}`,false)
                lxhr.send();
                if(lxhr.status==200){
                    var links=JSON.parse(lxhr.responseText).links;
                    for(var j=0;j<links.length;j++){
                        var link=document.createElement("div");
                        link.className="link-info";
                        link.setAttribute("oid",links[j].oid);
                        link.innerHTML=`
                            <img class="link-avatar" src="${links[j].avatar}"></img>
                            <a href="${links[j].link}" class="link-name">${links[j].name}</a>
                            <div class="link-color"><div class="color-block" style="background-color:${links[j].color==undefined?"white":links[j].color}"></div>${links[j].color==undefined||links[j].color==''?"暂无颜色":links[j].color}</div>
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
                }
                document.getElementById("main").appendChild(group);
            }
            document.getElementById("main").removeChild(document.getElementById("preload"));
            document.getElementsByClassName("reloadLinks")[0].disabled=false;
        }
    }
    xhr.send();
})();