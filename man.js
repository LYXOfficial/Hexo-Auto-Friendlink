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
    xhr.open("GET",`/api/getGroups?token=${token}`)
    xhr.onreadystatechange=function(){
        if(xhr.readyState==4&&xhr.status==200){
            var groups=JSON.parse(xhr.responseText).groups;
            for(var i=0;i<groups.length;i++){
                var group=document.createElement("div");
                group.className="group";
                group.setAttribute("oid",groups[i].oid);
                group.innerHTML=`<div class="group-firstline">
                    <h2 class="group-title">${groups[i].name}</h2>
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
                <div class="group-descr">${groups[i].descr}</div>`
                var lc=document.createElement("div");
                lc.className="links-container";
                group.appendChild(lc);
                var lxhr=new XMLHttpRequest();
                lxhr.open("GET",`/api/getLinks?token=${token}&group=${groups[i].id}`,false)
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
                            <div class="link-color"><div class="color-block" style="background-color:${links[j].color}"></div>${links[j].color}</div>
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