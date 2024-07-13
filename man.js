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
function addLink(adg){
    showDialog("添加友链",`<div class="dialog-form">
            <span class="dialog-form-title">名称</span>
            <input type="text" class="dialog-form-input" id="newLinkName" value="${edg.parentNode.children[0].innerHTML}" placeholder="请输入分组名称"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">网址</span>
            <input type="text" class="dialog-form-input" id="newLink" value="${edg.parentNode.children[0].innerHTML}" placeholder="请输入分组名称"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">头像</span>
            <input type="text" class="dialog-form-input" id="newLinkAvatar" value="${edg.parentNode.children[0].innerHTML}" placeholder="请输入分组名称"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">测试</span>
            <input type="text" class="dialog-form-input" id="newLinkAvatar" value="${edg.parentNode.children[0].innerHTML}" placeholder="请输入分组名称"/>
        </div>
        <div class="dialog-form">
            <span class="dialog-form-title">描述</span>
            <textarea class="dialog-form-input" id="newLinkDescr" placeholder="...">${edg.parentNode.parentNode.children[1].innerHTML}</textarea>
        </div>`,()=>{

        }
    )
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
                            <div class="link-color"><div class="color-block" style="background-color:${links[j].color==undefined?"white":links[j].color}"></div>${links[j].color==undefined?"暂无颜色":links[j].color}</div>
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